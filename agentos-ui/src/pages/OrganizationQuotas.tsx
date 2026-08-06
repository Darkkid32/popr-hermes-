// Organization Quotas Tab
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

const QUOTAS_DATA = [
  { id: '1', name: 'Workspaces', resource: 'workspaces', limit: 20, used: 12, unit: 'workspaces', period: 'monthly', scope: 'organization', status: 'normal', color: '#7c6cf5' },
  { id: '2', name: 'Projects', resource: 'projects', limit: 200, used: 89, unit: 'projects', period: 'monthly', scope: 'organization', status: 'normal', color: '#22d97a' },
  { id: '3', name: 'Models', resource: 'models', limit: 100, used: 47, unit: 'models', period: 'monthly', scope: 'organization', status: 'normal', color: '#00e5ff' },
  { id: '4', name: 'Model Deployments', resource: 'model_deployments', limit: 50, used: 23, unit: 'deployments', period: 'monthly', scope: 'organization', status: 'normal', color: '#d946ef' },
  { id: '5', name: 'API Requests', resource: 'api_requests', limit: 10000000, used: 4200000, unit: 'requests', period: 'monthly', scope: 'organization', status: 'normal', color: '#ff4d6d' },
  { id: '6', name: 'Storage', resource: 'storage', limit: 5000, used: 1847, unit: 'GB', period: 'monthly', scope: 'organization', status: 'normal', color: '#ffb347' },
  { id: '7', name: 'Compute (vCPU-hours)', resource: 'compute', limit: 500000, used: 187000, unit: 'vCPU-hrs', period: 'monthly', scope: 'organization', status: 'normal', color: '#f06292' },
  { id: '8', name: 'Memory', resource: 'memory', limit: 2000000, used: 720000, unit: 'GB-hrs', period: 'monthly', scope: 'organization', status: 'normal', color: '#7c6cf5' },
  { id: '9', name: 'GPU Hours', resource: 'gpu_hours', limit: 10000, used: 3400, unit: 'GPU-hrs', period: 'monthly', scope: 'organization', status: 'warning', color: '#ffb347' },
  { id: '10', name: 'Team Members', resource: 'team_members', limit: 500, used: 247, unit: 'members', period: 'monthly', scope: 'organization', status: 'normal', color: '#22d97a' },
  { id: '11', name: 'Teams', resource: 'teams', limit: 50, used: 18, unit: 'teams', period: 'monthly', scope: 'organization', status: 'normal', color: '#00e5ff' },
  { id: '12', name: 'Custom Roles', resource: 'custom_roles', limit: 50, used: 4, unit: 'roles', period: 'monthly', scope: 'organization', status: 'normal', color: '#d946ef' },
  { id: '13', name: 'SSO Providers', resource: 'sso_providers', limit: 10, used: 3, unit: 'providers', period: 'monthly', scope: 'organization', status: 'normal', color: '#ff4d6d' },
  { id: '14', name: 'Webhooks', resource: 'webhooks', limit: 100, used: 12, unit: 'webhooks', period: 'monthly', scope: 'organization', status: 'normal', color: '#7c6cf5' },
  { id: '15', name: 'Audit Log Retention', resource: 'audit_retention', limit: 365, used: 365, unit: 'days', period: 'monthly', scope: 'organization', status: 'normal', color: '#f06292' },
  { id: '16', name: 'Concurrent Builds', resource: 'concurrent_builds', limit: 20, used: 7, unit: 'builds', period: 'concurrent', scope: 'organization', status: 'normal', color: '#22d97a' },
  { id: '17', name: 'Workflow Executions', resource: 'workflow_executions', limit: 50000, used: 12400, unit: 'executions', period: 'monthly', scope: 'organization', status: 'normal', color: '#00e5ff' },
  { id: '18', name: 'Plugin Installs', resource: 'plugin_installs', limit: 200, used: 45, unit: 'plugins', period: 'monthly', scope: 'organization', status: 'normal', color: '#ff4d6d' },
  { id: '19', name: 'Skill Executions', resource: 'skill_executions', limit: 100000, used: 23000, unit: 'executions', period: 'monthly', scope: 'organization', status: 'normal', color: '#ffb347' },
  { id: '20', name: 'MCP Servers', resource: 'mcp_servers', limit: 50, used: 8, unit: 'servers', period: 'monthly', scope: 'organization', status: 'normal', color: '#7c6cf5' },
]

const SCOPE_OPTIONS = [
  { value: 'organization', label: 'Organization' },
  { value: 'workspace', label: 'Per Workspace' },
  { value: 'team', label: 'Per Team' },
  { value: 'user', label: 'Per User' },
]

const PERIOD_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'concurrent', label: 'Concurrent' },
]

const STATUS_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
  { value: 'exceeded', label: 'Exceeded' },
]

export function OrganizationQuotas() {
  const [search, setSearch] = useState('')
  const [scopeFilter, setScopeFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedQuotas, setSelectedQuotas] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQuota, setEditingQuota] = useState<typeof QUOTAS_DATA[0] | null>(null)

  const filteredQuotas = useMemo(() => {
    return QUOTAS_DATA.filter(quota => {
      const matchesSearch = quota.name.toLowerCase().includes(search.toLowerCase()) ||
        quota.resource.toLowerCase().includes(search.toLowerCase())
      const matchesScope = !scopeFilter || quota.scope === scopeFilter
      const matchesPeriod = !periodFilter || quota.period === periodFilter
      const matchesStatus = !statusFilter || quota.status === statusFilter
      return matchesSearch && matchesScope && matchesPeriod && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, scopeFilter, periodFilter, statusFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (quota: typeof QUOTAS_DATA[0]) => {
    setEditingQuota(quota)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingQuota(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleScopeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setScopeFilter(e.target.value)
  }

  const handlePeriodFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPeriodFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedQuotas(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'normal': return 'success'
      case 'warning': return 'warning'
      case 'critical': return 'error'
      case 'exceeded': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal'
      case 'warning': return 'Warning'
      case 'critical': return 'Critical'
      case 'exceeded': return 'Exceeded'
      default: return status
    }
  }

  const getUsagePercent = (quota: typeof QUOTAS_DATA[0]) => {
    if (quota.period === 'concurrent') return (quota.used / quota.limit) * 100
    return (quota.used / quota.limit) * 100
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (quota: typeof QUOTAS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: quota.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: quota.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {quota.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Quota', sortable: true, render: (quota: typeof QUOTAS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{quota.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{quota.resource}</div>
      </div>
    )},
    { key: 'scope', header: 'Scope', sortable: true, render: (quota: typeof QUOTAS_DATA[0]) => (
      <Badge variant="info" size="sm">{quota.scope.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
    )},
    { key: 'period', header: 'Period', sortable: true, render: (quota: typeof QUOTAS_DATA[0]) => (
      <Badge variant="default" size="sm">{quota.period.charAt(0).toUpperCase() + quota.period.slice(1)}</Badge>
    )},
    { key: 'usage', header: 'Usage', sortable: true, render: (quota: typeof QUOTAS_DATA[0]) => (
      <div style={{ minWidth: 140 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
          <div style={{ flex: 1, height: 6, backgroundColor: 'var(--color-surface-container-high)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(getUsagePercent(quota), 100)}%`, height: '100%', backgroundColor: quota.status === 'exceeded' || quota.status === 'critical' ? 'var(--color-error-base)' : quota.status === 'warning' ? 'var(--color-warning-base)' : quota.color, borderRadius: '3px', transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard)' }} />
          </div>
          <span style={{ fontSize: 'var(--text-body-xs)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
            {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} {quota.unit}
          </span>
        </div>
      </div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (quota: typeof QUOTAS_DATA[0]) => (
      <Badge variant={getStatusVariant(quota.status)} size="sm" dot>
        {getStatusLabel(quota.status)}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (quota: typeof QUOTAS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(quota) }}>Edit</Button>
    )},
  ]

  // Summary
  const warningCount = QUOTAS_DATA.filter(q => q.status === 'warning').length
  const criticalCount = QUOTAS_DATA.filter(q => q.status === 'critical' || q.status === 'exceeded').length
  const totalQuotas = QUOTAS_DATA.length

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Quotas</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {totalQuotas}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📊</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Warnings</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: warningCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {warningCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: warningCount > 0 ? 'var(--color-warning-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: warningCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {warningCount > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Critical</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: criticalCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {criticalCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: criticalCount > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: criticalCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {criticalCount > 0 ? '🔴' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Avg Utilization</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {Math.round(QUOTAS_DATA.reduce((sum, q) => sum + getUsagePercent(q), 0) / QUOTAS_DATA.length)}%
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>📈</div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search quotas..."
            value={search}
            onChange={handleSearchChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="sm"
          />
        </div>
        <Select
          value={scopeFilter}
          onChangeRaw={handleScopeFilterChange}
          placeholder="All Scopes"
          options={SCOPE_OPTIONS}
          size="sm"
          style={{ minWidth: 160 }}
        />
        <Select
          value={periodFilter}
          onChangeRaw={handlePeriodFilterChange}
          placeholder="All Periods"
          options={PERIOD_OPTIONS}
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
            Add Quota
          </Button>
        </div>
      </div>

      {/* Quota Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredQuotas.length} of {QUOTAS_DATA.length} quotas
        {selectedQuotas.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedQuotas.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredQuotas}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedQuotas)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No quotas found"
          selectable
        />
      </Card>

      {/* Create Quota Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Add New Quota"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Quota Name" placeholder="e.g., API Requests" required />
            <Input label="Resource Key" placeholder="e.g., api_requests" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Select
                label="Scope"
                placeholder="Select scope"
                options={SCOPE_OPTIONS}
                required
              />
              <Select
                label="Period"
                placeholder="Select period"
                options={PERIOD_OPTIONS}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Input label="Limit" type="number" placeholder="10000000" required />
              <Input label="Unit" placeholder="requests" required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Add Quota</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Quota Modal */}
      <Modal
        isOpen={!!editingQuota}
        onClose={closeModals}
        title="Edit Quota"
        size="md"
      >
        {editingQuota && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="Quota Name" defaultValue={editingQuota.name} />
              <Input label="Resource Key" defaultValue={editingQuota.resource} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <Select
                  label="Scope"
                  value={editingQuota.scope}
                  onChangeRaw={() => { /* update scope */ }}
                  options={SCOPE_OPTIONS}
                />
                <Select
                  label="Period"
                  value={editingQuota.period}
                  onChangeRaw={() => { /* update period */ }}
                  options={PERIOD_OPTIONS}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <Input label="Limit" type="number" defaultValue={String(editingQuota.limit)} />
                <Input label="Unit" defaultValue={editingQuota.unit} />
              </div>
              <Select
                label="Status"
                value={editingQuota.status}
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