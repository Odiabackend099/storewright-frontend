import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signIn, signUp, signOut, getCurrentUser, getSession, onAuthStateChange } from '../lib/supabase'

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

  // Fetch user's organization
  const fetchOrganization = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', userId)
        .single()
      
      if (data?.organization_id) {
        setOrganizationId(data.organization_id)
        localStorage.setItem('storewright_org_id', data.organization_id)
      }
    } catch (err) {
      // User might not exist in users table yet
      console.log('No organization found for user')
    }
  }

  const refreshOrganization = async () => {
    if (user) {
      await fetchOrganization(user.id)
    }
  }

  useEffect(() => {
    // Check active session
    getSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchOrganization(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchOrganization(session.user.id)
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

  const value = {
    user,
    session,
    loading,
    organizationId,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refreshOrganization,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
