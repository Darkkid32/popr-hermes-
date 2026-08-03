import { useRealtimeStore } from '../../lib/integration/realtime-store'
import { useEventBus } from '../../lib/integration/event-bus'
import { useEffect, useRef } from 'react'
import './LiveActivityFeed.css'

interface LiveActivityFeedProps {
  className?: string
  maxEvents?: number
  filterWorkspaces?: string[]
  showWorkspace?: boolean
}

export function LiveActivityFeed({ 
  className = '',
  maxEvents = 20,
  filterWorkspaces,
  showWorkspace = true,
}: LiveActivityFeedProps) {
  const events = useRealtimeStore((state) => state.activity.recentEvents)
  const feedRef = useRef<HTMLDivElement>(null)
  
  // Subscribe to activity events
  useEffect(() => {
    return useEventBus.getState().subscribe('activity:event', (_payload) => {
      // The realtime store already handles this via initialize()
    })
  }, [])
  
  const filteredEvents = events
    .filter((e) => !filterWorkspaces || !e.workspace || filterWorkspaces.includes(e.workspace))
    .slice(0, maxEvents)
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  
  const getEventIcon = (type: string) => {
    if (type.includes('workflow')) return '⚙'
    if (type.includes('agent')) return '🤖'
    if (type.includes('sync')) return '⟳'
    if (type.includes('memory')) return '🧠'
    if (type.includes('graph')) return '🕸'
    if (type.includes('alert')) return '⚠'
    if (type.includes('notification')) return '🔔'
    return '•'
  }
  
  const getEventColor = (type: string) => {
    if (type.includes('error') || type.includes('failed')) return 'var(--error)'
    if (type.includes('warning') || type.includes('conflict')) return 'var(--warning)'
    if (type.includes('success') || type.includes('completed')) return 'var(--success)'
    if (type.includes('info')) return 'var(--info)'
    return 'var(--text-2)'
  }
  
  return (
    <div className={`live-activity-feed ${className}`} ref={feedRef}>
      <div className="laf-header">
        <span className="laf-title">Live Activity</span>
        <span className="laf-count">{filteredEvents.length}</span>
      </div>
      <div className="laf-list">
        {filteredEvents.length === 0 ? (
          <div className="laf-empty">No recent activity</div>
        ) : (
          filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="laf-item"
              style={{ borderLeftColor: getEventColor(event.type) }}
            >
              <span className="laf-icon" aria-hidden="true">{getEventIcon(event.type)}</span>
              <div className="laf-content">
                <div className="laf-main">
                  <span className="laf-type">{event.type}</span>
                  {showWorkspace && event.workspace && (
                    <span className="laf-workspace">@{event.workspace}</span>
                  )}
                </div>
                <div className="laf-payload">
                  {typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload)}
                </div>
              </div>
              <span className="laf-time">{formatTime(event.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}