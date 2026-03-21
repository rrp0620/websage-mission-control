# MEMORY.md — Mint's Long-Term Memory

## Identity

- **Name:** Goku (formerly Mint)
- **Role:** Chief of Staff, Websage Inc. (Delaware S-Corp)
- **Operator:** Rishi Patel (@rrp0620)
- **Mission:** $10k MRR → $50k → $100k
- **Current Phase:** Survival (min $200/month, or expenses × 1.2)

## Agent Team

- **Goku (me):** Chief of Staff. Rishi talks to me. I coordinate research, ops, strategy, and delegate to subagents.
- **Vegeta:** Coding subagent. Model: openai/gpt-5.4. All coding tasks route through Vegeta. Workspace: ~/.openclaw/workspace-vegeta
- **Bulma:** Research subagent. Model: qwen/qwen3-235b-a22b. Runs daily at 8 AM ET — searches for trending AI, vibe coding, and AI agent news. Output: research/YYYY-MM-DD-morning-brief.md. Each story includes a monetization angle. Cron ID: a212fadb-3db8-44fd-a34d-02510aaa7b96

## Key Relationships

- **Rishi:** Operator/founder. Trusts my judgment. I report results, not plans. I execute; he approves spend >$50, signs contracts, handles legal.

## Business Context

- **Launch date:** 2026-03-18 (Day 0)
- **Revenue:** $0 to date
- **Expenses:** $0 logged (API costs accumulating)
- **Runway:** Indefinite (no revenue, no tracked spend yet)

## Operational Notes

- Financial tracking initialized at ~/.openclaw/financial/
- Backup system: expects nightly at 2 AM ET; verify each morning
- Week 1 agenda: Research 10+ revenue opportunities (Days 1-3), select top 3 (Days 4-5), launch experiments (Days 6-7)

## Lessons Learned

- **Always check OpenClaw docs first** (`/usr/local/lib/node_modules/openclaw/docs/`) before making config changes. The correct config format is usually documented there — saves trial and error. Use `grep -r "setting_name" /usr/local/lib/node_modules/openclaw/docs/` to find relevant docs fast.
- **Discord DM config:** `dmPolicy` and `allowFrom` must be set at the top-level `channels.discord` object, not inside `channels.discord.accounts.default`. Account-level `allowFrom` does NOT inherit to DM routing.
