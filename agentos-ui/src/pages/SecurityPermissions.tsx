// Security Permissions Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'

const PERMISSIONS_DATA = [
  { id: '1', name: 'security.threats.read', description: 'View threat detection dashboard', category: 'Threat Detection', risk: 'low' },
  { id: '2', name: 'security.threats.write', description: 'Manage threat rules and configurations', category: 'Threat Detection', risk: 'high' },
  { id: '3', name: 'security.threats.dismiss', description: 'Dismiss or resolve threats', category: 'Threat Detection', risk: 'medium' },
  { id: '4', name: 'security.vulnerabilities.read', description: 'View vulnerability reports', category: 'Vulnerabilities', risk: 'low' },
  { id: '5', name: 'security.vulnerabilities.write', description: 'Manage vulnerability scanning and remediation', category: 'Vulnerabilities', risk: 'high' },
  { id: '6', name: 'security.vulnerabilities.remediate', description: 'Trigger remediation actions', category: 'Vulnerabilities', risk: 'high' },
  { id: '7', name: 'security.incidents.read', description: 'View security incidents', category: 'Incidents', risk: 'low' },
  { id: '8', name: 'security.incidents.write', description: 'Create and manage incidents', category: 'Incidents', risk: 'medium' },
  { id: '9', name: 'security.incidents.resolve', description: 'Resolve and close incidents', category: 'Incidents', risk: 'high' },
  { id: '10', name: 'security.incidents.escalate', description: 'Escalate incidents to higher tiers', category: 'Incidents', risk: 'high' },
  { id: '11', name: 'security.users.read', description: 'View security users and roles', category: 'Users & Roles', risk: 'low' },
  { id: '12', name: 'security.users.write', description: 'Manage security users', category: 'Users & Roles', risk: 'high' },
  { id: '13', name: 'security.roles.read', description: 'View security roles', category: 'Users & Roles', risk: 'low' },
  { id: '14', name: 'security.roles.write', description: 'Create and manage custom roles', category: 'Users & Roles', risk: 'critical' },
  { id: '15', name: 'security.api_keys.read', description: 'View API keys', category: 'API Keys', risk: 'medium' },
  { id: '16', name: 'security.api_keys.write', description: 'Create and rotate API keys', category: 'API Keys', risk: 'high' },
  { id: '17', name: 'security.api_keys.delete', description: 'Revoke API keys', category: 'API Keys', risk: 'critical' },
  { id: '18', name: 'security.secrets.read', description: 'View secrets metadata', category: 'Secrets', risk: 'high' },
  { id: '19', name: 'security.secrets.write', description: 'Create and manage secrets', category: 'Secrets', risk: 'critical' },
  { id: '20', name: 'security.secrets.rotate', description: 'Rotate secrets', category: 'Secrets', risk: 'critical' },
  { id: '21', name: 'security.certificates.read', description: 'View certificates', category: 'Certificates', risk: 'medium' },
  { id: '22', name: 'security.certificates.write', description: 'Manage certificates', category: 'Certificates', risk: 'high' },
  { id: '23', name: 'security.certificates.renew', description: 'Renew certificates', category: 'Certificates', risk: 'high' },
  { id: '24', name: 'security.policies.read', description: 'View security policies', category: 'Policies', risk: 'low' },
  { id: '25', name: 'security.policies.write', description: 'Create and modify policies', category: 'Policies', risk: 'high' },
  { id: '26', name: 'security.policies.enforce', description: 'Enforce policy compliance', category: 'Policies', risk: 'critical' },
  { id: '27', name: 'security.sessions.read', description: 'View active sessions', category: 'Sessions', risk: 'medium' },
  { id: '28', name: 'security.sessions.revoke', description: 'Revoke user sessions', category: 'Sessions', risk: 'high' },
  { id: '29', name: 'security.audit.read', description: 'View audit logs', category: 'Audit Logs', risk: 'medium' },
  { id: '30', name: 'security.audit.export', description: 'Export audit logs', category: 'Audit Logs', risk: 'high' },
  { id: '31', name: 'security.compliance.read', description: 'View compliance status', category: 'Compliance', risk: 'low' },
  { id: '32', name: 'security.compliance.write', description: 'Manage compliance frameworks', category: 'Compliance', risk: 'high' },
  { id: '33', name: 'security.settings.read', description: 'View security settings', category: 'Settings', risk: 'low' },
  { id: '34', name: 'security.settings.write', description: 'Modify security settings', category: 'Settings', risk: 'critical' },
]

const CATEGORIES = ['All', 'Threat Detection', 'Vulnerabilities', 'Incidents', 'Users & Roles', 'API Keys', 'Secrets', 'Certificates', 'Policies', 'Sessions', 'Audit Logs', 'Compliance', 'Settings']
const RISK_OPTIONS = ['All', 'low', 'medium', 'high', 'critical']

export function SecurityPermissions() {
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
          style={{ minWidth: 180 }}
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