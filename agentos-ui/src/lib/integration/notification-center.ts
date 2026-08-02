import { create } from 'zustand'
import { useUIStore } from '../../stores/UIStore'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  timestamp: number
  read: boolean
  persistent?: boolean
  action?: { label: string; onClick: () => void }
  source?: string
  tags?: string[]
}

interface NotificationCenterState {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  filters: { type?: Notification['type']; source?: string; unreadOnly?: boolean }
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  setOpen: (open: boolean) => void
  setFilters: (filters: Partial<NotificationCenterState['filters']>) => void
  getFilteredNotifications: () => Notification[]
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useNotificationCenter = create<NotificationCenterState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  filters: {},

  addNotification: (notification) => {
    const id = generateId()
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false,
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
    // Also push to UIStore toast for immediate visibility
    useUIStore.getState().pushToast({
      title: notification.title,
      message: notification.message || '',
      tone: notification.type === 'error' ? 'error' : notification.type === 'success' ? 'success' : 'info',
    })
    return id
  },

  markAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id)?.read
        ? state.unreadCount
        : Math.max(0, state.unreadCount - 1),
    }))
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 })
  },

  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
  },

  getFilteredNotifications: () => {
    const { notifications, filters } = get()
    return notifications.filter((n) => {
      if (filters.type && n.type !== filters.type) return false
      if (filters.source && n.source !== filters.source) return false
      if (filters.unreadOnly && n.read) return false
      return true
    })
  },
}))

export function useNotificationCenterState() {
  return useNotificationCenter()
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  return useNotificationCenter.getState().addNotification(notification)
}

export function addInfoNotification(title: string, message?: string, options?: Partial<Notification>) {
  return addNotification({ type: 'info', title, message, ...options })
}

export function addSuccessNotification(title: string, message?: string, options?: Partial<Notification>) {
  return addNotification({ type: 'success', title, message, ...options })
}

export function addWarningNotification(title: string, message?: string, options?: Partial<Notification>) {
  return addNotification({ type: 'warning', title, message, ...options })
}

export function addErrorNotification(title: string, message?: string, options?: Partial<Notification>) {
  return addNotification({ type: 'error', title, message, ...options })
}