import { useState, useEffect } from 'react';
import AgentProgress, { AgentStep } from '../components/AgentProgress';
import OAuthConnect from '../components/OAuthConnect';

const API_BASE = 'https://shopifywithai.onrender.com';

interface Product {
  product_name: string;
  platform: string;
  trend_score: number;
  price_range_usd: string;
  target_audience: string;
  reason: string;
  selected?: boolean;
}

interface StoreBlueprint {
  store_name: string;
  tagline: string;
  color_scheme: { primary: string; accent: string };
  hero_section: { headline: string; subheadline: string; cta: string };
}

export default function Dashboard() {
  const [orgId, setOrgId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeBlueprint, setStoreBlueprint] = useState<StoreBlueprint | null>(null);
  const [copyResult, setCopyResult] = useState<any>(null);
  const [adResult, setAdResult] = useState<any>(null);
  const [supplierResult, setSupplierResult] = useState<any>(null);
  const [analyticsResult, setAnalyticsResult] = useState<any>(null);
  
  // Agent Progress State
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrgId = params.get('org_id');
    const savedOrgId = localStorage.getItem('storewright_org_id');
    
    if (urlOrgId) {
      setOrgId(urlOrgId);
      localStorage.setItem('storewright_org_id', urlOrgId);
    } else if (savedOrgId) {
      setOrgId(savedOrgId);
    }
  }, []);

  const simulateAgentProgress = async (
    agentName: string,
    agentIcon: string,
    steps: string[],
    apiCall: () => Promise<any>,
    onSuccess: (data: any) => void
  ) => {
    setActiveAgent(agentName);
    setStartTime(new Date());
    setSuccessMessage(null);
    
    // Initialize steps
    const initialSteps: AgentStep[] = steps.map(name => ({
      name,
      status: 'pending' as const
    }));
    setAgentSteps(initialSteps);

    // Simulate progress for each step
    for (let i = 0; i < steps.length; i++) {
      // Mark current step as running
      setAgentSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx === i ? 'running' : idx < i ? 'completed' : 'pending',
        message: idx === i ? 'Processing...' : undefined
      })));
      
      // Simulate step duration (1-3 seconds per step)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Mark as completed
      setAgentSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx <= i ? 'completed' : 'pending'
      })));
    }

    // Run actual API call
    setLoading(true);
    try {
      const data = await apiCall();
      onSuccess(data);
      setSuccessMessage(`${agentName} completed successfully!`);
      
      // Show success for 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Mark last step as failed
      setAgentSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx === steps.length - 1 ? 'failed' : 'completed',
        message: idx === steps.length - 1 ? err.message : undefined
      })));
    } finally {
      setLoading(false);
      // Keep progress visible for 2 more seconds
      setTimeout(() => {
        setActiveAgent(null);
        setAgentSteps([]);
      }, 2000);
    }
  };

  const runTrendHunter = () => {
    simulateAgentProgress(
      'TrendHunter',
      '🔍',
      ['Scanning TikTok trends', 'Analyzing Amazon bestsellers', 'Cross-referencing suppliers', 'Calculating profit margins', 'Ranking opportunities'],
      async () => {
        const res = await fetch(`${API_BASE}/v1/research/trending`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ organization_id: orgId, count: 5 }),
        });
        const data = await res.json();
        return data;
      },
      (data) => {
        setProducts((data.products || []).map((p: Product) => ({ ...p, selected: true })));
      }
    );
  };

  const runStoreBuilder = () => {
    const selectedProducts = products.filter(p => p.selected);
    simulateAgentProgress(
      'StoreBuilder',
      '🏗️',
      ['Analyzing product themes', 'Designing brand identity', 'Creating color palette', 'Building hero section', 'Adding trust signals'],
      async () => {
        const res = await fetch(`${API_BASE}/v1/agents/store-builder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            organization_id: orgId,
            niche: 'general',
            products: selectedProducts.slice(0, 3).map(p => p.product_name)
          }),
        });
        const data = await res.json();
        return data;
      },
      (data) => {
        setStoreBlueprint(data.store_blueprint);
      }
    );
  };

  const runCopywriter = () => {
    const selectedProduct = products.find(p => p.selected);
    if (!selectedProduct) return;
    
    simulateAgentProgress(
      'CopyWriter',
      '✍️',
      ['Analyzing product features', 'Crafting headlines', 'Writing descriptions', 'Building email sequences', 'Adding urgency triggers'],
      async () => {
        const res = await fetch(`${API_BASE}/v1/agents/copywriter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            organization_id: orgId,
            product_name: selectedProduct.product_name,
            product_niche: 'general'
          }),
        });
        const data = await res.json();
        return data;
      },
      (data) => {
        setCopyResult(data.copy);
      }
    );
  };

  const runAdCommander = () => {
    const selectedProduct = products.find(p => p.selected);
    if (!selectedProduct) return;
    
    simulateAgentProgress(
      'AdCommander',
      '📢',
      ['Researching target audience', 'Writing ad copy', 'Designing hooks', 'Setting budgets', 'Optimizing for conversions'],
      async () => {
        const res = await fetch(`${API_BASE}/v1/agents/ad-commander`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            organization_id: orgId,
            product_name: selectedProduct.product_name,
            target_audience: selectedProduct.target_audience
          }),
        });
        const data = await res.json();
        return data;
      },
      (data) => {
        setAdResult(data.ads);
      }
    );
  };

  const runSupplierScout = () => {
    const selectedProduct = products.find(p => p.selected);
    if (!selectedProduct) return;
    
    simulateAgentProgress(
      'SupplierScout',
      '🏭',
      ['Searching Alibaba', 'Checking DHGate', 'Verifying suppliers', 'Negotiating terms', 'Calculating landed costs'],
      async () => {
        const res = await fetch(`${API_BASE}/v1/agents/supplier-scout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            organization_id: orgId,
            product_name: selectedProduct.product_name,
            target_price: '15'
          }),
        });
        const data = await res.json();
        return data;
      },
      (data) => {
        setSupplierResult(data.suppliers);
      }
    );
  };

  const runAnalytics = () => {
    simulateAgentProgress(
      'AnalyticsAgent',
      '📊',
      ['Pulling store metrics', 'Analyzing conversion funnel', 'Identifying drop-offs', 'Generating recommendations', 'Prioritizing quick wins'],
      async () => {
        const res = await fetch(`${API_BASE}/v1/agents/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            organization_id: orgId,
            store_url: 'mystore.myshopify.com',
            metrics: { conversion_rate: 2.5, avg_order_value: 45 }
          }),
        });
        const data = await res.json();
        return data;
      },
      (data) => {
        setAnalyticsResult(data.analytics);
      }
    );
  };

  const toggleProductSelection = (index: number) => {
    setProducts(prev => prev.map((p, i) => 
      i === index ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectedCount = products.filter(p => p.selected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-32">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          ✓ {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-forest-400 to-green-300 bg-clip-text text-transparent">
            🚀 AI Command Center
          </h1>
          <p className="text-slate-400">Run AI agents to build your dropshipping business from scratch</p>
        </div>

        {!orgId ? (
          <div className="bg-slate-800 p-6 rounded-xl">
            <p className="text-slate-300 mb-4">Complete onboarding to start using AI agents.</p>
            <a href="/onboarding" className="text-forest-400 hover:text-forest-300">→ Go to onboarding</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Research */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Research Card */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    TrendHunter
                  </h2>
                  <button
                    onClick={runTrendHunter}
                    disabled={loading || activeAgent !== null}
                    className="px-4 py-2 bg-forest-600 hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all transform hover:scale-105"
                  >
                    {activeAgent === 'TrendHunter' ? '🔄 Analyzing...' : 'Find Products'}
                  </button>
                </div>

                {products.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-slate-400 text-sm">{products.length} products found • {selectedCount} selected</p>
                      {selectedCount > 0 && (
                        <span className="text-forest-400 text-sm font-medium">
                          ✓ {selectedCount} products will be used by other agents
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {products.map((p, i) => (
                        <div 
                          key={i} 
                          className={`bg-slate-700 rounded-lg p-4 transition-all cursor-pointer border-2 ${
                            p.selected ? 'border-forest-500 bg-forest-900/20' : 'border-transparent hover:border-slate-600'
                          }`}
                          onClick={() => toggleProductSelection(i)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={p.selected}
                                onChange={() => toggleProductSelection(i)}
                                className="w-5 h-5 rounded border-slate-500 text-forest-600 focus:ring-forest-500"
                              />
                              <h3 className="font-bold">{p.product_name}</h3>
                            </div>
                            <span className="bg-forest-600 px-2 py-1 rounded text-sm font-bold">
                              {p.trend_score}/100
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 ml-8">
                            <div><strong>💰 Price:</strong> {p.price_range_usd}</div>
                            <div><strong>📱 Platform:</strong> {p.platform}</div>
                            <div><strong>👥 Audience:</strong> {p.target_audience}</div>
                            <div><strong>🔥 Why:</strong> {p.reason?.slice(0, 50)}...</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Agent Buttons Grid */}
              {products.length > 0 && selectedCount > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { name: 'StoreBuilder', icon: '🏗️', action: runStoreBuilder, result: storeBlueprint },
                    { name: 'CopyWriter', icon: '✍️', action: runCopywriter, result: copyResult },
                    { name: 'AdCommander', icon: '📢', action: runAdCommander, result: adResult },
                    { name: 'SupplierScout', icon: '🏭', action: runSupplierScout, result: supplierResult },
                    { name: 'Analytics', icon: '📊', action: runAnalytics, result: analyticsResult },
                  ].map(agent => (
                    <button
                      key={agent.name}
                      onClick={agent.action}
                      disabled={loading || activeAgent !== null}
                      className={`p-4 rounded-xl text-center transition-all transform hover:scale-105 ${
                        agent.result 
                          ? 'bg-forest-600/20 border-2 border-forest-500' 
                          : 'bg-slate-700 border-2 border-slate-600 hover:border-forest-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="text-3xl mb-2">{agent.icon}</div>
                      <div className="text-sm font-medium">{agent.name}</div>
                      {agent.result && <div className="text-forest-400 text-xs mt-1">✓ Done</div>}
                    </button>
                  ))}
                </div>
              )}

              {/* Results Display */}
              {(storeBlueprint || copyResult || adResult || supplierResult || analyticsResult) && (
                <div className="bg-slate-800 rounded-xl p-6 space-y-6">
                  {storeBlueprint && (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        🏗️ Store Blueprint
                        <span className="text-forest-400 text-sm">• Generated</span>
                      </h3>
                      <div className="text-2xl font-bold text-forest-400 mb-2">{storeBlueprint.store_name}</div>
                      <p className="text-slate-300 mb-4">{storeBlueprint.tagline}</p>
                      <div className="flex gap-2 mb-4">
                        <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: storeBlueprint.color_scheme?.primary }} />
                        <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: storeBlueprint.color_scheme?.accent }} />
                      </div>
                      <div className="bg-slate-600 rounded-lg p-4">
                        <div className="text-xl font-bold">{storeBlueprint.hero_section?.headline}</div>
                        <div className="text-slate-300">{storeBlueprint.hero_section?.subheadline}</div>
                      </div>
                    </div>
                  )}

                  {copyResult?.product_descriptions?.[0] && (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        ✍️ Product Copy
                        <span className="text-forest-400 text-sm">• Generated</span>
                      </h3>
                      <div className="text-forest-400 font-bold text-xl mb-2">
                        {copyResult.product_descriptions[0].headline}
                      </div>
                      <p className="text-slate-300">{copyResult.product_descriptions[0].long_description}</p>
                    </div>
                  )}

                  {adResult?.facebook_ads?.[0] && (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        📢 Facebook Ad
                        <span className="text-forest-400 text-sm">• Generated</span>
                      </h3>
                      <div className="text-lg font-bold mb-2">{adResult.facebook_ads[0].primary_text}</div>
                      <div className="text-forest-400 mb-2">{adResult.facebook_ads[0].headline}</div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-slate-600 px-2 py-1 rounded text-xs">CTA: {adResult.facebook_ads[0].cta}</span>
                        <span className="bg-slate-600 px-2 py-1 rounded text-xs">Budget: {adResult.facebook_ads[0].budget_suggestion}</span>
                      </div>
                    </div>
                  )}

                  {supplierResult?.suppliers?.[0] && (
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        🏭 Supplier Found
                        <span className="text-forest-400 text-sm">• {supplierResult.suppliers[0].platform}</span>
                      </h3>
                      <p className="text-slate-300 mb-2"><strong>Look for:</strong> {supplierResult.suppliers[0].what_to_look_for}</p>
                      <p className="text-forest-400 font-bold">{supplierResult.suppliers[0].estimated_cost}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Connections */}
            <div className="space-y-6">
              <OAuthConnect 
                orgId={orgId} 
                onConnect={(platform, data) => {
                  console.log('Connected:', platform, data);
                }}
              />

              {/* Quick Stats */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-bold mb-4">📊 Session Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Products Found</span>
                    <span className="font-bold text-forest-400">{products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Products Selected</span>
                    <span className="font-bold">{selectedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Agents Run</span>
                    <span className="font-bold">{[storeBlueprint, copyResult, adResult, supplierResult, analyticsResult].filter(Boolean).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agent Progress Overlay */}
      {activeAgent && (
        <AgentProgress
          agentName={activeAgent}
          agentIcon={
            activeAgent === 'TrendHunter' ? '🔍' :
            activeAgent === 'StoreBuilder' ? '🏗️' :
            activeAgent === 'CopyWriter' ? '✍️' :
            activeAgent === 'AdCommander' ? '📢' :
            activeAgent === 'SupplierScout' ? '🏭' : '📊'
          }
          steps={agentSteps}
          totalSteps={agentSteps.length}
          currentStep={agentSteps.filter(s => s.status === 'completed').length}
          startTime={startTime}
          isActive={true}
        />
      )}
    </div>
  );
}