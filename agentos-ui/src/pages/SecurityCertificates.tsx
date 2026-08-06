// Security Certificates Tab
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

const CERTIFICATES_DATA = [
  { id: '1', name: 'hermes.ai', type: 'wildcard', issuer: 'Let\'s Encrypt', san: ['*.hermes.ai', 'hermes.ai'], issued: '2026-06-01', expires: '2026-08-30', status: 'expiring_soon', autoRenew: true, color: '#ffb347' },
  { id: '2', name: 'api.hermes.ai', type: 'single', issuer: 'DigiCert', san: ['api.hermes.ai'], issued: '2026-01-15', expires: '2027-01-15', status: 'valid', autoRenew: true, color: '#22d97a' },
  { id: '3', name: 'staging.hermes.ai', type: 'single', issuer: 'Let\'s Encrypt', san: ['staging.hermes.ai'], issued: '2026-06-01', expires: '2026-08-30', status: 'expiring_soon', autoRenew: true, color: '#ffb347' },
  { id: '4', name: 'internal.hermes.io', type: 'wildcard', issuer: 'Internal CA', san: ['*.internal.hermes.io'], issued: '2025-12-01', expires: '2026-12-01', status: 'valid', autoRenew: false, color: '#00e5ff' },
  { id: '5', name: 'legacy.hermes.net', type: 'single', issuer: 'GlobalSign', san: ['legacy.hermes.net'], issued: '2025-06-15', expires: '2026-06-15', status: 'expired', autoRenew: false, color: '#6b7280' },
  { id: '6', name: 'dev.hermes.local', type: 'wildcard', issuer: 'Self-Signed', san: ['*.dev.hermes.local'], issued: '2026-07-01', expires: '2027-07-01', status: 'valid', autoRenew: false, color: '#7c6cf5' },
]

const TYPE_OPTIONS = [
  { value: 'single', label: 'Single Domain' },
  { value: 'wildcard', label: 'Wildcard' },
  { value: 'multi', label: 'Multi-Domain (SAN)' },
]

const ISSUER_OPTIONS = [
  { value: 'lets_encrypt', label: 'Let\'s Encrypt' },
  { value: 'digicert', label: 'DigiCert' },
  { value: 'globalsign', label: 'GlobalSign' },
  { value: 'internal_ca', label: 'Internal CA' },
  { value: 'self_signed', label: 'Self-Signed' },
]

const STATUS_OPTIONS = [
  { value: 'valid', label: 'Valid' },
  { value: 'expiring_soon', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
]

export function SecurityCertificates() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedCerts, setSelectedCerts] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCert, setEditingCert] = useState<typeof CERTIFICATES_DATA[0] | null>(null)

  const filteredCerts = useMemo(() => {
    return CERTIFICATES_DATA.filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(search.toLowerCase()) ||
        cert.san.some(s => s.toLowerCase().includes(search.toLowerCase()))
      const matchesType = !typeFilter || cert.type === typeFilter
      const matchesStatus = !statusFilter || cert.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, typeFilter, statusFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (cert: typeof CERTIFICATES_DATA[0]) => {
    setEditingCert(cert)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingCert(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedCerts(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'valid': return 'success'
      case 'expiring_soon': return 'warning'
      case 'expired': return 'error'
      case 'revoked': return 'default'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid': return 'Valid'
      case 'expiring_soon': return 'Expiring Soon'
      case 'expired': return 'Expired'
      case 'revoked': return 'Revoked'
      default: return status
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: cert.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cert.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        📜
      </div>
    )},
    { key: 'name', header: 'Certificate', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{cert.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
          SAN: {cert.san.join(', ')}
        </div>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <Badge variant="info" size="sm">{cert.type.charAt(0).toUpperCase() + cert.type.slice(1)}</Badge>
    )},
    { key: 'issuer', header: 'Issuer', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <Badge variant="default" size="sm">{cert.issuer}</Badge>
    )},
    { key: 'issued', header: 'Issued', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{cert.issued}</div>
    )},
    { key: 'expires', header: 'Expires', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{cert.expires}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <Badge variant={getStatusVariant(cert.status)} size="sm" dot>
        {getStatusLabel(cert.status)}
      </Badge>
    )},
    { key: 'autoRenew', header: 'Auto-Renew', sortable: true, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <Badge variant={cert.autoRenew ? 'success' : 'default'} size="sm" dot>
        {cert.autoRenew ? 'Enabled' : 'Disabled'}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (cert: typeof CERTIFICATES_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(cert) }}>View</Button>
    )},
  ]

  // Summary
  const validCount = CERTIFICATES_DATA.filter(c => c.status === 'valid').length
  const expiringCount = CERTIFICATES_DATA.filter(c => c.status === 'expiring_soon').length
  const autoRenewCount = CERTIFICATES_DATA.filter(c => c.autoRenew).length

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Certificates</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {CERTIFICATES_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📜</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Valid</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                {validCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Expiring Soon (30d)</div>
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
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Auto-Renew Enabled</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-info-base)' }}>
                {autoRenewCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>🔄</div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search certificates..."
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
            Request Certificate
          </Button>
        </div>
      </div>

      {/* Certificate Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredCerts.length} of {CERTIFICATES_DATA.length} certificates
        {selectedCerts.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedCerts.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredCerts}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedCerts)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No certificates found"
          selectable
        />
      </Card>

      {/* Create Certificate Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Request New Certificate"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Domain Name" placeholder="e.g., *.example.com" required />
            <Select
              label="Type"
              placeholder="Select certificate type"
              options={TYPE_OPTIONS}
              required
            />
            <Select
              label="Issuer (CA)"
              placeholder="Select certificate authority"
              options={ISSUER_OPTIONS}
              required
            />
            <Input
              label="Subject Alternative Names (SANs)"
              placeholder="example.com, www.example.com, api.example.com"
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Auto-Renew</div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Automatically renew 30 days before expiration</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Request Certificate</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Certificate Modal */}
      <Modal
        isOpen={!!editingCert}
        onClose={closeModals}
        title="Certificate Details"
        size="md"
      >
        {editingCert && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  {editingCert.status === 'valid' ? 'Valid' : editingCert.status === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
                </div>
                <Input label="Domain" defaultValue={editingCert.name} disabled />
                <Input label="Issuer" defaultValue={editingCert.issuer} disabled />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                  <Input label="Issued" defaultValue={editingCert.issued} disabled />
                  <Input label="Expires" defaultValue={editingCert.expires} disabled />
                </div>
                <Input label="SANs" defaultValue={editingCert.san.join(', ')} disabled />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Auto-Renew</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Automatically renew before expiration</div>
                </div>
                <input type="checkbox" defaultChecked={editingCert.autoRenew} disabled />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" onClick={closeModals}>Close</Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}