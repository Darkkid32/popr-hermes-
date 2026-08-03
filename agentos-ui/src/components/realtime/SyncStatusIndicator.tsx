import { useRealtimeStore } from '../../lib/integration/realtime-store'
import './SyncStatusIndicator.css'

interface SyncStatusIndicatorProps {
  className?: string
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SyncStatusIndicator({ 
  className = '',
  showDetails = false,
  size = 'md'
}: SyncStatusIndicatorProps) {
  const syncStatus = useRealtimeStore((state) => state.sync.syncStatus)
  const pendingMutations = useRealtimeStore((state) => state.sync.pendingMutations)
  const failedMutations = useRealtimeStore((state) => state.sync.failedMutations)
  const conflicts = useRealtimeStore((state) => state.sync.conflicts)
  const lastSync = useRealtimeStore((state) => state.sync.lastSync)
  
  const statusConfig = {
    idle: { label: 'Synced', color: 'var(--text-2)', icon: '✓' },
    syncing: { label: 'Syncing', color: 'var(--brand)', icon: '⟳' },
    success: { label: 'Synced', color: 'var(--success)', icon: '✓' },
    error: { label: 'Sync Error', color: 'var(--error)', icon: '⚠' },
    conflict: { label: 'Conflict', color: 'var(--warning)', icon: '⚠' },
  }
  
  const config = statusConfig[syncStatus]
  
  return (
    <div className={`sync-status-indicator ${size} ${className}`}>
      <span 
        className="ssi-icon" 
        style={{ color: config.color }}
        aria-hidden="true"
      >
        {syncStatus === 'syncing' ? '⟳' : config.icon}
      </span>
      <span className="ssi-label" style={{ color: config.color }}>
        {config.label}
      </span>
      {(pendingMutations > 0 || failedMutations > 0 || conflicts > 0) && (
        <span className="ssi-counts">
          {pendingMutations > 0 && <span className="ssi-pending" title={`${pendingMutations} pending`}>{pendingMutations}</span>}
          {failedMutations > 0 && <span className="ssi-failed" title={`${failedMutations} failed`}>{failedMutations}</span>}
          {conflicts > 0 && <span className="ssi-conflicts" title={`${conflicts} conflicts`}>{conflicts}</span>}
        </span>
      )}
      {showDetails && lastSync && (
        <span className="ssi-last-sync" title={new Date(lastSync).toLocaleString()}>
          {formatRelativeTime(lastSync)}
        </span>
      )}
    </div>
  )
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}