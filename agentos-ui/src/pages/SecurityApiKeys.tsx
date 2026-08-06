// Security API Keys Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'
import { Modal } from '../design-system/components/overlay/Modal'

const API_KEYS_DATA = [
  { id: '1', name: 'Production API', key: 'hk_prod_abc123...', prefix: 'hk_prod_', owner: 'Sarah Chen', scopes: ['read', 'write', 'admin'], created: '2026-01-15', lastUsed: '2026-07-15 14:30', expires: '2027-01-15', status: 'active', color: '#ff4d6d' },
  { id: '2', name: 'CI/CD Pipeline', key: 'hk_cicd_def456...', prefix: 'hk_cicd_', owner: 'Marcus Johnson', scopes: ['read', 'write'], created: '2026-02-20', lastUsed: '2026-07-15 10:45', expires: '2026-08-20', status: 'active', color: '#7c6cf5' },
  { id: '3', name: 'Monitoring Integration', key: 'hk_mon_ghi789...', prefix: 'hk_mon_', owner: 'Alex Rivera', scopes: ['read'], created: '2026-03-10', lastUsed: '2026-07-15 09:15', expires: '2026-09-10', status: 'active', color: '#d946ef' },
  { id: '4', name: 'Development Testing', key: 'hk_dev_jkl012...', prefix: 'hk_dev_', owner: 'Priya Patel', scopes: ['read', 'write'], created: '2026-04-05', lastUsed: '2026-07-14 16:20', expires: '2026-10-05', status: 'active', color: '#22d97a' },
  { id: '5', name: 'Legacy System', key: 'hk_legacy_mno345...', prefix: 'hk_legacy_', owner: 'James Wilson', scopes: ['read'], created: '2025-11-01', lastUsed: '2026-06-15 08:30', expires: '2026-05-01', status: 'expired', color: '#6b7280' },
  { id: '6', name: 'External Partner', key: 'hk_partner_pqr678...', prefix: 'hk_partner_', owner: 'Emily Davis', scopes: ['read'], created: '2026-05-20', lastUsed: '—', expires: '2026-11-20', status: 'revoked', color: '#ffb347' },
]

const SCOPE_OPTIONS = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'admin', label: 'Admin' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
]

export function SecurityApiKeys() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingKey, setEditingKey] = useState<typeof API_KEYS_DATA[0] | null>(null)

  const filteredKeys = useMemo(() => {
    return API_KEYS_DATA.filter(key => {
      const matchesSearch = key.name.toLowerCase().includes(search.toLowerCase()) ||
        key.owner.toLowerCase().includes(search.toLowerCase()) ||
        key.key.includes(search)
      const matchesStatus = !statusFilter || key.status === statusFilter
      return matchesSearch && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, statusFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (key: typeof API_KEYS_DATA[0]) => {
    setEditingKey(key)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingKey(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedKeys(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'expired': return 'warning'
      case 'revoked': return 'error'
      default: return 'default'
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (key: typeof API_KEYS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: key.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: key.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {key.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'API Key', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{key.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{key.key}</div>
      </div>
    )},
    { key: 'owner', header: 'Owner', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{key.owner}</div>
    )},
    { key: 'scopes', header: 'Scopes', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        {key.scopes.map(s => (
          <Badge key={s} variant="default" size="sm">{s}</Badge>
        ))}
      </div>
    )},
    { key: 'created', header: 'Created', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{key.created}</div>
    )},
    { key: 'lastUsed', header: 'Last Used', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{key.lastUsed}</div>
    )},
    { key: 'expires', header: 'Expires', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{key.expires}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (key: typeof API_KEYS_DATA[0]) => (
      <Badge variant={getStatusVariant(key.status)} size="sm" dot>
        {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (key: typeof API_KEYS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(key) }} disabled={key.status !== 'active'}>
        {key.status === 'active' ? 'Rotate' : 'View'}
      </Button>
    )},
  ]

  // Summary stats
  const activeCount = API_KEYS_DATA.filter(k => k.status === 'active').length
  const expiredCount = API_KEYS_DATA.filter(k => k.status === 'expired').length
  const revokedCount = API_KEYS_DATA.filter(k => k.status === 'revoked').length
  const expiringSoon = API_KEYS_DATA.filter(k => k.status === 'active' && new Date(k.expires) < new Date(Date.now() + 30*24*60*60*1000)).length

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Keys</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {API_KEYS_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>🔑</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Active</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                {activeCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Expiring Soon (30d)</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: expiringSoon > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {expiringSoon}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: expiringSoon > 0 ? 'var(--color-warning-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: expiringSoon > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {expiringSoon > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Expired/Revoked</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: (expiredCount + revokedCount) > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {expiredCount + revokedCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: (expiredCount + revokedCount) > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: (expiredCount + revokedCount) > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {(expiredCount + revokedCount) > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search API keys..."
            value={search}
            onChange={handleSearchChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="sm"
          />
        </div>
        <Select
          value={statusFilter}
          onChangeRaw={handleStatusFilterChange}
          placeholder="All Status"
          options={STATUS_OPTIONS}
          size="sm"
          style={{ minWidth: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Create API Key
          </Button>
        </div>
      </div>

      {/* Key Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredKeys.length} of {API_KEYS_DATA.length} keys
        {selectedKeys.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedKeys.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredKeys}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedKeys)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No API keys found"
          selectable
        />
      </Card>

      {/* Create API Key Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New API Key"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Key Name" placeholder="e.g., Production API" required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Scopes</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {SCOPE_OPTIONS.map(scope => (
                  <label key={scope.value} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)' }}>
                    <input type="checkbox" defaultChecked={scope.value === 'read'} /> {scope.label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="Expires In (days)" type="number" placeholder="365" defaultValue="365" />
              <Select
                label="Initial Status"
                placeholder="Select status"
                options={STATUS_OPTIONS}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Key</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit/rotate Key Modal */}
      <Modal
        isOpen={!!editingKey}
        onClose={closeModals}
        title={editingKey?.status === 'active' ? 'Rotate API Key' : 'View API Key'}
        size="md"
      >
        {editingKey && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  {editingKey.status === 'active' ? 'Active Key' : editingKey.status === 'expired' ? 'Expired Key' : 'Revoked Key'}
                </div>
                <Input label="Key Name" defaultValue={editingKey.name} disabled />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: 'var(--spacing-2)' }}>
                  {editingKey.scopes.map(s => (
                    <Badge key={s} variant="default" size="sm">{s}</Badge>
                  ))}
                </div>
              </div>
              {editingKey.status === 'active' && (
                <>
                  <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-warning-base)/10', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning-base)/30' }}>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-warning-base)', marginBottom: 'var(--spacing-2)' }}>
                      <strong>Warning:</strong> Rotating this key will invalidate the current key immediately. Update all integrations before proceeding.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Confirm Rotation</div>
                        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>I understand this will invalidate the current key</div>
                      </div>
                      <input type="checkbox" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                    <Input label="New Expiration (days)" type="number" placeholder="365" defaultValue="365" />
                  </div>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" onClick={closeModals}>Cancel</Button>
                <Button variant={editingKey.status === 'active' ? 'primary' : 'ghost'} disabled={editingKey.status !== 'active'}>
                  {editingKey.status === 'active' ? 'Rotate Key' : 'Close'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}