import { useOfflineQueue } from '../lib/integration/offline-queue'
import { useSyncManager } from '../lib/integration/sync-manager'
import { useRealtimeStore } from '../lib/integration/realtime-store'
import { useCallback } from 'react'

function useOptimisticUpdateBase() {
  const { enqueue, getQueueStatus } = useOfflineQueue()
  const { incrementClock, updateClock } = useSyncManager()
  const { incrementPendingMutations, decrementPendingMutations, incrementFailedMutations } = useRealtimeStore()
  
  const executeOptimistic = useCallback(async <T,>(
    mutation: {
      type: 'create' | 'update' | 'delete'
      resource: string
      resourceId: string
      payload: unknown
      optimisticData: T
      rollbackData?: T
      apiCall: () => Promise<T>
    }
  ): Promise<T> => {
    const { type, resource, resourceId, payload, optimisticData, rollbackData, apiCall } = mutation
    
    // Increment vector clock for this mutation
    incrementClock()
    
    // Track pending mutation
    incrementPendingMutations()
    
    // Queue the mutation for offline support
    enqueue({
      type,
      resource,
      resourceId,
      payload,
      maxRetries: 5,
      optimisticData,
      rollbackData,
    })
    
    try {
      // Execute the actual API call
      const result = await apiCall()
      
      // On success, update sync manager with new version
      updateClock({ [useSyncManager.getState().nodeId]: Date.now() })
      
      // Decrement pending
      decrementPendingMutations()
      
      return result
    } catch (error) {
      // On failure, increment failed count
      incrementFailedMutations()
      decrementPendingMutations()
      
      // The offline queue will handle retries
      throw error
    }
  }, [enqueue, incrementClock, updateClock, incrementPendingMutations, decrementPendingMutations, incrementFailedMutations])
  
  const queueStatus = getQueueStatus()
  
  return {
    executeOptimistic,
    queueStatus,
    isProcessing: queueStatus.processing > 0,
    hasPending: queueStatus.pending > 0,
    hasFailed: queueStatus.failed > 0,
  }
}

// Export the main hook
export const useOptimisticUpdate = useOptimisticUpdateBase

// Specialized hooks for common patterns
export function useOptimisticCreate<T>(resource: string, apiCall: (data: T) => Promise<T>) {
  const { executeOptimistic } = useOptimisticUpdateBase()
  
  return useCallback(async (data: T, optimisticData: T) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return executeOptimistic({
      type: 'create',
      resource,
      resourceId: tempId,
      payload: data,
      optimisticData,
      rollbackData: undefined,
      apiCall: () => apiCall(data),
    })
  }, [executeOptimistic, resource, apiCall])
}

export function useOptimisticUpdateMutation<T>(resource: string, resourceId: string, apiCall: (id: string, data: T) => Promise<T>) {
  const { executeOptimistic } = useOptimisticUpdateBase()
  
  return useCallback(async (data: T, optimisticData: T, rollbackData: T) => {
    return executeOptimistic({
      type: 'update',
      resource,
      resourceId,
      payload: data,
      optimisticData,
      rollbackData,
      apiCall: () => apiCall(resourceId, data),
    })
  }, [executeOptimistic, resource, resourceId, apiCall])
}

export function useOptimisticDelete(resource: string, resourceId: string, apiCall: (id: string) => Promise<void>) {
  const { executeOptimistic } = useOptimisticUpdateBase()
  
  return useCallback(async (optimisticData: unknown, rollbackData: unknown) => {
    return executeOptimistic({
      type: 'delete',
      resource,
      resourceId,
      payload: { id: resourceId },
      optimisticData,
      rollbackData,
      apiCall: () => apiCall(resourceId),
    })
  }, [executeOptimistic, resource, resourceId, apiCall])
}