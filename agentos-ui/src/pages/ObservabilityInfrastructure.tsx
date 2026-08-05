// Observability Infrastructure Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const INFRASTRUCTURE = [
  { id: 'i1', name: 'k8s-prod-east', type: 'kubernetes', region: 'us-east-1', status: 'healthy', nodes: 12, pods: 247, cpu: '45%', mem: '62%', storage: '34%', version: 'v1.28.3' },
  { id: 'i2', name: 'k8s-prod-west', type: 'kubernetes', region: 'us-west-2', status: 'healthy', nodes: 8, pods: 189, cpu: '38%', mem: '55%', storage: '28%', version: 'v1.28.3' },
  { id: 'i3', name: 'redis-cluster', type: 'redis', region: 'us-east-1', status: 'healthy', nodes: 6, shards: 3, cpu: '22%', mem: '71%', ops: '45k/s', version: '7.2.4' },
  { id: 'i4', name: 'postgres-primary', type: 'database', region: 'us-east-1', status: 'healthy', replicas: 2, cpu: '34%', mem: '58%', storage: '45%', connections: '142/200', version: '15.4' },
  { id: 'i5', name: 'kafka-cluster', type: 'kafka', region: 'us-east-1', status: 'warning', brokers: 5, topics: 47, partitions: 382, cpu: '67%', disk: '78%', lag: '12ms', version: '3.6.1' },
  { id: 'i6', name: 'load-balancer', type: 'network', region: 'global', status: 'healthy', rules: 24, rps: '12.4k', latency: '2ms', ssl: 'active', version: '2.4.1' },
  { id: 'i7', name: 'object-storage', type: 'storage', region: 'us-east-1', status: 'healthy', buckets: 147, objects: '2.4B', size: '14.7 TB', requests: '8.2k/s', version: 's3-api' },
  { id: 'i8', name: 'cdn-edge', type: 'cdn', region: 'global', status: 'healthy', pops: 47, cacheHit: '94.2%', bandwidth: '2.1 Tbps', latency: '12ms', version: 'edge-1.0' },
]

const TYPES = ['all', 'kubernetes', 'redis', 'database', 'kafka', 'network', 'storage', 'cdn']

function getStatusBadge(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'error'> = {
    healthy: 'success',
    warning: 'warning',
    degraded: 'error',
  }
  return <Badge variant={variants[status] || 'default'} size="sm" dot>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export function ObservabilityInfrastructure() {
  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <select style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>
            {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        <Button variant="primary" size="sm">➕ Add Infrastructure</Button>
      </div>

      {/* Infrastructure Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--spacing-4)' }}>
        {INFRASTRUCTURE.map(infra => (
          <Card key={infra.id} variant="elevated" padding="md" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {infra.name}
                </h3>
                <Badge variant="default" size="sm">{infra.type}</Badge>
              </div>
              {getStatusBadge(infra.status)}
            </div>
            <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
              Region: <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{infra.region}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2) var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
              {Object.entries(infra).filter(([k]) => !['id', 'name', 'type', 'region', 'status'].includes(k)).map(([key, value]) => (
                <div key={key}><span style={{ color: 'var(--color-text-tertiary)' }}>{key}:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</span></div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="secondary" size="sm" style={{ flex: 1 }}>📊 Metrics</Button>
              <Button variant="ghost" size="sm">📝 Logs</Button>
              <Button variant="ghost" size="sm">⚙️ Config</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}