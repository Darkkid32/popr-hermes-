// Observability Metrics Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const METRICS_DATA = [
  { id: 'm1', name: 'http_requests_total', type: 'counter', unit: 'req/s', value: '12,432', trend: '+8.2%', status: 'healthy', tags: ['api', 'gateway'] },
  { id: 'm2', name: 'http_request_duration_seconds', type: 'histogram', unit: 'ms', value: '147ms (p99)', trend: '+12ms', status: 'warning', tags: ['api', 'latency'] },
  { id: 'm3', name: 'process_cpu_seconds_total', type: 'gauge', unit: '%', value: '34%', trend: '-2%', status: 'healthy', tags: ['system', 'cpu'] },
  { id: 'm4', name: 'process_resident_memory_bytes', type: 'gauge', unit: 'MB', value: '512 MB', trend: '+15 MB', status: 'healthy', tags: ['system', 'memory'] },
  { id: 'm5', name: 'node_network_receive_bytes_total', type: 'counter', unit: 'MB/s', value: '45 MB/s', trend: '+5%', status: 'healthy', tags: ['network', 'in'] },
  { id: 'm6', name: 'node_network_transmit_bytes_total', type: 'counter', unit: 'MB/s', value: '38 MB/s', trend: '-3%', status: 'healthy', tags: ['network', 'out'] },
  { id: 'm7', name: 'container_restart_count', type: 'counter', unit: 'count', value: '0', trend: '0', status: 'healthy', tags: ['kubernetes', 'reliability'] },
  { id: 'm8', name: 'go_goroutines', type: 'gauge', unit: 'count', value: '1,247', trend: '+23', status: 'warning', tags: ['golang', 'runtime'] },
  { id: 'm9', name: 'database_connections_active', type: 'gauge', unit: 'count', value: '42', trend: '+2', status: 'healthy', tags: ['database', 'pool'] },
  { id: 'm10', name: 'cache_hit_ratio', type: 'gauge', unit: '%', value: '94.2%', trend: '+0.3%', status: 'healthy', tags: ['redis', 'cache'] },
]

const TIME_RANGES = ['5m', '15m', '1h', '6h', '24h', '7d', '30d']

export function ObservabilityMetrics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [timeRange, setTimeRange] = useState('1h')

  const filteredMetrics = useMemo(() => {
    return METRICS_DATA.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = selectedType === 'all' || m.type === selectedType
      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedType])

  const types = ['all', 'counter', 'gauge', 'histogram']

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedType}
            onChange={setSelectedType}
            options={types.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) }))}
            style={{ minWidth: 180 }}
          />
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={TIME_RANGES.map(t => ({ value: t, label: t }))}
            style={{ minWidth: 120 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="secondary" size="sm">📊 Add to Dashboard</Button>
          <Button variant="primary" size="sm">📈 Explore</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
        {filteredMetrics.map((metric) => (
          <Card key={metric.id} variant="elevated" padding="md" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    {metric.name}
                  </span>
                  <Badge variant="default" size="sm">{metric.type}</Badge>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                  {metric.tags.map(tag => (
                    <Badge key={tag} variant="default" size="sm" style={{ backgroundColor: 'var(--color-primary-base)/10', color: 'var(--color-primary-base)' }}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge variant={metric.status === 'healthy' ? 'success' : 'warning'} size="sm" dot>
                {metric.status}
              </Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {metric.value}
              </span>
              <Badge variant={metric.trend.startsWith('+') ? 'error' : metric.trend.startsWith('-') ? 'success' : 'default'} size="sm">
                {metric.trend}
              </Badge>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="ghost" size="sm">📈 Graph</Button>
              <Button variant="ghost" size="sm">🔔 Alert</Button>
              <Button variant="ghost" size="sm">📋 Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredMetrics.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
          🔍 No metrics found matching "{searchQuery}"
        </div>
      )}
    </div>
  )
}