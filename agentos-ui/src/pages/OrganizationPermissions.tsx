// Organization Permissions Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'

const PERMISSIONS_DATA = [
  { id: '1', name: 'workspaces.read', description: 'View workspaces and their metadata', category: 'Workspaces', risk: 'low' },
  { id: '2', name: 'workspaces.write', description: 'Create and modify workspaces', category: 'Workspaces', risk: 'medium' },
  { id: '3', name: 'workspaces.delete', description: 'Delete workspaces', category: 'Workspaces', risk: 'high' },
  { id: '4', name: 'workspaces.admin', description: 'Full workspace administration', category: 'Workspaces', risk: 'high' },
  { id: '5', name: 'projects.read', description: 'View projects and their metadata', category: 'Projects', risk: 'low' },
  { id: '6', name: 'projects.write', description: 'Create and modify projects', category: 'Projects', risk: 'medium' },
  { id: '7', name: 'projects.delete', description: 'Delete projects', category: 'Projects', risk: 'high' },
  { id: '8', name: 'projects.admin', description: 'Full project administration', category: 'Projects', risk: 'high' },
  { id: '9', name: 'models.read', description: 'View models and configurations', category: 'Models', risk: 'low' },
  { id: '10', name: 'models.write', description: 'Create and modify models', category: 'Models', risk: 'medium' },
  { id: '11', name: 'models.deploy', description: 'Deploy models to production', category: 'Models', risk: 'high' },
  { id: '12', name: 'models.admin', description: 'Full model administration', category: 'Models', risk: 'high' },
  { id: '13', name: 'memory.read', description: 'View memory and knowledge bases', category: 'Memory', risk: 'low' },
  { id: '14', name: 'memory.write', description: 'Create and modify memories', category: 'Memory', risk: 'medium' },
  { id: '15', name: 'memory.admin', description: 'Full memory administration', category: 'Memory', risk: 'high' },
  { id: '16', name: 'plugins.read', description: 'View plugins and marketplace', category: 'Plugins', risk: 'low' },
  { id: '17', name: 'plugins.install', description: 'Install plugins', category: 'Plugins', risk: 'medium' },
  { id: '18', name: 'plugins.admin', description: 'Full plugin administration', category: 'Plugins', risk: 'high' },
  { id: '19', name: 'skills.read', description: 'View skills and templates', category: 'Skills', risk: 'low' },
  { id: '20', name: 'skills.write', description: 'Create and modify skills', category: 'Skills', risk: 'medium' },
  { id: '21', name: 'skills.admin', description: 'Full skills administration', category: 'Skills', risk: 'high' },
  { id: '22', name: 'mcp.read', description: 'View MCP servers and tools', category: 'MCP', risk: 'low' },
  { id: '23', name: 'mcp.write', description: 'Configure MCP servers', category: 'MCP', risk: 'medium' },
  { id: '24', name: 'mcp.admin', description: 'Full MCP administration', category: 'MCP', risk: 'high' },
  { id: '25', name: 'settings.read', description: 'View organization settings', category: 'Settings', risk: 'low' },
  { id: '26', name: 'settings.write', description: 'Modify organization settings', category: 'Settings', risk: 'medium' },
  { id: '27', name: 'settings.admin', description: 'Full settings administration', category: 'Settings', risk: 'high' },
  { id: '28', name: 'security.read', description: 'View security dashboard', category: 'Security', risk: 'low' },
  { id: '29', name: 'security.write', description: 'Manage security policies', category: 'Security', risk: 'high' },
  { id: '30', name: 'security.admin', description: 'Full security administration', category: 'Security', risk: 'critical' },
  { id: '31', name: 'billing.read', description: 'View billing and usage', category: 'Billing', risk: 'medium' },
  { id: '32', name: 'billing.write', description: 'Manage billing and subscriptions', category: 'Billing', risk: 'high' },
  { id: '33', name: 'members.read', description: 'View organization members', category: 'Members', risk: 'low' },
  { id: '34', name: 'members.write', description: 'Invite and manage members', category: 'Members', risk: 'medium' },
  { id: '35', name: 'members.admin', description: 'Full member administration', category: 'Members', risk: 'high' },
  { id: '36', name: 'teams.read', description: 'View teams', category: 'Teams', risk: 'low' },
  { id: '37', name: 'teams.write', description: 'Create and manage teams', category: 'Teams', risk: 'medium' },
  { id: '38', name: 'teams.admin', description: 'Full team administration', category: 'Teams', risk: 'high' },
  { id: '39', name: 'roles.read', description: 'View roles and permissions', category: 'Roles', risk: 'low' },
  { id: '40', name: 'roles.write', description: 'Create and manage roles', category: 'Roles', risk: 'high' },
  { id: '41', name: 'audit.read', description: 'View audit logs', category: 'Audit', risk: 'medium' },
  { id: '42', name: 'audit.export', description: 'Export audit logs', category: 'Audit', risk: 'high' },
  { id: '43', name: 'sso.read', description: 'View SSO configuration', category: 'SSO', risk: 'medium' },
  { id: '44', name: 'sso.write', description: 'Configure SSO providers', category: 'SSO', risk: 'high' },
  { id: '45', name: 'environments.read', description: 'View environments', category: 'Environments', risk: 'low' },
  { id: '46', name: 'environments.write', description: 'Manage environments', category: 'Environments', risk: 'medium' },
  { id: '47', name: 'licenses.read', description: 'View licenses and compliance', category: 'Licenses', risk: 'low' },
  { id: '48', name: 'quotas.read', description: 'View quotas and limits', category: 'Quotas', risk: 'low' },
  { id: '49', name: 'quotas.write', description: 'Manage quotas and limits', category: 'Quotas', risk: 'high' },
  { id: '50', name: 'activity.read', description: 'View organization activity', category: 'Activity', risk: 'low' },
]

const CATEGORIES = ['All', 'Workspaces', 'Projects', 'Models', 'Memory', 'Plugins', 'Skills', 'MCP', 'Settings', 'Security', 'Billing', 'Members', 'Teams', 'Roles', 'Audit', 'SSO', 'Environments', 'Licenses', 'Quotas', 'Activity']
const RISK_OPTIONS = ['All', 'low', 'medium', 'high', 'critical']

export function OrganizationPermissions() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredPermissions = useMemo(() => {
    return PERMISSIONS_DATA.filter(perm => {
      const matchesSearch = perm.name.toLowerCase().includes(search.toLowerCase()) ||
        perm.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || perm.category === categoryFilter
      const matchesRisk = riskFilter === 'All' || perm.risk === riskFilter
      return matchesSearch && matchesCategory && matchesRisk
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, categoryFilter, riskFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value)
  }

  const handleRiskChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRiskFilter(e.target.value)
  }

  const columns = [
    { key: 'name', header: 'Permission', sortable: true, render: (perm: typeof PERMISSIONS_DATA[0]) => (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{perm.name}</div>
    )},
    { key: 'description', header: 'Description', sortable: true, render: (perm: typeof PERMISSIONS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{perm.description}</div>
    )},
    { key: 'category', header: 'Category', sortable: true, render: (perm: typeof PERMISSIONS_DATA[0]) => (
      <Badge variant="info" size="sm">{perm.category}</Badge>
    )},
    { key: 'risk', header: 'Risk Level', sortable: true, render: (perm: typeof PERMISSIONS_DATA[0]) => (
      <Badge
        variant={perm.risk === 'low' ? 'success' : perm.risk === 'medium' ? 'warning' : perm.risk === 'high' ? 'error' : 'error'}
        size="sm"
        dot
      >
        {perm.risk.charAt(0).toUpperCase() + perm.risk.slice(1)}
      </Badge>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search permissions..."
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
          options={CATEGORIES.map(c => ({ value: c, label: c }))}
          size="sm"
          style={{ minWidth: 160 }}
        />
        <Select
          value={riskFilter}
          onChangeRaw={handleRiskChange}
          placeholder="All Risk Levels"
          options={RISK_OPTIONS.map(r => ({ value: r, label: r }))}
          size="sm"
          style={{ minWidth: 140 }}
        />
      </div>

      {/* Permission Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredPermissions.length} of {PERMISSIONS_DATA.length} permissions
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredPermissions}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No permissions found"
          striped
        />
      </Card>

      {/* Category Summary */}
      <div style={{ marginTop: 'var(--spacing-6)' }}>
        <Card variant="outlined">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              PERMISSIONS BY CATEGORY
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-3)' }}>
            {CATEGORIES.filter(c => c !== 'All').map(cat => {
              const count = PERMISSIONS_DATA.filter(p => p.category === cat).length
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{cat}</span>
                  <Badge variant="default" size="sm">{count}</Badge>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}