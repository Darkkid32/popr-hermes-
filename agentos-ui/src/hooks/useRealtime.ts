import { useRealtimeStore } from '../lib/integration/realtime-store'
import { useEventBus } from '../lib/integration/event-bus'
import { useEffect } from 'react'

export function useRealtime() {
  const connection = useRealtimeStore((state) => state.connection)
  const presence = useRealtimeStore((state) => state.presence)
  const sync = useRealtimeStore((state) => state.sync)
  const notifications = useRealtimeStore((state) => state.notifications)
  const activity = useRealtimeStore((state) => state.activity)
  
  const setConnectionStatus = useRealtimeStore((state) => state.setConnectionStatus)
  const setConnectionQuality = useRealtimeStore((state) => state.setConnectionQuality)
  const setLatency = useRealtimeStore((state) => state.setLatency)
  const recordConnect = useRealtimeStore((state) => state.recordConnect)
  const recordDisconnect = useRealtimeStore((state) => state.recordDisconnect)
  const incrementReconnectAttempt = useRealtimeStore((state) => state.incrementReconnectAttempt)
  const resetReconnectAttempt = useRealtimeStore((state) => state.resetReconnectAttempt)
  const setEndpoints = useRealtimeStore((state) => state.setEndpoints)
  const switchEndpoint = useRealtimeStore((state) => state.switchEndpoint)
  
  const setLocalUser = useRealtimeStore((state) => state.setLocalUser)
  const addPresenceUser = useRealtimeStore((state) => state.addPresenceUser)
  const removePresenceUser = useRealtimeStore((state) => state.removePresenceUser)
  const updatePresenceUser = useRealtimeStore((state) => state.updatePresenceUser)
  const clearPresence = useRealtimeStore((state) => state.clearPresence)
  
  const incrementPendingMutations = useRealtimeStore((state) => state.incrementPendingMutations)
  const decrementPendingMutations = useRealtimeStore((state) => state.decrementPendingMutations)
  const incrementFailedMutations = useRealtimeStore((state) => state.incrementFailedMutations)
  const recordSyncSuccess = useRealtimeStore((state) => state.recordSyncSuccess)
  const recordSyncError = useRealtimeStore((state) => state.recordSyncError)
  const setSyncStatus = useRealtimeStore((state) => state.setSyncStatus)
  const incrementConflicts = useRealtimeStore((state) => state.incrementConflicts)
  const decrementConflicts = useRealtimeStore((state) => state.decrementConflicts)
  
  const addNotification = useRealtimeStore((state) => state.addNotification)
  const clearUnreadCount = useRealtimeStore((state) => state.clearUnreadCount)
  
  const addActivityEvent = useRealtimeStore((state) => state.addActivityEvent)
  const clearActivity = useRealtimeStore((state) => state.clearActivity)
  
  const initialize = useRealtimeStore((state) => state.initialize)
  const shutdown = useRealtimeStore((state) => state.shutdown)
  
  // Connection helpers
  const isConnected = connection.status === 'connected'
  const isConnecting = connection.status === 'connecting' || connection.status === 'reconnecting'
  const isOffline = connection.status === 'disconnected' || connection.status === 'error'
  
  // Presence helpers
  const onlineUsers = Array.from(presence.users.values()).filter((u) => u.status === 'online')
  const awayUsers = Array.from(presence.users.values()).filter((u) => u.status === 'away')
  const busyUsers = Array.from(presence.users.values()).filter((u) => u.status === 'busy')
  
  // Sync helpers
  const isSyncing = sync.syncStatus === 'syncing'
  const hasSyncErrors = sync.failedMutations > 0 || sync.conflicts > 0
  const isSynced = sync.syncStatus === 'success' || sync.syncStatus === 'idle'
  
  return {
    // Connection
    connection,
    isConnected,
    isConnecting,
    isOffline,
    setConnectionStatus,
    setConnectionQuality,
    setLatency,
    recordConnect,
    recordDisconnect,
    incrementReconnectAttempt,
    resetReconnectAttempt,
    setEndpoints,
    switchEndpoint,
    
    // Presence
    presence,
    onlineUsers,
    awayUsers,
    busyUsers,
    localUser: presence.localUser,
    setLocalUser,
    addPresenceUser,
    removePresenceUser,
    updatePresenceUser,
    clearPresence,
    
    // Sync
    sync,
    isSyncing,
    hasSyncErrors,
    isSynced,
    incrementPendingMutations,
    decrementPendingMutations,
    incrementFailedMutations,
    recordSyncSuccess,
    recordSyncError,
    setSyncStatus,
    incrementConflicts,
    decrementConflicts,
    
    // Notifications
    notifications,
    unreadCount: notifications.unreadCount,
    addNotification,
    clearUnreadCount,
    
    // Activity
    activity,
    recentEvents: activity.recentEvents,
    addActivityEvent,
    clearActivity,
    
    // Global
    initialize,
    shutdown,
  }
}

export function useConnection() {
  return useRealtimeStore((state) => state.connection)
}

export function usePresence() {
  return useRealtimeStore((state) => state.presence)
}

export function useSync() {
  return useRealtimeStore((state) => state.sync)
}

export function useNotifications() {
  return useRealtimeStore((state) => state.notifications)
}

export function useActivity() {
  return useRealtimeStore((state) => state.activity)
}

// Specialized hooks
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

// Event subscription hook
export function useEventSubscription<T>(
  eventType: string, 
  callback: (payload: T) => void
) {
  useEffect(() => {
    const unsubscribe = useEventBus.getState().subscribe(eventType, callback)
    return unsubscribe
  }, [eventType, callback])
}

export function useEventEmit() {
  return useEventBus.getState().emit
}