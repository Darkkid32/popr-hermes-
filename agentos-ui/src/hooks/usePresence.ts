import { usePresenceManager } from '../lib/integration/presence-manager'
import { useEffect, useCallback } from 'react'

export function usePresence(channel: string, user?: { id: string; name: string; avatar: string; color: string }) {
  const { 
    users, 
    localUser, 
    setLocalUser, 
    joinChannel, 
    leaveChannel, 
    updatePresence, 
    updateCursor 
  } = usePresenceManager()
  
  // Join channel on mount
  useEffect(() => {
    if (user) {
      setLocalUser({
        ...user,
        status: 'online',
        lastSeen: Date.now(),
      })
    }
    if (channel) {
      joinChannel(channel)
    }
    
    return () => {
      leaveChannel()
    }
  }, [channel, user?.id, setLocalUser, joinChannel, leaveChannel, user])
  
  const setStatus = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
    updatePresence({ status })
  }, [updatePresence])
  
  const setCursor = useCallback((cursor: { x: number; y: number; element?: string }) => {
    updateCursor(cursor)
  }, [updateCursor])
  
  const setMetadata = useCallback((metadata: Record<string, unknown>) => {
    updatePresence({ metadata })
  }, [updatePresence])
  
  // Get users in current channel
  const channelUsers = Array.from(users.values())
  const onlineUsers = channelUsers.filter((u) => u.status === 'online')
  const awayUsers = channelUsers.filter((u) => u.status === 'away')
  const busyUsers = channelUsers.filter((u) => u.status === 'busy')
  
  return {
    users: channelUsers,
    onlineUsers,
    awayUsers,
    busyUsers,
    localUser,
    setStatus,
    setCursor,
    setMetadata,
    joinChannel,
    leaveChannel,
  }
}

export function useCursors(channel: string) {
  const { users } = usePresence(channel)
  
  const cursors = Array.from(users.values())
    .filter((u) => u.cursor)
    .map((u) => ({ userId: u.id, userName: u.name, ...u.cursor! }))
  
  return cursors
}