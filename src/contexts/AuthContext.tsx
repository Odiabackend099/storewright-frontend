import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signIn, signUp, signOut, getSession, onAuthStateChange } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  organizationId: string | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshOrganization: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [organizationId, setOrganizationId] = useState<string | null>(null)

  const fetchOrganization = async (sessionToken: string) => {
    try {
      const res = await fetch('https://shopifywithai.onrender.com/v1/organizations/me', {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Accept: 'application/json',
        },
      })
      if (!res.ok) return
      const data = await res.json()
      const orgId = data?.organization?.id
      if (orgId) {
        setOrganizationId(orgId)
        localStorage.setItem('storewright_org_id', orgId)
      }
    } catch {
      // ignore
    }
  }

  const refreshOrganization = async () => {
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (session?.access_token) {
      await fetchOrganization(session.access_token)
    }
  }

  useEffect(() => {
    getSession().then(async (session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.access_token) {
        await fetchOrganization(session.access_token)
      }
      setLoading(false)
    })

    const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.access_token) {
        await fetchOrganization(session.access_token)
      } else {
        setOrganizationId(null)
        localStorage.removeItem('storewright_org_id')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    return { error }
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const { error } = await signUp(email, password, fullName)
    return { error }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setSession(null)
    setOrganizationId(null)
    localStorage.removeItem('storewright_org_id')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        organizationId,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
