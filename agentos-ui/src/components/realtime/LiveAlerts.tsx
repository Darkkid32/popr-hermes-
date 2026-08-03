import { useEventBus, PlatformEvents, emitEvent } from '../../lib/integration/event-bus'
import { useRealtimeStore } from '../../lib/integration/realtime-store'
import { useEffect, useState } from 'react'
import './LiveAlerts.css'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  subtitle: string
  owner?: string
  status: 'Assigned' | 'Open' | 'Resolved'
  timestamp: number
  acknowledged: boolean
}

interface LiveAlertsProps {
  className?: string
  maxAlerts?: number
  filterTypes?: ('critical' | 'warning' | 'info' | 'success')[]
  filterStatus?: ('Assigned' | 'Open' | 'Resolved')[]
  showAcknowledged?: boolean
}

export function LiveAlerts({ 
  className = '',
  maxAlerts = 20,
  filterTypes,
  filterStatus,
  showAcknowledged = false,
}: LiveAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const unreadCount = useRealtimeStore((state) => state.notifications.unreadCount)
  
  // Subscribe to alert events
  useEffect(() => {
    const unsubscribe = useEventBus.getState().subscribe(PlatformEvents.NOTIFICATION_ADDED, (_payload: { id: string; title: string }) => {
      // This would come from WebSocket as a full alert object
      // For now, we'll handle it in the component that receives WS events
    })
    
    // Also listen for direct alert events
    const unsubscribeAlert = useEventBus.getState().subscribe('alerts:new', (payload: Alert) => {
      setAlerts((prev) => [payload, ...prev].slice(0, maxAlerts))
    })
    
    return () => {
      unsubscribe()
      unsubscribeAlert()
    }
  }, [maxAlerts])
  
  // Handle alert acknowledgment
  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a))
    // Emit acknowledgment event
    emitEvent(PlatformEvents.NOTIFICATION_READ, { id })
  }
  
  const filteredAlerts = alerts
    .filter((a) => !filterTypes || filterTypes.includes(a.type))
    .filter((a) => !filterStatus || filterStatus.includes(a.status))
    .filter((a) => showAcknowledged || !a.acknowledged)
  
  const typeColors = {
    critical: 'var(--error)',
    warning: 'var(--warning)',
    info: 'var(--info)',
    success: 'var(--success)',
  }
  
  const typeIcons = {
    critical: '🔴',
    warning: '🟠',
    info: '🔵',
    success: '🟢',
  }
  
  const statusColors = {
    Assigned: 'var(--brand)',
    Open: 'var(--warning)',
    Resolved: 'var(--success)',
  }
  
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }
  
  return (
    <div className={`live-alerts ${className}`}>
      <div className="la-header">
        <div className="la-title-row">
          <span className="la-title">Live Alerts</span>
          {unreadCount > 0 && (
            <span className="la-unread-badge" style={{ background: 'var(--error)' }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div className="la-filters">
          {['critical', 'warning', 'info', 'success'].map((type) => (
            <button
              key={type}
              className={`la-filter ${filterTypes?.includes(type as any) ? 'active' : ''}`}
              onClick={() => {
                // Filter logic would go here
              }}
              style={{ borderColor: typeColors[type as keyof typeof typeColors] }}
            >
              {typeIcons[type as keyof typeof typeIcons]}
            </button>
          ))}
        </div>
      </div>
      <div className="la-list">
        {filteredAlerts.length === 0 ? (
          <div className="la-empty">No alerts</div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`la-alert ${alert.type} ${alert.acknowledged ? 'acknowledged' : ''}`}
              style={{ borderLeftColor: typeColors[alert.type] }}
            >
              <div className="la-alert-main">
                <div className="la-alert-header">
                  <span className="la-alert-icon">{typeIcons[alert.type]}</span>
                  <span className="la-alert-title">{alert.title}</span>
                  <span 
                    className="la-alert-status" 
                    style={{ background: statusColors[alert.status] }}
                  >
                    {alert.status}
                  </span>
                  <span className="la-alert-time">{formatTime(alert.timestamp)}</span>
                </div>
                <div className="la-alert-subtitle">{alert.subtitle}</div>
                {alert.owner && <div className="la-alert-owner">Owner: {alert.owner}</div>}
              </div>
              {!alert.acknowledged && (
                <button 
                  className="la-acknowledge"
                  onClick={() => acknowledgeAlert(alert.id)}
                  aria-label="Acknowledge alert"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}