// Security Secrets Tab
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

const SECRETS_DATA = [
  { id: '1', name: 'database-password', type: 'password', engine: 'vault', path: 'secret/data/prod/db', version: 12, created: '2026-01-15', updated: '2026-07-10', expires: '2026-12-31', status: 'active', owner: 'Sarah Chen', color: '#ff4d6d' },
  { id: '2', name: 'api-gateway-jwt-secret', type: 'jwt', engine: 'vault', path: 'secret/data/prod/api-gateway', version: 8, created: '2026-02-20', updated: '2026-07-12', expires: '2027-02-20', status: 'active', owner: 'Marcus Johnson', color: '#7c6cf5' },
  { id: '3', name: 'redis-connection-string', type: 'connection_string', engine: 'vault', path: 'secret/data/prod/redis', version: 5, created: '2026-03-10', updated: '2026-07-14', expires: '2026-09-10', status: 'active', owner: 'Alex Rivera', color: '#d946ef' },
  { id: '4', name: 's3-access-key', type: 'aws_key', engine: 'aws_secrets_manager', path: 'prod/s3/access', version: 3, created: '2026-04-05', updated: '2026-06-15', expires: '2026-10-05', status: 'expiring', owner: 'Priya Patel', color: '#ffb347' },
  { id: '5', name: 'slack-webhook-url', type: 'webhook', engine: 'vault', path: 'secret/data/integrations/slack', version: 2, created: '2026-05-01', updated: '2026-05-01', expires: '—', status: 'active', owner: 'Emily Davis', color: '#22d97a' },
  { id: '6', name: 'legacy-ssh-key', type: 'ssh_key', engine: 'vault', path: 'secret/data/legacy/ssh', version: 1, created: '2025-11-01', updated: '2025-11-01', expires: '2026-05-01', status: 'expired', owner: 'James Wilson', color: '#6b7280' },
  { id: '7', name: 'encryption-master-key', type: 'encryption_key', engine: 'kms', path: 'kms/keys/prod-master', version: 15, created: '2025-01-15', updated: '2026-07-01', expires: '2027-01-15', status: 'active', owner: 'Security Admin', color: '#00e5ff' },
]

const TYPE_OPTIONS = [
  { value: 'password', label: 'Password' },
  { value: 'jwt', label: 'JWT Secret' },
  { value: 'connection_string', label: 'Connection String' },
  { value: 'aws_key', label: 'AWS Key' },
  { value: 'webhook', label: 'Webhook URL' },
  { value: 'ssh_key', label: 'SSH Key' },
  { value: 'encryption_key', label: 'Encryption Key' },
  { value: 'api_token', label: 'API Token' },
]

const ENGINE_OPTIONS = [
  { value: 'vault', label: 'HashiCorp Vault' },
  { value: 'aws_secrets_manager', label: 'AWS Secrets Manager' },
  { value: 'kms', label: 'AWS KMS' },
  { value: 'azure_key_vault', label: 'Azure Key Vault' },
  { value: 'gcp_secret_manager', label: 'GCP Secret Manager' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
]

export function SecuritySecrets() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [engineFilter, setEngineFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedSecrets, setSelectedSecrets] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSecret, setEditingSecret] = useState<typeof SECRETS_DATA[0] | null>(null)

  const filteredSecrets = useMemo(() => {
    return SECRETS_DATA.filter(secret => {
      const matchesSearch = secret.name.toLowerCase().includes(search.toLowerCase()) ||
        secret.path.toLowerCase().includes(search.toLowerCase()) ||
        secret.owner.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || secret.type === typeFilter
      const matchesEngine = !engineFilter || secret.engine === engineFilter
      const matchesStatus = !statusFilter || secret.status === statusFilter
      return matchesSearch && matchesType && matchesEngine && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, typeFilter, engineFilter, statusFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (secret: typeof SECRETS_DATA[0]) => {
    setEditingSecret(secret)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingSecret(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value)
  }

  const handleEngineFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEngineFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedSecrets(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'expiring': return 'warning'
      case 'expired': return 'error'
      case 'revoked': return 'default'
      default: return 'default'
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'password': 'Password',
      'jwt': 'JWT Secret',
      'connection_string': 'Conn. String',
      'aws_key': 'AWS Key',
      'webhook': 'Webhook',
      'ssh_key': 'SSH Key',
      'encryption_key': 'Enc. Key',
      'api_token': 'API Token',
    }
    return labels[type] || type
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (secret: typeof SECRETS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: secret.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: secret.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {secret.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Secret', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{secret.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{secret.path}</div>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <Badge variant="info" size="sm">{getTypeLabel(secret.type)}</Badge>
    )},
    { key: 'engine', header: 'Engine', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <Badge variant="default" size="sm">{secret.engine.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
    )},
    { key: 'version', header: 'Version', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <Badge variant="default" size="sm">v{secret.version}</Badge>
    )},
    { key: 'owner', header: 'Owner', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{secret.owner}</div>
    )},
    { key: 'updated', header: 'Updated', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{secret.updated}</div>
    )},
    { key: 'expires', header: 'Expires', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{secret.expires}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (secret: typeof SECRETS_DATA[0]) => (
      <Badge variant={getStatusVariant(secret.status)} size="sm" dot>
        {secret.status.charAt(0).toUpperCase() + secret.status.slice(1)}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (secret: typeof SECRETS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(secret) }}>
        {secret.status === 'active' ? 'Rotate' : 'View'}
      </Button>
    )},
  ]

  // Summary
  const activeCount = SECRETS_DATA.filter(s => s.status === 'active').length
  const expiringCount = SECRETS_DATA.filter(s => s.status === 'expiring').length
  const expiredCount = SECRETS_DATA.filter(s => s.status === 'expired').length

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Secrets</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {SECRETS_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>🔐</div>
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
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Expiring Soon</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: expiringCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {expiringCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: expiringCount > 0 ? 'var(--color-warning-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: expiringCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {expiringCount > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Expired/Revoked</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: expiredCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {expiredCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: expiredCount > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: expiredCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {expiredCount > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search secrets..."
            value={search}
            onChange={handleSearchChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="sm"
          />
        </div>
        <Select
          value={typeFilter}
          onChangeRaw={handleTypeFilterChange}
          placeholder="All Types"
          options={TYPE_OPTIONS}
          size="sm"
          style={{ minWidth: 160 }}
        />
        <Select
          value={engineFilter}
          onChangeRaw={handleEngineFilterChange}
          placeholder="All Engines"
          options={ENGINE_OPTIONS}
          size="sm"
          style={{ minWidth: 160 }}
        />
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
            Create Secret
          </Button>
        </div>
      </div>

      {/* Secret Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredSecrets.length} of {SECRETS_DATA.length} secrets
        {selectedSecrets.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedSecrets.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredSecrets}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedSecrets)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No secrets found"
          selectable
        />
      </Card>

      {/* Create Secret Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New Secret"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Secret Name" placeholder="e.g., database-password" required />
            <Select
              label="Type"
              placeholder="Select secret type"
              options={TYPE_OPTIONS}
              required
            />
            <Select
              label="Engine"
              placeholder="Select secrets engine"
              options={ENGINE_OPTIONS}
              required
            />
            <Input label="Path" placeholder="secret/data/prod/db" required />
            <Input label="Value (will be encrypted)" type="password" placeholder="••••••••" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="TTL (days)" type="number" placeholder="365" defaultValue="365" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Secret</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit/rotate Secret Modal */}
      <Modal
        isOpen={!!editingSecret}
        onClose={closeModals}
        title={editingSecret?.status === 'active' ? 'Rotate Secret' : 'View Secret'}
        size="md"
      >
        {editingSecret && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  {editingSecret.status === 'active' ? 'Active Secret' : editingSecret.status === 'expiring' ? 'Expiring Secret' : 'Expired Secret'}
                </div>
                <Input label="Secret Name" defaultValue={editingSecret.name} disabled />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                  <Input label="Type" defaultValue={getTypeLabel(editingSecret.type)} disabled />
                  <Input label="Engine" defaultValue={editingSecret.engine.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} disabled />
                </div>
                <Input label="Path" defaultValue={editingSecret.path} disabled />
              </div>
              {editingSecret.status === 'active' && (
                <>
                  <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-warning-base)/10', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning-base)/30' }}>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-warning-base)', marginBottom: 'var(--spacing-2)' }}>
                      <strong>Warning:</strong> Rotating this secret will invalidate the current version immediately. Update all consumers before proceeding.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Confirm Rotation</div>
                        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>I understand this will invalidate the current secret</div>
                      </div>
                      <input type="checkbox" />
                    </div>
                  </div>
                  <Input label="New Value" type="password" placeholder="Enter new secret value" />
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" onClick={closeModals}>Cancel</Button>
                <Button variant={editingSecret.status === 'active' ? 'primary' : 'ghost'} disabled={editingSecret.status !== 'active'}>
                  {editingSecret.status === 'active' ? 'Rotate Secret' : 'Close'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}