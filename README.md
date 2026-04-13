# Storewright

Storewright is an AI e-commerce command center for merchants in the US, UK, Canada, and Europe. It helps merchants discover products, generate store blueprints, connect Shopify and Meta accounts, and launch store assets and ad campaigns.

## What works today
- Authenticated onboarding with Supabase Auth
- Automatic organization creation for each authenticated user
- Free credits activation
- Product research using AI
- Store blueprint generation
- Shopify and Meta connection flows using token-based setup
- Live Shopify build endpoint for pages, products, collections, and media
- Dashboard with a single next action and guided workflow

## What is required for live store creation
To build a live Shopify store, the merchant must connect:
- Shopify store URL
- Shopify Admin API access token

To launch ads, the merchant must connect:
- Meta access token
- Ad account ID

## Environment variables
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Design philosophy
- Warm, human, anti-AI aesthetic
- Clear conversion-driven UI
- No org ID prompts
- No fake demo-only affordances in the core user flow
