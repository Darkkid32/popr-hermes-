// Observability Alerts Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const ALERTS = [
  { id: 'alert-1', name: 'High CPU Usage', severity: 'critical', status: 'firing', condition: 'cpu > 80%', value: '89%', duration: '15m', labels: ['agent-runtime', 'cpu'] },
  { id: 'alert-2', name: 'High Memory Usage', severity: 'warning', status: 'firing', condition: 'memory > 1.5GB', value: '1.8 GB', duration: '8m', labels: ['plugin-host', 'memory'] },
  { id: 'alert-3', name: 'Error Rate Spike', severity: 'warning', status: 'firing', condition: 'error_rate > 0.1%', value: '0.42%', duration: '22m', labels: ['agent-runtime', 'errors'] },
  { id: 'alert-4', name: 'P99 Latency High', severity: 'warning', status: 'firing', condition: 'p99 > 200ms', value: '456ms', duration: '18m', labels: ['agent-runtime', 'latency'] },
  { id: 'alert-5', name: 'Disk Usage', severity: 'info', status: 'pending', condition: 'disk > 80%', value: '72%', duration: '2h', labels: ['memory-store', 'disk'] },
  { id: 'alert-6', name: 'Service Down', severity: 'critical', status: 'resolved', condition: 'up == 0', value: '0/1', duration: '5m', labels: ['mcp-broker', 'availability'] },
  { id: 'alert-7', name: 'Queue Backlog', severity: 'warning', status: 'firing', condition: 'queue_size > 1000', value: '1,432', duration: '35m', labels: ['default-queue', 'backlog'] },
  { id: 'alert-8', name: 'SSL Certificate Expiry', severity: 'info', status: 'pending', condition: 'cert_expiry < 30d', value: '14 days', duration: '1d', labels: ['api-gateway', 'tls'] },
]

const SEVERITIES = ['all', 'critical', 'warning', 'info']
const STATUSES = ['all', 'firing', 'pending', 'resolved']

export function ObservabilityAlerts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showRule, setShowRule] = useState<string | null>(null)

  const filteredAlerts = useMemo(() => {
    return ALERTS.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           a.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSeverity = selectedSeverity === 'all' || a.severity === selectedSeverity
      const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus
      return matchesSearch && matchesSeverity && matchesStatus
    })
  }, [searchQuery, selectedSeverity, selectedStatus])

  const getSeverityBadge = (severity: string) => (
    <Badge 
      variant={severity === 'critical' ? 'error' : severity === 'warning' ? 'warning' : 'info'} 
      size="sm"
    >
      {severity.toUpperCase()}
    </Badge>
  )

  const getStatusBadge = (status: string) => (
    <Badge 
      variant={status === 'firing' ? 'error' : status === 'pending' ? 'warning' : 'success'} 
      size="sm" dot
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            options={SEVERITIES.map(s => ({ value: s, label: s === 'all' ? 'All Severities' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 160 }}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={STATUSES.map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 160 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="secondary" size="sm">⚙️ Manage Rules</Button>
          <Button variant="secondary" size="sm">📋 Notification Channels</Button>
          <Button variant="primary" size="sm">➕ Create Alert</Button>
        </div>
      </div>

      {/* Alerts List */}
      <Card variant="elevated">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredAlerts.map(alert => (
            <div key={alert.id} style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <span style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {alert.name}
                    </span>
                    {getSeverityBadge(alert.severity)}
                    {getStatusBadge(alert.status)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                    {alert.labels.map(label => (
                      <Badge key={label} variant="default" size="sm" style={{ backgroundColor: 'var(--color-primary-base)/10', color: 'var(--color-primary-base)' }}>
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-2)', minWidth: 200 }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                    <span>Condition: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{alert.condition}</span></span>
                    <span>Value: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: alert.severity === 'critical' ? 'var(--color-error-base)' : 'var(--color-text-primary)' }}>{alert.value}</span></span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <Button variant="ghost" size="sm" onClick={() => setShowRule(showRule === alert.id ? null : alert.id)}>
                      {showRule === alert.id ? '▲' : '▼'} Details
                    </Button>
                    {alert.status === 'firing' && (
                      <Button variant="secondary" size="sm">✅ Acknowledge</Button>
                    )}
                    {alert.status === 'pending' && (
                      <Button variant="ghost" size="sm">⏳ Waiting</Button>
                    )}
                    {alert.status === 'resolved' && (
                      <Button variant="ghost" size="sm" disabled>✅ Resolved</Button>
                    )}
                  </div>
                </div>
              </div>

              {showRule === alert.id && (
                <div style={{ backgroundColor: 'var(--color-background-base)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
                  <div style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Alert Rule Definition:</div>
                  <pre style={{ backgroundColor: 'var(--color-surface-container)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-sm)', overflow: 'auto' }}>
{`name: ${alert.name}
condition: ${alert.condition}
severity: ${alert.severity}
for: 5m
labels:
  service: ${alert.labels[0]}
  type: ${alert.labels[1]}
annotations:
  summary: "${alert.name} detected"
  description: "Current value: ${alert.value} exceeds threshold"
  runbook_url: "https://runbooks.hermes.ai/${alert.id.toLowerCase()}"`}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
            🔍 No alerts found
          </div>
        )}
      </Card>
    </div>
  )
}