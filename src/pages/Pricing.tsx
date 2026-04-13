import { Link } from 'react-router-dom'
import { Check, X, HelpCircle } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: 29,
    calls: 30,
    stores: 1,
    support: 'Email',
    features: [
      { name: 'All 5 AI agents', included: true },
      { name: 'Phone number', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom branding', included: false },
    ],
    cta: 'Start free trial',
    popular: false
  },
  {
    name: 'Growth',
    price: 79,
    calls: 100,
    stores: 3,
    support: 'Priority',
    features: [
      { name: 'All 5 AI agents', included: true },
      { name: 'Phone number included', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: true },
    ],
    cta: 'Start free trial',
    popular: true
  },
  {
    name: 'Scale',
    price: 149,
    calls: 500,
    stores: 10,
    support: 'Dedicated',
    features: [
      { name: 'All 5 AI agents', included: true },
      { name: 'Multiple phone numbers', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'White-label option', included: true },
    ],
    cta: 'Contact sales',
    popular: false
  }
]

const FAQS = [
  {
    q: 'What counts as an AI call?',
    a: 'Any call handled by CallHandler counts toward your limit. Calls you answer yourself don\'t count.'
  },
  {
    q: 'Can I upgrade mid-month?',
    a: 'Yes. You\'ll be prorated for the remaining days. No penalty.'
  },
  {
    q: 'What if I go over my call limit?',
    a: 'We\'ll notify you at 80%. Overages are $0.25/call. Or upgrade to avoid them entirely.'
  },
  {
    q: 'Do I need a Shopify store already?',
    a: 'No. StoreBuilder can create one for you. You\'ll just need a Shopify account (free for 14 days).'
  },
  {
    q: 'How does the free trial work?',
    a: '14 days. Full access. No credit card required. We\'ll remind you at day 10.'
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. One click in settings. Your data stays for 30 days if you change your mind.'
  }
]

export default function Pricing() {
  return (
    <div className="bg-cream-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-display-lg mb-4">Pricing that makes sense</h1>
          <p className="text-ink-600 max-w-2xl mx-auto">
            No credits. No tiers within tiers. No "contact us for enterprise." 
            Pick your call volume. That's it.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map(plan => (
            <div 
              key={plan.name}
              className={`card relative ${plan.popular ? 'border-2 border-forest-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest-500 text-white text-xs px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              
              <h3 className="font-display text-xl mb-1">{plan.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-display">${plan.price}</span>
                <span className="text-ink-500">/month</span>
              </div>
              
              <div className="text-sm text-ink-500 mb-6">
                {plan.calls} AI calls/month · {plan.stores} store{plan.stores > 1 ? 's' : ''}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f.name} className="flex items-center gap-2 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-forest-500" />
                    ) : (
                      <X className="w-4 h-4 text-ink-300" />
                    )}
                    <span className={f.included ? 'text-ink-700' : 'text-ink-400'}>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to={`/onboarding?plan=${plan.name.toLowerCase()}`}
                className={plan.popular ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Annual discount */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-copper-50 border border-copper-200 rounded-softer">
            <span className="text-copper-700">💰 Pay annually, get 2 months free</span>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-16 overflow-x-auto">
          <h2 className="font-display text-display-sm mb-6">Full feature comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200">
                <th className="text-left py-3 pr-4">Feature</th>
                {PLANS.map(p => (
                  <th key={p.name} className="text-center py-3 px-4">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['AI calls/month', 'Shopify stores', 'StoreBuilder agent', 'CallHandler agent', 'ProductHunter agent', 'CopyWriter agent', 'AnalyticsAgent', 'Phone number', 'Priority support', 'Dedicated manager', 'White-label'].map((feature, i) => (
                <tr key={feature} className="border-b border-ink-100">
                  <td className="py-3 pr-4 text-ink-700">{feature}</td>
                  {PLANS.map(p => (
                    <td key={p.name} className="text-center py-3 px-4">
                      {i === 0 && p.calls}
                      {i === 1 && p.stores}
                      {i >= 2 && i <= 6 && <Check className="w-4 h-4 text-forest-500 mx-auto" />}
                      {i === 7 && (p.name !== 'Starter' ? <Check className="w-4 h-4 text-forest-500 mx-auto" /> : <X className="w-4 h-4 text-ink-300 mx-auto" />)}
                      {i === 8 && (p.name === 'Growth' || p.name === 'Scale' ? <Check className="w-4 h-4 text-forest-500 mx-auto" /> : <X className="w-4 h-4 text-ink-300 mx-auto" />)}
                      {i === 9 && (p.name === 'Scale' ? <Check className="w-4 h-4 text-forest-500 mx-auto" /> : <X className="w-4 h-4 text-ink-300 mx-auto" />)}
                      {i === 10 && (p.name === 'Scale' ? <Check className="w-4 h-4 text-forest-500 mx-auto" /> : <X className="w-4 h-4 text-ink-300 mx-auto" />)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-display-sm mb-6 text-center">Questions? Honest answers.</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="card cursor-pointer">
                <summary className="flex items-center justify-between font-medium">
                  {faq.q}
                  <HelpCircle className="w-4 h-4 text-ink-400" />
                </summary>
                <p className="mt-3 text-ink-600 text-sm">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-ink-500 mb-4">Still not sure?</p>
          <Link to="/demo" className="btn-secondary">
            Try the demo first
          </Link>
        </div>
      </div>
    </div>
  )
}
