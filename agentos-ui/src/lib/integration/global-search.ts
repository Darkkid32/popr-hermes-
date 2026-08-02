import { create } from 'zustand'
import type { SearchResult } from './command-palette'
import { performGlobalSearch } from './command-palette'

export interface GlobalSearchState {
  isOpen: boolean
  query: string
  results: SearchResult[]
  selectedIndex: number
  recentSearches: string[]
  open: () => void
  close: () => void
  setQuery: (query: string) => void
  setSelectedIndex: (index: number) => void
  executeSelected: () => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

export const useGlobalSearch = create<GlobalSearchState>((set, get) => ({
  isOpen: false,
  query: '',
  results: [],
  selectedIndex: 0,
  recentSearches: [],

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
      get().addRecentSearch(get().query)
      close()
    }
  },

  addRecentSearch: (query: string) => {
    if (!query.trim()) return
    set((state) => ({
      recentSearches: [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 10),
    }))
  },

  clearRecentSearches: () => set({ recentSearches: [] }),
}))

export function useGlobalSearchState() {
  return useGlobalSearch()
}