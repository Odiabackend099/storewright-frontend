import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Sparkles, Store, Megaphone, Package, BarChart3, Loader2, Check, AlertCircle, LogOut } from 'lucide-react'
import ConnectModal from '../components/ConnectModal'

const API_BASE = 'https://shopifywithai.onrender.com'

export default function Dashboard() {
  const { user, organizationId, signOut, refreshOrganization } = useAuth()
  const [activeView, setActiveView] = useState<'welcome' | 'research' | 'store' | 'ads' | 'suppliers' | 'analytics'>('welcome')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [storeBlueprint, setStoreBlueprint] = useState<any>(null)
  const [ads, setAds] = useState<any>(null)
  const [suppliers, setSuppliers] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [shopifyConnected, setShopifyConnected] = useState(false)
  const [metaConnected, setMetaConnected] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectPlatform, setConnectPlatform] = useState<'shopify' | 'meta'>('shopify')

  useEffect(() => {
    void refreshOrganization()
  }, [refreshOrganization])

  const runTask = async (endpoint: string, payload: any, setter: (data: any) => void) => {
    if (!organizationId) {
      setError('Please finish onboarding first. Your workspace is tied to your account automatically.')
      return
    }
    setLoading(endpoint)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ organization_id: organizationId, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Request failed')
      setter(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  const findProducts = () => { setActiveView('research'); runTask('/v1/research/trending', { count: 5 }, d => setProducts(d.products || [])) }
  const buildStore = () => { setActiveView('store'); runTask('/v1/agents/store-builder', { niche: 'general', products: products.slice(0, 3).map(p => p.product_name || p.name) }, d => setStoreBlueprint(d.store_blueprint)) }
  const createAds = () => { setActiveView('ads'); runTask('/v1/agents/ad-commander', { product_name: products[0]?.product_name || 'Trending Product', target_audience: products[0]?.target_audience || 'online shoppers' }, d => setAds(d.ads)) }
  const findSuppliers = () => { setActiveView('suppliers'); runTask('/v1/agents/supplier-scout', { product_name: products[0]?.product_name || 'Trending Product', target_price: '15' }, d => setSuppliers(d.suppliers)) }
  const analyzeStore = () => { setActiveView('analytics'); runTask('/v1/agents/analytics', { store_url: 'mystore.myshopify.com', metrics: { conversion_rate: 2.5, avg_order_value: 45 } }, d => setAnalytics(d.analytics)) }

  const handleSignOut = async () => { await signOut(); window.location.href = '/onboarding' }

  const connectAccount = async (platform: 'shopify' | 'meta', payload: { access_token: string; store_url?: string; ad_account_id?: string }) => {
    if (!organizationId) throw new Error('No organization found. Finish onboarding first.')
    const endpoint = platform === 'shopify' ? '/v1/shopify/connect' : '/v1/meta/connect'
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'x-organization-id': organizationId },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Connection failed')
    if (platform === 'shopify') setShopifyConnected(true)
    if (platform === 'meta') setMetaConnected(true)
  }

  const buildLiveStore = async () => {
    if (!organizationId) {
      setError('Please finish onboarding first.')
      return
    }
    if (!shopifyConnected) {
      setConnectPlatform('shopify')
      setShowConnectModal(true)
      return
    }
    if (!products.length) {
      setError('Find products first, then build the store.')
      return
    }
    setLoading('build-live-store')
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/v1/shopify/build-store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          organization_id: organizationId,
          blueprint: storeBlueprint || {},
          products: products.slice(0, 5),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || data.error || 'Failed to build store')
      setActiveView('store')
      setError('Live Shopify store build completed.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  const nextAction = products.length === 0 ? { label: 'Find Trending Products', action: findProducts, icon: Sparkles } : !storeBlueprint ? { label: 'Build Your Store', action: buildStore, icon: Store } : !ads ? { label: 'Create Ad Campaign', action: createAds, icon: Megaphone } : !suppliers ? { label: 'Find Suppliers', action: findSuppliers, icon: Package } : { label: 'Analyze Performance', action: analyzeStore, icon: BarChart3 }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-forest-500 to-forest-600 rounded-lg flex items-center justify-center"><Store className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-lg">Storewright</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button onClick={handleSignOut} className="text-slate-400 hover:text-white text-sm flex items-center gap-1"><LogOut className="w-4 h-4" /> Sign out</button>
        </div>
      </nav>

      <div className="flex">
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
              <button key={item.id} onClick={() => setActiveView(item.id as any)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${activeView === item.id ? 'bg-forest-500/20 text-forest-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Connections</p>
            <div className="space-y-2">
              <button onClick={() => { setConnectPlatform('shopify'); setShowConnectModal(true) }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${shopifyConnected ? 'bg-forest-500/20 text-forest-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                {shopifyConnected ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} Shopify {shopifyConnected ? 'Connected' : 'Not connected'}
              </button>
              <button onClick={() => { setConnectPlatform('meta'); setShowConnectModal(true) }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${metaConnected ? 'bg-forest-500/20 text-forest-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'}`}>
                {metaConnected ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} Meta Ads {metaConnected ? 'Connected' : 'Not connected'}
              </button>
            </div>
            <button onClick={buildLiveStore} className="mt-4 w-full px-3 py-2 rounded-lg bg-forest-600 hover:bg-forest-500 text-white text-sm">Build Live Shopify Store</button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">{error}</div>}

          {activeView === 'welcome' && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome to Storewright</h1>
              <p className="text-slate-400 mb-8">Your AI-powered e-commerce command center</p>
              <div className="bg-gradient-to-r from-forest-500/20 to-forest-600/10 border border-forest-500/30 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-2">Next Step</h2>
                <button onClick={nextAction.action} disabled={loading !== null} className="bg-gradient-to-r from-forest-500 to-forest-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-forest-400 hover:to-forest-500 flex items-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <nextAction.icon className="w-5 h-5" />} {nextAction.label} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"><div className="text-3xl font-bold text-forest-400">{products.length}</div><div className="text-slate-400 text-sm">Products Found</div></div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"><div className="text-3xl font-bold text-forest-400">{storeBlueprint ? 1 : 0}</div><div className="text-slate-400 text-sm">Stores Built</div></div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"><div className="text-3xl font-bold text-forest-400">{ads?.facebook_ads?.length || 0}</div><div className="text-slate-400 text-sm">Ad Campaigns</div></div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"><div className="text-3xl font-bold text-forest-400">15</div><div className="text-slate-400 text-sm">Credits Left</div></div>
              </div>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={findProducts} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition"><Sparkles className="w-6 h-6 text-forest-400 mb-2" /><div className="font-medium">Find Products</div><div className="text-slate-400 text-sm">Discover trending products with AI</div></button>
                <button onClick={buildStore} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition"><Store className="w-6 h-6 text-forest-400 mb-2" /><div className="font-medium">Build Store</div><div className="text-slate-400 text-sm">Generate a complete store blueprint</div></button>
                <button onClick={createAds} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition"><Megaphone className="w-6 h-6 text-forest-400 mb-2" /><div className="font-medium">Create Ads</div><div className="text-slate-400 text-sm">Generate Facebook and TikTok ads</div></button>
                <button onClick={findSuppliers} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-forest-500 transition"><Package className="w-6 h-6 text-forest-400 mb-2" /><div className="font-medium">Find Suppliers</div><div className="text-slate-400 text-sm">Get vetted supplier recommendations</div></button>
              </div>
            </div>
          )}

          {activeView === 'research' && <div>
            <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">Product Research</h1><p className="text-slate-400">AI-powered product discovery</p></div><button onClick={findProducts} disabled={loading === '/v1/research/trending'} className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2">{loading === '/v1/research/trending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Find Products</button></div>
            {products.length > 0 ? <div className="space-y-4">{products.map((p, i) => <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"><div className="flex items-start justify-between mb-3"><h3 className="font-semibold text-lg">{p.product_name || p.name}</h3><span className="bg-forest-500/20 text-forest-400 px-2 py-1 rounded text-sm">Trend: {p.trend_score}/100</span></div><div className="grid grid-cols-2 gap-4 text-sm text-slate-300"><div><strong>Price:</strong> {p.price_range_usd || p.selling_price_range}</div><div><strong>Platform:</strong> {p.platform}</div><div><strong>Audience:</strong> {p.target_audience}</div><div><strong>Why Trending:</strong> {p.reason || p.product_description}</div></div></div>)}</div> : <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400"><Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Click "Find Products" to discover trending products.</p></div>}
          </div>}

          {activeView === 'store' && <div>
            <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">Store Builder</h1><p className="text-slate-400">Generate a complete store blueprint</p></div><button onClick={buildStore} disabled={loading === '/v1/agents/store-builder' || products.length === 0} className="bg-forest-500 text-white px-4 py-2 rounded-lg hover:bg-forest-600 disabled:opacity-50 flex items-center gap-2">{loading === '/v1/agents/store-builder' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />} Build Store</button></div>
            {products.length === 0 && <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400 mb-4">Find products first to generate a store blueprint.</div>}
            {storeBlueprint ? <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"><h3 className="text-2xl font-bold mb-2">{storeBlueprint.store_name}</h3><p className="text-lg text-slate-300 mb-6">{storeBlueprint.tagline}</p><div className="mb-6"><strong className="block mb-2">Colors</strong><div className="flex gap-3"><div className="w-12 h-12 rounded-lg" style={{ backgroundColor: storeBlueprint.color_scheme?.primary }}></div><div className="w-12 h-12 rounded-lg" style={{ backgroundColor: storeBlueprint.color_scheme?.accent }}></div></div></div><div className="bg-slate-700/50 rounded-lg p-4 mb-4"><strong className="block mb-2">Hero Section</strong><p className="text-xl font-semibold mb-1">{storeBlueprint.hero_section?.headline}</p><p className="text-slate-300 mb-3">{storeBlueprint.hero_section?.subheadline}</p><button className="bg-forest-500 px-4 py-2 rounded-lg text-white">{storeBlueprint.hero_section?.cta}</button></div></div> : <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-12 text-center text-slate-400"><Store className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Click "Build Store" to generate your store blueprint.</p></div>}
          </div>}

          {activeView === 'ads' && <div>...</div>}
          {activeView === 'suppliers' && <div>...</div>}
          {activeView === 'analytics' && <div>...</div>}
        </main>
      </div>

      <ConnectModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} onConnect={connectAccount} />
    </div>
  )
}
