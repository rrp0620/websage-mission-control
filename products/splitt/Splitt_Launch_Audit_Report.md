# Splitt Launch Readiness Audit

**Date:** March 7, 2026
**Prepared for:** Rishi Patel, Founder
**Prepared by:** Technical Co-Founder (AI)

---

## Executive Summary

Splitt has a **substantial amount of code written** across backend, web dashboard, and mobile app. However, there are **critical gaps that would prevent a real user from completing the core journey**: sign up, link cards, set up a split, and make a purchase. The biggest issues are broken frontend-to-backend connections, a missing Stripe Elements integration on web, no web onboarding flow, and several API response format mismatches. Below is a full breakdown.

---

## 1. What Currently Exists

### Backend (splitpay-backend) - STRONG
The backend is the most complete part of the product. It includes 9 route files (4,614 lines), 8 service files (2,154 lines), fraud protection middleware, Sentry monitoring, and a two-phase commit charging system. The core split engine, rewards optimizer, routing rules, subscription detection, and group expenses are all implemented.

**Verdict:** Backend is 85-90% launch-ready.

### Web Dashboard (splitt-web) - PARTIALLY CONNECTED
11 pages exist with 3,395 lines of page code, a sidebar, auth context, and 27 API wrapper functions. The landing page with waitlist, login/signup, and full dashboard UI are built.

**Verdict:** UI is built, but wiring to the backend has critical gaps (see Section 2).

### Mobile App (splitt-app) - UI COMPLETE, UNTESTED INTEGRATION
16 screens, 30+ components, React Navigation, Expo SDK 54, and Stripe React Native SDK. Onboarding flow exists (Welcome, Add Cards, Setup Rule).

**Verdict:** UI is built. Integration testing and App Store deployment not started.

### Database (Supabase) - COMPLETE
Base schema plus 6 migrations covering rewards, routing, subscriptions, groups, and analytics tables.

**Verdict:** Schema is ready. Needs production environment setup.

---

## 2. Critical Gaps Blocking Launch

### GAP 1: Add Card Flow is a Placeholder (WEB)
**Severity: BLOCKER**

In `CardsPage.jsx` (line 200-206), the "Add Card with Stripe" button literally shows an `alert()` saying "Stripe payment form would open here. This is a placeholder." There is no Stripe Elements integration on the web dashboard. Without this, users cannot link their credit/debit cards, which means the entire product doesn't function.

**What's needed:** Integrate `@stripe/react-stripe-js` with a SetupIntent flow. The backend endpoint (`POST /api/users/:userId/setup-intent`) already exists and returns a `clientSecret`. The web just needs to use it.

### GAP 2: API Response Format Mismatches (WEB)
**Severity: BLOCKER**

The API returns data wrapped in named objects (e.g., `{ paymentMethods: [...] }`, `{ transactions: [...] }`), but several frontend pages expect flat arrays. For example:

- `CardsPage.jsx` line 18: `const data = await getPaymentMethods(user.id)` then `setCards(data)` - but the API returns `{ paymentMethods: data }`, so `cards` would be `{ paymentMethods: [...] }` instead of an array.
- `HomePage.jsx` line 28-33: `Promise.all()` destructures results as `[transactions, cards, rules, groups]`, but each API call returns a wrapped object, not a flat array.
- `HomePage.jsx` line 37: `transactions.reduce((sum, tx) => sum + tx.amount, 0)` - but the transaction object uses `total_amount_cents`, not `amount`.
- `CardsPage.jsx` line 39: `deletePaymentMethod(cardId)` - but the API expects `deletePaymentMethod(userId, pmId)`.
- `CardsPage.jsx` line 97-98: references `card.brand` but the DB field is `card_brand`. References `card.expiry` and `card.cardholder_name` which don't exist in the schema.

These mismatches mean most dashboard pages would crash or show empty data even if the backend is running perfectly.

### GAP 3: No Web Onboarding Flow
**Severity: HIGH**

When a new user signs up on web and lands on the dashboard, there's no guided setup. They see an empty dashboard with 11 sidebar items and no indication of what to do first. Compare this to the mobile app which has a 3-step onboarding (Welcome, Add Cards, Setup Rule).

**What's needed:** A first-time user experience that walks through: (1) Add your first card, (2) Set up your first split rule, (3) Get your virtual card. This could be a modal wizard, a dedicated route, or inline prompts on the homepage.

### GAP 4: Landing Page Routes to Login, Not Signup
**Severity: MEDIUM**

The landing page's "Get Started" and pricing CTAs all link to `/login`. New users who click "Get Started Free" are shown a login form, not a signup form. The signup page exists at `/signup` but isn't linked from the landing page CTAs.

### GAP 5: Homepage Quick Action Links Are Wrong
**Severity: LOW-MEDIUM**

`HomePage.jsx` line 184: links to `/routing` but the actual route is `/routing-rules`. Uses `<a href>` tags instead of React Router `<Link>` components, which causes full page reloads instead of SPA navigation.

### GAP 6: No Password Reset / Forgot Password
**Severity: MEDIUM**

The login page has no "Forgot password?" link. Supabase Auth supports password reset out of the box, but it's not wired up. Users who forget their password have no way to recover their account.

### GAP 7: Virtual Card Page - No Stripe Issuing Test Flow
**Severity: MEDIUM**

The Virtual Card setup page collects first name, last name, and address, but the actual Stripe Issuing cardholder creation and card issuance hasn't been tested end-to-end in test mode. The backend endpoint exists, but the web form may not send the exact fields the backend expects.

### GAP 8: No Email Verification Flow
**Severity: MEDIUM**

Supabase Auth sends a confirmation email by default, but the app has no handling for unverified emails. A user could sign up, not verify, and get stuck. Need either: (a) disable email verification in Supabase for MVP, or (b) add a "check your email" screen after signup.

### GAP 9: No Error Boundaries
**Severity: MEDIUM**

If any API call fails (network error, server down, etc.), most pages just show a generic error string. There's no React Error Boundary wrapping the app, so an unhandled exception in any component crashes the entire dashboard to a white screen.

### GAP 10: No Loading States After Auth Resolution
**Severity: LOW-MEDIUM**

The `AuthContext` resolves the Supabase session, then calls `getUserByAuthUid` to find the DB user. If the DB user doesn't exist yet (race condition on signup), it silently sets `user` to null. The `ProtectedRoute` only checks for `session`, not `user`, so a user can reach the dashboard with `user = null`, causing every API call to fail because `user.id` is undefined.

---

## 3. Missing Features for a Complete Launch

### Must-Have for Launch

1. **Stripe Elements on Web** - Users need to actually link cards
2. **Fix all API response format mismatches** - Dashboard needs to actually display data
3. **Web onboarding wizard** - Guide new users through setup
4. **Password reset flow** - Basic account recovery
5. **Fix signup CTA links** - Landing page should link to signup
6. **Error boundaries and graceful error handling** - Prevent white-screen crashes
7. **End-to-end test of the core flow** - Sign up, link card, create split, simulate transaction
8. **Production deployment** - Backend on Railway, Web on Vercel/Netlify, real Stripe keys

### Should-Have for Launch

9. **Email verification handling** - Either disable or add UI for it
10. **Loading skeletons** - Replace "Loading..." text with proper skeleton UI
11. **Mobile-responsive web dashboard** - The sidebar hides on mobile but the hamburger menu may not work
12. **Terms of Service and Privacy Policy pages** - Required before handling real money
13. **Stripe webhook endpoint verification** - Ensure the Railway deployment URL matches Stripe's webhook config

### Nice-to-Have Post-Launch

14. **Apple Wallet / Google Pay provisioning** - Virtual card in mobile wallets
15. **Push notifications for transactions** - Real-time alerts
16. **Dark/light mode toggle** - Dashboard is currently dark-only
17. **Profile page with name/avatar** - Currently just shows email initial
18. **Transaction search and filtering** - Currently shows last 50 only

---

## 4. User Journey Wireframe - What Should Happen

### Flow 1: New User (Web)

```
Landing Page (/landing)
    |
    v
"Get Started Free" button
    |
    v
Sign Up Page (/signup) <-- currently goes to /login, needs fix
    |
    v
[Email verification - optional for MVP]
    |
    v
Onboarding Wizard (NEW - doesn't exist yet)
    |
    Step 1: "Welcome to Splitt" - explain the product
    Step 2: "Link Your First Card" - Stripe Elements form
    Step 3: "Set Up Your First Split" - simple 2-card split
    Step 4: "Get Your Splitt Card" - virtual card setup
    |
    v
Dashboard (/) - shows stats, recent activity, quick actions
```

### Flow 2: Returning User

```
Landing Page or direct URL
    |
    v
Login Page (/login)
    |
    v
Dashboard (/) - personalized with their data
    |
    v
Can navigate to any feature via sidebar
```

### Flow 3: Making a Purchase (The Core Value)

```
User taps Splitt virtual card at checkout (online or in-store)
    |
    v
Stripe fires issuing_authorization.request webhook
    |
    v
Backend receives it in <300ms
    |
    v
Split Engine calculates: Card A = $25 (stipend), Card B = $35 (personal)
    |
    v
Approve transaction for full amount on Splitt card
    |
    v
Async: Charge Card B for $35 via Stripe PaymentIntent
    |
    v
Log everything in split_transactions + split_transaction_legs
    |
    v
User sees split breakdown in Transactions page
```

---

## 5. Priority Action Plan

### Phase A: Fix the Wiring (1-2 days)
These are code fixes, not new features. They make what's already built actually work.

1. Fix all API response destructuring across every web page (unwrap `.paymentMethods`, `.transactions`, `.rules`, etc.)
2. Fix field name mismatches (`amount` vs `total_amount_cents`, `brand` vs `card_brand`, etc.)
3. Fix `deletePaymentMethod` call signature (add userId)
4. Fix homepage quick action links (`/routing` to `/routing-rules`, use `<Link>` not `<a>`)
5. Fix landing page CTAs to link to `/signup`

### Phase B: Add Card Flow (1-2 days)
The single most important missing piece.

1. Install `@stripe/react-stripe-js` and `@stripe/stripe-js` in splitt-web
2. Build a `CardSetupForm` component using Stripe's `CardElement`
3. Wire it to `createSetupIntent` API call, then `saveStripePaymentMethod` on success
4. Replace the placeholder in `CardsPage.jsx` with the real form
5. Test end-to-end with Stripe test cards

### Phase C: Onboarding Wizard (1-2 days)
Guide new users so they don't bounce.

1. Create `OnboardingWizard.jsx` - a multi-step modal or page
2. Step 1: Welcome + value prop
3. Step 2: Embed the CardSetupForm from Phase B
4. Step 3: Simple split rule creation (pick 2 cards, set amounts)
5. Step 4: Virtual card setup (name + address form)
6. Track onboarding completion in user profile (add `onboarding_completed` column)
7. Show wizard on first login, skip on subsequent logins

### Phase D: Polish and Safety (1-2 days)
1. Add React Error Boundary wrapper
2. Add password reset flow (Supabase `resetPasswordForEmail`)
3. Fix auth race condition (wait for DB user before rendering dashboard)
4. Add loading skeletons to replace "Loading..." text
5. Add Terms of Service and Privacy Policy pages (even if placeholder)

### Phase E: Deploy and Test (1-2 days)
1. Deploy backend to Railway with production env vars
2. Deploy web to Vercel/Netlify
3. Configure Stripe webhooks for production URL
4. Run through complete flow: signup, add card, create split, simulate auth
5. Test edge cases: expired card, declined card, 3DS card, partial failure

---

## 6. Summary Scorecard

| Area | Status | Score |
|------|--------|-------|
| Backend API | Fully implemented, production patterns | 9/10 |
| Database Schema | Complete with migrations | 9/10 |
| Web UI (visual) | All pages built, looks good | 8/10 |
| Web UI (functional) | API mismatches, missing Stripe flow | 4/10 |
| Web Onboarding | Does not exist | 0/10 |
| Mobile App UI | All screens built | 8/10 |
| Mobile Integration | Untested end-to-end | 5/10 |
| Landing Page | Good design, wrong CTA links | 7/10 |
| Auth Flow | Works but missing password reset, email verification | 6/10 |
| Deployment | Not in production yet | 2/10 |
| **Overall Launch Readiness** | | **~55%** |

The good news: the hard parts (backend logic, split engine, two-phase commits, webhook handling) are done well. What's left is mostly frontend wiring, which is the faster part to fix. With focused effort, you could be launch-ready in 5-8 working days.
