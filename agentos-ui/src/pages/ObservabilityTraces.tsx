// Observability Traces Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const TRACES = [
  { traceId: 'tr-abc123', service: 'api-gateway', operation: 'GET /api/v1/agents', duration: '45ms', status: 'ok', spans: 3, timestamp: '14:32:15' },
  { traceId: 'tr-def456', service: 'plugin-host', operation: 'POST /api/v1/execute', duration: '1.2s', status: 'error', spans: 7, timestamp: '14:32:10' },
  { traceId: 'tr-ghi789', service: 'auth-service', operation: 'POST /api/v1/auth/refresh', duration: '12ms', status: 'ok', spans: 2, timestamp: '14:32:05' },
  { traceId: 'tr-jkl012', service: 'memory-store', operation: 'vector_search', duration: '23ms', status: 'ok', spans: 4, timestamp: '14:31:58' },
  { traceId: 'tr-mno345', service: 'agent-runtime', operation: 'execute_workflow', duration: '4.2s', status: 'error', spans: 12, timestamp: '14:31:55' },
  { traceId: 'tr-pqr678', service: 'mcp-broker', operation: 'read_file', duration: '12ms', status: 'ok', spans: 1, timestamp: '14:31:50' },
  { traceId: 'tr-stu901', service: 'api-gateway', operation: 'GET /api/v1/workflows', duration: '8ms', status: 'ok', spans: 2, timestamp: '14:31:45' },
  { traceId: 'tr-vwx234', service: 'auth-service', operation: 'mfa_challenge', duration: '45ms', status: 'ok', spans: 3, timestamp: '14:31:40' },
  { traceId: 'tr-yza567', service: 'memory-store', operation: 'get_embeddings', duration: '67ms', status: 'ok', spans: 2, timestamp: '14:31:35' },
  { traceId: 'tr-bcd890', service: 'plugin-host', operation: 'install_plugin', duration: '2.1s', status: 'ok', spans: 8, timestamp: '14:31:30' },
]

const SERVICES = ['all', 'api-gateway', 'auth-service', 'agent-runtime', 'memory-store', 'mcp-broker', 'plugin-host']

export function ObservabilityTraces() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [minDuration, setMinDuration] = useState(0)
  const [showWaterfall, setShowWaterfall] = useState<string | null>(null)

  const filteredTraces = useMemo(() => {
    return TRACES.filter(t => {
      const matchesSearch = t.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.operation.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesService = selectedService === 'all' || t.service === selectedService
      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus
      const durationMs = parseInt(t.duration.replace('ms', '').replace('s', '000'))
      const matchesDuration = durationMs >= minDuration
      return matchesSearch && matchesService && matchesStatus && matchesDuration
    })
  }, [searchQuery, selectedService, selectedStatus, minDuration])

  const getStatusBadge = (status: string) => (
    <Badge variant={status === 'ok' ? 'success' : 'error'} size="sm" dot>
      {status.toUpperCase()}
    </Badge>
  )

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search traces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedService}
            onChange={setSelectedService}
            options={SERVICES.map(s => ({ value: s, label: s === 'all' ? 'All Services' : s }))}
            style={{ minWidth: 160 }}
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ minWidth: 120, padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}
          >
            <option value="all">All Status</option>
            <option value="ok">OK</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <Input
            type="number"
            placeholder="Min duration (ms)"
            value={minDuration}
            onChange={(e) => setMinDuration(parseInt(e.target.value) || 0)}
            style={{ width: 160 }}
          />
          <Button variant="secondary" size="sm">📥 Export</Button>
          <Button variant="primary" size="sm">🔴 Live Traces</Button>
        </div>
      </div>

      {/* Traces Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Trace ID</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Service</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Operation</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Duration</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Spans</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Time</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTraces.map(trace => (
                <tr key={trace.traceId} style={{ borderBottom: '1px solid var(--color-border-primary)', cursor: 'pointer' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-primary)' }}>
                    {trace.traceId}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                    {trace.service}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-primary)' }}>
                    {trace.operation}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: trace.status === 'error' ? 'var(--color-error-base)' : 'var(--color-text-primary)' }}>
                    {trace.duration}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    {getStatusBadge(trace.status)}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    {trace.spans}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    {trace.timestamp}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm" onClick={() => setShowWaterfall(trace.traceId)}>📊 View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTraces.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
            🔍 No traces found
          </div>
        )}
      </Card>

      {/* Waterfall Modal */}
      {showWaterfall && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card variant="elevated" style={{ width: '90%', maxWidth: 1000, maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
              <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>Trace Waterfall: {showWaterfall}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowWaterfall(null)}>✕ Close</Button>
            </div>
            <div style={{ padding: 'var(--spacing-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', lineHeight: 1.8 }}>
              <div style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Simulated waterfall view - would show span timeline here</div>
              <pre style={{ backgroundColor: 'var(--color-background-base)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', overflow: 'auto' }}>
{getWaterfallText(showWaterfall)}
              </pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function getWaterfallText(traceId: string) {
  return 'Trace: ' + traceId + '\n' +
    '|-- Span 1: api-gateway -> 45ms\n' +
    '|   |-- Span 1.1: auth-service -> 12ms\n' +
    '|   |-- Span 1.2: agent-runtime -> 30ms\n' +
    '|-- Span 2: plugin-host -> 1.2s\n' +
    '|   |-- Span 2.1: memory-store -> 23ms\n' +
    '|   |-- Span 2.2: mcp-broker -> 12ms\n' +
    '|   |-- Span 2.3: agent-runtime -> 1.1s\n' +
    '|-- Span 3: response -> 2ms'
}