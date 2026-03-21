# Demo Call Script — Websage AI
## Real Estate Lead Bot

**Duration:** 10–15 minutes  
**Goal:** Book or close on the spot

---

## Before the Call
- Open the demo on your phone (text the demo number to confirm it's live)
- Have this doc open on your laptop
- Know their name, city, and brokerage from LinkedIn

---

## The Call

### Open (1 min)
"Hey [Name], appreciate you taking the time. Before I show you anything — can I ask one quick question?

When a new lead comes in from Zillow at 9pm on a Sunday, what actually happens on your end?"

→ **Let them answer.** They'll describe the pain themselves.
→ Common answers: "I try to get back to them next morning" / "I'm terrible at follow-up" / "I have an assistant but..."
→ Respond: "Yeah, that's exactly what I keep hearing. The problem is by 9am Monday that lead has probably talked to 3 other agents. Let me show you what we built."

---

### The Demo (4 min)
"Okay — I'm going to text this number right now as if I was a new Zillow lead. Watch what happens."

*Text the demo number: "Hey I saw your listing on Zillow — is it still available?"*

"See how fast that came back? That's Sarah — she's the AI agent. Watch this..."

*Continue the conversation for 2-3 turns. Show qualification happening naturally.*

"So what just happened: she greeted the lead, asked if they're buying or selling, figured out their timeline, and she's about to ask if they're pre-approved. If they are, she drops your calendar link and notifies you. If they're not, she nurtures them and checks back in 2 weeks."

"This runs 24/7. You don't touch it unless she hands you a warm lead."

---

### Handle the obvious question (1 min)
They'll ask: "What if it says something wrong?"

"Great question — you approve the script before we go live. Sarah only knows what we tell her. Anything outside that, she says 'Let me have [your name] reach out directly about that.' She's not winging it."

---

### Transition to price (1 min)
"So — based on what you told me, you're getting [X] leads/month and following up manually. This would handle all of that automatically.

Here's how it works: we spend about 2 days configuring it for your brand — your name, your brokerage, your calendar — and you're live. Setup is $500, then $350/month after that.

Most agents I work with say if it books even one extra call a month it's worth it."

---

### Close (2 min)
**If they're interested:**
"Should we get started? I can have it live by [day after tomorrow]."

**If hesitant:**
"How about this — 30-day pilot. If Sarah doesn't book at least 2 qualified calls in your first month, I'll refund the setup fee. Zero risk."

**If "I need to think about it":**
"Totally fair. What's the one thing you'd need to see to feel confident? I can probably show you that right now."

**If "too expensive":**
"I get it. What if we started with just SMS at $250/month — no setup fee for the first client? I want to prove the value before you commit."

---

## After the Call

**If closed:** 
Send invoice immediately (Stripe). Start onboarding same day.

**If not closed:**
Follow up in 24 hours: "Hey [Name] — sending over that demo video we talked about. Also, quick question: would it help to see a sample of the conversations Sarah has with leads? Happy to pull some examples."

---

## Onboarding Checklist (post-close)
- [ ] Collect: full name, brokerage, city, direct phone, calendar link
- [ ] Set up Twilio number for their area code
- [ ] Configure .env with their details
- [ ] Deploy to VPS
- [ ] Test together on a live call
- [ ] Confirm lead source webhooks (Zillow/website) or manual trigger
- [ ] Go live ✅
