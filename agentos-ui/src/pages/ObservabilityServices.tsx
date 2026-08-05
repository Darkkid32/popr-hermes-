// Observability Services Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const SERVICES = [
  { id: 's1', name: 'api-gateway', type: 'gateway', status: 'healthy', endpoints: 24, rps: '4.2k', p99: '23ms', errorRate: '0.01%', cpu: '34%', mem: '512 MB', version: 'v2.1.4' },
  { id: 's2', name: 'auth-service', type: 'auth', status: 'healthy', endpoints: 12, rps: '1.8k', p99: '12ms', errorRate: '0.00%', cpu: '28%', mem: '256 MB', version: 'v1.8.2' },
  { id: 's3', name: 'agent-runtime', type: 'compute', status: 'degraded', endpoints: 8, rps: '847', p99: '456ms', errorRate: '0.42%', cpu: '89%', mem: '1.2 GB', version: 'v3.0.1' },
  { id: 's4', name: 'memory-store', type: 'storage', status: 'healthy', endpoints: 16, rps: '2.1k', p99: '8ms', errorRate: '0.00%', cpu: '41%', mem: '890 MB', version: 'v1.5.0' },
  { id: 's5', name: 'mcp-broker', type: 'integration', status: 'healthy', endpoints: 6, rps: '567', p99: '34ms', errorRate: '0.02%', cpu: '22%', mem: '384 MB', version: 'v2.0.3' },
  { id: 's6', name: 'plugin-host', type: 'compute', status: 'warning', endpoints: 4, rps: '234', p99: '189ms', errorRate: '0.15%', cpu: '67%', mem: '1.8 GB', version: 'v1.2.7' },
  { id: 's7', name: 'workflow-engine', type: 'orchestration', status: 'healthy', endpoints: 10, rps: '1.2k', p99: '45ms', errorRate: '0.03%', cpu: '45%', mem: '768 MB', version: 'v2.3.1' },
  { id: 's8', name: 'notification-service', type: 'messaging', status: 'healthy', endpoints: 5, rps: '89', p99: '67ms', errorRate: '0.00%', cpu: '12%', mem: '128 MB', version: 'v1.0.5' },
]

const TYPES = ['all', 'gateway', 'auth', 'compute', 'storage', 'integration', 'orchestration', 'messaging']

export function ObservabilityServices() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    return SERVICES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === 'all' || s.type === selectedType
      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchQuery, selectedType, selectedStatus])

  const getStatusBadge = (status: string) => (
    <Badge variant={status === 'healthy' ? 'success' : status === 'warning' ? 'warning' : status === 'degraded' ? 'warning' : 'error'} size="sm" dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedType}
            onChange={setSelectedType}
            options={TYPES.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) }))}
            style={{ minWidth: 160 }}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'healthy', 'warning', 'degraded'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 160 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('grid')}>⊞ Grid</Button>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('list')}>☰ List</Button>
          <Button variant="primary" size="sm">➕ Register Service</Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--spacing-4)' }}>
          {filtered.map(svc => (
            <Card key={svc.id} variant="elevated" padding="md" hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                    {svc.name}
                  </h3>
                  <Badge variant="default" size="sm">{svc.type}</Badge>
                </div>
                {getStatusBadge(svc.status)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Endpoints:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.endpoints}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>RPS:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.rps}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>P99:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.p99}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Error Rate:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.errorRate}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>CPU:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.cpu}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Memory:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.mem}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
                <span>v{svc.version}</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>📊 Metrics</Button>
                <Button variant="ghost" size="sm">📝 Logs</Button>
                <Button variant="ghost" size="sm">🔗 Traces</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="elevated">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Service</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Endpoints</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>RPS</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>P99</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Error Rate</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>CPU</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Memory</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(svc => (
                  <tr key={svc.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{svc.name}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}><Badge variant="default" size="sm">{svc.type}</Badge></td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>{getStatusBadge(svc.status)}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{svc.endpoints}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{svc.rps}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{svc.p99}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{svc.errorRate}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{svc.cpu}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{svc.mem}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Button variant="ghost" size="sm">Open</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
          🔍 No services found
        </div>
      )}
    </div>
  )
}