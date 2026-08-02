import { create } from 'zustand'
import type { MemoryNote } from '../lib/memory-data'

interface MemoryState {
  selectedNote: MemoryNote | null
  view: 'list' | 'grid'
  filter: { source: string; tag: string; search: string }
  activeTab: string
  setSelectedNote: (note: MemoryNote | null) => void
  setView: (view: 'list' | 'grid') => void
  setFilter: (filter: Partial<MemoryState['filter']>) => void
  setActiveTab: (tab: string) => void
}

export const useMemoryStore = create<MemoryState>((set) => ({
  selectedNote: null,
  view: 'list',
  filter: { source: 'all', tag: 'all', search: '' },
  activeTab: 'recent',
  setSelectedNote: (note) => set({ selectedNote: note }),
  setView: (view) => set({ view }),
  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))