// Observability Capacity Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const CAPACITY_RESOURCES = [
  { id: 'c1', name: 'CPU', category: 'compute', current: '45%', forecast: '62%', limit: '100%', trend: '+17%', status: 'ok', timeframe: '7d', unit: '%' },
  { id: 'c2', name: 'Memory', category: 'compute', current: '62%', forecast: '78%', limit: '100%', trend: '+16%', status: 'warning', timeframe: '7d', unit: '%' },
  { id: 'c3', name: 'Disk (root)', category: 'storage', current: '34%', forecast: '41%', limit: '100%', trend: '+7%', status: 'ok', timeframe: '30d', unit: '%' },
  { id: 'c4', name: 'Disk (logs)', category: 'storage', current: '67%', forecast: '89%', limit: '100%', trend: '+22%', status: 'critical', timeframe: '14d', unit: '%' },
  { id: 'c5', name: 'Network In', category: 'network', current: '45 MB/s', forecast: '62 MB/s', limit: '1 Gbps', trend: '+17 MB/s', status: 'ok', timeframe: '7d', unit: 'MB/s' },
  { id: 'c6', name: 'Network Out', category: 'network', current: '38 MB/s', forecast: '55 MB/s', limit: '1 Gbps', trend: '+17 MB/s', status: 'ok', timeframe: '7d', unit: 'MB/s' },
  { id: 'c7', name: 'Database Connections', category: 'database', current: '42/200', forecast: '89/200', limit: '200', trend: '+47', status: 'warning', timeframe: '7d', unit: 'connections' },
  { id: 'c8', name: 'Redis Memory', category: 'cache', current: '71%', forecast: '85%', limit: '100%', trend: '+14%', status: 'warning', timeframe: '14d', unit: '%' },
  { id: 'c9', name: 'Kafka Disk', category: 'messaging', current: '78%', forecast: '95%', limit: '100%', trend: '+17%', status: 'critical', timeframe: '7d', unit: '%' },
  { id: 'c10', name: 'Pod Count', category: 'kubernetes', current: '247', forecast: '389', limit: '500', trend: '+142', status: 'ok', timeframe: '30d', unit: 'pods' },
]

const CATEGORIES = ['all', 'compute', 'storage', 'network', 'database', 'cache', 'messaging', 'kubernetes']

function getStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'error'> = {
    ok: 'success',
    warning: 'warning',
    critical: 'error',
  }
  return <Badge variant={variants[status] || 'default'} size="sm" dot>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export function ObservabilityCapacity() {
  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center', justifyContent: 'space-between' }}>
        <select style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <Button variant="primary" size="sm">📊 Plan Capacity</Button>
      </div>

      {/* Capacity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-4)' }}>
        {CAPACITY_RESOURCES.map(resource => (
          <Card key={resource.id} variant="elevated" padding="md" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex.start', marginBottom: 'var(--spacing-3)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {resource.name}
                </div>
                <Badge variant="default" size="sm">{resource.category}</Badge>
              </div>
              {getStatusBadge(resource.status)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Current:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{resource.current}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Forecast:</span> <span style={{ color: 'var(--color-warning-base)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{resource.forecast}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Limit:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{resource.limit}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
              <span>Trend: <span style={{ color: resource.trend.startsWith('+') ? 'var(--color-error-base)' : 'var(--color-success-base)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{resource.trend}</span></span>
              <span>Timeframe: {resource.timeframe}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="secondary" size="sm" style={{ flex: 1 }}>📈 Trend</Button>
              <Button variant="ghost" size="sm">🔔 Alert</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}