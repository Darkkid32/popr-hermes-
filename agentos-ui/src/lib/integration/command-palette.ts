import { create } from 'zustand'
import { useNavigationRegistry } from './navigation-registry'
import { getAllWorkspaces } from './workspace-registry'

export interface CommandPaletteAction {
  id: string
  label: string
  description?: string
  icon?: string
  keywords: string[]
  action: () => void
  group: string
  shortcut?: string
}

export interface SearchResult {
  id: string
  type: 'navigation' | 'action' | 'workspace' | 'document'
  title: string
  description?: string
  icon?: string
  route?: string
  action?: () => void
  score: number
  metadata?: Record<string, unknown>
}

interface CommandPaletteState {
  isOpen: boolean
  query: string
  selectedIndex: number
  results: SearchResult[]
  recentActions: string[]
  open: () => void
  close: () => void
  setQuery: (query: string) => void
  setSelectedIndex: (index: number) => void
  executeSelected: () => void
  registerAction: (action: CommandPaletteAction) => void
  unregisterAction: (id: string) => void
  addRecentAction: (actionId: string) => void
}

const builtInActions: CommandPaletteAction[] = [
  {
    id: 'new-agent',
    label: 'New Agent',
    description: 'Connect a new agent runtime',
    icon: '+',
    keywords: ['new', 'agent', 'connect', 'runtime', 'add'],
    action: () => {
      // This will be handled by the UIStore
    },
    group: 'Agents',
    shortcut: 'Ctrl+N',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Open system settings',
    icon: '⚙',
    keywords: ['settings', 'preferences', 'config', 'configure'],
    action: () => {
      window.location.hash = '/settings'
    },
    group: 'System',
    shortcut: 'Ctrl+,',
  },
  {
    id: 'command-palette',
    label: 'Command Palette',
    description: 'Show all available commands',
    icon: '⌘',
    keywords: ['command', 'palette', 'shortcuts', 'help'],
    action: () => {
      // Toggle handled by UI
    },
    group: 'System',
    shortcut: 'Ctrl+K',
  },
  {
    id: 'search',
    label: 'Global Search',
    description: 'Search across all workspaces',
    icon: '⌕',
    keywords: ['search', 'find', 'query'],
    action: () => {
      // Focus search
    },
    group: 'System',
    shortcut: 'Ctrl+Shift+F',
  },
  {
    id: 'logs',
    label: 'View Logs',
    description: 'Open runtime logs',
    icon: '📋',
    keywords: ['logs', 'log', 'debug', 'errors'],
    action: () => {
      window.location.hash = '/logs'
    },
    group: 'Observability',
    shortcut: 'Ctrl+L',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    description: 'View active alerts',
    icon: '⚠',
    keywords: ['alerts', 'alert', 'incidents', 'issues'],
    action: () => {
      window.location.hash = '/alerts'
    },
    group: 'Security',
    shortcut: 'Ctrl+Shift+A',
  },
]

let customActions: CommandPaletteAction[] = []

export function registerCommandPaletteAction(action: CommandPaletteAction) {
  const existingIndex = customActions.findIndex(a => a.id === action.id)
  if (existingIndex >= 0) {
    customActions[existingIndex] = action
  } else {
    customActions.push(action)
  }
}

export function unregisterCommandPaletteAction(id: string) {
  customActions = customActions.filter(a => a.id !== id)
}

function searchNavigationItems(query: string): SearchResult[] {
  const items = useNavigationRegistry.getState().getNavigationItems()
  const lowerQuery = query.toLowerCase()

  return items
    .filter(item =>
      item.label.toLowerCase().includes(lowerQuery) ||
      item.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    )
    .map(item => ({
      id: item.id,
      type: 'navigation' as const,
      title: item.label,
      description: item.route,
      icon: item.icon,
      route: item.route,
      score: item.label.toLowerCase().startsWith(lowerQuery) ? 100 : 50,
      metadata: { group: item.group, workspaceId: item.workspaceId },
    }))
}

function searchWorkspaces(query: string): SearchResult[] {
  const workspaces = getAllWorkspaces()
  const lowerQuery = query.toLowerCase()

  return workspaces
    .filter(ws =>
      ws.name.toLowerCase().includes(lowerQuery) ||
      ws.description.toLowerCase().includes(lowerQuery)
    )
    .map(ws => ({
      id: ws.id,
      type: 'workspace' as const,
      title: ws.name,
      description: ws.description,
      icon: ws.icon,
      route: ws.route,
      score: ws.name.toLowerCase().startsWith(lowerQuery) ? 90 : 40,
      metadata: { group: ws.group },
    }))
}

function searchActions(query: string): SearchResult[] {
  const allActions = [...builtInActions, ...customActions]
  const lowerQuery = query.toLowerCase()

  return allActions
    .filter(action =>
      action.label.toLowerCase().includes(lowerQuery) ||
      action.description?.toLowerCase().includes(lowerQuery) ||
      action.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    )
    .map(action => ({
      id: action.id,
      type: 'action' as const,
      title: action.label,
      description: action.description,
      icon: action.icon,
      action: action.action,
      score: action.label.toLowerCase().startsWith(lowerQuery) ? 100 : 60,
      metadata: { group: action.group, shortcut: action.shortcut },
    }))
}

export function performGlobalSearch(query: string): SearchResult[] {
  if (!query.trim()) return []

  const results = [
    ...searchNavigationItems(query),
    ...searchWorkspaces(query),
    ...searchActions(query),
  ]

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

export const useCommandPalette = create<CommandPaletteState>((set, get) => ({
  isOpen: false,
  query: '',
  selectedIndex: 0,
  results: [],
  recentActions: [],

  open: () => set({ isOpen: true, query: '', selectedIndex: 0, results: [] }),

  close: () => set({ isOpen: false, query: '', selectedIndex: 0, results: [] }),

  setQuery: (query: string) => {
    const results = performGlobalSearch(query)
    set({ query, results, selectedIndex: 0 })
  },

  setSelectedIndex: (index: number) => {
    const { results } = get()
    if (index >= 0 && index < results.length) {
      set({ selectedIndex: index })
    }
  },

  executeSelected: () => {
    const { results, selectedIndex, close } = get()
    const selected = results[selectedIndex]
    if (selected) {
      if (selected.action) {
        selected.action()
      } else if (selected.route) {
        window.location.hash = selected.route
      }
      if (selected.type === 'action') {
        get().addRecentAction(selected.id)
      }
      close()
    }
  },

  registerAction: (action: CommandPaletteAction) => {
    const existingIndex = customActions.findIndex(a => a.id === action.id)
    if (existingIndex >= 0) {
      customActions[existingIndex] = action
    } else {
      customActions.push(action)
    }
  },

  unregisterAction: (id: string) => {
    customActions = customActions.filter(a => a.id !== id)
  },

  addRecentAction: (actionId: string) => {
    set((state) => ({
      recentActions: [actionId, ...state.recentActions.filter(id => id !== actionId)].slice(0, 10),
    }))
  },
}))

export function useCommandPaletteState() {
  return useCommandPalette()
}