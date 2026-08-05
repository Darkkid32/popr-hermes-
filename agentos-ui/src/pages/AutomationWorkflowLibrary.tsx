// Automation Workflow Library Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const WORKFLOWS = [
  { id: 'wf1', name: 'Daily Data Sync', version: 'v1.2.3', status: 'published', category: 'data', runs: 1247, successRate: '99.2%', lastRun: 'Today 6:00 AM', author: 'platform-team', updated: '2d ago' },
  { id: 'wf2', name: 'Agent Health Check', version: 'v2.0.1', status: 'published', category: 'monitoring', runs: 8760, successRate: '98.7%', lastRun: '12m ago', author: 'infra-team', updated: '1w ago' },
  { id: 'wf3', name: 'Plugin Deployment', version: 'v1.5.0', status: 'published', category: 'deployment', runs: 567, successRate: '94.3%', lastRun: '1h ago', author: 'devops-team', updated: '3d ago' },
  { id: 'wf4', name: 'Model Retraining', version: 'v3.1.0', status: 'draft', category: 'ml', runs: 0, successRate: '—', lastRun: '—', author: 'ml-team', updated: '5d ago' },
  { id: 'wf5', name: 'Incident Response', version: 'v1.0.0', status: 'published', category: 'ops', runs: 89, successRate: '95.1%', lastRun: '5d ago', author: 'sre-team', updated: '2w ago' },
  { id: 'wf6', name: 'Log Rotation', version: 'v1.0.0', status: 'published', category: 'maintenance', runs: 20160, successRate: '100%', lastRun: '15m ago', author: 'infra-team', updated: '1d ago' },
  { id: 'wf7', name: 'Security Scan', version: 'v2.2.1', status: 'published', category: 'security', runs: 365, successRate: '99.8%', lastRun: 'Today 3:00 AM', author: 'security-team', updated: '1w ago' },
  { id: 'wf8', name: 'Blue-Green Deploy', version: 'v1.3.0', status: 'draft', category: 'deployment', runs: 0, successRate: '—', lastRun: '—', author: 'devops-team', updated: '3d ago' },
]

const CATEGORIES = ['all', 'data', 'monitoring', 'deployment', 'ml', 'ops', 'maintenance', 'security']

export function AutomationWorkflowLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = WORKFLOWS.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || w.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search workflows..."
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
            options={['all', 'published', 'draft', 'archived'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('grid')}>⊞ Grid</Button>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('list')}>☰ List</Button>
          <Button variant="primary" size="sm">➕ New Workflow</Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--spacing-4)' }}>
          {filtered.map(wf => (
            <Card key={wf.id} variant="elevated" padding="md" hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex.start', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                    {wf.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-xs)' }}>
                    <Badge variant={wf.status === 'published' ? 'success' : 'warning'} size="sm">{wf.status}</Badge>
                    <Badge variant="default" size="sm">{wf.version}</Badge>
                  </div>
                </div>
                <Badge variant="default" size="sm">{wf.category}</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Runs:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{wf.runs.toLocaleString()}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Success Rate:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{wf.successRate}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Last Run:</span> <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{wf.lastRun}</span></div>
                <div><span style={{ color: 'var(--color-text-tertiary)' }}>Author:</span> <span style={{ color: 'var(--color-text-primary)' }}>{wf.author}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant="primary" size="sm" style={{ flex: 1 }}>{wf.status === 'published' ? '▶️ Run' : '📝 Edit'}</Button>
                <Button variant="ghost" size="sm">📋 Copy</Button>
                <Button variant="ghost" size="sm">📊 View</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="elevated">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Workflow</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Version</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Runs</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Success Rate</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Last Run</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Author</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
                </tr>
              </thead>
              <tbody>
                {WORKFLOWS.map(wf => (
                  <tr key={wf.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{wf.name}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{wf.version}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Badge variant={wf.status === 'published' ? 'success' : 'warning'} size="sm">{wf.status}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Badge variant="default" size="sm">{wf.category}</Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{wf.runs.toLocaleString()}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{wf.successRate}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{wf.lastRun}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>{wf.author}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Button variant="ghost" size="sm">{wf.status === 'published' ? '▶️ Run' : '📝 Edit'}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--color-text-tertiary)' }}>
          🔍 No workflows found
        </div>
      )}
    </div>
  )
}