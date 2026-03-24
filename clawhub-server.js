const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const app = express();
const PORT = 4243;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const FALLBACK_SLUGS = ['weather', 'healthcheck', 'coding-agent', 'skill-creator', 'node-connect'];

// GET /api/skills/popular
app.get('/api/skills/popular', async (req, res) => {
  const sort = req.query.sort || 'downloads';
  const limit = parseInt(req.query.limit) || 30;
  try {
    const { stdout } = await execAsync(`npx clawhub explore --sort ${sort} --limit ${limit} --json`, { timeout: 30000 });
    const data = JSON.parse(stdout.trim());
    if (data.items && data.items.length > 0) return res.json(data.items);
    // Fallback: inspect known popular slugs
    const inspections = await Promise.all(FALLBACK_SLUGS.map(async slug => {
      try {
        const { stdout: out } = await execAsync(`npx clawhub inspect ${slug} --json`, { timeout: 15000 });
        return JSON.parse(out.trim());
      } catch { return null; }
    }));
    res.json(inspections.filter(Boolean));
  } catch (e) {
    console.error('explore error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/skills/search
app.get('/api/skills/search', async (req, res) => {
  const q = req.query.q || '';
  const limit = parseInt(req.query.limit) || 10;
  if (!q) return res.json([]);
  try {
    const { stdout } = await execAsync(`npx clawhub search ${JSON.stringify(q)} --limit ${limit}`, { timeout: 20000 });
    const lines = stdout.split('\n').filter(l => l.trim() && !l.startsWith('-'));
    const results = lines.map(line => {
      const m = line.match(/^(\S+)\s{2,}(.+?)\s{2,}\([\d.]+\)/);
      if (m) return { slug: m[1].trim(), displayName: m[2].trim() };
      const m2 = line.match(/^(\S+)\s+(.+)/);
      if (m2) return { slug: m2[1].trim(), displayName: m2[2].trim() };
      return null;
    }).filter(Boolean);
    res.json(results);
  } catch (e) {
    console.error('search error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/skills/inspect/:slug
app.get('/api/skills/inspect/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const { stdout } = await execAsync(`npx clawhub inspect ${slug} --json`, { timeout: 15000 });
    res.json(JSON.parse(stdout.trim()));
  } catch (e) {
    console.error('inspect error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/skills/install
app.post('/api/skills/install', async (req, res) => {
  const { slug } = req.body;
  if (!slug) return res.status(400).json({ error: 'slug required' });
  try {
    const { stdout, stderr } = await execAsync(
      `npx clawhub install ${slug} --workdir /Users/mint/.openclaw --dir skills`,
      { timeout: 60000 }
    );
    res.json({ ok: true, stdout, stderr });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// POST /api/skills/analyze
app.post('/api/skills/analyze', async (req, res) => {
  const { slug, displayName, summary } = req.body;
  const text = `Analyze ClawHub skill: ${slug} - ${displayName}. ${summary}`;
  try {
    await execAsync(`openclaw system event --text ${JSON.stringify(text)} --mode now`, { timeout: 10000 });
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// POST /api/skills/clone
app.post('/api/skills/clone', async (req, res) => {
  const { slug, displayName, summary } = req.body;
  const text = `Clone and customize skill: ${slug} - ${displayName}. Make your own version for our setup. ${summary}`;
  try {
    await execAsync(`openclaw system event --text ${JSON.stringify(text)} --mode now`, { timeout: 10000 });
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => console.log(`ClawHub Skills Server running on http://localhost:${PORT}`));
