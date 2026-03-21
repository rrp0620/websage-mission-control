# Supabase Setup — Mission Control Live Data

> **For Rishi**: Follow these steps to wire Mission Control to live Supabase data.
> Takes ~10 minutes. Free tier is fine.

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (GitHub login works)
2. Click **New Project**
3. Name it `websage-mission-control`
4. Set a database password (save it somewhere safe)
5. Region: **US East** (closest to us)
6. Click **Create new project** — wait ~2 min for provisioning

---

## Step 2: Run the Schema SQL

Go to **SQL Editor** (left sidebar) → **New query** → paste this entire block and click **Run**:

```sql
-- ============================================
-- MISSION CONTROL SCHEMA
-- ============================================

-- Agent Status
CREATE TABLE agent_status (
  id TEXT PRIMARY KEY,
  emoji TEXT,
  name TEXT,
  role TEXT,
  zone TEXT,
  status TEXT,
  status_label TEXT,
  current_task TEXT,
  mood TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT,
  emoji TEXT,
  pct INTEGER DEFAULT 0,
  status TEXT,
  status_label TEXT,
  owners TEXT,
  description TEXT,
  tasks JSONB,
  milestones JSONB,
  blockers JSONB,
  resources JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Feed
CREATE TABLE activity (
  id BIGSERIAL PRIMARY KEY,
  event_time TIMESTAMPTZ DEFAULT now(),
  text TEXT
);

-- Metrics (key-value store for dashboard widgets)
CREATE TABLE metrics (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY — public read access
-- ============================================

ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read agent_status" ON agent_status FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read activity" ON activity FOR SELECT USING (true);
CREATE POLICY "Public read metrics" ON metrics FOR SELECT USING (true);

-- Service role can do everything (used by scripts)
CREATE POLICY "Service write agent_status" ON agent_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write activity" ON activity FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service write metrics" ON metrics FOR ALL USING (true) WITH CHECK (true);
```

---

## Step 3: Seed with Current Data

Still in **SQL Editor**, run this in a new query:

```sql
-- ============================================
-- SEED DATA
-- ============================================

-- Agents
INSERT INTO agent_status (id, emoji, name, role, zone, status, status_label, current_task, mood) VALUES
  ('goku',   '🟠', 'Goku',   'Chief of Staff',           '💡 Ideation Corner', 'online',   'ONLINE',   'Coordinating dashboard rebuild, managing team', 'focused'),
  ('vegeta', '⚡', 'Vegeta', 'Engineering Lead',         '🔨 Build Station',   'building', 'BUILDING', 'Supabase architecture for Mission Control',     'shipping'),
  ('bulma',  '🔵', 'Bulma',  'Research Lead',            '📡 Research Pod',    'standby',  'STANDBY',  'Runs daily at 8 AM ET — morning brief',         'sleeping'),
  ('frieza', '👽', 'Frieza', 'CFO / Financial Strategist','📊 War Room',       'standby',  'STANDBY',  'Splitt unit economics analysis (queued)',        'waiting');

-- Projects
INSERT INTO projects (id, name, emoji, pct, status, status_label, owners, description, tasks, milestones, blockers, resources) VALUES
  ('subdocs', 'SubDocs', '📄', 5, 'queued', '⬜ Queued', 'Rishi',
   'Concept under review. Details TBD.',
   '[{"done":false,"text":"Review concept docs"},{"done":false,"text":"Define MVP scope"},{"done":false,"text":"Assign to Vegeta"}]'::jsonb,
   '[{"date":"Week 2+","label":"Concept review"}]'::jsonb,
   '[]'::jsonb,
   '[{"label":"Product Folder","url":"file:///Users/mint/.openclaw/workspace/products/subdocs/"}]'::jsonb
  ),
  ('realestate', 'Real Estate Lead Bot', '🏠', 60, 'inprogress', '🟡 In Progress', 'Rishi + Goku',
   'SMS-powered AI lead bot for real estate agents. Qualifies leads, books appointments, follows up automatically.',
   '[{"done":true,"text":"Build bot (SMS + Twilio)"},{"done":true,"text":"Write sales playbook"},{"done":true,"text":"Set up Gumroad payment links"},{"done":true,"text":"Add Calendly booking link"},{"done":"blocked","text":"Twilio A2P campaign approval"},{"done":false,"text":"Build lead list (30 agents)"},{"done":false,"text":"Send first LinkedIn outreach"},{"done":false,"text":"Book first demo call"},{"done":false,"text":"Close first client ($500/mo)"}]'::jsonb,
   '[{"date":"~Mar 21","label":"Twilio A2P approved"},{"date":"Mar 21","label":"Lead list built (30 agents)"},{"date":"Mar 22-23","label":"First demo calls"},{"date":"Mar 26","label":"🎯 First client signed"}]'::jsonb,
   '["Twilio A2P campaign under carrier review — SMS cannot be sent until approved (~24-48h from Mar 19)"]'::jsonb,
   '[{"label":"Demo Bot","url":"file:///Users/mint/.openclaw/workspace/demos/realestate-lead-bot/"},{"label":"Sales Playbook","url":"file:///Users/mint/.openclaw/workspace/sales/outreach-playbook.md"},{"label":"Gumroad Setup","url":"https://websageai.gumroad.com/l/nmyzxg"},{"label":"Gumroad Monthly","url":"https://websageai.gumroad.com/l/vkavk"},{"label":"Calendly","url":"https://calendly.com/rrp0620/websage"}]'::jsonb
  ),
  ('splitt', 'Splitt Fintech App', '💳', 30, 'inprogress', '🟡 Economics Review', 'Rishi + Frieza',
   'Virtual Lithic card that splits charges across multiple credit cards to maximize rewards/cashback. ~85% built, blocked on unit economics viability.',
   '[{"done":true,"text":"Core app built (~85%)"},{"done":true,"text":"Frieza briefed on economics problem"},{"done":"inprogress","text":"Bulma researching Lithic/Stripe fees"},{"done":false,"text":"Frieza builds unit economics model"},{"done":false,"text":"Decision: launch / adjust pricing / pivot"},{"done":false,"text":"Wire up web + mobile frontend"}]'::jsonb,
   '[{"date":"Mar 21","label":"Bulma research complete"},{"date":"Mar 22","label":"Frieza unit economics memo"},{"date":"Mar 23","label":"Go/no-go decision"}]'::jsonb,
   '["Lithic issuance + Stripe per-leg fees may make unit economics negative at current pricing — awaiting Frieza analysis"]'::jsonb,
   '[{"label":"Full Audit","url":"file:///Users/mint/.openclaw/workspace/products/splitt/Splitt_Full_Audit_Report.md"},{"label":"Frieza Agent","url":"file:///Users/mint/.openclaw/workspace/agents/frieza/AGENT.md"}]'::jsonb
  ),
  ('openclaw-setup', 'OpenClaw Agent Setup as a Service', '🛠️', 5, 'planning', '🟢 Planning', 'Rishi + Goku + Vegeta',
   'Productized service: scope, build, and deploy custom OpenClaw AI agent stacks for businesses. $500 setup + $350/month.',
   '[{"done":false,"text":"Build starter kit template (SOUL/AGENTS/HEARTBEAT/USER)"},{"done":false,"text":"Build 3 vertical packages (Real Estate, HVAC, General SMB)"},{"done":false,"text":"Create intake form for client onboarding"},{"done":false,"text":"Reply to inbound leads — book kickoff calls"},{"done":false,"text":"Close first 3 pilot clients ($1,500 setup)"},{"done":false,"text":"3 clients live on retainer ($1,050 MRR)"}]'::jsonb,
   '[{"date":"Mar 22","label":"Starter kit template done"},{"date":"Mar 25","label":"3 vertical packages ready"},{"date":"Apr 3","label":"🎯 First paid pilot closed"},{"date":"Apr 20","label":"🎯 3 pilots live = $1,050 MRR"}]'::jsonb,
   '[]'::jsonb,
   '[{"label":"Project Plan","url":"file:///Users/mint/.openclaw/workspace/projects/openclaw-setup-service/PLAN.md"}]'::jsonb
  );

-- Activity Feed
INSERT INTO activity (event_time, text) VALUES
  ('2026-03-20 16:34:00+00', '✅ Dashboard redesign kicked off — Vegeta building v2'),
  ('2026-03-20 12:00:00+00', '🔵 Bulma morning brief delivered → research/'),
  ('2026-03-20 02:44:00+00', '✅ Rishi submitted Twilio A2P campaign — under review'),
  ('2026-03-20 02:21:00+00', '✅ Gumroad products created (setup + monthly)'),
  ('2026-03-20 01:52:00+00', '✅ Bulma cron registered (ID: a212fadb)'),
  ('2026-03-20 01:41:00+00', '🚀 Revenue sprint launched');

-- Metrics
INSERT INTO metrics (key, value) VALUES
  ('revenue', '{"mtd": 0, "target": 200, "goal": 10000}'::jsonb),
  ('expenses', '{"mtd": 12.16, "budget": 100, "today": 10.96, "avgDaily": 4, "breakdown": [{"provider":"Anthropic","agents":"Goku + Frieza","models":"claude-sonnet-4-6","mtd":11.20},{"provider":"OpenAI","agents":"Vegeta","models":"gpt-5.4","mtd":0.85},{"provider":"Qwen / OpenRouter","agents":"Bulma","models":"qwen3-235b-a22b","mtd":0.11}]}'::jsonb),
  ('sprint', '{"goal": "First client signed", "deadline": "Mar 26, 2026", "daysRemaining": 6}'::jsonb);
```

---

## Step 4: Copy Your Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values:

| Value | Where to find it |
|-------|-----------------|
| **Project URL** | Under "Project URL" — looks like `https://xxxxx.supabase.co` |
| **anon (public) key** | Under "Project API keys" → `anon` `public` |

3. Open `mission-control/dashboard-app/index.html`
4. Find these lines near the top of `<script>`:
   ```js
   const SUPABASE_URL = '';
   const SUPABASE_ANON_KEY = '';
   ```
5. Paste your values inside the quotes
6. Save and refresh the dashboard — you should see the **LIVE** badge appear

---

## Step 5 (Optional): Set Up the Update Script

For agents to push status updates programmatically:

1. Copy your **service_role** key from Settings → API (the secret one, NOT anon)
2. Create `.env` in the workspace root (`/Users/mint/.openclaw/workspace/.env`):
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
   ```
3. Run updates:
   ```bash
   node scripts/update-agent-status.js goku online "Coordinating revenue sprint"
   ```

---

## Architecture Overview

```
Dashboard (index.html)
  │
  ├── tries supaFetch() first (Supabase REST API via anon key)
  │     └── reads: agent_status, projects, activity, metrics
  │
  ├── falls back to local JSON files (./data/*.json)
  │
  └── falls back to hardcoded constants (PROJECTS, AGENTS_DATA, etc.)

Scripts (update-agent-status.js)
  │
  └── writes to Supabase via service_role key (bypasses RLS)

RLS Policy: public read, service-role write
```

---

**Questions?** Ask Vegeta or Goku in the next session.
