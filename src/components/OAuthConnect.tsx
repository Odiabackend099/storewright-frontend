import { useState } from 'react';

interface OAuthConnectProps {
  orgId: string;
  onConnect: (platform: 'shopify' | 'meta', data: any) => void;
}

export default function OAuthConnect({ orgId, onConnect }: OAuthConnectProps) {
  const [shopifyStore, setShopifyStore] = useState('');
  const [connecting, setConnecting] = useState<string | null>(null);

  const connectShopify = () => {
    if (!shopifyStore) return;
    
    setConnecting('shopify');
    
    // Real Shopify OAuth flow
    const clientId = import.meta.env.VITE_SHOPIFY_CLIENT_ID || 'YOUR_SHOPIFY_CLIENT_ID';
    const redirectUri = `${window.location.origin}/auth/shopify/callback`;
    const scope = 'read_products,write_products,read_orders,write_orders,read_fulfillments,write_fulfillments';
    const state = `org_${orgId}_${Date.now()}`;
    
    // Store state for verification
    localStorage.setItem('shopify_oauth_state', state);
    
    const authUrl = `https://${shopifyStore}.myshopify.com/admin/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
    
    // Redirect to Shopify
    window.location.href = authUrl;
  };

  const connectMeta = () => {
    setConnecting('meta');
    
    // Real Meta OAuth flow
    const appId = import.meta.env.VITE_META_APP_ID || 'YOUR_META_APP_ID';
    const redirectUri = `${window.location.origin}/auth/meta/callback`;
    const scope = 'ads_management,ads_read,pages_read_engagement,business_management';
    const state = `org_${orgId}_${Date.now()}`;
    
    // Store state for verification
    localStorage.setItem('meta_oauth_state', state);
    
    const authUrl = `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
    
    // Redirect to Meta
    window.location.href = authUrl;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🔗</span>
        Connect Your Accounts
      </h3>
      
      <p className="text-slate-400 text-sm mb-6">
        Connect your Shopify store and Meta ad account to enable full automation. 
        Your data stays secure with OAuth authentication.
      </p>

      <div className="space-y-4">
        {/* Shopify Connect */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.66 11.2c.87-.5 1.94-.83 3.08-.83 2.76 0 4.37 1.62 4.37 4.27 0 2.58-1.8 3.73-3.61 3.73H6.22v-1.67h8.34c.95 0 1.66-.47 1.66-1.57 0-.91-.5-1.57-1.66-1.57-1.1 0-2.09.42-2.85 1.02L8.55 8.5c1.05-.96 2.65-1.5 4.4-1.5 2.86 0 5.16 1.24 5.16 4.2 0 1.94-1.12 3.04-3 3.04-1.38 0-2.43-.58-3.08-1.3l-1.58 1.52c.91 1.17 2.3 1.8 4.19 1.8 3.15 0 5.88-1.74 5.88-5.26C15.42 12.52 12.56 11.2 14.66 11.2z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Shopify Store</h4>
                <p className="text-xs text-slate-400">Import products, manage orders</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-500 rounded-full" />
              <span className="text-xs text-slate-400">Not connected</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={shopifyStore}
              onChange={(e) => setShopifyStore(e.target.value.replace(/\.myshopify\.com$/i, ''))}
              placeholder="your-store-name"
              className="flex-1 bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
            />
            <span className="flex items-center text-slate-400 text-sm">.myshopify.com</span>
            <button
              onClick={connectShopify}
              disabled={!shopifyStore || connecting === 'shopify'}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {connecting === 'shopify' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>

        {/* Meta Connect */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white">Meta Ad Account</h4>
                <p className="text-xs text-slate-400">Run ads, track performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-500 rounded-full" />
              <span className="text-xs text-slate-400">Not connected</span>
            </div>
          </div>
          
          <button
            onClick={connectMeta}
            disabled={connecting === 'meta'}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {connecting === 'meta' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Connect Facebook Ad Account
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        🔒 Secure OAuth authentication • We never store your passwords
      </p>
    </div>
  );
}