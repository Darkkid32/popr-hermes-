import { create } from 'zustand'

type EventCallback = (event: unknown) => void

interface EventSubscription {
  id: string
  eventType: string
  callback: EventCallback
}

interface BatchedEvent {
  eventType: string
  payload: unknown
  timestamp: number
}

interface EventBusState {
  subscriptions: Map<string, EventSubscription[]>
  eventLog: BatchedEvent[]
  maxLogSize: number
  batchTimer: ReturnType<typeof setTimeout> | null
  batchQueue: BatchedEvent[]
  batchInterval: number
  throttledEvents: Map<string, number>
  emit: <T>(eventType: string, payload: T, options?: { throttle?: number; persist?: boolean }) => void
  subscribe: <T>(eventType: string, callback: (payload: T) => void) => () => void
  subscribeOnce: <T>(eventType: string, callback: (payload: T) => void) => () => void
  unsubscribe: (eventType: string, callback: EventCallback) => void
  unsubscribeAll: (eventType?: string) => void
  clear: () => void
  getEventLog: (eventType?: string, since?: number) => BatchedEvent[]
  replayEvents: (eventType: string, callback: (payload: unknown) => void, since?: number) => void
  setBatchInterval: (interval: number) => void
  flushBatch: () => void
  getSubscriptionCount: (eventType?: string) => number
}

let subscriptionIdCounter = 0

const DEFAULT_BATCH_INTERVAL = 50

export const useEventBus = create<EventBusState>((set, get) => ({
  subscriptions: new Map(),
  eventLog: [],
  maxLogSize: 1000,
  batchTimer: null,
  batchQueue: [],
  batchInterval: DEFAULT_BATCH_INTERVAL,
  throttledEvents: new Map(),
  
  emit: <T>(eventType: string, payload: T, options?: { throttle?: number; persist?: boolean }) => {
    const { throttle = 0, persist = true } = options || {}
    const now = Date.now()
    
    // Throttling check
    if (throttle > 0) {
      const lastEmit = get().throttledEvents.get(eventType) || 0
      if (now - lastEmit < throttle) {
        return // Skip this emission
      }
      set((state) => {
        const newThrottled = new Map(state.throttledEvents)
        newThrottled.set(eventType, now)
        return { throttledEvents: newThrottled }
      })
    }
    
    const batchedEvent: BatchedEvent = { eventType, payload, timestamp: now }
    
    // Add to batch queue
    set((state) => ({ batchQueue: [...state.batchQueue, batchedEvent] }))
    
    // Persist to event log
    if (persist) {
      set((state) => {
        const newLog = [...state.eventLog, batchedEvent]
        if (newLog.length > state.maxLogSize) {
          newLog.splice(0, newLog.length - state.maxLogSize)
        }
        return { eventLog: newLog }
      })
    }
    
    // Schedule batch flush
    const { batchTimer, batchInterval } = get()
    if (!batchTimer) {
      const timer = setTimeout(() => get().flushBatch(), batchInterval)
      set({ batchTimer: timer })
    }
  },
  
  flushBatch: () => {
    const { batchQueue, subscriptions } = get()
    if (batchQueue.length === 0) {
      set({ batchTimer: null })
      return
    }
    
    // Group by event type
    const grouped = new Map<string, BatchedEvent[]>()
    batchQueue.forEach((event) => {
      const existing = grouped.get(event.eventType) || []
      existing.push(event)
      grouped.set(event.eventType, existing)
    })
    
    // Emit each group
    grouped.forEach((events, eventType) => {
      const subs = subscriptions.get(eventType)
      if (subs) {
        // For batched events, emit the last one or all depending on subscriber preference
        subs.forEach((sub) => {
          try {
            // Emit the latest event in the batch
            const latestEvent = events[events.length - 1]
            sub.callback(latestEvent.payload)
          } catch (error) {
            console.error(`Error in event bus subscriber for ${eventType}:`, error)
          }
        })
      }
      
      // Also emit to wildcard listeners
      const wildcardSubs = subscriptions.get('*')
      if (wildcardSubs) {
        wildcardSubs.forEach((sub) => {
          try {
            // Emit all events in batch for wildcard
            events.forEach((event) => {
              sub.callback({ type: event.eventType, payload: event.payload, timestamp: event.timestamp })
            })
          } catch (error) {
            console.error('Error in wildcard event bus subscriber:', error)
          }
        })
      }
    })
    
    set({ batchQueue: [], batchTimer: null })
  },
  
  subscribe: <T>(eventType: string, callback: (payload: T) => void) => {
    const id = `sub-${++subscriptionIdCounter}`
    const subscription: EventSubscription = { id, eventType, callback: callback as EventCallback }
    
    set((state) => {
      const newSubs = new Map(state.subscriptions)
      const existing = newSubs.get(eventType) || []
      newSubs.set(eventType, [...existing, subscription])
      return { subscriptions: newSubs }
    })
    
    return () => {
      get().unsubscribe(eventType, callback as EventCallback)
    }
  },
  
  subscribeOnce: <T>(eventType: string, callback: (payload: T) => void) => {
    const unsubscribe = get().subscribe<T>(eventType, (payload) => {
      callback(payload)
      unsubscribe()
    })
    return unsubscribe
  },
  
  unsubscribe: (eventType: string, callback: EventCallback) => {
      set((state) => {
        const newSubs = new Map(state.subscriptions)
        const existing = newSubs.get(eventType)
        if (existing) {
          const filtered = existing.filter((s) => s.callback !== callback)
          if (filtered.length === 0) {
            newSubs.delete(eventType)
          } else {
            newSubs.set(eventType, filtered)
          }
        }
        return { subscriptions: newSubs }
      })
    },

    unsubscribeAll: (eventType?: string) => {
      set((state) => {
        if (eventType) {
          const newSubs = new Map(state.subscriptions)
          newSubs.delete(eventType)
          return { subscriptions: newSubs }
        }
        return { subscriptions: new Map() }
      })
    },

    clear: () => {
      set({ subscriptions: new Map(), eventLog: [], batchQueue: [], throttledEvents: new Map() })
    },
  
  getEventLog: (eventType?: string, since?: number) => {
      const { eventLog } = get()
      let filtered = eventLog
      if (eventType) {
        filtered = filtered.filter((e) => e.eventType === eventType)
      }
      if (since) {
        filtered = filtered.filter((e) => e.timestamp >= since)
      }
      return filtered
    },

    getSubscriptionCount: (eventType?: string) => {
      const { subscriptions } = get()
      if (eventType) {
        return subscriptions.get(eventType)?.length ?? 0
      }
      let count = 0
      subscriptions.forEach((subs) => { count += subs.length })
      return count
    },

    replayEvents: (eventType: string, callback: (payload: unknown) => void, since?: number) => {
    const events = get().getEventLog(eventType, since)
    events.forEach((event) => {
      try {
        callback(event.payload)
      } catch (error) {
        console.error(`Error replaying event ${eventType}:`, error)
      }
    })
  },
  
  setBatchInterval: (interval: number) => {
    set({ batchInterval: interval })
  },
}))

export function useEventBusState() {
  return useEventBus()
}

export function emitEvent<T>(eventType: string, payload: T, options?: { throttle?: number; persist?: boolean }) {
  useEventBus.getState().emit(eventType, payload, options)
}

export function subscribeToEvent<T>(eventType: string, callback: (payload: T) => void) {
  return useEventBus.getState().subscribe(eventType, callback)
}

export function subscribeOnceToEvent<T>(eventType: string, callback: (payload: T) => void) {
  return useEventBus.getState().subscribeOnce(eventType, callback)
}

export function unsubscribeFromEvent(eventType: string, callback: EventCallback) {
  useEventBus.getState().unsubscribe(eventType, callback)
}

export function unsubscribeAllEvents(eventType?: string) {
  useEventBus.getState().unsubscribeAll(eventType)
}

export function clearEventBus() {
  useEventBus.getState().clear()
}

export function getEventLog(eventType?: string, since?: number) {
  return useEventBus.getState().getEventLog(eventType, since)
}

export function getSubscriptionCount(eventType?: string) {
  return useEventBus.getState().getSubscriptionCount(eventType)
}

export function replayEvents(eventType: string, callback: (payload: unknown) => void, since?: number) {
  useEventBus.getState().replayEvents(eventType, callback, since)
}

// Common event types for the platform
export const PlatformEvents = {
  // Workspace events
  WORKSPACE_CHANGED: 'workspace:changed',
  WORKSPACE_TAB_CHANGED: 'workspace:tab:changed',
  WORKSPACE_LOADED: 'workspace:loaded',

  // Navigation events
  NAVIGATION_NAVIGATED: 'navigation:navigated',
  NAVIGATION_ITEM_CLICKED: 'navigation:item:clicked',

  // Command palette events
  COMMAND_PALETTE_OPENED: 'command-palette:opened',
  COMMAND_PALETTE_CLOSED: 'command-palette:closed',
  COMMAND_EXECUTED: 'command:executed',

  // Global search events
  GLOBAL_SEARCH_OPENED: 'global-search:opened',
  GLOBAL_SEARCH_CLOSED: 'global-search:closed',
  GLOBAL_SEARCH_QUERY_CHANGED: 'global-search:query:changed',
  GLOBAL_SEARCH_RESULT_SELECTED: 'global-search:result:selected',

  // Notification events
  NOTIFICATION_ADDED: 'notification:added',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_REMOVED: 'notification:removed',

  // Dialog/Drawer/Modal events
  DIALOG_OPENED: 'dialog:opened',
  DIALOG_CLOSED: 'dialog:closed',
  DRAWER_OPENED: 'drawer:opened',
  DRAWER_CLOSED: 'drawer:closed',
  MODAL_OPENED: 'modal:opened',
  MODAL_CLOSED: 'modal:closed',

  // Loading events
  LOADING_STARTED: 'loading:started',
  LOADING_PROGRESS: 'loading:progress',
  LOADING_COMPLETED: 'loading:completed',

  // Error events
  ERROR_OCCURRED: 'error:occurred',
  ERROR_DISMISSED: 'error:dismissed',

  // Settings/Config events
  CONFIG_CHANGED: 'config:changed',
  THEME_CHANGED: 'theme:changed',
  PREFERENCES_CHANGED: 'preferences:changed',

  // User/Session events
  USER_LOGGED_IN: 'user:logged_in',
  USER_LOGGED_OUT: 'user:logged_out',
  SESSION_EXPIRED: 'session:expired',

  // WebSocket events
  WS_CONNECTED: 'ws:connected',
  WS_DISCONNECTED: 'ws:disconnected',
  WS_ERROR: 'ws:error',
  WS_RECONNECTING: 'ws:reconnecting',

  // Agent events
  AGENT_STATUS_CHANGED: 'agent:status_changed',
  AGENT_STATE_UPDATED: 'agent:state_updated',
  AGENT_MESSAGE_RECEIVED: 'agent:message_received',

  // Workflow events
  WORKFLOW_STARTED: 'workflow:started',
  WORKFLOW_COMPLETED: 'workflow:completed',
  WORKFLOW_FAILED: 'workflow:failed',
  WORKFLOW_STEP_STARTED: 'workflow:step:started',
  WORKFLOW_STEP_COMPLETED: 'workflow:step:completed',

  // Real-time specific events
  PRESENCE_JOIN: 'presence:join',
  PRESENCE_LEAVE: 'presence:leave',
  PRESENCE_UPDATE: 'presence:update',
  PRESENCE_CURSOR: 'presence:cursor',
  SYNC_CONFLICT: 'sync:conflict',
  SYNC_SUCCESS: 'sync:success',
  SYNC_ERROR: 'sync:error',
  ACTIVITY_EVENT: 'activity:event',
} as const

export type PlatformEventType = typeof PlatformEvents[keyof typeof PlatformEvents]