import { create } from 'zustand'
import { PlatformEvents, emitEvent } from './event-bus'

export interface RefreshConfig {
  interval: number
  enabled: boolean
  onlyWhenVisible: boolean
  onlyWhenOnline: boolean
  backoffOnError: boolean
  maxBackoff: number
}

export interface RefreshSubscription {
  id: string
  resource: string
  callback: () => Promise<void>
  config: Partial<RefreshConfig>
  lastRun: number
  nextRun: number
  errorCount: number
  currentInterval: number
  timer: ReturnType<typeof setTimeout> | null
}

export interface BackgroundRefreshState {
  subscriptions: Map<string, RefreshSubscription>
  globalConfig: RefreshConfig
  visibilityTimer: ReturnType<typeof setInterval> | null
  register: (resource: string, callback: () => Promise<void>, config?: Partial<RefreshConfig>) => string
  unregister: (id: string) => void
  updateConfig: (id: string, config: Partial<RefreshConfig>) => void
  triggerNow: (id: string) => void
  triggerAll: () => void
  pause: (id: string) => void
  resume: (id: string) => void
  start: () => void
  stop: () => void
  getSubscription: (id: string) => RefreshSubscription | undefined
  scheduleRun: (id: string) => void
  handleError: (id: string, error: unknown) => void
}

const DEFAULT_CONFIG: RefreshConfig = {
  interval: 60000 as const,
  enabled: true as const,
  onlyWhenVisible: true as const,
  onlyWhenOnline: true as const,
  backoffOnError: true as const,
  maxBackoff: 300000 as const,
}

export const useBackgroundRefresh = create<BackgroundRefreshState>((set, get) => ({
  subscriptions: new Map(),
  globalConfig: DEFAULT_CONFIG,
  visibilityTimer: null,
  
  register: (resource: string, callback: () => Promise<void>, config: Partial<RefreshConfig> = {}) => {
    const id = `refresh-${resource}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    const now = Date.now()
    
    const subscription: RefreshSubscription = {
      id,
      resource,
      callback,
      config: mergedConfig,
      lastRun: 0,
      nextRun: now + mergedConfig.interval,
      errorCount: 0,
      currentInterval: mergedConfig.interval,
      timer: null,
    }
    
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      newSubs.set(id, subscription)
      return { subscriptions: newSubs }
    })
    
    // Schedule first run
    get().scheduleRun(id)
    
    return id
  },
  
  unregister: (id: string) => {
    const { subscriptions } = get()
    const sub = subscriptions.get(id)
    if (sub?.timer) {
      clearTimeout(sub.timer)
    }
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      newSubs.delete(id)
      return { subscriptions: newSubs }
    })
  },
  
  updateConfig: (id: string, config: Partial<RefreshConfig>) => {
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      const sub = newSubs.get(id)
      if (sub) {
        newSubs.set(id, { ...sub, config: { ...sub.config, ...config } })
      }
      return { subscriptions: newSubs }
    })
    get().scheduleRun(id)
  },
  
  triggerNow: async (id: string) => {
    const { subscriptions } = get()
    const sub = subscriptions.get(id)
    if (!sub) return
    
    try {
      await sub.callback()
      set((state) => {
        const newSubs = new Map(state.subscriptions)
        newSubs.set(id, { 
          ...sub, 
          lastRun: Date.now(),
          errorCount: 0,
          currentInterval: sub.config.interval ?? DEFAULT_CONFIG.interval,
        })
        return { subscriptions: newSubs }
      })
    } catch (error) {
      get().handleError(id, error)
    }
  },
  
  triggerAll: async () => {
    const { subscriptions } = get()
    const promises = Array.from(subscriptions.keys()).map((id) => get().triggerNow(id))
    await Promise.allSettled(promises)
  },
  
  pause: (id: string) => {
    const { subscriptions } = get()
    const sub = subscriptions.get(id)
    if (sub?.timer) {
      clearTimeout(sub.timer)
      set((state) => {
        const newSubs = new Map(state.subscriptions)
        newSubs.set(id, { ...sub, timer: null })
        return { subscriptions: newSubs }
      })
    }
  },
  
  resume: (id: string) => {
    get().scheduleRun(id)
  },
  
  start: () => {
    const { visibilityTimer } = get()
    if (visibilityTimer) return
    
    // Check visibility every 10 seconds
    const timer = setInterval(() => {
      const { subscriptions, globalConfig } = get()
      if (!globalConfig.enabled) return
      
      const isVisible = !document.hidden
      const isOnline = navigator.onLine
      
      subscriptions.forEach((sub, id) => {
        const { config } = sub
        if (!config.enabled) return
        if (config.onlyWhenVisible && !isVisible) return
        if (config.onlyWhenOnline && !isOnline) return
        
        const now = Date.now()
        if (now >= sub.nextRun && !sub.timer) {
          get().scheduleRun(id)
        }
      })
    }, 10000)
    
    set({ visibilityTimer: timer })
    
    // Also listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        get().triggerAll()
      }
    })
    
    // Listen for online/offline
    window.addEventListener('online', () => get().triggerAll())
  },
  
  stop: () => {
    const { visibilityTimer, subscriptions } = get()
    if (visibilityTimer) {
      clearInterval(visibilityTimer)
      set({ visibilityTimer: null })
    }
    
    subscriptions.forEach((sub) => {
      if (sub.timer) {
        clearTimeout(sub.timer)
      }
    })
    
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      newSubs.forEach((sub, id) => {
        newSubs.set(id, { ...sub, timer: null })
      })
      return { subscriptions: newSubs }
    })
  },
  
  getSubscription: (id: string) => get().subscriptions.get(id),
  
  scheduleRun: (id: string) => {
    const { subscriptions } = get()
    const sub = subscriptions.get(id)
    if (!sub || !sub.config.enabled) return
    
    const timer = setTimeout(async () => {
      const currentSub = get().subscriptions.get(id)
      if (!currentSub) return
      
      set((state) => {
        const newSubs = new Map(state.subscriptions)
        newSubs.set(id, { ...currentSub, timer: null })
        return { subscriptions: newSubs }
      })
      
      try {
        await currentSub.callback()
        set((state) => {
          const newSubs = new Map(state.subscriptions)
          const newInterval = currentSub.config.interval ?? DEFAULT_CONFIG.interval
          newSubs.set(id, { 
            ...currentSub, 
            lastRun: Date.now(),
            nextRun: Date.now() + newInterval,
            errorCount: 0,
            currentInterval: newInterval,
          })
          return { subscriptions: newSubs }
        })
      } catch (error) {
        get().handleError(id, error)
      }
    }, Math.max(0, sub.nextRun - Date.now()))
    
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      newSubs.set(id, { ...sub, timer })
      return { subscriptions: newSubs }
    })
  },
  
  handleError: (id: string, error: unknown) => {
    const { subscriptions } = get()
    const sub = subscriptions.get(id)
    if (!sub) return
    
    const newErrorCount = sub.errorCount + 1
    const baseInterval = sub.currentInterval ?? 60000
    let newInterval = baseInterval as number
    
    if (sub.config.backoffOnError) {
      const maxBackoff = 300000
      const nextInterval = newInterval * 2
      newInterval = Math.min(nextInterval, maxBackoff)
    }
    
    const nextRun = Date.now() + newInterval
    
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      newSubs.set(id, { 
        ...sub, 
        errorCount: newErrorCount,
        currentInterval: newInterval,
        nextRun,
      })
      return { subscriptions: newSubs }
    })
    
    get().scheduleRun(id)
    
    emitEvent(PlatformEvents.ERROR_OCCURRED, {
      type: 'background_refresh_error',
      resource: sub.resource,
      error: String(error),
      retryCount: newErrorCount,
      nextRetryIn: newInterval,
    })
  },
}))

export function useBackgroundRefreshState() {
  return useBackgroundRefresh()
}

export function initializeBackgroundRefresh() {
  useBackgroundRefresh.getState().start()
}

export function registerBackgroundRefresh(
  resource: string, 
  callback: () => Promise<void>, 
  config?: Partial<RefreshConfig>
) {
  return useBackgroundRefresh.getState().register(resource, callback, config)
}