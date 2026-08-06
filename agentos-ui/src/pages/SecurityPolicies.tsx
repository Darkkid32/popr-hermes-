// Security Policies Tab
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
import { Textarea } from '../design-system/components/forms/Input'

const POLICIES_DATA = [
  { id: '1', name: 'Password Policy', description: 'Minimum 12 chars, MFA required, rotation every 90 days', category: 'Authentication', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'GDPR'], lastUpdated: '2026-06-15', violations: 0, color: '#22d97a' },
  { id: '2', name: 'API Key Rotation', description: 'All API keys must be rotated every 365 days', category: 'Access Control', status: 'enforced', compliance: ['SOC2', 'ISO27001'], lastUpdated: '2026-05-20', violations: 3, color: '#ff4d6d' },
  { id: '3', name: 'Data Encryption', description: 'All data at rest and in transit must be encrypted', category: 'Data Protection', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA'], lastUpdated: '2026-04-10', violations: 0, color: '#00e5ff' },
  { id: '4', name: 'Network Segmentation', description: 'Production networks isolated from development', category: 'Network Security', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'PCI-DSS'], lastUpdated: '2026-03-01', violations: 1, color: '#d946ef' },
  { id: '5', name: 'Vulnerability Scanning', description: 'Weekly automated scans, critical findings SLA 24h', category: 'Vulnerability Mgmt', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'PCI-DSS'], lastUpdated: '2026-07-01', violations: 5, color: '#ffb347' },
  { id: '6', name: 'Incident Response', description: 'Security incidents must be reported within 1 hour', category: 'Incident Response', status: 'draft', compliance: ['SOC2', 'ISO27001'], lastUpdated: '2026-07-10', violations: 0, color: '#7c6cf5' },
  { id: '7', name: 'Access Review', description: 'Quarterly access reviews for all privileged roles', category: 'Access Control', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'SOX'], lastUpdated: '2026-04-01', violations: 2, color: '#f06292' },
  { id: '8', name: 'Logging & Monitoring', description: 'All security events logged and monitored 24/7', category: 'Monitoring', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'GDPR'], lastUpdated: '2026-02-15', violations: 0, color: '#22d97a' },
  { id: '9', name: 'Third-Party Risk', description: 'Annual security assessments for all vendors', category: 'Vendor Mgmt', status: 'enforced', compliance: ['SOC2', 'ISO27001'], lastUpdated: '2026-01-20', violations: 4, color: '#ffb347' },
  { id: '10', name: 'Backup & Recovery', description: 'Daily encrypted backups, recovery tested quarterly', category: 'Business Continuity', status: 'enforced', compliance: ['SOC2', 'ISO27001', 'GDPR'], lastUpdated: '2026-03-15', violations: 0, color: '#00e5ff' },
]

const CATEGORY_OPTIONS = ['All', 'Authentication', 'Access Control', 'Data Protection', 'Network Security', 'Vulnerability Mgmt', 'Incident Response', 'Monitoring', 'Vendor Mgmt', 'Business Continuity']
const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'enforced', label: 'Enforced' },
  { value: 'draft', label: 'Draft' },
  { value: 'deprecated', label: 'Deprecated' },
]

export function SecurityPolicies() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedPolicies, setSelectedPolicies] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<typeof POLICIES_DATA[0] | null>(null)

  const filteredPolicies = useMemo(() => {
    return POLICIES_DATA.filter(policy => {
      const matchesSearch = policy.name.toLowerCase().includes(search.toLowerCase()) ||
        policy.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || policy.category === categoryFilter
      const matchesStatus = !statusFilter || policy.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, categoryFilter, statusFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (policy: typeof POLICIES_DATA[0]) => {
    setEditingPolicy(policy)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingPolicy(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value)
  }

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedPolicies(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'enforced': return 'success'
      case 'draft': return 'warning'
      case 'deprecated': return 'default'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'enforced': return 'Enforced'
      case 'draft': return 'Draft'
      case 'deprecated': return 'Deprecated'
      default: return status
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (policy: typeof POLICIES_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: policy.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: policy.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {policy.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Policy', sortable: true, render: (policy: typeof POLICIES_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{policy.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{policy.description}</div>
      </div>
    )},
    { key: 'category', header: 'Category', sortable: true, render: (policy: typeof POLICIES_DATA[0]) => (
      <Badge variant="info" size="sm">{policy.category}</Badge>
    )},
    { key: 'compliance', header: 'Compliance', sortable: true, render: (policy: typeof POLICIES_DATA[0]) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        {policy.compliance.map(c => (
          <Badge key={c} variant="default" size="sm">{c}</Badge>
        ))}
      </div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (policy: typeof POLICIES_DATA[0]) => (
      <Badge variant={getStatusVariant(policy.status)} size="sm" dot>
        {getStatusLabel(policy.status)}
      </Badge>
    )},
    { key: 'violations', header: 'Violations', sortable: true, render: (policy: typeof POLICIES_DATA[0]) => (
      <Badge variant={policy.violations === 0 ? 'success' : policy.violations <= 2 ? 'warning' : 'error'} size="sm">
        {policy.violations}
      </Badge>
    )},
    { key: 'lastUpdated', header: 'Last Updated', sortable: true, render: (policy: typeof POLICIES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{policy.lastUpdated}</div>
    )},
    { key: 'actions', header: '', width: 80, render: (policy: typeof POLICIES_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(policy) }}>Edit</Button>
    )},
  ]

  // Summary
  const enforcedCount = POLICIES_DATA.filter(p => p.status === 'enforced').length
  const draftCount = POLICIES_DATA.filter(p => p.status === 'draft').length
  const totalViolations = POLICIES_DATA.reduce((sum, p) => sum + p.violations, 0)

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Policies</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {POLICIES_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📋</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Enforced</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                {enforcedCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Draft</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: draftCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {draftCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: draftCount > 0 ? 'var(--color-warning-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: draftCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {draftCount > 0 ? '📝' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Violations</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: totalViolations > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {totalViolations}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: totalViolations > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: totalViolations > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {totalViolations > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search policies..."
            value={search}
            onChange={handleSearchChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="sm"
          />
        </div>
        <Select
          value={categoryFilter}
          onChangeRaw={handleCategoryChange}
          placeholder="All Categories"
          options={CATEGORY_OPTIONS.map(c => ({ value: c, label: c }))}
          size="sm"
          style={{ minWidth: 180 }}
        />
        <Select
          value={statusFilter}
          onChangeRaw={handleStatusChange}
          placeholder="All Status"
          options={STATUS_OPTIONS}
          size="sm"
          style={{ minWidth: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Create Policy
          </Button>
        </div>
      </div>

      {/* Policy Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredPolicies.length} of {POLICIES_DATA.length} policies
        {selectedPolicies.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedPolicies.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredPolicies}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedPolicies)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No policies found"
          selectable
        />
      </Card>

      {/* Create Policy Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New Policy"
        size="lg"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Policy Name" placeholder="e.g., Zero Trust Network" required />
            <Textarea
              label="Description"
              placeholder="Brief description of the policy"
              rows={3}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Select
                label="Category"
                placeholder="Select category"
                options={CATEGORY_OPTIONS.filter(c => c !== 'All').map(c => ({ value: c, label: c }))}
                required
              />
              <Select
                label="Status"
                placeholder="Select status"
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'enforced', label: 'Enforced' },
                ]}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Compliance Frameworks</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI-DSS', 'SOX'].map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)' }}>
                    <input type="checkbox" /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Policy</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Policy Modal */}
      <Modal
        isOpen={!!editingPolicy}
        onClose={closeModals}
        title="Edit Policy"
        size="lg"
      >
        {editingPolicy && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="Policy Name" defaultValue={editingPolicy.name} />
              <Textarea
                label="Description"
                defaultValue={editingPolicy.description}
                rows={3}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <Select
                  label="Category"
                  value={editingPolicy.category}
                  onChangeRaw={() => { /* update category */ }}
                  options={CATEGORY_OPTIONS.filter(c => c !== 'All').map(c => ({ value: c, label: c }))}
                />
                <Select
                  label="Status"
                  value={editingPolicy.status}
                  onChangeRaw={() => { /* update status */ }}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'enforced', label: 'Enforced' },
                    { value: 'deprecated', label: 'Deprecated' },
                  ]}
                />
              </div>
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