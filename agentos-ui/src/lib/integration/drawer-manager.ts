import { create } from 'zustand'
import type { ReactNode } from 'react'

export interface DrawerConfig {
  id: string
  title: string
  content: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  position?: 'left' | 'right' | 'top' | 'bottom'
  closable?: boolean
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  footer?: ReactNode
  onClose?: () => void
}

interface DrawerManagerState {
  drawers: DrawerConfig[]
  openDrawer: (drawer: Omit<DrawerConfig, 'id'> & { id?: string }) => string
  closeDrawer: (id: string) => void
  closeAllDrawers: () => void
  updateDrawer: (id: string, updates: Partial<DrawerConfig>) => void
  isDrawerOpen: (id: string) => boolean
}

let drawerIdCounter = 0

export const useDrawerManager = create<DrawerManagerState>((set, get) => ({
  drawers: [],

  openDrawer: (drawer) => {
    const id = drawer.id || `drawer-${++drawerIdCounter}`
    const newDrawer: DrawerConfig = {
      id,
      closable: true,
      closeOnOverlayClick: true,
      showCloseButton: true,
      position: 'right',
      size: 'md',
      ...drawer,
    }
    set((state) => ({ drawers: [...state.drawers, newDrawer] }))
    return id
  },

  closeDrawer: (id: string) => {
    set((state) => ({
      drawers: state.drawers.filter((d) => d.id !== id),
    }))
  },

  closeAllDrawers: () => {
    set({ drawers: [] })
  },

  updateDrawer: (id: string, updates: Partial<DrawerConfig>) => {
    set((state) => ({
      drawers: state.drawers.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }))
  },

  isDrawerOpen: (id: string) => {
    return get().drawers.some((d) => d.id === id)
  },
}))

export function useDrawerManagerState() {
  return useDrawerManager()
}

export function openDrawer(drawer: Omit<DrawerConfig, 'id'> & { id?: string }) {
  return useDrawerManager.getState().openDrawer(drawer)
}

export function closeDrawer(id: string) {
  useDrawerManager.getState().closeDrawer(id)
}

export function closeAllDrawers() {
  useDrawerManager.getState().closeAllDrawers()
}

export function updateDrawer(id: string, updates: Partial<DrawerConfig>) {
  useDrawerManager.getState().updateDrawer(id, updates)
}

export function isDrawerOpen(id: string) {
  return useDrawerManager.getState().isDrawerOpen(id)
}