# SubDocs — Parallel Agent Prompts
# Copy each prompt into a separate Cowork session to run simultaneously.
# These are designed with non-overlapping file scopes.
# Created: 2026-03-15

---

## AGENT 1: Auth & Middleware (Builder)

```
You are the Builder agent for SubDocs. Your task is to implement Supabase authentication.

FIRST: Read /sessions/loving-eager-faraday/mnt/SubDocs/CLAUDE.md in full. This is your shared context file. Pay special attention to the WORKING LOG section — you MUST update the Active Tasks table before starting, during, and after your work.

YOUR TASK: Implement Supabase Auth (signup, login, logout, forgot password, auth guard middleware).

FILES YOU OWN (do not touch files outside this list):
- app/(auth)/login/page.tsx
- app/(auth)/signup/page.tsx
- lib/supabase/client.ts
- lib/supabase/server.ts
- middleware.ts (create new — Next.js auth middleware)

WHAT TO BUILD:
1. Update lib/supabase/client.ts and lib/supabase/server.ts with working Supabase SSR auth
2. Implement login page — email/password auth via Supabase, redirect to /dashboard on success, show errors inline
3. Implement signup page — create account via Supabase, redirect to /onboarding on success
4. Create middleware.ts at project root — protect all /dashboard/* routes, redirect to /login if no session
5. Install required dependencies: @supabase/ssr @supabase/supabase-js

RULES:
- Follow all patterns in CLAUDE.md (error handling, loading states, mobile-first, 44px touch targets)
- Use .env.local vars — never hardcode credentials
- Test that login redirects to /dashboard and signup redirects to /onboarding
- Update CLAUDE.md Working Log: set your row to IN PROGRESS before coding, DONE when finished
- Add a CHANGELOG entry when done

DO NOT touch any dashboard pages, components, API routes, or the landing page.
```

---

## AGENT 2: Subcontractor CRUD + Dashboard (Builder)

```
You are the Builder agent for SubDocs. Your task is to implement the subcontractor roster CRUD and compliance dashboard.

FIRST: Read /sessions/loving-eager-faraday/mnt/SubDocs/CLAUDE.md in full. This is your shared context file. Pay special attention to the WORKING LOG section — you MUST update the Active Tasks table before starting, during, and after your work. Check that no other agent is working on your files before you begin.

YOUR TASK: Build the sub roster (add, view, edit) and wire up the compliance dashboard with real data.

FILES YOU OWN (do not touch files outside this list):
- app/(dashboard)/dashboard/page.tsx
- app/(dashboard)/subcontractors/page.tsx
- app/(dashboard)/subcontractors/[id]/page.tsx
- app/(dashboard)/layout.tsx
- components/SubTable.tsx
- components/ComplianceBadge.tsx
- components/SubDetailPanel.tsx
- components/FreeTierBanner.tsx
- lib/compliance.ts
- types/database.ts

WHAT TO BUILD:
1. Wire up the dashboard layout with Supabase auth guard (server component pattern from CLAUDE.md)
2. Dashboard page: fetch real compliance summary counts from Supabase, display in summary cards
3. Subcontractors page: fetch sub roster, render SubTable, add "Add Sub" form/modal with validation (zod)
4. Sub detail page: fetch sub + documents, render SubDetailPanel
5. Enforce free tier 5-sub limit in UI (show FreeTierBanner when at limit, block add in UI)
6. ComplianceBadge and SubTable should use real data from Supabase queries
7. Install zod if not already installed: npm install zod

RULES:
- Follow all patterns in CLAUDE.md (server component auth guard, error handling, loading states)
- Use the compliance status calculation from lib/compliance.ts
- Free tier: 5 sub hard limit. Show upgrade prompt, never silently fail
- Every empty state has a clear CTA
- Mobile-first: 44px touch targets, 16px input fonts
- Update CLAUDE.md Working Log before, during, and after work
- Add a CHANGELOG entry when done

DO NOT touch auth pages, upload flow, API routes, settings, or the landing page.
```

---

## AGENT 3: Upload Flow + Token System (Builder)

```
You are the Builder agent for SubDocs. Your task is to implement the public upload flow and token system.

FIRST: Read /sessions/loving-eager-faraday/mnt/SubDocs/CLAUDE.md in full. This is your shared context file. Pay special attention to the WORKING LOG section — you MUST update the Active Tasks table before starting, during, and after your work. Check that no other agent is working on your files before you begin.

YOUR TASK: Build the complete sub document upload flow — token generation, public upload page, file storage.

FILES YOU OWN (do not touch files outside this list):
- app/upload/[token]/page.tsx
- components/UploadLinkButton.tsx
- app/api/upload-tokens/route.ts (create new — API for generating tokens)
- app/api/upload/route.ts (create new — API for handling file uploads)

WHAT TO BUILD:
1. Create API route app/api/upload-tokens/route.ts:
   - POST: Generate a new upload token for a sub (requires auth)
   - Validate sub belongs to the authenticated GC
   - Insert row into upload_tokens table (30-day expiry, single-use)
   - Return the full upload URL

2. Create API route app/api/upload/route.ts:
   - POST: Handle file upload from the public upload page
   - Validate token (not expired, not used)
   - Upload file to Supabase Storage "documents" bucket
   - Create document row in database
   - Mark token as used
   - Recalculate sub compliance status
   - Return success

3. Update app/upload/[token]/page.tsx:
   - On load: validate token via Supabase (check expiry + used status)
   - Expired token: show message + "Contact your GC for a new link"
   - Used token: show "Already submitted" confirmation (not an error)
   - Valid token: show upload form (doc type, file, expiry date)
   - On submit: upload file via API, show confirmation

4. Update components/UploadLinkButton.tsx:
   - Call /api/upload-tokens to generate link
   - Copy to clipboard on click
   - Show the generated link

RULES:
- The upload page is the MOST IMPORTANT screen. It must be flawless on iPhone Safari.
- No auth required on the upload page — token is the auth
- Mobile-first: 44px touch targets, 16px inputs, native date picker, large file upload button
- Accepted files: PDF, JPG, PNG only
- Token rules: 30-day expiry, single-use, fresh token on resend
- Follow CLAUDE.md patterns for API routes (try/catch, zod validation)
- Update CLAUDE.md Working Log before, during, and after work
- Add a CHANGELOG entry when done

DO NOT touch dashboard pages, auth pages, settings, or the landing page.
```

---

## AGENT 4: Landing Page + Onboarding (Marketer/Builder)

```
You are the Marketer/Builder agent for SubDocs. Your task is to build a high-converting landing page and polish the onboarding wizard.

FIRST: Read /sessions/loving-eager-faraday/mnt/SubDocs/CLAUDE.md in full. This is your shared context file. Pay special attention to the WORKING LOG section, the COMPETITIVE LANDSCAPE section, and the UI/UX PRINCIPLES section. You MUST update the Active Tasks table before starting, during, and after your work.

YOUR TASK: Build the marketing landing page and complete the onboarding wizard.

FILES YOU OWN (do not touch files outside this list):
- app/page.tsx (landing page)
- app/onboarding/page.tsx
- components/OnboardingWizard.tsx (if extraction is needed)
- components/UpgradeModal.tsx

WHAT TO BUILD:

1. Landing page (app/page.tsx) — a complete, high-converting page:
   - Hero section: headline that hits the audit pain ("Stop tracking COIs in spreadsheets"), subheadline with the $6K-$8K audit surprise math, CTA buttons (Start Free / Log In)
   - Problem section: explain the annual audit risk in 3-4 bullet points using GC language (COI, Workers' Comp, EMR, audit)
   - How it works: 3 steps (Add subs → They upload → You get alerts)
   - Pricing section: Free / Pro ($29/mo) / Business ($79/mo) cards
   - Social proof placeholder (testimonial slots — even if empty, design the layout)
   - Footer with links
   - IMPORTANT: Use their language. Say "sub" not "vendor". Say "COI" not "certificate". Say "audit" not "compliance review". Reference CLAUDE.md copy rules.

2. Onboarding wizard (app/onboarding/page.tsx):
   - Polish the 3-step flow (company info → add first sub → copy upload link)
   - Wire up the "Copy Link" button to actually copy to clipboard
   - Add proper form validation
   - Make sure it looks great on mobile

3. UpgradeModal — polish the pricing display, make it match landing page pricing

RULES:
- This is a compliance product — design must feel trustworthy and professional, not trendy
- Navy (#1B2B4B) primary, white background, Inter font
- Never say "vendor", "leverage", "utilize", or "compliance workflow"
- Write error messages that tell users what to do, not what broke
- Mobile-first: everything must work on iPhone Safari
- ROI math: $29/month ($348/year) vs $6K-$8K audit surprise = 17-23 years of SubDocs
- Update CLAUDE.md Working Log before, during, and after work
- Add a CHANGELOG entry when done

DO NOT touch auth pages, dashboard pages, API routes, or lib files.
```

---

## HOW TO USE THESE PROMPTS

1. Open 4 separate Cowork sessions
2. Copy-paste one prompt into each session
3. Each agent will read CLAUDE.md, update the Working Log, do their work, and mark DONE
4. If an agent hits a dependency (e.g., Agent 2 needs auth from Agent 1), it will mark itself BLOCKED in the Working Log and wait
5. Check CLAUDE.md periodically to see overall progress

### Expected file conflicts: NONE
These prompts are designed with zero file overlap. The only shared file is CLAUDE.md itself (Working Log updates), which uses append-only rows so agents won't overwrite each other.

### Dependency notes:
- Agent 2 (CRUD) depends on Agent 1 (Auth) for the auth guard pattern, but can still scaffold all the data-fetching code
- Agent 3 (Upload) is fully independent — the upload page has no auth
- Agent 4 (Landing/Onboarding) is fully independent — no backend dependencies
