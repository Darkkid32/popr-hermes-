import { useRealtimeStore } from '../../lib/integration/realtime-store'
import './PresenceAvatars.css'

interface PresenceAvatarsProps {
  className?: string
  maxVisible?: number
  showStatus?: boolean
  size?: 'sm' | 'md' | 'lg'
  onUserClick?: (user: { id: string; name: string }) => void
}

export function PresenceAvatars({ 
  className = '',
  maxVisible = 5,
  showStatus = true,
  size = 'md',
  onUserClick,
}: PresenceAvatarsProps) {
  const users = useRealtimeStore((state) => Array.from(state.presence.users.values()))
  const localUser = useRealtimeStore((state) => state.presence.localUser)
  
  // Combine local user with remote users
  const allUsers = localUser 
    ? [{ ...localUser, status: 'online' as const, lastSeen: Date.now() }, ...users]
    : users
  
  const onlineUsers = allUsers.filter((u) => u.status !== 'offline')
  const displayUsers = onlineUsers.slice(0, maxVisible)
  const remainingCount = onlineUsers.length - maxVisible
  
  const sizeClasses = {
    sm: 'pa-sm',
    md: 'pa-md',
    lg: 'pa-lg',
  }
  
  const sizeValues = {
    sm: { size: 24, fontSize: 10 },
    md: { size: 32, fontSize: 12 },
    lg: { size: 40, fontSize: 14 },
  }
  
  const statusColors = {
    online: 'var(--success)',
    away: 'var(--warning)',
    busy: 'var(--error)',
    offline: 'var(--text-3)',
  }
  
  const statusLabels = {
    online: 'Online',
    away: 'Away',
    busy: 'Busy',
    offline: 'Offline',
  }
  
  const { size: avatarSize, fontSize } = sizeValues[size]
  
  return (
    <div className={`presence-avatars ${sizeClasses[size]} ${className}`} role="group" aria-label="Active users">
      <div className="pa-stack">
        {displayUsers.map((user, index) => (
          <button
            key={user.id}
            className="pa-avatar"
            style={{ 
              zIndex: displayUsers.length - index,
              width: avatarSize,
              height: avatarSize,
              fontSize,
              borderColor: 'var(--bg-0)',
            }}
            onClick={() => onUserClick?.({ id: user.id, name: user.name })}
            aria-label={`${user.name}, ${statusLabels[user.status]}`}
          >
            <span className="pa-initials" style={{ background: user.color }}>
              {user.avatar || user.name.charAt(0).toUpperCase()}
            </span>
            {showStatus && (
              <span 
                className="pa-status" 
                style={{ 
                  background: statusColors[user.status],
                  borderColor: 'var(--bg-0)',
                  width: avatarSize * 0.25,
                  height: avatarSize * 0.25,
                }}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
        {remainingCount > 0 && (
          <button className="pa-avatar pa-more" style={{ width: avatarSize, height: avatarSize, fontSize }}>
            <span className="pa-more-text">+{remainingCount}</span>
          </button>
        )}
      </div>
    </div>
  )
}