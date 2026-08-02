import { create } from 'zustand'

export type Permission = string
export type Role = string

export interface PermissionGuardConfig {
  requiredPermissions?: Permission[]
  requiredRoles?: Role[]
  anyPermission?: boolean
  anyRole?: boolean
  redirectTo?: string
}

export interface RouteGuardConfig {
  permissions?: Permission[]
  roles?: Role[]
  authRequired?: boolean
  publicRoutes?: string[]
  redirectTo?: string
}

interface PermissionState {
  userPermissions: Permission[]
  userRoles: Role[]
  isAuthenticated: boolean
  userId: string | null
  checkPermission: (permission: Permission) => boolean
  checkRole: (role: Role) => boolean
  checkAnyPermission: (permissions: Permission[]) => boolean
  checkAnyRole: (roles: Role[]) => boolean
  setPermissions: (permissions: Permission[]) => void
  setRoles: (roles: Role[]) => void
  setAuthentication: (isAuth: boolean, userId?: string) => void
  clearAuth: () => void
}

const DEFAULT_ROLES = ['user'] as Role[]
const DEFAULT_PERMISSIONS = ['read'] as Permission[]

export const usePermissionStore = create<PermissionState>((set, get) => ({
  userPermissions: DEFAULT_PERMISSIONS,
  userRoles: DEFAULT_ROLES,
  isAuthenticated: false,
  userId: null,

  checkPermission: (permission: Permission) => {
    return get().userPermissions.includes(permission)
  },

  checkRole: (role: Role) => {
    return get().userRoles.includes(role)
  },

  checkAnyPermission: (permissions: Permission[]) => {
    const userPerms = get().userPermissions
    return permissions.some(p => userPerms.includes(p))
  },

  checkAnyRole: (roles: Role[]) => {
    const userRoles = get().userRoles
    return roles.some(r => userRoles.includes(r))
  },

  setPermissions: (permissions: Permission[]) => {
    set({ userPermissions: permissions })
  },

  setRoles: (roles: Role[]) => {
    set({ userRoles: roles })
  },

  setAuthentication: (isAuth: boolean, userId?: string) => {
    set({ isAuthenticated: isAuth, userId: userId || null })
  },

  clearAuth: () => {
    set({ isAuthenticated: false, userId: null, userPermissions: DEFAULT_PERMISSIONS, userRoles: DEFAULT_ROLES })
  },
}))

export function usePermissions() {
  return usePermissionStore()
}

export function useHasPermission(permission: Permission): boolean {
  return usePermissionStore((state) => state.checkPermission(permission))
}

export function useHasRole(role: Role): boolean {
  return usePermissionStore((state) => state.checkRole(role))
}

export function hasPermission(permission: Permission): boolean {
  return usePermissionStore.getState().checkPermission(permission)
}

export function hasRole(role: Role): boolean {
  return usePermissionStore.getState().checkRole(role)
}

export function canAccess(requiredPermissions?: Permission[], requiredRoles?: Role[]): boolean {
  const { checkAnyPermission, checkAnyRole } = usePermissionStore.getState()

  if (!requiredPermissions && !requiredRoles) return true

  if (requiredPermissions && requiredPermissions.length > 0) {
    if (!checkAnyPermission(requiredPermissions)) return false
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!checkAnyRole(requiredRoles)) return false
  }

  return true
}

export function createPermissionGuard(config: PermissionGuardConfig) {
  return (_to: any, _from: any, next: any) => {
    const { checkPermission, checkRole, checkAnyPermission, checkAnyRole } = usePermissionStore.getState()

    if (config.requiredPermissions && config.requiredPermissions.length > 0) {
      const hasPerm = config.anyPermission
        ? checkAnyPermission(config.requiredPermissions)
        : config.requiredPermissions.every(checkPermission)
      if (!hasPerm) {
        next(config.redirectTo || '/unauthorized')
        return
      }
    }

    if (config.requiredRoles && config.requiredRoles.length > 0) {
      const hasRole = config.anyRole
        ? checkAnyRole(config.requiredRoles)
        : config.requiredRoles.every(checkRole)
      if (!hasRole) {
        next(config.redirectTo || '/unauthorized')
        return
      }
    }

    next()
  }
}

export function createRouteGuard(config: RouteGuardConfig) {
  return (to: any, _from: any, next: any) => {
    const { isAuthenticated } = usePermissionStore.getState()

    // Check if route is public
    if (config.publicRoutes && config.publicRoutes.includes(to.path)) {
      next()
      return
    }

    // Check authentication
    if (config.authRequired !== false && !isAuthenticated) {
      next(config.redirectTo || '/login')
      return
    }

    // Check permissions
    if (config.permissions && config.permissions.length > 0) {
      const { checkAnyPermission } = usePermissionStore.getState()
      if (!checkAnyPermission(config.permissions)) {
        next(config.redirectTo || '/unauthorized')
        return
      }
    }

    // Check roles
    if (config.roles && config.roles.length > 0) {
      const { checkAnyRole } = usePermissionStore.getState()
      if (!checkAnyRole(config.roles)) {
        next(config.redirectTo || '/unauthorized')
        return
      }
    }

    next()
  }
}

export function requirePermission(permission: Permission) {
  return (_to: any, _from: any, next: any) => {
    if (hasPermission(permission)) {
      next()
    } else {
      next('/unauthorized')
    }
  }
}

export function requireRole(role: Role) {
  return (_to: any, _from: any, next: any) => {
    if (hasRole(role)) {
      next()
    } else {
      next('/unauthorized')
    }
  }
}

export function requireAnyPermission(permissions: Permission[]) {
  return (_to: any, _from: any, next: any) => {
    if (usePermissionStore.getState().checkAnyPermission(permissions)) {
      next()
    } else {
      next('/unauthorized')
    }
  }
}

export function requireAnyRole(roles: Role[]) {
  return (_to: any, _from: any, next: any) => {
    if (usePermissionStore.getState().checkAnyRole(roles)) {
      next()
    } else {
      next('/unauthorized')
    }
  }
}