// Observability Dashboards Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const DASHBOARDS = [
  { id: 'd1', name: 'System Overview', owner: 'platform', lastModified: '2h ago', panels: 12, status: 'active', tags: ['system', 'overview'] },
  { id: 'd2', name: 'API Gateway', owner: 'backend', lastModified: '4h ago', panels: 8, status: 'active', tags: ['api', 'gateway'] },
  { id: 'd3', name: 'Database Performance', owner: 'data', lastModified: '1d ago', panels: 15, status: 'active', tags: ['database', 'performance'] },
  { id: 'd4', name: 'Kubernetes Cluster', owner: 'infra', lastModified: '3h ago', panels: 18, status: 'active', tags: ['k8s', 'cluster'] },
  { id: 'd5', name: 'Agent Runtime', owner: 'ai', lastModified: '30m ago', panels: 10, status: 'active', tags: ['agent', 'runtime'] },
  { id: 'd6', name: 'Business Metrics', owner: 'product', lastModified: '6h ago', panels: 6, status: 'draft', tags: ['business', 'kpis'] },
  { id: 'd6', name: 'Security Dashboard', owner: 'security', lastModified: '12h ago', panels: 14, status: 'active', tags: ['security', 'threats'] },
  { id: 'd8', name: 'Cost Analysis', owner: 'finops', lastModified: '2d ago', panels: 9, status: 'archived', tags: ['cost', 'finops'] },
]

export function ObservabilityDashboards() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = DASHBOARDS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statuses = ['all', 'active', 'draft', 'archived']

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={statuses.map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('grid')}>⊞ Grid</Button>
          <Button variant="secondary" size="sm" onClick={() => setViewMode('list')}>☰ List</Button>
          <Button variant="primary" size="sm">➕ New Dashboard</Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-4)' }}>
          {filtered.map((dash) => (
            <Card key={dash.id} variant="elevated" padding="md" hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                    {dash.name}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                    {dash.tags.map(tag => (
                      <Badge key={tag} variant="default" size="sm" style={{ backgroundColor: 'var(--color-primary-base)/10', color: 'var(--color-primary-base)' }}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant={dash.status === 'active' ? 'success' : dash.status === 'draft' ? 'warning' : 'default'} size="sm" dot>
                  {dash.status}
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
                <span>📊 <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{dash.panels}</span> panels</span>
                <span>👤 {dash.owner}</span>
                <span>🕐 {dash.lastModified}</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>Open</Button>
                <Button variant="ghost" size="sm">⋮</Button>
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
                  <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Dashboard</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Panels</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Owner</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Modified</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Tags</th>
                  <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(dash => (
                  <tr key={dash.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {dash.name}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {dash.panels}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                      {dash.owner}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Badge variant={dash.status === 'active' ? 'success' : dash.status === 'draft' ? 'warning' : 'default'} size="sm" dot>
                        {dash.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                      {dash.lastModified}
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--spacing-1)', justifyContent: 'center' }}>
                        {dash.tags.map(tag => (
                          <Badge key={tag} variant="default" size="sm" style={{ backgroundColor: 'var(--color-primary-base)/10', color: 'var(--color-primary-base)' }}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Button variant="ghost" size="sm">Open</Button>
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
          🔍 No dashboards found
        </div>
      )}
    </div>
  )
}