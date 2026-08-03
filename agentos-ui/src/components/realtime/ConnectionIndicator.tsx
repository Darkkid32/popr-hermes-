import { useRealtimeStore } from '../../lib/integration/realtime-store'
import './ConnectionIndicator.css'

interface ConnectionIndicatorProps {
  className?: string
  showLatency?: boolean
  showQuality?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ConnectionIndicator({ 
  className = '', 
  showLatency = false,
  showQuality = false,
  size = 'md'
}: ConnectionIndicatorProps) {
  const status = useRealtimeStore((state) => state.connection.status)
  const quality = useRealtimeStore((state) => state.connection.quality)
  const latency = useRealtimeStore((state) => state.connection.latency)
  
  const sizeClasses = {
    sm: 'ci-sm',
    md: 'ci-md',
    lg: 'ci-lg',
  }
  
  const statusColors = {
    connecting: 'var(--warning)',
    connected: 'var(--success)',
    disconnected: 'var(--text-3)',
    error: 'var(--error)',
    reconnecting: 'var(--warning)',
  }
  
  const statusLabels = {
    connecting: 'Connecting',
    connected: 'Live',
    disconnected: 'Offline',
    error: 'Error',
    reconnecting: 'Reconnecting',
  }
  
  const qualityLabels = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    offline: 'Offline',
  }
  
  const qualityColors = {
    excellent: 'var(--success)',
    good: 'var(--success)',
    fair: 'var(--warning)',
    poor: 'var(--error)',
    offline: 'var(--text-3)',
  }
  
  const color = statusColors[status] || 'var(--text-3)'
  
  return (
    <div className={`connection-indicator ${sizeClasses[size]} ${className}`}>
      <span 
        className="ci-dot" 
        style={{ background: color }}
        aria-hidden="true"
      />
      <span className="ci-label">{statusLabels[status]}</span>
      {showLatency && latency > 0 && (
        <span className="ci-latency" aria-label={`Latency: ${latency}ms`}>
          {latency}ms
        </span>
      )}
      {showQuality && status === 'connected' && (
        <span 
          className="ci-quality" 
          style={{ color: qualityColors[quality] }}
          aria-label={`Connection quality: ${qualityLabels[quality]}`}
        >
          {qualityLabels[quality]}
        </span>
      )}
    </div>
  )
}