// Automation Actions Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const ACTIONS = [
  { id: 'a1', name: 'Send Slack Notification', type: 'notification', category: 'messaging', status: 'active', runs: 1247, successRate: '99.2%', avgDuration: '234ms', lastRun: '5m ago' },
  { id: 'a2', name: 'Deploy to Kubernetes', type: 'deployment', category: 'infrastructure', status: 'active', runs: 567, successRate: '94.3%', avgDuration: '2.1s', lastRun: '1h ago' },
  { id: 'a3', name: 'Execute SQL Query', type: 'database', category: 'data', status: 'active', runs: 3421, successRate: '98.7%', avgDuration: '1.2s', lastRun: '2m ago' },
  { id: 'a4', name: 'Trigger Webhook', type: 'http', category: 'integration', status: 'active', runs: 8934, successRate: '99.8%', avgDuration: '45ms', lastRun: '30s ago' },
  { id: 'a5', name: 'Run Python Script', type: 'compute', category: 'scripting', status: 'inactive', runs: 234, successRate: '97.1%', avgDuration: '3.4s', lastRun: '2d ago' },
  { id: 'a6', name: 'Create Jira Ticket', type: 'ticketing', category: 'ops', status: 'active', runs: 189, successRate: '96.5%', avgDuration: '1.8s', lastRun: '4h ago' },
  { id: 'a7', name: 'Scale Deployment', type: 'kubernetes', category: 'infrastructure', status: 'active', runs: 45, successRate: '100%', avgDuration: '12s', lastRun: '6h ago' },
  { id: 'a8', name: 'Send Email', type: 'notification', category: 'messaging', status: 'active', runs: 5672, successRate: '99.5%', avgDuration: '89ms', lastRun: '1m ago' },
]

const CATEGORIES = ['all', 'messaging', 'infrastructure', 'data', 'integration', 'scripting', 'ops', 'ticketing']

export function AutomationActions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filtered = ACTIONS.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={CATEGORIES.map(c => ({ value: c, label: c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1) }))}
            style={{ minWidth: 160 }}
          />
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={['all', 'active', 'inactive'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <Button variant="primary" size="sm">➕ Create Action</Button>
      </div>

      {/* Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-4)' }}>
        {filtered.map(action => (
          <Card key={action.id} variant="elevated" padding="md" hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex.start', marginBottom: 'var(--spacing-3)' }}>
              <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {action.name}
              </h3>
              <Badge variant={action.status === 'active' ? 'success' : 'default'} size="sm" dot>
                {action.status}
              </Badge>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
              <Badge variant="default" size="sm">{action.type}</Badge>
              <Badge variant="default" size="sm">{action.category}</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Runs:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{action.runs.toLocaleString()}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Success Rate:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{action.successRate}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Avg Duration:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{action.avgDuration}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>Last Run:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{action.lastRun}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="secondary" size="sm" style={{ flex: 1 }}>▶️ Test</Button>
              <Button variant="ghost" size="sm">⚙️ Config</Button>
              <Button variant="ghost" size="sm">📝 Logs</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}