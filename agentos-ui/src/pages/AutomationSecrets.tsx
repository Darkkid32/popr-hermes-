// Automation Secrets Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const SECRETS = [
  { id: 's1', name: 'DATABASE_PASSWORD', type: 'password', scope: 'global', lastRotated: '2026-07-15', expires: '2026-10-15', status: 'valid', usedBy: 12 },
  { id: 's2', name: 'SLACK_WEBHOOK_URL', type: 'token', scope: 'global', lastRotated: '2026-07-01', expires: '2026-12-31', status: 'valid', usedBy: 8 },
  { id: 's3', name: 'PAGERDUTY_API_KEY', type: 'api_key', scope: 'global', lastRotated: '2026-06-15', expires: '2026-09-15', status: 'expiring_soon', usedBy: 3 },
  { id: 's4', name: 'AWS_ACCESS_KEY', type: 'api_key', scope: 'global', lastRotated: '2026-07-10', expires: '2026-10-10', status: 'valid', usedBy: 5 },
  { id: 's5', name: 'JWT_SIGNING_KEY', type: 'key', scope: 'global', lastRotated: '2026-07-20', expires: '2027-01-20', status: 'valid', usedBy: 24 },
  { id: 's6', name: 'GRAFANA_API_TOKEN', type: 'token', scope: 'workflow', lastRotated: '2026-07-05', expires: '2026-10-05', status: 'valid', usedBy: 2 },
  { id: 's7', name: 'DOCKER_REGISTRY_TOKEN', type: 'token', scope: 'global', lastRotated: '2026-07-12', expires: '2026-08-12', status: 'expiring_soon', usedBy: 7 },
  { id: 's8', name: 'KUBERNETES_SERVICE_ACCOUNT', type: 'certificate', scope: 'global', lastRotated: '2026-01-15', expires: '2027-01-15', status: 'valid', usedBy: 15 },
]

const TYPES = ['all', 'password', 'token', 'api_key', 'key', 'certificate']

export function AutomationSecrets() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => SECRETS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || s.type === selectedType
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  }), [searchQuery, selectedType, selectedStatus])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error'> = {
      valid: 'success',
      expiring_soon: 'warning',
      expired: 'error',
      revoked: 'error',
    }
    return <Badge variant={variants[status] || 'error'} size="sm" dot>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</Badge>
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flex: 1, minWidth: 300 }}>
          <Input
            placeholder="Search secrets..."
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
            options={['all', 'valid', 'expiring_soon', 'expired', 'revoked'].map(s => ({ value: s, label: s === 'all' ? 'All Status' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) }))}
            style={{ minWidth: 160 }}
          />
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>➕ Add Secret</Button>
      </div>

      {/* Secrets Table */}
      <Card variant="elevated">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Name</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Type</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Scope</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Last Rotated</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Expires</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}>Used By</th>
                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: 'var(--text-label-xs)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant="default" size="sm">{s.type}</Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Badge variant="default" size="sm">{s.scope}</Badge>
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.lastRotated}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.expires}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    {getStatusBadge(s.status)}
                  </td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s.usedBy}</td>
                  <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                    <Button variant="ghost" size="sm">⚙️ Manage</Button>
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
              <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>Create Secret</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>✕ Close</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input placeholder="Secret name (e.g., MY_API_KEY)" />
              <Select
                value="password"
                onChange={() => {}}
                options={TYPES.filter(t => t !== 'all').map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
              />
              <Select
                value="global"
                onChange={() => {}}
                options={['global', 'workflow'].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              />
              <Input placeholder="Secret value" type="password" />
              <Input type="date" placeholder="Expiration date (optional)" />
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