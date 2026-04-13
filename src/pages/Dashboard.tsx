import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Store, Phone, Search, PenTool, BarChart3, 
  Play, Pause, Settings, LogOut, Bell,
  TrendingUp, Users, DollarSign, Clock
} from 'lucide-react'

export default function Dashboard() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null)

  // Mock data - would come from API
  const stats = {
    callsAnswered: 23,
    callsMissed: 0,
    storesBuilt: 1,
    productsFound: 5,
    conversionRate: 4.2,
    revenue: '$1,247'
  }

  const agents = [
    { id: 'store', name: 'StoreBuilder', status: 'ready', icon: Store },
    { id: 'call', name: 'CallHandler', status: 'active', icon: Phone },
    { id: 'product', name: 'ProductHunter', status: 'ready', icon: Search },
    { id: 'copy', name: 'CopyWriter', status: 'ready', icon: PenTool },
    { id: 'analytics', name: 'AnalyticsAgent', status: 'ready', icon: BarChart3 },
  ]

  const recentActivity = [
    { time: '2m ago', agent: 'CallHandler', action: 'Answered call from +1 (555) 123-4567' },
    { time: '15m ago', agent: 'ProductHunter', action: 'Found 5 trending products in fitness niche' },
    { time: '1h ago', agent: 'CopyWriter', action: 'Updated 3 product descriptions' },
    { time: '3h ago', agent: 'StoreBuilder', action: 'Created homepage hero section' },
  ]

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top nav */}
      <nav className="bg-white border-b border-ink-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-xl text-forest-800">Storewright</Link>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span className="text-ink-600">Store:</span>
              <span className="font-mono text-forest-700">fitgear.myshopify.com</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-ink-400 hover:text-ink-600">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-ink-400 hover:text-ink-600">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-ink-400 hover:text-ink-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper-100 rounded-soft flex items-center justify-center">
                <Phone className="w-5 h-5 text-copper-600" />
              </div>
              <div>
                <p className="text-ink-500 text-sm">Calls answered</p>
                <p className="font-display text-2xl">{stats.callsAnswered}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest-100 rounded-soft flex items-center justify-center">
                <Store className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="text-ink-500 text-sm">Stores built</p>
                <p className="font-display text-2xl">{stats.storesBuilt}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-forest-100 rounded-soft flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="text-ink-500 text-sm">Conversion rate</p>
                <p className="font-display text-2xl">{stats.conversionRate}%</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-copper-100 rounded-soft flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-copper-600" />
              </div>
              <div>
                <p className="text-ink-500 text-sm">Revenue (this month)</p>
                <p className="font-display text-2xl">{stats.revenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Agents panel */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl mb-4">Your AI team</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {agents.map(agent => (
                <div 
                  key={agent.id}
                  className={`card cursor-pointer transition-all ${
                    activeAgent === agent.id ? 'ring-2 ring-forest-500' : 'hover:shadow-soft-lg'
                  }`}
                  onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-soft flex items-center justify-center ${
                        agent.status === 'active' ? 'bg-copper-100' : 'bg-forest-50'
                      }`}>
                        <agent.icon className={`w-5 h-5 ${
                          agent.status === 'active' ? 'text-copper-600' : 'text-forest-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className={`text-xs ${
                          agent.status === 'active' ? 'text-copper-500' : 'text-ink-400'
                        }`}>
                          {agent.status === 'active' ? '● Active' : 'Ready'}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-ink-400 hover:text-forest-600">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {activeAgent === agent.id && (
                    <div className="pt-3 border-t border-ink-100">
                      <p className="text-sm text-ink-600 mb-3">
                        Click "Run" to execute this agent on your store.
                      </p>
                      <button className="btn-primary text-sm py-2">
                        Run {agent.name}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <h2 className="font-display text-xl mb-4">Recent activity</h2>
            <div className="card">
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-forest-400 rounded-full" />
                    <div>
                      <p className="text-sm text-ink-700">{item.action}</p>
                      <p className="text-xs text-ink-400">
                        {item.time} · {item.agent}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick actions */}
            <h2 className="font-display text-xl mt-8 mb-4">Quick actions</h2>
            <div className="space-y-2">
              <button className="btn-secondary w-full text-left flex items-center gap-2">
                <Search className="w-4 h-4" /> Find new products
              </button>
              <button className="btn-secondary w-full text-left flex items-center gap-2">
                <PenTool className="w-4 h-4" /> Write product copy
              </button>
              <button className="btn-secondary w-full text-left flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> View analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
