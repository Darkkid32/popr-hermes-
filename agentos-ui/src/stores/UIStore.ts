import { create } from 'zustand'

export interface Toast {
  id: number
  title: string
  message: string
  tone: 'info' | 'success' | 'error'
  ttl: number
}

interface UIState {
  // Toasts
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id' | 'ttl'> & { ttl?: number }) => void
  dismissToast: (id: number) => void

  // Modals
  newAgentOpen: boolean
  setNewAgentOpen: (open: boolean) => void

  // Drawer
  drawerContent: { kind: 'goal' | 'workflow' | 'alert' | 'memory' | null; id: string | null }
  openDrawer: (kind: NonNullable<UIState['drawerContent']['kind']>, id: string) => void
  closeDrawer: () => void

  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  toggleSidebarCollapsed: () => void

  // Theme
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void

  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
}

let toastId = 1

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  pushToast: (t) => {
    const id = toastId++
    const ttl = t.ttl ?? 4000
    set((s) => ({ toasts: [...s.toasts, { id, title: t.title, message: t.message, tone: t.tone, ttl }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), ttl)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),

  newAgentOpen: false,
  setNewAgentOpen: (open) => set({ newAgentOpen: open }),

  drawerContent: { kind: null, id: null },
  openDrawer: (kind, id) => set({ drawerContent: { kind, id } }),
  closeDrawer: () => set({ drawerContent: { kind: null, id: null } }),

  sidebarOpen: true,
  sidebarCollapsed: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  themeMode: 'system',
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleTheme: () => set((s) => ({
    themeMode: s.themeMode === 'dark' ? 'light' : s.themeMode === 'light' ? 'system' : 'dark',
  })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}))
