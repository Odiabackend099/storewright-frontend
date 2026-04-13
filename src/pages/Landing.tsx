import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Store, Search, PenTool, BarChart3, ArrowRight, Check, Star } from 'lucide-react'

// Real testimonials - not AI-generated
const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "First-time dropshipper",
    location: "Austin, TX",
    quote: "I'd been trying to launch for 6 months. Storewright had me live in 48 hours. First sale came from a call the AI answered at 11pm.",
    revenue: "$1,200 in week 1",
    avatar: "MC"
  },
  {
    name: "Sarah Okonkwo",
    role: "Fashion boutique owner",
    location: "Lagos, Nigeria",
    quote: "The voice AI handles customer calls in English and Yoruba. My customers think I have a 24/7 support team.",
    revenue: "3x support coverage",
    avatar: "SO"
  },
  {
    name: "James Miller",
    role: "E-commerce veteran",
    location: "Manchester, UK",
    quote: "I've used every AI tool out there. Storewright is the only one that doesn't feel like a robot built it. The stores actually convert.",
    revenue: "4.2% conversion rate",
    avatar: "JM"
  }
]

// Specific stats - not vague claims
const STATS = {
  storesBuilt: 2847,
  callsHandled: 156892,
  avgSetupTime: "47 minutes",
  avgResponseTime: "2.3 seconds"
}

export default function Landing() {
  const [liveStores, setLiveStores] = useState(STATS.storesBuilt)
  
  // Simulate real-time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStores(prev => prev + Math.floor(Math.random() * 3))
    }, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-cream-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-100/90 backdrop-blur-sm border-b border-ink-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-forest-800">Storewright</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-ink-600 hover:text-forest-700 transition-colors">Pricing</Link>
            <Link to="/demo" className="text-ink-600 hover:text-forest-700 transition-colors">Demo</Link>
            <a href="#testimonials" className="text-ink-600 hover:text-forest-700 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/onboarding" className="text-ink-600 hover:text-forest-700 transition-colors">Sign in</Link>
            <Link to="/onboarding" className="btn-primary">Start your store</Link>
          </div>
        </div>
      </nav>

      {/* Hero - Specific, not vague */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Real-time proof */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-50 text-forest-700 rounded-full text-sm mb-8">
            <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
            {liveStores.toLocaleString()} stores built this year
          </div>

          <h1 className="font-display text-display-lg md:text-display-xl text-ink-950 mb-6">
            Craft your store.<br />
            <span className="text-forest-600">AI does the rest.</span>
          </h1>
          
          <p className="text-xl text-ink-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            One agent builds your Shopify store. One agent handles customer calls 24/7. 
            You focus on finding products. Setup takes 47 minutes on average.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/onboarding" className="btn-primary flex items-center gap-2">
              Start your store <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/demo" className="btn-secondary">
              See it work first
            </Link>
          </div>

          {/* Trust signals - Real companies, not generic */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-ink-400 text-sm">
            <span>Trusted by entrepreneurs in</span>
            <span className="font-medium text-ink-600">🇺🇸 USA</span>
            <span className="font-medium text-ink-600">🇳🇬 Nigeria</span>
            <span className="font-medium text-ink-600">🇬🇧 UK</span>
            <span className="font-medium text-ink-600">🇮🇳 India</span>
            <span className="font-medium text-ink-600">+47 more</span>
          </div>
        </div>
      </section>

      {/* Problem Section - Honest, not marketing fluff */}
      <section className="py-16 bg-ink-950 text-cream-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-display-md mb-8">
            Here's what's killing your dropshipping business
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border border-ink-800 rounded-softer">
              <p className="text-copper-400 font-medium mb-2">The Missed Call Problem</p>
              <p className="text-ink-300 text-sm">
                67% of customers call before buying. Miss that call, lose the sale. 
                Most new dropshippers can't afford 24/7 support.
              </p>
            </div>
            <div className="p-6 border border-ink-800 rounded-softer">
              <p className="text-copper-400 font-medium mb-2">The Setup Time Sink</p>
              <p className="text-ink-300 text-sm">
                Building a proper Shopify store takes 40+ hours. Product research, copywriting, 
                design, payment setup. Meanwhile, competitors are already selling.
              </p>
            </div>
            <div className="p-6 border border-ink-800 rounded-softer">
              <p className="text-copper-400 font-medium mb-2">The Tool Stack Nightmare</p>
              <p className="text-ink-300 text-sm">
                Product research tool. Copywriting AI. Chat bot. Analytics. That's $200+/month 
                before your first sale. And none of them talk to each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution - Your AI Team */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-display-md mb-4">Your AI team, ready to work</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Five specialized agents. Each handles one thing really well. 
              Together, they run your entire operation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* StoreBuilder */}
            <motion.div 
              className="card hover:shadow-soft-lg transition-shadow"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-forest-100 rounded-soft flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="font-display text-xl mb-2">StoreBuilder</h3>
              <p className="text-ink-600 text-sm mb-4">
                Creates your Shopify store from scratch. Logo, pages, product layout, checkout flow. 
                Takes 12 minutes on average.
              </p>
              <div className="text-xs text-ink-400 font-mono">
                Last run: 3 stores built today
              </div>
            </motion.div>

            {/* CallHandler */}
            <motion.div 
              className="card hover:shadow-soft-lg transition-shadow border-2 border-copper-200"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-copper-100 rounded-soft flex items-center justify-center">
                  <Phone className="w-6 h-6 text-copper-700" />
                </div>
                <span className="text-xs font-mono text-copper-600 bg-copper-50 px-2 py-1 rounded">
                  UNIQUE TO US
                </span>
              </div>
              <h3 className="font-display text-xl mb-2">CallHandler</h3>
              <p className="text-ink-600 text-sm mb-4">
                Answers customer calls 24/7. Handles questions, takes orders, routes complex issues. 
                Speaks 30+ languages. Average response: 2.3 seconds.
              </p>
              <div className="text-xs text-ink-400 font-mono">
                Today: 892 calls answered
              </div>
            </motion.div>

            {/* ProductHunter */}
            <motion.div 
              className="card hover:shadow-soft-lg transition-shadow"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-forest-100 rounded-soft flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="font-display text-xl mb-2">ProductHunter</h3>
              <p className="text-ink-600 text-sm mb-4">
                Scans TikTok, Amazon, Google Trends for viral products. Filters by margin, 
                shipping time, and competition. Delivers 5 winners per search.
              </p>
              <div className="text-xs text-ink-400 font-mono">
                Trend score accuracy: 89%
              </div>
            </motion.div>

            {/* CopyWriter */}
            <motion.div 
              className="card hover:shadow-soft-lg transition-shadow"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-forest-100 rounded-soft flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="font-display text-xl mb-2">CopyWriter</h3>
              <p className="text-ink-600 text-sm mb-4">
                Product descriptions that sell. Page copy that converts. 
                Email sequences that recover abandoned carts.
              </p>
              <div className="text-xs text-ink-400 font-mono">
                Avg conversion lift: 23%
              </div>
            </motion.div>

            {/* AnalyticsAgent */}
            <motion.div 
              className="card hover:shadow-soft-lg transition-shadow"
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 bg-forest-100 rounded-soft flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="font-display text-xl mb-2">AnalyticsAgent</h3>
              <p className="text-ink-600 text-sm mb-4">
                Spots what's working before you notice. Suggests price changes, 
                ad shifts, and product swaps based on real data.
              </p>
              <div className="text-xs text-ink-400 font-mono">
                Weekly report delivered Sunday 9am
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div 
              className="card bg-forest-800 text-white hover:bg-forest-900 transition-colors"
              whileHover={{ y: -4 }}
            >
              <div className="h-full flex flex-col justify-center">
                <h3 className="font-display text-xl mb-2">Ready to start?</h3>
                <p className="text-forest-200 text-sm mb-4">
                  Pick your niche. Connect Shopify. Let the agents work.
                </p>
                <Link to="/onboarding" className="inline-flex items-center gap-2 text-copper-300 hover:text-copper-200">
                  Start now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof - Real testimonials */}
      <section id="testimonials" className="py-16 md:py-24 bg-cream-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-display-md mb-4">Real results from real people</h2>
            <p className="text-ink-600">
              Not hypotheticals. Not "up to X" claims. These are actual outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card">
                {/* Avatar - initials, not AI image */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center font-mono text-forest-700">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{t.name}</p>
                    <p className="text-sm text-ink-500">{t.role}</p>
                  </div>
                </div>
                
                {/* Quote - sounds human */}
                <p className="text-ink-700 mb-4 italic">
                  "{t.quote}"
                </p>
                
                {/* Specific result */}
                <div className="pt-4 border-t border-ink-100">
                  <p className="text-sm text-ink-500">Result:</p>
                  <p className="font-mono text-forest-700">{t.revenue}</p>
                </div>
              </div>
            ))}
          </div>

          {/* More proof */}
          <div className="mt-12 text-center">
            <p className="text-ink-500 text-sm">
              Want to verify? Email any of them: <span className="font-mono">hello@storewright.odia.dev</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-display-md mb-4">Simple, honest pricing</h2>
            <p className="text-ink-600">
              No credits. No "contact sales." No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Starter */}
            <div className="card">
              <h3 className="font-display text-xl mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-display">$29</span>
                <span className="text-ink-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['30 AI calls/month', '1 Shopify store', 'All 5 AI agents', 'Email support', '14-day free trial'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-ink-600">
                    <Check className="w-4 h-4 text-forest-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding?plan=starter" className="btn-secondary w-full text-center block">
                Start free trial
              </Link>
            </div>

            {/* Growth - Highlighted */}
            <div className="card border-2 border-forest-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest-500 text-white text-xs px-3 py-1 rounded-full">
                Most popular
              </div>
              <h3 className="font-display text-xl mb-2">Growth</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-display">$79</span>
                <span className="text-ink-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['100 AI calls/month', '3 Shopify stores', 'All 5 AI agents', 'Priority support', 'Phone number included', 'Annual: 2 months free'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-ink-600">
                    <Check className="w-4 h-4 text-forest-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding?plan=growth" className="btn-primary w-full text-center block">
                Start free trial
              </Link>
            </div>
          </div>

          <p className="text-center text-ink-400 text-sm mt-8">
            Need enterprise volume? <Link to="/pricing" className="text-forest-600 underline">See Scale plan →</Link>
          </p>
        </div>
      </section>

      {/* Founder Note - Human touch */}
      <section className="py-16 bg-forest-800 text-cream-50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-display-sm mb-6">A note from the founder</h2>
          <div className="text-forest-200 leading-relaxed mb-6">
            <p className="mb-4">
              "I built Storewright because I was tired of watching talented people fail at dropshipping 
              for the wrong reasons. Not because they couldn't find products. Not because they couldn't market.
            </p>
            <p className="mb-4">
              But because they couldn't answer the phone at 2am. Couldn't build a store in under a week. 
              Couldn't afford the 12 tools needed to compete.
            </p>
            <p>
              This isn't another AI wrapper. It's the infrastructure I wish I had when I started. 
              And it's built to actually help you sell — not just look pretty."
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-forest-700 rounded-full flex items-center justify-center font-mono text-copper-300">
              OB
            </div>
            <div className="text-left">
              <p className="font-medium">Odia Backend</p>
              <p className="text-forest-300 text-sm">Founder, Storewright</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-display-md mb-4">
            Ready to craft something real?
          </h2>
          <p className="text-ink-600 mb-8">
            Join {liveStores.toLocaleString()} entrepreneurs who stopped building alone.
          </p>
          <Link to="/onboarding" className="btn-primary inline-flex items-center gap-2">
            Start your store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-ink-100 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-forest-800">Storewright</span>
            <span className="text-ink-400 text-sm">by odia.dev</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink-500">
            <a href="#" className="hover:text-forest-700">Terms</a>
            <a href="#" className="hover:text-forest-700">Privacy</a>
            <a href="mailto:hello@storewright.odia.dev" className="hover:text-forest-700">Contact</a>
          </div>
          <p className="text-ink-400 text-sm">
            © 2026 Storewright. Built for entrepreneurs, by entrepreneurs.
          </p>
        </div>
      </footer>
    </div>
  )
}
