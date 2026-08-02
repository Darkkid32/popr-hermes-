import { create } from 'zustand'

export interface LoadingState {
  id: string
  message?: string
  progress?: number
  indeterminate?: boolean
}

interface LoadingManagerState {
  loadingStates: Map<string, LoadingState>
  globalLoading: boolean
  globalMessage?: string
  startLoading: (id: string, message?: string, indeterminate?: boolean) => void
  updateProgress: (id: string, progress: number, message?: string) => void
  stopLoading: (id: string) => void
  setGlobalLoading: (loading: boolean, message?: string) => void
  getLoadingState: (id: string) => LoadingState | undefined
  isLoading: (id: string) => boolean
  isAnyLoading: () => boolean
}

export const useLoadingManager = create<LoadingManagerState>((set, get) => ({
  loadingStates: new Map(),
  globalLoading: false,

  startLoading: (id: string, message?: string, indeterminate = true) => {
    set((state) => {
      const newStates = new Map(state.loadingStates)
      newStates.set(id, { id, message, indeterminate, progress: indeterminate ? undefined : 0 })
      return { loadingStates: newStates }
    })
  },

  updateProgress: (id: string, progress: number, message?: string) => {
    set((state) => {
      const existing = state.loadingStates.get(id)
      if (!existing) return state
      const newStates = new Map(state.loadingStates)
      newStates.set(id, { ...existing, progress: Math.max(0, Math.min(100, progress)), message })
      return { loadingStates: newStates }
    })
  },

  stopLoading: (id: string) => {
    set((state) => {
      const newStates = new Map(state.loadingStates)
      newStates.delete(id)
      return { loadingStates: newStates }
    })
  },

  setGlobalLoading: (loading: boolean, message?: string) => {
    set({ globalLoading: loading, globalMessage: message })
  },

  getLoadingState: (id: string) => {
    return get().loadingStates.get(id)
  },

  isLoading: (id: string) => {
    return get().loadingStates.has(id)
  },

  isAnyLoading: () => {
    return get().globalLoading || get().loadingStates.size > 0
  },
}))

export function useLoadingManagerState() {
  return useLoadingManager()
}

export function startLoading(id: string, message?: string, indeterminate?: boolean) {
  useLoadingManager.getState().startLoading(id, message, indeterminate)
}

export function updateLoadingProgress(id: string, progress: number, message?: string) {
  useLoadingManager.getState().updateProgress(id, progress, message)
}

export function stopLoading(id: string) {
  useLoadingManager.getState().stopLoading(id)
}

export function setGlobalLoading(loading: boolean, message?: string) {
  useLoadingManager.getState().setGlobalLoading(loading, message)
}