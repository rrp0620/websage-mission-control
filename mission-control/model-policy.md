# 🤖 Model Policy — Subagent Framework

## Philosophy
Mint (Sonnet) is expensive. Save it for what only Sonnet can do.
Run everything else on Haiku — it's 10-15x cheaper per token.

---

## Model Tiers

### Tier 1 — Mint / Sonnet (claude-sonnet-4-6) ~$3/$15 per 1M
**Use for:**
- All direct conversation with Rishi
- Strategic analysis and recommendations
- Final review of outreach copy before sending
- Complex multi-step decisions
- Anything that requires judgment

**Never use for:**
- Bulk research passes
- First-draft content generation
- Data formatting or cleanup
- Simple classification tasks

---

### Tier 2 — Worker / Haiku 3.5 (claude-haiku-3-5) ~$0.80/$4 per 1M
**Use for:**
- Research batches (summarizing web pages, extracting key info)
- First-draft outreach emails and LinkedIn messages
- Content creation (blog posts, social copy)
- Lead qualification logic
- Data extraction and analysis

**When to use:** Any task that takes >5 tool calls or >500 output tokens

---

### Tier 3 — Bulk / Haiku 3 (claude-haiku-3) ~$0.25/$1.25 per 1M
**Use for:**
- Formatting and cleanup
- Simple yes/no classification
- Summarizing long documents into bullets
- Repetitive template filling
- Anything with >10 items in a loop

---

## Subagent Spawning Rules

When spawning subagents (sessions_spawn), always specify model:

```
Tier 2 task: model="claude-haiku-3-5-20241022"
Tier 3 task: model="claude-haiku-3-20240307"
```

### Task → Tier Decision Tree
1. Does it involve Rishi or final output? → Tier 1 (me)
2. Does it require nuanced writing or reasoning? → Tier 2
3. Is it repetitive, bulk, or simple? → Tier 3

---

## Cost Estimates Per Task Type

| Task | Model | Est. Cost |
|------|-------|-----------|
| Research 10 websites | Haiku 3.5 | ~$0.02 |
| Write 5 outreach emails | Haiku 3.5 | ~$0.01 |
| Analyze 50 leads | Haiku 3 | ~$0.005 |
| Strategic planning session | Sonnet | ~$0.05 |
| Full weekly report | Sonnet | ~$0.10 |

**Key insight:** A full week of Haiku-powered work costs less than one Sonnet planning session.

---

## Budget Guardrails

- If MTD spend > $80 → alert Rishi, switch everything possible to Haiku 3
- If MTD spend > $95 → pause all non-critical subagents, Rishi-only mode
- Daily soft cap: $3.33 (alert if exceeded, don't hard-stop)
