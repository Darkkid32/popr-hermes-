import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Policy {
  id: string
  name: string
  description: string
  effect: 'allow' | 'deny'
  resources: string[]
  actions: string[]
  conditions?: Record<string, unknown>
  priority: number
}

export interface AuthorizationDecision {
  allowed: boolean
  reason?: string
  matchedPolicies: Policy[]
}

export interface ResourceAccess {
  resource: string
  actions: string[]
}

export interface AuthorizationState {
  policies: Policy[]
  evaluate: (resource: string, action: string, context?: Record<string, unknown>) => AuthorizationDecision
  addPolicy: (policy: Policy) => void
  removePolicy: (id: string) => void
  getPoliciesForResource: (resource: string) => Policy[]
  canAccess: (resource: string, action: string, context?: Record<string, unknown>) => boolean
}

const defaultPolicies: Policy[] = [
  {
    id: 'admin-all',
    name: 'Admin Full Access',
    description: 'Admins have full access to all resources',
    effect: 'allow',
    resources: ['*'],
    actions: ['*'],
    priority: 100,
  },
  {
    id: 'operator-read',
    name: 'Operator Read Access',
    description: 'Operators can read all resources',
    effect: 'allow',
    resources: ['*'],
    actions: ['read', 'list'],
    priority: 50,
  },
  {
    id: 'developer-write',
    name: 'Developer Write Access',
    description: 'Developers can write to development resources',
    effect: 'allow',
    resources: ['workflows', 'skills', 'plugins', 'models'],
    actions: ['read', 'write', 'create', 'update', 'delete'],
    priority: 40,
  },
  {
    id: 'user-read-own',
    name: 'User Read Own Resources',
    description: 'Users can read their own resources',
    effect: 'allow',
    resources: ['*'],
    actions: ['read'],
    conditions: { owner: '${user.id}' },
    priority: 10,
  },
]

export const AuthorizationContext = createContext<AuthorizationState | null>(null)

export function useAuthorization() {
  const context = useContext(AuthorizationContext)
  if (!context) {
    throw new Error('useAuthorization must be used within AuthorizationProvider')
  }
  return context
}

interface AuthorizationProviderProps {
  children: ReactNode
  customPolicies?: Policy[]
}

export function AuthorizationProvider({ children, customPolicies = [] }: AuthorizationProviderProps) {
  const [policies, setPolicies] = useState<Policy[]>([...defaultPolicies, ...customPolicies])

  const evaluateAccess = (resource: string, action: string, _context?: Record<string, unknown>): AuthorizationDecision => {
    const applicablePolicies = policies.filter((p) =>
      p.resources.includes('*') || p.resources.includes(resource)
    )

    const matchedPolicies: Policy[] = []
    let allowed = false

    // Sort by priority (highest first)
    const sortedPolicies = [...applicablePolicies].sort((a, b) => b.priority - a.priority)

    for (const policy of sortedPolicies) {
      const actionMatches = policy.actions.includes('*') || policy.actions.includes(action)
      if (!actionMatches) continue

      // Check conditions if any
      if (policy.conditions) {
        let conditionsMet = true
        for (const [_key, value] of Object.entries(policy.conditions)) {
          // Simple condition evaluation - in reality this would be more complex
          if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
            // Variable substitution - would need context resolution
            continue
          }
          if (value !== true) {
            conditionsMet = false
            break
          }
        }
        if (!conditionsMet) continue
      }

      matchedPolicies.push(policy)
      if (policy.effect === 'allow') {
        allowed = true
        break // First allow wins (highest priority)
      } else if (policy.effect === 'deny') {
        allowed = false
        break // Explicit deny
      }
    }

    return {
      allowed,
      reason: allowed ? 'Access granted' : 'Access denied',
      matchedPolicies,
    }
  }

  const addPolicy = (policy: Policy) => {
    setPolicies((prev) => [...prev, policy].sort((a, b) => b.priority - a.priority))
  }

  const removePolicy = (id: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id))
  }

  const getPoliciesForResource = (resource: string) => {
    return policies.filter((p) => p.resources.includes('*') || p.resources.includes(resource))
  }

  const canAccess = (resource: string, action: string, context?: Record<string, unknown>) => {
    return evaluateAccess(resource, action, context).allowed
  }

  const value: AuthorizationState = {
    policies,
    evaluate: evaluateAccess,
    addPolicy,
    removePolicy,
    getPoliciesForResource,
    canAccess,
  }

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  )
}

export function useAuthorizationState() {
  return useAuthorization()
}

export function useCanAccess(resource: string, action: string, context?: Record<string, unknown>) {
  const { canAccess } = useAuthorization()
  return canAccess(resource, action, context)
}

export function useEvaluateAccess(resource: string, action: string, context?: Record<string, unknown>) {
  const { evaluate } = useAuthorization()
  return evaluate(resource, action, context)
}

export function usePolicies() {
  const { policies } = useAuthorization()
  return policies
}

export function useAddPolicy() {
  const { addPolicy } = useAuthorization()
  return addPolicy
}

export function useRemovePolicy() {
  const { removePolicy } = useAuthorization()
  return removePolicy
}