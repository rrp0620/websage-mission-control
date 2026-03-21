# Splitt Unit Economics Research
**Prepared by:** Bulma (Websage Inc. Research Agent)  
**Date:** March 20, 2026  
**For:** Frieza (CFO) — Unit Economics Modeling  
**Subject:** Fee structures, interchange revenue, competitive analysis, and break-even modeling for Splitt

---

## Executive Summary

Splitt's core problem is real but solvable. The fee math is ugly at launch — a naive implementation using Stripe for every split leg creates losses at low volume. However, the business has two structural advantages that most subscription fintech apps don't: (1) it can earn interchange revenue as the card issuer via Lithic, and (2) there's a clear transaction fee model (Kasheesh-style) that keeps the unit economics in positive territory without requiring massive subscriber scale.

**The critical insight:** Splitt should not rely purely on subscription revenue to cover per-transaction fees. The interchange income from the Lithic card is substantial and can partially offset processing costs. The remaining gap is bridged by a per-split transaction fee (0.5%–1%) or by charging a subscription price that reflects the actual cost of splits.

Break-even estimates (detailed below):
- At **$9.99/month**, Splitt needs roughly **600–800 MAU** to cover fixed costs if using a hybrid fee model
- At **$14.99/month**, break-even drops to **~400 MAU** with optimized processing
- Pure subscription at $4.99/month likely never works at sub-5,000 MAU without additional revenue streams

---

## Section 1: Lithic Fee Structure

### What Lithic Charges Splitt

Lithic's public pricing page redirects to a contact-sales flow, and specific per-transaction rates are not publicly listed — they're negotiated based on program type and volume. However, from developer community sources, G2 reviews, and Lithic's own blog, the following is well-established:

**Lithic Program Types (three tiers):**
1. **Sandbox / Developer Tier:** Free for testing. No card issuance fees until you go live.
2. **Standard Card Program (Lithic as BIN sponsor):** Lithic acts as sponsor bank. Developers get a rev-share on interchange, but Lithic keeps a larger cut. This is the default path for early-stage startups.
3. **Processor-Only Program:** You bring your own sponsor bank (e.g., a community bank partner). Lithic acts as processor only. You keep more interchange but need a banking partner. Reserved for larger programs.

**Key fees (estimated from public sources and developer community):**
- **Virtual card issuance:** ~$0.00–$0.10 per card created (often waived for virtual cards on standard program)
- **Per-transaction fee:** ~$0.00–$0.02 per authorization (varies by tier; many early programs pay nothing per transaction and instead share interchange)
- **Monthly minimum:** Lithic has publicly stated "no expensive monthly fees" — G2 reviews confirm no platform fee for early-stage programs. Enterprise programs likely have minimums, but starter programs appear fee-free or very low
- **Physical card:** ~$2–$5 per card (not relevant for Splitt's virtual card use case)

**What Lithic Does NOT Charge Splitt For:**
- KYC/identity checks (handled via Lithic's built-in compliance stack)
- Fraud monitoring (included)
- Card network integrations (Visa/Mastercard)

**Bottom line for Splitt:** At launch, Lithic's direct charges to Splitt are likely minimal (near zero per transaction) if on a standard program. The cost is paid in the form of a smaller interchange share.

---

## Section 2: Interchange Revenue — The Good News

### How Interchange Works in Splitt's Model

When a user taps their Splitt virtual card (issued by Lithic/Visa or Mastercard), Splitt is the **issuer**. The merchant's bank (acquirer) pays interchange to the issuer for every transaction.

**Interchange flow:**
1. User taps Splitt card at restaurant for $100
2. Merchant's acquirer collects $100 from customer
3. Acquirer pays interchange to issuer (Splitt/Lithic) — typically **1.5%–2.5%** of transaction
4. Card network (Visa/MC) takes its cut (~0.13%–0.15%)
5. Lithic takes its processing margin
6. Splitt receives its share

**What Splitt actually earns per $100 transaction:**

From Lithic's own blog: "By launching your own card product, you can capture **150–200 basis points (bps)** on customer transactions rather than letting it go to the pockets of the traditional card issuing banks."

In practice, for a startup on Lithic's standard (sponsor bank) program, the net to Splitt after Lithic's cut is typically **0.5%–1.5%** of transaction value depending on:
- Card type (prepaid vs. debit vs. credit — Splitt's is likely prepaid or debit)
- Merchant category (restaurants earn higher interchange than grocery)
- Sponsor bank arrangement

**Key nuance — Durbin Amendment:**
- Banks with **>$10B in assets** are subject to Durbin caps: debit interchange capped at $0.21 + 0.05% per transaction
- Banks with **<$10B in assets** (community banks, which Lithic uses) are **exempt** from Durbin caps and earn full interchange (~1.5%–2%)
- Lithic's sponsor bank is small, so Splitt earns **full (uncapped) debit interchange** — a significant structural advantage

**Commercial/Prepaid BINs earn even more:** Per Lithic's interchange guide, commercial prepaid BINs earn the highest interchange of all card types. If Splitt structures its card as a commercial prepaid (which is technically accurate — it's an intermediary card), rates could be **1.5%–2.5%**.

**Estimated Interchange Revenue for Splitt:**
- Per $100 spend: $0.75–$1.50 net to Splitt (after Lithic's cut)
- Average user spending $500/month → $3.75–$7.50/month in interchange per active user
- Average user spending $1,000/month → $7.50–$15.00/month in interchange per active user

This is HUGE. At $1,000/month in user spend, interchange alone could cover subscription costs at the right price point.

---

## Section 3: The Stripe Fee Problem — Split Legs

### Current Fee Structure (Stripe Standard)

When Splitt splits a $100 restaurant charge across two real credit cards (e.g., $60 to Chase Sapphire, $40 to Amex Gold), it creates **two Stripe charges**:

**Leg 1: $60 charge to Chase Sapphire**
- Stripe fee: 2.9% + $0.30 = $2.04

**Leg 2: $40 charge to Amex Gold**
- Stripe fee: 2.9% + $0.30 = $1.46

**Total Stripe processing cost: $3.50 on a $100 transaction = 3.5%**

Compare this to a single charge: $3.20 on $100 = 3.2%

The additional $0.30 fixed fee per leg is the killer at low transaction amounts. A $20 split creates disproportionate costs.

### Stripe Volume Discounts

- Standard rate: 2.9% + $0.30
- Custom pricing available when processing **$1M+ in annual volume**
- High-volume merchants reportedly negotiate down to **1.5%–2.5%** (Vendr/CostBench data)
- No automatic volume discounts below $1M/year
- **At 1,000 MAU doing $500/month each = $500K/month = $6M/year**: You could negotiate with Stripe

### Stripe for Subscription Revenue (Different Problem)

Splitt's subscription charge to users (e.g., $9.99/month) also goes through a payment processor. If using Stripe Billing:
- 0.5%–0.8% additional on top of processing for Stripe Billing
- Or standard 2.9% + $0.30 per subscription charge

This is a separate, unavoidable cost but relatively small per user.

---

## Section 4: Cheaper Alternatives to Stripe for Split Legs

The key question: can Splitt use a cheaper processor for the secondary charge legs?

### Option A: Adyen
**Pricing model:** Interchange++ (pass-through interchange + processing margin)
- Processing fee: **$0.13 per transaction + interchange + 0.60%**
- US Visa/MC credit cards: interchange (1.5%–2.5%) + 0.13 + 0.60% ≈ **2.1%–3.1% + $0.13**
- Compared to Stripe: often cheaper for high-volume, but minimum volume requirements apply
- **Minimum:** Adyen requires significant monthly volume to get approved — not suitable for early-stage at <$100K/month
- **Verdict:** Better unit economics at scale (10K+ MAU), but not accessible at launch

### Option B: Braintree (PayPal)
**Pricing:** 2.59% + $0.49 per credit/debit card transaction (as of 2025)
- No monthly fee
- Interchange-plus pricing available at **$100K+/month**
- **Important note:** Braintree is PayPal-owned and has been deprioritizing small merchants. Getting merchant accounts approved is harder
- **Verdict:** Slightly cheaper than Stripe on percentage (2.59% vs 2.9%) but higher fixed fee ($0.49 vs $0.30). Worse for small splits, similar for large ones

### Option C: Finix
**Pricing model:** Interchange-plus with monthly subscription
- Monthly platform fee (reportedly ~$250–$500/month depending on tier)
- Interchange + 0.25%–0.35% + $0.08–$0.15 per transaction
- **Breaks even vs. Stripe at ~$40K–$60K/month in processing volume**
- **Verdict:** Excellent at mid-scale (1,000–10,000 MAU); terrible at launch due to monthly minimum

### Option D: Helcim
- Interchange-plus pricing, automatic volume discounts at $50K+/month
- No monthly fee until scale
- ~1.92% + $0.08 for in-person card-present; online slightly higher
- **Verdict:** Good option for early-to-mid stage, no monthly minimums, but API less developer-friendly

### Option E: Square / Checkout.com
- Square: 2.9% + $0.30 (same as Stripe), not designed for card-on-file split charging
- Checkout.com: Enterprise-focused, requires high volume

### Option F: ACH as Alternative for Some Legs

Here's an underexplored idea: **Can Splitt use ACH (bank debit) instead of credit card charges for some split legs?**

- ACH via Stripe: **0.8% capped at $5** (vs. 2.9% + $0.30 for credit cards)
- Problem: Users want to use their credit cards for rewards — that's the whole point of Splitt. Forcing ACH defeats the purpose
- **Possible exception:** If user adds their checking account as a "budget allocation" leg, ACH would be massively cheaper

### Option G: Marqeta (for the issuer side)

Marqeta is Lithic's main competitor for card issuing:
- Also charges per-transaction fees and shares interchange
- More expensive than Lithic for small programs (Marqeta charges per authorization)
- Better for very large programs (Cash App, DoorDash use Marqeta)
- **Verdict:** Stick with Lithic for Splitt's scale

### Recommended Strategy: Stripe at Launch → Finix/Adyen at Scale

| Volume | Processor | Est. Rate |
|--------|-----------|-----------|
| 0–$100K/month | Stripe | 2.9% + $0.30/leg |
| $100K–$500K/month | Stripe (negotiate) or Helcim | 2.0%–2.5% + $0.15 |
| $500K+/month | Finix or Adyen | IC+ 0.5% + $0.10/leg |

---

## Section 5: The Critical Question — Does the Math Work?

### Modeling Per-Transaction Economics

**Assumptions (baseline scenario):**
- Average transaction: $75
- Average split: 2 legs per transaction
- Interchange earned by Splitt: 1.0% net (conservative, after Lithic cut)
- Stripe fees per leg: 2.9% + $0.30

**Revenue per $75 transaction:**
- Interchange earned: $75 × 1.0% = **$0.75**

**Costs per $75 transaction (2 Stripe legs: ~$37.50 each):**
- Leg 1: 2.9% × $37.50 + $0.30 = $1.09 + $0.30 = **$1.39**
- Leg 2: 2.9% × $37.50 + $0.30 = $1.09 + $0.30 = **$1.39**
- Total Stripe cost: **$2.78**

**Net cost per transaction (excluding subscription): -$2.03**

This is the problem. Without subscription revenue, every split loses $2.03.

**Now add subscription revenue:**

If a user transacts 20 times/month:
- Monthly Stripe cost: 20 × $2.78 = **$55.60**
- Monthly interchange earned: 20 × $0.75 = **$15.00**
- Net transaction cost: **$40.60/user/month**

A $9.99/month subscription covers only 25% of per-user costs. This doesn't work.

**BUT: If users spend more per transaction (avg. $150, 3 legs):**
- Interchange: $150 × 1.0% = $1.50
- 3 Stripe legs at $50 each: 3 × (2.9% × $50 + $0.30) = 3 × ($1.45 + $0.30) = **$5.25**
- Net: -$3.75 per transaction × 20 = -$75/month
- Subscription still doesn't cover it

**The Real Insight: You can't cover per-leg Stripe charges with subscription revenue alone at any reasonable price point.**

---

## Section 6: How Competitors Solve This

### Kasheesh — The Direct Analog

Kasheesh is Splitt's closest public competitor. Their solution is elegant:

**What they charge:**
- **2% service fee on every transaction** (charged to the user, not taken from the split)
- Net result: On a $100 split, user pays $102. Kasheesh takes $2.
- They also offer 1%–1.5% rewards back, so effective net fee to user = 0.5%–1%

**Why this works economically:**
- $100 transaction: Kasheesh takes $2.00 in fees
- Stripe-style processing for 2 legs (say $60/$40): ~$2.80 in processing costs
- Interchange earned by Kasheesh as issuer: ~$0.75–$1.50
- Net: $2.00 (fee) + $1.00 (interchange) - $2.80 (processing) = **$0.20–$1.20 gross profit per transaction**
- Thin but positive, and it scales with volume

**The tradeoff:** Kasheesh doesn't do rewards optimization for users. Splitt's value prop (maximize rewards) is better, which may justify a subscription OR a transaction fee.

### Curve (UK-based)

Curve's model:
- Free tier with 3 linked cards; paid tiers at £4.99, £9.99, £14.99/month
- **Charges the user's linked card** when the Curve card is swiped — similar mechanic
- Revenue: interchange on the Curve card + subscription fees
- Key difference: In EU, interchange is capped at 0.3% (consumer debit) — Curve earns much less interchange than a US company would
- Curve has raised $1.2B+ and reportedly burned heavily; the EU interchange cap makes their model harder
- **US-based Splitt has a structural advantage over Curve** due to uncapped interchange

**How Curve survives:** Premium subscriptions ($9.99–$14.99/month) + interchange + BNPL (Flex product) + FX fees

### Expensify / Ramp / Brex (B2B Angle)

Corporate card products earn **1.5%–2.5% interchange on all spend** with minimal processing costs because the card IS the payment method. They don't have the split-leg problem. Relevant for Splitt's corporate card market opportunity (see Section 7).

---

## Section 7: Creative Launch Strategies to Offset Fees

### Strategy 1: Transaction Fee Model (Most Viable)

Charge a **per-split fee** on top of subscription, or make it the primary revenue model:

**Option A: Kasheesh clone** — 1%–2% on every transaction, no subscription
- Pro: Scales with usage, users pay for value
- Con: Users comparing to Kasheesh lose if Kasheesh is 2% and Splitt is 2%

**Option B: Hybrid** — Low subscription ($4.99/month) + small per-split fee (0.3%–0.5%)
- User pays $4.99/month + $0.15 per split on a $50 leg
- This partially covers the Stripe fixed fee problem
- 20 transactions/month: $4.99 + $3.00 in split fees = $7.99 effective monthly revenue
- With interchange: +$15.00/month
- Total: ~$22.99/month revenue per user

**Option C: "Splits included" tiers** — Price tiers based on monthly split volume:
- Free: 5 splits/month ($0)
- Basic ($4.99): 25 splits/month  
- Pro ($9.99): 75 splits/month
- Premium ($14.99): Unlimited splits

This frames cost correctly (users who split more pay more) and doesn't require complex per-transaction billing.

### Strategy 2: Rewards Affiliate Partnerships

Splitt's most unique asset: it knows exactly which credit cards users hold and their rewards categories.

**Monetization ideas:**
- **Card recommendation affiliate revenue:** Partner with Chase, Amex, Capital One. When Splitt's algorithm identifies a user would earn significantly more with a different card, show a targeted recommendation. Affiliate referral fees: **$50–$200 per approved card application** (standard for credit card affiliate programs via CardRatings, NerdWallet, etc.)
- **Affiliate networks:** Apply directly to Amex, Chase, and Capital One affiliate programs (they run through Commission Junction/Impact)
- **Revenue potential:** Even at 100 MAU, converting 5%/month to a new card recommendation = 5 cards × $100 average = $500/month supplemental revenue
- At 10,000 MAU: $50,000/month just from card referrals

**This is a massive, underutilized revenue stream for Splitt.**

### Strategy 3: Premium Data / Spend Analytics

Users connecting all their cards creates a rich spending dataset:
- Aggregate (anonymized) spend patterns by category
- "You're leaving $47/month in unclaimed rewards" personalized insights
- Premium tier: detailed rewards optimization reports
- Partner with personal finance brands (Credit Karma-style partnerships)

### Strategy 4: Waitlist Monetization

Pre-launch strategies:
- **Founding Member pricing:** Lock in lifetime deal at $2.99/month or one-time $99 founding fee
- **Referral program:** "Refer 3 friends, get 3 months free" — drives viral growth pre-launch
- **Waitlist data:** Even 1,000 emails before launch validates the product and helps negotiate better terms with processors

### Strategy 5: Corporate Card / Business Market

The most underexplored opportunity in Splitt's model:

**The problem it solves for businesses:**
- Finance teams want to spread corporate purchases across multiple vendor cards to hit minimum spend for bonuses
- Startups want to use multiple cards to maximize perks without losing track
- Consultants and freelancers want to allocate expenses across client-specific cards

**Why the economics are much better for B2B:**
- Corporate cards earn **2%–3.5% interchange** (vs. 1.5%–2% for consumer)
- Businesses are willing to pay $20–$50/month per seat without flinching
- B2B churn is lower (5%/year vs. 30%+/year for consumer)
- At $29.99/seat with 5 business users: $150/month from one company = same as 30 consumer subscribers

**Recommendation:** Launch consumer-first for press/user feedback, but quietly build a B2B waitlist from day one.

### Strategy 6: Reduce Stripe's Per-Leg Cost

**Batch small legs:** Instead of charging $18 to Amex and $22 to Chase in real-time, batch micro-charges and process them in fewer, larger transactions. This reduces the fixed $0.30 × N legs problem.

**Technical implementation:** 
- Hold split authorizations in memory for 24 hours
- Combine multiple small charges to the same card into a single daily/weekly settlement
- One charge to Chase ($180) instead of 6 charges to Chase ($30 each)
- Savings: 5 × $0.30 = $1.50 per user per day

**Caveat:** This introduces complexity and potential settlement risk. Explore with a payment lawyer first.

---

## Section 8: Break-Even Analysis by MAU

### Assumptions for Modeling

**Revenue sources:**
- Subscription revenue (per tier)
- Interchange: $0.75/transaction net (conservative)
- No affiliate revenue (conservative base case)

**Cost structure:**
- Stripe per-split processing: $2.80 per transaction (2 legs, avg. $75 transaction)
- Lithic: ~$0 marginal per transaction (bundled in interchange share)
- Fixed costs (hosting, support, compliance): ~$2,000–$3,000/month at launch
- Salary/founder draws: excluded (pre-revenue modeling)

**Usage assumption:** 20 transactions/month per active user (realistic for someone who uses it regularly)

---

### Scenario A: Subscription Only ($9.99/month)

| MAU | Monthly Sub Revenue | Monthly Interchange | Monthly Stripe Costs | Fixed Costs | Net Profit |
|-----|--------------------|--------------------|---------------------|-------------|------------|
| 100 | $999 | $1,500 | $5,600 | $2,500 | **-$5,601** |
| 500 | $4,995 | $7,500 | $28,000 | $2,500 | **-$18,005** |
| 1,000 | $9,990 | $15,000 | $56,000 | $2,500 | **-$33,510** |
| 10,000 | $99,900 | $150,000 | $560,000 | $5,000 | **-$315,100** |

**Verdict:** Pure subscription at $9.99 with no transaction fee never breaks even because processing costs scale faster than subscription revenue. The model is fundamentally broken at these transaction volumes.

---

### Scenario B: Subscription + 0.5% Per-Split Fee ($9.99/month + 0.5% per leg)

Adding a 0.5% fee on each split leg changes everything:
- Per $75 transaction (2 legs at $37.50 each): user pays $0.38 in fees
- Per user per month (20 transactions): $7.50 in extra fees

| MAU | Sub Rev | Split Fees | Interchange | Stripe Costs | Fixed | Net |
|-----|---------|------------|-------------|--------------|-------|-----|
| 100 | $999 | $750 | $1,500 | $5,600 | $2,500 | **-$3,851** |
| 500 | $4,995 | $3,750 | $7,500 | $28,000 | $2,500 | **-$14,255** |
| 1,000 | $9,990 | $7,500 | $15,000 | $56,000 | $2,500 | **-$26,010** |
| 10,000 | $99,900 | $75,000 | $150,000 | $560,000 | $5,000 | **-$240,100** |

**Still broken.** Stripe's per-leg cost is too high.

---

### Scenario C: $14.99/month Subscription + 1.5% Per-Split Fee (Kasheesh-Style) + Interchange

This is the model that actually works:

Key change: **Charge a 1.5% fee on each split transaction** (similar to Kasheesh's 2%, but more user-friendly if pitched correctly).

Per $75 transaction (2 legs):
- User fee collected: $75 × 1.5% = $1.13
- Interchange earned: $0.75
- Stripe cost: $2.78
- Net per transaction: $1.13 + $0.75 - $2.78 = **-$0.90**

Per user/month (20 transactions): $18.00 subscription + $22.50 fees + $15.00 interchange - $55.60 Stripe = **-$0.10 ≈ break-even at transaction level**

| MAU | Sub Rev | 1.5% Fees | Interchange | Stripe Costs | Fixed | Net |
|-----|---------|-----------|-------------|--------------|-------|-----|
| 100 | $1,499 | $2,250 | $1,500 | $5,600 | $2,500 | **-$2,851** |
| 300 | $4,497 | $6,750 | $4,500 | $16,800 | $2,500 | **-$3,553** |
| 500 | $7,495 | $11,250 | $7,500 | $28,000 | $2,500 | **-$4,255** |
| 1,000 | $14,990 | $22,500 | $15,000 | $56,000 | $2,500 | **-$6,010** |
| 5,000 | $74,950 | $112,500 | $75,000 | $280,000 | $5,000 | **-$22,550** |
| 10,000 | $149,900 | $225,000 | $150,000 | $560,000 | $8,000 | **-$43,100** |

**Still losing money!** The Stripe per-leg fee is the fundamental problem that doesn't go away at this volume.

---

### The Real Breakeven: Scenario D — Raise the Transaction Fee (2%) + Optimized Processing

If Splitt charges **2% on transaction value** (same as Kasheesh), the math changes:

Per $75 transaction (2 legs):
- User fee: $75 × 2% = $1.50
- Interchange: $0.75
- Stripe cost: $2.78
- Net per transaction: $1.50 + $0.75 - $2.78 = **-$0.53**

Per user/month (20 transactions): $14.99 sub + $30 fees + $15 interchange - $55.60 Stripe = **+$4.39 contribution margin per user**

| MAU | Sub Rev | 2% Fees | Interchange | Stripe Costs | Fixed | Net |
|-----|---------|---------|-------------|--------------|-------|-----|
| 100 | $1,499 | $3,000 | $1,500 | $5,600 | $2,500 | **-$2,101** |
| 300 | $4,497 | $9,000 | $4,500 | $16,800 | $2,500 | **-$1,303** |
| 570 | ~$8,550 | ~$17,100 | ~$8,550 | ~$31,920 | $2,500 | **≈ $0 (Break-even)** |
| 1,000 | $14,990 | $30,000 | $15,000 | $56,000 | $2,500 | **+$1,490** |
| 5,000 | $74,950 | $150,000 | $75,000 | $280,000 | $5,000 | **+$14,950** |
| 10,000 | $149,900 | $300,000 | $150,000 | $560,000 | $8,000 | **+$31,900** |

**Break-even at ~570 MAU with $14.99 subscription + 2% transaction fee.**

---

### Scenario E: Optimized Processing (Finix at $500K+/month) at 10K MAU

At 10,000 MAU, Splitt processes ~$15M/month in transactions. At this scale, Finix/Adyen becomes viable:

- Finix: IC+ 0.35% + $0.10/leg ≈ 2.0% + $0.10 average (vs. 2.9% + $0.30 Stripe)
- Savings per $75 transaction (2 legs): 
  - Stripe: $2.78 → Finix: ~$1.70 
  - Save: **$1.08/transaction**
  - 10,000 users × 20 transactions = $216,000/month in Stripe savings

At 10K MAU with optimized processing + 2% user fee + $14.99 subscription + interchange:
- **Net profit: ~$247,900/month** (vs. $31,900 with Stripe)

---

## Section 9: What Subscription Price Actually Works?

### Summary by MAU Stage

| Stage | MAU | Best Model | Min Price Point | Notes |
|-------|-----|-----------|----------------|-------|
| Launch | 100 | $14.99/mo + 2% fee | **Lose ~$2K/month** | Unavoidable at this scale |
| Early | 500 | $14.99/mo + 2% fee | **Break even at 570** | Nearly there |
| Growth | 1,000 | $9.99/mo + 2% fee | **+$500/mo profitable** | Subscription can flex down |
| Scale | 10,000 | $9.99/mo + 2% fee | **+$180K/mo** | Switch processors here |

**Recommended Pricing:**
- **Founding Member tier:** $7.99/month (locked in for life) + 1.5% split fee — drives waitlist conversion
- **Standard tier:** $12.99/month + 1% split fee
- **Power tier:** $19.99/month + unlimited splits, no per-split fee (for high-volume users)

**Key: The "no split fee" premium tier only works if users at $19.99/month transact less than ~$1,333/month (otherwise the split fee revenue would have exceeded $13.33 which is the implied cost of "unlimited").**

---

## Section 10: Red Flags and Risk Factors for Frieza's Model

1. **User transaction volume is everything.** A user who splits 5 times/month is unprofitable. A user who splits 50 times/month is very profitable. Splitt needs high-engagement users.

2. **Stripe's $0.30 fixed fee kills micro-splits.** If users split $10 charges, each leg costs $0.59 in Stripe fees on a $5 leg. Splitt should set a **minimum transaction size** (e.g., $10 per leg minimum).

3. **Credit card surcharge legality.** Kasheesh's 2% fee is positioned as a "service fee," not a credit card surcharge (which is regulated differently by state). Splitt should consult a payment attorney on fee disclosure language. Some states have restrictions on surcharges.

4. **Interchange risk with credit cards held by users.** The Lithic card earns interchange because it's the presenting card at the merchant. The charges to users' real credit cards (Chase, Amex) are processed through Stripe — Splitt does NOT earn interchange on those charges. Only the Lithic-issued swipe earns interchange.

5. **Amex cards as split legs.** Amex has historically restricted how merchants can accept its cards and has "closed loop" dynamics. Charging a user's Amex card via Stripe may incur higher rates (Amex typically ~3.5% vs 2.9%). Splitt should model Amex at a higher processing cost.

6. **Chargeback risk.** If a user disputes a charge on their "real" card (Chase Sapphire), the chargeback flows back through Stripe to Splitt. With split transactions, this creates reconciliation complexity. Build a chargeback reserve fund.

7. **Network rules on double-charging.** Visa/Mastercard network rules prohibit certain types of pass-through charging schemes. Splitt's structure (user taps Lithic card → app charges user's real cards) should be reviewed with a payment attorney to ensure it doesn't violate card network policies. Curve has had issues with this in the UK.

---

## Section 11: Recommended Investor Narrative for Unit Economics

For Frieza to model this cleanly, here's the narrative arc:

**Phase 1 (0–570 MAU): Subsidized by founders**
- Accept that every user costs ~$2–4/month net
- Total monthly burn from transaction economics: $1,000–$2,000 (manageable pre-seed)
- Focus on proving engagement metrics (splits per user, retention)

**Phase 2 (570–2,000 MAU): Near break-even to profitable**
- Break-even crossed at ~570 MAU with the $14.99 + 2% model
- Start building affiliate card recommendation engine

**Phase 3 (2,000–10,000 MAU): Profitable and re-investing**
- Begin Stripe → Finix/Adyen migration above $500K/month in processing
- Affiliate revenue becomes material ($20,000–$100,000/month)
- Consider raising institutional round here

**Phase 4 (10,000+ MAU): Processor arbitrage unlocked**
- Full Finix/Adyen migration saves ~$1M+/month vs. Stripe
- Corporate card program launched
- Unit economics rival a debit card fintech (80%+ gross margins on subscription, 20%+ on transactions)

---

## Section 12: Recommended Next Steps for Rishi

1. **Talk to Lithic sales immediately.** Request a sandbox account and ask specifically: (a) what interchange share does Splitt get on a standard debit prepaid program, (b) is there a monthly minimum, (c) are there per-card-creation fees. Lithic is founder-friendly and moves fast.

2. **Model three pricing scenarios for Frieza:** (a) pure subscription at $14.99, (b) subscription + 1% split fee, (c) subscription + 2% split fee. The numbers above are the starting point.

3. **Legal review of the transaction structure.** The double-charge mechanic (Lithic card + Stripe charges to real cards) needs network rule compliance review. This is priority before launch.

4. **Start a waitlist.** Even 500 email signups changes the negotiating position with Lithic and potential seed investors.

5. **Build the card recommendation affiliate engine in parallel.** This is a second revenue stream that requires zero additional infrastructure (Splitt already knows which cards users hold) and could add $50–$200 per referred card application.

6. **Set minimum transaction sizes.** $15 minimum per split leg to avoid math-destroying micro-transactions.

---

## Sources and Citations

- Lithic blog: "What is Interchange?" — lithic.com/blog/interchange
- Lithic blog: "Guide to Maximizing Interchange Revenue" — lithic.com/blog/maximizing-interchange
- Kasheesh pricing: kasheesh.co/how-it-works (2% service fee, 1%–1.5% rewards back)
- Kasheesh FAQ: "2% fee charged when card is successfully created"
- Stripe pricing: 2.9% + $0.30 (standard); 0.8% capped at $5 (ACH)
- Stripe custom pricing: negotiable at $1M+ annual volume, ~1.5%–2.5% (Vendr, CostBench)
- Adyen pricing: adyen.com/pricing — $0.13 + IC+ 0.60% for US cards
- Braintree: 2.59% + $0.49 standard; IC+ available at $100K+/month
- Finix: IC+ model, monthly subscription fee, breaks even vs. Stripe at ~$40K–$60K/month volume
- Marqeta: charges per-authorization, not recommended for early-stage programs
- Curve business model: productmint.com — subscriptions + interchange + BNPL
- Durbin Amendment: Visa/MC debit interchange capped at $0.21 + 0.05% for banks >$10B assets; community banks (Lithic's sponsors) exempt
- Interchange rates: 1.5%–2.5% credit, 1.15%–1.5% debit (uncapped community bank), 0.5%–1.5% net to issuer fintech after processor cut
- Credit card affiliate programs: $50–$200 per approved application (Tapfiliate, Affilimate, CardRatings)
- Marqeta guide to card program costs: marqeta.com/uk/demystifying-cards-guide/costs-of-card-programme

---

*Report prepared March 20, 2026. Fee structures are subject to change. Verify all rates directly with vendors before finalizing Frieza's model. Recommend Rishi confirm Lithic interchange share via direct sales conversation.*
