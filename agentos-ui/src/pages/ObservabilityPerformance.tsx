// Observability Performance Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const PERFORMANCE_METRICS = [
  { id: 'p1', name: 'Request Latency (p50)', category: 'latency', current: '23ms', target: '< 50ms', trend: '-2ms', status: 'good', unit: 'ms' },
  { id: 'p2', name: 'Request Latency (p95)', category: 'latency', current: '89ms', target: '< 200ms', trend: '+5ms', status: 'good', unit: 'ms' },
  { id: 'p3', name: 'Request Latency (p99)', category: 'latency', current: '147ms', target: '< 500ms', trend: '+12ms', status: 'warning', unit: 'ms' },
  { id: 'p4', name: 'Throughput', category: 'throughput', current: '12.4k rps', target: '> 10k rps', trend: '+8%', status: 'good', unit: 'rps' },
  { id: 'p5', name: 'Error Rate', category: 'reliability', current: '0.02%', target: '< 0.1%', trend: '-0.01%', status: 'good', unit: '%' },
  { id: 'p6', name: 'Availability', category: 'reliability', current: '99.99%', target: '> 99.95%', trend: '0%', status: 'good', unit: '%' },
  { id: 'p7', name: 'CPU Utilization', category: 'resources', current: '45%', target: '< 70%', trend: '-3%', status: 'good', unit: '%' },
  { id: 'p8', name: 'Memory Utilization', category: 'resources', current: '62%', target: '< 80%', trend: '+2%', status: 'good', unit: '%' },
  { id: 'p9', name: 'Disk I/O Wait', category: 'resources', current: '8%', target: '< 10%', trend: '-1%', status: 'good', unit: '%' },
  { id: 'p10', name: 'Network Throughput', category: 'network', current: '83 MB/s', target: '> 50 MB/s', trend: '+5%', status: 'good', unit: 'MB/s' },
  { id: 'p11', name: 'GC Pause Time', category: 'runtime', current: '12ms', target: '< 50ms', trend: '-3ms', status: 'good', unit: 'ms' },
  { id: 'p12', name: 'Thread Count', category: 'runtime', current: '1,247', target: '< 2000', trend: '+23', status: 'warning', unit: 'count' },
]

const CATEGORIES = ['all', 'latency', 'throughput', 'reliability', 'resources', 'network', 'runtime']

export function ObservabilityPerformance() {
  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center', justifyContent: 'space-between' }}>
        <select style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <Button variant="primary" size="sm">📊 Create Dashboard</Button>
      </div>

      {/* Performance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
        {PERFORMANCE_METRICS.map(metric => (
          <Card key={metric.id} variant="elevated" padding="md" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex.start', marginBottom: 'var(--spacing-3)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {metric.name}
                </div>
                <Badge variant="default" size="sm">{metric.category}</Badge>
              </div>
              <Badge variant={metric.status === 'good' ? 'success' : 'warning'} size="sm" dot>
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {metric.current}
              </span>
              <Badge variant={metric.trend.startsWith('+') && metric.category !== 'throughput' && metric.category !== 'reliability' && metric.category !== 'availability' ? 'error' : 'success'} size="sm">
                {metric.trend}
              </Badge>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
              <span>Target: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{metric.target}</span></span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
              <Button variant="secondary" size="sm" style={{ flex: 1 }}>📈 Graph</Button>
              <Button variant="ghost" size="sm">🔔 Alert</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}