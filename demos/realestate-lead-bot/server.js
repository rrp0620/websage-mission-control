/**
 * Production webhook server
 * Connects to Twilio for WhatsApp/SMS
 * 
 * In production: deploy this on a $6/mo DigitalOcean droplet
 * Point Twilio webhook → https://YOUR_VPS_IP/webhook/twilio
 */

require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// In production: use Redis or a DB. For demo: in-memory.
const conversations = new Map();

// Load agent config (in production: per-client config from DB)
const AGENT_CONFIG = {
  agentName: process.env.AGENT_NAME || "Sarah",
  agentOwner: process.env.AGENT_OWNER || "Mike Johnson",
  brokerage: process.env.BROKERAGE || "Johnson Realty",
  serviceArea: process.env.SERVICE_AREA || "Austin, TX",
  agentPhone: process.env.AGENT_PHONE || "(555) 234-5678",
  calendarLink: process.env.CALENDAR_LINK || "https://calendly.com/demo/15min",
  fromNumber: process.env.TWILIO_FROM_NUMBER,
};

function getSystemPrompt(config) {
  return `You are ${config.agentName}, a friendly assistant for ${config.agentOwner} at ${config.brokerage} in ${config.serviceArea}.

Your job: qualify real estate leads via text/WhatsApp and book calls for ${config.agentOwner}.

Qualify by learning (one question at a time):
- Buy, sell, or both?
- Timeline (ASAP / 1-3mo / 3-6mo / browsing)?
- Pre-approved? (if buying)
- Area and budget?

If timeline < 6 months OR pre-approved → offer calendar link: ${config.calendarLink}
If they want to talk now → give direct line: ${config.agentPhone}

Rules:
- Max 3 sentences per message (this is SMS/WhatsApp)
- One question at a time
- Warm and conversational, not salesy
- Never invent property details`;
}

// Handle incoming Twilio webhook (SMS or WhatsApp)
app.post('/webhook/twilio', async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  if (!from || !body) {
    return res.status(400).send('Missing fields');
  }

  // Get or create conversation history for this number
  if (!conversations.has(from)) {
    conversations.set(from, []);
  }
  const history = conversations.get(from);

  history.push({ role: 'user', content: body });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: getSystemPrompt(AGENT_CONFIG),
      messages: history
    });

    const replyText = response.content[0].text;
    history.push({ role: 'assistant', content: replyText });

    // Send reply via Twilio
    await twilioClient.messages.create({
      body: replyText,
      from: AGENT_CONFIG.fromNumber,
      to: from,
    });

    res.status(200).send('OK');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error');
  }
});

// New lead trigger endpoint (call this from Zillow/website webhook)
app.post('/trigger/new-lead', async (req, res) => {
  const { phone, name, property, source } = req.body;
  
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const context = `New lead just came in: Name: ${name || 'unknown'}, inquired about: ${property || 'general'}, source: ${source || 'website'}. Send them a warm opening message.`;
  
  const history = [{ role: 'user', content: context }];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system: getSystemPrompt(AGENT_CONFIG),
      messages: history
    });

    const openingMessage = response.content[0].text;
    history.push({ role: 'assistant', content: openingMessage });
    conversations.set(phone, history);

    await twilioClient.messages.create({
      body: openingMessage,
      from: AGENT_CONFIG.fromNumber,
      to: phone,
    });

    res.json({ success: true, message: openingMessage });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to send' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lead bot server running on port ${PORT}`);
});
