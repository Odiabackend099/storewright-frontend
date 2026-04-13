# STOREWRIGHT — User Journey Nanogram
## Complete End-to-End Experience Map

---

## 🎯 BRAND IDENTITY

**Name:** STOREWRIGHT  
**Subdomain:** storewright.odia.dev  
**Tagline:** "Craft your store. AI does the rest."  
**Personality:** Crafted · Trustworthy · Skilled  
**Unique Position:** Only AI store builder with built-in voice AI support

---

## 📊 JOURNEY OVERVIEW

```
DISCOVERY → LANDING → EXPLORATION → CONVERSION → ONBOARDING → DELIVERY → RETENTION
    ↓           ↓          ↓            ↓            ↓           ↓          ↓
   SEO        Trust      Features    Payment      Shopify     AI Build    Renewal
   Ads        Value      Pricing    Checkout     Connect     Updates     Upsell
   Referral   Proof      Demo       Success      Agent       Notifs     Advocacy
```

---

## STAGE 1: DISCOVERY

### User Mindset
- Searching for "how to start dropshipping 2026"
- Frustrated by complexity of multiple tools
- Skeptical of AI hype
- Looking for proof it works

### Entry Points
| Channel | Keyword/Source | Landing Page |
|---------|---------------|--------------|
| SEO | "AI store builder" | / |
| SEO | "Shopify automation tool" | /features |
| SEO | "dropshipping AI agent" | /demo |
| Ads | Meta: dropshipping interest | / |
| Ads | Google: "Shopify help" | /pricing |
| Referral | Partner link | /referral/{code} |
| Direct | storewright.odia.dev | / |

### Required Backend
- GET /v1/seo/content/{slug}
- GET /v1/referral/{code}
- POST /v1/analytics/landing

---

## STAGE 2: LANDING

### User Mindset
- "Is this legit?"
- "How is this different?"
- "Will this actually help ME?"

### First Impression (0-5 seconds)
```
┌─────────────────────────────────────────────────────┐
│  STOREWRIGHT                                        │
│  Craft your store. AI does the rest.               │
│                                                     │
│  [Live Demo Button] [Watch 2-min Video]            │
│                                                     │
│  "Built 147 stores today. Next one: yours."        │
│                                                     │
│  [Real-time counter: 2,341 stores built]           │
└─────────────────────────────────────────────────────┘
```

### Trust Signals (Above Fold)
1. **Real-time counter**: "X stores built today"
2. **Social proof logos**: Shopify Partner, BBB, Trustpilot
3. **No AI imagery**: Real screenshots, real data
4. **Founder photo**: Human face, real story

### Key Sections
1. **Problem Statement**: "You're losing sales to missed calls, bad copy, slow setups"
2. **Solution Preview**: "1 agent builds your store. 1 agent handles calls. Done."
3. **Proof Section**: Real revenue screenshots, real testimonials
4. **How It Works**: 3 steps, no jargon
5. **Pricing**: Visible, no hidden fees
6. **FAQ**: Address real concerns
7. **CTA**: "Start your store" (not "Get started")

### Required Backend
- GET /v1/stats/summary
- GET /v1/testimonials?limit=5
- GET /v1/pricing

---

## STAGE 3: EXPLORATION

### User Mindset
- "What exactly do I get?"
- "Is $29 worth it?"
- "Can I try first?"

### Pages to Explore
| Page | Content | CTA |
|------|---------|-----|
| /features | AI agents explained | Start Free Trial |
| /pricing | Side-by-side comparison | Choose Plan |
| /demo | Interactive playground | Build My Store |
| /case-studies | Real results | Read More |
| /faq | Honest answers | Chat Support |

### Feature Presentation
```
┌─────────────────────────────────────────┐
│  YOUR AI TEAM                           │
│                                         │
│  🏪 StoreBuilder → "Create my store"    │
│  📞 CallHandler → "Answer my calls"     │
│  📦 ProductHunter → "Find winners"     │
│  ✍️ CopyWriter → "Write descriptions"  │
│  📊 AnalyticsAgent → "Tell me what works" │
│                                         │
│  [See agents in action →]               │
└─────────────────────────────────────────┘
```

### Pricing Page Structure
```
┌────────────┬────────────┬────────────┐
│  STARTER   │  GROWTH    │  SCALE     │
│  $29/mo    │  $79/mo    │  $149/mo   │
│            │            │            │
│  30 calls  │  100 calls │  500 calls │
│  1 store   │  3 stores  │  10 stores │
│  Email     │  Priority  │  Dedicated │
│            │            │  account   │
│            │            │            │
│  [Start]   │  [Start]   │  [Contact] │
└────────────┴────────────┴────────────┘
```

### Required Backend
- GET /v1/features
- GET /v1/pricing
- GET /v1/case-studies
- GET /v1/faq

---

## STAGE 4: CONVERSION

### User Mindset
- "I'm ready but nervous"
- "Is my card safe?"
- "Can I cancel anytime?"

### Signup Flow
```
Step 1: Email + Password
┌─────────────────────────────────┐
│  Create your account            │
│  ┌─────────────────────────┐   │
│  │ email@domain.com        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ ••••••••                │   │
│  └─────────────────────────┘   │
│  [Continue →]                   │
│  "Already have an account?"     │
└─────────────────────────────────┘

Step 2: Choose Plan
┌─────────────────────────────────┐
│  Select your plan               │
│  ○ Starter $29/mo              │
│  ● Growth $79/mo (Best value)  │
│  ○ Scale $149/mo               │
│  [Continue →]                   │
└─────────────────────────────────┘

Step 3: Payment (Dodo Checkout)
┌─────────────────────────────────┐
│  → Redirect to Dodo Checkout   │
│  → Google Pay / Card           │
│  → Return to success page      │
└─────────────────────────────────┘
```

### Payment Processing
- Dodo Payments checkout (test mode for now)
- Google Pay integration
- Webhook: payment.succeeded → create subscription

### Success Page
```
┌─────────────────────────────────────────┐
│  ✅ Welcome to Storewright!             │
│                                         │
│  You're on Growth plan                  │
│  100 AI calls/month                     │
│                                         │
│  Let's build your first store.          │
│  [Connect Shopify →]                    │
│                                         │
│  (You can skip and do this later)       │
└─────────────────────────────────────────┘
```

### Revenue Touchpoints
1. Subscription charge (monthly)
2. Annual prepay discount (2 months free)
3. Post-purchase upsell (add more calls)
4. Add-on features (advanced analytics)

### Required Backend
- POST /v1/auth/signup
- POST /v1/auth/login
- POST /v1/billing/checkout
- POST /webhooks/dodo

---

## STAGE 5: ONBOARDING

### User Mindset
- "Now what?"
- "How do I connect my store?"
- "When does the AI start?"

### Onboarding Steps
```
Step 1: Connect Shopify
┌─────────────────────────────────────────┐
│  Connect your Shopify store              │
│                                         │
│  [Connect with Shopify]                  │
│                                         │
│  Don't have a store? [Create one →]     │
│                                         │
│  What we'll access:                     │
│  ✓ Products (read/write)                │
│  ✓ Orders (read)                        │
│  ✓ Store settings (read)                │
│                                         │
│  [Skip for now]                         │
└─────────────────────────────────────────┘

Step 2: Setup AI Phone
┌─────────────────────────────────────────┐
│  Set up your AI phone agent             │
│                                         │
│  Choose your number:                    │
│  ○ Use existing Twilio number           │
│  ○ Get a new number (we provide)        │
│                                         │
│  When should AI answer?                 │
│  ☑ After hours (6pm - 9am)              │
│  ☑ When busy                            │
│  ☑ All calls (recommended for new)     │
│                                         │
│  [Save Settings →]                      │
└─────────────────────────────────────────┘

Step 3: Choose Your Niche
┌─────────────────────────────────────────┐
│  What are you selling?                  │
│                                         │
│  ○ Fitness & wellness                   │
│  ○ Home & kitchen                       │
│  ○ Beauty & personal care               │
│  ○ Pet supplies                         │
│  ○ Tech & gadgets                       │
│  ○ Other: [type here]                   │
│                                         │
│  [Start Building →]                     │
└─────────────────────────────────────────┘
```

### First AI Task
- Queue ProductHunter agent
- Find 5 trending products in chosen niche
- Email results within 2 minutes

### Required Backend
- GET /v1/shopify/auth
- GET /v1/shopify/callback
- POST /v1/phone/setup
- POST /v1/onboarding/complete
- POST /v1/tasks (queue AI agent)

---

## STAGE 6: DELIVERY

### User Mindset
- "Is it working?"
- "What's happening?"
- "When will I see results?"

### AI Agent Dashboard
```
┌─────────────────────────────────────────────────────┐
│  DASHBOARD                           Store: [Name] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  AI AGENTS STATUS                    CALLS TODAY   │
│  ┌─────────────────────────┐         ┌───────────┐│
│  │ 🏪 StoreBuilder: Ready  │         │ Answered: ││
│  │ 📞 CallHandler: Active  │         │    23     ││
│  │ 📦 ProductHunter: Done  │         │ Missed: 0 ││
│  │ ✍️ CopyWriter: Ready    │         │           ││
│  └─────────────────────────┘         └───────────┘│
│                                                     │
│  RECENT ACTIVITY                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ 2m ago: CallHandler answered call from +1... │  │
│  │ 15m ago: ProductHunter found 5 products      │  │
│  │ 1h ago: CopyWriter updated 3 descriptions    │  │
│  │ 3h ago: StoreBuilder created homepage        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  [Run Agent: StoreBuilder] [Run: ProductHunter]    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Notification System
| Event | Channel | Content |
|-------|---------|---------|
| Call answered | Email + Dashboard | "AI handled a call from +1234567890" |
| Products found | Email + Dashboard | "5 trending products ready to view" |
| Store updated | Dashboard | "StoreBuilder updated your homepage" |
| Weekly report | Email | "Your store performance: X calls, Y revenue" |

### Revenue Collection
1. Dodo processes subscription payment
2. Funds held in Dodo wallet
3. Payout to your bank (bi-monthly, min $50)
4. Tax handling by Dodo (Merchant of Record)

### Required Backend
- GET /v1/dashboard
- GET /v1/agents/status
- GET /v1/agents/{id}/tasks
- GET /v1/calls/history
- GET /v1/products
- POST /v1/agents/run

---

## STAGE 7: RETENTION

### User Mindset
- "Is this worth it?"
- "Should I upgrade or cancel?"
- "I'm seeing results, tell others!"

### Retention Triggers
| Trigger | Action |
|---------|--------|
| 7 days before renewal | Email: "Your month in review" |
| High usage (80% calls) | Prompt: "Upgrade for more calls" |
| Low usage (<10 calls) | Email: "Tips to get more from AI" |
| Cancellation attempt | Modal: "What can we improve?" + offer |

### Upgrade Flow
```
┌─────────────────────────────────────────┐
│  UPGRADE TO GROWTH                      │
│                                         │
│  Current: Starter ($29)                 │
│  New: Growth ($79)                      │
│  Difference: +$50                       │
│                                         │
│  You'll get:                            │
│  ✓ 100 AI calls (up from 30)           │
│  ✓ 3 stores (up from 1)                │
│  ✓ Priority support                     │
│                                         │
│  Prorated charge: $41.67               │
│  (Your current billing cycle ends Apr 28)│
│                                         │
│  [Upgrade Now] [Keep Current Plan]      │
└─────────────────────────────────────────┘
```

### Advocacy Loop
```
┌─────────────────────────────────────────┐
│  SHARE STOREWRIGHT                      │
│                                         │
│  Your referral link:                   │
│  storewright.odia.dev/ref/YOUR_CODE    │
│                                         │
│  You get: 1 month free                 │
│  They get: 20% off first month         │
│                                         │
│  [Copy Link] [Share on Twitter]         │
└─────────────────────────────────────────┘
```

### Required Backend
- PUT /v1/subscriptions/{id}/upgrade
- POST /v1/referral/generate
- GET /v1/analytics/monthly
- POST /v1/feedback

---

## 🔄 REVENUE FLOW SUMMARY

```
User Pays → Dodo Payments → Webhook → Activate Subscription
                                              ↓
                                    AI Agents Run
                                              ↓
                                    User Gets Value
                                              ↓
                                    Renewal / Upgrade
                                              ↓
                                    Payout (bi-monthly)
```

---

## ⚠️ FRICTION POINTS & SOLUTIONS

| Friction | Severity | Solution |
|----------|----------|----------|
| Shopify OAuth confusing | High | One-click install, clear permissions |
| Phone setup technical | High | We provide number, guided setup |
| AI results unclear | Medium | Dashboard shows real-time activity |
| Cancellation anxiety | Medium | Clear refund policy, keep data |
| Pricing uncertainty | Low | Free trial, clear comparison |

---

## 📈 CONVERSION TARGETS

| Metric | Target | Measurement |
|--------|--------|--------------|
| Landing → Signup | 15% | Google Analytics |
| Signup → Payment | 60% | Dodo dashboard |
| Payment → Onboard | 90% | Internal tracking |
| 7-day retention | 70% | Cohort analysis |
| Monthly churn | <5% | Subscription status |
| NPS score | >50 | Survey after 7 days |

---

## 🏗️ TECHNICAL REQUIREMENTS

### Frontend (Vercel)
- React + Vite
- Tailwind CSS (custom config)
- Framer Motion (micro-interactions)
- React Query (API state)

### Backend (Render)
- FastAPI (already built)
- Supabase (already configured)
- Dodo Payments (already integrated)

### Integrations
- Shopify OAuth
- Twilio (phone numbers)
- NVIDIA NIM (AI agents)

---

## ✅ ANTI-AI CHECKLIST

### AVOID (AI Tells)
- ❌ Generic hero headlines
- ❌ Robotic templated copy
- ❌ AI-generated illustrations
- ❌ Exaggerated claims without proof
- ❌ Buzzword overkill
- ❌ Fake testimonials
- ❌ Smooth gradient backgrounds

### EMBRACE (Human Signals)
- ✅ Specific, measurable value props
- ✅ Real customer names and quotes
- ✅ Distinctive brand voice
- ✅ Real screenshots and data
- ✅ Granular feature details
- ✅ Genuine problem acknowledgment
- ✅ Founder face and story
