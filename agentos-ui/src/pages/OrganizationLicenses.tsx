// Organization Licenses Tab
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

const LICENSES_DATA = [
  { id: '1', name: 'Enterprise License', type: 'commercial', vendor: 'Hermes AI', seats: 500, used: 247, expires: '2027-01-15', status: 'active', cost: '$250,000/yr', autoRenew: true, color: '#22d97a' },
  { id: '2', name: 'ML Runtime License', type: 'commercial', vendor: 'NVIDIA', seats: 50, used: 38, expires: '2026-12-01', status: 'active', cost: '$85,000/yr', autoRenew: true, color: '#7c6cf5' },
  { id: '3', name: 'Security Suite', type: 'commercial', vendor: 'SentinelOne', seats: 250, used: 247, expires: '2026-11-20', status: 'expiring_soon', cost: '$120,000/yr', autoRenew: true, color: '#ffb347' },
  { id: '4', name: 'Monitoring Platform', type: 'commercial', vendor: 'Datadog', seats: 100, used: 89, expires: '2026-09-30', status: 'expiring_soon', cost: '$72,000/yr', autoRenew: false, color: '#ff4d6d' },
  { id: '5', name: 'Apache 2.0 Components', type: 'open_source', vendor: 'Apache Software Foundation', seats: '∞', used: 'N/A', expires: 'Perpetual', status: 'active', cost: 'Free', autoRenew: false, color: '#00e5ff' },
  { id: '6', name: 'MIT Licensed Libraries', type: 'open_source', vendor: 'Various', seats: '∞', used: 'N/A', expires: 'Perpetual', status: 'active', cost: 'Free', autoRenew: false, color: '#d946ef' },
  { id: '7', name: 'Proprietary ML Models', type: 'proprietary', vendor: 'Hermes AI', seats: 10, used: 8, expires: '2027-03-01', status: 'active', cost: '$180,000/yr', autoRenew: true, color: '#f06292' },
  { id: '8', name: 'Cloud Credits (AWS)', type: 'cloud_credits', vendor: 'Amazon Web Services', seats: 'N/A', used: '$45,200', expires: '2026-12-31', status: 'active', cost: '$100,000/yr', autoRenew: false, color: '#ffb347' },
]

const TYPE_OPTIONS = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'proprietary', label: 'Proprietary' },
  { value: 'cloud_credits', label: 'Cloud Credits' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expiring_soon', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrganizationLicenses() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedLicenses, setSelectedLicenses] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLicense, setEditingLicense] = useState<typeof LICENSES_DATA[0] | null>(null)

  const filteredLicenses = useMemo(() => {
    return LICENSES_DATA.filter(license => {
      const matchesSearch = license.name.toLowerCase().includes(search.toLowerCase()) ||
        license.vendor.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || license.type === typeFilter
      const matchesStatus = !statusFilter || license.status === statusFilter
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

  const openEditModal = (license: typeof LICENSES_DATA[0]) => {
    setEditingLicense(license)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingLicense(null)
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
    setSelectedLicenses(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'expiring_soon': return 'warning'
      case 'expired': return 'error'
      case 'cancelled': return 'default'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'expiring_soon': return 'Expiring Soon'
      case 'expired': return 'Expired'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'commercial': return 'info'
      case 'open_source': return 'success'
      case 'proprietary': return 'warning'
      case 'cloud_credits': return 'default'
      default: return 'default'
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (license: typeof LICENSES_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: license.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: license.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {license.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'License', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{license.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{license.vendor}</div>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <Badge variant={getTypeVariant(license.type)} size="sm">
        {license.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    )},
    { key: 'seats', header: 'Seats / Usage', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
        {typeof license.seats === 'number' ? `${license.used} / ${license.seats}` : `${license.used} / ${license.seats}`}
      </div>
    )},
    { key: 'expires', header: 'Expires', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{license.expires}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <Badge variant={getStatusVariant(license.status)} size="sm" dot>
        {getStatusLabel(license.status)}
      </Badge>
    )},
    { key: 'cost', header: 'Cost', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{license.cost}</div>
    )},
    { key: 'autoRenew', header: 'Auto-Renew', sortable: true, render: (license: typeof LICENSES_DATA[0]) => (
      <Badge variant={license.autoRenew ? 'success' : 'default'} size="sm" dot>
        {license.autoRenew ? 'Enabled' : 'Disabled'}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (license: typeof LICENSES_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(license) }}>Edit</Button>
    )},
  ]

  // Summary stats
  const totalCost = LICENSES_DATA.filter(l => l.status !== 'cancelled').reduce((sum, l) => {
    const costStr = l.cost.replace(/[$,]/g, '').replace('/yr', '').replace('/mo', '')
    return sum + parseFloat(costStr)
  }, 0)

  const expiringSoon = LICENSES_DATA.filter(l => l.status === 'expiring_soon').length
  const totalSeats = LICENSES_DATA.filter(l => typeof l.seats === 'number').reduce((sum, l) => sum + (l.seats as number), 0)
  const usedSeats = LICENSES_DATA.filter(l => typeof l.used === 'number').reduce((sum, l) => sum + (l.used as number), 0)

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Annual Cost</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>${totalCost.toLocaleString()}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>💰</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Seats Utilization</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0}%
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>👥</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Expiring Soon</div>
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
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Licenses</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {LICENSES_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📄</div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search licenses..."
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
          style={{ minWidth: 160 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Add License
          </Button>
        </div>
      </div>

      {/* License Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredLicenses.length} of {LICENSES_DATA.length} licenses
        {selectedLicenses.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedLicenses.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredLicenses}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedLicenses)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No licenses found"
          selectable
        />
      </Card>

      {/* Create License Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Add New License"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="License Name" placeholder="e.g., Enterprise License" required />
            <Select
              label="Type"
              placeholder="Select license type"
              options={TYPE_OPTIONS}
              required
            />
            <Input label="Vendor" placeholder="e.g., Hermes AI" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="Seats" type="number" placeholder="500" />
              <Input label="Cost (per year)" placeholder="$250,000/yr" />
            </div>
            <Input
              label="Expiration Date"
              type="date"
              placeholder="2027-01-15"
              required
            />
            <Select
              label="Auto-Renew"
              placeholder="Select auto-renew"
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' },
              ]}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Add License</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit License Modal */}
      <Modal
        isOpen={!!editingLicense}
        onClose={closeModals}
        title="Edit License"
        size="md"
      >
        {editingLicense && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="License Name" defaultValue={editingLicense.name} />
              <Input label="Vendor" defaultValue={editingLicense.vendor} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <Input label="Seats" type="number" defaultValue={typeof editingLicense.seats === 'number' ? String(editingLicense.seats) : ''} />
                <Input label="Cost" defaultValue={editingLicense.cost} />
              </div>
              <Input
                label="Expiration Date"
                type="date"
                defaultValue={editingLicense.expires === 'Perpetual' ? '' : editingLicense.expires}
              />
              <Select
                label="Status"
                value={editingLicense.status}
                onChangeRaw={() => { /* update status */ }}
                options={STATUS_OPTIONS}
              />
              <Select
                label="Auto-Renew"
                value={String(editingLicense.autoRenew)}
                onChangeRaw={() => { /* update auto-renew */ }}
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' },
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" onClick={closeModals}>Cancel</Button>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}