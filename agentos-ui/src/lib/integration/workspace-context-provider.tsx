import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { WorkspaceDefinition } from './workspace-registry'
import type { NavigationItem } from './navigation-registry'
import { useWorkspaceRegistry, getAllWorkspaces } from './workspace-registry'
import { getNavigationItems } from './navigation-registry'

export interface WorkspaceContextState {
  currentWorkspace: WorkspaceDefinition | null
  workspaceTabs: NavigationItem[]
  availableWorkspaces: WorkspaceDefinition[]
  setCurrentWorkspace: (id: string) => void
  getWorkspaceTabs: (workspaceId: string) => NavigationItem[]
  isWorkspaceActive: (id: string) => boolean
  getWorkspaceByRoute: (route: string) => WorkspaceDefinition | undefined
}

const defaultWorkspaceContext: WorkspaceContextState = {
  currentWorkspace: null,
  workspaceTabs: [],
  availableWorkspaces: [],
  setCurrentWorkspace: () => {},
  getWorkspaceTabs: () => [],
  isWorkspaceActive: () => false,
  getWorkspaceByRoute: () => undefined,
}

export const WorkspaceContext = createContext<WorkspaceContextState | null>(null)

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceContextProvider')
  }
  return context
}

interface WorkspaceContextProviderProps {
  children: ReactNode
  initialWorkspace?: string
}

export function WorkspaceContextProvider({ children, initialWorkspace }: WorkspaceContextProviderProps) {
  const [state, setState] = useState<WorkspaceContextState>(defaultWorkspaceContext)

  // Initialize available workspaces
  useEffect(() => {
    const workspaces = getAllWorkspaces()
    const activeWorkspace = initialWorkspace
      ? workspaces.find(w => w.id === initialWorkspace) || workspaces[0]
      : workspaces[0]

    if (activeWorkspace) {
      setState((prev) => ({
        ...prev,
        availableWorkspaces: workspaces,
        currentWorkspace: activeWorkspace,
        workspaceTabs: getNavigationItems().filter(item => item.workspaceId === activeWorkspace.id),
      }))
    } else {
      setState((prev) => ({
        ...prev,
        availableWorkspaces: workspaces,
      }))
    }
  }, [initialWorkspace])

  // Listen for workspace registry changes
  useEffect(() => {
    const unsubscribe = useWorkspaceRegistry.subscribe(() => {
      const workspaces = getAllWorkspaces()
      setState((prev) => ({
        ...prev,
        availableWorkspaces: workspaces,
        currentWorkspace: prev.currentWorkspace || workspaces[0],
        workspaceTabs: prev.currentWorkspace
          ? getNavigationItems().filter(item => item.workspaceId === prev.currentWorkspace!.id)
          : [],
      }))
    })
    return unsubscribe
  }, [])

  const setCurrentWorkspace = (id: string) => {
    const workspace = useWorkspaceRegistry.getState().getWorkspace(id)
    if (workspace) {
      setState((prev) => ({
        ...prev,
        currentWorkspace: workspace,
        workspaceTabs: getNavigationItems().filter(item => item.workspaceId === id),
      }))
    }
  }

  const getWorkspaceTabs = (workspaceId: string) => {
    return getNavigationItems().filter(item => item.workspaceId === workspaceId)
  }

  const isWorkspaceActive = (id: string) => {
    return state.currentWorkspace?.id === id
  }

  const getWorkspaceByRoute = (route: string) => {
    return getAllWorkspaces().find(w => route.startsWith(w.route))
  }

  return (
    <WorkspaceContext.Provider
      value={{
        ...state,
        setCurrentWorkspace,
        getWorkspaceTabs,
        isWorkspaceActive,
        getWorkspaceByRoute,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaceContextState() {
  return useWorkspaceContext()
}