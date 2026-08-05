// Automation Overview Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

// Data constants
const AUTO_STATS = [
  { label: 'Total Workflows', value: '1,247', change: '+23', changeType: 'positive', icon: '🔄', unit: '' },
  { label: 'Active Executions', value: '342', change: '+12', changeType: 'neutral', icon: '▶️', unit: '' },
  { label: 'Queued Jobs', value: '1,891', change: '-47', changeType: 'positive', icon: '⏳', unit: '' },
  { label: 'Success Rate (24h)', value: '98.7%', change: '+0.3%', changeType: 'positive', icon: '✅', unit: '%' },
  { label: 'Avg Duration', value: '2.4s', change: '-0.3s', changeType: 'positive', icon: '⏱️', unit: '' },
  { label: 'Templates Available', value: '89', change: '+5', changeType: 'positive', icon: '📋', unit: '' },
]

const RECENT_EXECUTIONS = [
  { id: 'EXEC-2026-08-0047', workflow: 'Daily Data Sync', status: 'success', duration: '1.8s', trigger: 'schedule', time: '2m ago' },
  { id: 'EXEC-2026-08-0046', workflow: 'Agent Health Check', status: 'success', duration: '3.2s', trigger: 'manual', time: '5m ago' },
  { id: 'EXEC-2026-08-0045', workflow: 'Plugin Deployment', status: 'failed', duration: '12.4s', trigger: 'webhook', time: '12m ago' },
  { id: 'EXEC-2026-08-0044', workflow: 'Model Retraining', status: 'running', duration: '4m 23s', trigger: 'schedule', time: '18m ago' },
  { id: 'EXEC-2026-08-0043', workflow: 'Security Scan', status: 'success', duration: '45.2s', trigger: 'manual', time: '34m ago' },
]

const TOP_WORKFLOWS = [
  { name: 'Daily Data Sync', executions: '2,847', successRate: '99.2%', avgDuration: '1.8s', lastRun: '2m ago' },
  { name: 'Agent Health Check', executions: '1,923', successRate: '98.7%', avgDuration: '3.2s', lastRun: '5m ago' },
  { name: 'Plugin Deployment', executions: '567', successRate: '94.3%', avgDuration: '12.4s', lastRun: '12m ago' },
  { name: 'Model Retraining', executions: '234', successRate: '97.1%', avgDuration: '4m 23s', lastRun: '18m ago' },
  { name: 'Security Scan', executions: '1,456', successRate: '99.8%', avgDuration: '45.2s', lastRun: '34m ago' },
  { name: 'Log Rotation', executions: '3,421', successRate: '100%', avgDuration: '0.8s', lastRun: '1h ago' },
]

const QUEUE_STATUS = [
  { queue: 'high-priority', pending: 12, processing: 3, completed: 147, failed: 0 },
  { queue: 'default', pending: 1432, processing: 45, completed: 12847, failed: 23 },
  { queue: 'batch', pending: 32, processing: 8, completed: 1234, failed: 2 },
  { queue: 'scheduled', pending: 415, processing: 12, completed: 8934, failed: 7 },
]

function getStatusBadge(status: string) {
  const map: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
    success: 'success',
    failed: 'error',
    running: 'info',
    pending: 'warning',
    queued: 'info',
  }
  return map[status] || 'default'
}

function getStatusIcon(status: string) {
  const map: Record<string, string> = {
    success: '✅',
    failed: '❌',
    running: '▶️',
    pending: '⏳',
    queued: '⏸️',
  }
  return map[status] || '❓'
}

export function AutomationOverview() {
  return (
    <div>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4)', 
        marginBottom: 'var(--spacing-6)' 
      }}>
        {AUTO_STATS.map((stat) => (
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

      {/* Main Content Row - Recent Executions + Top Workflows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Recent Executions */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>📋</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                RECENT EXECUTIONS
              </span>
            </div>
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {RECENT_EXECUTIONS.map((exec) => (
              <div key={exec.id} style={{ padding: 'var(--spacing-3) 0', borderTop: '1px solid var(--color-border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span style={{ fontSize: 'var(--text-body-lg)' }}>{getStatusIcon(exec.status)}</span>
                    <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {exec.workflow}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Badge variant={getStatusBadge(exec.status)} size="sm">
                      {exec.status.toUpperCase()}
                    </Badge>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
                      {exec.duration}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                  <span>Trigger: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{exec.trigger}</span></span>
                  <span>{exec.time}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{exec.id}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Workflows */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>⭐</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                TOP WORKFLOWS
              </span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workflow</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Executions</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Duration</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {TOP_WORKFLOWS.map((wf) => (
                  <tr key={wf.name} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {wf.name}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {wf.executions}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {wf.successRate}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {wf.avgDuration}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                      {wf.lastRun}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Bottom Row - Queue Status + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Queue Status */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>⏳</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                QUEUE STATUS
              </span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Queue</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Processing</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-2) var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failed</th>
                </tr>
              </thead>
              <tbody>
                {QUEUE_STATUS.map((q) => (
                  <tr key={q.queue} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {q.queue}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      <Badge variant={q.pending > 100 ? 'warning' : 'default'} size="sm">{q.pending}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-info-base)' }}>
                      {q.processing}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-success-base)' }}>
                      {q.completed}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: q.failed > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                      {q.failed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <span style={{ marginRight: 'var(--spacing-2)' }}>➕</span>
              Create Workflow
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>📋</span>
              From Template
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>▶️</span>
              Run Workflow
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>📅</span>
              Create Schedule
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🔧</span>
              Manage Triggers
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