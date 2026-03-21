# 💡 Idea Pipeline — Websage Inc.
_How an idea in #ideas becomes a live product in Rishi's hands._
_Last updated: 2026-03-20_

---

## The Flow

```
Rishi drops idea in #ideas
        ↓
  Bulma validates (research)
        ↓
  Frieza analyzes (economics)
        ↓
  Goku reviews + greenlights
        ↓
  Vegeta builds
        ↓
  Goku stress tests + preps demo
        ↓
  Rishi gets a clean, demable product
```

---

## Stage 1 — Idea Drop (Rishi)

**Where:** #ideas channel  
**Who responds:** ALL agents  
**What Rishi does:** Brain dump the idea. Can be rough. One sentence or a paragraph — doesn't matter.

Example:
> "What if we built a bot that helps HVAC companies follow up with leads automatically like we did for real estate?"

All agents will see it and kick off their piece simultaneously.

---

## Stage 2 — Research & Validation (Bulma 🔵)

**Triggered by:** New message in #ideas  
**Bulma's job:**
- Research the market (size, competition, trends)
- Validate the pain point — do people actually have this problem?
- Find 2-3 similar products and what they charge
- Identify monetization angles specific to this idea
- Flag risks or reasons it might not work

**Output:** Research brief saved to `research/idea-YYYY-MM-DD-[slug].md`  
**Posts summary to:** #ideas (tagging @Goku and @Frieza)  
**Verdict:** ✅ Validated / 🟡 Possible with caveats / 🔴 Recommend against

---

## Stage 3 — Financial Analysis (Frieza 👽)

**Triggered by:** Bulma's research brief  
**Frieza's job:**
- Cost structure: what does it cost to build and run this?
- Revenue model: how do we charge? Subscription, one-time, per-use?
- Break-even: how many customers to cover costs?
- Upside: what's the realistic revenue ceiling at 100 / 1K / 10K users?
- Priority score: is this worth doing now vs. other opportunities?
- Strategy recommendation: launch now, build list first, or skip?

**Output:** Memo saved to `research/idea-economics-YYYY-MM-DD-[slug].md`  
**Posts summary to:** #ideas (tagging @Goku)

---

## Stage 4 — Goku Reviews & Greenlights (Goku 🟠)

**Triggered by:** Both Bulma and Frieza summaries received  
**Goku's job:**
- Synthesize research + economics into a go/no-go
- If no-go: explain why, file for later, move on
- If go: write a build brief for Vegeta (what to build, MVP scope, tech approach)
- Set a deadline and success criteria
- Post decision to #ideas

**Go criteria:**
- Bulma validated the pain point ✅
- Frieza says economics can work ✅
- Fits our current execution capacity ✅
- Can be demo-ready in <1 week ✅

**Output:** Build brief posted to #engineering, filed at `products/[slug]/BUILD-BRIEF.md`

---

## Stage 5 — Build (Vegeta ⚡)

**Triggered by:** Build brief in #engineering  
**Vegeta's job:**
- Build the MVP to spec
- Post progress updates to #engineering
- When done: post "ready for review" in #engineering tagging @Goku
- Deliverable must include: working demo + quick-start instructions

**Scope constraint:** MVP only. Shippable in days, not weeks.

---

## Stage 6 — Stress Test + Demo Prep (Goku 🟠)

**Triggered by:** Vegeta's "ready for review" post  
**Goku's job:**
- Test the product end-to-end (happy path + edge cases)
- Write a 1-page demo script for Rishi (non-technical, value-first)
- Create a "30-second pitch" — one sentence that explains the value to a customer
- Prepare the demo environment (test data, clean state, working link/number)
- Post to #mission-control: "Ready for Rishi"

**Demo prep format:**
1. **What it does** (1 sentence, zero jargon)
2. **Who it's for** (specific customer type)
3. **The demo** (step-by-step, what to click/say/show)
4. **The pitch** (how to close from the demo)
5. **Pricing** (what to charge)

---

## Stage 7 — Presented to Rishi

**Where:** #mission-control or direct DM  
**Format:** Clean, high-level, demo-ready  

Rishi gets:
- ✅ One paragraph: what it is, who it's for, why they'll pay
- ✅ Demo instructions (idiot-proof, non-technical)
- ✅ Suggested price
- ✅ Link or number to actually demo it live

**Goal:** Rishi can turn around and demo it to a customer within 10 minutes of seeing it.

---

## Agent Channel Assignments

| Agent | Primary Channel | Also monitors |
|-------|----------------|---------------|
| 🟠 Goku | #mission-control, #real-estate-bot, #general | #ideas |
| ⚡ Vegeta | #engineering | #ideas |
| 🔵 Bulma | #research | #ideas |
| 👽 Frieza | #mission-control | #ideas |

All agents monitor #ideas. Each kicks off their stage automatically when an idea is posted.

---

## Example Turnaround Time

| Stage | Time |
|-------|------|
| Bulma research | 30-60 min |
| Frieza analysis | 30-60 min |
| Goku review + brief | 15 min |
| Vegeta build (MVP) | 2-24 hours |
| Goku stress test + demo prep | 1-2 hours |
| **Total: idea → demo-ready** | **~1-2 days** |

---

_This file is the source of truth for the idea pipeline. All agents reference it._
