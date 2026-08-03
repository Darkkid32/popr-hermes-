import { create } from 'zustand'
import { subscribeToEvent, PlatformEvents } from './event-bus'

export interface RealtimeConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting'
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'offline'
  latency: number
  lastConnected: number | null
  lastDisconnected: number | null
  reconnectAttempt: number
  endpoints: string[]
  currentEndpoint: number
}

export interface RealtimePresenceState {
  users: Map<string, {
    id: string
    name: string
    avatar: string
    color: string
    status: 'online' | 'away' | 'busy' | 'offline'
    lastSeen: number
    cursor?: { x: number; y: number; element?: string }
  }>
  localUser: {
    id: string
    name: string
    avatar: string
    color: string
  } | null
}

export interface RealtimeSyncState {
  pendingMutations: number
  failedMutations: number
  lastSync: number | null
  syncStatus: 'idle' | 'syncing' | 'success' | 'error' | 'conflict'
  conflicts: number
}

export interface RealtimeNotificationState {
  unreadCount: number
  lastNotification: { id: string; title: string; timestamp: number } | null
}

export interface RealtimeActivityState {
  recentEvents: Array<{
    id: string
    type: string
    payload: unknown
    timestamp: number
    workspace?: string
  }>
  maxEvents: number
}

export interface RealtimeState {
  // Connection
  connection: RealtimeConnectionState
  setConnectionStatus: (status: RealtimeConnectionState['status']) => void
  setConnectionQuality: (quality: RealtimeConnectionState['quality']) => void
  setLatency: (latency: number) => void
  recordConnect: () => void
  recordDisconnect: () => void
  incrementReconnectAttempt: () => void
  resetReconnectAttempt: () => void
  setEndpoints: (endpoints: string[]) => void
  switchEndpoint: (index: number) => void
  
  // Presence
  presence: RealtimePresenceState
  setLocalUser: (user: RealtimePresenceState['localUser']) => void
  addPresenceUser: (user: { id: string; name: string; avatar: string; color: string; status: 'online' | 'away' | 'busy' | 'offline'; lastSeen?: number; cursor?: { x: number; y: number; element?: string } }) => void
  removePresenceUser: (userId: string) => void
  updatePresenceUser: (userId: string, updates: Partial<RealtimePresenceState['users']['values']>) => void
  clearPresence: () => void
  
  // Sync
  sync: RealtimeSyncState
  incrementPendingMutations: () => void
  decrementPendingMutations: () => void
  incrementFailedMutations: () => void
  recordSyncSuccess: () => void
  recordSyncError: () => void
  setSyncStatus: (status: RealtimeSyncState['syncStatus']) => void
  incrementConflicts: () => void
  decrementConflicts: () => void
  
  // Notifications
  notifications: RealtimeNotificationState
  addNotification: (notification: { id: string; title: string }) => void
  clearUnreadCount: () => void
  
  // Activity
  activity: RealtimeActivityState
  addActivityEvent: (event: RealtimeActivityState['recentEvents'][0]) => void
  clearActivity: () => void
  
  // Global actions
  initialize: () => void
  shutdown: () => void
}

const DEFAULT_CONNECTION: RealtimeConnectionState = {
  status: 'disconnected',
  quality: 'offline',
  latency: 0,
  lastConnected: null,
  lastDisconnected: null,
  reconnectAttempt: 0,
  endpoints: [],
  currentEndpoint: 0,
}

const DEFAULT_PRESENCE: RealtimePresenceState = {
  users: new Map(),
  localUser: null,
}

const DEFAULT_SYNC: RealtimeSyncState = {
  pendingMutations: 0,
  failedMutations: 0,
  lastSync: null,
  syncStatus: 'idle',
  conflicts: 0,
}

const DEFAULT_NOTIFICATIONS: RealtimeNotificationState = {
  unreadCount: 0,
  lastNotification: null,
}

const DEFAULT_ACTIVITY: RealtimeActivityState = {
  recentEvents: [],
  maxEvents: 100,
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  connection: DEFAULT_CONNECTION,
  presence: DEFAULT_PRESENCE,
  sync: DEFAULT_SYNC,
  notifications: DEFAULT_NOTIFICATIONS,
  activity: DEFAULT_ACTIVITY,
  
  // Connection actions
  setConnectionStatus: (status) => set((state) => ({
    connection: { ...state.connection, status }
  })),
  
  setConnectionQuality: (quality) => set((state) => ({
    connection: { ...state.connection, quality }
  })),
  
  setLatency: (latency) => set((state) => ({
    connection: { ...state.connection, latency }
  })),
  
  recordConnect: () => set((state) => ({
    connection: {
      ...state.connection,
      status: 'connected',
      quality: 'excellent',
      lastConnected: Date.now(),
      reconnectAttempt: 0,
    }
  })),
  
  recordDisconnect: () => set((state) => ({
    connection: {
      ...state.connection,
      status: 'disconnected',
      quality: 'offline',
      lastDisconnected: Date.now(),
    }
  })),
  
  incrementReconnectAttempt: () => set((state) => ({
    connection: {
      ...state.connection,
      status: 'reconnecting',
      reconnectAttempt: state.connection.reconnectAttempt + 1,
    }
  })),
  
  resetReconnectAttempt: () => set((state) => ({
    connection: { ...state.connection, reconnectAttempt: 0 }
  })),
  
  setEndpoints: (endpoints) => set((state) => ({
    connection: { ...state.connection, endpoints, currentEndpoint: 0 }
  })),
  
  switchEndpoint: (index) => set((state) => ({
    connection: { ...state.connection, currentEndpoint: index }
  })),
  
  // Presence actions
  setLocalUser: (user) => set((state) => ({
    presence: { ...state.presence, localUser: user }
  })),
  
  addPresenceUser: (user: { id: string; name: string; avatar: string; color: string; status: 'online' | 'away' | 'busy' | 'offline'; lastSeen?: number; cursor?: { x: number; y: number; element?: string } }) => set((state) => {
    const newUsers = new Map(state.presence.users)
    newUsers.set(user.id, { ...user, lastSeen: user.lastSeen ?? Date.now() })
    return { presence: { ...state.presence, users: newUsers } }
  }),
  
  removePresenceUser: (userId) => set((state) => {
    const newUsers = new Map(state.presence.users)
    newUsers.delete(userId)
    return { presence: { ...state.presence, users: newUsers } }
  }),
  
  updatePresenceUser: (userId, updates) => set((state) => {
    const newUsers = new Map(state.presence.users)
    const user = newUsers.get(userId)
    if (user) {
      newUsers.set(userId, { ...user, ...updates, lastSeen: Date.now() })
    }
    return { presence: { ...state.presence, users: newUsers } }
  }),
  
  clearPresence: () => set((state) => ({
    presence: { ...state.presence, users: new Map() }
  })),
  
  // Sync actions
  incrementPendingMutations: () => set((state) => ({
    sync: { ...state.sync, pendingMutations: state.sync.pendingMutations + 1 }
  })),
  
  decrementPendingMutations: () => set((state) => ({
    sync: { ...state.sync, pendingMutations: Math.max(0, state.sync.pendingMutations - 1) }
  })),
  
  incrementFailedMutations: () => set((state) => ({
    sync: { ...state.sync, failedMutations: state.sync.failedMutations + 1 }
  })),
  
  recordSyncSuccess: () => set((state) => ({
    sync: {
      ...state.sync,
      lastSync: Date.now(),
      syncStatus: 'success',
      pendingMutations: 0,
    }
  })),
  
  recordSyncError: () => set((state) => ({
    sync: {
      ...state.sync,
      syncStatus: 'error',
    }
  })),
  
  setSyncStatus: (status) => set((state) => ({
    sync: { ...state.sync, syncStatus: status }
  })),
  
  incrementConflicts: () => set((state) => ({
    sync: { ...state.sync, conflicts: state.sync.conflicts + 1 }
  })),
  
  decrementConflicts: () => set((state) => ({
    sync: { ...state.sync, conflicts: Math.max(0, state.sync.conflicts - 1) }
  })),
  
  // Notification actions
  addNotification: (notification) => set((state) => ({
    notifications: {
      ...state.notifications,
      unreadCount: state.notifications.unreadCount + 1,
      lastNotification: { ...notification, timestamp: Date.now() },
    }
  })),
  
  clearUnreadCount: () => set((state) => ({
    notifications: { ...state.notifications, unreadCount: 0 }
  })),
  
  // Activity actions
  addActivityEvent: (event) => set((state) => {
    const newEvents = [event, ...state.activity.recentEvents].slice(0, state.activity.maxEvents)
    return { activity: { ...state.activity, recentEvents: newEvents } }
  }),
  
  clearActivity: () => set((state) => ({
    activity: { ...state.activity, recentEvents: [] }
  })),
  
  // Global actions
  initialize: () => {
    // Subscribe to WebSocket events
    subscribeToEvent(PlatformEvents.WS_CONNECTED, () => get().recordConnect())
    subscribeToEvent(PlatformEvents.WS_DISCONNECTED, () => get().recordDisconnect())
    subscribeToEvent(PlatformEvents.WS_RECONNECTING, () => get().incrementReconnectAttempt())
    subscribeToEvent(PlatformEvents.WS_ERROR, () => get().setConnectionStatus('error'))
    
    // Subscribe to sync events
    subscribeToEvent('sync:success', () => get().recordSyncSuccess())
    subscribeToEvent('sync:error', () => get().recordSyncError())
    subscribeToEvent('sync:conflict', () => get().incrementConflicts())
    
    // Subscribe to notification events
    subscribeToEvent(PlatformEvents.NOTIFICATION_ADDED, (payload: { id: string; title: string }) => 
      get().addNotification(payload)
    )
    
    // Subscribe to activity events
    subscribeToEvent('activity:event', (payload: RealtimeActivityState['recentEvents'][0]) => 
      get().addActivityEvent(payload)
    )
  },
  
  shutdown: () => {
    set({
      connection: DEFAULT_CONNECTION,
      presence: DEFAULT_PRESENCE,
      sync: DEFAULT_SYNC,
      notifications: DEFAULT_NOTIFICATIONS,
      activity: DEFAULT_ACTIVITY,
    })
  },
}))

export function useRealtimeStoreState() {
  return useRealtimeStore()
}

export function initializeRealtime() {
  useRealtimeStore.getState().initialize()
}

export function shutdownRealtime() {
  useRealtimeStore.getState().shutdown()
}

// Selectors for common use cases
export function useConnectionStatus() {
  return useRealtimeStore((state) => state.connection.status)
}

export function useConnectionQuality() {
  return useRealtimeStore((state) => state.connection.quality)
}

export function useLatency() {
  return useRealtimeStore((state) => state.connection.latency)
}

export function usePresenceUsers() {
  return useRealtimeStore((state) => Array.from(state.presence.users.values()))
}

export function useLocalUser() {
  return useRealtimeStore((state) => state.presence.localUser)
}

export function useSyncStatus() {
  return useRealtimeStore((state) => state.sync.syncStatus)
}

export function usePendingMutations() {
  return useRealtimeStore((state) => state.sync.pendingMutations)
}

export function useUnreadNotifications() {
  return useRealtimeStore((state) => state.notifications.unreadCount)
}

export function useRecentActivity() {
  return useRealtimeStore((state) => state.activity.recentEvents)
}