import { create } from 'zustand'
import type { ReactNode } from 'react'

export interface DialogConfig {
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

interface DialogManagerState {
  dialogs: DialogConfig[]
  openDialog: (dialog: Omit<DialogConfig, 'id'> & { id?: string }) => string
  closeDialog: (id: string) => void
  closeAllDialogs: () => void
  updateDialog: (id: string, updates: Partial<DialogConfig>) => void
}

let dialogIdCounter = 0

export const useDialogManager = create<DialogManagerState>((set) => ({
  dialogs: [],

  openDialog: (dialog) => {
    const id = dialog.id || `dialog-${++dialogIdCounter}`
    const newDialog: DialogConfig = {
      id,
      closable: true,
      closeOnOverlayClick: true,
      showCloseButton: true,
      variant: 'default',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      ...dialog,
    }
    set((state) => ({ dialogs: [...state.dialogs, newDialog] }))
    return id
  },

  closeDialog: (id: string) => {
    set((state) => ({
      dialogs: state.dialogs.filter((d) => d.id !== id),
    }))
  },

  closeAllDialogs: () => {
    set({ dialogs: [] })
  },

  updateDialog: (id: string, updates: Partial<DialogConfig>) => {
    set((state) => ({
      dialogs: state.dialogs.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }))
  },
}))

export function useDialogManagerState() {
  return useDialogManager()
}

export function openDialog(dialog: Omit<DialogConfig, 'id'> & { id?: string }) {
  return useDialogManager.getState().openDialog(dialog)
}

export function closeDialog(id: string) {
  useDialogManager.getState().closeDialog(id)
}

export function closeAllDialogs() {
  useDialogManager.getState().closeAllDialogs()
}

export function updateDialog(id: string, updates: Partial<DialogConfig>) {
  useDialogManager.getState().updateDialog(id, updates)
}

export function confirmDialog(
  title: string,
  message: ReactNode,
  onConfirm: () => void,
  options?: { confirmLabel?: string; cancelLabel?: string; variant?: 'alert' | 'confirm' }
): string {
  return useDialogManager.getState().openDialog({
    title,
    content: message,
    variant: options?.variant || 'confirm',
    confirmLabel: options?.confirmLabel || 'Confirm',
    cancelLabel: options?.cancelLabel || 'Cancel',
    onConfirm,
    onClose: undefined,
    size: 'md',
  })
}

export function alertDialog(
  title: string,
  message: ReactNode,
  onClose?: () => void
): string {
  return useDialogManager.getState().openDialog({
    title,
    content: message,
    variant: 'alert',
    confirmLabel: 'OK',
    cancelLabel: undefined,
    onConfirm: onClose,
    size: 'md',
  })
}

export function promptDialog(
  title: string,
  message: ReactNode,
  _onConfirm: (value: string) => void,
  _defaultValue: string = '',
  options?: { confirmLabel?: string; cancelLabel?: string; placeholder?: string }
): string {
  // This would need a more complex implementation with form state
  return useDialogManager.getState().openDialog({
    title,
    content: message,
    variant: 'form',
    confirmLabel: options?.confirmLabel || 'Submit',
    cancelLabel: options?.cancelLabel || 'Cancel',
    onConfirm: () => {
      // The form would need to be handled separately
      console.warn('promptDialog requires custom form implementation')
    },
    size: 'md',
  })
}