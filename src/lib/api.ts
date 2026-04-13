const API_BASE = import.meta.env.VITE_API_URL || 'https://shopifywithai.onrender.com'

interface ApiResponse<T> {
  data?: T
  error?: string
}

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    return { error: error.detail || error.message || 'Request failed' }
  }

  const data = await response.json()
  return { data }
}

// Specific API functions
export const apiClient = {
  // Health check
  health: () => api<{ status: string }>('/health'),
  
  // Stats
  stats: () => api<{ stores_built: number; calls_handled: number }>('/v1/stats'),
  
  // Pricing
  plans: () => api<{ plans: Array<{
    id: string
    name: string
    price: number
    calls: number
    features: string[]
  }> }>('/v1/billing/plans'),
  
  // Create checkout
  checkout: (orgId: string, plan: string) => 
    api<{ checkout_url: string; session_id: string }>(
      `/v1/billing/checkout/${plan}`,
      { method: 'POST', body: JSON.stringify({ organization_id: orgId }) }
    ),
  
  // Create organization
  createOrg: (name: string, email: string) =>
    api<{ organization: { id: string }; user: { id: string } }>(
      '/v1/organizations',
      { method: 'POST', body: JSON.stringify({ name, email }) }
    ),
  
  // Research products
  researchProducts: (orgId: string, niche?: string) =>
    api<{ products: Array<{ name: string; trend_score: number }> }>(
      '/v1/research/trending',
      { method: 'POST', body: JSON.stringify({ organization_id: orgId, niche }) }
    ),
}

export default apiClient
