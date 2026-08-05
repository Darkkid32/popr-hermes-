// Automation Variables Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const VARIABLES = [
  { id: 'v1', name: 'DATA_WAREHOUSE_URL', value: 'postgres://dw.hermes.ai:5432/analytics', type: 'secret', scope: 'global', usedBy: 12, updated: '2d ago' },
  { id: 'v2', name: 'API_RATE_LIMIT', value: '1000', type: 'number', scope: 'global', usedBy: 24, updated: '1w ago' },
  { id: 'v3', name: 'DEFAULT_TIMEZONE', value: 'UTC', type: 'string', scope: 'global', usedBy: 45, updated: '3d ago' },
  { id: 'v4', name: 'SLACK_WEBHOOK_URL', value: 'https://hooks.slack.com/...', type: 'secret', scope: 'global', usedBy: 8, updated: '5d ago' },
  { id: 'v5', name: 'MAX_RETRY_ATTEMPTS', value: '3', type: 'number', scope: 'workflow', usedBy: 67, updated: '1d ago' },
  { id: 'v6', name: 'PAGERDUTY_INTEGRATION_KEY', value: 'xxx-xxx-xxx', type: 'secret', scope: 'global', usedBy: 3, updated: '2w ago' },
  { id: 'v7', name: 'LOG_RETENTION_DAYS', value: '30', type: 'number', scope: 'global', usedBy: 23, updated: '1w ago' },
  { id: 'v8', name: 'ENABLE_DEBUG_LOGGING', value: 'false', type: 'boolean', scope: 'workflow', usedBy: 12, updated: '3d ago' },
]

const TYPES = ['all', 'string', 'number', 'boolean', 'secret']
const SCOPES = ['all', 'global', 'workflow', 'execution']

export function AutomationVariables() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedScope, setSelectedScope] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
            prefix={<span>🔍</span>}
          />
          <Select
            value={selectedType}
            onChange={setSelectedType}
            options={TYPES.map(t => ({ value: t, label: t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) }))}
            style={{ minWidth: 140 }}
          />
          <Select
            value={selectedScope}
            onChange={setSelectedScope}
            options={SCOPES.map(s => ({ value: s, label: s === 'all' ? 'All Scopes' : s.charAt(0).toUpperCase() + s.slice(1) }))}
            style={{ minWidth: 140 }}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>➕ Add Variable</Button>
      </div>

      {/* Variables Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Value</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Scope</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Used By</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Updated</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {VARIABLES.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{v.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)' }}>
                    {v.type === 'secret' ? '********' : v.value}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant={v.type === 'secret' ? 'error' : 'default'} size="sm">{v.type}</Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant="default" size="sm">{v.scope}</Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{v.usedBy}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{v.updated}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm">⚙️</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card variant="elevated" style={{ width: '90%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
              <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>Create Variable</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>✕ Close</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input placeholder="Variable name (e.g., MY_VAR)" />
              <Select
                value="string"
                onChange={() => {}}
                options={TYPES.filter(t => t !== 'all').map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              />
              <Select
                value="global"
                onChange={() => {}}
                options={SCOPES.filter(s => s !== 'all').map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              />
              <Input placeholder="Value" type="password" />
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button variant="primary">Create</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}