import { create } from 'zustand'
import { useNavigate, useLocation } from 'react-router-dom'
import type { NavigateFunction, Location } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { hasPermission, hasRole } from './permission-guards'
import { usePermissionStore } from './permission-guards'

export interface RouteGuardResult {
  allowed: boolean
  redirectTo?: string
  reason?: string
}

export interface RouteMeta {
  requiresAuth?: boolean
  requiredPermissions?: string[]
  requiredRoles?: string[]
  anyPermission?: boolean
  anyRole?: boolean
  public?: boolean
  redirectTo?: string
}

interface RouteGuardState {
  routeMetas: Map<string, RouteMeta>
  registerRouteMeta: (path: string, meta: RouteMeta) => void
  getRouteMeta: (path: string) => RouteMeta | undefined
  checkRouteAccess: (path: string, navigate: NavigateFunction, location: Location) => RouteGuardResult
  getAccessibleRoutes: () => string[]
}

export const useRouteGuards = create<RouteGuardState>((set, get) => ({
  routeMetas: new Map(),

  registerRouteMeta: (path: string, meta: RouteMeta) => {
    set((state) => {
      const newMetas = new Map(state.routeMetas)
      newMetas.set(path, meta)
      return { routeMetas: newMetas }
    })
  },

  getRouteMeta: (path: string) => {
    return get().routeMetas.get(path)
  },

  checkRouteAccess: (path: string, _navigate: NavigateFunction, location: Location) => {
    const { isAuthenticated } = usePermissionStore.getState()
    const meta = get().routeMetas.get(path)

    if (!meta) {
      return { allowed: true }
    }

    // Public route - always allowed
    if (meta.public) {
      return { allowed: true }
    }

    // Check authentication
    if (meta.requiresAuth !== false && !isAuthenticated) {
      const redirectTo = meta.redirectTo || '/login'
      return {
        allowed: false,
        redirectTo: `${redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`,
        reason: 'Authentication required',
      }
    }

    // Check permissions
    if (meta.requiredPermissions && meta.requiredPermissions.length > 0) {
      const { checkAnyPermission } = usePermissionStore.getState()
      if (meta.anyPermission) {
        if (!checkAnyPermission(meta.requiredPermissions)) {
          return {
            allowed: false,
            redirectTo: meta.redirectTo || '/unauthorized',
            reason: 'Insufficient permissions',
          }
        }
      } else {
        // All permissions required
        if (!meta.requiredPermissions.every(hasPermission)) {
          return {
            allowed: false,
            redirectTo: meta.redirectTo || '/unauthorized',
            reason: 'Insufficient permissions',
          }
        }
      }
    }

    // Check roles
    if (meta.requiredRoles && meta.requiredRoles.length > 0) {
      const { checkAnyRole } = usePermissionStore.getState()
      if (meta.anyRole) {
        if (!checkAnyRole(meta.requiredRoles)) {
          return {
            allowed: false,
            redirectTo: meta.redirectTo || '/unauthorized',
            reason: 'Insufficient role',
          }
        }
      } else {
        // All roles required
        if (!meta.requiredRoles.every(hasRole)) {
          return {
            allowed: false,
            redirectTo: meta.redirectTo || '/unauthorized',
            reason: 'Insufficient role',
          }
        }
      }
    }

    return { allowed: true }
  },

  getAccessibleRoutes: () => {
    return Array.from(get().routeMetas.keys()).filter(path => {
      const meta = get().routeMetas.get(path)
      if (!meta) return true
      if (meta.public) return true
      // For now, just return all - actual access check happens at navigation time
      return true
    })
  },
}))

export function useRouteGuardsState() {
  return useRouteGuards()
}

export function registerRouteMeta(path: string, meta: RouteMeta) {
  useRouteGuards.getState().registerRouteMeta(path, meta)
}

export function getRouteMeta(path: string) {
  return useRouteGuards.getState().getRouteMeta(path)
}

export function checkRouteAccess(path: string, navigate: NavigateFunction, location: Location) {
  return useRouteGuards.getState().checkRouteAccess(path, navigate, location)
}

export function getAccessibleRoutes() {
  return useRouteGuards.getState().getAccessibleRoutes()
}

// Pre-defined route guards for common patterns
export const PublicRoute = { public: true }
export const AuthRoute = { requiresAuth: true }
export const AdminRoute = { requiresAuth: true, requiredRoles: ['admin'] }
export const OperatorRoute = { requiresAuth: true, requiredRoles: ['operator', 'admin'] }
export const DeveloperRoute = { requiresAuth: true, requiredRoles: ['developer', 'admin'] }

// HOC for protecting components
export function withRouteGuard(
  WrappedComponent: React.ComponentType<any>,
  _meta: RouteMeta
): React.FC<any> {
  return (props: any) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { allowed, redirectTo } = useRouteGuards.getState().checkRouteAccess(location.pathname, navigate, location)

    if (!allowed && redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    return <WrappedComponent {...props} />
  }
}