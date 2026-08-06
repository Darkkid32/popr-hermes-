// Organization Workspaces Tab
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

const WORKSPACES_DATA = [
  { id: '1', name: 'Production', description: 'Production environment workspace', type: 'production', members: 24, projects: 12, models: 8, storage: '45.2 GB', compute: '128 vCPU', status: 'active', owner: 'Sarah Chen', color: '#22d97a' },
  { id: '2', name: 'Staging', description: 'Staging environment for testing', type: 'staging', members: 18, projects: 8, models: 5, storage: '23.1 GB', compute: '64 vCPU', status: 'active', owner: 'Marcus Johnson', color: '#ffb347' },
  { id: '3', name: 'Development', description: 'Development workspace', type: 'development', members: 47, projects: 32, models: 15, storage: '67.8 GB', compute: '128 vCPU', status: 'active', owner: 'Alex Rivera', color: '#7c6cf5' },
  { id: '4', name: 'Research', description: 'ML research and experimentation', type: 'research', members: 12, projects: 15, models: 42, storage: '128.5 GB', compute: '256 vCPU', status: 'active', owner: 'Priya Patel', color: '#d946ef' },
  { id: '5', name: 'Data Platform', description: 'Data engineering and analytics', type: 'platform', members: 15, projects: 9, models: 3, storage: '89.3 GB', compute: '96 vCPU', status: 'active', owner: 'David Kim', color: '#00e5ff' },
  { id: '6', name: 'Legacy Support', description: 'Legacy system maintenance', type: 'legacy', members: 6, projects: 4, models: 1, storage: '12.4 GB', compute: '16 vCPU', status: 'inactive', owner: 'James Wilson', color: '#6b7280' },
  { id: '7', name: 'Sandbox', description: 'Personal experimentation', type: 'sandbox', members: 89, projects: 56, models: 23, storage: '34.7 GB', compute: '32 vCPU', status: 'active', owner: 'Emily Davis', color: '#f06292' },
  { id: '8', name: 'Client Demo', description: 'Client demonstration workspace', type: 'demo', members: 8, projects: 3, models: 2, storage: '5.2 GB', compute: '8 vCPU', status: 'active', owner: 'Amanda Foster', color: '#ff4d6d' },
]

const TYPE_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
  { value: 'research', label: 'Research' },
  { value: 'platform', label: 'Platform' },
  { value: 'legacy', label: 'Legacy' },
  { value: 'sandbox', label: 'Sandbox' },
  { value: 'demo', label: 'Demo' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
]

export function OrganizationWorkspaces() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState<typeof WORKSPACES_DATA[0] | null>(null)

  const filteredWorkspaces = useMemo(() => {
    return WORKSPACES_DATA.filter(ws => {
      const matchesSearch = ws.name.toLowerCase().includes(search.toLowerCase()) ||
        ws.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || ws.type === typeFilter
      const matchesStatus = !statusFilter || ws.status === statusFilter
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

  const openEditModal = (ws: typeof WORKSPACES_DATA[0]) => {
    setEditingWorkspace(ws)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingWorkspace(null)
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
    setSelectedWorkspaces(new Set(selected))
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: ws.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ws.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {ws.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Workspace', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{ws.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{ws.description}</div>
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <Badge variant="info" size="sm">{ws.type.charAt(0).toUpperCase() + ws.type.slice(1)}</Badge>
    )},
    { key: 'owner', header: 'Owner', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{ws.owner}</div>
    )},
    { key: 'members', header: 'Members', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <Badge variant="default" size="sm">{ws.members}</Badge>
    )},
    { key: 'projects', header: 'Projects', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <Badge variant="default" size="sm">{ws.projects}</Badge>
    )},
    { key: 'models', header: 'Models', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <Badge variant="default" size="sm">{ws.models}</Badge>
    )},
    { key: 'storage', header: 'Storage', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{ws.storage}</div>
    )},
    { key: 'compute', header: 'Compute', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{ws.compute}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <Badge variant={ws.status === 'active' ? 'success' : ws.status === 'inactive' ? 'warning' : 'default'} size="sm" dot>
        {ws.status.charAt(0).toUpperCase() + ws.status.slice(1)}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (ws: typeof WORKSPACES_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(ws) }}>Edit</Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search workspaces..."
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
            Create Workspace
          </Button>
        </div>
      </div>

      {/* Workspace Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredWorkspaces.length} of {WORKSPACES_DATA.length} workspaces
        {selectedWorkspaces.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedWorkspaces.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredWorkspaces}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedWorkspaces)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No workspaces found"
          selectable
        />
      </Card>

      {/* Create Workspace Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New Workspace"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Workspace Name" placeholder="e.g., Production" required />
            <Textarea
              label="Description"
              placeholder="Brief description of the workspace"
              rows={3}
            />
            <Select
              label="Type"
              placeholder="Select workspace type"
              options={TYPE_OPTIONS}
              required
            />
            <Select
              label="Initial Owner"
              placeholder="Select owner"
              options={[
                { value: 'sarah-chen', label: 'Sarah Chen' },
                { value: 'marcus-johnson', label: 'Marcus Johnson' },
                { value: 'alex-rivera', label: 'Alex Rivera' },
                { value: 'priya-patel', label: 'Priya Patel' },
                { value: 'david-kim', label: 'David Kim' },
              ]}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Workspace</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Workspace Modal */}
      <Modal
        isOpen={!!editingWorkspace}
        onClose={closeModals}
        title="Edit Workspace"
        size="md"
      >
        {editingWorkspace && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="Workspace Name" defaultValue={editingWorkspace.name} />
              <Textarea
                label="Description"
                defaultValue={editingWorkspace.description}
                rows={3}
              />
              <Select
                label="Type"
                value={editingWorkspace.type}
                onChangeRaw={() => { /* update type */ }}
                options={TYPE_OPTIONS}
              />
              <Select
                label="Status"
                value={editingWorkspace.status}
                onChangeRaw={() => { /* update status */ }}
                options={STATUS_OPTIONS}
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