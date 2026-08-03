import { lazy, Suspense } from 'react'
import type { ComponentType, ReactNode } from 'react'

// Generic lazy loading wrapper
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFn)

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Workspace lazy loaders - code splitting per workspace
export const LazyMissionControl = createLazyComponent(
  () => import('../../pages/MissionControl').then(m => ({ default: m.MissionControl }))
)

export const LazyAgentWorkspace = createLazyComponent(
  () => import('../../pages/AgentWorkspace').then(m => ({ default: m.AgentWorkspaceRoute }))
)

export const LazyGoals = createLazyComponent(
  () => import('../../pages/Goals').then(m => ({ default: m.Goals }))
)

export const LazyMemory = createLazyComponent(
  () => import('../../pages/Memory').then(m => ({ default: m.Memory }))
)

export const LazyWorkflows = createLazyComponent(
  () => import('../../pages/Workflows').then(m => ({ default: m.Workflows }))
)

export const LazyGraphify = createLazyComponent(
  () => import('../../pages/Graphify').then(m => ({ default: m.Graphify }))
)

export const LazyAlerts = createLazyComponent(
  () => import('../../pages/Alerts').then(m => ({ default: m.Alerts }))
)

export const LazyAnalytics = createLazyComponent(
  () => import('../../pages/Analytics').then(m => ({ default: m.Analytics }))
)

export const LazyLogs = createLazyComponent(
  () => import('../../pages/Logs').then(m => ({ default: m.Logs }))
)

export const LazyIntegrations = createLazyComponent(
  () => import('../../pages/Integrations').then(m => ({ default: m.Integrations }))
)

export const LazyTools = createLazyComponent(
  () => import('../../pages/Tools').then(m => ({ default: m.Tools }))
)

export const LazySettings = createLazyComponent(
  () => import('../../pages/Settings').then(m => ({ default: m.SettingsPage }))
)

export const LazyModels = createLazyComponent(
  () => import('../../pages/Models').then(m => ({ default: m.Models }))
)

export const LazyPlugins = createLazyComponent(
  () => import('../../pages/Plugins').then(m => ({ default: m.Plugins }))
)

export const LazySkills = createLazyComponent(
  () => import('../../pages/Skills').then(m => ({ default: m.Skills }))
)

export const LazyMCP = createLazyComponent(
  () => import('../../pages/MCP').then(m => ({ default: m.MCP }))
)

// Performance monitoring
export function measureComponentRender<P extends object>(
  Component: ComponentType<P>,
  name: string
): ComponentType<P> {
  return (props: any) => {
    const start = performance.now()
    const element = <Component {...props} />
    const end = performance.now()

    if (import.meta.env.DEV) {
      console.debug(`[Perf] ${name} rendered in ${(end - start).toFixed(2)}ms`)
    }

    return element
  }
}

// Memoization utilities
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }) as (...args: Parameters<T>) => void
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as (...args: Parameters<T>) => void
}

// Virtual list item renderer
export interface VirtualListItemRenderer<T> {
  (item: T, index: number, style: React.CSSProperties): React.ReactElement
}

export interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: VirtualListItemRenderer<T>
  overscan?: number
}

// Performance observer
export function observePerformance(name: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (..._args: any[]) {
      const start = performance.now()
      const result = originalMethod.apply(this, arguments)
      const end = performance.now()

      if (result instanceof Promise) {
        return result.then(
          (value: any) => {
            const end = performance.now()
            if (import.meta.env.DEV) {
              console.debug(`[Perf] ${name} took ${(end - start).toFixed(2)}ms`)
            }
            return value
          },
          (error: any) => {
            const end = performance.now()
            if (import.meta.env.DEV) {
              console.error(`[Perf] ${name} failed after ${(end - start).toFixed(2)}ms:`, error)
            }
            throw error
          }
        )
      }

      if (import.meta.env.DEV) {
        console.debug(`[Perf] ${name} took ${(end - start).toFixed(2)}ms`)
      }

      return result
    }

    return descriptor
  }
}

// React.memo comparison utilities
export function shallowEqual<T extends object>(a: T, b: T): boolean {
  if (a === b) return true
  if (!a || !b) return false
  
  const keysA = Object.keys(a) as (keyof T)[]
  const keysB = Object.keys(b) as (keyof T)[]
  
  if (keysA.length !== keysB.length) return false
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (a[key] !== b[key]) return false
  }
  
  return true
}

// createSelector for Zustand (reselect-like)
export function createSelector<TState, TResult>(
  selectors: ((state: TState) => any)[],
  combiner: (...values: any[]) => TResult
) {
  let lastState: TState | null = null
  let lastResult: TResult | null = null
  let lastArgs: any[] = []
  
  return (state: TState): TResult => {
    const args = selectors.map(s => s(state))
    
    if (lastState === state) {
      return lastResult!
    }
    
    const changed = args.some((arg, i) => arg !== lastArgs[i])
    
    if (!changed) {
      return lastResult!
    }
    
    lastState = state
    lastArgs = args
    lastResult = combiner(...args)
    return lastResult
  }
}