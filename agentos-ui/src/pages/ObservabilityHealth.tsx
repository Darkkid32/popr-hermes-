// Observability Health Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const HEALTH_CHECKS = [
  { id: 'h1', name: 'API Gateway Health', type: 'http', target: 'api-gateway', interval: '30s', status: 'passing', lastCheck: '5s ago', latency: '12ms', details: 'HTTP 200 OK' },
  { id: 'h2', name: 'Auth Service Health', type: 'http', target: 'auth-service', interval: '30s', status: 'passing', lastCheck: '8s ago', latency: '8ms', details: 'HTTP 200 OK' },
  { id: 'h3', name: 'Agent Runtime Health', type: 'tcp', target: 'agent-runtime', interval: '15s', status: 'failing', lastCheck: '3s ago', latency: 'timeout', details: 'Connection refused' },
  { id: 'h4', name: 'Memory Store Health', type: 'http', target: 'memory-store', interval: '30s', status: 'passing', lastCheck: '12s ago', latency: '5ms', details: 'HTTP 200 OK' },
  { id: 'h5', name: 'MCP Broker Health', type: 'grpc', target: 'mcp-broker', interval: '30s', status: 'passing', lastCheck: '7s ago', latency: '15ms', details: 'gRPC OK' },
  { id: 'h6', name: 'Plugin Host Health', type: 'http', target: 'plugin-host', interval: '30s', status: 'warning', lastCheck: '10s ago', latency: '189ms', details: 'HTTP 200 OK (slow)' },
  { id: 'h7', name: 'Database Connectivity', type: 'tcp', target: 'postgres-primary', interval: '60s', status: 'passing', lastCheck: '45s ago', latency: '3ms', details: 'TCP connect OK' },
  { id: 'h8', name: 'Redis Connectivity', type: 'tcp', target: 'redis-cluster', interval: '60s', status: 'passing', lastCheck: '30s ago', latency: '2ms', details: 'TCP connect OK' },
  { id: 'h9', name: 'Kafka Connectivity', type: 'tcp', target: 'kafka-cluster', interval: '60s', status: 'warning', lastCheck: '20s ago', latency: '45ms', details: 'High latency' },
  { id: 'h10', name: 'Load Balancer Health', type: 'http', target: 'load-balancer', interval: '30s', status: 'passing', lastCheck: '5s ago', latency: '1ms', details: 'HTTP 200 OK' },
]

export function ObservabilityHealth() {
  const passing = HEALTH_CHECKS.filter(h => h.status === 'passing').length
  const warning = HEALTH_CHECKS.filter(h => h.status === 'warning').length
  const failing = HEALTH_CHECKS.filter(h => h.status === 'failing').length

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
            {passing}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            PASSING
          </div>
        </Card>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-warning-base)' }}>
            {warning}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            WARNING
          </div>
        </Card>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-error-base)' }}>
            {failing}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            FAILING
          </div>
        </Card>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {HEALTH_CHECKS.length}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            TOTAL
          </div>
        </Card>
      </div>

      {/* Health Checks Table */}
      <Card variant="elevated">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
          <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Health Checks</h3>
          <Button variant="secondary" size="sm">➕ Add Check</Button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Check</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Target</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Interval</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Last Check</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Latency</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Details</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {HEALTH_CHECKS.map(check => (
                <tr key={check.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{check.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}><Badge variant="default" size="sm">{check.type.toUpperCase()}</Badge></td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{check.target}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{check.interval}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={check.status === 'passing' ? 'success' : check.status === 'warning' ? 'warning' : 'error'} size="sm" dot>
                      {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{check.lastCheck}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{check.latency}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>{check.details}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm">⚙️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}