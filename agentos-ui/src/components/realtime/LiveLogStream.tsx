import { useEventBus } from '../../lib/integration/event-bus'
import { useEffect, useRef, useState } from 'react'
import './LiveLogStream.css'

interface LogEntry {
  id: string
  timestamp: number
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  source: string
  message: string
}

interface LiveLogStreamProps {
  className?: string
  maxLines?: number
  filterLevels?: ('INFO' | 'WARN' | 'ERROR' | 'DEBUG')[]
  filterSources?: string[]
  autoScroll?: boolean
  height?: number
}

export function LiveLogStream({ 
  className = '',
  maxLines = 500,
  filterLevels,
  filterSources,
  autoScroll = true,
  height = 300,
}: LiveLogStreamProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef(autoScroll)
  
  autoScrollRef.current = autoScroll
  
  // Subscribe to log events
  useEffect(() => {
    const unsubscribe = useEventBus.getState().subscribe('logs:entry', (payload: LogEntry) => {
      // Apply filters
      if (filterLevels && !filterLevels.includes(payload.level)) return
      if (filterSources && !filterSources.includes(payload.source)) return
      
      setLogs((prev) => {
        const newLogs = [...prev, payload].slice(-maxLines)
        return newLogs
      })
    })
    
    return unsubscribe
  }, [maxLines, filterLevels, filterSources])
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScrollRef.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])
  
  const levelColors = {
    INFO: 'var(--info)',
    WARN: 'var(--warning)',
    ERROR: 'var(--error)',
    DEBUG: 'var(--text-3)',
  }
  
  const levelIcons = {
    INFO: 'ℹ',
    WARN: '⚠',
    ERROR: '✕',
    DEBUG: '◆',
  }
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })
  }
  
  const handleContainerClick = () => {
    containerRef.current?.focus()
  }
  
  return (
    <div className={`live-log-stream ${className}`} onClick={handleContainerClick}>
      <div className="lls-header">
        <span className="lls-title">Live Logs</span>
        <div className="lls-controls">
          <span className="lls-count">{logs.length} entries</span>
          <button 
            className={`lls-autoscroll ${autoScroll ? 'on' : ''}`}
            onClick={() => autoScrollRef.current = !autoScrollRef.current}
            aria-label={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
            aria-pressed={autoScroll}
          >
            ↓ Auto
          </button>
          <button 
            className="lls-clear"
            onClick={() => setLogs([])}
            aria-label="Clear logs"
          >
            Clear
          </button>
        </div>
      </div>
      <div 
        className="lls-container" 
        ref={containerRef}
        tabIndex={0}
        style={{ height }}
        role="log"
        aria-live="polite"
        aria-label="Live log stream"
      >
        {logs.length === 0 ? (
          <div className="lls-empty">Waiting for logs...</div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`lls-entry ${log.level.toLowerCase()}`}
              style={{ borderLeftColor: levelColors[log.level] }}
            >
              <span className="lls-time">{formatTime(log.timestamp)}</span>
              <span 
                className="lls-level" 
                style={{ color: levelColors[log.level] }}
              >
                {levelIcons[log.level]} {log.level}
              </span>
              <span className="lls-source">{log.source}</span>
              <span className="lls-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}