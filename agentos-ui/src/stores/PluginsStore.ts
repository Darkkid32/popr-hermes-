import { create } from 'zustand'
import type { Plugin } from '../lib/plugins-data'

interface PluginsState {
  selectedPlugin: Plugin | null
  view: 'grid' | 'list'
  filter: { category: string; status: string; search: string }
  activeTab: string
  setSelectedPlugin: (plugin: Plugin | null) => void
  setView: (view: 'grid' | 'list') => void
  setFilter: (filter: Partial<PluginsState['filter']>) => void
  setActiveTab: (tab: string) => void
  togglePlugin: (id: string) => void
}

export const usePluginsStore = create<PluginsState>((set) => ({
  selectedPlugin: null,
  view: 'grid',
  filter: { category: 'all', status: 'all', search: '' },
  activeTab: 'overview',
  setSelectedPlugin: (plugin) => set({ selectedPlugin: plugin }),
  setView: (view) => set({ view }),
  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  togglePlugin: (id) => set((s) => ({
    selectedPlugin: s.selectedPlugin?.id === id
      ? { ...s.selectedPlugin, status: s.selectedPlugin.status === 'enabled' ? 'disabled' : 'enabled' }
      : s.selectedPlugin
  })),
}))