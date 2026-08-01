import { create } from 'zustand'

export interface Toast {
  id: number
  title: string
  message: string
  tone: 'info' | 'success' | 'error'
  ttl: number
}

interface UIState {
  toasts: Toast[]
  newAgentOpen: boolean
  drawerContent: { kind: 'goal' | 'workflow' | 'alert' | 'memory' | null; id: string | null }
  pushToast: (t: Omit<Toast, 'id' | 'ttl'> & { ttl?: number }) => void
  dismissToast: (id: number) => void
  setNewAgentOpen: (open: boolean) => void
  openDrawer: (kind: NonNullable<UIState['drawerContent']['kind']>, id: string) => void
  closeDrawer: () => void
}

let toastId = 1

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  newAgentOpen: false,
  drawerContent: { kind: null, id: null },
  pushToast: (t) => {
    const id = toastId++
    const ttl = t.ttl ?? 4000
    set((s) => ({ toasts: [...s.toasts, { id, title: t.title, message: t.message, tone: t.tone, ttl }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), ttl)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  setNewAgentOpen: (open) => set({ newAgentOpen: open }),
  openDrawer: (kind, id) => set({ drawerContent: { kind, id } }),
  closeDrawer: () => set({ drawerContent: { kind: null, id: null } }),
}))