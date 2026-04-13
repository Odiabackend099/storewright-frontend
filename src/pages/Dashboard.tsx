import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Sparkles, Store, Megaphone, Package, BarChart3, Loader2, Check, AlertCircle, ExternalLink, LogOut } from 'lucide-react'

const API_BASE = 'https://shopifywithai.onrender.com'

export default function Dashboard() {
  const { user, organizationId, signOut } = useAuth()
  const [activeView, setActiveView] = useState<'welcome' | 'research' | 'store' | 'ads' | 'suppliers' | 'analytics'>('welcome')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Results
  const [products, setProducts] = useState<any[]>([])
  const [storeBlueprint, setStoreBlueprint] = useState<any>(null)
  const [ads, setAds] = useState<any>(null)
  const [suppliers, setSuppliers] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  
  // Connections
  const [shopifyConnected, setShopifyConnected] = useState(false)
  const [metaConnected, setMetaConnected] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)

  // Run an AI task
  const runTask = async (endpoint: string, payload: any, setter: (data: any) => void) => {
    if (!organizationId) {
      setError('Organization not found. Please complete onboarding.')
      return
    }
    
    setLoading(endpoint)
    setError(null)
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: organizationId, ...payload }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Request failed')
      }
      
      const data = await res.json()
      setter(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  // Quick actions
  const findProducts = () => {
    setActiveView('research')
    runTask('/v1/research/trending', { count: 5 }, (data) => setProducts(data.products || []))
  }

  const buildStore = () => {
    setActiveView('store')
    const topProducts = products.slice(0, 3).map(p => p.product_name || p.name)
    runTask('/v1/agents/store-builder', { niche: 'general', products: topProducts }, (data) => setStoreBlueprint(data.store_blueprint))
  }

  const createAds = () => {
    setActiveView('ads')
    const topProduct = products[0]?.product_name || products[0]?.name || 'Trending Product'
    const audience = products[0]?.target_audience || 'online shoppers'
    runTask('/v1/agents/ad-commander', { product_name: topProduct, target_audience: audience }, (data) => setAds(data.ads))
  }

  const findSuppliers = () => {
    setActiveView('suppliers')
    const topProduct = products[0]?.product_name || products[0]?.name || 'Trending Product'
    runTask('/v1/agents/supplier-scout', { product_name: topProduct, target_price: '15' }, (data) => setSuppliers(data.suppliers))
  }

  const analyzeStore = () => {
    setActiveView('analytics')
    runTask('/v1/agents/analytics', { store_url: 'mystore.myshopify.com', metrics: { conversion_rate: 2.5, avg_order_value: 45 } }, (data) => setAnalytics(data.analytics))
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/onboarding'
  }

  // Determine next best action
  const getNextAction = () => {
    if (products.length === 0) return { label: 'Find Trending Products', action: findProducts, icon: Sparkles }
    if (!storeBlueprint) return { label: 'Build Your Store', action: buildStore, icon: Store }
    if (!ads) return { label: 'Create Ad Campaign', action: createAds, icon: Megaphone }
    if (!suppliers) return { label: 'Find Suppliers', action: findSuppliers, icon: Package }
    return { label: 'Analyze Performance', action: analyzeStore, icon: BarChart3 }
  }

  const nextAction = getNextAction()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top nav */}
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Storewright</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button onClick={handleSignOut} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800/30 border-r border-slate-700 p-4 min-h-[calc(100vh-52px)]">
          <nav className="space-y-1">
            {[
              { id: 'welcome', label: 'Home', icon: Sparkles },
              { id: 'research', label: 'Product Research', icon: Sparkles },
              { id: 'store', label: 'Store Builder', icon: Store },
              { id: 'ads', label: 'Ad Creator', icon: Megaphone },
              { id: 'suppliers', label: 'Supplier Finder', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                  activeView === item.id 
                    ? 'bg-forest-500/20 text-forest-400' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Connections</p>
            <div className="space-y-2">
              <button
                onClick={() => setShowConnectModal(true)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  shopifyConnected 
                    ? 'bg-forest-500/20 text-forest-400' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {shopifyConnected ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Shopify {shopifyConnected ? 'Connected' : 'Not connected'}
              </button>
              <button
                onClick={() => setShowConnectModal(true)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  metaConnected 
                    ? 'bg-forest-500/20 text-forest-400' 
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }`}
              >
                {metaConnected ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Meta Ads {metaConnected ? 'Connected' : 'Not connected'}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Welcome View */}
          {activeView === 'welcome' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome to Storewright</h1>
              <p className="text-slate-400 mb-8">Your AI-powered e-commerce command center</p>

              {/* Next best action */}
              <div className="bg-gradient-to-r from-forest-500/20 to-forest-600/10 border border-forest-500/30 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-2">Next Step</h2>
                <button
                  onClick={nextAction.action}
                  disabled={loading !== null}
                  className="bg-gradient-to-r from-forest-500 to-forest-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-forest-400 hover:to-forest-500 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <nextAction.icon className="w-5 h-5" />}
                  {nextAction.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl font-bold text-forest-400">{products.length}</div>
                  <div className="text-slate-400 text-sm">Products Found</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl font-bold text-forest-400">{storeBlueprint ? 1 : 0}</div>
                  <div className="text-slate-400 text-sm">Stores Built</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl font-bold text-forest-400">{ads?.facebook_ads?.length || 0}</div>
                  <div className="text-slate-400 text-sm">Ad Campaigns</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl font-bold text-forest-400">15</div>
                  <div className="text-slate-400 text-sm">Credits Left</div>
                </div>
              </div>

              {/* Quick actions */}
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={findProducts} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition">
                  <Sparkles className="w-6 h-6 text-forest-400 mb-2" />
                  <div className="font-medium">Find Products</div>
                  <div className="text-slate-400 text-sm">Discover trending products with AI</div>
                </button>
                <button onClick={buildStore} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition">
                  <Store className="w-6 h-6 text-forest-400 mb-2" />
                  <div className="font-medium">Build Store</div>
                  <div className="text-slate-400 text-sm">Generate a complete store blueprint</div>
                </button>
                <button onClick={createAds} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition">
                  <Megaphone className="w-6 h-6 text-forest-400 mb-2" />
                  <div className="font-medium">Create Ads</div>
                  <div className="text-slate-400 text-sm">Generate Facebook and TikTok ads</div>
                </button>
                <button onClick={findSuppliers} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition">
                  <Package className="w-6 h-6 text-forest-400 mb-2" />
                  <div className="font-medium">Find Suppliers</div>
                  <div className="text-slate-400 text-sm">Get vetted supplier recommendations</div>
                </button>
              </div>
            </div>
          )}

          {/* Product Research View */}
          {activeView === 'research' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Product Research</h1>
                  <p className="text-slate-400">AI-powered product discovery</p>
                </div>
                <button
                  onClick={findProducts}
                  disabled={loading === '/v1/research/trending'}
                  className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading === '/v1/research/trending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Find Products
                </button>
              </div>

              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((p, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{p.product_name || p.name}</h3>
                        <span className="bg-forest-500/20 text-forest-400 px-2 py-1 rounded text-sm">
                          Trend: {p.trend_score}/100
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                        <div><strong>Price:</strong> {p.price_range_usd || p.selling_price_range}</div>
                        <div><strong>Platform:</strong> {p.platform}</div>
                        <div><strong>Audience:</strong> {p.target_audience}</div>
                        <div><strong>Why Trending:</strong> {p.reason || p.product_description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Find Products" to discover trending products.</p>
                </div>
              )}
            </div>
          )}

          {/* Store Builder View */}
          {activeView === 'store' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Store Builder</h1>
                  <p className="text-slate-400">Generate a complete store blueprint</p>
                </div>
                <button
                  onClick={buildStore}
                  disabled={loading === '/v1/agents/store-builder' || products.length === 0}
                  className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading === '/v1/agents/store-builder' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                  Build Store
                </button>
              </div>

              {products.length === 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400 mb-4">
                  Find products first to generate a store blueprint.
                </div>
              )}

              {storeBlueprint ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-2xl font-bold mb-2">{storeBlueprint.store_name}</h3>
                  <p className="text-lg text-slate-300 mb-6">{storeBlueprint.tagline}</p>
                  
                  <div className="mb-6">
                    <strong className="block mb-2">Colors</strong>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: storeBlueprint.color_scheme?.primary }}></div>
                      <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: storeBlueprint.color_scheme?.accent }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                    <strong className="block mb-2">Hero Section</strong>
                    <p className="text-xl font-semibold mb-1">{storeBlueprint.hero_section?.headline}</p>
                    <p className="text-slate-300 mb-3">{storeBlueprint.hero_section?.subheadline}</p>
                    <button className="bg-forest-500 px-4 py-2 rounded-lg text-white">{storeBlueprint.hero_section?.cta}</button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                  <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Build Store" to generate your store blueprint.</p>
                </div>
              )}
            </div>
          )}

          {/* Ads View */}
          {activeView === 'ads' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Ad Creator</h1>
                  <p className="text-slate-400">Generate Facebook and TikTok ad campaigns</p>
                </div>
                <button
                  onClick={createAds}
                  disabled={loading === '/v1/agents/ad-commander' || products.length === 0}
                  className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading === '/v1/agents/ad-commander' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                  Create Ads
                </button>
              </div>

              {ads ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Facebook Ads</h3>
                  {ads.facebook_ads?.map((ad: any, i: number) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <div className="text-xs text-slate-400 mb-1">{ad.ad_type}</div>
                      <p className="font-semibold mb-1">{ad.primary_text}</p>
                      <p className="text-forest-400 mb-2">{ad.headline}</p>
                      <p className="text-sm text-slate-300 mb-2">{ad.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">CTA: {ad.cta}</span>
                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">Target: {ad.target_interest}</span>
                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">Budget: {ad.budget_suggestion}</span>
                      </div>
                    </div>
                  ))}
                  
                  {ads.tiktok_concept && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h3 className="font-semibold mb-2">TikTok Concept</h3>
                      <p><strong>Hook:</strong> {ads.tiktok_concept.hook_seconds}</p>
                      <p><strong>Message:</strong> {ads.tiktok_concept.main_message}</p>
                      <p><strong>CTA:</strong> {ads.tiktok_concept.call_to_action}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                  <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Create Ads" to generate ad campaigns.</p>
                </div>
              )}
            </div>
          )}

          {/* Suppliers View */}
          {activeView === 'suppliers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Supplier Finder</h1>
                  <p className="text-slate-400">Find vetted suppliers for your products</p>
                </div>
                <button
                  onClick={findSuppliers}
                  disabled={loading === '/v1/agents/supplier-scout' || products.length === 0}
                  className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading === '/v1/agents/supplier-scout' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                  Find Suppliers
                </button>
              </div>

              {suppliers ? (
                <div className="space-y-4">
                  {suppliers.suppliers?.map((s: any, i: number) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h3 className="font-semibold text-lg mb-2">{s.platform}</h3>
                      <p className="text-sm text-slate-300 mb-1"><strong>Search:</strong> {s.search_terms?.join(', ')}</p>
                      <p className="text-sm text-slate-300 mb-1"><strong>Look for:</strong> {s.what_to_look_for}</p>
                      <p className="text-sm text-slate-300 mb-1"><strong>Red flags:</strong> {s.red_flags?.join(', ')}</p>
                      <p className="text-forest-400"><strong>Est. cost:</strong> {s.estimated_cost}</p>
                    </div>
                  ))}
                  
                  {suppliers.vetting_checklist && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h3 className="font-semibold mb-2">Vetting Checklist</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {suppliers.vetting_checklist.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Find Suppliers" to get supplier recommendations.</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Analytics</h1>
                  <p className="text-slate-400">Performance insights and recommendations</p>
                </div>
                <button
                  onClick={analyzeStore}
                  disabled={loading === '/v1/agents/analytics'}
                  className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading === '/v1/agents/analytics' ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                  Analyze
                </button>
              </div>

              {analytics ? (
                <div className="space-y-4">
                  {analytics.key_metrics && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h3 className="font-semibold mb-3">Key Benchmarks</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div><strong>Conv Rate:</strong> {analytics.key_metrics.conversion_rate_benchmark}</div>
                        <div><strong>AOV Target:</strong> {analytics.key_metrics.avg_order_value_target}</div>
                        <div><strong>ROAS:</strong> {analytics.key_metrics.roas_target}</div>
                        <div><strong>Refund Max:</strong> {analytics.key_metrics.refund_rate_threshold}</div>
                      </div>
                    </div>
                  )}
                  
                  {analytics.quick_wins && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h3 className="font-semibold mb-3">Quick Wins</h3>
                      {analytics.quick_wins.map((win: any, i: number) => (
                        <div key={i} className="mb-4 border-b border-slate-600 pb-3 last:border-0 last:pb-0">
                          <p className="font-medium text-forest-400">{win.problem}</p>
                          <p className="text-slate-300">{win.solution}</p>
                          <p className="text-sm text-slate-400">Impact: {win.expected_impact}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Analyze" to get performance insights.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <ConnectModal onClose={() => setShowConnectModal(false)} />
      )}
    </div>
  )
}

// Connect Modal Component
function ConnectModal({ onClose }: { onClose: () => void }) {
  const [platform, setPlatform] = useState<'shopify' | 'meta'>('shopify')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Connect Your Store</h2>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPlatform('shopify')}
            className={`flex-1 py-2 rounded-lg ${platform === 'shopify' ? 'bg-forest-500' : 'bg-slate-700'}`}
          >
            Shopify
          </button>
          <button
            onClick={() => setPlatform('meta')}
            className={`flex-1 py-2 rounded-lg ${platform === 'meta' ? 'bg-forest-500' : 'bg-slate-700'}`}
          >
            Meta Ads
          </button>
        </div>

        {platform === 'shopify' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              To connect your Shopify store:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Go to your Shopify admin</li>
              <li>Click <strong>Settings → Apps and sales channels</strong></li>
              <li>Click <strong>Develop apps</strong></li>
              <li>Create a custom app named "Storewright"</li>
              <li>Configure Admin API scopes: <code className="bg-slate-700 px-1 rounded">read_products, write_products, read_orders, write_orders</code></li>
              <li>Install the app and copy the Admin API access token</li>
            </ol>
            <input 
              type="text" 
              placeholder="Paste your Shopify access token"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        )}

        {platform === 'meta' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              To connect your Meta Ads account:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Go to <a href="https://developers.facebook.com" target="_blank" className="text-forest-400 underline">Meta Developers</a></li>
              <li>Create a Business app</li>
              <li>Add Marketing API product</li>
              <li>Generate a long-lived Page access token</li>
              <li>Copy the token and your Ad Account ID</li>
            </ol>
            <input 
              type="text" 
              placeholder="Paste your Meta access token"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white mb-2"
            />
            <input 
              type="text" 
              placeholder="Ad Account ID (e.g., act_123456789)"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-forest-500 hover:bg-forest-600">
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}
