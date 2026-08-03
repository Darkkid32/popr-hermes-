import { create } from 'zustand'
import { PlatformEvents, emitEvent } from './event-bus'

export interface NetworkInfo {
  online: boolean
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  downlink: number
  rtt: number
  saveData: boolean
  lastChange: number
}

export interface NetworkDetectorState {
  networkInfo: NetworkInfo
  listeners: Set<(info: NetworkInfo) => void>
  observer: PerformanceObserver | null
  start: () => void
  stop: () => void
  subscribe: (listener: (info: NetworkInfo) => void) => () => void
  getNetworkInfo: () => NetworkInfo
}

const DEFAULT_NETWORK_INFO: NetworkInfo = {
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  effectiveType: 'unknown',
  downlink: 0,
  rtt: 0,
  saveData: false,
  lastChange: Date.now(),
}

export const useNetworkDetector = create<NetworkDetectorState>((set, get) => ({
  networkInfo: DEFAULT_NETWORK_INFO,
  listeners: new Set(),
  observer: null,
  
  start: () => {
    if (typeof window === 'undefined') return
    
    // Initial detection
    const updateNetworkInfo = () => {
      const connection = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection
      const newInfo: NetworkInfo = {
        online: navigator.onLine,
        effectiveType: (connection?.effectiveType as NetworkInfo['effectiveType']) || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
        lastChange: Date.now(),
      }
      
      const { networkInfo } = get()
      const changed = networkInfo.online !== newInfo.online ||
        networkInfo.effectiveType !== newInfo.effectiveType ||
        Math.abs(networkInfo.downlink - newInfo.downlink) > 0.5 ||
        Math.abs(networkInfo.rtt - newInfo.rtt) > 50
      
      if (changed) {
        set({ networkInfo: newInfo })
        get().listeners.forEach((listener) => {
          try {
            listener(newInfo)
          } catch (error) {
            console.error('Network detector listener error:', error)
          }
        })
        
        emitEvent(PlatformEvents.WS_RECONNECTING, { networkChange: true, ...newInfo })
      }
    }
    
    // Listen for online/offline events
    window.addEventListener('online', updateNetworkInfo)
    window.addEventListener('offline', updateNetworkInfo)
    
    // Listen for connection change events
    const connection = (navigator as unknown as { connection?: { addEventListener?: (event: string, listener: () => void) => void } }).connection
    if (connection?.addEventListener) {
      connection.addEventListener('change', updateNetworkInfo)
    }
    
    // Observe network timing
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.entryType === 'resource' && entry.name.includes('ws')) {
              // Could extract RTT from timing entries
            }
          })
        })
        observer.observe({ entryTypes: ['resource'] })
        set({ observer })
      } catch {
        // Ignore if not supported
      }
    }
    
    // Initial update
    updateNetworkInfo()
  },
  
  stop: () => {
    if (typeof window === 'undefined') return
    
    const updateNetworkInfo = () => {} // placeholder for removal
    window.removeEventListener('online', updateNetworkInfo)
    window.removeEventListener('offline', updateNetworkInfo)
    
    const connection = (navigator as unknown as { connection?: { removeEventListener?: (event: string, listener: () => void) => void } }).connection
    if (connection?.removeEventListener) {
      connection.removeEventListener('change', updateNetworkInfo)
    }
    
    const { observer } = get()
    if (observer) {
      observer.disconnect()
      set({ observer: null })
    }
  },
  
  subscribe: (listener: (info: NetworkInfo) => void) => {
    const { listeners } = get()
    const newListeners = new Set(listeners)
    newListeners.add(listener)
    set({ listeners: newListeners })
    
    // Immediately call with current state
    try {
      listener(get().networkInfo)
    } catch {
      // Ignore
    }
    
    return () => {
      const current = get().listeners
      current.delete(listener)
      set({ listeners: current })
    }
  },
  
  getNetworkInfo: () => get().networkInfo,
}))

export function useNetworkDetectorState() {
  return useNetworkDetector()
}

export function initializeNetworkDetector() {
  useNetworkDetector.getState().start()
}

export function getNetworkInfo() {
  return useNetworkDetector.getState().networkInfo
}