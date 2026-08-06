// Security Roles Tab
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

const ROLES_DATA = [
  { id: '1', name: 'Owner', description: 'Full organization access including security settings', permissions: 47, users: 1, type: 'system', risk: 'critical', color: '#d946ef' },
  { id: '2', name: 'Security Admin', description: 'Full security configuration and incident management', permissions: 42, users: 3, type: 'system', risk: 'high', color: '#ff4d6d' },
  { id: '3', name: 'Security Analyst', description: 'Threat monitoring, investigation, and response', permissions: 28, users: 8, type: 'system', risk: 'medium', color: '#ffb347' },
  { id: '4', name: 'Compliance Officer', description: 'Audit logs, compliance reporting, policy review', permissions: 19, users: 2, type: 'custom', risk: 'medium', color: '#00e5ff' },
  { id: '5', name: 'Incident Responder', description: 'Incident triage, containment, and remediation', permissions: 22, users: 5, type: 'custom', risk: 'high', color: '#22d97a' },
  { id: '6', name: 'Viewer', description: 'Read-only access to security dashboards', permissions: 12, users: 12, type: 'system', risk: 'low', color: '#7c6cf5' },
  { id: '7', name: 'DevSecOps Engineer', description: 'CI/CD security, vulnerability scanning, secrets management', permissions: 25, users: 4, type: 'custom', risk: 'medium', color: '#f06292' },
  { id: '8', name: 'Auditor', description: 'Compliance audit access, evidence collection', permissions: 15, users: 3, type: 'custom', risk: 'low', color: '#6b7280' },
]

const TYPE_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'custom', label: 'Custom' },
]

const RISK_OPTIONS = [
  { value: '', label: 'All Risk Levels' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function SecurityRoles() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRole, setEditingRole] = useState<typeof ROLES_DATA[0] | null>(null)

  const filteredRoles = useMemo(() => {
    return ROLES_DATA.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || role.type === typeFilter
      const matchesRisk = !riskFilter || role.risk === riskFilter
      return matchesSearch && matchesType && matchesRisk
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, typeFilter, riskFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (role: typeof ROLES_DATA[0]) => {
    setEditingRole(role)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingRole(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value)
  }

  const handleRiskFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRiskFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedRoles(new Set(selected))
  }

  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'critical': return 'error'
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (role: typeof ROLES_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: role.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: role.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {role.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Role', sortable: true, render: (role: typeof ROLES_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{role.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{role.description}</div>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (role: typeof ROLES_DATA[0]) => (
      <Badge variant={role.type === 'system' ? 'default' : 'info'} size="sm">
        {role.type.charAt(0).toUpperCase() + role.type.slice(1)}
      </Badge>
    )},
    { key: 'risk', header: 'Risk Level', sortable: true, render: (role: typeof ROLES_DATA[0]) => (
      <Badge variant={getRiskVariant(role.risk)} size="sm" dot>
        {role.risk.charAt(0).toUpperCase() + role.risk.slice(1)}
      </Badge>
    )},
    { key: 'permissions', header: 'Permissions', sortable: true, render: (role: typeof ROLES_DATA[0]) => (
      <Badge variant="default" size="sm">{role.permissions}</Badge>
    )},
    { key: 'users', header: 'Users', sortable: true, render: (role: typeof ROLES_DATA[0]) => (
      <Badge variant="default" size="sm">{role.users}</Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (role: typeof ROLES_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(role) }} disabled={role.type === 'system'}>Edit</Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search roles..."
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
          style={{ minWidth: 140 }}
        />
        <Select
          value={riskFilter}
          onChangeRaw={handleRiskFilterChange}
          placeholder="All Risk Levels"
          options={RISK_OPTIONS}
          size="sm"
          style={{ minWidth: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Create Role
          </Button>
        </div>
      </div>

      {/* Role Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredRoles.length} of {ROLES_DATA.length} roles
        {selectedRoles.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedRoles.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredRoles}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedRoles)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No roles found"
          selectable
        />
      </Card>

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create Custom Security Role"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Role Name" placeholder="e.g., Threat Hunter" required />
            <Textarea
              label="Description"
              placeholder="Brief description of the role's purpose"
              rows={3}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Base Permissions</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {['Threat Detection', 'Vulnerability Mgmt', 'Incident Response', 'Compliance', 'Audit Logs', 'User Mgmt', 'API Keys', 'Secrets', 'Certificates', 'Policies', 'Sessions', 'Settings'].map(p => (
                  <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)' }}>
                    <input type="checkbox" /> {p}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Role</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingRole}
        onClose={closeModals}
        title="Edit Role"
        size="md"
      >
        {editingRole && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  {editingRole.type === 'system' ? 'System Role (Limited Editing)' : 'Custom Role'}
                </div>
                <Input label="Role Name" defaultValue={editingRole.name} disabled={editingRole.type === 'system'} />
                <Textarea
                  label="Description"
                  defaultValue={editingRole.description}
                  rows={3}
                  disabled={editingRole.type === 'system'}
                />
              </div>
              <Select
                label="Risk Level"
                value={editingRole.risk}
                onChangeRaw={() => { /* update risk */ }}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
                disabled={editingRole.type === 'system'}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <Button variant="ghost" onClick={closeModals}>Cancel</Button>
                <Button variant="primary" disabled={editingRole.type === 'system'}>Save Changes</Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}