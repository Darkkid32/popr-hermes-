import { create } from 'zustand'

export interface WorkspaceDefinition {
  id: string
  name: string
  icon: string
  route: string
  group: 'machine-control' | 'organization' | 'security' | 'observability' | 'automation' | 'models' | 'memory' | 'plugins' | 'skills' | 'mcp'
  description: string
  order: number
  enabled: boolean
  roles?: string[]
  tabs?: Array<{ id: string; label: string; icon: string }>
  metadata?: Record<string, unknown>
}

interface WorkspaceRegistryState {
  workspaces: Map<string, WorkspaceDefinition>
  activeWorkspace: string | null
  registerWorkspace: (workspace: WorkspaceDefinition) => void
  unregisterWorkspace: (id: string) => void
  setActiveWorkspace: (id: string) => void
  getWorkspace: (id: string) => WorkspaceDefinition | undefined
  getAllWorkspaces: () => WorkspaceDefinition[]
  getWorkspacesByGroup: (group: WorkspaceDefinition['group']) => WorkspaceDefinition[]
  getWorkspaceOrder: () => WorkspaceDefinition[]
}

export const useWorkspaceRegistry = create<WorkspaceRegistryState>((set, get) => ({
  workspaces: new Map(),
  activeWorkspace: null,

  registerWorkspace: (workspace: WorkspaceDefinition) => {
    set((state) => {
      const newWorkspaces = new Map(state.workspaces)
      newWorkspaces.set(workspace.id, workspace)
      return { workspaces: newWorkspaces }
    })
  },

  unregisterWorkspace: (id: string) => {
    set((state) => {
      const newWorkspaces = new Map(state.workspaces)
      newWorkspaces.delete(id)
      return { workspaces: newWorkspaces }
    })
  },

  setActiveWorkspace: (id: string) => {
    set({ activeWorkspace: id })
  },

  getWorkspace: (id: string) => {
    return get().workspaces.get(id)
  },

  getAllWorkspaces: () => {
    return Array.from(get().workspaces.values())
  },

  getWorkspacesByGroup: (group: WorkspaceDefinition['group']) => {
    return Array.from(get().workspaces.values()).filter((w) => w.group === group)
  },

  getWorkspaceOrder: () => {
    return Array.from(get().workspaces.values()).sort((a, b) => a.order - b.order)
  },

  subscribe: (_listener: () => void) => {
    // Simple subscription mechanism
    return () => {}
  },
}))

export function registerWorkspace(workspace: WorkspaceDefinition) {
  useWorkspaceRegistry.getState().registerWorkspace(workspace)
}

export function unregisterWorkspace(id: string) {
  useWorkspaceRegistry.getState().unregisterWorkspace(id)
}

export function setActiveWorkspace(id: string) {
  useWorkspaceRegistry.getState().setActiveWorkspace(id)
}

export function getWorkspace(id: string) {
  return useWorkspaceRegistry.getState().getWorkspace(id)
}

export function getAllWorkspaces() {
  return useWorkspaceRegistry.getState().getAllWorkspaces()
}

export function getWorkspacesByGroup(group: WorkspaceDefinition['group']) {
  return useWorkspaceRegistry.getState().getWorkspacesByGroup(group)
}

export function getWorkspaceOrder() {
  return useWorkspaceRegistry.getState().getWorkspaceOrder()
}