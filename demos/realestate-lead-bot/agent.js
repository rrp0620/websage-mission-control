/**
 * Real Estate Lead Follow-Up Agent
 * Demo version — runs in CLI, simulates WhatsApp/SMS conversation
 * 
 * In production: swap readline for Twilio webhook handler
 */

const readline = require('readline');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

// Agent configuration — in production, loaded per-client from a config file
const AGENT_CONFIG = {
  agentName: "Sarah",           // The agent's persona name
  agentOwner: "Mike Johnson",   // The real estate agent's name
  agentPhone: "(555) 234-5678", // Agent's real phone for warm handoff
  brokerage: "Johnson Realty",
  serviceArea: "Austin, TX",
  calendarLink: "https://calendly.com/mikejohnson-realty/15min",
};

const SYSTEM_PROMPT = `You are ${AGENT_CONFIG.agentName}, a friendly and professional assistant for ${AGENT_CONFIG.agentOwner} at ${AGENT_CONFIG.agentBrokerage || AGENT_CONFIG.brokerage} in ${AGENT_CONFIG.serviceArea}.

Your job is to:
1. Warmly greet new leads who just inquired about a property or asked about buying/selling
2. Qualify them by naturally learning:
   - Are they looking to BUY, SELL, or both?
   - What's their timeline? (ASAP, 1-3 months, 3-6 months, just browsing)
   - Are they pre-approved for a mortgage (if buying)?
   - What area/neighborhoods interest them? What's their budget range?
   - Is this their primary residence or investment?
3. If they seem serious (timeline < 6 months OR pre-approved), offer to book a quick 15-min intro call
4. If they're just browsing, be helpful, offer to send listings, and check back in 2 weeks
5. Always be conversational — this feels like texting a knowledgeable friend, NOT a form

Rules:
- Keep messages SHORT (2-4 sentences max). This is a text conversation.
- One question at a time — never ask 3 questions in one message
- If they ask something you don't know, say "Great question — let me have ${AGENT_CONFIG.agentOwner} reach out to you directly about that"
- If they say they're ready to talk NOW, give them ${AGENT_CONFIG.agentOwner}'s direct line: ${AGENT_CONFIG.agentPhone}
- Never make up property details or prices
- Booking link: ${AGENT_CONFIG.calendarLink}

Tone: Warm, confident, helpful. Not salesy. Like a trusted assistant.`;

// Conversation state — in production, stored in DB per lead
let conversationHistory = [];
let leadData = {
  name: null,
  intent: null,      // buy | sell | both
  timeline: null,    // asap | 1-3mo | 3-6mo | browsing
  preApproved: null, // yes | no | unknown
  budget: null,
  area: null,
  qualified: false,
  booked: false,
};

async function chat(userMessage) {
  conversationHistory.push({
    role: 'user',
    content: userMessage
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,  // Keep responses short — this is SMS/WhatsApp
    system: SYSTEM_PROMPT,
    messages: conversationHistory
  });

  const assistantMessage = response.content[0].text;
  
  conversationHistory.push({
    role: 'assistant',
    content: assistantMessage
  });

  return assistantMessage;
}

async function runDemo() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n' + '═'.repeat(60));
  console.log('  WEBSAGE AI — Real Estate Lead Bot Demo');
  console.log(`  Agent: ${AGENT_CONFIG.agentName} (for ${AGENT_CONFIG.agentOwner})`);
  console.log(`  Simulating: WhatsApp/SMS conversation`);
  console.log('═'.repeat(60));
  console.log('\nScenario: Lead just filled out a form on Zillow.');
  console.log('Type your responses as the lead. Ctrl+C to exit.\n');

  // Trigger the opening message (in production, this fires on new lead webhook)
  const openingMessage = await chat("(New lead just submitted a contact form on Zillow for 123 Oak Street, Austin TX. Start the conversation.)");
  console.log(`\n📱 ${AGENT_CONFIG.agentName}: ${openingMessage}\n`);

  const askQuestion = () => {
    rl.question('You (lead): ', async (input) => {
      if (!input.trim()) {
        askQuestion();
        return;
      }

      try {
        const response = await chat(input);
        console.log(`\n📱 ${AGENT_CONFIG.agentName}: ${response}\n`);
        askQuestion();
      } catch (err) {
        console.error('Error:', err.message);
        askQuestion();
      }
    });
  };

  askQuestion();
}

runDemo();
