// Observability Logs Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const LOG_LEVELS = ['all', 'error', 'warn', 'info', 'debug', 'trace']
const LOG_SOURCES = ['all', 'api-gateway', 'auth-service', 'agent-runtime', 'memory-store', 'mcp-broker', 'plugin-host']

const LOGS = [
  { id: 'l1', timestamp: '2026-08-05 14:32:15.123', level: 'error', source: 'agent-runtime', message: 'Memory allocation failed: OOM killer triggered', traceId: 'tr-abc123' },
  { id: 'l2', timestamp: '2026-08-05 14:32:10.456', level: 'warn', source: 'plugin-host', message: 'High latency detected: 1.2s for /api/v1/execute', traceId: 'tr-def456' },
  { id: 'l3', timestamp: '2026-08-05 14:32:05.789', level: 'info', source: 'api-gateway', message: 'Request completed: GET /api/v1/agents 200 45ms', traceId: 'tr-ghi789' },
  { id: 'l4', timestamp: '2026-08-05 14:32:01.234', level: 'info', source: 'auth-service', message: 'Token refreshed for user: admin@hermes.ai', traceId: 'tr-jkl012' },
  { id: 'l5', timestamp: '2026-08-05 14:31:58.567', level: 'debug', source: 'memory-store', message: 'Cache miss for key: session:user:12345', traceId: 'tr-mno345' },
  { id: 'l6', timestamp: '2026-08-05 14:31:55.890', level: 'info', source: 'mcp-broker', message: 'Tool call completed: read_file 12ms', traceId: 'tr-pqr678' },
  { id: 'l7', timestamp: '2026-08-05 14:31:50.111', level: 'error', source: 'agent-runtime', message: 'WebSocket connection lost: client disconnected', traceId: 'tr-stu901' },
  { id: 'l8', timestamp: '2026-08-05 14:31:45.333', level: 'warn', source: 'api-gateway', message: 'Rate limit approaching: 85% of threshold', traceId: 'tr-vwx234' },
  { id: 'l9', timestamp: '2026-08-05 14:31:40.777', level: 'info', source: 'auth-service', message: 'MFA challenge sent to user: developer@hermes.ai', traceId: 'tr-yza567' },
  { id: 'l10', timestamp: '2026-08-05 14:31:35.999', level: 'trace', source: 'memory-store', message: 'Vector search executed: 234 results in 12ms', traceId: 'tr-bcd890' },
]

const LEVEL_COLORS: Record<string, string> = {
  error: '#ff4d6d',
  warn: '#ffb347',
  info: '#00e5ff',
  debug: '#22d97a',
  trace: '#d946ef',
}

export function ObservabilityLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const [autoScroll, setAutoScroll] = useState(true)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    return LOGS.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.traceId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel
      const matchesSource = selectedSource === 'all' || log.source === selectedSource
      return matchesSearch && matchesLevel && matchesSource
    })
  }, [searchQuery, selectedLevel, selectedSource])

  const getLevelBadge = (level: string) => (
    <Badge 
      variant="default" 
      size="sm" 
      style={{ 
        backgroundColor: `${LEVEL_COLORS[level]}/15`, 
        color: LEVEL_COLORS[level], 
        borderColor: `${LEVEL_COLORS[level]}/30`,
        textTransform: 'uppercase'
      }}
    >
      {level}
    </Badge>
  )

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedLevel}
            onChange={setSelectedLevel}
            options={LOG_LEVELS.map(l => ({ value: l, label: l === 'all' ? 'All Levels' : l.toUpperCase() }))}
            style={{ minWidth: 140 }}
          />
          <Select
            value={selectedSource}
            onChange={setSelectedSource}
            options={LOG_SOURCES.map(s => ({ value: s, label: s === 'all' ? 'All Sources' : s }))}
            style={{ minWidth: 160 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} />
            Auto-scroll
          </label>
          <Button variant="secondary" size="sm">⏸️ Pause</Button>
          <Button variant="secondary" size="sm">💾 Export</Button>
          <Button variant="primary" size="sm">🔴 Live Tail</Button>
        </div>
      </div>

      {/* Log Stream */}
      <Card variant="elevated" style={{ minHeight: 500 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredLogs.map(log => (
            <div 
              key={log.id}
              style={{ 
                display: 'flex', 
                gap: 'var(--spacing-3)', 
                padding: 'var(--spacing-3) var(--spacing-4)', 
                borderBottom: '1px solid var(--color-border-primary)',
                backgroundColor: showDetails === log.id ? 'var(--color-primary-base)/5' : 'transparent',
                transition: 'background-color var(--motion-duration-snap)'
              }}
              onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
            >
              <span style={{ width: 180, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                {log.timestamp}
              </span>
              {getLevelBadge(log.level)}
              <span style={{ width: 140, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', fontWeight: 500, color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                {log.source}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}>
                {log.message}
              </span>
              <span style={{ width: 120, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', flexShrink: 0 }}>
                {log.traceId}
              </span>
              <span style={{ width: 24, textAlign: 'center', color: 'var(--color-text-quaternary)' }}>
                {showDetails === log.id ? '▲' : '▼'}
              </span>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
            <span style={{ fontSize: 48, marginBottom: 'var(--spacing-4)' }}>🔍</span>
            No logs found matching your filters
          </div>
        )}

        {/* Log Details Modal */}
        {showDetails && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card variant="elevated" style={{ width: '90%', maxWidth: 800, maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
                <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>Log Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(null)}>✕ Close</Button>
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
                {LOGS.find(l => l.id === showDetails)?.message}
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  )
}