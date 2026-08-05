// Automation Jobs Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const JOBS = [
  { id: 'job-1', name: 'data-sync-daily', workflow: 'Daily Data Sync', status: 'completed', queue: 'scheduled', priority: 'high', started: '06:00:00', completed: '06:00:01', retries: 0 },
  { id: 'job-2', name: 'health-check-hourly', workflow: 'Agent Health Check', status: 'running', queue: 'high-priority', priority: 'high', started: '14:32:00', completed: '—', retries: 0 },
  { id: 'job-3', name: 'plugin-deploy', workflow: 'Plugin Deployment', status: 'failed', queue: 'default', priority: 'normal', started: '13:45:12', completed: '13:45:24', retries: 2 },
  { id: 'job-4', name: 'model-retrain', workflow: 'Model Retraining', status: 'queued', queue: 'batch', priority: 'low', started: '—', completed: '—', retries: 0 },
  { id: 'job-5', name: 'security-scan', workflow: 'Security Scan', status: 'completed', queue: 'scheduled', priority: 'high', started: '04:00:00', completed: '04:02:34', retries: 0 },
  { id: 'job-6', name: 'log-rotation', workflow: 'Log Rotation', status: 'completed', queue: 'default', priority: 'normal', started: '14:15:00', completed: '14:15:00', retries: 0 },
  { id: 'job-7', name: 'db-backup', workflow: 'Database Backup', status: 'completed', queue: 'scheduled', priority: 'high', started: '04:00:00', completed: '04:02:34', retries: 0 },
  { id: 'job-8', name: 'security-scan-manual', workflow: 'Security Scan', status: 'failed', queue: 'default', priority: 'normal', started: '22:00:00', completed: '22:00:01', retries: 3 },
]

export function AutomationJobs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedQueue, setSelectedQueue] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const filtered = useMemo(() => JOBS.filter(j => {
    const matchesSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         j.workflow.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || j.status === selectedStatus
    const matchesQueue = selectedQueue === 'all' || j.queue === selectedQueue
    const matchesPriority = selectedPriority === 'all' || j.priority === selectedPriority
    return matchesSearch && matchesStatus && matchesQueue && matchesPriority
  }), [searchQuery, selectedStatus, selectedQueue, selectedPriority])

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'queued', 'running', 'completed', 'failed'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
          <Select
            value={selectedQueue}
            onChange={setSelectedQueue}
            options={['all', 'high-priority', 'default', 'batch', 'scheduled'].map(q => ({ value: q, label: q === 'all' ? 'All Queues' : q }))}
            style={{ minWidth: 140 }}
          />
          <Select
            value={selectedPriority}
            onChange={setSelectedPriority}
            options={['all', 'high', 'normal', 'low'].map(p => ({ value: p, label: p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1) }))}
            style={{ minWidth: 120 }}
          />
        </div>
        <Button variant="primary" size="sm">➕ Create Job</Button>
      </div>

      {/* Jobs Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Job</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Workflow</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Queue</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Started</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Completed</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Retries</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(j => (
                <tr key={j.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)' }}>{j.name}</td>
                  <td style={{ padding: 'var(--spacing-3)' }}>{j.workflow}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={j.status === 'completed' ? 'success' : j.status === 'running' ? 'info' : j.status === 'failed' ? 'error' : 'warning'} size="sm">
                      {j.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>{j.queue}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={j.priority === 'high' ? 'error' : j.priority === 'normal' ? 'default' : 'info'} size="sm">
                      {j.priority.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{j.started}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{j.completed}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{j.retries}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm">👁️</Button>
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