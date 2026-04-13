import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';

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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [storeBlueprint, setStoreBlueprint] = useState<StoreBlueprint | null>(null);
  const [copyResult, setCopyResult] = useState<AgentResult | null>(null);
  const [adResult, setAdResult] = useState<AgentResult | null>(null);
  const [supplierResult, setSupplierResult] = useState<AgentResult | null>(null);
  const [analyticsResult, setAnalyticsResult] = useState<AgentResult | null>(null);
  const [activeTab, setActiveTab] = useState<'research' | 'store' | 'copy' | 'ads' | 'suppliers' | 'analytics'>('research');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [metaConnected, setMetaConnected] = useState(false);

  useEffect(() => {
    const savedOrgId = localStorage.getItem('storewright_org_id');
    if (savedOrgId) {
      setOrgId(savedOrgId);
      checkConnections(savedOrgId);
    }
  }, []);

  const checkConnections = async (id: string) => {
    // Check Shopify connection status
    try {
      const res = await fetch(`${API_BASE}/v1/organizations/${id}`, {
        headers: { 'X-Organization-Id': id }
      });
      if (res.ok) {
        const data = await res.json();
        setShopifyConnected(!!data.shopify_store_url);
      }
    } catch {}
  };

  const runAgent = async (endpoint: string, body: any, setter: (r: any) => void) => {
    if (!orgId) {
      setError('Please complete onboarding first');
      return;
    }
    
    setLoading(endpoint);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: orgId, ...body }),
      });
      const data = await res.json();
      
      if (data.error || data.detail) {
        setError(data.error || data.detail);
      } else {
        setter(data);
        setSuccess('✓ Completed successfully!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  };

  const toggleProduct = (productName: string) => {
    setSelectedProducts(prev => 
      prev.includes(productName)
        ? prev.filter(p => p !== productName)
        : [...prev, productName]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.product_name));
    }
  };

  const useSelectedProducts = () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }
    setSuccess(`✓ ${selectedProducts.length} products selected for store building`);
    setActiveTab('store');
  };

  const runTrendHunter = () => {
    runAgent('/v1/research/trending', { count: 5 }, (data) => {
      setProducts(data.products || []);
      setSelectedProducts([]);
    });
  };

  const runStoreBuilder = () => {
    if (selectedProducts.length === 0) {
      setError('Please select products from Research tab first');
      return;
    }
    runAgent('/v1/agents/store-builder', { 
      niche: 'general',
      products: selectedProducts 
    }, (data) => {
      setStoreBlueprint(data.store_blueprint);
    });
  };

  const applyToShopify = async () => {
    if (!storeBlueprint) return;
    if (!shopifyConnected) {
      setError('Connect your Shopify store first (Settings → Integrations)');
      return;
    }
    
    setLoading('apply-shopify');
    try {
      const res = await fetch(`${API_BASE}/v1/shopify/apply-blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organization_id: orgId,
          blueprint: storeBlueprint 
        }),
      });
      if (res.ok) {
        setSuccess('✓ Store blueprint applied to your Shopify store!');
      } else {
        setError('Failed to apply. Check Shopify connection.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  };

  const runCopywriter = () => {
    if (selectedProducts.length === 0) {
      setError('Please select products from Research tab first');
      return;
    }
    runAgent('/v1/agents/copywriter', { 
      product_name: selectedProducts[0],
      product_niche: 'general'
    }, (data) => {
      setCopyResult(data.copy);
    });
  };

  const runAdCommander = () => {
    if (selectedProducts.length === 0) {
      setError('Please select products from Research tab first');
      return;
    }
    const product = products.find(p => p.product_name === selectedProducts[0]);
    runAgent('/v1/agents/ad-commander', { 
      product_name: selectedProducts[0],
      target_audience: product?.target_audience || 'general consumers'
    }, (data) => {
      setAdResult(data.ads);
    });
  };

  const launchCampaign = async () => {
    if (!adResult) return;
    if (!metaConnected) {
      setError('Connect your Meta Business account first (Settings → Integrations)');
      return;
    }
    
    setLoading('launch-ads');
    try {
      const res = await fetch(`${API_BASE}/v1/meta/launch-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organization_id: orgId,
          ads: adResult 
        }),
      });
      if (res.ok) {
        setSuccess('✓ Campaign launched! Check Facebook Ads Manager.');
      } else {
        setError('Failed to launch. Check Meta connection.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  };

  const runSupplierScout = () => {
    if (selectedProducts.length === 0) {
      setError('Please select products from Research tab first');
      return;
    }
    runAgent('/v1/agents/supplier-scout', { 
      product_name: selectedProducts[0],
      target_price: '15'
    }, (data) => {
      setSupplierResult(data.suppliers);
    });
  };

  const contactSuppliers = async () => {
    if (!supplierResult) return;
    
    setLoading('contact-suppliers');
    try {
      const res = await fetch(`${API_BASE}/v1/suppliers/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          organization_id: orgId,
          product_name: selectedProducts[0],
          suppliers: supplierResult.suppliers
        }),
      });
      if (res.ok) {
        setSuccess('✓ RFQ sent to top 3 suppliers! Check your email for responses.');
      } else {
        setError('Failed to contact suppliers');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading('');
    }
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
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">🚀 AI Command Center</h1>
              <p className="text-slate-400">Run AI agents to build your dropshipping business</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className={`flex items-center gap-2 ${shopifyConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                {shopifyConnected ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Shopify {shopifyConnected ? 'Connected' : 'Not Connected'}
              </div>
              <div className={`flex items-center gap-2 ${metaConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                {metaConnected ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Meta {metaConnected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 p-4 rounded-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Agent Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'research', label: '🔍 Product Research', icon: '🔍' },
            { id: 'store', label: '🏗️ Store Builder', icon: '🏗️' },
            { id: 'copy', label: '✍️ Copywriter', icon: '✍️' },
            { id: 'ads', label: '📢 Ad Creator', icon: '📢' },
            { id: 'suppliers', label: '🏭 Suppliers', icon: '🏭' },
            { id: 'analytics', label: '📊 Analytics', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === tab.id 
                  ? 'bg-green-600 text-white' 
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
              <p className="text-slate-400 mb-4">AI finds products with high profit potential. Select products to use in later steps.</p>
              
              <button
                onClick={runTrendHunter}
                disabled={!!loading}
                className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6 flex items-center gap-2"
              >
                {loading === '/v1/research/trending' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing TikTok trends...
                  </>
                ) : (
                  '🔍 Find Trending Products'
                )}
              </button>

              {products.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <button 
                      onClick={selectAllProducts}
                      className="text-green-400 text-sm hover:underline"
                    >
                      {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <span className="text-slate-400 text-sm">
                      {selectedProducts.length} selected
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    {products.map((p, i) => (
                      <div 
                        key={i} 
                        className={`bg-slate-700 p-4 rounded-lg cursor-pointer transition border-2 ${
                          selectedProducts.includes(p.product_name) 
                            ? 'border-green-500 bg-slate-700/80' 
                            : 'border-transparent hover:border-slate-600'
                        }`}
                        onClick={() => toggleProduct(p.product_name)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            selectedProducts.includes(p.product_name)
                              ? 'bg-green-600 border-green-600'
                              : 'border-slate-500'
                          }`}>
                            {selectedProducts.includes(p.product_name) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg">{p.product_name}</h3>
                              <span className="bg-green-600 px-2 py-1 rounded text-sm flex-shrink-0">
                                Score: {p.trend_score}/100
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                              <div><strong>Price:</strong> {p.price_range_usd}</div>
                              <div><strong>Platform:</strong> {p.platform}</div>
                              <div><strong>Audience:</strong> {p.target_audience}</div>
                              <div><strong>Why:</strong> {p.reason?.substring(0, 100)}...</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={useSelectedProducts}
                    disabled={selectedProducts.length === 0}
                    className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    Use {selectedProducts.length} Selected Products →
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Store Builder Tab */}
          {activeTab === 'store' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Store Blueprint Generator</h2>
              <p className="text-slate-400 mb-4">
                {selectedProducts.length > 0 
                  ? `Building store for: ${selectedProducts.join(', ')}` 
                  : 'Select products from Research tab first'}
              </p>
              
              {selectedProducts.length === 0 ? (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                  <p>⚠️ No products selected. Go to Product Research and select products first.</p>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className="mt-2 text-yellow-400 underline"
                  >
                    Go to Research →
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={runStoreBuilder}
                    disabled={!!loading}
                    className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6 flex items-center gap-2"
                  >
                    {loading === '/v1/agents/store-builder' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Building store blueprint...
                      </>
                    ) : (
                      '🏗️ Generate Store Blueprint'
                    )}
                  </button>

                  {storeBlueprint && (
                    <div className="bg-slate-700 p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2">{storeBlueprint.store_name}</h3>
                      <p className="text-lg text-slate-300 mb-4">{storeBlueprint.tagline}</p>
                      
                      <div className="mb-4">
                        <strong>Colors:</strong>
                        <div className="flex gap-2 mt-2">
                          <div 
                            className="w-12 h-12 rounded border border-slate-600" 
                            style={{ backgroundColor: storeBlueprint.color_scheme?.primary }}
                          />
                          <div 
                            className="w-12 h-12 rounded border border-slate-600"
                            style={{ backgroundColor: storeBlueprint.color_scheme?.accent }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-600 p-4 rounded-lg mb-4">
                        <h4 className="font-bold mb-2">Hero Section Preview</h4>
                        <p className="text-xl font-bold">{storeBlueprint.hero_section?.headline}</p>
                        <p className="text-slate-300">{storeBlueprint.hero_section?.subheadline}</p>
                        <button 
                          className="mt-2 px-4 py-2 rounded bg-green-600 text-white"
                          onClick={() => {}}
                        >
                          {storeBlueprint.hero_section?.cta}
                        </button>
                      </div>

                      {shopifyConnected ? (
                        <button
                          onClick={applyToShopify}
                          disabled={loading === 'apply-shopify'}
                          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading === 'apply-shopify' ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Applying to Shopify...
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-5 h-5" />
                              Apply to Shopify Store
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                          <p>⚠️ Shopify not connected. Connect your store in Settings to apply this blueprint.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Copywriter Tab */}
          {activeTab === 'copy' && (
            <div>
              <h2 className="text-xl font-bold mb-4">AI Copywriter</h2>
              <p className="text-slate-400 mb-4">
                {selectedProducts.length > 0 
                  ? `Writing copy for: ${selectedProducts[0]}` 
                  : 'Select a product from Research tab first'}
              </p>
              
              {selectedProducts.length === 0 ? (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                  <p>⚠️ No product selected. Go to Product Research and select a product first.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={runCopywriter}
                    disabled={!!loading}
                    className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6 flex items-center gap-2"
                  >
                    {loading === '/v1/agents/copywriter' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Writing copy...
                      </>
                    ) : (
                      '✍️ Generate Copy'
                    )}
                  </button>

                  {copyResult && (
                    <div className="space-y-4">
                      {copyResult.product_descriptions?.map((desc: any, i: number) => (
                        <div key={i} className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold text-lg mb-2">{desc.product_name}</h3>
                          <p className="text-green-400 font-bold mb-2">{desc.headline}</p>
                          <p className="text-slate-300 mb-4">{desc.long_description}</p>
                          
                          <div className="flex gap-2 mt-4">
                            <button className="bg-slate-600 px-4 py-2 rounded text-sm">
                              📋 Copy to Clipboard
                            </button>
                            {shopifyConnected && (
                              <button className="bg-blue-600 px-4 py-2 rounded text-sm">
                                Apply to Shopify Product
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {copyResult.email_sequence && (
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">Email Sequence</h3>
                          <div className="mb-4">
                            <p className="font-bold">Welcome Email:</p>
                            <p className="text-slate-400">{copyResult.email_sequence.welcome_subject}</p>
                          </div>
                          <div>
                            <p className="font-bold">Abandoned Cart:</p>
                            <p className="text-slate-400">{copyResult.email_sequence.abandoned_cart_subject}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Ad Creator Tab */}
          {activeTab === 'ads' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Ad Campaign Creator</h2>
              <p className="text-slate-400 mb-4">
                {selectedProducts.length > 0 
                  ? `Creating ads for: ${selectedProducts[0]}` 
                  : 'Select a product from Research tab first'}
              </p>
              
              {selectedProducts.length === 0 ? (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                  <p>⚠️ No product selected. Go to Product Research and select a product first.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={runAdCommander}
                    disabled={!!loading}
                    className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6 flex items-center gap-2"
                  >
                    {loading === '/v1/agents/ad-commander' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating ad concepts...
                      </>
                    ) : (
                      '📢 Generate Ad Concepts'
                    )}
                  </button>

                  {adResult && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Facebook Ads</h3>
                      {adResult.facebook_ads?.map((ad: any, i: number) => (
                        <div key={i} className="bg-slate-700 p-4 rounded-lg">
                          <div className="text-xs text-slate-400 mb-1">{ad.ad_type}</div>
                          <p className="text-lg font-bold mb-2">{ad.primary_text}</p>
                          <p className="text-green-400 mb-2">{ad.headline}</p>
                          <p className="text-sm text-slate-300 mb-2">{ad.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            <span className="bg-slate-600 px-2 py-1 rounded text-xs">CTA: {ad.cta}</span>
                            <span className="bg-slate-600 px-2 py-1 rounded text-xs">Target: {ad.target_interest}</span>
                            <span className="bg-slate-600 px-2 py-1 rounded text-xs">Budget: {ad.budget_suggestion}</span>
                          </div>
                        </div>
                      ))}

                      {adResult.tiktok_concept && (
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">TikTok Concept</h3>
                          <p><strong>Hook (first 3s):</strong> {adResult.tiktok_concept.hook_seconds}</p>
                          <p><strong>Message:</strong> {adResult.tiktok_concept.main_message}</p>
                          <p><strong>CTA:</strong> {adResult.tiktok_concept.call_to_action}</p>
                          <p className="mt-2"><strong>Hashtags:</strong> {adResult.tiktok_concept.hashtag_strategy?.join(' ')}</p>
                        </div>
                      )}

                      {metaConnected ? (
                        <button
                          onClick={launchCampaign}
                          disabled={loading === 'launch-ads'}
                          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading === 'launch-ads' ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Launching campaign...
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-5 h-5" />
                              Launch Campaign in Facebook
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                          <p>⚠️ Meta not connected. Connect your Facebook Business account in Settings to launch campaigns.</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Supplier Finder</h2>
              <p className="text-slate-400 mb-4">
                {selectedProducts.length > 0 
                  ? `Finding suppliers for: ${selectedProducts[0]}` 
                  : 'Select a product from Research tab first'}
              </p>
              
              {selectedProducts.length === 0 ? (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                  <p>⚠️ No product selected. Go to Product Research and select a product first.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={runSupplierScout}
                    disabled={!!loading}
                    className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6 flex items-center gap-2"
                  >
                    {loading === '/v1/agents/supplier-scout' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Finding suppliers...
                      </>
                    ) : (
                      '🏭 Find Suppliers'
                    )}
                  </button>

                  {supplierResult && (
                    <div className="space-y-4">
                      {supplierResult.suppliers?.map((s: any, i: number) => (
                        <div key={i} className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold text-lg">{s.platform}</h3>
                          <p className="text-slate-300 mb-2"><strong>Search:</strong> {s.search_terms?.join(', ')}</p>
                          <p className="text-slate-300 mb-2"><strong>Look for:</strong> {s.what_to_look_for}</p>
                          <p className="text-slate-300 mb-2"><strong>Red flags:</strong> {s.red_flags?.join(', ')}</p>
                          <p className="text-green-400"><strong>Est. cost:</strong> {s.estimated_cost}</p>
                        </div>
                      ))}

                      {supplierResult.vetting_checklist && (
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">Vetting Checklist</h3>
                          <ul className="list-disc list-inside text-slate-300">
                            {supplierResult.vetting_checklist.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={contactSuppliers}
                        disabled={loading === 'contact-suppliers'}
                        className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading === 'contact-suppliers' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending RFQ emails...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-5 h-5" />
                            Contact Top 3 Suppliers
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Store Analytics & Optimization</h2>
              <p className="text-slate-400 mb-4">
                {!shopifyConnected 
                  ? 'Connect your Shopify store to see real analytics'
                  : 'Pulling real data from your store'}
              </p>
              
              {!shopifyConnected ? (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
                  <p>⚠️ Shopify not connected. Connect your store in Settings to see real analytics.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={runAnalytics}
                    disabled={!!loading}
                    className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6 flex items-center gap-2"
                  >
                    {loading === '/v1/agents/analytics' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing store...
                      </>
                    ) : (
                      '📊 Analyze Performance'
                    )}
                  </button>

                  {analyticsResult && (
                    <div className="space-y-4">
                      {analyticsResult.key_metrics && (
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">Key Benchmarks</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div><strong>Conv Rate:</strong> {analyticsResult.key_metrics.conversion_rate_benchmark}</div>
                            <div><strong>AOV Target:</strong> {analyticsResult.key_metrics.avg_order_value_target}</div>
                            <div><strong>ROAS:</strong> {analyticsResult.key_metrics.roas_target}</div>
                            <div><strong>Refund Max:</strong> {analyticsResult.key_metrics.refund_rate_threshold}</div>
                          </div>
                        </div>
                      )}

                      {analyticsResult.quick_wins && (
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <h3 className="font-bold mb-2">Quick Wins</h3>
                          {analyticsResult.quick_wins.map((win: any, i: number) => (
                            <div key={i} className="mb-4 border-b border-slate-600 pb-2">
                              <p className="font-bold text-green-400">{win.problem}</p>
                              <p className="text-slate-300">{win.solution}</p>
                              <p className="text-sm text-slate-400">Impact: {win.expected_impact}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
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
            <div className="text-3xl mb-2">✓</div>
            <div className="text-2xl font-bold">{selectedProducts.length}</div>
            <div className="text-slate-400">Selected</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="text-3xl mb-2">🏗️</div>
            <div className="text-2xl font-bold">{storeBlueprint ? 1 : 0}</div>
            <div className="text-slate-400">Store Blueprints</div>
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
