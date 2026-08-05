// Observability Overview Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

// Data constants
const OBS_STATS = [
  { label: 'Requests/sec', value: '12.4k', change: '+8%', changeType: 'positive', icon: '📈', unit: 'rps' },
  { label: 'Error Rate', value: '0.02%', change: '-0.01%', changeType: 'positive', icon: '⚠️', unit: '%' },
  { label: 'P99 Latency', value: '147ms', change: '+12ms', changeType: 'negative', icon: '⏱️', unit: 'ms' },
  { label: 'Active Traces', value: '3,847', change: '+234', changeType: 'neutral', icon: '🔍', unit: '' },
  { label: 'Log Volume', value: '2.1 GB/hr', change: '+15%', changeType: 'neutral', icon: '📝', unit: 'GB/hr' },
  { label: 'Uptime', value: '99.99%', change: '0%', changeType: 'positive', icon: '🟢', unit: '%' },
]

const SERVICE_HEALTH = [
  { name: 'api-gateway', status: 'healthy', latency: '23ms', errors: '0.01%', throughput: '4.2k rps', cpu: '34%', memory: '512 MB' },
  { name: 'auth-service', status: 'healthy', latency: '12ms', errors: '0.00%', throughput: '1.8k rps', cpu: '28%', memory: '256 MB' },
  { name: 'agent-runtime', status: 'degraded', latency: '456ms', errors: '0.42%', throughput: '847 rps', cpu: '89%', memory: '1.2 GB' },
  { name: 'memory-store', status: 'healthy', latency: '8ms', errors: '0.00%', throughput: '2.1k rps', cpu: '41%', memory: '890 MB' },
  { name: 'mcp-broker', status: 'healthy', latency: '34ms', errors: '0.02%', throughput: '567 rps', cpu: '22%', memory: '384 MB' },
  { name: 'plugin-host', status: 'warning', latency: '189ms', errors: '0.15%', throughput: '234 rps', cpu: '67%', memory: '1.8 GB' },
]

const RECENT_INCIDENTS = [
  { id: 'INC-2026-0047', title: 'Agent runtime memory pressure', severity: 'warning', status: 'investigating', time: '12m ago', services: ['agent-runtime'] },
  { id: 'INC-2026-0046', title: 'Plugin host latency spike', severity: 'warning', status: 'mitigating', time: '34m ago', services: ['plugin-host'] },
  { id: 'INC-2026-0045', title: 'MCP broker connection timeout', severity: 'critical', status: 'resolved', time: '2h ago', services: ['mcp-broker'] },
  { id: 'INC-2026-0044', title: 'API gateway rate limit exceeded', severity: 'warning', status: 'resolved', time: '4h ago', services: ['api-gateway'] },
  { id: 'INC-2026-0043', title: 'Auth service intermittent failures', severity: 'critical', status: 'resolved', time: '6h ago', services: ['auth-service'] },
]

const TOP_ALERTS = [
  { name: 'High CPU: agent-runtime', severity: 'critical', value: '89%', threshold: '>80%', duration: '15m', status: 'firing' },
  { name: 'High Memory: plugin-host', severity: 'warning', value: '1.8 GB', threshold: '>1.5 GB', duration: '8m', status: 'firing' },
  { name: 'Error Rate: agent-runtime', severity: 'warning', value: '0.42%', threshold: '>0.1%', duration: '22m', status: 'firing' },
  { name: 'P99 Latency: agent-runtime', severity: 'warning', value: '456ms', threshold: '>200ms', duration: '18m', status: 'firing' },
  { name: 'Disk Usage: memory-store', severity: 'info', value: '72%', threshold: '>80%', duration: '2h', status: 'pending' },
]

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    healthy: '#22d97a',
    degraded: '#ffb347',
    warning: '#ffb347',
    critical: '#ff4d6d',
  }
  return map[status] || '#9ba4c0'
}

function getSeverityBadge(severity: string) {
  const map: Record<string, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
    critical: 'error',
    warning: 'warning',
    info: 'info',
    resolved: 'success',
    investigating: 'info',
    mitigating: 'warning',
  }
  return map[severity] || 'default'
}

export function ObservabilityOverview() {
  return (
    <div>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4)', 
        marginBottom: 'var(--spacing-6)' 
      }}>
        {OBS_STATS.map((stat) => (
          <Card key={stat.label} variant="elevated" padding="md">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-display-sm)' }}>{stat.icon}</span>
                <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
                  {stat.label}
                </span>
              </div>
              <Badge 
                variant={stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'error' : 'default'} 
                size="sm"
              >
                {stat.change}
              </Badge>
            </div>
            <div style={{ fontSize: 'var(--text-display-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {stat.value}
              {stat.unit && <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 400, color: 'var(--color-text-tertiary)', marginLeft: '4px' }}>{stat.unit}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Row - Service Health + Top Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Service Health Table */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>🏥</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                SERVICE HEALTH
              </span>
            </div>
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latency</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Errors</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Throughput</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CPU</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Memory</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_HEALTH.map((svc) => (
                  <tr key={svc.name} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {svc.name}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Badge variant="default" size="sm" dot style={{ backgroundColor: `${getStatusColor(svc.status)}/15`, color: getStatusColor(svc.status), borderColor: `${getStatusColor(svc.status)}/30` }}>
                        {svc.status.charAt(0).toUpperCase() + svc.status.slice(1)}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {svc.latency}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {svc.errors}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {svc.throughput}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {svc.cpu}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {svc.memory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Alerts */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>🚨</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                TOP ALERTS
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {TOP_ALERTS.map((alert) => (
              <div key={alert.name} style={{ padding: 'var(--spacing-3) 0', borderTop: '1px solid var(--color-border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {alert.name}
                  </span>
                  <Badge variant={getSeverityBadge(alert.severity)} size="sm">
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                  <span>Value: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{alert.value}</span></span>
                  <span>Threshold: <span style={{ fontFamily: 'var(--font-mono)' }}>{alert.threshold}</span></span>
                  <span>{alert.duration}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', marginTop: 'var(--spacing-1)' }}>
                  <Badge variant="default" size="sm">{alert.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row - Recent Incidents + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Recent Incidents */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>📋</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                RECENT INCIDENTS
              </span>
            </div>
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {RECENT_INCIDENTS.map((inc) => (
              <div key={inc.id} style={{ padding: 'var(--spacing-3) 0', borderTop: '1px solid var(--color-border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      {inc.id}
                    </span>
                    <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {inc.title}
                    </span>
                  </div>
                  <Badge variant={getSeverityBadge(inc.severity)} size="sm">
                    {inc.severity.toUpperCase()}
                  </Badge>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                  <span>{inc.time}</span>
                  <span>Services: {inc.services.join(', ')}</span>
                  <Badge variant="default" size="sm">{inc.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card variant="outlined">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>⚡</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                QUICK ACTIONS
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
            <Button variant="primary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>📊</span>
              Create Dashboard
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🔍</span>
              Explore Metrics
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>📝</span>
              Search Logs
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🔗</span>
              Trace Request
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🚨</span>
              Manage Alerts
            </Button>
            <Button variant="ghost" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>⚙️</span>
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}