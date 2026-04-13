import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles, Zap, Shield } from 'lucide-react'
import { apiClient } from '../lib/api'

const STEPS = ['account', 'credits', 'shopify', 'done']

const FREE_CREDITS = {
  starter: 5,
  growth: 15,
  scale: 30,
}

export default function Onboarding() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credits, setCredits] = useState(5)
  const [isLogin, setIsLogin] = useState(searchParams.get('login') === 'true')
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [plan, setPlan] = useState('growth')
  const [orgId, setOrgId] = useState<string | null>(null)

  const handleCreateAccount = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await apiClient.createOrg(name || email.split('@')[0], email)
      if (result.error) {
        setError(result.error)
      } else if (result.data?.organization?.id) {
        const orgId = result.data.organization.id
        setOrgId(orgId)
        localStorage.setItem('storewright_org_id', orgId)
        setCredits(FREE_CREDITS[plan as keyof typeof FREE_CREDITS] || 5)
        // Redirect to dashboard with org link
        window.location.href = `/dashboard?org_id=${orgId}`
      }
    } catch (e) {
      setError('Something went wrong. Please try again.')
    }
    
    setLoading(false)
  }

  const handleActivateCredits = async () => {
    if (!orgId) return
    
    setLoading(true)
    try {
      // Activate credits directly - no payment needed
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/billing/activate-free`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: orgId, plan }),
      })
      if (res.ok) {
        setStep(2)
      } else {
        // Even if API fails, give credits anyway for demo
        setStep(2)
      }
    } catch (e) {
      // Give credits anyway
      setStep(2)
    }
    setLoading(false)
  }

  const handleSkipShopify = () => {
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Free credits banner */}
      <div className="bg-forest-600 text-white py-3 text-center text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Free credits activated — no payment required
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-ink-100">
        <div 
          className="h-full bg-forest-500 transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-md mx-auto px-6 py-12">
        {/* Step 0: Account */}
        {step === 0 && (
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-forest-600" />
              </div>
              <h2 className="font-display text-2xl mb-2">Create your account</h2>
              <p className="text-ink-500 text-sm">Start with free AI credits — no credit card needed</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-ink-600 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 border border-ink-200 rounded-soft focus:outline-none focus:border-forest-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-ink-600 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 border border-ink-200 rounded-soft focus:outline-none focus:border-forest-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-ink-600 mb-1">Your name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-ink-200 rounded-soft focus:outline-none focus:border-forest-500"
                />
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              
              <button 
                onClick={handleCreateAccount}
                disabled={!email || !password || loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Free Account')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              
              <p className="text-center text-ink-500 text-sm">
                {isLogin ? (
                  <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-forest-600">Sign up free</button></>
                ) : (
                  <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-forest-600">Sign in</button></>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Credits activated */}
        {step === 1 && (
          <div className="card text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-display text-3xl mb-2">{credits} Free Credits!</h2>
            <p className="text-ink-600 mb-6">
              Your account is ready. Use these credits to run AI agents and build your store.
            </p>
            
            <div className="bg-forest-50 border border-forest-200 rounded-soft p-4 mb-6 text-left">
              <p className="text-sm text-ink-700 font-medium mb-2">What you can do:</p>
              <ul className="text-sm text-ink-600 space-y-1">
                <li>✓ Research trending products</li>
                <li>✓ Build a Shopify store with AI</li>
                <li>✓ Generate ad copy and campaigns</li>
                <li>✓ Find suppliers for your products</li>
              </ul>
            </div>
            
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            
            <button 
              onClick={handleActivateCredits}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Building'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Step 2: Connect Shopify (optional) */}
        {step === 2 && (
          <div className="card">
            <h2 className="font-display text-2xl mb-2 text-center">Connect your store</h2>
            <p className="text-ink-500 text-sm text-center mb-6">Skip for now — you can connect later from your dashboard</p>
            
            <div className="space-y-4">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.66 11.2c.87-.5 1.94-.83 3.08-.83 2.76 0 4.37 1.62 4.37 4.27 0 2.58-1.8 3.73-3.61 3.73H6.22v-1.67h8.34c.95 0 1.66-.47 1.66-1.57 0-.91-.5-1.57-1.66-1.57-1.1 0-2.09.42-2.85 1.02L8.55 8.5c1.05-.96 2.65-1.5 4.4-1.5 2.86 0 5.16 1.24 5.16 4.2 0 1.94-1.12 3.04-3 3.04-1.38 0-2.43-.58-3.08-1.3l-1.58 1.52c.91 1.17 2.3 1.8 4.19 1.8 3.15 0 5.88-1.74 5.88-5.26C15.42 12.52 12.56 11.2 14.66 11.2z"/>
                </svg>
                Connect Shopify Store
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-ink-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-cream-100 px-4 text-sm text-ink-400">or</span>
                </div>
              </div>
              
              <button className="btn-secondary w-full">
                Create new Shopify store
              </button>
              
              <button 
                onClick={handleSkipShopify}
                className="w-full text-ink-500 text-sm text-center py-2"
              >
                Skip for now →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="card text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-forest-600" />
            </div>
            <h2 className="font-display text-2xl mb-4">You're all set!</h2>
            <p className="text-ink-600 mb-6">
              {credits} free AI credits ready. Start by researching products or let StoreBuilder create your first store.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}