import { create } from 'zustand'
import type { Model, ModelProvider, ModelRoutingRule, ModelEndpoint } from '../lib/models-data'

interface ModelsState {
  selectedProvider: string | null
  selectedModel: Model | null
  view: 'grid' | 'list'
  filter: { provider: string; type: string; status: string; search: string }
  routingRules: ModelRoutingRule[]
  endpoints: ModelEndpoint[]
  providers: ModelProvider[]
  setSelectedProvider: (id: string | null) => void
  setSelectedModel: (model: Model | null) => void
  setView: (view: 'grid' | 'list') => void
  setFilter: (filter: Partial<ModelsState['filter']>) => void
  addRoutingRule: (rule: ModelRoutingRule) => void
  updateRoutingRule: (id: string, rule: Partial<ModelRoutingRule>) => void
  deleteRoutingRule: (id: string) => void
  reorderRoutingRules: (rules: ModelRoutingRule[]) => void
  testEndpoint: (endpointId: string) => Promise<void>
}

export const useModelsStore = create<ModelsState>((set) => ({
  selectedProvider: null,
  selectedModel: null,
  view: 'grid',
  filter: { provider: 'all', type: 'all', status: 'all', search: '' },
  routingRules: [],
  endpoints: [],
  providers: [],
  setSelectedProvider: (id) => set({ selectedProvider: id }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setView: (view) => set({ view }),
  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),
  addRoutingRule: (rule) => set((s) => ({ routingRules: [...s.routingRules, rule] })),
  updateRoutingRule: (id, rule) =>
    set((s) => ({ routingRules: s.routingRules.map((r) => (r.id === id ? { ...r, ...rule } : r)) })),
  deleteRoutingRule: (id) => set((s) => ({ routingRules: s.routingRules.filter((r) => r.id !== id) })),
  reorderRoutingRules: (rules) => set({ routingRules: rules }),
  testEndpoint: async (endpointId) => {
    // Mock test - in real app would call health check endpoint
    await new Promise((resolve) => setTimeout(resolve, 500))
    set((s) => ({
      endpoints: s.endpoints.map((e) =>
        e.id === endpointId ? { ...e, status: 'healthy' as const, latency: `${Math.floor(Math.random() * 200) + 200}ms` } : e
      ),
    }))
  },
}))