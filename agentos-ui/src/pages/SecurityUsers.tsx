// Security Users Tab
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
import { Avatar } from '../design-system/components/data-display/Avatar'

const USERS_DATA = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@hermes.ai', role: 'Security Admin', status: 'active', lastLogin: '2026-07-15 14:32', mfa: true, riskScore: 12, permissions: 47, avatar: 'SC', color: '#ff4d6d' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus.j@hermes.ai', role: 'Analyst', status: 'active', lastLogin: '2026-07-15 10:15', mfa: true, riskScore: 8, permissions: 28, avatar: 'MJ', color: '#7c6cf5' },
  { id: '3', name: 'Alex Rivera', email: 'alex.r@hermes.ai', role: 'Owner', status: 'active', lastLogin: '2026-07-15 09:22', mfa: true, riskScore: 5, permissions: 47, avatar: 'AR', color: '#d946ef' },
  { id: '4', name: 'Priya Patel', email: 'priya.p@hermes.ai', role: 'Analyst', status: 'active', lastLogin: '2026-07-14 16:45', mfa: true, riskScore: 15, permissions: 28, avatar: 'PP', color: '#22d97a' },
  { id: '5', name: 'James Wilson', email: 'james.w@hermes.ai', role: 'Security Admin', status: 'active', lastLogin: '2026-07-14 14:20', mfa: true, riskScore: 10, permissions: 47, avatar: 'JW', color: '#00e5ff' },
  { id: '6', name: 'Emily Davis', email: 'emily.d@hermes.ai', role: 'Analyst', status: 'away', lastLogin: '2026-07-13 19:45', mfa: true, riskScore: 22, permissions: 28, avatar: 'ED', color: '#ffb347' },
  { id: '7', name: 'David Kim', email: 'david.k@hermes.ai', role: 'Analyst', status: 'active', lastLogin: '2026-07-13 15:30', mfa: false, riskScore: 45, permissions: 28, avatar: 'DK', color: '#f06292' },
  { id: '8', name: 'Lisa Thompson', email: 'lisa.t@hermes.ai', role: 'Viewer', status: 'offline', lastLogin: '2026-07-12 22:15', mfa: false, riskScore: 68, permissions: 12, avatar: 'LT', color: '#7c6cf5' },
]

const ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'security_admin', label: 'Security Admin' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'viewer', label: 'Viewer' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Offline' },
  { value: 'suspended', label: 'Suspended' },
]

export function SecurityUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [mfaFilter, setMfaFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof USERS_DATA[0] | null>(null)

  const filteredUsers = useMemo(() => {
    return USERS_DATA.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = !roleFilter || user.role.toLowerCase().replace(' ', '_') === roleFilter
      const matchesStatus = !statusFilter || user.status === statusFilter
      const matchesMfa = !mfaFilter || (mfaFilter === 'true' && user.mfa) || (mfaFilter === 'false' && !user.mfa)
      return matchesSearch && matchesRole && matchesStatus && matchesMfa
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, roleFilter, statusFilter, mfaFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (user: typeof USERS_DATA[0]) => {
    setEditingUser(user)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingUser(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleRoleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleMfaFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMfaFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedUsers(new Set(selected))
  }

  const getRiskBadgeVariant = (score: number) => {
    if (score <= 20) return 'success'
    if (score <= 40) return 'warning'
    return 'error'
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (user: typeof USERS_DATA[0]) => (
      <Avatar size="sm" name={user.name} src="" style={{ backgroundColor: user.color + '22', color: user.color, borderColor: user.color + '44' }}>
        {user.avatar}
      </Avatar>
    )},
    { key: 'name', header: 'User', sortable: true, render: (user: typeof USERS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{user.email}</div>
      </div>
    )},
    { key: 'role', header: 'Role', sortable: true, render: (user: typeof USERS_DATA[0]) => (
      <Badge variant="default" size="sm">{user.role}</Badge>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (user: typeof USERS_DATA[0]) => (
      <Badge
        variant={user.status === 'active' ? 'success' : user.status === 'away' ? 'warning' : user.status === 'offline' ? 'default' : 'error'}
        size="sm"
        dot
      >
        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
      </Badge>
    )},
    { key: 'mfa', header: 'MFA', sortable: true, render: (user: typeof USERS_DATA[0]) => (
      <Badge variant={user.mfa ? 'success' : 'error'} size="sm" dot>
        {user.mfa ? 'Enabled' : 'Disabled'}
      </Badge>
    )},
    { key: 'riskScore', header: 'Risk Score', sortable: true, render: (user: typeof USERS_DATA[0]) => (
      <Badge variant={getRiskBadgeVariant(user.riskScore)} size="sm">{user.riskScore}</Badge>
    )},
    { key: 'lastLogin', header: 'Last Login', sortable: true, render: (user: typeof USERS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{user.lastLogin}</div>
    )},
    { key: 'actions', header: '', width: 80, render: (user: typeof USERS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(user) }}>Edit</Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={handleSearchChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="sm"
          />
        </div>
        <Select
          value={roleFilter}
          onChangeRaw={handleRoleFilterChange}
          placeholder="All Roles"
          options={ROLES}
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
        <Select
          value={mfaFilter}
          onChangeRaw={handleMfaFilterChange}
          placeholder="MFA Status"
          options={[
            { value: '', label: 'All' },
            { value: 'true', label: 'Enabled' },
            { value: 'false', label: 'Disabled' },
          ]}
          size="sm"
          style={{ minWidth: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Add User
          </Button>
        </div>
      </div>

      {/* User Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredUsers.length} of {USERS_DATA.length} users
        {selectedUsers.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedUsers.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredUsers}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedUsers)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No users found"
          selectable
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Add Security User"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Full Name" placeholder="e.g., John Doe" required />
            <Input label="Email" type="email" placeholder="john.doe@company.com" required />
            <Select
              label="Role"
              placeholder="Select role"
              options={ROLES}
              required
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Require MFA</div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enforce multi-factor authentication</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Add User</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={closeModals}
        title="Edit User"
        size="md"
      >
        {editingUser && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <Avatar size="lg" name={editingUser.name} src="" style={{ backgroundColor: editingUser.color + '22', color: editingUser.color, borderColor: editingUser.color + '44' }}>
                  {editingUser.avatar}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{editingUser.name}</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{editingUser.email}</div>
                </div>
              </div>
              <Select
                label="Role"
                value={editingUser.role.toLowerCase().replace(' ', '_')}
                onChangeRaw={() => { /* update role */ }}
                options={ROLES}
              />
              <Select
                label="Status"
                value={editingUser.status}
                onChangeRaw={() => { /* update status */ }}
                options={STATUS_OPTIONS}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>MFA Enabled</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Multi-factor authentication</div>
                </div>
                <input type="checkbox" defaultChecked={editingUser.mfa} />
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