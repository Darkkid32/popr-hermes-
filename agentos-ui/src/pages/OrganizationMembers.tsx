// Organization Members Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Avatar } from '../design-system/components/data-display/Avatar'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'
import { Modal } from '../design-system/components/overlay/Modal'

const MEMBERS_DATA = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@hermes.ai', role: 'Admin', team: 'Engineering', status: 'active', lastActive: '2m ago', avatar: 'SC', color: '#ff4d6d' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus.j@hermes.ai', role: 'Member', team: 'Engineering', status: 'active', lastActive: '5m ago', avatar: 'MJ', color: '#7c6cf5' },
  { id: '3', name: 'Alex Rivera', email: 'alex.r@hermes.ai', role: 'Owner', team: 'Leadership', status: 'active', lastActive: '1h ago', avatar: 'AR', color: '#d946ef' },
  { id: '4', name: 'Priya Patel', email: 'priya.p@hermes.ai', role: 'Member', team: 'Product', status: 'active', lastActive: '3m ago', avatar: 'PP', color: '#22d97a' },
  { id: '5', name: 'James Wilson', email: 'james.w@hermes.ai', role: 'Admin', team: 'Security', status: 'away', lastActive: '2h ago', avatar: 'JW', color: '#00e5ff' },
  { id: '6', name: 'Emily Davis', email: 'emily.d@hermes.ai', role: 'Member', team: 'Engineering', status: 'active', lastActive: '10m ago', avatar: 'ED', color: '#ffb347' },
  { id: '7', name: 'David Kim', email: 'david.k@hermes.ai', role: 'Member', team: 'Platform', status: 'active', lastActive: '1h ago', avatar: 'DK', color: '#f06292' },
  { id: '8', name: 'Lisa Thompson', email: 'lisa.t@hermes.ai', role: 'Member', team: 'Product', status: 'offline', lastActive: '1d ago', avatar: 'LT', color: '#7c6cf5' },
  { id: '9', name: 'Robert Chen', email: 'robert.c@hermes.ai', role: 'Admin', team: 'Security', status: 'active', lastActive: '30m ago', avatar: 'RC', color: '#ff4d6d' },
  { id: '10', name: 'Amanda Foster', email: 'amanda.f@hermes.ai', role: 'Member', team: 'Platform', status: 'active', lastActive: '5m ago', avatar: 'AF', color: '#22d97a' },
  { id: '11', name: 'Kevin Park', email: 'kevin.p@hermes.ai', role: 'Member', team: 'Engineering', status: 'away', lastActive: '45m ago', avatar: 'KP', color: '#00e5ff' },
  { id: '12', name: 'Nicole Wong', email: 'nicole.w@hermes.ai', role: 'Member', team: 'Product', status: 'offline', lastActive: '2d ago', avatar: 'NW', color: '#d946ef' },
]

const ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

const TEAMS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'security', label: 'Security' },
  { value: 'platform', label: 'Platform' },
  { value: 'leadership', label: 'Leadership' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Offline' },
]

export function OrganizationMembers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingMember, setEditingMember] = useState<typeof MEMBERS_DATA[0] | null>(null)

  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = !roleFilter || member.role.toLowerCase() === roleFilter
      const matchesTeam = !teamFilter || member.team.toLowerCase() === teamFilter
      const matchesStatus = !statusFilter || member.status === statusFilter
      return matchesSearch && matchesRole && matchesTeam && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, roleFilter, teamFilter, statusFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (member: typeof MEMBERS_DATA[0]) => {
    setEditingMember(member)
  }

  const closeModals = () => {
    setShowInviteModal(false)
    setEditingMember(null)
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowInviteModal(false)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedMembers(new Set(selected))
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleRoleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value)
  }

  const handleTeamFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const columns = [
    { key: 'avatar', header: '', width: 56, render: (member: typeof MEMBERS_DATA[0]) => (
      <Avatar size="sm" name={member.name} src="" style={{ backgroundColor: member.color + '22', color: member.color, borderColor: member.color + '44' }}>
        {member.avatar}
      </Avatar>
    )},
    { key: 'name', header: 'Name', sortable: true, render: (member: typeof MEMBERS_DATA[0]) => (
      <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{member.name}</div>
    )},
    { key: 'email', header: 'Email', sortable: true, render: (member: typeof MEMBERS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{member.email}</div>
    )},
    { key: 'role', header: 'Role', sortable: true, render: (member: typeof MEMBERS_DATA[0]) => (
      <Badge variant="default" size="sm">{member.role}</Badge>
    )},
    { key: 'team', header: 'Team', sortable: true, render: (member: typeof MEMBERS_DATA[0]) => (
      <Badge variant="info" size="sm">{member.team}</Badge>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (member: typeof MEMBERS_DATA[0]) => (
      <Badge 
        variant={member.status === 'active' ? 'success' : member.status === 'away' ? 'warning' : 'default'} 
        size="sm" 
        dot
      >
        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
      </Badge>
    )},
    { key: 'lastActive', header: 'Last Active', sortable: true, render: (member: typeof MEMBERS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>
        {member.lastActive}
      </div>
    )},
    { key: 'actions', header: '', width: 80, render: (member: typeof MEMBERS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(member) }}>
        Edit
      </Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search members..."
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
          value={teamFilter}
          onChangeRaw={handleTeamFilterChange}
          placeholder="All Teams"
          options={TEAMS}
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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="secondary" size="sm" onClick={() => setShowInviteModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Invite Member
          </Button>
        </div>
      </div>

      {/* Member Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredMembers.length} of {MEMBERS_DATA.length} members
        {selectedMembers.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedMembers.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredMembers}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedMembers)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No members found"
          selectable
        />
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={closeModals}
        title="Invite New Member"
        size="md"
      >
        <form onSubmit={handleInviteSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input
              label="Email Address"
              placeholder="member@company.com"
              type="email"
              required
            />
            <Select
              label="Role"
              placeholder="Select role"
              options={ROLES}
              required
            />
            <Select
              label="Team"
              placeholder="Select team"
              options={TEAMS}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Send Invitation</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={closeModals}
        title="Edit Member"
        size="md"
      >
        {editingMember && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <Avatar size="lg" name={editingMember.name} src="" style={{ backgroundColor: editingMember.color + '22', color: editingMember.color, borderColor: editingMember.color + '44' }}>
                  {editingMember.avatar}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{editingMember.name}</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{editingMember.email}</div>
                </div>
              </div>
              <Select
                label="Role"
                value={editingMember.role.toLowerCase()}
                onChangeRaw={() => { /* update role */ }}
                options={ROLES}
              />
              <Select
                label="Team"
                value={editingMember.team.toLowerCase()}
                onChangeRaw={() => { /* update team */ }}
                options={TEAMS}
              />
              <Select
                label="Status"
                value={editingMember.status}
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