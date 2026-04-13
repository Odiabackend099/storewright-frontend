import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, Zap, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, organizationId, signIn, signUp, refreshOrganization } = useAuth()
  const [step, setStep] = useState<'auth' | 'connecting' | 'credits' | 'done'>('auth')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [credits, setCredits] = useState(15)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    if (user && organizationId) navigate('/dashboard', { replace: true })
    else if (user && !organizationId) {
      setStep('connecting')
      void createOrganizationForUser()
    }
  }, [user, organizationId, navigate])

  const createOrganizationForUser = async () => {
    try {
      const res = await fetch('https://shopifywithai.onrender.com/v1/organizations/from-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          email: user?.email,
          name: name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Founder',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Failed to create organization')
      }
      await refreshOrganization()
      setStep('credits')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setStep('auth')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) setError(error.message || 'Invalid email or password')
      } else {
        const { error } = await signUp(email, password, name || email.split('@')[0])
        if (error) setError(error.message || 'Failed to create account')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleActivateCredits = async () => {
    if (!organizationId) return
    setLoading(true)
    try {
      await fetch('https://shopifywithai.onrender.com/v1/billing/activate-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ organization_id: organizationId, plan: 'growth' }),
      })
      setStep('done')
    } catch {
      setStep('done')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800">
        <div className="h-full bg-gradient-to-r from-forest-500 to-forest-400 transition-all duration-500" style={{ width: step === 'auth' ? '25%' : step === 'connecting' ? '50%' : step === 'credits' ? '75%' : '100%' }} />
      </div>

      <div className="max-w-md mx-auto px-6 pt-24 pb-12">
        {step === 'auth' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-forest-500/25">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome back' : 'Start your free trial'}</h1>
              <p className="text-slate-400">{isLogin ? 'Sign in to access your dashboard' : '15 free AI credits. No credit card required.'}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500" />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Your name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500" />
                </div>
              )}
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
              <button onClick={handleSubmit} disabled={!email || !password || password.length < 8 || loading} className="w-full bg-gradient-to-r from-forest-500 to-forest-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-forest-400 hover:to-forest-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-forest-500/25">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Free Account')}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-center text-slate-400 text-sm">
                {isLogin ? <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-forest-400 hover:text-forest-300">Sign up free</button></> : <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-forest-400 hover:text-forest-300">Sign in</button></>}
              </p>
            </div>
          </div>
        )}

        {step === 'connecting' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-forest-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Setting up your workspace...</h2>
            <p className="text-slate-400">This will only take a moment.</p>
          </div>
        )}

        {step === 'credits' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-forest-500/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">15 Free Credits!</h2>
            <p className="text-slate-400 mb-6">Your account is ready. Use these credits to research products, build stores, and launch ads.</p>
            <button onClick={handleActivateCredits} disabled={loading} className="w-full bg-gradient-to-r from-forest-500 to-forest-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-forest-400 hover:to-forest-500 flex items-center justify-center gap-2 shadow-lg shadow-forest-500/25">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Building'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">You're all set!</h2>
            <p className="text-slate-400 mb-6">15 free AI credits ready. Start by researching products or let StoreBuilder create your first store.</p>
            <button onClick={() => navigate('/dashboard', { replace: true })} className="w-full bg-gradient-to-r from-forest-500 to-forest-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-forest-400 hover:to-forest-500 flex items-center justify-center gap-2 shadow-lg shadow-forest-500/25">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
