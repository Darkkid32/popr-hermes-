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