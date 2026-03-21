#!/bin/bash
# Launch script — starts the bot server + tunnel in one command

cd "$(dirname "$0")"

echo "🚀 Starting Websage AI Lead Bot..."

# Start the webhook server in background
node server.js &
SERVER_PID=$!
echo "✅ Server running (PID $SERVER_PID) on port 3000"

sleep 2

# Start tunnel (try ngrok first, then cloudflared, then lt)
if command -v ngrok &> /dev/null; then
  echo "📡 Starting ngrok tunnel..."
  ngrok http 3000
elif command -v cloudflared &> /dev/null; then
  echo "📡 Starting cloudflare tunnel..."
  cloudflared tunnel --url http://localhost:3000
else
  echo ""
  echo "⚠️  No tunnel tool found. Install one:"
  echo "   brew install cloudflared"
  echo "   OR: brew install ngrok/ngrok/ngrok"
  echo ""
  echo "Then point Twilio webhook to:"
  echo "   https://YOUR_TUNNEL_URL/webhook/twilio"
  echo ""
  echo "Server is running locally on port 3000."
  wait $SERVER_PID
fi
