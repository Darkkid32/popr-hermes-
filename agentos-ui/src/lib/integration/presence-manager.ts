import { create } from 'zustand'
import { emitEvent } from './event-bus'

export interface PresenceUser {
  id: string
  name: string
  avatar: string
  color: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen: number
  cursor?: { x: number; y: number; element?: string }
  metadata?: Record<string, unknown>
}

export interface PresenceState {
  users: Map<string, PresenceUser>
  localUser: PresenceUser | null
  channel: string | null
  ttl: number
  cleanupTimer: ReturnType<typeof setInterval> | null
  setLocalUser: (user: PresenceUser) => void
  joinChannel: (channel: string) => void
  leaveChannel: () => void
  updatePresence: (updates: Partial<PresenceUser>) => void
  updateCursor: (cursor: { x: number; y: number; element?: string }) => void
  handleRemotePresence: (event: { type: string; payload: unknown }) => void
  startCleanup: () => void
  stopCleanup: () => void
}

const DEFAULT_TTL = 30000
const CLEANUP_INTERVAL = 10000

export const usePresenceManager = create<PresenceState>((set, get) => ({
  users: new Map(),
  localUser: null,
  channel: null,
  ttl: DEFAULT_TTL,
  cleanupTimer: null,
  
  setLocalUser: (user: PresenceUser) => {
    set({ localUser: { ...user, lastSeen: Date.now() } })
    // Broadcast presence join
    const { channel } = get()
    if (channel) {
      emitEvent('presence:join', { channel, user: get().localUser })
    }
  },
  
  joinChannel: (channel: string) => {
    const { localUser, channel: currentChannel } = get()
    if (currentChannel === channel) return
    
    // Leave current channel first
    if (currentChannel && localUser) {
      emitEvent('presence:leave', { channel: currentChannel, userId: localUser.id })
    }
    
    set({ channel })
    
    // Join new channel
    if (localUser) {
      emitEvent('presence:join', { channel, user: localUser })
    }
    
    // Start cleanup timer
    get().startCleanup()
  },
  
  leaveChannel: () => {
    const { localUser, channel } = get()
    if (channel && localUser) {
      emitEvent('presence:leave', { channel, userId: localUser.id })
    }
    set({ channel: null, users: new Map() })
    get().stopCleanup()
  },
  
  updatePresence: (updates: Partial<PresenceUser>) => {
    const { localUser, channel } = get()
    if (!localUser) return
    
    const updatedUser = { ...localUser, ...updates, lastSeen: Date.now() }
    set({ localUser: updatedUser })
    
    if (channel) {
      emitEvent('presence:update', { channel, user: updatedUser })
    }
  },
  
  updateCursor: (cursor: { x: number; y: number; element?: string }) => {
    const { localUser, channel } = get()
    if (!localUser) return
    
    const updatedUser = { ...localUser, cursor, lastSeen: Date.now() }
    set({ localUser: updatedUser })
    
    if (channel) {
      // Throttle cursor updates
      emitEvent('presence:cursor', { channel, userId: localUser.id, cursor })
    }
  },
  
  handleRemotePresence: (event: { type: string; payload: unknown }) => {
    const { localUser, channel, users: _users } = get()
    const payload = event.payload as Record<string, unknown>
    
    if (!payload.channel || payload.channel !== channel) return
    
    switch (event.type) {
      case 'presence:join': {
        const user = payload.user as PresenceUser
        if (localUser && user.id === localUser.id) return // Ignore self
        set((state) => {
          const newUsers = new Map(state.users)
          newUsers.set(user.id, { ...user, lastSeen: Date.now() })
          return { users: newUsers }
        })
        break
      }
      case 'presence:leave': {
        const userId = payload.userId as string
        set((state) => {
          const newUsers = new Map(state.users)
          newUsers.delete(userId)
          return { users: newUsers }
        })
        break
      }
      case 'presence:update': {
        const user = payload.user as PresenceUser
        if (localUser && user.id === localUser.id) return
        set((state) => {
          const newUsers = new Map(state.users)
          newUsers.set(user.id, { ...user, lastSeen: Date.now() })
          return { users: newUsers }
        })
        break
      }
      case 'presence:cursor': {
        const userId = payload.userId as string
        const cursor = payload.cursor as { x: number; y: number; element?: string }
        set((state) => {
          const newUsers = new Map(state.users)
          const user = newUsers.get(userId)
          if (user) {
            newUsers.set(userId, { ...user, cursor, lastSeen: Date.now() })
          }
          return { users: newUsers }
        })
        break
      }
    }
  },
  
  startCleanup: () => {
    const { cleanupTimer } = get()
    if (cleanupTimer) return
    
    const timer = setInterval(() => {
      const { users, ttl } = get()
      const now = Date.now()
      let hasChanges = false
      const newUsers = new Map(users)
      
      newUsers.forEach((user, id) => {
        if (now - user.lastSeen > ttl) {
          newUsers.delete(id)
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        set({ users: newUsers })
      }
    }, CLEANUP_INTERVAL)
    
    set({ cleanupTimer: timer })
  },
  
  stopCleanup: () => {
    const { cleanupTimer } = get()
    if (cleanupTimer) {
      clearInterval(cleanupTimer)
      set({ cleanupTimer: null })
    }
  },
}))

export function usePresenceManagerState() {
  return usePresenceManager()
}

export function subscribeToPresence(_channel: string) {
  // Subscribe to WebSocket channel for presence events
  // This would typically be called when joining a workspace
}

export function getPresenceUsers() {
  return Array.from(usePresenceManager.getState().users.values())
}

export function getLocalPresenceUser() {
  return usePresenceManager.getState().localUser
}