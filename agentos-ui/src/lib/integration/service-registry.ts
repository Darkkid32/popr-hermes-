import { create } from 'zustand'
import type { ServiceRegistration } from './api-client'

export interface PlatformService extends ServiceRegistration {
  status: 'registered' | 'active' | 'degraded' | 'offline'
  lastHealthCheck?: number
  registeredAt: number
}

interface ServiceRegistryState {
  services: Map<string, PlatformService>
  apiClient: ReturnType<typeof import('./api-client').createApiClient>
  registerService: (service: ServiceRegistration) => void
  unregisterService: (id: string) => void
  updateServiceStatus: (id: string, status: PlatformService['status']) => void
  getService: (id: string) => PlatformService | undefined
  getServicesByCapability: (capability: string) => PlatformService[]
  getAllServices: () => PlatformService[]
  setApiClient: (client: ReturnType<typeof import('./api-client').createApiClient>) => void
}

export const useServiceRegistry = create<ServiceRegistryState>((set, get) => ({
  services: new Map(),
  apiClient: null as any,

  registerService: (service: ServiceRegistration) => {
    const platformService: PlatformService = {
      ...service,
      status: 'registered',
      registeredAt: Date.now(),
    }
    set((state) => {
      const newServices = new Map(state.services)
      newServices.set(service.id, platformService)
      return { services: newServices }
    })
  },

  unregisterService: (id: string) => {
    set((state) => {
      const newServices = new Map(state.services)
      newServices.delete(id)
      return { services: newServices }
    })
  },

  updateServiceStatus: (id: string, status: PlatformService['status']) => {
    set((state) => {
      const service = state.services.get(id)
      if (!service) return state
      const newServices = new Map(state.services)
      newServices.set(id, { ...service, status, lastHealthCheck: Date.now() })
      return { services: newServices }
    })
  },

  getService: (id: string) => {
    return get().services.get(id)
  },

  getServicesByCapability: (capability: string) => {
    return Array.from(get().services.values()).filter((s) =>
      s.capabilities.includes(capability)
    )
  },

  getAllServices: () => {
    return Array.from(get().services.values())
  },

  setApiClient: (client: ReturnType<typeof import('./api-client').createApiClient>) => {
    set({ apiClient: client })
  },
}))

export function registerPlatformService(service: ServiceRegistration) {
  useServiceRegistry.getState().registerService(service)
}

export function unregisterPlatformService(id: string) {
  useServiceRegistry.getState().unregisterService(id)
}

export function getPlatformService(id: string) {
  return useServiceRegistry.getState().getService(id)
}

export function getAllPlatformServices() {
  return useServiceRegistry.getState().getAllServices()
}

export function getServicesByCapability(capability: string) {
  return useServiceRegistry.getState().getServicesByCapability(capability)
}