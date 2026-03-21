#!/usr/bin/env node
// Usage: node update-agent-status.js <agent-id> <status> <task>
// Example: node update-agent-status.js goku building "Deploying SubDocs to Vercel"
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in workspace root .env

const fs = require('fs');
const path = require('path');

// Load .env from workspace root
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const [agentId, status, currentTask] = process.argv.slice(2);

if (!agentId || !status || !currentTask) {
  console.error('Usage: node update-agent-status.js <agent-id> <status> <task>');
  console.error('Example: node update-agent-status.js goku building "Deploying SubDocs"');
  process.exit(1);
}

const statusLabels = {
  online: 'Online', building: 'Building', running: 'Researching',
  standby: 'Standby', sleeping: 'Sleeping', offline: 'Offline'
};

async function update() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/agent_status?id=eq.${agentId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      status,
      status_label: statusLabels[status] || status,
      current_task: currentTask,
      updated_at: new Date().toISOString()
    })
  });

  if (res.ok) {
    console.log(`Updated ${agentId}: [${status}] ${currentTask}`);
  } else {
    const err = await res.text();
    console.error('Failed:', err);
    process.exit(1);
  }
}

update();
