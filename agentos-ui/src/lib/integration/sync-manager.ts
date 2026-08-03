import { create } from 'zustand'
import { PlatformEvents, emitEvent } from './event-bus'

export interface VectorClock {
  [nodeId: string]: number
}

export interface SyncConflict {
  id: string
  resource: string
  resourceId: string
  localVersion: VectorClock
  remoteVersion: VectorClock
  localData: unknown
  remoteData: unknown
  timestamp: number
  status: 'detected' | 'resolving' | 'resolved' | 'escalated'
  resolution?: 'local' | 'remote' | 'merge' | 'manual'
  resolvedData?: unknown
}

export interface SyncState {
  vectorClock: VectorClock
  nodeId: string
  conflicts: Map<string, SyncConflict>
  pendingSync: Map<string, { resource: string; resourceId: string; version: VectorClock }>
  lastSyncTimestamp: number
  syncInterval: number
  syncTimer: ReturnType<typeof setInterval> | null
  incrementClock: () => void
  updateClock: (receivedClock: VectorClock) => void
  detectConflict: (resource: string, resourceId: string, localData: unknown, localVersion: VectorClock, remoteData: unknown, remoteVersion: VectorClock) => string
  resolveConflict: (conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedData?: unknown) => void
  escalateConflict: (conflictId: string) => void
  registerPendingSync: (resource: string, resourceId: string) => void
  clearPendingSync: (resource: string, resourceId: string) => void
  startSyncTimer: () => void
  stopSyncTimer: () => void
  getConflictCount: () => number
  getUnresolvedConflicts: () => SyncConflict[]
}

const generateNodeId = () => `node-${Math.random().toString(36).substr(2, 9)}`

export const useSyncManager = create<SyncState>((set, get) => ({
  vectorClock: {},
  nodeId: generateNodeId(),
  conflicts: new Map(),
  pendingSync: new Map(),
  lastSyncTimestamp: 0,
  syncInterval: 30000,
  syncTimer: null,
  
  incrementClock: () => {
    const { vectorClock, nodeId } = get()
    set({
      vectorClock: {
        ...vectorClock,
        [nodeId]: (vectorClock[nodeId] || 0) + 1,
      }
    })
  },
  
  updateClock: (receivedClock: VectorClock) => {
    const { vectorClock, nodeId } = get()
    const newClock = { ...vectorClock }
    
    // Merge vector clocks: take max of each node
    Object.entries(receivedClock).forEach(([node, time]) => {
      newClock[node] = Math.max(newClock[node] || 0, time)
    })
    
    // Increment own clock
    newClock[nodeId] = (newClock[nodeId] || 0) + 1
    
    set({ vectorClock: newClock })
  },
  
  detectConflict: (resource: string, resourceId: string, localData: unknown, localVersion: VectorClock, remoteData: unknown, remoteVersion: VectorClock) => {
    // Check if versions are concurrent (neither dominates)
    const localDominates = Object.entries(localVersion).every(([node, time]) => (remoteVersion[node] || 0) <= time)
    const remoteDominates = Object.entries(remoteVersion).every(([node, time]) => (localVersion[node] || 0) <= time)
    
    // If one dominates, no conflict
    if (localDominates || remoteDominates) {
      return ''
    }
    
    // Concurrent modification detected
    const conflictId = `conflict-${resource}-${resourceId}-${Date.now()}`
    const conflict: SyncConflict = {
      id: conflictId,
      resource,
      resourceId,
      localVersion,
      remoteVersion,
      localData,
      remoteData,
      timestamp: Date.now(),
      status: 'detected',
    }
    
    set((state) => {
      const newConflicts = new Map(state.conflicts)
      newConflicts.set(conflictId, conflict)
      return { conflicts: newConflicts }
    })
    
    emitEvent(PlatformEvents.WORKFLOW_FAILED, {
      type: 'sync_conflict',
      conflictId,
      resource,
      resourceId,
    })
    
    return conflictId
  },
  
  resolveConflict: (conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedData?: unknown) => {
    const { conflicts } = get()
    const conflict = conflicts.get(conflictId)
    if (!conflict) return
    
    let resolvedData: unknown
    switch (resolution) {
      case 'local':
        resolvedData = conflict.localData
        break
      case 'remote':
        resolvedData = conflict.remoteData
        break
      case 'merge':
        resolvedData = mergedData ?? { ...(conflict.localData as object), ...(conflict.remoteData as object) }
        break
    }
    
    const resolvedConflict: SyncConflict = {
      ...conflict,
      status: 'resolved',
      resolution,
      resolvedData,
    }
    
    set((state) => {
      const newConflicts = new Map(state.conflicts)
      newConflicts.set(conflictId, resolvedConflict)
      return { conflicts: newConflicts }
    })
    
    emitEvent(PlatformEvents.WORKFLOW_STEP_COMPLETED, {
      type: 'sync_conflict_resolved',
      conflictId,
      resolution,
    })
  },
  
  escalateConflict: (conflictId: string) => {
    const { conflicts } = get()
    const conflict = conflicts.get(conflictId)
    if (!conflict) return
    
    const escalatedConflict: SyncConflict = {
      ...conflict,
      status: 'escalated',
    }
    
    set((state) => {
      const newConflicts = new Map(state.conflicts)
      newConflicts.set(conflictId, escalatedConflict)
      return { conflicts: newConflicts }
    })
    
    emitEvent(PlatformEvents.ERROR_OCCURRED, {
      type: 'sync_conflict_escalated',
      conflictId,
      resource: conflict.resource,
      resourceId: conflict.resourceId,
    })
  },
  
  registerPendingSync: (resource: string, resourceId: string) => {
    const { vectorClock } = get()
    const key = `${resource}:${resourceId}`
    set((state) => {
      const newPending = new Map(state.pendingSync)
      newPending.set(key, { resource, resourceId, version: { ...vectorClock } })
      return { pendingSync: newPending }
    })
  },
  
  clearPendingSync: (resource: string, resourceId: string) => {
    const key = `${resource}:${resourceId}`
    set((state) => {
      const newPending = new Map(state.pendingSync)
      newPending.delete(key)
      return { pendingSync: newPending }
    })
  },
  
  startSyncTimer: () => {
    const { syncTimer, syncInterval } = get()
    if (syncTimer) return
    
    const timer = setInterval(() => {
      // Emit sync event for workspaces to handle
      emitEvent('sync:periodic', { timestamp: Date.now() })
      set({ lastSyncTimestamp: Date.now() })
    }, syncInterval)
    
    set({ syncTimer: timer })
  },
  
  stopSyncTimer: () => {
    const { syncTimer } = get()
    if (syncTimer) {
      clearInterval(syncTimer)
      set({ syncTimer: null })
    }
  },
  
  getConflictCount: () => get().conflicts.size,
  
  getUnresolvedConflicts: () => {
    const { conflicts } = get()
    return Array.from(conflicts.values()).filter((c) => c.status !== 'resolved')
  },
}))

export function useSyncManagerState() {
  return useSyncManager()
}

export function initializeSyncManager(nodeId?: string) {
  if (nodeId) {
    useSyncManager.setState({ nodeId })
  }
  useSyncManager.getState().startSyncTimer()
}

export function compareVectorClocks(a: VectorClock, b: VectorClock): 'a-dominates' | 'b-dominates' | 'concurrent' | 'equal' {
  const aDominates = Object.entries(a).every(([node, time]) => (b[node] || 0) <= time) && Object.keys(a).length >= Object.keys(b).length
  const bDominates = Object.entries(b).every(([node, time]) => (a[node] || 0) <= time) && Object.keys(b).length >= Object.keys(a).length
  
  if (aDominates && bDominates) return 'equal'
  if (aDominates) return 'a-dominates'
  if (bDominates) return 'b-dominates'
  return 'concurrent'
}

export function mergeVectorClocks(a: VectorClock, b: VectorClock): VectorClock {
  const merged = { ...a }
  Object.entries(b).forEach(([node, time]) => {
    merged[node] = Math.max(merged[node] || 0, time)
  })
  return merged
}