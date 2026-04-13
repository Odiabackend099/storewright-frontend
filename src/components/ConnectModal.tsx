import { useState } from 'react'
import { X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (platform: 'shopify' | 'meta', payload: { access_token: string; store_url?: string; ad_account_id?: string }) => Promise<void>
}

const SHOPIFY_SCOPES = ['read_orders', 'write_orders', 'read_products', 'write_products', 'read_fulfillments']

export default function ConnectModal({ isOpen, onClose, onConnect }: ConnectModalProps) {
  const [platform, setPlatform] = useState<'shopify' | 'meta'>('shopify')
  const [showSteps, setShowSteps] = useState(true)
  const [loading, setLoading] = useState(false)
  const [shopUrl, setShopUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [adAccountId, setAdAccountId] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const connect = async () => {
    setLoading(true)
    setError('')
    try {
      if (platform === 'shopify') {
        if (!shopUrl || !accessToken) throw new Error('Fill in both the store URL and access token.')
        await onConnect('shopify', { access_token: accessToken, store_url: shopUrl })
      } else {
        if (!accessToken) throw new Error('Fill in your Meta access token.')
        await onConnect('meta', { access_token: accessToken, ad_account_id: adAccountId })
      }
      onClose()
    } catch (e: any) {
      setError(e.message || 'Could not connect account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Connect your store</h2>
            <p className="text-xs text-gray-500">Step-by-step OAuth-style setup using the current Shopify and Meta docs</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <button onClick={() => setPlatform('shopify')} className={`flex-1 py-2 rounded-lg ${platform === 'shopify' ? 'bg-[#95BF47] text-white' : 'bg-gray-100 text-gray-700'}`}>Shopify</button>
            <button onClick={() => setPlatform('meta')} className={`flex-1 py-2 rounded-lg ${platform === 'meta' ? 'bg-[#1877F2] text-white' : 'bg-gray-100 text-gray-700'}`}>Meta Ads</button>
          </div>

          <button onClick={() => setShowSteps(!showSteps)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-700">How to get the right credentials</span>
            {showSteps ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showSteps && platform === 'shopify' && (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">1. Create an app in your Shopify admin</h3>
                <p className="text-sm text-gray-600">Go to Apps → Develop apps → Create an app. Use the current admin app flow from Shopify docs.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">2. Give the app the right scopes</h3>
                <p className="text-sm text-gray-600 mb-2">Enable only the permissions you need.</p>
                <div className="flex flex-wrap gap-2">
                  {SHOPIFY_SCOPES.map(scope => <span key={scope} className="px-2 py-1 rounded bg-gray-100 text-xs font-mono">{scope}</span>)}
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">3. Install the app and copy the access token</h3>
                <p className="text-sm text-gray-600">After installation, copy the Admin API access token. We’ll store it securely on your server, not in the browser.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">4. Use your store URL</h3>
                <p className="text-sm text-gray-600">Enter the full store domain, like <code className="bg-gray-100 px-1 rounded">your-store.myshopify.com</code>.</p>
              </div>
              <a href="https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin" target="_blank" rel="noreferrer" className="text-blue-600 text-xs inline-flex items-center gap-1">Official Shopify docs <ExternalLink className="w-3 h-3" /></a>
            </div>
          )}

          {showSteps && platform === 'meta' && (
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">1. Open Meta Business Settings</h3>
                <p className="text-sm text-gray-600">Go to Business Settings → System Users.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">2. Create a system user</h3>
                <p className="text-sm text-gray-600">Create a system user, then generate a token with ads_management, ads_read, and business_management permissions.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold mb-2">3. Paste your ad account ID</h3>
                <p className="text-sm text-gray-600">Use the ad account in the format <code className="bg-gray-100 px-1 rounded">act_123456789</code>.</p>
              </div>
              <a href="https://developers.facebook.com/docs/marketing-api/system-users/guides/api-calls" target="_blank" rel="noreferrer" className="text-blue-600 text-xs inline-flex items-center gap-1">Official Meta docs <ExternalLink className="w-3 h-3" /></a>
            </div>
          )}

          {platform === 'shopify' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shopify Store URL</label>
                <input value={shopUrl} onChange={e => setShopUrl(e.target.value)} placeholder="your-store.myshopify.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin API Access Token</label>
                <input value={accessToken} onChange={e => setAccessToken(e.target.value)} type="password" placeholder="shpat_..." className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm" />
              </div>
            </div>
          )}

          {platform === 'meta' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Access Token</label>
                <input value={accessToken} onChange={e => setAccessToken(e.target.value)} type="password" placeholder="EAACEdEose0cBA..." className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Account ID</label>
                <input value={adAccountId} onChange={e => setAdAccountId(e.target.value)} placeholder="act_123456789" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
              </div>
            </div>
          )}

          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Cancel</button>
            <button onClick={connect} disabled={loading} className={`px-4 py-2 rounded-lg text-white ${platform === 'shopify' ? 'bg-[#95BF47]' : 'bg-[#1877F2]'}`}>
              {loading ? 'Connecting…' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
