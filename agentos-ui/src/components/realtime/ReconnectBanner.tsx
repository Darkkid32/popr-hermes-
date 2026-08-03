import { useRealtimeStore } from '../../lib/integration/realtime-store'
import './ReconnectBanner.css'

interface ReconnectBannerProps {
  className?: string
  onDismiss?: () => void
}

export function ReconnectBanner({ 
  className = '',
  onDismiss,
}: ReconnectBannerProps) {
  const status = useRealtimeStore((state) => state.connection.status)
  const reconnectAttempt = useRealtimeStore((state) => state.connection.reconnectAttempt)
  
  const isVisible = status === 'disconnected' || status === 'reconnecting' || status === 'error'
  
  if (!isVisible) return null
  
  const handleDismiss = () => {
    if (onDismiss) onDismiss()
  }
  
  const messages = {
    disconnected: 'Connection lost. Working offline.',
    reconnecting: `Reconnecting... (attempt ${reconnectAttempt})`,
    error: 'Connection error. Will retry automatically.',
  }
  
  return (
    <div className={`reconnect-banner ${className}`} role="alert" aria-live="assertive">
      <div className="rb-content">
        <span className="rb-icon" aria-hidden="true">
          {status === 'reconnecting' ? '⟳' : status === 'error' ? '⚠' : '⛓'}
        </span>
        <span className="rb-message">{messages[status]}</span>
        {status !== 'error' && (
          <span className="rb-sub">Changes saved locally, will sync when reconnected</span>
        )}
      </div>
      <button 
        className="rb-dismiss" 
        onClick={handleDismiss}
        aria-label="Dismiss reconnection banner"
      >
        ×
      </button>
    </div>
  )
}