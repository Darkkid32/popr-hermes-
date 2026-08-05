// Automation Triggers Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const TRIGGERS = [
  { id: 'tr1', name: 'Daily Schedule', type: 'schedule', workflow: 'Daily Data Sync', status: 'active', lastFired: 'Today 6:00 AM', nextFire: 'Tomorrow 6:00 AM', count: 365 },
  { id: 'tr2', name: 'Hourly Health Check', type: 'schedule', workflow: 'Agent Health Check', status: 'active', lastFired: '12m ago', nextFire: 'In 12m', count: 8760 },
  { id: 'tr3', name: 'Webhook: GitHub Push', type: 'webhook', workflow: 'Plugin Deployment', status: 'active', lastFired: '2h ago', nextFire: '—', count: 234 },
  { id: 'tr4', name: 'Webhook: Slack Command', type: 'webhook', workflow: 'Security Scan', status: 'active', lastFired: '1h ago', nextFire: '—', count: 89 },
  { id: 'tr5', name: 'Manual Trigger', type: 'manual', workflow: 'Model Retraining', status: 'active', lastFired: '3d ago', nextFire: '—', count: 12 },
  { id: 'tr6', name: 'Cron: Weekly Cleanup', type: 'schedule', workflow: 'Log Rotation', status: 'active', lastFired: 'Last Sunday', nextFire: 'Sunday 2:00 AM', count: 52 },
  { id: 'tr7', name: 'Event: Queue Backlog', type: 'event', workflow: 'Scale Deployment', status: 'inactive', lastFired: 'Never', nextFire: '—', count: 0 },
  { id: 'tr8', name: 'Event: Error Spike', type: 'event', workflow: 'Incident Response', status: 'active', lastFired: '5d ago', nextFire: '—', count: 3 },
]

const TYPES = ['all', 'schedule', 'webhook', 'manual', 'event']

export function AutomationTriggers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search triggers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedType}
            onChange={setSelectedType}
            options={TYPES.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) }))}
            style={{ minWidth: 160 }}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'active', 'inactive'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <Button variant="primary" size="sm">➕ Create Trigger</Button>
      </div>

      {/* Triggers Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Trigger</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Workflow</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Last Fired</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Next Fire</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Count</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {TRIGGERS.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{t.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={t.type === 'schedule' ? 'info' : t.type === 'webhook' ? 'default' : t.type === 'manual' ? 'success' : 'warning'} size="sm">
                      {t.type}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-tertiary)' }}>{t.workflow}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={t.status === 'active' ? 'success' : 'default'} size="sm" dot>
                      {t.status}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{t.lastFired}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{t.nextFire}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{t.count}</td>
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