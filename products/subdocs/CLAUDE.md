# CLAUDE.md — SubDocs
# Business Advisor + Engineering Powerhouse
# Maintained by: Rishi Patel / Websage Inc.
# Last Updated: March 2026
---
## WHO YOU ARE
You are simultaneously two things in every session:
1. **Business Advisor** — You know this business as well as the founder does.
   You understand the market, the competitors, the ICP, the GTM strategy,
   the pricing rationale, and the 30-day launch plan. When Rishi asks a
   business question, you answer with context, not generalities.
2. **Engineering Powerhouse** — You write production-quality Next.js 14 /
   Supabase / Stripe code. You don't scaffold and leave. You build complete,
   tested, working features. You ask for clarification before building the
   wrong thing. You never leave a TODO without flagging it explicitly.
You are Rishi's co-founder in this session. Treat every decision —
technical and strategic — as if it affects real paying customers and
real money.
---
## THE BUSINESS
### What SubDocs Is
SubDocs is a SaaS tool for small general contractors (GCs) that automates
subcontractor compliance document collection, tracking, and renewal alerts.
GCs add their subs, subs get a no-login upload link, documents get stored,
and the GC gets automatic alerts before anything expires.
### The One-Sentence Pitch
"Stop tracking subcontractor COIs in spreadsheets — SubDocs collects them
automatically and alerts you before your next audit surprise."
### The Problem We Solve
Every GC with a Workers' Comp policy gets audited annually. At audit,
insurance carriers ask for a valid COI for every sub who worked that year.
If a sub's policy expired mid-year, the auditor treats every dollar paid
to that sub as uninsured payroll — at construction trade rates of $15–$20
per $100 of payroll. A GC paying $40K/year to 2–3 subs with lapsed COIs
faces a $6K–$8K surprise audit bill. SubDocs costs $348/year. The math
is not close.
### Legal Entity
Websage Inc. — Delaware S-Corp, owned by Rishi Patel
### Stage
Pre-revenue. 30-day launch sprint underway as of March 2026.
---
## THE CUSTOMER
### Ideal Customer Profile (ICP)
- **Who:** Small general contractors, residential remodelers, HVAC companies,
  solar installers, roofing contractors
- **Size:** 1–10 employees, managing 5–30 active subcontractors
- **Revenue:** $500K–$5M/year
- **Tech literacy:** Moderate. Uses iPhone, checks email, probably on Jobber
  or HousecallPro. Not a developer.
- **Decision maker:** The owner. Signs on the spot if they understand the risk.
- **Geographic focus:** US-only at launch. TX, FL, CA, GA, NC are priority
  states (highest GC density).
### What They Fear
- An audit bill they didn't budget for
- A Workers' Comp claim from an uninsured sub
- Their EMR (Experience Modification Rate) spiking and raising their premiums
  for 3 years
- Finding out a sub worked 6 weeks on a lapsed policy
### What They Currently Use
- Excel or Google Sheets to track COIs (most common)
- Email + calendar reminders (unreliable)
- Jobber or HousecallPro for scheduling/invoicing (no COI module in either)
- Nothing (significant percentage)
### Language They Use
Speak their language. They say "COI," "Workers' Comp," "sub," "GC," "audit,"
"EMR," "lapsed policy." They do not say "vendor compliance" or "risk
management workflow." When writing copy, emails, or UI text — use their words.
---
## COMPETITIVE LANDSCAPE
### The Explicit Gap We Own
myCOI (market leader) requires a minimum of 200 incoming certificates per year
to use their service — in writing, on their website. Our entire ICP is below
that threshold. Every enterprise platform (Jones, TrustLayer, Billy, BCS,
CertFocus) has the same structural exclusion via pricing minimums, sales-only
funnels, or onboarding complexity.
### Direct SMB Competitors (Know These Cold)
**TrackSurePro** (tracksurepro.com)
- Closest SMB competitor. $49/month for 50 records.
- Generic vendor compliance tool — not GC-specific
- Has a vendor upload portal, automated reminders, COI + W9 + license tracking
- WEAKNESS: No GC community presence, no EMR/audit education, no SMS reminders,
  $20/month more expensive, generic positioning
- OUR EDGE: $29/month, GC-specific, mobile-first sub upload link, SMS alerts,
  built-in understanding of the audit cycle
**C2COI** (c2coi.com)
- ~$67/month (~$800/year). ACORD-form focused.
- GCs have to upload docs on behalf of subs (no sub self-upload link)
- Minimal marketing, likely dormant development
- OUR EDGE: Sub self-upload link, half the price, modern UX
**MySubTracker** (mysubtracker.com)
- Pricing unknown. Minimal product. Low activity.
- Not a real threat but worth knowing exists.
### Adjacent Tools Our Customers Use (Not Competitors — Additive)
**Jobber** — $39–$249/month. No COI module. 300K+ users. Our best
distribution channel. SubDocs should eventually integrate with Jobber.
**HousecallPro** — $59–$149/month. No COI module. Also additive.
**Contractor Foreman** — $49–$332/month. Has basic compliance tracking
buried in a full PM suite. OUR EDGE: SubDocs does COI-only, better,
cheaper, with a GC-specific UX.
**Knowify** — $99–$159/month. Has real COI tracking integrated into a
specialty trades PM tool. Closest bundled competitor. 3.4× our price.
### Enterprise Platforms (Use As Legitimacy Anchors, Not Competitors)
myCOI, TrustLayer, Jones, Billy, BCS, CertFocus, Certificial, SmartCompliance.
When a prospect has heard of these: "Yes — those are built for large commercial
GCs managing hundreds of certificates. We built SubDocs for GCs like you."
---
## PRICING
| Plan     | Price       | Limits                              | Target User           |
|----------|-------------|-------------------------------------|-----------------------|
| Free     | $0/month    | Up to 5 active subs                 | Solo operators; hook  |
| Pro      | $29/month   | Unlimited subs, all core features   | Core ICP              |
| Business | $79/month   | Everything + lien waivers, multi-user, reports | GCs scaling up |
Annual pricing: Pro $290/year (save $58), Business $790/year (save $158).
Always lead with monthly. Offer annual when they ask.
### Pricing Rationale
$29/month = $348/year. One prevented audit surprise ($6K–$8K) pays for
17–23 years of SubDocs. This is not a difficult sell once the math lands.
---
## TECH STACK
### Core Stack
```
Frontend:    Next.js 14 (App Router)
Database:    Supabase (Postgres + Row Level Security)
Auth:        Supabase Auth (email/password to start; magic link later)
Storage:     Supabase Storage (PDF/image file uploads)
Billing:     Stripe (subscriptions + webhooks)
Email:       Resend (transactional)
SMS:         Twilio (reminders to subs and GCs)
Hosting:     Vercel (frontend + API routes)
Styling:     Tailwind CSS
Monitoring:  Sentry (error tracking)
Analytics:   PostHog (product analytics, free tier)
```
### Infrastructure Rules
- **Never hardcode secrets.** All env vars go in `.env.local` (dev) and
  Vercel environment variables (prod). Never commit secrets to GitHub.
- **RLS first.** Every Supabase table gets Row Level Security policies
  before any data goes in. GCs can only see their own data, always.
- **Test mode → live mode.** All Stripe work happens in test mode until
  explicitly told to switch. Flag clearly before any live-mode deployment.
- **Staging before prod.** Any change with DB migrations or schema changes
  gets tested in a Vercel preview deployment first.
- **Mobile-first.** The sub upload page must work perfectly on iPhone Safari.
  All UI decisions prioritize mobile. Our subs are on job sites.
---
## DATABASE SCHEMA
```sql
-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                  text UNIQUE NOT NULL,
  company_name           text,
  plan                   text DEFAULT 'free', -- 'free' | 'pro' | 'business'
  stripe_customer_id     text,
  stripe_subscription_id text,
  onboarding_complete    boolean DEFAULT false,
  created_at             timestamptz DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read/write own row"
  ON users FOR ALL
  USING (id = auth.uid());
-- ============================================================
-- SUBCONTRACTORS
-- ============================================================
CREATE TABLE subcontractors (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gc_id        uuid REFERENCES users(id) ON DELETE CASCADE,
  name         text NOT NULL,
  company_name text,
  email        text,
  phone        text,
  trade        text, -- 'Electrical'|'Plumbing'|'HVAC'|'Framing'|'Roofing'
                     -- |'Concrete'|'Landscaping'|'Other'
  notes        text,
  status       text DEFAULT 'pending', -- 'compliant'|'expiring'|'non_compliant'|'pending'
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GCs own their subs"
  ON subcontractors FOR ALL
  USING (gc_id = auth.uid());
-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_id      uuid REFERENCES subcontractors(id) ON DELETE CASCADE,
  gc_id       uuid REFERENCES users(id), -- denormalized for RLS
  doc_type    text NOT NULL, -- 'COI' | 'W9' | 'License' | 'Other'
  file_url    text,          -- Supabase Storage path
  file_name   text,
  expiry_date date,          -- nullable for W9
  status      text DEFAULT 'active', -- 'active'|'expiring_soon'|'expired'
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by text DEFAULT 'sub' -- 'sub' | 'gc'
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GCs can read/write their docs"
  ON documents FOR ALL
  USING (gc_id = auth.uid());
-- ============================================================
-- UPLOAD TOKENS
-- ============================================================
CREATE TABLE upload_tokens (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_id     uuid REFERENCES subcontractors(id) ON DELETE CASCADE,
  gc_id      uuid REFERENCES users(id),
  token      text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at timestamptz DEFAULT (now() + interval '30 days'),
  used       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE upload_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GCs can manage their tokens"
  ON upload_tokens FOR ALL
  USING (gc_id = auth.uid());
-- Public read for upload flow (token lookup — no auth)
CREATE POLICY "Public can read token by value"
  ON upload_tokens FOR SELECT
  USING (true);
-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gc_id      uuid REFERENCES users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  address    text,
  status     text DEFAULT 'active', -- 'active' | 'complete' | 'paused'
  notes      text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GCs own their projects"
  ON projects FOR ALL
  USING (gc_id = auth.uid());
-- ============================================================
-- PROJECT SUBS (junction table)
-- ============================================================
CREATE TABLE project_subs (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  sub_id     uuid REFERENCES subcontractors(id) ON DELETE CASCADE,
  added_at   timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, sub_id)
);
ALTER TABLE project_subs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GCs can manage project subs"
  ON project_subs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.gc_id = auth.uid()
    )
  );
-- ============================================================
-- REMINDERS
-- ============================================================
CREATE TABLE reminders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id        uuid REFERENCES documents(id) ON DELETE CASCADE,
  sub_id        uuid REFERENCES subcontractors(id),
  gc_id         uuid REFERENCES users(id),
  reminder_type text, -- '30_day' | '14_day' | '7_day' | 'expired'
  channel       text, -- 'email' | 'sms'
  recipient     text, -- 'sub' | 'gc'
  sent_at       timestamptz DEFAULT now(),
  UNIQUE (doc_id, reminder_type, recipient) -- deduplication constraint
);
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "GCs can read their reminders"
  ON reminders FOR SELECT
  USING (gc_id = auth.uid());
-- ============================================================
-- AGENT LOG (OpenClaw multi-agent coordination)
-- ============================================================
CREATE TABLE agent_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent      text NOT NULL, -- 'builder'|'marketer'|'closer'|'support'|'analyst'
  action     text NOT NULL, -- 'deployed'|'flagged'|'completed'|'alert'
  notes      text,
  created_at timestamptz DEFAULT now()
);
-- No RLS needed — internal coordination table only
-- Service role key used by agents to write to this table
```
---
## CORE USER FLOWS
### Flow 1: GC Onboarding (3 steps, < 3 minutes)
1. Sign up (email + password)
2. Step 1: Company name + primary trade + sub count estimate
3. Step 2: Add first sub (name, email, trade)
4. Step 3: Copy/send upload link to that sub
→ Redirect to dashboard with welcome banner
### Flow 2: Sub Document Upload (no login, mobile-first)
1. GC clicks "Send Upload Link" next to a sub
2. System generates unique token, stores in upload_tokens
3. Sub receives/opens `/upload/[token]`
4. Sub selects doc type, uploads file, enters expiry date
5. File goes to Supabase Storage, document row created
6. Sub sees confirmation page. GC gets email notification.
7. Dashboard status recalculates and updates
### Flow 3: Compliance Status Logic
- **Green (Compliant):** All required docs uploaded AND none expire within 30 days
- **Yellow (Expiring Soon):** Any doc expires within 30 days
- **Red (Non-Compliant):** Any doc is expired OR any required doc is missing
- **Pending:** No docs uploaded yet
Required docs by default: COI (with expiry date). W9 and License are
optional and configurable per GC account.
Status is calculated on read for freshness. Also cached in
`subcontractors.status` for fast dashboard queries. Recalculate and
update cache whenever a document is uploaded or the daily cron runs.
### Flow 4: Automated Reminders (Vercel Cron, daily 8am ET)
- Query: docs where expiry_date = today + 30, today + 14, or today + 7
- Check reminders table: skip if (doc_id, reminder_type, recipient) already exists
- Send email to sub: "Your COI expires in X days for [GC Company Name]"
- Send email to GC: "[Sub Name]'s COI expires in X days"
- Optionally send SMS if GC has SMS enabled (Pro feature)
- Insert row into reminders table after successful send
### Flow 5: Stripe Billing
- Free: enforced at 5-sub limit in middleware AND UI
- Upgrade: Stripe Checkout → webhook → update users.plan to 'pro'
- Cancel/downgrade: Stripe Customer Portal
- On downgrade to free: if GC has > 5 subs, archive extras — never delete data
- Webhook events to handle:
  - `checkout.session.completed` → set plan = 'pro' or 'business'
  - `customer.subscription.deleted` → set plan = 'free'
  - `invoice.payment_failed` → send payment warning email to GC
---
## FILE STRUCTURE
```
subdocs/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar nav + auth guard
│   │   ├── dashboard/page.tsx      # Compliance overview + summary cards
│   │   ├── subcontractors/
│   │   │   ├── page.tsx            # Sub roster table
│   │   │   └── [id]/page.tsx       # Sub detail + activity log
│   │   ├── projects/
│   │   │   ├── page.tsx            # Project list
│   │   │   └── [id]/page.tsx       # Project compliance view
│   │   └── settings/
│   │       ├── account/page.tsx
│   │       ├── notifications/page.tsx
│   │       └── billing/page.tsx
│   ├── upload/
│   │   └── [token]/page.tsx        # PUBLIC — no auth — mobile-first
│   ├── onboarding/page.tsx         # 3-step wizard (post-signup)
│   ├── page.tsx                    # Marketing landing page (logged-out)
│   └── api/
│       ├── stripe/
│       │   └── webhook/route.ts    # Stripe webhook handler
│       └── cron/
│           └── reminders/route.ts  # Daily reminder job
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── SubTable.tsx                # Sub roster with status badges
│   ├── ComplianceBadge.tsx         # Green/Yellow/Red/Pending badge
│   ├── UploadLinkButton.tsx        # Generates + copies upload link
│   ├── SubDetailPanel.tsx          # Slide-out: docs + activity log
│   ├── OnboardingWizard.tsx        # 3-step post-signup flow
│   ├── FreeTierBanner.tsx          # Upgrade prompt at 5-sub limit
│   └── UpgradModal.tsx             # Stripe Checkout trigger
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client
│   ├── stripe.ts                   # Stripe instance + helpers
│   ├── resend.ts                   # Email sending helpers
│   ├── twilio.ts                   # SMS sending helpers
│   ├── compliance.ts               # Status calculation logic
│   └── utils.ts                    # Shared utilities
├── types/
│   └── database.ts                 # Generated Supabase types
│                                   # Run: supabase gen types typescript
├── .env.local                      # Never commit this file
├── .env.example                    # Commit this — keys without values
├── CLAUDE.md                       # This file — shared agent context
├── COMPETITORS.md                  # Competitive pricing + positioning notes
└── CHANGELOG.md                    # What changed and when
```
---
## ENVIRONMENT VARIABLES
Required in `.env.local` for development and Vercel for production.
Commit `.env.example` with blank values so collaborators know what's needed.
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only — never expose to client
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=                # Monthly Pro plan price ID
STRIPE_PRO_ANNUAL_PRICE_ID=         # Annual Pro plan price ID
STRIPE_BUSINESS_PRICE_ID=           # Monthly Business plan price ID
STRIPE_BUSINESS_ANNUAL_PRICE_ID=    # Annual Business plan price ID
# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@getsubdocs.com
# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=                # E.164 format: +15551234567
# App
NEXT_PUBLIC_APP_URL=                # https://getsubdocs.com in prod
                                    # http://localhost:3000 in dev
# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```
---
## CODE QUALITY RULES
### Never Do This
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or client components
- Never skip RLS policies on a new table
- Never use `any` in TypeScript without a comment explaining why
- Never deploy a DB migration without testing in a preview deployment first
- Never commit `.env.local`
- Never process a Stripe webhook without verifying the signature
- Never store sensitive data (SSN, full card numbers, passwords) anywhere
- Never use `console.log` in production code — use Sentry for error capture
### Always Do This
- Use Supabase types generated from the schema (`supabase gen types typescript`)
- Handle loading states and error states in every UI component
- Write the happy path first, then add error handling
- Validate all user input with `zod` before touching the database
- Add a `// TODO: [description]` comment for any placeholder or deferred work
- Test Stripe webhooks locally:
  `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Test the upload link in an incognito window after every change to that flow
- Check iPhone Safari rendering on every new page before marking it done
### Standard Patterns
```typescript
// Server component with auth guard
export default async function ProtectedPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data, error } = await supabase
    .from('subcontractors')
    .select('*')
    .eq('gc_id', user.id)
  if (error) throw error // Sentry captures this
  return <ClientComponent initialData={data} />
}
// API route with error handling
export async function POST(request: Request) {
  try {
    const body = await request.json()
    // validate with zod
    // authenticate
    // execute
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[api/route-name]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
// Stripe webhook handler skeleton
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  switch (event.type) {
    case 'checkout.session.completed':
      // update plan
      break
    case 'customer.subscription.deleted':
      // downgrade to free
      break
  }
  return NextResponse.json({ received: true })
}
```
---
## BUSINESS LOGIC RULES
### Free Tier Enforcement
- Hard limit: 5 subcontractors
- Enforced in two places: the API route (authoritative) AND the UI (UX)
- When limit is hit: show upgrade modal — never silently fail
- UI message: *"You're on the free plan (5 sub limit). Upgrade to Pro
  for $29/month to add unlimited subcontractors."*
- On attempted 6th sub add via API: return 403 with `{ error: 'plan_limit' }`
### Upload Token Rules
- Tokens expire after 30 days
- Tokens are single-use (`used = true` after first successful upload)
- Expired token: show message + prompt sub to contact GC for a new link
- Used token: show "already submitted" confirmation page, not an error
- Resend rate limit: one resend per sub per 48 hours
- Always generate a fresh token on resend — do not reuse old ones
### Compliance Status Calculation
```typescript
function calculateSubStatus(documents: Document[]): ComplianceStatus {
  if (documents.length === 0) return 'pending'
  const today = new Date()
  const thirtyDaysFromNow = addDays(today, 30)
  const cois = documents.filter(d => d.doc_type === 'COI')
  if (cois.length === 0) return 'non_compliant' // COI is required
  const hasExpired = documents.some(
    d => d.expiry_date && new Date(d.expiry_date) < today
  )
  if (hasExpired) return 'non_compliant'
  const hasExpiringSoon = documents.some(
    d => d.expiry_date &&
         new Date(d.expiry_date) >= today &&
         new Date(d.expiry_date) <= thirtyDaysFromNow
  )
  if (hasExpiringSoon) return 'expiring'
  return 'compliant'
}
```
Cache this result in `subcontractors.status`. Recalculate on:
- Any document upload
- Daily cron job (catches passive expirations overnight)
### Reminder Deduplication
The `UNIQUE(doc_id, reminder_type, recipient)` constraint on the reminders
table is the authoritative deduplication mechanism. Before sending, the
cron job queries for existing reminders for that combination. The DB
constraint is the safety net if the query check fails.
### Stripe Plan Changes
- Upgrades: immediate (Checkout completes → webhook fires → plan updated)
- Cancellations: honor end of billing period (Stripe manages this)
- On downgrade to free with > 5 subs: archive extras, never delete data
  Set `archived = true` on subs over the limit. Show a message explaining
  what happened. They can reactivate by upgrading again.
---
## UI/UX PRINCIPLES
### Design Language
- Clean, modern, professional, trust-building. Compliance product — reliable, not trendy.
- **Brand identity:** SVG shield+document+checkmark logo at `/public/logo.svg`
- **Primary color:** Deep navy (#1B2B4B) — Tailwind: `navy` with shades 50-900
- **Accent/CTA:** Brand blue (#2563EB) — Tailwind: `brand` with shades 50-700
- **Background:** White (#FFFFFF) with gray-50 (#F9FAFB) for sections
- **Compliance status colors (custom Tailwind classes):**
  - Green: `compliant` (#22C55E) with `compliant-light` and `compliant-mid`
  - Amber: `expiring` (#F59E0B) with `expiring-light` and `expiring-mid`
  - Red: `non-compliant` (#EF4444) with `non-compliant-light` and `non-compliant-mid`
  - Gray: `pending` (#6B7280) with `pending-light`
- **Cards:** `bg-white border border-gray-200 rounded-xl shadow-sm`
- **Buttons:** Primary: `bg-brand text-white rounded-lg font-semibold hover:bg-brand-600`
  Secondary: `border border-gray-200 text-navy rounded-lg`
- **Typography:** Inter via Google Fonts CDN. 14–16px body. text-navy for headings, text-gray-500 for secondary.
- **Sidebar:** Navy background with white/navy-200 text, SVG icons, plan badge at bottom.
- **Mobile nav:** Fixed top bar with horizontal nav links (Dashboard, Subs, Projects, Settings).
### Copy Rules
- Never say "vendor" — say "sub" or "subcontractor"
- Never say "compliance workflow" — say "tracking your subs' insurance"
- Never say "leverage" — ever
- Never say "utilize" — say "use"
- Write error messages that tell users what to do, not what broke:
  - BAD: "Error 422: Unprocessable entity"
  - GOOD: "This file type isn't supported. Please upload a PDF, JPG, or PNG."
- Every empty state has a clear call to action, not just "No data found"
### Mobile-First Rules (Non-Negotiable)
The upload page (`/upload/[token]`) is used by subs on job sites.
It must be flawless on iPhone Safari. Test every change on mobile.
- Touch targets: minimum 44px height on all interactive elements
- Input font size: minimum 16px (prevents iOS Safari auto-zoom)
- File upload button: large, centered, labeled clearly
- No hover-only interactions — everything must work with tap
- Date picker: use native HTML date input on mobile
- Form fields: adequate spacing between inputs for fat-finger safety
---
## LAUNCH CONTEXT
### 30-Day MVP Scope
These features must ship before any paying customers are invited:
1. Auth (signup, login, logout, forgot password)
2. Subcontractor roster (add, view, edit basic info)
3. Upload link generation (per-sub, 30-day expiry, single-use)
4. Public upload page (no login, mobile-first)
5. Compliance dashboard (per-sub Green/Yellow/Red/Pending)
6. Email reminders (Vercel Cron, 30/14/7-day alerts)
7. Stripe billing (free tier enforced, Pro upgrade)
8. 3-step onboarding wizard
9. Settings pages (account, notifications, billing)
10. Marketing landing page (logged-out homepage)
### Month 2 Scope
- SMS reminders via Twilio
- Project-level compliance view
- Business tier unlock ($79/month)
- Lien waiver tracking
- CSV import for existing sub rosters
- Referral program (give 2 months free, get 2 months free)
### Month 3+ Scope
- Sub-side portable compliance profile (network effect)
- Insurance agent partner dashboard
- Jobber / Zapier integration
- Sub invoice gating (can't submit invoice if COI expired)
### Build Prioritization Framework
When Rishi asks "should we build X?", apply this in order:
1. Is it in the 30-day MVP? → Build it now
2. Is it in Month 2? → Log it, stay focused on MVP
3. Does it serve the core ICP pain (audit risk, COI expiration)? → If no, deprioritize
4. Does it increase switching cost or expand ARPU? → If yes, roadmap explicitly
5. Is it a competitor feature Rishi is reacting to? → Pause, evaluate, don't react-build
---
## AGENT COORDINATION (OpenClaw)
SubDocs runs a 5-agent OpenClaw system. This CLAUDE.md is the shared
context layer across all parallel sessions. Every agent reads this file
before starting work.
### Agent Roles
| Agent | Responsibility | Do Not Overlap |
|-------|---------------|----------------|
| **Builder** | Code, features, bug fixes, deployments | Content, outreach |
| **Marketer** | Content drafts, social posts, blog articles | Pricing decisions |
| **Closer** | Lead outreach, trial follow-up, LinkedIn | Code, deploys |
| **Support** | FAQ responses, Crisp escalations | Sales commitments |
| **Analyst** | Metrics, weekly briefings, churn alerts | Customer contact |
### Inter-Agent Communication
All agents share the production Supabase instance.
State changes that affect other agents get logged to `agent_log`.
```typescript
// How agents log coordination events
await supabase.from('agent_log').insert({
  agent: 'builder',
  action: 'deployed',
  notes: 'Added SMS reminders for sub expiry — Twilio integrated. Marketer: draft release note.'
})
```
### Builder Agent Rules (This Session)
- Check `agent_log` for pending tasks before starting new work
- Log all production deployments to `agent_log`
- Never merge to main without a passing build
- Tag PRs: `[builder-agent] Description of change`
- Never make pricing decisions or spend > $100 without Rishi approval
- Never contact customers directly
---
## WHEN RISHI ASKS FOR BUSINESS ADVICE
You have full context on:
- The ICP, their pain, their language, and their fear triggers
- All competitors and their exact pricing (see Competitive Landscape)
- The ROI math ($29/month vs. $6K–$8K audit surprise)
- The GTM plan (Facebook Groups → insurance agent channel → SEO)
- The 30-day launch timeline and what's in/out of scope
- The 5-agent OpenClaw automation stack
- Financial projections: 100 paid customers by Month 6, $10K MRR by Month 14
- The expansion roadmap: lien waivers → sub CRM → sub invoice gating
**Give direct answers with a recommendation. Don't hedge everything.**
Rishi is moving fast and needs signal, not a list of considerations.
When you don't know something — current market data, legal/insurance
specifics, pricing that may have changed — say so clearly and suggest
where to verify. Don't make up data points.
---
## WHEN RISHI ASKS FOR CODE
1. **Confirm scope first** if the request is ambiguous. One clarifying
   question is fine. Five is not.
2. **Build complete features.** If you write a function, handle the error
   case. If you write a component, include loading and empty states. If you
   create a DB table, include the RLS policy in the same block.
3. **Flag risks before coding:**
   - "This touches the Stripe billing flow — I'll keep it in test mode."
   - "This is a DB migration — here's the SQL, review before applying."
   - "This changes the upload link flow — I'll test in incognito after."
4. **Show reasoning on complex logic.** For compliance calculations,
   reminder deduplication, or webhook handling — explain the approach
   before writing the code.
5. **End every session with:**
   - What was built or changed
   - Any TODOs or known limitations
   - What to manually test before considering it done
   - Whether a Vercel deployment is needed
   - What to log to `agent_log` if applicable
---
## QUICK REFERENCE
### Domain + URLs (update when live)
- App: https://getsubdocs.com
- Upload flow: https://getsubdocs.com/upload/[token]
- Marketing: https://getsubdocs.com (logged-out homepage)
### Key Dashboards
- Stripe: https://dashboard.stripe.com
- Supabase: https://app.supabase.com
- Vercel: https://vercel.com/dashboard
- Sentry: https://sentry.io
- Resend: https://resend.com/dashboard
- Twilio: https://console.twilio.com
- PostHog: https://app.posthog.com
### Stripe Price IDs (update after creating products)
```
STRIPE_PRO_PRICE_ID=             # $29/month
STRIPE_PRO_ANNUAL_PRICE_ID=      # $290/year
STRIPE_BUSINESS_PRICE_ID=        # $79/month
STRIPE_BUSINESS_ANNUAL_PRICE_ID= # $790/year
```
### Supabase Storage Buckets
- `documents` — COI, W9, license uploads (private, RLS enforced)
- `avatars` — reserved for future use
### Cron Schedule
- `0 13 * * *` — daily reminders (8am ET = 13:00 UTC)
### Reminder Deduplication Key
- Unique constraint: `(doc_id, reminder_type, recipient)`
- This prevents double-sending at the DB level regardless of cron behavior
---
## INFRASTRUCTURE STATUS (READ THIS FIRST)
**Last updated: 2026-03-15**

All agents MUST read this section before starting work. It tells you
what's been set up, what's connected, and what's still missing.

### Supabase (LIVE — connected)
- **Project:** Connected and working. `.env.local` has all three keys populated:
  - `NEXT_PUBLIC_SUPABASE_URL` ✅
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
  - `SUPABASE_SERVICE_ROLE_KEY` ✅
- **Tables created:** `users`, `subcontractors`, `documents`, `upload_tokens`,
  `projects`, `project_subs`, `reminders`, `agent_log`
  - Schema matches the SQL in the DATABASE SCHEMA section of this file
  - All tables have RLS enabled with policies applied
  - `upload_tokens` has a public SELECT policy for the upload flow
- **Storage bucket:** `documents` bucket exists (private, RLS enforced)
- **Auth:** Email/password auth enabled. Email confirmation is disabled
  (GCs can sign up and use the app immediately).

### Known Bug Fix (2026-03-15)
- **Signup did not create a `users` row.** Fixed: `app/(auth)/signup/page.tsx`
  now upserts into `users` after `signUp()`. Additionally,
  `components/AddSubForm.tsx` auto-creates the `users` row on first sub add
  if it's missing (covers accounts created before the fix).

### Stripe (NOT CONNECTED YET)
- `.env.local` keys are blank for Stripe:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ❌
  - `STRIPE_SECRET_KEY` ❌
  - `STRIPE_WEBHOOK_SECRET` ❌
  - `STRIPE_PRO_PRICE_ID` ❌ (need to create products in Stripe dashboard)
  - All annual price IDs ❌
- The Stripe webhook handler (`app/api/stripe/webhook/route.ts`) is scaffolded
  but untested. Do NOT test with live keys until all webhook events are verified
  in test mode.
- Free tier enforcement (5-sub limit) works without Stripe — it reads
  `users.plan` which defaults to `'free'`.

### Email / Resend (NOT CONNECTED YET)
- `RESEND_API_KEY` is blank in `.env.local`
- `lib/resend.ts` is scaffolded but not implemented
- Upload flow has a TODO for GC notification email after sub uploads a doc

### SMS / Twilio (NOT CONNECTED YET — Month 2)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` all blank
- `lib/twilio.ts` is scaffolded but not implemented
- SMS reminders are Month 2 scope — do not build yet

### Monitoring (NOT CONNECTED YET)
- `SENTRY_DSN` is blank — error tracking not active
- `NEXT_PUBLIC_POSTHOG_KEY` is blank — product analytics not active
- Both are nice-to-have before launch, not blockers

### Onboarding (PARTIALLY WORKING)
- The 3-step onboarding wizard (`app/onboarding/page.tsx`) renders and validates
  form inputs, but does NOT save data to Supabase yet. The "Go to Dashboard"
  button redirects to `/dashboard` after a simulated delay.
- TODOs in the file: save company_name to users row, insert first sub,
  generate a real upload token, set `onboarding_complete = true`.

### Cron / Reminders (NOT IMPLEMENTED YET)
- `app/api/cron/reminders/route.ts` is scaffolded but empty
- Needs Resend integration first (see above)
- Cron schedule: `0 13 * * *` (8am ET) — configure in Vercel after deploy

### npm Dependencies Installed
`next`, `react`, `react-dom`, `@supabase/ssr`, `@supabase/supabase-js`,
`zod`, `clsx`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`

### What's Working End-to-End (tested locally)
1. ✅ Signup + Login (auth flows)
2. ✅ Dashboard with sidebar nav (auth-guarded)
3. ✅ Add subcontractor (with free tier 5-sub limit)
4. ✅ Sub detail page with document requirements checklist + file open links
5. ✅ Upload link generation + clipboard copy
6. ✅ Public upload page (token validation, file upload, email capture, mobile-first)
7. ✅ Compliance status recalculation after upload
8. ✅ Landing page (marketing, logged-out homepage)
9. ✅ Onboarding wizard UI (data persistence is TODO)
10. ✅ Projects CRUD (create, list, detail, assign/remove subs)
11. ✅ Sub account system (auto-create on upload, sub_profiles linking)
12. ✅ Sub portal (/sub/portal — view docs across all GCs, network effect CTA)
13. ✅ Dashboard expiring subs alert with send reminder action
14. ✅ Demo account seed data (demo@subdocs.com, 5 subs, 2 projects, sample docs)

### What's NOT Working Yet
1. ❌ Stripe billing (no keys, no products created)
2. ❌ Email notifications (no Resend key)
3. ❌ Onboarding data persistence (saves nothing to DB)
4. ❌ Cron reminders (no email provider)
5. ❌ Settings pages (scaffolded but not functional)

### Database Migrations Pending
- `migrations/002-sub-accounts.sql` — adds `role` column to users, creates `sub_profiles` table + RLS policies for sub accounts
- `seed-demo-data.sql` — demo account with 5 subs, 2 projects, sample documents

---
## WORKING LOG (MULTI-AGENT COORDINATION)
**Every agent MUST read this section before starting, during work, and
after completing any task. This is the locking mechanism that prevents
agents from colliding.**

### Protocol
1. **BEFORE starting work:**
   - Read the Active Tasks table below
   - Check if any `IN PROGRESS` task touches files you need to modify
   - If conflict exists → do NOT start. Set your row to `BLOCKED ON [agent]`
   - If no conflict → add your row with status `IN PROGRESS`
   - Update CLAUDE.md and save before writing any code

2. **DURING work:**
   - If you discover you need to touch additional files not in your
     original claim, update your "Files Touched" column FIRST
   - If a new file overlaps with another active task → stop, mark
     `BLOCKED ON [agent]`, and wait
   - Re-check this table every ~15 minutes during long tasks

3. **AFTER completing work:**
   - Update your row status to `DONE`
   - Add a one-line summary of what changed to the CHANGELOG
   - If your work unblocks another agent, note it in the Notes column
   - Do NOT delete your row — leave it for audit trail. Rishi will
     clean up periodically.

4. **If BLOCKED:**
   - Set status to `BLOCKED ON [agent-name]`
   - Re-read CLAUDE.md every 2–3 minutes until the blocker clears
   - Once cleared, update status to `IN PROGRESS` and continue
   - If blocked for > 30 minutes, flag it in Notes for Rishi

### Stale Lock Rule
If a task has been `IN PROGRESS` for > 2 hours with no update, any
agent may treat it as abandoned. Add a note: "Assumed stale — reclaiming"
and proceed. If the original agent returns, they must re-check for
conflicts before resuming.

### Active Tasks
| Agent | Task | Status | Files Touched | Started | Notes |
|-------|------|--------|---------------|---------|-------|
| builder | Project scaffold + initial setup | DONE | `entire project structure` | 2026-03-15 | Initial scaffold complete |
| builder | Supabase Auth (signup, login, logout, forgot password, middleware) | DONE | `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts` (new), `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `middleware.ts` (new) | 2026-03-15 | Auth complete — login, signup, forgot password, middleware guard. TypeScript clean. |
| builder | Sub roster CRUD + compliance dashboard | DONE | `app/(dashboard)/layout.tsx`, `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/subcontractors/page.tsx`, `app/(dashboard)/subcontractors/[id]/page.tsx`, `components/SubTable.tsx`, `components/ComplianceBadge.tsx`, `components/SubDetailPanel.tsx`, `components/FreeTierBanner.tsx`, `components/AddSubForm.tsx` (new), `components/SubcontractorsClient.tsx` (new), `lib/compliance.ts`, `types/database.ts` | 2026-03-15 | Complete — auth guard, real data, add sub form, free tier, mobile-first |
| builder | Upload flow: token generation, public upload page, file storage | DONE | `app/upload/[token]/page.tsx`, `components/UploadLinkButton.tsx`, `app/api/upload-tokens/route.ts` (new), `app/api/upload/route.ts` (new) | 2026-03-15 | Complete — token gen API, file upload API, mobile-first upload page, UploadLinkButton wired up. Installed zod + clsx. |
| marketer | Landing page + onboarding wizard + UpgradeModal polish | DONE | `app/page.tsx`, `app/onboarding/page.tsx`, `components/UpgradeModal.tsx` | 2026-03-15 | Complete — full landing page, polished onboarding with validation + clipboard, UpgradeModal with pricing parity. TS clean. |
| builder | Phase 2: Sub accounts, projects CRUD, dashboard alerts, sub detail overhaul, demo data | DONE | `app/sub/portal/page.tsx` (new), `app/(dashboard)/projects/page.tsx`, `app/(dashboard)/projects/[id]/page.tsx`, `app/(dashboard)/projects/new/page.tsx`, `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/subcontractors/[id]/page.tsx`, `components/SubDetailPanel.tsx`, `components/ExpiringSubsAlert.tsx` (new), `components/ProjectSubManager.tsx` (new), `app/upload/[token]/page.tsx`, `app/api/upload/route.ts`, `migrations/002-sub-accounts.sql` (new), `seed-demo-data.sql` (new) | 2026-03-15 | Complete — sub account system (email capture on upload, auto-create sub users, sub portal with network effect CTA), projects CRUD with sub assignment, enhanced sub detail with doc requirements checklist + file open links, dashboard expiring subs alert with send reminder action, demo seed data. TS clean (zero errors). Migration + seed SQL ready to run. |
| builder | Full design system overhaul + bug fixes | DONE | `tailwind.config.js`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/settings/account/page.tsx`, `app/(dashboard)/settings/billing/page.tsx`, `app/(dashboard)/settings/notifications/page.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `app/onboarding/page.tsx`, `app/upload/[token]/page.tsx`, `app/sub/portal/page.tsx`, ALL components/*.tsx, `public/logo.svg` (new), `next.config.js`, `migrations/003-fix-rls-recursion.sql` (new) | 2026-03-15 | Complete — SVG logo, expanded Tailwind palette (navy/brand/status variants), redesigned every page with consistent theme, fixed settings pages (account now functional, billing shows plan + modal, notifications with toggles), fixed mobile nav (added Projects link), fixed RLS recursion via SECURITY DEFINER functions, removed deprecated serverActions flag. TS clean (zero errors). |
<!-- AGENTS: Add your row above this line. Do NOT remove completed rows. -->

### File Ownership Quick Reference
Use this to quickly check who typically owns which areas. This is a
guideline — the Active Tasks table above is authoritative.
| Area | Primary Owner | Secondary |
|------|--------------|-----------|
| `app/(auth)/*` | builder | — |
| `app/(dashboard)/*` | builder | — |
| `app/upload/*` | builder | — |
| `app/page.tsx` (landing) | marketer | builder |
| `app/api/stripe/*` | builder | — |
| `app/api/cron/*` | builder | — |
| `components/*` | builder | — |
| `lib/*` | builder | — |
| `CLAUDE.md` | ALL agents | — |
| `COMPETITORS.md` | analyst | marketer |
| `CHANGELOG.md` | ALL agents | — |
| Marketing copy / blog | marketer | closer |
| Outreach scripts | closer | marketer |

---
## CHANGELOG
| Date | Change |
|------|--------|
| 2026-03-15 | CLAUDE.md created. 30-day launch sprint begins. |
| 2026-03-15 | Added Working Log section for multi-agent coordination. |
| 2026-03-15 | Initial project scaffold created — all route files, components, lib, types, config. |
| 2026-03-15 | Supabase Auth implemented — login (email/password), signup (redirects to /onboarding), forgot password (reset email flow), middleware auth guard (protects /dashboard/*, /onboarding, /settings, redirects logged-in users away from /login and /signup). Installed @supabase/ssr + @supabase/supabase-js. Created lib/supabase/middleware.ts for session refresh. |
| 2026-03-15 | Sub roster CRUD + compliance dashboard — Dashboard layout with Supabase auth guard and sidebar (shows plan, company name). Dashboard page fetches real compliance summary counts. Subcontractors page with Add Sub form (zod validation), free tier 5-sub enforcement (UI + Supabase check), mobile card view. Sub detail page with documents list and upload link button. ComplianceBadge/SubTable/SubDetailPanel use proper types. Installed zod. |
| 2026-03-15 | Upload flow implemented (MVP items #3 + #4) — POST /api/upload-tokens generates 30-day single-use tokens with GC auth + sub ownership validation. POST /api/upload handles public file upload (validates token, uploads to Supabase Storage, creates document row, marks token used, recalculates sub compliance status). Public upload page /upload/[token] validates token on load (shows expired/used/invalid states), mobile-first form (44px+ touch targets, 16px inputs to prevent iOS zoom, native date picker, cloud upload icon, file size display). UploadLinkButton calls API, auto-copies to clipboard, shows regenerate option. Installed zod + clsx. |
| 2026-03-15 | Marketing landing page — hero with audit pain headline, problem section (4 cards), how-it-works (3 steps), ROI callout, pricing cards (Free/Pro/Business), testimonial placeholders, FAQ, final CTA, footer. GC language throughout. |
| 2026-03-15 | Onboarding wizard polished — form validation with inline errors, clipboard copy with visual feedback + fallback, loading spinner, step labels, skip option, tip for texting link. Mobile-first 48px targets. |
| 2026-03-15 | UpgradeModal polished — feature checklists, ROI callout, recommended badge on Pro, annual pricing, loading spinners per plan. Matches landing page design. |
| 2026-03-15 | Bugfix: signup now creates `users` table row via upsert after auth.signUp(). AddSubForm auto-creates missing users row on first sub add (covers pre-fix accounts). |
| 2026-03-15 | Added INFRASTRUCTURE STATUS section to CLAUDE.md — documents what's connected (Supabase, Storage), what's not (Stripe, Resend, Twilio, Sentry, PostHog), and what's working end-to-end vs TODO. All agents should read this before starting work. |
| 2026-03-15 | Sub account system — email capture on upload page, auto-create sub user via admin.createUser, sub_profiles junction table links users to subcontractor records, sub portal at /sub/portal shows docs grouped by GC with network effect CTA. Migration: 002-sub-accounts.sql. |
| 2026-03-15 | Projects CRUD — full project list page with compliance ratios, project detail with assigned subs + ComplianceBadge, new project form, ProjectSubManager component for add/remove subs from projects. |
| 2026-03-15 | Enhanced SubDetailPanel — document requirements checklist (COI required, W9/License/Other optional), color-coded status icons (✓/!/✕/—), "Open" button links to Supabase Storage files, shows upload source (sub vs GC). |
| 2026-03-15 | Dashboard expiring subs alert — ExpiringSubsAlert component shows non-compliant + expiring subs with specific doc details, "Send Reminder" generates upload token + copies link. |
| 2026-03-15 | Demo seed data — demo@subdocs.com / Test123! with 5 subs (mixed compliance statuses), 2 projects, sample COI/W9/License documents, upload tokens for pending subs. |
| 2026-03-15 | RLS recursion fix — SECURITY DEFINER functions (get_sub_ids_for_user, get_sub_ids_for_gc) break circular dependency between subcontractors and sub_profiles policies. Migration: 003-fix-rls-recursion.sql. |
| 2026-03-15 | Full design system overhaul — new brand identity with SVG shield logo, expanded Tailwind color palette (navy 50-900, brand 50-700, status color variants with light/mid shades), Inter font via Google Fonts CDN, rounded-xl cards with shadow-sm, brand blue CTAs, consistent design language across all pages. |
| 2026-03-15 | Dashboard redesign — welcome greeting, colored left-border summary cards, prominent action-needed section, modern card-based layout. |
| 2026-03-15 | Landing page rewrite — hero with gradient background, problem/solution cards, 5-step how-it-works, ROI callout, 3-tier pricing, FAQ with objection handling, footer with links. |
| 2026-03-15 | Settings pages implemented — Account page now functional (update company name, logout). Billing page shows current plan + upgrade modal trigger. Notifications page with toggle UI for email preferences. |
| 2026-03-15 | Auth pages redesigned — login/signup with centered card layout, logo, brand blue CTAs. Onboarding wizard restyled. |
| 2026-03-15 | Mobile nav fix — Projects link added to mobile header. All 4 nav items (Dashboard, Subs, Projects, Settings) now visible on mobile. |
| 2026-03-15 | Removed deprecated next.config.js experimental.serverActions flag (stable in Next.js 14+). |
<!-- Add entries here as the product evolves -->
<!-- Format: YYYY-MM-DD | What changed and why -->