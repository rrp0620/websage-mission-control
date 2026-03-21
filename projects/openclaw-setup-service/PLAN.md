# Project Plan: OpenClaw Agent Setup as a Service
_Created: 2026-03-20 | Owner: Rishi Patel_

---

## What We're Building

A productized service where we scope, build, and deploy a custom AI agent stack (OpenClaw + Claude) for a business — packaged, connected, and ready to use on day one.

Clients don't need to know anything technical. They just need a Discord server (or WhatsApp) and a business to run.

**Pricing:** $500 setup + $350/month

---

## Phase 1: Build the Foundation (Days 1–5)
_Goal: Have something you can demo and sell ASAP_

### Step 1 — Starter Kit Template (Day 1–2)
Create a reusable OpenClaw workspace template that can be cloned for any new client:
- `SOUL.md` — generic, customizable per client
- `AGENTS.md` — standard config with team roles
- `HEARTBEAT.md` — common checks (email, calendar, follow-ups)
- `USER.md` — intake form → auto-fills this
- `MEMORY.md` — blank, seeded with business context
- `TOOLS.md` — blank, filled during onboarding

**Output:** `/templates/client-starter-kit/` in workspace

### Step 2 — Vertical Packages (Day 2–4)
Build 3 pre-tuned packages (same structure, different prompts/heartbeats):

| Vertical | Agent Tasks | Heartbeat Checks |
|----------|------------|------------------|
| **Real Estate Agent** | Lead follow-up, listing Q&A, appointment booking | New leads, listing alerts, calendar |
| **HVAC / Home Services** | Quote follow-up, job scheduling, review requests | Job queue, open quotes, Google reviews |
| **General Small Business** | Inbox triage, appointment reminders, customer follow-up | Email, calendar, CRM updates |

**Output:** `/templates/verticals/{real-estate, hvac, general}/`

### Step 3 — Intake Form + Onboarding Script (Day 3–5)
A simple Google Form or Notion page clients fill out before kickoff:
- Business name, industry, timezone
- What channels they use (Discord, WhatsApp, email)
- Top 3 tasks they want automated
- Any tools they use (CRM, calendar, email provider)
- Logo/brand voice notes

**Output:** Shareable intake link + internal onboarding checklist

---

## Phase 2: Sell the First 3 Pilots (Days 5–14)
_Goal: Close 3 paying clients at $500 setup_

### Targets
1. **Inbound leads** — People who already reached out. Convert these first.
2. **Real estate crossover** — Agents on the lead list who aren't ready for the bot but need general AI help
3. **Cold outreach** — HVAC/home services owners in any metro

### Sales Script (short version)
> "I set up a custom AI assistant for your business — it handles [specific task], runs 24/7, and connects to your [Discord/WhatsApp/email]. $500 to set up, $350/month after that. I can have it live in 3–5 days."

### Delivery Promise
- **Kickoff call:** 30 min intake + scoping
- **Build time:** 2–3 days (Vegeta handles custom dev)
- **Delivery call:** 30 min walkthrough + handoff
- **Support:** Monthly check-in included in retainer

---

## Phase 3: Productize & Scale (Days 14–30)
_Goal: Systematize so delivery takes <1 day per client_

- Templatize the 3 verticals fully (zero custom work needed for standard clients)
- Write a simple "Client Runbook" — how their agent works, how to update it, what to do if something breaks
- Build a referral hook — "Know another [realtor/HVAC owner]? I'll waive the setup fee for referrals"
- Consider a self-serve tier ($200 setup, they configure it themselves with a guide)

---

## Success Metrics
| Milestone | Target Date |
|-----------|-------------|
| Starter kit template done | Day 2 |
| 3 vertical packages ready | Day 5 |
| First paid pilot closed | Day 10 |
| 3 pilots live | Day 21 |
| $1,050 MRR (3 × $350) | Day 30 |

---

## What Rishi Does
- Intake calls (30 min each)
- Sales conversations + closing
- Deliver the walkthrough/handoff call
- Approve any spend >$50

## What Goku Does
- Builds and maintains templates
- Drafts SOUL/AGENTS/HEARTBEAT per client
- Manages Vegeta for custom builds
- Tracks pipeline + metrics in Mission Control

## What Vegeta Does
- Custom skill development (anything beyond the template)
- Discord bot setup if needed
- Any API integrations (CRM, calendar, etc.)

---

## Immediate Next Actions
1. ✅ Project added to Mission Control
2. [ ] Rishi: Reply to inbound leads — set up kickoff calls
3. [ ] Goku: Build starter kit template (`/templates/client-starter-kit/`)
4. [ ] Goku: Draft 3 vertical packages
5. [ ] Rishi: Create intake form (Google Form or Notion)
