import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react'
import { apiClient } from '../lib/api'

const STEPS = ['account', 'plan', 'payment', 'connect', 'done']

export default function Onboarding() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [plan, setPlan] = useState(searchParams.get('plan') || 'growth')
  const [orgId, setOrgId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const handleCreateAccount = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await apiClient.createOrg(name || email.split('@')[0], email)
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setOrgId(result.data.organization.id)
        setStep(1)
      }
    } catch (e) {
      setError('Something went wrong. Please try again.')
    }
    
    setLoading(false)
  }

  const handleSelectPlan = () => {
    setStep(2)
  }

  const handlePayment = async () => {
    if (!orgId) return
    
    setLoading(true)
    setError('')
    
    try {
      const result = await apiClient.checkout(orgId, plan)
      if (result.error) {
        setError(result.error)
      } else if (result.data?.checkout_url) {
        // Redirect to Dodo checkout
        window.location.href = result.data.checkout_url
      }
    } catch (e) {
      setError('Payment setup failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-16">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-ink-100">
        <div 
          className="h-full bg-forest-500 transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-md mx-auto px-6 py-12">
        {/* Step 0: Account */}
        {step === 0 && (
          <div className="card">
            <h2 className="font-display text-2xl mb-6">Create your account</h2>
            
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
                <label className="block text-sm text-ink-600 mb-1">Your name (optional)</label>
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
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              
              <p className="text-center text-ink-500 text-sm">
                Already have an account? <Link to="/onboarding?login" className="text-forest-600">Sign in</Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Plan */}
        {step === 1 && (
          <div className="card">
            <h2 className="font-display text-2xl mb-6">Choose your plan</h2>
            
            <div className="space-y-4">
              {[
                { id: 'starter', name: 'Starter', price: 29, calls: 30 },
                { id: 'growth', name: 'Growth', price: 79, calls: 100 },
                { id: 'scale', name: 'Scale', price: 149, calls: 500 },
              ].map(p => (
                <label 
                  key={p.id}
                  className={`block p-4 border rounded-soft cursor-pointer transition-colors ${
                    plan === p.id ? 'border-forest-500 bg-forest-50' : 'border-ink-200 hover:border-forest-300'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="plan" 
                    value={p.id}
                    checked={plan === p.id}
                    onChange={() => setPlan(p.id)}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-ink-500">{p.calls} AI calls/month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl">${p.price}</p>
                      <p className="text-xs text-ink-400">/month</p>
                    </div>
                  </div>
                </label>
              ))}
              
              <button 
                onClick={handleSelectPlan}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setStep(0)}
                className="w-full text-ink-500 text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="card">
            <h2 className="font-display text-2xl mb-6">Start your free trial</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-forest-50 rounded-soft">
                <p className="text-ink-700">
                  You're starting a <strong>14-day free trial</strong> on the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan.
                </p>
                <p className="text-sm text-ink-500 mt-2">
                  We'll collect payment details to activate after your trial. No charge today.
                </p>
              </div>
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue to payment'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                className="w-full text-ink-500 text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
              
              <p className="text-center text-xs text-ink-400">
                Secure payment via Dodo Payments. Cancel anytime.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Connect (after payment redirect) */}
        {step === 3 && (
          <div className="card">
            <h2 className="font-display text-2xl mb-6">Connect your store</h2>
            
            <div className="space-y-4">
              <button className="btn-primary w-full">
                Connect with Shopify
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
                onClick={() => setStep(4)}
                className="w-full text-ink-500 text-sm"
              >
                Skip for now →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="card text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-forest-600" />
            </div>
            <h2 className="font-display text-2xl mb-4">You're all set!</h2>
            <p className="text-ink-600 mb-6">
              Your AI team is ready. Start by finding products or let StoreBuilder create your first store.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Go to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
