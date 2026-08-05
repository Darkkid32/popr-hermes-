// Automation Schedules Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const SCHEDULES = [
  { id: 'sch1', name: 'Daily Data Sync', workflow: 'Daily Data Sync', cron: '0 6 * * *', nextRun: 'Tomorrow 6:00 AM', timezone: 'UTC', status: 'active', lastRun: 'Today 6:00 AM', runs: 1247 },
  { id: 'sch2', name: 'Hourly Health Check', workflow: 'Agent Health Check', cron: '0 * * * *', nextRun: 'In 12m', timezone: 'UTC', status: 'active', lastRun: '12m ago', runs: 8760 },
  { id: 'sch3', name: 'Weekly Model Retraining', workflow: 'Model Retraining', cron: '0 2 * * 0', nextRun: 'Sunday 2:00 AM', timezone: 'UTC', status: 'active', lastRun: 'Last Sunday', runs: 52 },
  { id: 'sch4', name: 'Every 15min Log Rotation', workflow: 'Log Rotation', cron: '*/15 * * * *', nextRun: 'In 3m', timezone: 'UTC', status: 'active', lastRun: '3m ago', runs: 20160 },
  { id: 'sch5', name: 'Monthly Security Scan', workflow: 'Security Scan', cron: '0 3 1 * *', nextRun: 'Sep 1 3:00 AM', timezone: 'UTC', status: 'paused', lastRun: 'Aug 1', runs: 12 },
  { id: 'sch6', name: 'Daily Backup', workflow: 'Database Backup', cron: '0 4 * * *', nextRun: 'Tomorrow 4:00 AM', timezone: 'UTC', status: 'active', lastRun: 'Today 4:00 AM', runs: 365 },
]

export function AutomationSchedules() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filtered = useMemo(() => SCHEDULES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.workflow.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus
    return matchesSearch && matchesStatus
  }), [searchQuery, selectedStatus])

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'active', 'paused', 'failed'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <Button variant="primary" size="sm">➕ Create Schedule</Button>
      </div>

      {/* Schedules Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Schedule</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Workflow</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Cron</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Next Run</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Timezone</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Last Run</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Runs</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-tertiary)' }}>{s.workflow}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.cron}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.nextRun}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.timezone}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={s.status === 'active' ? 'success' : s.status === 'paused' ? 'warning' : 'error'} size="sm" dot>
                      {s.status}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.lastRun}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.runs}</td>
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