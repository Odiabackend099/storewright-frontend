import { useState } from 'react';
import { X, ExternalLink, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ConnectModalProps {
  type: 'shopify' | 'meta';
  isOpen: boolean;
  onClose: () => void;
  onConnect: (token: string, storeUrl?: string) => void;
}

const SHOPIFY_SCOPES = [
  'read_orders',
  'write_orders', 
  'read_products',
  'write_products',
  'read_fulfillments',
];

export default function ConnectModal({ type, isOpen, onClose, onConnect }: ConnectModalProps) {
  const [shopUrl, setShopUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [adAccountId, setAdAccountId] = useState('');
  const [showSteps, setShowSteps] = useState(true);

  if (!isOpen) return null;

  const handleConnect = () => {
    if (type === 'shopify' && shopUrl && accessToken) {
      const cleanUrl = shopUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      onConnect(accessToken, cleanUrl);
    } else if (type === 'meta' && accessToken) {
      onConnect(accessToken, adAccountId);
    }
  };

  const isValid = type === 'shopify'
    ? shopUrl.length > 3 && accessToken.length > 5
    : accessToken.length > 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === 'shopify' ? (
              <div className="w-10 h-10 rounded-lg bg-[#95BF47] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.34 11.2c.87-.5 1.94-.83 3.08-.83 2.76 0 4.37 1.62 4.37 4.27 0 2.58-1.8 3.73-3.61 3.73H6.22v-1.67h8.34c.95 0 1.66-.47 1.66-1.57 0-.91-.5-1.57-1.66-1.57-1.1 0-2.09.42-2.85 1.02L8.55 8.5c1.05-.96 2.65-1.5 4.4-1.5 2.86 0 5.16 1.24 5.16 4.2 0 1.94-1.12 3.04-3 3.04-1.38 0-2.43-.58-3.08-1.3l-1.58 1.52c.91 1.17 2.3 1.8 4.19 1.8 3.15 0 5.88-1.74 5.88-5.26 0-2.48-2.86-3.73-3.18-3.73z"/>
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#1877F2] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-900">
                {type === 'shopify' ? 'Connect Shopify Store' : 'Connect Meta Ad Account'}
              </h2>
              <p className="text-xs text-gray-500">Paste your access token below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Toggle Steps */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-700">
              {type === 'shopify' ? '📋 How to get your Shopify access token' : '📋 How to get your Meta access token'}
            </span>
            {showSteps ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {showSteps && (
            <div className="space-y-3">
              {type === 'shopify' ? (
                <>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 1: Open Shopify Admin</h3>
                    <p className="text-sm text-gray-500 mb-2">Go to your Shopify Admin and click <strong>Apps</strong> → <strong>Develop apps</strong></p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">yourstore.myshopify.com/admin</code>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 2: Create a Custom App</h3>
                    <p className="text-sm text-gray-500 mb-2">Click <strong>"Allow app development"</strong> if prompted, then <strong>"Create an app"</strong>. Name it "Storewright".</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                      ⚠️ As of January 2026, legacy custom apps are deprecated. Use the new admin app creation flow.
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 3: Configure API Scopes</h3>
                    <p className="text-sm text-gray-500 mb-2">Go to <strong>Configuration</strong> → <strong>Admin API integration</strong> → <strong>"Configure"</strong></p>
                    <p className="text-xs text-gray-500 mb-2">Enable these scopes:</p>
                    <div className="flex flex-wrap gap-2">
                      {SHOPIFY_SCOPES.map(scope => (
                        <span key={scope} className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">{scope}</span>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 4: Install App & Get Token</h3>
                    <p className="text-sm text-gray-500 mb-2">Go to <strong>API credentials</strong> tab → Click <strong>"Install app"</strong>. Your access token will be displayed — copy it immediately.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 1: Go to Meta Business Settings</h3>
                    <p className="text-sm text-gray-500 mb-2">Go to <strong>Business Settings</strong> → <strong>System Users</strong></p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">business.facebook.com/settings/system-users</code>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 2: Create a System User</h3>
                    <p className="text-sm text-gray-500 mb-2">Click <strong>"Add"</strong> → <strong>"System User"</strong>. Name it "Storewright". Assign the <strong>Admin</strong> role.</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 3: Generate Token</h3>
                    <p className="text-sm text-gray-500 mb-2">Click <strong>"Generate token"</strong> → Select your app → Grant <strong>ads_management</strong>, <strong>ads_read</strong>, <strong>business_management</strong> permissions → Copy the token.</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                      ⚠️ Store the token securely. System user tokens don't expire but can be revoked.
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Step 4: Note Your Ad Account ID</h3>
                    <p className="text-sm text-gray-500 mb-2">Find your Ad Account ID in <strong>Business Settings</strong> → <strong>Ad Accounts</strong>. Format: <code className="bg-gray-100 px-1 rounded">act_123456789</code></p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Docs Link */}
          <div className="text-center">
            <a
              href={type === 'shopify' 
                ? 'https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin'
                : 'https://developers.facebook.com/docs/marketing-api/system-users/guides/api-calls'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Official documentation <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {type === 'shopify' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Shopify Store URL
                </label>
                <input
                  type="text"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  placeholder="mystore.myshopify.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {type === 'meta' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ad Account ID
                </label>
                <input
                  type="text"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                  placeholder="act_123456789"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {type === 'shopify' ? 'Admin API Access Token' : 'System User Access Token'}
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder={type === 'shopify' ? 'shpat_xxxxxxxxxxxxx' : 'EAACEdEose0cBA...'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                {type === 'shopify' 
                  ? 'Found in Shopify Admin → Apps → Develop apps → API credentials'
                  : 'Generated in Meta Business Settings → System Users → Generate token'}
              </p>
            </div>

            <button
              onClick={handleConnect}
              disabled={!isValid}
              className={`w-full py-3.5 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                type === 'shopify'
                  ? 'bg-[#95BF47] hover:bg-[#7DA63D] text-white'
                  : 'bg-[#1877F2] hover:bg-[#166FE5] text-white'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
