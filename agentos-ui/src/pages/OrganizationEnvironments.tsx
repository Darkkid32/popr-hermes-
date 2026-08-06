// Organization Environments Tab
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

const ENVIRONMENTS_DATA = [
  { id: '1', name: 'production', displayName: 'Production', description: 'Live production environment', region: 'us-east-1', cluster: 'prod-cluster-1', nodes: 12, cpu: '256 vCPU', memory: '1024 GB', storage: '2.4 TB', status: 'healthy', cost: '$12,450/mo', color: '#22d97a' },
  { id: '2', name: 'staging', displayName: 'Staging', description: 'Pre-production staging', region: 'us-east-1', cluster: 'staging-cluster-1', nodes: 6, cpu: '128 vCPU', memory: '512 GB', storage: '1.2 TB', status: 'healthy', cost: '$4,200/mo', color: '#ffb347' },
  { id: '3', name: 'development', displayName: 'Development', description: 'Shared development environment', region: 'us-west-2', cluster: 'dev-cluster-1', nodes: 8, cpu: '128 vCPU', memory: '256 GB', storage: '800 GB', status: 'degraded', cost: '$3,800/mo', color: '#7c6cf5' },
  { id: '4', name: 'research', displayName: 'Research', description: 'ML research & experimentation', region: 'us-east-1', cluster: 'research-cluster-1', nodes: 4, cpu: '64 vCPU', memory: '256 GB', storage: '500 GB', status: 'healthy', cost: '$5,600/mo', color: '#d946ef' },
  { id: '5', name: 'data-platform', displayName: 'Data Platform', description: 'Data engineering & analytics', region: 'eu-west-1', cluster: 'data-cluster-1', nodes: 6, cpu: '96 vCPU', memory: '384 GB', storage: '1.8 TB', status: 'healthy', cost: '$4,900/mo', color: '#00e5ff' },
  { id: '6', name: 'sandbox', displayName: 'Sandbox', description: 'Personal experimentation', region: 'us-west-2', cluster: 'sandbox-cluster-1', nodes: 2, cpu: '16 vCPU', memory: '64 GB', storage: '200 GB', status: 'healthy', cost: '$450/mo', color: '#f06292' },
]

const STATUS_OPTIONS = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'unhealthy', label: 'Unhealthy' },
  { value: 'maintenance', label: 'Maintenance' },
]

export function OrganizationEnvironments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('displayName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedEnvironments, setSelectedEnvironments] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEnvironment, setEditingEnvironment] = useState<typeof ENVIRONMENTS_DATA[0] | null>(null)

  const filteredEnvironments = useMemo(() => {
    return ENVIRONMENTS_DATA.filter(env => {
      const matchesSearch = env.displayName.toLowerCase().includes(search.toLowerCase()) ||
        env.description.toLowerCase().includes(search.toLowerCase()) ||
        env.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || env.status === statusFilter
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

  const openEditModal = (env: typeof ENVIRONMENTS_DATA[0]) => {
    setEditingEnvironment(env)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingEnvironment(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedEnvironments(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'healthy': return 'success'
      case 'degraded': return 'warning'
      case 'unhealthy': return 'error'
      case 'maintenance': return 'info'
      default: return 'default'
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: env.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: env.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {env.displayName.charAt(0)}
      </div>
    )},
    { key: 'displayName', header: 'Environment', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{env.displayName}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{env.name}</div>
      </div>
    )},
    { key: 'description', header: 'Description', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{env.description}</div>
    )},
    { key: 'region', header: 'Region', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <Badge variant="info" size="sm">{env.region}</Badge>
    )},
    { key: 'cluster', header: 'Cluster', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{env.cluster}</div>
    )},
    { key: 'nodes', header: 'Nodes', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <Badge variant="default" size="sm">{env.nodes}</Badge>
    )},
    { key: 'cpu', header: 'CPU', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{env.cpu}</div>
    )},
    { key: 'memory', header: 'Memory', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{env.memory}</div>
    )},
    { key: 'storage', header: 'Storage', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{env.storage}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <Badge variant={getStatusVariant(env.status)} size="sm" dot>
        {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
      </Badge>
    )},
    { key: 'cost', header: 'Cost', sortable: true, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{env.cost}</div>
    )},
    { key: 'actions', header: '', width: 80, render: (env: typeof ENVIRONMENTS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(env) }}>Edit</Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search environments..."
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
          style={{ minWidth: 160 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Add Environment
          </Button>
        </div>
      </div>

      {/* Environment Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredEnvironments.length} of {ENVIRONMENTS_DATA.length} environments
        {selectedEnvironments.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedEnvironments.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredEnvironments}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedEnvironments)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No environments found"
          selectable
        />
      </Card>

      {/* Resource Summary */}
      <div style={{ marginTop: 'var(--spacing-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Total Nodes</div>
          <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {ENVIRONMENTS_DATA.reduce((sum, e) => sum + e.nodes, 0)}
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Total vCPU</div>
          <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {ENVIRONMENTS_DATA.reduce((sum, e) => sum + parseInt(e.cpu.replace(' vCPU', '')), 0)} vCPU
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Total Memory</div>
          <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            {ENVIRONMENTS_DATA.reduce((sum, e) => sum + parseInt(e.memory.replace(' GB', '')), 0)} GB
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Monthly Cost</div>
          <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            ${ENVIRONMENTS_DATA.reduce((sum, e) => sum + parseFloat(e.cost.replace('$', '').replace(',', '').replace('/mo', '')), 0).toLocaleString()}/mo
          </div>
        </Card>
      </div>

      {/* Create Environment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Add New Environment"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="Environment Name" placeholder="e.g., production" required />
              <Input label="Display Name" placeholder="e.g., Production" required />
            </div>
            <Textarea
              label="Description"
              placeholder="Brief description of the environment"
              rows={2}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="Region" placeholder="e.g., us-east-1" required />
              <Input label="Cluster Name" placeholder="e.g., prod-cluster-1" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="Nodes" type="number" placeholder="12" />
              <Select
                label="Initial Status"
                placeholder="Select status"
                options={STATUS_OPTIONS}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Add Environment</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Environment Modal */}
      <Modal
        isOpen={!!editingEnvironment}
        onClose={closeModals}
        title="Edit Environment"
        size="md"
      >
        {editingEnvironment && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="Display Name" defaultValue={editingEnvironment.displayName} />
              <Textarea
                label="Description"
                defaultValue={editingEnvironment.description}
                rows={2}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <Input label="Region" defaultValue={editingEnvironment.region} />
                <Input label="Cluster" defaultValue={editingEnvironment.cluster} />
              </div>
              <Select
                label="Status"
                value={editingEnvironment.status}
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