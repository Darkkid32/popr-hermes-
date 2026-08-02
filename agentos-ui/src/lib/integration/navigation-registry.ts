import { create } from 'zustand'
import type { WorkspaceDefinition } from './workspace-registry'

export interface NavigationItem {
  id: string
  label: string
  icon: string
  route: string
  workspaceId: string
  group: WorkspaceDefinition['group']
  order: number
  badge?: { label: string; tone: 'green' | 'cyan' | 'purple' | 'amber' | 'red' | 'gray' | 'pink' }
  children?: NavigationItem[]
  badgeCount?: number
  keywords?: string[]
}

interface NavigationRegistryState {
  items: NavigationItem[]
  activeItem: string | null
  expandedGroups: Set<string>
  registerNavigationItem: (item: NavigationItem) => void
  unregisterNavigationItem: (id: string) => void
  setActiveItem: (id: string) => void
  toggleGroupExpanded: (group: string) => void
  getNavigationItems: () => NavigationItem[]
  getItemsByGroup: (group: WorkspaceDefinition['group']) => NavigationItem[]
  getActiveItem: () => NavigationItem | undefined
  updateBadge: (id: string, badge: NavigationItem['badge']) => void
  updateBadgeCount: (id: string, count: number) => void
}

export const useNavigationRegistry = create<NavigationRegistryState>((set, get) => ({
  items: [],
  activeItem: null,
  expandedGroups: new Set(),

  registerNavigationItem: (item: NavigationItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === item.id)
      const newItems = existingIndex >= 0
        ? [...state.items.slice(0, existingIndex), item, ...state.items.slice(existingIndex + 1)]
        : [...state.items, item].sort((a, b) => a.order - b.order)
      return { items: newItems }
    })
  },

  unregisterNavigationItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }))
  },

  setActiveItem: (id: string) => {
    set({ activeItem: id })
  },

  toggleGroupExpanded: (group: string) => {
    set((state) => {
      const newExpanded = new Set(state.expandedGroups)
      if (newExpanded.has(group)) {
        newExpanded.delete(group)
      } else {
        newExpanded.add(group)
      }
      return { expandedGroups: newExpanded }
    })
  },

  getNavigationItems: () => get().items,

  getItemsByGroup: (group: WorkspaceDefinition['group']) => {
    return get().items.filter((i) => i.group === group)
  },

  getActiveItem: () => {
    const { items, activeItem } = get()
    return items.find((i) => i.id === activeItem)
  },

  updateBadge: (id: string, badge: NavigationItem['badge']) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, badge } : i
      ),
    }))
  },

  updateBadgeCount: (id: string, count: number) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, badgeCount: count } : i
      ),
    }))
  },

  subscribe: (_listener: () => void) => {
    return () => {}
  },
}))

export function registerNavigationItem(item: NavigationItem) {
  useNavigationRegistry.getState().registerNavigationItem(item)
}

export function unregisterNavigationItem(id: string) {
  useNavigationRegistry.getState().unregisterNavigationItem(id)
}

export function setActiveNavigationItem(id: string) {
  useNavigationRegistry.getState().setActiveItem(id)
}

export function getNavigationItems() {
  return useNavigationRegistry.getState().getNavigationItems()
}

export function getNavigationItemsByGroup(group: WorkspaceDefinition['group']) {
  return useNavigationRegistry.getState().getItemsByGroup(group)
}

export function getActiveNavigationItem() {
  return useNavigationRegistry.getState().getActiveItem()
}

export function updateNavigationBadge(id: string, badge: NavigationItem['badge']) {
  useNavigationRegistry.getState().updateBadge(id, badge)
}

export function updateNavigationBadgeCount(id: string, count: number) {
  useNavigationRegistry.getState().updateBadgeCount(id, count)
}