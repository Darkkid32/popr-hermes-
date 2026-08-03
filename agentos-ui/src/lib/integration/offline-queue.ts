import { create } from 'zustand'
import { PlatformEvents, emitEvent } from './event-bus'

export interface QueuedMutation {
  id: string
  type: 'create' | 'update' | 'delete'
  resource: string
  resourceId: string
  payload: unknown
  timestamp: number
  retryCount: number
  maxRetries: number
  optimisticData?: unknown
  rollbackData?: unknown
  status: 'pending' | 'processing' | 'success' | 'failed' | 'rolled_back'
  lastAttempt?: number
  error?: string
}

export interface OfflineQueueState {
  queue: QueuedMutation[]
  isProcessing: boolean
  processorTimer: ReturnType<typeof setInterval> | null
  retryDelay: number
  maxRetries: number
  persistenceKey: string
  enqueue: (mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retryCount' | 'status'>) => string
  dequeue: (id: string) => void
  retry: (id: string) => void
  retryAll: () => void
  clear: () => void
  processQueue: () => Promise<void>
  startProcessor: () => void
  stopProcessor: () => void
  persist: () => void
  restore: () => void
  getQueueStatus: () => { pending: number; processing: number; failed: number; total: number }
}

const DEFAULT_RETRY_DELAY = 2000
const DEFAULT_MAX_RETRIES = 5
const PROCESSOR_INTERVAL = 5000
const PERSISTENCE_KEY = 'hermes-offline-queue'

let mutationIdCounter = 0

export const useOfflineQueue = create<OfflineQueueState>((set, get) => ({
  queue: [],
  isProcessing: false,
  processorTimer: null,
  retryDelay: DEFAULT_RETRY_DELAY,
  maxRetries: DEFAULT_MAX_RETRIES,
  persistenceKey: PERSISTENCE_KEY,
  
  enqueue: (mutation) => {
    const id = `mut-${++mutationIdCounter}-${Date.now()}`
    const newMutation: QueuedMutation = {
      ...mutation,
      id,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    }
    
    set((state) => ({ queue: [...state.queue, newMutation] }))
    get().persist()
    
    // Try to process immediately if online
    if (navigator.onLine) {
      get().processQueue()
    }
    
    return id
  },
  
  dequeue: (id: string) => {
    set((state) => ({ queue: state.queue.filter((m) => m.id !== id) }))
    get().persist()
  },
  
  retry: (id: string) => {
    set((state) => ({
      queue: state.queue.map((m) => 
        m.id === id 
          ? { ...m, status: 'pending', retryCount: 0, error: undefined }
          : m
      )
    }))
    get().persist()
    get().processQueue()
  },
  
  retryAll: () => {
    set((state) => ({
      queue: state.queue.map((m) => 
        m.status === 'failed' 
          ? { ...m, status: 'pending', retryCount: 0, error: undefined }
          : m
      )
    }))
    get().persist()
    get().processQueue()
  },
  
  clear: () => {
    set({ queue: [] })
    get().persist()
  },
  
  processQueue: async () => {
    const { queue, isProcessing } = get()
    if (isProcessing) return
    
    const pendingMutations = queue.filter((m) => m.status === 'pending' || (m.status === 'failed' && m.retryCount < m.maxRetries))
    if (pendingMutations.length === 0) return
    
    if (!navigator.onLine) return
    
    set({ isProcessing: true })
    
    for (const mutation of pendingMutations) {
      const currentQueue = get().queue
      const currentMutation = currentQueue.find((m) => m.id === mutation.id)
      if (!currentMutation || currentMutation.status === 'success') continue
      
      // Mark as processing
      set((state) => ({
                queue: state.queue.map((m) => 
                  m.id === mutation.id ? { ...m, status: 'processing' as const, lastAttempt: Date.now() } : m
                )
              }))
      
      try {
        // Emit event for actual API call
        // The actual implementation would be in the workspace/service layer
        // Here we just simulate and emit success
        await new Promise((resolve) => setTimeout(resolve, 100))
        
        // Simulate API call - in real implementation this would be:
        // const response = await apiClient.request(mutation.type, mutation.resource, mutation.resourceId, mutation.payload)
        
        set((state) => ({
          queue: state.queue.map((m) => 
            m.id === mutation.id ? { ...m, status: 'success' as const } : m
          )
        }))
        
        emitEvent(PlatformEvents.WORKFLOW_STEP_COMPLETED, {
          mutationId: mutation.id,
          resource: mutation.resource,
          type: mutation.type,
        })
      } catch (error) {
        const newRetryCount = mutation.retryCount + 1
        const isMaxRetries = newRetryCount >= mutation.maxRetries
        
        set((state) => ({
          queue: state.queue.map((m) => 
            m.id === mutation.id 
              ? { 
                  ...m, 
                  status: isMaxRetries ? 'failed' as const : 'pending' as const, 
                  retryCount: newRetryCount,
                  error: String(error),
                  lastAttempt: Date.now(),
                } 
              : m
          )
        }))
        
        if (!isMaxRetries) {
          // Schedule retry with exponential backoff
          const delay = get().retryDelay * Math.pow(2, newRetryCount - 1)
          setTimeout(() => get().processQueue(), delay)
        }
        
        emitEvent(PlatformEvents.WORKFLOW_FAILED, {
          mutationId: mutation.id,
          error: String(error),
          retryCount: newRetryCount,
        })
      }
    }
    
    // Clean up successful mutations older than 5 minutes
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    set((state) => ({
      queue: state.queue.filter((m) => m.status !== 'success' || m.timestamp > fiveMinutesAgo)
    }))
    
    get().persist()
    set({ isProcessing: false })
  },
  
  startProcessor: () => {
    const { processorTimer } = get()
    if (processorTimer) return
    
    const timer = setInterval(() => {
      get().processQueue()
    }, PROCESSOR_INTERVAL)
    
    set({ processorTimer: timer })
    // Also process on online event
    window.addEventListener('online', () => get().processQueue())
  },
  
  stopProcessor: () => {
    const { processorTimer } = get()
    if (processorTimer) {
      clearInterval(processorTimer)
      set({ processorTimer: null })
    }
    window.removeEventListener('online', () => get().processQueue())
  },
  
  persist: () => {
    const { queue } = get()
    try {
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(queue))
    } catch {
      // Ignore storage errors
    }
  },
  
  restore: () => {
    try {
      const stored = localStorage.getItem(PERSISTENCE_KEY)
      if (stored) {
        const queue = JSON.parse(stored) as QueuedMutation[]
        // Reset status of pending/processing mutations
        const restoredQueue = queue.map((m) => 
          m.status === 'processing' ? { ...m, status: 'pending' as const } : m
        )
        set({ queue: restoredQueue })
      }
    } catch {
      // Ignore parse errors
    }
  },
  
  getQueueStatus: () => {
    const { queue } = get()
    return {
      pending: queue.filter((m) => m.status === 'pending').length,
      processing: queue.filter((m) => m.status === 'processing').length,
      failed: queue.filter((m) => m.status === 'failed').length,
      total: queue.length,
    }
  },
}))

export function useOfflineQueueState() {
  return useOfflineQueue()
}

export function initializeOfflineQueue() {
  useOfflineQueue.getState().restore()
  useOfflineQueue.getState().startProcessor()
}

export function queueOptimisticUpdate(
  type: 'create' | 'update' | 'delete',
  resource: string,
  resourceId: string,
  payload: unknown,
  optimisticData: unknown,
  rollbackData?: unknown
) {
  return useOfflineQueue.getState().enqueue({
    type,
    resource,
    resourceId,
    payload,
    maxRetries: 5,
    optimisticData,
    rollbackData,
  })
}