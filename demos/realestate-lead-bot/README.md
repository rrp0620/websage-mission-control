# Real Estate Lead Follow-Up Agent — Demo

## What This Is
A conversational AI agent that plugs into a real estate agent's existing workflow
(WhatsApp, SMS, or web chat) to automatically follow up with leads, qualify them,
and book appointments — without the agent lifting a finger.

## The Problem It Solves
Real estate agents get 20–50 leads/month from Zillow, Realtor.com, their website, etc.
Most never follow up within the first 5 minutes. Studies show:
- 78% of buyers go with the FIRST agent who responds
- Average agent responds in 11+ hours
- This agent responds in under 60 seconds, 24/7

## What It Does
1. Instantly greets new leads (via WhatsApp/SMS/web widget)
2. Qualifies them (timeline, pre-approved?, looking to buy or sell, area, budget)
3. Schedules a call/showing directly on the agent's calendar
4. Follows up with unresponsive leads daily for 5 days
5. Notifies the agent only when a lead is warm/ready

## Tech Stack (for deployment)
- Brain: Claude claude-sonnet-4-6 via API (or GPT-4o)
- Messaging: Twilio (SMS/WhatsApp) or WhatsApp Business API
- Calendar: Calendly API or Google Calendar
- CRM sync: optional (can push to Follow Up Boss, kvCORE, HubSpot)
- Hosting: VPS (DigitalOcean $6/mo droplet) or client's server

## Demo Mode
This folder contains a simulated conversation flow and a runnable CLI demo
that shows the agent in action.

Run: `node demo.js`
