import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Store, Search, Play, Pause, ArrowRight, Check } from 'lucide-react'

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<'store' | 'call' | 'product'>('store')

  return (
    <div className="bg-cream-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-display text-display-lg mb-4">See it work</h1>
          <p className="text-ink-600 max-w-2xl mx-auto">
            No signup required. Click through each agent and see what they actually do.
          </p>
        </div>

        {/* Agent selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedAgent('store')}
            className={`px-6 py-3 rounded-soft font-medium transition-colors ${
              selectedAgent === 'store' 
                ? 'bg-forest-600 text-white' 
                : 'bg-white text-ink-700 hover:bg-forest-50'
            }`}
          >
            <Store className="w-4 h-4 inline mr-2" />
            StoreBuilder
          </button>
          <button
            onClick={() => setSelectedAgent('call')}
            className={`px-6 py-3 rounded-soft font-medium transition-colors ${
              selectedAgent === 'call' 
                ? 'bg-copper-600 text-white' 
                : 'bg-white text-ink-700 hover:bg-copper-50'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            CallHandler
          </button>
          <button
            onClick={() => setSelectedAgent('product')}
            className={`px-6 py-3 rounded-soft font-medium transition-colors ${
              selectedAgent === 'product' 
                ? ? 'bg-forest-600 text-white' 
                : 'bg-white text-ink-700 hover:bg-forest-50'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            ProductHunter
          </button>
        </div>

        {/* Demo panels */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="card">
            <h2 className="font-display text-xl mb-4">Your input</h2>
            
            {selectedAgent === 'store' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink-600 mb-1">What are you selling?</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Fitness equipment, Pet supplies, Home decor"
                    className="w-full px-4 py-2 border border-ink-200 rounded-soft focus:outline-none focus:border-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-ink-600 mb-1">Store name (optional)</label>
                  <input 
                    type="text" 
                    placeholder="Leave blank for AI suggestion"
                    className="w-full px-4 py-2 border border-ink-200 rounded-soft focus:outline-none focus:border-forest-500"
                  />
                </div>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Build store
                </button>
              </div>
            )}

            {selectedAgent === 'call' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink-600 mb-1">Simulated customer question</label>
                  <select className="w-full px-4 py-2 border border-ink-200 rounded-soft focus:outline-none focus:border-copper-500">
                    <option>"Do you have this in blue?"</option>
                    <option>"When will my order arrive?"</option>
                    <option>"Can I return this?"</option>
                    <option>"What's your best seller?"</option>
                    <option>"Do you ship to Nigeria?"</option>
                  </select>
                </div>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-full flex items-center justify-center gap-2 ${
                    isPlaying ? 'bg-copper-600 text-white' : 'btn-primary'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Listening...' : 'Simulate call'}
                </button>
              </div>
            )}

            {selectedAgent === 'product' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-ink-600 mb-1">Niche (optional)</label>
                  <select className="w-full px-4 py-2 border border-ink-200 rounded-soft focus:outline-none focus:border-forest-500">
                    <option>Any trending product</option>
                    <option>Fitness & wellness</option>
                    <option>Home & kitchen</option>
                    <option>Beauty & personal care</option>
                    <option>Pet supplies</option>
                    <option>Tech & gadgets</option>
                  </select>
                </div>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" /> Find products
                </button>
              </div>
            )}
          </div>

          {/* Right: Output */}
          <div className="card bg-ink-950 text-cream-100">
            <h2 className="font-display text-xl mb-4">AI output</h2>
            
            {selectedAgent === 'store' && (
              <div className="space-y-4 font-mono text-sm">
                <p className="text-forest-400">$ storebuilder init --niche="fitness"</p>
                <p className="text-ink-400">Analyzing 47 successful fitness stores...</p>
                <p className="text-ink-400">Generating logo concepts...</p>
                <p className="text-copper-400">✓ Store created: fitgear.odia.dev</p>
                <div className="mt-4 p-4 bg-ink-900 rounded-soft">
                  <p className="text-ink-300">Pages built:</p>
                  <ul className="mt-2 space-y-1 text-ink-400">
                    <li>✓ Homepage (hero + featured products)</li>
                    <li>✓ Product catalog (12 items)</li>
                    <li>✓ About page (brand story)</li>
                    <li>✓ Contact page (form + map)</li>
                    <li>✓ Checkout flow (3 steps)</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedAgent === 'call' && (
              <div className="space-y-4 font-mono text-sm">
                <p className="text-copper-400">Incoming call from +1 (555) 123-4567</p>
                {isPlaying && (
                  <>
                    <p className="text-ink-400">CallHandler answering...</p>
                    <div className="p-4 bg-ink-900 rounded-soft mt-2">
                      <p className="text-cream-100">"Hi! Thanks for calling. I can help you check inventory, track orders, or answer questions. What do you need?"</p>
                    </div>
                    <p className="text-ink-400 mt-4">Customer: "Do you have the yoga mat in blue?"</p>
                    <div className="p-4 bg-ink-900 rounded-soft mt-2">
                      <p className="text-cream-100">"Yes! We have the Pro Yoga Mat in blue, currently in stock. It's $34.99 with free shipping. Would you like me to help you place an order?"</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedAgent === 'product' && (
              <div className="space-y-3 font-mono text-sm">
                <p className="text-forest-400">$ producthunter --trend-score=85+</p>
                <div className="space-y-2 mt-2">
                  {[
                    { name: 'Smart Jump Rope with LCD', score: 92, price: '$24-34' },
                    { name: 'Door-Mounted Pullup Bar', score: 87, price: '$19-29' },
                    { name: 'Resistance Band Set', score: 85, price: '$12-18' },
                    { name: 'Foam Roller Kit', score: 84, price: '$15-25' },
                    { name: 'Yoga Block Set', score: 81, price: '$8-15' },
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-ink-900 rounded">
                      <span>{p.name}</span>
                      <div className="text-right">
                        <span className="text-forest-400">{p.score}</span>
                        <span className="text-ink-500 ml-2">{p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-ink-600 mb-4">This is a simulation. Real agents work in your actual store.</p>
          <Link to="/onboarding" className="btn-primary inline-flex items-center gap-2">
            Get started for real <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
