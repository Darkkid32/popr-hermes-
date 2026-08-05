// Observability Incidents Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const INCIDENTS = [
  { id: 'INC-2026-0047', title: 'Agent runtime memory pressure', severity: 'warning', status: 'investigating', assignee: 'alex@hermes.ai', created: '12m ago', updated: '2m ago', services: ['agent-runtime'], timeline: [{ time: '12m ago', event: 'Created', user: 'system' }, { time: '10m ago', event: 'Assigned', user: 'alex@hermes.ai' }, { time: '2m ago', event: 'Investigating', user: 'alex@hermes.ai' }] },
  { id: 'INC-2026-0046', title: 'Plugin host latency spike', severity: 'warning', status: 'mitigating', assignee: 'sam@hermes.ai', created: '34m ago', updated: '5m ago', services: ['plugin-host'], timeline: [{ time: '34m ago', event: 'Created', user: 'system' }, { time: '30m ago', event: 'Assigned', user: 'sam@hermes.ai' }, { time: '5m ago', event: 'Mitigating', user: 'sam@hermes.ai' }] },
  { id: 'INC-2026-0045', title: 'MCP broker connection timeout', severity: 'critical', status: 'resolved', assignee: 'jordan@hermes.ai', created: '2h ago', updated: '1h ago', services: ['mcp-broker'], timeline: [{ time: '2h ago', event: 'Created', user: 'system' }, { time: '1h 45m ago', event: 'Assigned', user: 'jordan@hermes.ai' }, { time: '1h ago', event: 'Resolved', user: 'jordan@hermes.ai' }] },
  { id: 'INC-2026-0044', title: 'API gateway rate limit exceeded', severity: 'warning', status: 'resolved', assignee: 'taylor@hermes.ai', created: '4h ago', updated: '3h ago', services: ['api-gateway'], timeline: [{ time: '4h ago', event: 'Created', user: 'system' }, { time: '3h 30m ago', event: 'Assigned', user: 'taylor@hermes.ai' }, { time: '3h ago', event: 'Resolved', user: 'taylor@hermes.ai' }] },
  { id: 'INC-2026-0043', title: 'Auth service intermittent failures', severity: 'critical', status: 'resolved', assignee: 'morgan@hermes.ai', created: '6h ago', updated: '5h ago', services: ['auth-service'], timeline: [{ time: '6h ago', event: 'Created', user: 'system' }, { time: '5h 30m ago', event: 'Assigned', user: 'morgan@hermes.ai' }, { time: '5h ago', event: 'Resolved', user: 'morgan@hermes.ai' }] },
]

const SEVERITIES = ['all', 'critical', 'warning', 'info']
const STATUSES = ['all', 'investigating', 'mitigating', 'resolved']

export function ObservabilityIncidents() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const filtered = INCIDENTS.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inc.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity
    const matchesStatus = selectedStatus === 'all' || inc.status === selectedStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityBadge = (severity: string) => (
    <Badge variant={severity === 'critical' ? 'error' : severity === 'warning' ? 'warning' : 'info'} size="sm">
      {severity.toUpperCase()}
    </Badge>
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'info' | 'warning' | 'success'> = {
      investigating: 'info',
      mitigating: 'warning',
      resolved: 'success',
    }
    return <Badge variant={variants[status] || 'default'} size="sm" dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search incidents..."
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
          <Button variant="secondary" size="sm">📊 Runbook</Button>
          <Button variant="primary" size="sm">➕ Declare Incident</Button>
        </div>
      </div>

      {/* Incidents List */}
      <Card variant="elevated">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map(inc => (
            <div key={inc.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: 'var(--spacing-4)',
                  gap: 'var(--spacing-4)',
                  cursor: 'pointer',
                  backgroundColor: showDetails === inc.id ? 'var(--color-primary-base)/5' : 'transparent'
                }}
                onClick={() => setShowDetails(showDetails === inc.id ? null : inc.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
                      {inc.id}
                    </span>
                    <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {inc.title}
                    </span>
                  </div>
                  {getSeverityBadge(inc.severity)}
                  {getStatusBadge(inc.status)}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', minWidth: 300 }}>
                  <span>👤 <span style={{ color: 'var(--color-text-primary)' }}>{inc.assignee}</span></span>
                  <span>🕐 Created: {inc.created}</span>
                  <span>🔄 Updated: {inc.updated}</span>
                  <span>🔧 {inc.services.join(', ')}</span>
                </div>
                <span style={{ color: 'var(--color-text-quaternary)' }}>
                  {showDetails === inc.id ? '▲' : '▼'}
                </span>
              </div>

              {showDetails === inc.id && (
                <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background-base)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-4)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase' }}>Timeline</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                        {inc.timeline.map((event, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ width: 100, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                              {event.time}
                            </span>
                            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {event.event}
                            </span>
                            <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                              by {event.user}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase' }}>Related Alerts</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                        {inc.services.map(s => (
                          <Badge key={s} variant="default" size="sm" style={{ backgroundColor: 'var(--color-primary-base)/10', color: 'var(--color-primary-base)' }}>
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <div style={{ marginTop: 'var(--spacing-4)' }}>
                        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)', textTransform: 'uppercase' }}>Actions</div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                          <Button variant="secondary" size="sm">📋 View Runbook</Button>
                          <Button variant="secondary" size="sm">📊 Metrics</Button>
                          <Button variant="ghost" size="sm">💬 Comments</Button>
                          {inc.status !== 'resolved' && <Button variant="primary" size="sm">✅ Resolve</Button>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
            🔍 No incidents found
          </div>
        )}
      </Card>
    </div>
  )
}