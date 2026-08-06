// Organization RBAC Builder Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'

const ROLES_RBAC = [
  { id: '1', name: 'Owner', permissions: 47, members: 1, type: 'system' },
  { id: '2', name: 'Admin', permissions: 42, members: 8, type: 'system' },
  { id: '3', name: 'Member', permissions: 28, members: 185, type: 'system' },
  { id: '4', name: 'Viewer', permissions: 12, members: 42, type: 'system' },
  { id: '5', name: 'Security Analyst', permissions: 19, members: 5, type: 'custom' },
  { id: '6', name: 'Platform Engineer', permissions: 24, members: 12, type: 'custom' },
  { id: '7', name: 'Data Scientist', permissions: 18, members: 18, type: 'custom' },
  { id: '8', name: 'DevRel Engineer', permissions: 15, members: 6, type: 'custom' },
]

const PERMISSION_CATEGORIES = [
  { id: 'workspaces', name: 'Workspaces', permissions: [
    { id: 'workspaces.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'workspaces.write', name: 'Write', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'workspaces.delete', name: 'Delete', defaultRoles: ['Admin', 'Owner'] },
    { id: 'workspaces.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'projects', name: 'Projects', permissions: [
    { id: 'projects.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'projects.write', name: 'Write', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'projects.delete', name: 'Delete', defaultRoles: ['Admin', 'Owner'] },
    { id: 'projects.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'models', name: 'Models', permissions: [
    { id: 'models.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'models.write', name: 'Write', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'models.deploy', name: 'Deploy', defaultRoles: ['Admin', 'Owner'] },
    { id: 'models.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'memory', name: 'Memory', permissions: [
    { id: 'memory.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'memory.write', name: 'Write', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'memory.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'plugins', name: 'Plugins', permissions: [
    { id: 'plugins.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'plugins.install', name: 'Install', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'plugins.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'skills', name: 'Skills', permissions: [
    { id: 'skills.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'skills.write', name: 'Write', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'skills.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'mcp', name: 'MCP', permissions: [
    { id: 'mcp.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'mcp.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
    { id: 'mcp.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'settings', name: 'Settings', permissions: [
    { id: 'settings.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'settings.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
    { id: 'settings.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'security', name: 'Security', permissions: [
    { id: 'security.read', name: 'Read', defaultRoles: ['Member', 'Admin', 'Owner'] },
    { id: 'security.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
    { id: 'security.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'billing', name: 'Billing', permissions: [
    { id: 'billing.read', name: 'Read', defaultRoles: ['Admin', 'Owner'] },
    { id: 'billing.write', name: 'Write', defaultRoles: ['Owner'] },
  ]},
  { id: 'members', name: 'Members', permissions: [
    { id: 'members.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'members.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
    { id: 'members.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'teams', name: 'Teams', permissions: [
    { id: 'teams.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'teams.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
    { id: 'teams.admin', name: 'Admin', defaultRoles: ['Owner'] },
  ]},
  { id: 'roles', name: 'Roles', permissions: [
    { id: 'roles.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'roles.write', name: 'Write', defaultRoles: ['Owner'] },
  ]},
  { id: 'audit', name: 'Audit', permissions: [
    { id: 'audit.read', name: 'Read', defaultRoles: ['Admin', 'Owner'] },
    { id: 'audit.export', name: 'Export', defaultRoles: ['Owner'] },
  ]},
  { id: 'sso', name: 'SSO', permissions: [
    { id: 'sso.read', name: 'Read', defaultRoles: ['Admin', 'Owner'] },
    { id: 'sso.write', name: 'Write', defaultRoles: ['Owner'] },
  ]},
  { id: 'environments', name: 'Environments', permissions: [
    { id: 'environments.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'environments.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
  ]},
  { id: 'licenses', name: 'Licenses', permissions: [
    { id: 'licenses.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
  ]},
  { id: 'quotas', name: 'Quotas', permissions: [
    { id: 'quotas.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
    { id: 'quotas.write', name: 'Write', defaultRoles: ['Admin', 'Owner'] },
  ]},
  { id: 'activity', name: 'Activity', permissions: [
    { id: 'activity.read', name: 'Read', defaultRoles: ['Viewer', 'Member', 'Admin', 'Owner'] },
  ]},
]

const ROLE_OPTIONS = ROLES_RBAC.map(r => ({ value: r.name.toLowerCase(), label: r.name }))

const tabs = [
  { id: 'matrix', label: 'Permission Matrix' },
  { id: 'roles', label: 'Role Definitions' },
  { id: 'assignments', label: 'Role Assignments' },
  { id: 'policies', label: 'Access Policies' },
]

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      style={{
        padding: 'var(--spacing-2) var(--spacing-4)',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        backgroundColor: isActive ? 'var(--color-primary-glow)' : 'transparent',
        color: isActive ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

export function OrganizationRBAC() {
  const [activeTab, setActiveTab] = useState('matrix')
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('admin')

  const filteredCategories = useMemo(() => {
    if (!search) return PERMISSION_CATEGORIES
    return PERMISSION_CATEGORIES.map(cat => ({
      ...cat,
      permissions: cat.permissions.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(cat => cat.permissions.length > 0)
  }, [search])

  const hasPermission = (permissionId: string, roleName: string) => {
    const perm = PERMISSION_CATEGORIES.flatMap(c => c.permissions).find(p => p.id === permissionId)
    return perm?.defaultRoles.includes(roleName) ?? false
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value)
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>View as:</span>
          <Select
            value={selectedRole}
            onChangeRaw={handleRoleChange}
            options={ROLE_OPTIONS}
            size="sm"
            style={{ minWidth: 180 }}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-2)',
          marginBottom: 'var(--spacing-4)',
          borderBottom: '1px solid var(--color-border-primary)',
          paddingBottom: 'var(--spacing-2)'
        }}
        role="tablist"
        aria-label="RBAC tabs"
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Permission Matrix */}
      {activeTab === 'matrix' && (
        <Card variant="elevated">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border-primary)', position: 'sticky', top: 0, backgroundColor: 'var(--color-surface)' }}>
                  <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-primary)', minWidth: 200 }}>Permission</th>
                  {ROLES_RBAC.map(role => (
                    <th key={role.id} style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-secondary)', minWidth: 100, whiteSpace: 'nowrap' }}>
                      {role.name}
                      <Badge variant={role.type === 'system' ? 'default' : 'info'} size="sm" style={{ marginLeft: 'var(--spacing-1)', fontSize: 'var(--text-body-xs)' }}>
                        {role.type}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(category => (
                  <>
                    <tr style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
                      <td style={{ padding: 'var(--spacing-3)', fontWeight: 600, color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border-primary)' }} colSpan={ROLES_RBAC.length + 1}>
                        {category.name}
                      </td>
                    </tr>
                    {category.permissions.map(perm => (
                      <tr key={perm.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                        <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>
                          {perm.name}
                        </td>
                        {ROLES_RBAC.map(role => (
                          <td key={role.id} style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                            {hasPermission(perm.id, role.name) ? (
                              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--color-success-base)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>✓</div>
                            ) : (
                              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--color-surface-container-high)', border: '1px solid var(--color-border-primary)', margin: '0 auto' }} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Role Definitions */}
      {activeTab === 'roles' && (
        <Card variant="elevated" padding="none">
          <Table
            columns={[
              { key: 'name', header: 'Role', sortable: true, render: (role: typeof ROLES_RBAC[0]) => (
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{role.name}</div>
                  <Badge variant={role.type === 'system' ? 'default' : 'info'} size="sm">{role.type}</Badge>
                </div>
              )},
              { key: 'permissions', header: 'Permissions', sortable: true, render: (role: typeof ROLES_RBAC[0]) => (
                <Badge variant="default" size="sm">{role.permissions}</Badge>
              )},
              { key: 'members', header: 'Members', sortable: true, render: (role: typeof ROLES_RBAC[0]) => (
                <Badge variant="default" size="sm">{role.members}</Badge>
              )},
            ]}
            rows={ROLES_RBAC}
            emptyMessage="No roles defined"
            striped
          />
        </Card>
      )}

      {/* Role Assignments */}
      {activeTab === 'assignments' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
              Role assignments are managed in the <strong>Members</strong> and <strong>Teams</strong> tabs.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              {ROLES_RBAC.map(role => (
                <div key={role.id} style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{role.name}</div>
                    <Badge variant={role.type === 'system' ? 'default' : 'info'} size="sm">{role.type}</Badge>
                  </div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
                    {role.members} member{role.members !== 1 ? 's' : ''} · {role.permissions} permissions
                  </div>
                  <Button variant="ghost" size="sm">Manage Assignments</Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Access Policies */}
      {activeTab === 'policies' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>ACCESS POLICIES</span>
              <Button variant="primary" size="sm">Create Policy</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {[
                { name: 'Default Member Policy', rules: 'Member role → workspaces.read, projects.read, models.read', status: 'active' },
                { name: 'Admin Elevation Policy', rules: 'Admin role → all workspace/project permissions + members.write', status: 'active' },
                { name: 'Security Isolation Policy', rules: 'Security Analyst → security.read, audit.read, models.read (no deploy)', status: 'active' },
                { name: 'Platform Engineer Policy', rules: 'Platform Engineer → mcp.write, environments.write, settings.write', status: 'draft' },
              ].map((policy, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{policy.name}</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{policy.rules}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <Badge variant={policy.status === 'active' ? 'success' : 'warning'} size="sm" dot>{policy.status}</Badge>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}