// Automation Executions Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const EXECUTIONS = [
  { id: 'EXEC-2026-08-0047', workflow: 'Daily Data Sync', status: 'success', duration: '1.8s', trigger: 'schedule', startTime: '2026-08-05 06:00:00', endTime: '2026-08-05 06:00:01' },
  { id: 'EXEC-2026-08-0046', workflow: 'Agent Health Check', status: 'success', duration: '3.2s', trigger: 'schedule', startTime: '2026-08-05 14:00:00', endTime: '2026-08-05 14:00:03' },
  { id: 'EXEC-2026-08-0045', workflow: 'Plugin Deployment', status: 'failed', duration: '12.4s', trigger: 'webhook', startTime: '2026-08-05 13:45:12', endTime: '2026-08-05 13:45:24' },
  { id: 'EXEC-2026-08-0044', workflow: 'Model Retraining', status: 'running', duration: '4m 23s', trigger: 'schedule', startTime: '2026-08-05 10:00:00', endTime: '—' },
  { id: 'EXEC-2026-08-0043', workflow: 'Security Scan', status: 'success', duration: '45.2s', trigger: 'manual', startTime: '2026-08-05 09:30:00', endTime: '2026-08-05 09:30:45' },
  { id: 'EXEC-2026-08-0042', workflow: 'Log Rotation', status: 'success', duration: '0.8s', trigger: 'schedule', startTime: '2026-08-05 14:15:00', endTime: '2026-08-05 14:15:00' },
  { id: 'EXEC-2026-08-0041', workflow: 'Database Backup', status: 'success', duration: '2m 34s', trigger: 'schedule', startTime: '2026-08-05 04:00:00', endTime: '2026-08-05 04:02:34' },
  { id: 'EXEC-2026-08-0040', workflow: 'Security Scan', status: 'failed', duration: '1.2s', trigger: 'manual', startTime: '2026-08-04 22:00:00', endTime: '2026-08-04 22:00:01' },
]

export function AutomationExecutions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTrigger, setSelectedTrigger] = useState('all')

  const filtered = useMemo(() => EXECUTIONS.filter(e => {
    const matchesSearch = e.workflow.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus
    const matchesTrigger = selectedTrigger === 'all' || e.trigger === selectedTrigger
    return matchesSearch && matchesStatus && matchesTrigger
  }), [searchQuery, selectedStatus, selectedTrigger])

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search executions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'success', 'failed', 'running'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
          <Select
            value={selectedTrigger}
            onChange={setSelectedTrigger}
            options={['all', 'schedule', 'manual', 'webhook'].map(t => ({ value: t, label: t === 'all' ? 'All Triggers' : t.charAt(0).toUpperCase() + t.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <Button variant="secondary" size="sm">📥 Export</Button>
      </div>

      {/* Executions Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Execution ID</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Workflow</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Duration</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Trigger</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Start Time</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>End Time</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)' }}>{e.id}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontWeight: 500 }}>{e.workflow}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={e.status === 'success' ? 'success' : e.status === 'failed' ? 'error' : 'info'} size="sm">
                      {e.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{e.duration}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>{e.trigger}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{e.startTime}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{e.endTime}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm">👁️ View</Button>
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