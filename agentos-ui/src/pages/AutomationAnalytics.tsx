// Automation Analytics Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'

const ANALYTICS_REPORTS = [
  { id: 'a1', name: 'Weekly System Health', type: 'scheduled', frequency: 'weekly', lastRun: 'Mon 6:00 AM', nextRun: 'Mon 6:00 AM', status: 'success', recipients: 12, format: 'PDF' },
  { id: 'a2', name: 'Daily Performance Digest', type: 'scheduled', frequency: 'daily', lastRun: 'Today 6:00 AM', nextRun: 'Tomorrow 6:00 AM', status: 'success', recipients: 8, format: 'Email' },
  { id: 'a3', name: 'Monthly Capacity Review', type: 'scheduled', frequency: 'monthly', lastRun: 'Aug 1', nextRun: 'Sep 1', status: 'pending', recipients: 5, format: 'PDF' },
  { id: 'a4', name: 'Incident Postmortems', type: 'on-demand', frequency: 'on-demand', lastRun: 'Jul 28', nextRun: '—', status: 'success', recipients: 3, format: 'PDF' },
  { id: 'a5', name: 'SLA Compliance Report', type: 'scheduled', frequency: 'weekly', lastRun: 'Mon 6:00 AM', nextRun: 'Mon 6:00 AM', status: 'success', recipients: 15, format: 'Dashboard' },
  { id: 'a6', name: 'Cost Optimization', type: 'on-demand', frequency: 'on-demand', lastRun: 'Jul 15', nextRun: '—', status: 'running', recipients: 2, format: 'PDF' },
  { id: 'a7', name: 'Security Audit Trail', type: 'scheduled', frequency: 'daily', lastRun: 'Today 12:00 AM', nextRun: 'Tomorrow 12:00 AM', status: 'success', recipients: 4, format: 'CSV' },
]

const CUSTOM_QUERIES = [
  { id: 'q1', name: 'Error Rate by Service', query: 'rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])', lastRun: '2m ago', status: 'success' },
  { id: 'q2', name: 'P99 Latency Trend', query: 'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))', lastRun: '5m ago', status: 'success' },
  { id: 'q3', name: 'Top 10 Memory Consumers', query: 'topk(10, process_resident_memory_bytes)', lastRun: '1m ago', status: 'success' },
  { id: 'q4', name: 'Queue Depth Over Time', query: 'queue_size', lastRun: '30s ago', status: 'success' },
]

export function AutomationAnalytics() {
  const [activeTab, setActiveTab] = useState('reports')

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)', borderBottom: '1px solid var(--color-border-primary)', paddingBottom: 'var(--spacing-2)' }}>
        <button 
          role="tab"
          aria-selected={activeTab === 'reports'}
          onClick={() => setActiveTab('reports')}
          style={{
            padding: 'var(--spacing-2) var(--spacing-4)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'reports' ? 'var(--color-primary-glow)' : 'transparent',
            color: activeTab === 'reports' ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          📋 Reports
        </button>
        <button 
          role="tab"
          aria-selected={activeTab === 'queries'}
          onClick={() => setActiveTab('queries')}
          style={{
            padding: 'var(--spacing-2) var(--spacing-4)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'queries' ? 'var(--color-primary-glow)' : 'transparent',
            color: activeTab === 'queries' ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          🔍 Custom Queries
        </button>
        <button 
          role="tab"
          aria-selected={activeTab === 'insights'}
          onClick={() => setActiveTab('insights')}
          style={{
            padding: 'var(--spacing-2) var(--spacing-4)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'insights' ? 'var(--color-primary-glow)' : 'transparent',
            color: activeTab === 'insights' ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          💡 Insights
        </button>
      </div>

      {activeTab === 'reports' && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center', justifyContent: 'space-between' }}>
            <Input placeholder="Search reports..." style={{ minWidth: 300 }} prefix={<span>🔍</span>} />
            <Button variant="primary" size="sm">➕ Create Report</Button>
          </div>

          {/* Reports Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-4)' }}>
            {ANALYTICS_REPORTS.map(report => (
              <Card key={report.id} variant="elevated" padding="md" hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex.start', marginBottom: 'var(--spacing-3)' }}>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{report.name}</h3>
                  <Badge variant={report.type === 'scheduled' ? 'info' : 'default'} size="sm">{report.type}</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
                  <div><span style={{ color: 'var(--color-text-tertiary)' }}>Frequency:</span> <span style={{ color: 'var(--color-text-primary)' }}>{report.frequency}</span></div>
                  <div><span style={{ color: 'var(--color-text-tertiary)' }}>Last Run:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{report.lastRun}</span></div>
                  <div><span style={{ color: 'var(--color-text-tertiary)' }}>Next Run:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{report.nextRun}</span></div>
                  <div><span style={{ color: 'var(--color-text-tertiary)' }}>Recipients:</span> <span style={{ color: 'var(--color-text-primary)' }}>{report.recipients}</span></div>
                  <div><span style={{ color: 'var(--color-text-tertiary)' }}>Format:</span> <span style={{ color: 'var(--color-text-primary)' }}>{report.format}</span></div>
                  <div><span style={{ color: 'var(--color-text-tertiary)' }}>Status:</span> <Badge variant={report.status === 'success' ? 'success' : report.status === 'running' ? 'info' : report.status === 'pending' ? 'warning' : 'error'} size="sm">{report.status}</Badge></div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button variant="secondary" size="sm" style={{ flex: 1 }}>👁️ View</Button>
                  <Button variant="ghost" size="sm">⚙️ Edit</Button>
                  <Button variant="ghost" size="sm">🗑️</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'queries' && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center', justifyContent: 'space-between' }}>
            <Input placeholder="Search queries..." style={{ minWidth: 300, flex: 1 }} prefix={<span>🔍</span>} />
            <Button variant="primary" size="sm">➕ New Query</Button>
          </div>

          {/* Queries Table */}
          <Card variant="elevated">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Query</th>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>PromQL</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Last Run</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {CUSTOM_QUERIES.map(query => (
                    <tr key={query.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                      <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{query.name}</td>
                      <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{query.query}</td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{query.lastRun}</td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}><Badge variant={query.status === 'success' ? 'success' : 'error'} size="sm">{query.status}</Badge></td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                        <Button variant="ghost" size="sm">▶️ Run</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--spacing-4)' }}>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                <span style={{ fontSize: 32 }}>📈</span>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Latency Increasing</h3>
                  <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>P99 latency up 12% over 7 days</p>
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                Agent-runtime P99 increased from 135ms to 147ms. Correlates with memory pressure alerts.
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
                <Button variant="secondary" size="sm">🔍 Investigate</Button>
                <Button variant="ghost" size="sm">🔔 Create Alert</Button>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                <span style={{ fontSize: 32 }}>💾</span>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Disk Growth Anomaly</h3>
                  <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Log volume growing 15% faster than baseline</p>
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                Projected to hit 90% capacity in 14 days. Consider log rotation policy.
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
                <Button variant="secondary" size="sm">📊 View Trend</Button>
                <Button variant="ghost" size="sm">⚙️ Configure</Button>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                <span style={{ fontSize: 32 }}>✅</span>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>SLA On Track</h3>
                  <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>99.99% availability maintained</p>
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>
                All service-level objectives met. Error budget remaining: 97.2%
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
                <Button variant="secondary" size="sm">📋 View SLOs</Button>
                <Button variant="ghost" size="sm">📈 Dashboard</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}