# Splitt. Scale Risk Audit & Worst-Case Scenario Analysis

**Date:** March 10, 2026
**Updated:** March 11, 2026
**Auditor:** Claude (Deep Code Review)
**Scope:** Full backend codebase audit — webhook, charge service, split engine, rule engine, rewards optimizer, middleware, API routes, configs, database schema
**Goal:** Identify every failure mode at 10 / 100 / 1K / 10K / 100K / 1M+ users and provide concrete fixes

---

## IMPLEMENTATION STATUS

| # | Issue | Severity | Status | Fixed In |
|---|-------|----------|--------|----------|
| 1 | Duplicate Webhook Processing | CRITICAL | ✅ FIXED | webhook.js — idempotency check + UNIQUE DB constraint |
| 2 | Approve-Everything Policy | CRITICAL | ✅ FIXED | webhook.js — pre-approval checks (card, PMs, tier limit) |
| 3 | No Retry Worker | CRITICAL | ✅ FIXED | index.js — 60s cron processes retry_pending transactions |
| 4 | splits_used Race Condition | CRITICAL | ✅ FIXED | migration_010 RPC + chargeService.js atomic increment |
| 5 | No Spend Limits | CRITICAL | ✅ FIXED | issuing.js — MONTHLY limits by tier ($1.5K/$5K/$25K) |
| 6 | No Chargeback Handler | CRITICAL | ✅ FIXED | webhook.js — /webhook/stripe-payments dispute handler |
| 7 | No Refund Flow | CRITICAL | ✅ FIXED | webhook.js — /webhook/lithic-refund proportional refunds |
| 8 | In-Memory Rate Limiting | HIGH | ⏳ Phase 2 | Needs Redis |
| 9 | Header-Based Auth (No JWT) | HIGH | ⏳ Phase 2 | Needs Supabase JWT verification |
| 10 | No Database Indexes | HIGH | ✅ FIXED | migration_010_critical_fixes.sql |
| 11 | Single Supabase Client | HIGH | ⏳ Phase 2 | Needs connection pooling |
| 12 | No Monthly Reset Cron | HIGH | ✅ FIXED | index.js — scheduleMonthlyResetCron() |
| 13 | Hold Expiration Race | HIGH | ⏳ Phase 2 | Needs parallel hold placement |
| 14 | Signature Bypass | HIGH | ✅ FIXED | webhook.js — rejects failed signatures in production |
| 15 | Card Details PAN Leak | HIGH | ⏳ Phase 2 | Needs re-auth gate |
| 16-24 | Medium severity | MEDIUM | ⏳ Phase 2 | See details below |

**Summary:** 10 of 24 issues fixed (all 7 critical + 3 high). 14 remaining for Phase 2.

---

## CRITICAL SEVERITY (Transaction-Breaking, Money-Losing)

### 1. ✅ FIXED — Race Condition: Duplicate Webhook Processing

**What happens:** Lithic may send the same authorization event multiple times (retries, network glitches). The webhook handler has zero idempotency protection — it will process the same authorization twice, creating duplicate `split_transactions` rows and charging user cards double.

**Scale trigger:** 10+ users (happens on first network hiccup)

**Where:** `webhook.js` line 116 — `processLithicAuthorizationAsync()` has no deduplication check.

**Worst case:** User taps card at Starbucks for $5.00. Lithic retries the webhook. Backend creates two transactions and charges their Visa $3.50 twice and their Amex $1.50 twice. User sees $10.00 in charges for a $5.00 coffee.

**Fix:**
```javascript
// At the start of processLithicAuthorizationAsync():
// Check if this authorization token has already been processed
const { data: existingTx } = await supabase
  .from('split_transactions')
  .select('id, status')
  .eq('lithic_authorization_token', authorizationToken)
  .single();

if (existingTx) {
  console.log(`[async] Authorization ${authorizationToken} already processed (tx: ${existingTx.id}, status: ${existingTx.status}) — skipping duplicate`);
  return;
}
```
Also add a UNIQUE constraint on `split_transactions.lithic_authorization_token` in the database to catch any remaining race conditions at the DB level.

---

### 2. ✅ FIXED — Approve-Everything Policy Creates Unlimited Liability

**What happens:** The webhook ALWAYS returns `{ result: "APPROVED" }` regardless of whether the user exists, has valid cards, or has a split rule. If async processing fails (card lookup fails, no split rule, all cards decline), the Lithic transaction is already approved but no secondary cards are charged. Splitt absorbs the full loss.

**Scale trigger:** 10+ users (any failed async processing)

**Where:** `webhook.js` lines 103-113 — unconditional APPROVED response.

**Worst case at 100K users:** A user with no valid linked cards taps their Splitt card for $5,000. Approved instantly. Async processing finds no cards to charge. The $5,000 settles on Splitt's Lithic account. Splitt eats the loss. Multiply by bad actors who discover this pattern.

**Fix:**
```javascript
// Before approving, do a quick pre-check (must complete in <500ms):
const { data: cardCheck } = await supabase
  .from('issued_cards')
  .select('user_id, status')
  .eq('lithic_card_token', cardToken)
  .eq('status', 'active')
  .single();

if (!cardCheck) {
  console.log(`[webhook] DECLINED — card ${cardToken} not found or inactive`);
  return res.status(200).json({ result: 'DECLINED', token: authorizationToken });
}

// Also check that the user has at least one linked payment method
const { count } = await supabase
  .from('linked_payment_methods')
  .select('id', { count: 'exact', head: true })
  .eq('user_id', cardCheck.user_id);

if (!count || count === 0) {
  console.log(`[webhook] DECLINED — user ${cardCheck.user_id} has no linked cards`);
  return res.status(200).json({ result: 'DECLINED', token: authorizationToken });
}
```
Add a Redis/in-memory cache for card lookups to keep this under 100ms. The "approve on catch" philosophy should only apply to backend bugs, not to missing user data.

---

### 3. ✅ FIXED — No Retry Worker — Failed Transactions Are Abandoned

**What happens:** `chargeService.js` queues retries by setting `next_retry_at` and `retry_count` on the transaction row (lines 407-455), but there is no cron job, worker, or scheduler that actually picks up these transactions and re-executes them. They sit in `retry_pending` status forever.

**Scale trigger:** 10+ users (first declined card)

**Where:** `chargeService.js` line 407 — `queueRetry()` sets fields but nothing reads them.

**Worst case:** User's card temporarily declines (daily limit, bank hold). Transaction is approved on Lithic side but marked `retry_pending`. Nobody retries it. Splitt covers the $200 purchase indefinitely.

**Fix:** Add a cron job in `index.js`:
```javascript
// Every 60 seconds, check for retry_pending transactions
setInterval(async () => {
  const now = new Date().toISOString();
  const { data: pendingRetries } = await supabase
    .from('split_transactions')
    .select('id, user_id, total_amount_cents, merchant_name, routing_method')
    .eq('status', 'retry_pending')
    .lte('next_retry_at', now)
    .limit(10); // Process 10 at a time

  for (const tx of (pendingRetries || [])) {
    // Re-run the charge flow for this transaction
    // ... (rebuild charge instructions from the original routing)
  }
}, 60_000);
```

---

### 4. ✅ FIXED — splits_used_this_month Race Condition (Free Tier Bypass)

**What happens:** The webhook checks `splits_used_this_month` with a SELECT, then increments it after charges complete. If a free-tier user makes two rapid purchases (within seconds), both webhooks read `splits_used: 2` (under the limit of 3), both proceed, and the user gets 4 splits instead of 3.

**Scale trigger:** 100+ users (any free user who taps twice quickly)

**Where:** `webhook.js` lines 163-179 (check) and `chargeService.js` lines 591-617 (increment). The check and increment are not atomic.

**Worst case:** Free users discover they can bypass the limit by tapping quickly. At scale, this means free users consume unlimited splits, costing Splitt money on Stripe fees with no subscription revenue.

**Fix:** Use `SELECT ... FOR UPDATE` or an atomic RPC:
```sql
-- Create an RPC that atomically checks AND increments
CREATE OR REPLACE FUNCTION check_and_increment_splits(
  p_user_id UUID,
  p_limit INT
) RETURNS BOOLEAN AS $$
DECLARE
  current_count INT;
BEGIN
  SELECT splits_used_this_month INTO current_count
  FROM users WHERE id = p_user_id FOR UPDATE;

  IF current_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  UPDATE users SET splits_used_this_month = current_count + 1
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

### 5. ✅ FIXED — No Spend Limit Enforcement on Lithic Card

**What happens:** The Lithic card is created with `spend_limit: 500000` ($5,000) per TRANSACTION (`spend_limit_duration: 'TRANSACTION'`). There is no daily, monthly, or lifetime limit. A compromised card or bad actor can make unlimited $5,000 transactions.

**Scale trigger:** 10+ users (single compromised card)

**Where:** `issuing.js` line 153 — `spend_limit_duration: 'TRANSACTION'`

**Worst case:** A user's Splitt card number leaks. Attacker makes 100 x $5,000 online purchases in one day = $500,000 in approved transactions, all of which fail at the secondary charge step. Splitt eats $500K.

**Fix:**
```javascript
// Change to monthly limit based on tier
const spendLimits = {
  free: { amount: 150000, duration: 'MONTHLY' },   // $1,500/mo
  plus: { amount: 500000, duration: 'MONTHLY' },   // $5,000/mo
  pro:  { amount: 2500000, duration: 'MONTHLY' },  // $25,000/mo
};
const limits = spendLimits[user.tier || 'free'];

const lithicCard = await lithic.cards.create({
  type: 'VIRTUAL',
  spend_limit: limits.amount,
  spend_limit_duration: limits.duration,
  state: 'OPEN',
});
```
Also add velocity checks in the webhook: if a user has more than X approved transactions in the last hour, decline.

---

### 6. ✅ FIXED — No Chargeback/Dispute Handling

**What happens:** When a user disputes a charge with their bank (e.g., "I didn't authorize this Stripe charge"), Stripe sends a `charge.dispute.created` webhook. The backend has NO handler for dispute events. Splitt won't know about disputes, won't respond within the deadline, and will auto-lose every dispute.

**Scale trigger:** 100+ users (first confused user calls their bank)

**Where:** Missing entirely from `webhook.js` and `billingWebhook.js`.

**Worst case at 10K users:** 2% dispute rate (industry average for confusing charges) = 200 disputes/month. Each lost dispute costs the charge amount + $15 Stripe dispute fee. If average transaction is $50: 200 x ($50 + $15) = $13,000/month in losses.

**Fix:** Add dispute webhook handling:
```javascript
// In webhook.js or a new file — register for Stripe payment webhooks
if (event.type === 'charge.dispute.created') {
  const dispute = event.data.object;
  // 1. Log the dispute
  // 2. Auto-submit evidence (Lithic authorization proof, user consent)
  // 3. Alert the team via Sentry/email
  // 4. Optionally freeze the user's account pending review
}
```
Also critical: set the Stripe charge `description` to something users will recognize on their statement (e.g., "SPLITT*MERCHANT_NAME") so they don't dispute legitimate charges.

---

### 7. ✅ FIXED — No Refund Flow

**What happens:** When a merchant refunds a Splitt transaction (e.g., returned item), the refund hits Splitt's Lithic account. But there is no mechanism to propagate that refund back to the user's secondary cards. The refund money sits in Splitt's account.

**Scale trigger:** 10+ users (first return/refund)

**Where:** Missing entirely. No refund webhook handler, no refund propagation logic.

**Worst case:** User buys $200 item, split across 2 cards ($100 each). Returns item. Merchant refunds $200 to Splitt's Lithic card. User's two cards are never refunded. User complains, disputes charges, or churns.

**Fix:**
```javascript
// Register for Lithic transaction events (not just auth)
// When type === 'transaction.refund':
async function handleRefund(refundEvent) {
  const originalAuthToken = refundEvent.original_authorization_token;
  const refundAmountCents = refundEvent.amount;

  // Look up original transaction
  const { data: tx } = await supabase
    .from('split_transactions')
    .select('*, split_transaction_legs(*)')
    .eq('lithic_authorization_token', originalAuthToken)
    .single();

  // Issue proportional refunds to each leg
  for (const leg of tx.split_transaction_legs) {
    const legRefundAmount = Math.round(
      (leg.amount_cents / tx.total_amount_cents) * refundAmountCents
    );
    await stripe.refunds.create({
      payment_intent: leg.stripe_pi_id,
      amount: legRefundAmount,
    });
  }
}
```

---

## HIGH SEVERITY (Service Degradation, Security Risks)

### 8. In-Memory Rate Limiting Breaks with Multiple Instances

**What happens:** `fraudProtection.js` stores rate limit counters in a JavaScript `Map()`. Railway can auto-scale to multiple instances. Each instance has its own Map. A user hitting instance A for 119 requests, then instance B for 119 requests, has made 238 requests total but neither instance blocks them.

**Scale trigger:** 1K+ users (when Railway auto-scales)

**Where:** `fraudProtection.js` line 31 — `const windowStore = new Map()`

**Fix:** Use Redis (or Upstash Redis for serverless):
```javascript
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function trackRequest(key) {
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, 60); // 60s window
  return current;
}
```

---

### 9. Authentication is Header-Based, Not JWT-Verified

**What happens:** API routes use `X-User-Id` header for authentication (`requireUserAuth` in api.js). This header is set by the client. There is NO server-side JWT verification — the backend trusts whatever user ID the client sends. Any attacker can set `X-User-Id: <victim-uuid>` and access any user's data.

**Scale trigger:** 10+ users (any technical user inspects network requests)

**Where:** `api.js` line 13-21 — `requireUserAuth` only checks that header matches URL param.

**Worst case:** Attacker guesses or enumerates user UUIDs, sets the header, and reads/modifies any user's payment methods, split rules, transactions, and card details.

**Fix:** Verify the Supabase JWT token server-side:
```javascript
async function requireUserAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Look up the DB user and verify they match the URL param
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('supabase_auth_uid', user.id)
    .single();

  if (!dbUser || dbUser.id !== req.params.userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  req.authenticatedUserId = dbUser.id;
  next();
}
```

---

### 10. ✅ FIXED — No Database Indexes — Queries Will Crawl at Scale

**What happens:** The base schema (`supabase-schema.sql`) creates tables with zero indexes beyond primary keys. Every query that filters by `user_id`, `lithic_card_token`, or `is_active` does a full table scan.

**Scale trigger:** 1K+ users / 10K+ transactions

**Where:** `supabase-schema.sql` — no CREATE INDEX statements.

**Worst case at 100K users:** The webhook's card lookup (`issued_cards WHERE lithic_card_token = ?`) scans 100K+ rows on every single transaction. Webhook response time goes from 10ms to 2000ms+, causing Lithic timeouts and declined transactions.

**Fix:** Run these migrations immediately:
```sql
-- Critical for webhook performance (every transaction hits this)
CREATE INDEX idx_issued_cards_lithic_token ON issued_cards(lithic_card_token);
CREATE INDEX idx_issued_cards_user_id ON issued_cards(user_id);

-- Critical for charge service
CREATE INDEX idx_linked_payment_methods_user_id ON linked_payment_methods(user_id);
CREATE INDEX idx_split_rules_user_active ON split_rules(user_id, is_active);
CREATE INDEX idx_split_rule_cards_rule_id ON split_rule_cards(split_rule_id);

-- Critical for transaction queries
CREATE INDEX idx_split_transactions_user_id ON split_transactions(user_id);
CREATE INDEX idx_split_transactions_auth_token ON split_transactions(lithic_authorization_token);
CREATE INDEX idx_split_transactions_status ON split_transactions(status);
CREATE INDEX idx_split_transaction_legs_tx_id ON split_transaction_legs(transaction_id);

-- Critical for routing rules
CREATE INDEX idx_routing_rules_user_active ON routing_rules(user_id, is_active);

-- Critical for rewards optimizer
CREATE INDEX idx_user_card_rewards_user_id ON user_card_rewards(user_id);

-- Critical for subscription detection
CREATE INDEX idx_user_subscriptions_user_merchant ON user_subscriptions(user_id, merchant_key);

-- Critical for retry queue
CREATE INDEX idx_split_transactions_retry ON split_transactions(status, next_retry_at)
  WHERE status = 'retry_pending';
```

---

### 11. Single Supabase Client — Connection Pool Exhaustion

**What happens:** `supabase.js` creates a single client instance shared by the entire server. Supabase's JS client uses HTTP (not connection pooling). Under high concurrent load, hundreds of simultaneous database requests will exhaust Supabase's connection limits or hit HTTP timeout walls.

**Scale trigger:** 10K+ users (high concurrent webhooks)

**Where:** `supabase.js` — single client, no pool config.

**Worst case:** 50 simultaneous webhook fires (Friday night dinner rush). Each webhook makes 5-8 DB queries. That's 250-400 concurrent DB requests. Supabase free/pro tier has connection limits. Queries start timing out, webhooks fail, transactions are approved but never charged.

**Fix:** Use Supabase connection pooling (PgBouncer) and consider a dedicated Postgres connection pool:
```javascript
// Use the pooler URL instead of direct connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: 'public' },
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: { 'x-connection-pool': 'true' },
    },
  }
);
```
For 100K+ users, migrate to a dedicated Postgres instance with proper connection pooling (pg + pg-pool).

---

### 12. ✅ FIXED — Monthly Split Reset Has No Cron Job

**What happens:** `billing.js` has a `POST /billing/reset-monthly-splits` endpoint that resets all users' `splits_used_this_month` to 0. But there is NO automated scheduler calling this endpoint. Free users who hit their 3-split limit in January will remain blocked in February, March, etc.

**Scale trigger:** 10+ users (end of first month)

**Where:** `billing.js` lines 230-258 — endpoint exists but is never called automatically.

**Fix:** Add to `index.js`:
```javascript
// Reset splits on the 1st of each month at midnight
function scheduleMonthlyReset() {
  function msUntilNextMonth() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    return next - now;
  }

  function runAndReschedule() {
    console.log('[cron] Resetting monthly splits...');
    supabase
      .from('users')
      .update({ splits_used_this_month: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .then(() => console.log('[cron] Monthly splits reset complete'))
      .catch(err => console.error('[cron] Reset failed:', err.message))
      .finally(() => setTimeout(runAndReschedule, msUntilNextMonth()));
  }

  setTimeout(runAndReschedule, msUntilNextMonth());
}
scheduleMonthlyReset();
```

---

### 13. Hold Expiration Window Creates a Capture Race

**What happens:** Stripe authorization holds expire after 7 days (or 2 days for some card types). The charge service places holds sequentially, not in parallel. If placing holds on 5 cards takes 10+ seconds (Stripe latency under load), and any card takes a long time, the first hold could expire before capture happens.

**Scale trigger:** 1K+ users (Stripe under load during Black Friday)

**Where:** `chargeService.js` lines 98-155 — sequential hold loop.

**Fix:** Place holds in parallel:
```javascript
const holdPromises = resolvedLegs.map((leg, i) =>
  stripeCallWithRetry(stripeClient, 'paymentIntents', 'create', {
    amount: leg.amountCents,
    currency: 'usd',
    customer: stripeCustomerId,
    payment_method: leg.stripePaymentMethodId,
    confirm: true,
    off_session: true,
    capture_method: 'manual',
    description: `Splitt. hold for transaction ${transactionId}`,
    metadata: { splitt_transaction_id: transactionId, phase: 'hold' },
  }, 1, `${transactionId}:${leg.paymentMethodId}:hold`)
  .then(pi => ({ success: true, pi, leg, index: i }))
  .catch(err => ({ success: false, err, leg, index: i }))
);

const results = await Promise.all(holdPromises);
```

---

### 14. ✅ FIXED — Webhook Signature Verification Failure is Silently Ignored

**What happens:** If Lithic signature verification fails, the code logs a warning but STILL processes the webhook and approves the transaction (lines 86-89: "Still continue — never decline due to a backend issue"). An attacker can forge webhook requests and trigger approvals.

**Scale trigger:** 10+ users (any attacker who finds the webhook URL)

**Where:** `webhook.js` lines 81-92 — catch block continues processing.

**Worst case:** Attacker sends fake webhook to `/webhook/lithic-asa` with arbitrary card token and $10,000 amount. Signature fails but is ignored. Backend creates a transaction and attempts charges.

**Fix:** Reject failed signatures — only bypass on missing secret (sandbox/dev):
```javascript
if (lithicWebhookSecret) {
  try {
    lithic.webhooks.verifySignature(rawBody, req.headers, lithicWebhookSecret);
  } catch (sigErr) {
    console.error(`[webhook] SIGNATURE VERIFICATION FAILED — REJECTING: ${sigErr.message}`);
    return res.status(401).json({ error: 'Invalid signature' });
  }
} else if (process.env.NODE_ENV === 'production') {
  console.error('[webhook] CRITICAL: No webhook secret in production — rejecting');
  return res.status(500).json({ error: 'Webhook not configured' });
}
```

---

### 15. Card Details Endpoint Leaks Full PAN Without Re-Authentication

**What happens:** `GET /issuing/card/details` returns the full card number (PAN) and CVC with no additional authentication beyond the `X-User-Id` header. Combined with issue #9 (no JWT verification), any attacker with a user ID can steal their full card number.

**Scale trigger:** 10+ users

**Where:** `issuing.js` lines 242-273

**Fix:** Require re-authentication (password or biometric challenge) before revealing card details. At minimum, add rate limiting and logging:
```javascript
// Add re-auth requirement
const { password } = req.body;
if (!password) {
  return res.status(400).json({ error: 'Password required to view card details' });
}
// Verify password against Supabase Auth
const { error: authError } = await supabase.auth.signInWithPassword({
  email: user.email,
  password
});
if (authError) {
  return res.status(401).json({ error: 'Invalid password' });
}
```

---

## MEDIUM SEVERITY (Operational, Data Integrity)

### 16. No Transaction Amount Limits

**What happens:** There are no minimum or maximum transaction amount checks in the webhook handler. A $0.01 transaction will still trigger the full split flow, creating Stripe charges below the $0.50 minimum (which `filterSubMinimumLegs` handles, but inefficiently). A $50,000 transaction will be approved unconditionally.

**Scale trigger:** 100+ users

**Fix:** Add amount validation in the webhook:
```javascript
const MIN_SPLIT_AMOUNT_CENTS = 100;  // $1.00 minimum for splitting
const MAX_SPLIT_AMOUNT_CENTS = 500000; // $5,000 max

if (amountCents < MIN_SPLIT_AMOUNT_CENTS) {
  console.log(`[async] Amount ${amountCents}c below minimum — skipping split`);
  return; // Let it charge to the Splitt card only
}
if (amountCents > MAX_SPLIT_AMOUNT_CENTS) {
  console.log(`[async] Amount ${amountCents}c above maximum — flagging for review`);
  // Insert transaction with 'review_required' status
}
```

---

### 17. Railway Cold Starts + Keepalive Only Pings /health

**What happens:** Railway sleeps idle containers. The self-keepalive pings `/health` every 4 minutes, but if Railway's load balancer routes the ping to a warm instance while a webhook hits a cold one, the 2-second Lithic deadline will be missed.

**Scale trigger:** 10+ users (low-traffic periods)

**Where:** `index.js` lines 268-279

**Fix:**
1. Disable Railway sleep (set min instances to 1 in Railway dashboard)
2. Use Railway's always-on setting or switch to a non-sleeping provider
3. Add a "warm-up" endpoint that Lithic can use as a health check

---

### 18. No Pagination on Transaction Queries

**What happens:** `GET /api/users/:userId/transactions` returns the last 50 transactions with nested legs and payment methods. For power users with hundreds of transactions, this query will return massive payloads. More importantly, there's no cursor-based pagination for the dashboard.

**Scale trigger:** 1K+ users (power users with 100+ transactions)

**Fix:** Add cursor-based pagination:
```javascript
router.get('/users/:userId/transactions', requireUserAuth, async (req, res) => {
  const { userId } = req.params;
  const { cursor, limit = 20 } = req.query;
  const pageSize = Math.min(parseInt(limit) || 20, 50);

  let query = supabase
    .from('split_transactions')
    .select('*, split_transaction_legs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(pageSize + 1); // Fetch one extra to detect next page

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  const hasMore = data && data.length > pageSize;
  const transactions = hasMore ? data.slice(0, pageSize) : data;
  const nextCursor = hasMore ? transactions[transactions.length - 1].created_at : null;

  res.json({ transactions, nextCursor, hasMore });
});
```

---

### 19. Cron Jobs Die on Process Restart

**What happens:** Rewards update (3 AM) and card expiry (4 AM) crons use `setTimeout`. When Railway redeploys (which happens on every git push), these timers are killed. If a deploy happens at 2:55 AM, the rewards cron misses its window and won't run for another 24 hours.

**Scale trigger:** 100+ users (first deployment during cron window)

**Where:** `index.js` lines 287-417

**Fix:** Record last run timestamp in the database. On startup, check if a cron was missed and run it immediately:
```javascript
async function scheduleRewardsCron() {
  // Check if we missed the last run
  const { data } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'last_rewards_cron')
    .single();

  const lastRun = data ? new Date(data.value) : new Date(0);
  const hoursSinceLastRun = (Date.now() - lastRun.getTime()) / 3600000;

  if (hoursSinceLastRun > 24) {
    console.log('[rewards-cron] Missed last run — executing now');
    await runRewardsUpdate();
    await supabase.from('system_config').upsert({
      key: 'last_rewards_cron',
      value: new Date().toISOString()
    });
  }
  // ... then schedule as normal
}
```

---

### 20. No Webhook Event Logging/Audit Trail

**What happens:** Webhook events are processed and logged to console, but there is no persistent audit table for webhook events. If something goes wrong, there's no way to replay events, investigate discrepancies, or reconcile with Lithic's records.

**Scale trigger:** 100+ users

**Fix:** Create a `webhook_events` table:
```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- 'lithic' or 'stripe'
  event_type TEXT,
  event_id TEXT UNIQUE, -- for idempotency
  payload JSONB,
  status TEXT DEFAULT 'received', -- received, processed, failed
  error_message TEXT,
  processing_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_webhook_events_source_type ON webhook_events(source, event_type);
CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);
```

---

### 21. Time-Based Routing Rules Use Server Time, Not User Time

**What happens:** `ruleEngine.js` uses `new Date()` (server time in UTC on Railway) for `time_between` and `day_of_week` conditions. A user in PST who sets a rule for "weekdays 9-5" will have it trigger on UTC weekdays 9-5 (which is PST 1 AM - 9 AM).

**Scale trigger:** 10+ users (any user with time-based rules)

**Where:** `ruleEngine.js` line 92 — `const now = new Date()`

**Fix:** Store user timezone in the users table and convert:
```javascript
const userTimezone = userData.timezone || 'America/New_York';
const now = new Date(new Date().toLocaleString('en-US', { timeZone: userTimezone }));
```

---

### 22. CORS Allows All Origins in Development

**What happens:** When `ALLOWED_ORIGINS` is not set, CORS allows `*` (all origins). If the production deployment forgets to set this env var, any website can make authenticated API requests on behalf of logged-in users.

**Scale trigger:** 10+ users (if env var is missing in production)

**Where:** `index.js` lines 51-79

**Fix:** Default to restrictive CORS in production:
```javascript
if (!allowedOrigins && process.env.NODE_ENV === 'production') {
  // In production, if no origins specified, only allow our own domains
  const defaultOrigins = ['https://paysplitt.com', 'https://dashboard.paysplitt.com', 'https://www.paysplitt.com'];
  const origin = req.headers.origin;
  if (origin && defaultOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  // No origin header = deny
}
```

---

### 23. User Creation Doesn't Handle Stripe Customer Failure Gracefully

**What happens:** `POST /api/users` creates a Stripe Customer first, then inserts the user row. If the Supabase insert fails (e.g., duplicate email), an orphaned Stripe Customer is created that will never be cleaned up. Over time, thousands of orphaned customers accumulate.

**Scale trigger:** 100+ users (duplicate signup attempts)

**Where:** `api.js` lines 37-63

**Fix:** Check for existing user first, and clean up on failure:
```javascript
router.post('/users', async (req, res) => {
  const { email, supabase_auth_uid } = req.body;

  // Check for existing user first
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return res.status(409).json({ error: 'User already exists', user: existing });
  }

  let customerId = null;
  try {
    const customer = await stripe.customers.create({ email });
    customerId = customer.id;

    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, stripe_customer_id: customerId, supabase_auth_uid })
      .select()
      .single();

    if (error) {
      // Clean up orphaned Stripe customer
      await stripe.customers.del(customerId).catch(() => {});
      throw error;
    }

    res.status(201).json({ user });
  } catch (err) {
    if (customerId) await stripe.customers.del(customerId).catch(() => {});
    res.status(500).json({ error: err.message });
  }
});
```

---

### 24. Delete Payment Method Doesn't Check Active Split Rules

**What happens:** When a user deletes a payment method that's the "remainder" card in their active split rule, the webhook will fail silently on the next transaction because `calculateSplit` can't assign the remainder. The code deletes orphaned rules (lines 190-201 in api.js), but if other cards remain in the rule, the rule stays active with a broken split.

**Scale trigger:** 100+ users

**Fix:** After deleting the payment method's rule cards, validate that remaining active rules still have valid splits (must have a remainder card or add up to 100%):
```javascript
// After deleting rule cards for this payment method...
// Check if remaining rule is still valid
for (const splitRuleId of affectedRuleIds) {
  const { data: remainingCards } = await supabase
    .from('split_rule_cards')
    .select('split_type')
    .eq('split_rule_id', splitRuleId);

  const hasRemainder = remainingCards?.some(c => c.split_type === 'remainder');
  if (!hasRemainder && remainingCards?.length > 0) {
    // Deactivate the broken rule
    await supabase
      .from('split_rules')
      .update({ is_active: false })
      .eq('id', splitRuleId);
  }
}
```

---

## SCALE-SPECIFIC SCENARIOS

### At 10 Users
1. All critical issues above can occur
2. Manual monitoring is feasible but fragile
3. Key risk: one bad transaction could cost more than monthly revenue

### At 100 Users
4. Rate limiting gaps become exploitable
5. Orphaned Stripe customers start accumulating
6. First disputes/chargebacks arrive — no handler exists
7. Monthly reset cron not running = angry free users

### At 1,000 Users
8. Database queries slow down without indexes
9. In-memory rate limiting becomes unreliable if Railway scales
10. Console.log volume overwhelms Railway log viewer — need structured logging
11. Single Supabase client starts hitting connection limits during peaks

### At 10,000 Users
12. Webhook processing time increases (more DB lookups, more concurrent events)
13. Need horizontal scaling — but in-memory state (rate limits, cron timers) prevents it
14. Stripe API rate limits become relevant (25 req/s for test, 100 req/s for live)
15. Need a proper job queue (BullMQ/Redis) for async charge processing
16. Email volume exceeds Resend free tier limits

### At 100,000 Users
17. Single Railway instance can't handle the webhook volume
18. Need a message queue (SQS/Redis Streams) between webhook and charge processing
19. Database needs read replicas for dashboard queries
20. Supabase free/pro tier is inadequate — need dedicated Postgres
21. Sentry volume becomes expensive without better sampling
22. Need distributed tracing (not just request IDs) to debug multi-service issues
23. Customer support tooling is required (admin dashboard is password-only, no search)

### At 1,000,000+ Users
24. Full microservices split: webhook service, charge service, notification service
25. Database sharding or partitioning by user_id
26. Redis cluster for rate limiting, caching, and job queues
27. CDN for web dashboard (already on Vercel, but API responses need caching)
28. Dedicated fraud team + ML-based fraud detection (not just velocity)
29. Multi-region deployment for latency (Lithic webhooks from their infra)
30. PCI compliance audit required (even though Stripe/Lithic handle card data)
31. SOC 2 certification expected by enterprise users and banking partners

---

## PRIORITY ACTION ITEMS (Ordered by Impact)

### Before First 10 Users (Pre-Launch Critical)
1. Fix webhook idempotency (issue #1) — prevents double-charging
2. Add pre-approval checks (issue #2) — prevents unlimited liability
3. Fix webhook signature enforcement (issue #14) — prevents forged webhooks
4. Add database indexes (issue #10) — prevents slow queries
5. Implement JWT verification (issue #9) — prevents unauthorized access
6. Add monthly reset cron (issue #12) — free tier actually works
7. Create refund handling (issue #7) — basic customer expectation

### Before 100 Users
8. Build retry worker (issue #3) — failed charges get retried
9. Add dispute handling (issue #6) — prevents auto-lost disputes
10. Fix atomic split counting (issue #4) — prevents free tier bypass
11. Add spend limits on Lithic cards (issue #5) — prevents fraud
12. Protect card details endpoint (issue #15) — prevents PAN theft

### Before 1,000 Users
13. Migrate rate limiting to Redis (issue #8)
14. Parallelize hold placement (issue #13)
15. Add transaction amount limits (issue #16)
16. Fix time-based rule timezone (issue #21)
17. Add webhook event audit table (issue #20)
18. Add pagination to all list endpoints (issue #18)
19. Production CORS lockdown (issue #22)

### Before 10,000 Users
20. Implement proper job queue (BullMQ + Redis)
21. Add database connection pooling
22. Implement structured logging (Winston/Pino)
23. Move crons to durable scheduler
24. Add health check monitoring (better than self-ping)

---

*This audit covers the full backend codebase as of March 10, 2026. Issues are based on direct code review of all source files. Severity levels reflect both likelihood and financial impact.*
