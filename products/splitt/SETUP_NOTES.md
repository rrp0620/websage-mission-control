# Splitt — Setup Notes
## Manual Steps Needed

### Step 1 — Run ALL SQL Migrations in Supabase (in order)
Go to: Supabase Dashboard → your project → SQL Editor → New Query
Run each file **in order**:

**migration_001_rewards_routing_analytics.sql**

This creates:
- `reward_card_templates` — master database of 60+ popular US credit cards
- `user_card_rewards` — per-user card config for the optimizer
- `routing_rules`, `routing_rule_conditions`, `routing_rule_actions` — condition-based rule engine
- `subscription_events` — billing event audit log
- Alters `users` table (adds `supabase_auth_uid`, `tier`, subscription cols if missing)
- Alters `split_transactions` (adds `edits_used`, `last_edited_at`, `rewards_earned_cents`, `normalized_category`)
- Creates RPC functions: `increment_splits_used`, `reset_monthly_splits`, `get_analytics_summary`

**migration_002_issued_cards_columns.sql**
- Adds `stripe_cardholder_id`, `last4`, `exp_month`, `exp_year` to `issued_cards` table

**migration_003_subscriptions_groups.sql**
- Creates `user_subscriptions` — auto-detected recurring charges
- Creates `expense_groups` + `group_members` — group expense splitting
- Creates `fraud_velocity_log` — per-user action audit log for fraud detection

### Step 2 — Restart the Backend
```bash
cd splitpay-backend
node src/index.js
```
(or whatever your current start command is)

---

## What Was Built (no manual steps needed)

### Backend — New Files
- `src/services/mccNormalizer.js` — Maps Stripe MCC codes + merchant names → internal categories (dining, grocery, travel, etc.)
- `src/services/rewardsOptimizer.js` — Auto-routes transactions to maximize rewards. Handles caps, sign-up bonuses, multi-card splits
- `src/services/ruleEngine.js` — Evaluates user-defined conditional routing rules in priority order
- `src/routes/rewards.js` — All new API endpoints:
  - `GET /api/rewards/templates` — browse reward card catalog
  - `GET/POST/DELETE /api/users/:id/card-rewards` — manage reward configs per card
  - `GET/POST/PATCH/DELETE /api/users/:id/routing-rules` — manage conditional rules
  - `POST /api/users/:id/transactions/:id/edit-split` — post-transaction split editing
  - `GET /api/users/:id/analytics` — monthly analytics summary
  - `GET /api/users/:id/analytics/history` — 6-month history for charts

### Backend — Modified Files
- `src/routes/webhook.js` — Now uses 3-tier routing: rules → optimizer → static split fallback
- `src/index.js` — Mounts rewardsRouter at /api

### Mobile App — New Screens
- `src/screens/AnalyticsScreen.js` — Monthly rewards earned, card performance, category breakdown, 6-month chart
- `src/screens/RewardsSetupScreen.js` — Link cards to reward templates, track sign-up bonuses
- `src/screens/RoutingRulesScreen.js` — Create/manage conditional routing rules

### Mobile App — Modified Files
- `src/screens/TransactionsScreen.js` — Added post-transaction split editing UI (48hr window, 1 edit max)
- `src/services/api.js` — Added all new endpoint wrappers
- `src/navigation/AppNavigator.js` — Added Rewards, Rules, Analytics tabs (now 6 tabs total)

---

## New Tab Bar Layout (9 tabs)
1. ⚡ Dashboard
2. 💳 My Cards — linked payment methods + Splitt card banner
3. 🪪 Splitt Card — virtual card, freeze/unfreeze, Apple Wallet
4. 🏆 Rewards — link card reward profiles, track sign-up bonuses
5. ⚙️ Rules — condition-based routing rules
6. 📊 Analytics — monthly spend + reward summary
7. 👥 Groups — group expense splitting
8. 🔄 Subs — auto-detected recurring subscriptions
9. 📋 History — transactions with post-tx edit capability

---

## How the Routing Priority Works
Every time the Splitt card is tapped, the webhook now does:

1. **Normalize category** (mccNormalizer) — "What kind of merchant is this?"
2. **Check routing rules** (ruleEngine) — Did the user set a conditional rule that matches?
   - If yes → use rule's actions
   - If rule says "use_optimizer" → fall through to step 3
3. **Run rewards optimizer** (rewardsOptimizer) — Has the user linked reward profiles?
   - If yes → auto-select best card(s) based on category multipliers, caps, and bonus progress
4. **Fall back to static split** (splitEngine) — Use the user's manual split rule as before

This means existing users see no behavior change until they configure rewards profiles.

---

## Session 2 — What Was Added

### New Backend Files
- `src/routes/issuing.js` — Virtual card issuance (Stripe Issuing), freeze/unfreeze, Apple Wallet ephemeral key
- `src/routes/subscriptions.js` — Manage auto-detected recurring subscriptions
- `src/routes/groups.js` — Group expense creation, member tracking, reminders, settlement
- `src/services/subscriptionDetector.js` — Heuristic engine that detects recurring charges from webhook events
- `src/middleware/fraudProtection.js` — Sliding-window rate limiting (IP + user + route-specific) + velocity logging

### New Mobile Screens
- `src/screens/VirtualCardScreen.js` — Splitt card UI: view, reveal PAN, freeze, Apple Wallet
- `src/screens/SubscriptionsScreen.js` — View detected subscriptions, assign preferred card, cancel
- `src/screens/GroupsScreen.js` — Create group expenses, track members, send reminders, settle

### Feature Status
| Feature | Status |
|---|---|
| Multi-card splitting | ✅ Complete |
| Smart routing (rules) | ✅ Complete |
| Reward optimization | ✅ Complete |
| Post-transaction editing | ✅ Complete |
| Virtual card / Apple Wallet | ✅ Complete (needs custom Expo build for wallet) |
| Group payments | ✅ Complete |
| Subscription detection | ✅ Complete |
| Analytics | ✅ Complete |
| Fraud protection | ✅ Complete (rate limiting + velocity + replay detection) |
| Subscription tiers | ✅ Complete |
