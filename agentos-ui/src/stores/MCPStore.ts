import { create } from 'zustand'
import type { MCPServer } from '../lib/mcp-data'

interface MCPState {
  selectedServer: MCPServer | null
  view: 'grid' | 'list'
  filter: { category: string; status: string; search: string }
  activeTab: string
  setSelectedServer: (server: MCPServer | null) => void
  setView: (view: 'grid' | 'list') => void
  setFilter: (filter: Partial<MCPState['filter']>) => void
  setActiveTab: (tab: string) => void
  toggleServer: (id: string) => void
}

export const useMCPStore = create<MCPState>((set) => ({
  selectedServer: null,
  view: 'grid',
  filter: { category: 'all', status: 'all', search: '' },
  activeTab: 'overview',
  setSelectedServer: (server) => set({ selectedServer: server }),
  setView: (view) => set({ view }),
  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleServer: (id) => set((s) => ({
    selectedServer: s.selectedServer?.id === id
      ? { ...s.selectedServer, status: s.selectedServer.status === 'connected' ? 'disconnected' : 'connected' }
      : s.selectedServer
  })),
}))