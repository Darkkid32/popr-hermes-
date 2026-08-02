import { create } from 'zustand'
import type { ReactNode } from 'react'

export interface ModalConfig {
  id: string
  title: string
  content: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  footer?: ReactNode
  onClose?: () => void
  onConfirm?: () => void
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'alert' | 'confirm' | 'form'
}

interface ModalManagerState {
  modals: ModalConfig[]
  openModal: (modal: Omit<ModalConfig, 'id'> & { id?: string }) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  updateModal: (id: string, updates: Partial<ModalConfig>) => void
}

let modalIdCounter = 0

export const useModalManager = create<ModalManagerState>((set) => ({
  modals: [],

  openModal: (modal) => {
    const id = modal.id || `modal-${++modalIdCounter}`
    const newModal: ModalConfig = {
      id,
      closable: true,
      closeOnOverlayClick: true,
      showCloseButton: true,
      variant: 'default',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      ...modal,
    }
    set((state) => ({ modals: [...state.modals, newModal] }))
    return id
  },

  closeModal: (id: string) => {
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    }))
  },

  closeAllModals: () => {
    set({ modals: [] })
  },

  updateModal: (id: string, updates: Partial<ModalConfig>) => {
    set((state) => ({
      modals: state.modals.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }))
  },
}))

export function useModalManagerState() {
  return useModalManager()
}

export function openModal(modal: Omit<ModalConfig, 'id'> & { id?: string }) {
  return useModalManager.getState().openModal(modal)
}

export function closeModal(id: string) {
  useModalManager.getState().closeModal(id)
}

export function closeAllModals() {
  useModalManager.getState().closeAllModals()
}

export function updateModal(id: string, updates: Partial<ModalConfig>) {
  useModalManager.getState().updateModal(id, updates)
}