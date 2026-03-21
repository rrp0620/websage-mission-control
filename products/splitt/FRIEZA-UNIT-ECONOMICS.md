# FRIEZA — Splitt Unit Economics Memo

**From:** Frieza 👽, CFO — Websage Inc.
**To:** Goku (Chief of Staff), Rishi (Founder)
**Date:** March 20, 2026
**Classification:** Internal — Financial Analysis
**Status:** FINAL
**Source Data:** Bulma's research brief (2026-03-20)

---

## 0. Bottom Line Up Front

Splitt **cannot launch profitably on a pure subscription model**. At any price point. At any MAU count. The per-leg Stripe fee ($0.30 × N legs) creates a cost structure that scales faster than subscription revenue.

However, Splitt **can** launch profitably at ~570 MAU with a hybrid model: **$14.99/month subscription + 2% transaction fee + interchange revenue**. This is the only configuration that works at early scale.

I am authorizing this product to proceed — with conditions.

---

## 1. Current Cost Structure

### Per-Transaction Costs (Baseline: $75 transaction, 2 split legs at $37.50 each)

| Cost Item | Amount | Notes |
|-----------|--------|-------|
| Stripe Leg 1 (2.9% + $0.30) | $1.39 | On $37.50 charge |
| Stripe Leg 2 (2.9% + $0.30) | $1.39 | On $37.50 charge |
| **Total Stripe per transaction** | **$2.78** | |
| Lithic per-transaction cost | ~$0.00 | Bundled into interchange share |
| Lithic card issuance (virtual) | ~$0.00 | Waived on standard program |
| **Total variable cost per transaction** | **$2.78** | |

### Per-Transaction Revenue

| Revenue Item | Amount | Notes |
|--------------|--------|-------|
| Interchange (net to Splitt after Lithic cut) | $0.75 | 1.0% of $75 (conservative) |
| **Net loss per transaction (no fees)** | **-$2.03** | |

### Per-User Monthly Costs (20 transactions/month, $75 avg)

| Item | Amount |
|------|--------|
| Stripe processing (20 × $2.78) | $55.60 |
| Interchange earned (20 × $0.75) | -$15.00 |
| **Net transaction cost per user/month** | **$40.60** |
| Stripe subscription billing (2.9% + $0.30 on $14.99) | $0.73 |
| **Total variable cost per user/month** | **$41.33** |

### Fixed Costs (Monthly, at Launch)

| Item | Amount |
|------|--------|
| Hosting / infrastructure | $500–$1,000 |
| Compliance / legal | $500 |
| Support tooling | $500 |
| Monitoring / analytics | $500 |
| **Total fixed costs** | **$2,000–$3,000/month** |

Founder salaries excluded (pre-revenue modeling).

---

## 2. Break-Even Analysis — Four Pricing Scenarios

All scenarios assume: 20 transactions/month per user, $75 avg transaction, 2 legs, 1.0% net interchange.

### Scenario A: Pure Subscription — $9.99/month

| MAU | Revenue | Costs | Net |
|-----|---------|-------|-----|
| 100 | $2,499 | $8,100 | **-$5,601** |
| 1,000 | $24,990 | $58,500 | **-$33,510** |
| 10,000 | $249,900 | $565,000 | **-$315,100** |

**Verdict: DEAD ON ARRIVAL.** Losses widen with every new user. Never breaks even. Kill this option.

### Scenario B: $9.99/month + 0.5% Transaction Fee

Per-user fee revenue: $7.50/month (0.5% × $75 × 20)

| MAU | Revenue | Costs | Net |
|-----|---------|-------|-----|
| 100 | $3,249 | $8,100 | **-$4,851** |
| 1,000 | $32,490 | $58,500 | **-$26,010** |
| 10,000 | $324,900 | $565,000 | **-$240,100** |

**Verdict: STILL DEAD.** 0.5% fee is cosmetic. Does not move the needle.

### Scenario C: $14.99/month + 1.5% Transaction Fee

Per-user fee revenue: $22.50/month (1.5% × $75 × 20)

| MAU | Revenue | Costs | Net |
|-----|---------|-------|-----|
| 100 | $5,249 | $8,100 | **-$2,851** |
| 1,000 | $52,490 | $58,500 | **-$6,010** |
| 5,000 | $262,450 | $283,000 | **-$20,550** |
| 10,000 | $524,900 | $568,000 | **-$43,100** |

**Verdict: APPROACHES break-even but never crosses it.** The 1.5% fee isn't enough to overcome the $0.30 per-leg fixed cost.

### Scenario D: $14.99/month + 2.0% Transaction Fee (RECOMMENDED)

Per-user fee revenue: $30.00/month (2.0% × $75 × 20)
Per-user contribution margin: **+$4.39/month**

| MAU | Revenue | Costs | Net |
|-----|---------|-------|-----|
| 100 | $5,999 | $8,100 | **-$2,101** |
| 300 | $17,997 | $19,300 | **-$1,303** |
| **570** | **~$34,254** | **~$34,420** | **≈ $0 (BREAK-EVEN)** |
| 1,000 | $59,990 | $58,500 | **+$1,490** |
| 5,000 | $299,950 | $285,000 | **+$14,950** |
| 10,000 | $599,900 | $568,000 | **+$31,900** |

**Verdict: THIS IS THE MODEL.** Break-even at ~570 MAU. Profitable at 1,000+. At 10K MAU with processor migration to Finix/Adyen, net jumps to ~$248K/month.

---

## 3. Top 3 Monetization Structures — Ranked by Viability

### Rank 1: Hybrid Subscription + Transaction Fee (RECOMMENDED)

**Structure:** $14.99/month + 2% per-split transaction fee
**Break-even:** ~570 MAU
**Contribution margin:** +$4.39/user/month
**Why it wins:** Only model that produces positive unit economics at early scale. Matches Kasheesh pricing (2% service fee) so users won't see Splitt as overpriced vs. the direct competitor. Subscription creates predictable baseline; transaction fee scales with usage.

**Risk:** User sticker shock at 2% + subscription. Mitigate by framing as "service fee" (not surcharge — legal distinction matters) and emphasizing rewards value exceeds the fee.

### Rank 2: Tiered Split-Volume Pricing (STRONG ALTERNATIVE)

**Structure:**
- Free: 5 splits/month
- Basic ($4.99): 25 splits/month
- Pro ($9.99): 75 splits/month
- Premium ($19.99): Unlimited splits

**Why it's viable:** Frames cost correctly — heavy users subsidize light users. No per-transaction billing complexity. The "free tier" drives acquisition; Premium captures whales.

**Risk:** Unlimited tier is dangerous. A user doing 50+ splits at $75 avg costs Splitt $139/month in Stripe fees. Premium must cap at ~35 transactions/month or price at $29.99+ to stay positive. Recommend renaming "Unlimited" to "150 splits/month" with soft cap.

**Break-even estimate:** ~800–1,000 MAU (blended across tiers, assuming 60% Basic / 30% Pro / 10% Premium).

### Rank 3: Pure Transaction Fee — No Subscription (KASHEESH CLONE)

**Structure:** 2% fee on every split. No monthly subscription.
**Per-transaction margin:** $1.50 (fee) + $0.75 (interchange) - $2.78 (Stripe) = **-$0.53**

**Why it doesn't rank higher:** Negative per-transaction margin at Stripe rates. Only works at scale (10K+ MAU) where processor migration drops Stripe costs by ~40%. Without subscription baseline, this model bleeds at low MAU.

**Break-even:** Only with Finix/Adyen processing (~$1.70/transaction instead of $2.78). At optimized rates: break-even at ~2,000 MAU.

---

## 4. Verdict: Can Splitt Launch Profitably?

**No — but it can launch with controlled, predictable losses and a clear path to profitability.**

### What must be true for launch:

| Requirement | Status | Action |
|-------------|--------|--------|
| Price at $14.99/month + 2% fee | DECISION NEEDED | Set this as launch pricing |
| Minimum split leg size: $15 | MUST IMPLEMENT | Below $15, Stripe's $0.30 fixed fee destroys margins |
| Interchange revenue confirmed with Lithic | MUST VERIFY | Contact Lithic sales; confirm net interchange share ≥ 0.75% |
| Legal review of fee structure | MUST COMPLETE | "Service fee" vs. "surcharge" — state law varies |
| Network rule compliance | MUST COMPLETE | Visa/MC rules on pass-through charging — Curve had issues |
| Chargeback reserve fund | SHOULD BUILD | Split transactions create reconciliation complexity |
| Amex surcharge modeled separately | SHOULD MODEL | Amex legs cost ~3.5% vs. 2.9% — material at volume |

### Acceptable Burn at Launch (Pre-570 MAU)

| MAU | Monthly Loss | Cumulative (6 months) |
|-----|-------------|----------------------|
| 50 | ~$1,280 | ~$7,700 |
| 100 | ~$2,100 | ~$12,600 |
| 300 | ~$1,300 | ~$7,800 |
| 500 | ~$400 | ~$2,400 |

**Total pre-profitability burn: $8K–$13K.** This is manageable on a pre-seed budget. I sign off on this burn rate.

### What must change before 1,000 MAU:

1. **Negotiate Stripe custom pricing** at $500K+/year processing volume (~$42K/month). Target: 2.5% + $0.20.
2. **Begin Finix/Adyen evaluation** for migration at $100K+/month processing.
3. **Launch card affiliate engine** (see Section 5).
4. **Batch small charges** — aggregate multiple split legs to the same card into daily settlements. Saves $0.30 per consolidated charge.

---

## 5. Credit Card Affiliate Revenue — Real Opportunity or Noise?

**Real opportunity. Possibly the most important long-term revenue stream.**

### The Math

Splitt has a unique data asset: it knows exactly which credit cards each user holds and their spending patterns by merchant category. This enables hyper-targeted card recommendations.

| Metric | Conservative | Moderate | Aggressive |
|--------|-------------|----------|------------|
| MAU | 1,000 | 5,000 | 10,000 |
| Monthly conversion rate | 2% | 3% | 5% |
| Cards referred/month | 20 | 150 | 500 |
| Avg affiliate payout | $75 | $100 | $125 |
| **Monthly affiliate revenue** | **$1,500** | **$15,000** | **$62,500** |

### Why This Is Real, Not Noise

1. **Intent signal is off the charts.** Splitt users are actively optimizing credit card rewards. They are the exact audience card issuers pay premium CPA rates to reach.
2. **Standard affiliate payouts:** $50–$200 per approved application via CardRatings, Commission Junction, Impact. Chase Sapphire Reserve reportedly pays $150+ per referral.
3. **Zero incremental infrastructure cost.** Splitt already has the card data. A recommendation engine is a UI feature, not a new backend.
4. **Comparison:** NerdWallet earns ~$500M/year primarily from credit card affiliate revenue. Credit Karma was acquired for $7.1B on the same model.

### Impact on Break-Even

At 1,000 MAU with $1,500/month affiliate revenue, break-even drops from 570 MAU to **~480 MAU**.

At 5,000 MAU with $15,000/month affiliate revenue, monthly profit jumps from $14,950 to **$29,950** — nearly doubling.

### My Assessment

This is not noise. This is the margin expansion lever. Build it in Phase 2 (post-570 MAU). Do not delay beyond 1,000 MAU. The ROI on engineering time for a card recommendation feature is the highest in the entire product roadmap.

---

## 6. Recommended Launch Pricing

### Primary Pricing (Day 1)

| Tier | Monthly Price | Transaction Fee | Split Limit | Target User |
|------|--------------|-----------------|-------------|-------------|
| **Founding Member** | $7.99/month (locked for life) | 1.5% | 50 splits/month | Waitlist converts, early adopters |
| **Standard** | $14.99/month | 1.0% | 75 splits/month | Core user base |
| **Power** | $24.99/month | 0% | 150 splits/month | High-volume users |

### Why This Structure

1. **Founding Member at $7.99** — below psychological $10 barrier. The 1.5% fee compensates for lower subscription. At 20 transactions × $75: revenue = $7.99 + $22.50 + $15.00 (interchange) = $45.49 vs. $55.60 (Stripe) + $0.73 (billing) = $56.33. **Loss: $10.84/user/month.** Acceptable as acquisition cost with lifetime lock-in. Cap at 500 founding members.

2. **Standard at $14.99** — the workhorse tier. At 20 transactions × $75: revenue = $14.99 + $15.00 + $15.00 = $44.99 vs. $56.33. **Loss: $11.34/user/month.** Wait — this loses more than Founding. Adjusting: Standard needs the 2% fee to work. **Revised: $14.99/month + 2% fee.** Revenue = $14.99 + $30.00 + $15.00 = $59.99. **Profit: +$3.66/user/month.** This is the margin tier.

3. **Power at $24.99** — 0% transaction fee is the premium unlock. At 20 transactions: revenue = $24.99 + $0 + $15.00 = $39.99 vs. $56.33. **Loss: $16.34/user/month.** This only works if Power users transact ≤ 12 times/month. **Hard cap Power tier at 150 splits/month and price at $24.99.** If average Power user does 12 transactions: cost = $33.36 + $0.73 = $34.09. Revenue = $24.99 + $9.00 (interchange on 12 × $75) = $33.99. **Near break-even.** Acceptable — these users drive word-of-mouth.

### Final Recommended Pricing Table

| Tier | Price | Fee | Limit | Unit Economics |
|------|-------|-----|-------|----------------|
| Founding Member | $7.99/mo | 1.5% | 50/mo | -$10.84/user (acquisition cost, cap at 500) |
| Standard | $14.99/mo | 2.0% | 75/mo | +$3.66/user (margin tier) |
| Power | $24.99/mo | 0% | 150/mo | ≈$0/user (retention tier) |

### Annual Option

Offer 20% discount on annual billing: Standard at $143.90/year ($11.99/month effective). Improves cash flow, reduces churn, and front-loads revenue to cover early processing losses.

---

## 7. Processor Migration Roadmap (Margin Expansion)

This is where the real money is.

| Processing Volume | Processor | Est. Cost per $75 Txn (2 legs) | Savings vs. Stripe |
|-------------------|-----------|--------------------------------|---------------------|
| $0–$100K/mo | Stripe | $2.78 | — |
| $100K–$500K/mo | Stripe (negotiated) or Helcim | ~$2.10 | $0.68/txn |
| $500K+/mo | Finix or Adyen | ~$1.70 | $1.08/txn |

**At 10,000 MAU (200K transactions/month):**
- Stripe savings from migration: 200,000 × $1.08 = **$216,000/month**
- Monthly profit jumps from $31,900 (Stripe) to **~$247,900** (Finix/Adyen)
- Gross margin goes from 5.3% to 41.3%

**Trigger for migration:** Begin evaluation at $100K/month processing. Execute migration at $500K/month. Do not delay — every month on Stripe past this threshold is $50K+ in unnecessary cost.

---

## 8. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Stripe $0.30/leg kills micro-splits | HIGH | CERTAIN | Enforce $15 minimum per leg |
| Users reject 2% fee | HIGH | MODERATE | Frame as "service fee"; show rewards value exceeds fee |
| Amex legs cost 3.5% (not 2.9%) | MEDIUM | HIGH | Model Amex at 3.5%; consider Amex surcharge or exclude |
| Visa/MC network rule violation | HIGH | LOW-MODERATE | Legal review before launch — non-negotiable |
| Interchange share lower than modeled | MEDIUM | MODERATE | Confirm with Lithic sales; model downside at 0.5% net |
| Chargebacks on split legs | MEDIUM | MODERATE | Build 1% reserve fund from transaction revenue |
| Kasheesh undercuts on pricing | LOW | MODERATE | Differentiate on rewards optimization (Kasheesh doesn't do this) |

---

## 9. Summary — The Frieza Directive

1. **Launch at $14.99/month + 2% transaction fee.** This is non-negotiable. Any lower and the math collapses.
2. **Cap Founding Members at 500 users, $7.99/month + 1.5% fee.** Accept the loss as customer acquisition cost.
3. **Enforce $15 minimum per split leg.** Below this, we're lighting money on fire.
4. **Break-even at ~570 MAU.** Expect $8K–$13K total burn to get there. Acceptable.
5. **Build card affiliate engine by 1,000 MAU.** This is the margin expansion lever that turns a thin-margin fintech into a high-margin data business.
6. **Migrate off Stripe at $500K/month processing.** This single action increases gross margin from ~5% to ~40%.
7. **Legal review of fee structure and network rules before launch.** I will not sign off on launch without this.

The product works. The naive pricing doesn't. With the structure above, Splitt is a viable business at modest scale and a highly profitable one at 10K+ MAU.

I've seen worse odds. Proceed.

— Frieza 👽

---

*This memo is based on Bulma's research brief dated March 20, 2026. All interchange estimates assume 1.0% net to Splitt (conservative). Stripe rates are standard published rates as of March 2026. Verify all vendor pricing directly before committing to launch economics.*
