import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const API_BASE = 'https://shopifywithai.onrender.com';

interface Product {
  product_name: string;
  platform: string;
  trend_score: number;
  price_range_usd: string;
  target_audience: string;
  reason: string;
}

interface StoreBlueprint {
  store_name: string;
  tagline: string;
  color_scheme: { primary: string; accent: string };
  hero_section: { headline: string; subheadline: string; cta: string };
}

interface AgentResult {
  [key: string]: any;
}

export default function Dashboard() {
  const [orgId, setOrgId] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [storeBlueprint, setStoreBlueprint] = useState<StoreBlueprint | null>(null);
  const [copyResult, setCopyResult] = useState<AgentResult | null>(null);
  const [adResult, setAdResult] = useState<AgentResult | null>(null);
  const [supplierResult, setSupplierResult] = useState<AgentResult | null>(null);
  const [analyticsResult, setAnalyticsResult] = useState<AgentResult | null>(null);
  const [activeTab, setActiveTab] = useState<'research' | 'store' | 'copy' | 'ads' | 'suppliers' | 'analytics'>('research');
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  useEffect(() => {
    // Get org ID from localStorage (set during onboarding)
    const savedOrgId = localStorage.getItem('storewright_org_id');
    
    if (savedOrgId) {
      setOrgId(savedOrgId);
    } else {
      // No org ID - user needs to complete onboarding
      setShowOnboardingPrompt(true);
    }
  }, []);

  const runAgent = async (endpoint: string, body: any, setter: (r: any) => void) => {
    if (!orgId) {
      setShowOnboardingPrompt(true);
      return;
    }
    
    setLoading(endpoint);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: orgId, ...body }),
      });
      const data = await res.json();
      setter(data);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading('');
    }
  };

  const runTrendHunter = () => {
    runAgent('/v1/research/trending', { count: 5 }, (data) => {
      setProducts(data.products || []);
    });
  };

  const runStoreBuilder = () => {
    const topProducts = products.slice(0, 3).map(p => p.product_name);
    runAgent('/v1/agents/store-builder', { 
      niche: 'general',
      products: topProducts 
    }, (data) => {
      setStoreBlueprint(data.store_blueprint);
    });
  };

  const runCopywriter = () => {
    const topProduct = products[0]?.product_name || 'Smart Watch';
    runAgent('/v1/agents/copywriter', { 
      product_name: topProduct,
      product_niche: 'electronics'
    }, (data) => {
      setCopyResult(data.copy);
    });
  };

  const runAdCommander = () => {
    const topProduct = products[0]?.product_name || 'Smart Watch';
    const audience = products[0]?.target_audience || 'young professionals';
    runAgent('/v1/agents/ad-commander', { 
      product_name: topProduct,
      target_audience: audience
    }, (data) => {
      setAdResult(data.ads);
    });
  };

  const runSupplierScout = () => {
    const topProduct = products[0]?.product_name || 'Smart Watch';
    runAgent('/v1/agents/supplier-scout', { 
      product_name: topProduct,
      target_price: '15'
    }, (data) => {
      setSupplierResult(data.suppliers);
    });
  };

  const runAnalytics = () => {
    runAgent('/v1/agents/analytics', { 
      store_url: 'mystore.myshopify.com',
      metrics: { conversion_rate: 2.5, avg_order_value: 45 }
    }, (data) => {
      setAnalyticsResult(data.analytics);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🚀 Your AI Command Center</h1>
          <p className="text-slate-400">Run AI agents to build your dropshipping business</p>
        </div>

        {/* Onboarding Prompt - Only shows if no org ID */}
        {showOnboardingPrompt && (
          <div className="bg-amber-900/50 border border-amber-500 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-amber-400 mb-2">Welcome to Storewright!</h3>
            <p className="text-slate-300 mb-4">
              Create your free account to start using AI agents. No credit card required — you get free AI credits instantly.
            </p>
            <a 
              href="/onboarding" 
              className="inline-flex items-center gap-2 bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 transition"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Agent Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'research', label: '🔍 Product Research' },
            { id: 'store', label: '🏗️ Store Builder' },
            { id: 'copy', label: '✍️ Copywriter' },
            { id: 'ads', label: '📢 Ad Creator' },
            { id: 'suppliers', label: '🏭 Suppliers' },
            { id: 'analytics', label: '📊 Analytics' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === tab.id 
                  ? 'bg-forest-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-800 rounded-lg p-6">
          {/* Product Research Tab */}
          {activeTab === 'research' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Trending Product Research</h2>
              <p className="text-slate-400 mb-4">AI will find 5 trending products with profit margins, target audiences, and supplier tips.</p>
              
              <button
                onClick={runTrendHunter}
                disabled={!!loading || !orgId}
                className="bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 disabled:opacity-50 mb-6"
              >
                {loading === '/v1/research/trending' ? '🔄 Researching...' : '🔍 Find Trending Products'}
              </button>

              {products.length > 0 && (
                <div className="space-y-4">
                  {products.map((p, i) => (
                    <div key={i} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{p.product_name || p.name}</h3>
                        <span className="bg-forest-600 px-2 py-1 rounded text-sm">
                          Trend: {p.trend_score}/100
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                        <div><strong>Price:</strong> {p.price_range_usd}</div>
                        <div><strong>Platform:</strong> {p.platform}</div>
                        <div><strong>Audience:</strong> {p.target_audience}</div>
                        <div><strong>Why Trending:</strong> {p.reason || p.product_description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Store Builder Tab */}
          {activeTab === 'store' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Store Blueprint Generator</h2>
              <p className="text-slate-400 mb-4">AI will design your store: name, colors, hero section, and trust signals.</p>
              
              <button
                onClick={runStoreBuilder}
                disabled={!!loading || products.length === 0}
                className="bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 disabled:opacity-50 mb-6"
              >
                {loading === '/v1/agents/store-builder' ? '🔄 Building...' : '🏗️ Generate Store Blueprint'}
              </button>

              {products.length === 0 && (
                <p className="text-yellow-500">⚠️ Run Product Research first to get product ideas.</p>
              )}

              {storeBlueprint && (
                <div className="bg-slate-700 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-2">{storeBlueprint.store_name}</h3>
                  <p className="text-lg text-slate-300 mb-4">{storeBlueprint.tagline}</p>
                  
                  <div className="mb-4">
                    <strong>Colors:</strong>
                    <div className="flex gap-2 mt-2">
                      <div className="w-12 h-12 rounded" style={{ backgroundColor: storeBlueprint.color_scheme?.primary }}></div>
                      <div className="w-12 h-12 rounded" style={{ backgroundColor: storeBlueprint.color_scheme?.accent }}></div>
                    </div>
                  </div>

                  <div className="bg-slate-600 p-4 rounded-lg mb-4">
                    <h4 className="font-bold mb-2">Hero Section</h4>
                    <p className="text-xl font-bold">{storeBlueprint.hero_section?.headline}</p>
                    <p className="text-slate-300">{storeBlueprint.hero_section?.subheadline}</p>
                    <button className="mt-2 bg-forest-600 px-4 py-2 rounded">{storeBlueprint.hero_section?.cta}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Copywriter Tab */}
          {activeTab === 'copy' && (
            <div>
              <h2 className="text-xl font-bold mb-4">AI Copywriter</h2>
              <p className="text-slate-400 mb-4">Generate product descriptions, welcome emails, and abandoned cart sequences.</p>
              
              <button
                onClick={runCopywriter}
                disabled={!!loading || products.length === 0}
                className="bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 disabled:opacity-50 mb-6"
              >
                {loading === '/v1/agents/copywriter' ? '🔄 Writing...' : '✍️ Generate Copy'}
              </button>

              {copyResult && (
                <div className="space-y-4">
                  {copyResult.product_descriptions?.map((desc: any, i: number) => (
                    <div key={i} className="bg-slate-700 p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">{desc.product_name}</h3>
                      <p className="text-forest-400 font-bold mb-2">{desc.headline}</p>
                      <p className="text-slate-300 mb-4">{desc.long_description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ad Creator Tab */}
          {activeTab === 'ads' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Ad Campaign Creator</h2>
              <p className="text-slate-400 mb-4">Generate Facebook and TikTok ad concepts with hooks and targeting.</p>
              
              <button
                onClick={runAdCommander}
                disabled={!!loading || products.length === 0}
                className="bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 disabled:opacity-50 mb-6"
              >
                {loading === '/v1/agents/ad-commander' ? '🔄 Creating...' : '📢 Generate Ad Concepts'}
              </button>

              {adResult && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Facebook Ads</h3>
                  {adResult.facebook_ads?.map((ad: any, i: number) => (
                    <div key={i} className="bg-slate-700 p-4 rounded-lg">
                      <p className="text-lg font-bold mb-2">{ad.primary_text}</p>
                      <p className="text-forest-400 mb-2">{ad.headline}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-slate-600 px-2 py-1 rounded text-xs">CTA: {ad.cta}</span>
                        <span className="bg-slate-600 px-2 py-1 rounded text-xs">Budget: {ad.budget_suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Supplier Finder</h2>
              <p className="text-slate-400 mb-4">Find vetted suppliers on Alibaba, DHGate, and more.</p>
              
              <button
                onClick={runSupplierScout}
                disabled={!!loading || products.length === 0}
                className="bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 disabled:opacity-50 mb-6"
              >
                {loading === '/v1/agents/supplier-scout' ? '🔄 Searching...' : '🏭 Find Suppliers'}
              </button>

              {supplierResult && (
                <div className="space-y-4">
                  {supplierResult.suppliers?.map((s: any, i: number) => (
                    <div key={i} className="bg-slate-700 p-4 rounded-lg">
                      <h3 className="font-bold text-lg">{s.platform}</h3>
                      <p className="text-forest-400"><strong>Est. cost:</strong> {s.estimated_cost}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Store Analytics & Optimization</h2>
              <p className="text-slate-400 mb-4">Get insights and optimization recommendations.</p>
              
              <button
                onClick={runAnalytics}
                disabled={!!loading}
                className="bg-forest-600 px-6 py-3 rounded-lg hover:bg-forest-700 disabled:opacity-50 mb-6"
              >
                {loading === '/v1/agents/analytics' ? '🔄 Analyzing...' : '📊 Analyze Performance'}
              </button>

              {analyticsResult && (
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Key Benchmarks</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Conv Rate:</strong> {analyticsResult.key_metrics?.conversion_rate_benchmark}</div>
                    <div><strong>AOV Target:</strong> {analyticsResult.key_metrics?.avg_order_value_target}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-slate-400">Products Found</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🏗️</div>
            <div className="text-2xl font-bold">{storeBlueprint ? 1 : 0}</div>
            <div className="text-slate-400">Stores Built</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">✍️</div>
            <div className="text-2xl font-bold">{copyResult ? 1 : 0}</div>
            <div className="text-slate-400">Copy Generated</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">📢</div>
            <div className="text-2xl font-bold">{adResult?.facebook_ads?.length || 0}</div>
            <div className="text-slate-400">Ad Concepts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
