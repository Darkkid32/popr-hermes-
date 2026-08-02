import { create } from 'zustand'

type EventCallback = (event: unknown) => void

interface EventSubscription {
  id: string
  eventType: string
  callback: EventCallback
}

interface EventBusState {
  subscriptions: Map<string, EventSubscription[]>
  emit: <T>(eventType: string, payload: T) => void
  subscribe: <T>(eventType: string, callback: (payload: T) => void) => () => void
  subscribeOnce: <T>(eventType: string, callback: (payload: T) => void) => () => void
  unsubscribe: (eventType: string, callback: EventCallback) => void
  clear: () => void
}

let subscriptionIdCounter = 0

export const useEventBus = create<EventBusState>((set, get) => ({
  subscriptions: new Map(),

  emit: <T>(eventType: string, payload: T) => {
    const subs = get().subscriptions.get(eventType)
    if (subs) {
      subs.forEach((sub) => {
        try {
          sub.callback(payload)
        } catch (error) {
          console.error(`Error in event bus subscriber for ${eventType}:`, error)
        }
      })
    }
    // Also emit to wildcard listeners
    const wildcardSubs = get().subscriptions.get('*')
    if (wildcardSubs) {
      wildcardSubs.forEach((sub) => {
        try {
          sub.callback({ type: eventType, payload })
        } catch (error) {
          console.error('Error in wildcard event bus subscriber:', error)
        }
      })
    }
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

  clear: () => {
    set({ subscriptions: new Map() })
  },
}))

export function useEventBusState() {
  return useEventBus()
}

export function emitEvent<T>(eventType: string, payload: T) {
  useEventBus.getState().emit(eventType, payload)
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

export function clearEventBus() {
  useEventBus.getState().clear()
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
} as const

export type PlatformEventType = typeof PlatformEvents[keyof typeof PlatformEvents]