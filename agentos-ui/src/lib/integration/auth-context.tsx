import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePermissionStore } from './permission-guards'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  roles: string[]
  permissions: string[]
  lastLogin: number
  metadata?: Record<string, unknown>
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<AuthUser | null>
  updateUser: (updates: Partial<AuthUser>) => void
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => { throw new Error('Not implemented') },
  logout: async () => {},
  refreshUser: async () => null,
  updateUser: () => {},
  setUser: () => {},
  setLoading: () => {},
  setError: () => {},
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
  autoRefresh?: boolean
  refreshInterval?: number
}

export function AuthProvider({ children, autoRefresh = false, refreshInterval = 300000 }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(defaultAuthState)

  // Update state with actual implementations
  useEffect(() => {
    const newState: AuthState = {
      ...state,
      login: async (credentials: { email: string; password: string }) => {
        setState((p: AuthState) => ({ ...p, isLoading: true, error: null }))
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const user: AuthUser = {
            id: 'user-1',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            roles: ['user'],
            permissions: ['read', 'write'],
            lastLogin: Date.now(),
          }
          setState((p: AuthState) => ({
            ...p,
            user,
            isAuthenticated: true,
            isLoading: false,
          }))
          return user
        } catch (error) {
          setState((p: AuthState) => ({
            ...p,
            isLoading: false,
            error: error as Error,
          }))
          throw error
        }
      },
      logout: async () => {
        setState((p: AuthState) => ({ ...p, isLoading: true }))
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          setState((p: AuthState) => ({
            ...p,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }))
        } catch (error) {
          setState((p: AuthState) => ({
            ...p,
            isLoading: false,
            error: error as Error,
          }))
        }
      },
      refreshUser: async () => {
        if (!state.isAuthenticated) return null
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          const user = { ...state.user!, lastLogin: Date.now() } as AuthUser
          setState((p: AuthState) => ({ ...p, user }))
          return user
        } catch {
          return null
        }
      },
      updateUser: (updates: Partial<AuthUser>) => {
        setState((p: AuthState) => ({
          ...p,
          user: p.user ? { ...p.user, ...updates } : null,
        }))
      },
      setUser: (user: AuthUser | null) => setState((p: AuthState) => ({ ...p, user, isAuthenticated: !!user })),
      setLoading: (loading: boolean) => setState((p: AuthState) => ({ ...p, isLoading: loading })),
      setError: (error: Error | null) => setState((p: AuthState) => ({ ...p, error })),
    }
    setState(newState)
  }, [])

  // Sync with permission store
  useEffect(() => {
    if (state.user) {
      usePermissionStore.getState().setAuthentication(true, state.user.id)
      usePermissionStore.getState().setPermissions(state.user.permissions)
      usePermissionStore.getState().setRoles(state.user.roles)
    } else {
      usePermissionStore.getState().clearAuth()
    }
  }, [state.user, state.isAuthenticated])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !state.isAuthenticated) return
    const interval = setInterval(() => {
      state.refreshUser()
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, state.isAuthenticated, state.refreshUser])

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  )
}

export function useRequireAuth() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    throw new Error('Authentication required')
  }
  return { user, isAuthenticated: true }
}

export function useRequirePermission(permission: string) {
  const { checkPermission } = usePermissionStore()
  if (!checkPermission(permission)) {
    throw new Error(`Permission required: ${permission}`)
  }
  return true
}

export function useRequireRole(role: string) {
  const { checkRole } = usePermissionStore()
  if (!checkRole(role)) {
    throw new Error(`Role required: ${role}`)
  }
  return true
}