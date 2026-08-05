// Automation Queue Monitor Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const QUEUES = [
  { name: 'high-priority', pending: 12, processing: 3, completed: 147, failed: 0, avgWait: '2s', throughput: '45/min' },
  { name: 'default', pending: 1432, processing: 45, completed: 12847, failed: 23, avgWait: '1.2s', throughput: '1,200/min' },
  { name: 'batch', pending: 32, processing: 8, completed: 1234, failed: 2, avgWait: '45s', throughput: '85/min' },
  { name: 'scheduled', pending: 415, processing: 12, completed: 8934, failed: 7, avgWait: '30s', throughput: '200/min' },
]

export function AutomationQueueMonitor() {
  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>Queue Monitor</h3>
        <Button variant="primary" size="sm">🔄 Refresh</Button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>1,491</div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>TOTAL PENDING</div>
        </Card>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-info-base)' }}>68</div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>PROCESSING</div>
        </Card>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>23,162</div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>COMPLETED TODAY</div>
        </Card>
        <Card variant="elevated" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-error-base)' }}>32</div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>FAILED TODAY</div>
        </Card>
      </div>

      {/* Queue Details */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Queue</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Pending</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Processing</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Completed</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Failed</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Avg Wait</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Throughput</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {QUEUES.map(q => (
                <tr key={q.name} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{q.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={q.pending > 100 ? 'warning' : q.pending > 0 ? 'info' : 'default'} size="sm">{q.pending}</Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-info-base)' }}>{q.processing}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-success-base)' }}>{q.completed}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: q.failed > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>{q.failed}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{q.avgWait}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{q.throughput}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm">📊 Details</Button>
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