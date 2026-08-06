// Organization Teams Tab
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

const TEAMS_DATA = [
  { id: '1', name: 'Engineering', description: 'Core platform development', members: 47, workspaces: 5, projects: 23, lead: 'Sarah Chen', status: 'active', color: '#ff4d6d' },
  { id: '2', name: 'Product', description: 'Product management & design', members: 12, workspaces: 3, projects: 8, lead: 'Priya Patel', status: 'active', color: '#22d97a' },
  { id: '3', name: 'Security', description: 'Security & compliance', members: 8, workspaces: 2, projects: 5, lead: 'James Wilson', status: 'active', color: '#00e5ff' },
  { id: '4', name: 'Platform', description: 'Infrastructure & DevOps', members: 15, workspaces: 4, projects: 12, lead: 'David Kim', status: 'active', color: '#f06292' },
  { id: '5', name: 'Leadership', description: 'Executive leadership', members: 4, workspaces: 6, projects: 15, lead: 'Alex Rivera', status: 'active', color: '#d946ef' },
  { id: '6', name: 'Data Science', description: 'ML & analytics', members: 18, workspaces: 2, projects: 9, lead: 'Emily Davis', status: 'inactive', color: '#ffb347' },
  { id: '7', name: 'Developer Relations', description: 'Community & advocacy', members: 6, workspaces: 1, projects: 4, lead: 'Kevin Park', status: 'active', color: '#7c6cf5' },
  { id: '8', name: 'QA & Reliability', description: 'Quality assurance', members: 11, workspaces: 3, projects: 7, lead: 'Robert Chen', status: 'active', color: '#22d97a' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export function OrganizationTeams() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<typeof TEAMS_DATA[0] | null>(null)

  const filteredTeams = useMemo(() => {
    return TEAMS_DATA.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.description.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || team.status === statusFilter
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

  const openEditModal = (team: typeof TEAMS_DATA[0]) => {
    setEditingTeam(team)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingTeam(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedTeams(new Set(selected))
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (team: typeof TEAMS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: team.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: team.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {team.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Team', sortable: true, render: (team: typeof TEAMS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{team.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{team.description}</div>
      </div>
    )},
    { key: 'lead', header: 'Lead', sortable: true, render: (team: typeof TEAMS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{team.lead}</div>
    )},
    { key: 'members', header: 'Members', sortable: true, render: (team: typeof TEAMS_DATA[0]) => (
      <Badge variant="default" size="sm">{team.members}</Badge>
    )},
    { key: 'workspaces', header: 'Workspaces', sortable: true, render: (team: typeof TEAMS_DATA[0]) => (
      <Badge variant="info" size="sm">{team.workspaces}</Badge>
    )},
    { key: 'projects', header: 'Projects', sortable: true, render: (team: typeof TEAMS_DATA[0]) => (
      <Badge variant="default" size="sm">{team.projects}</Badge>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (team: typeof TEAMS_DATA[0]) => (
      <Badge variant={team.status === 'active' ? 'success' : 'default'} size="sm" dot>
        {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (team: typeof TEAMS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(team) }}>Edit</Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search teams..."
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
          style={{ minWidth: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Create Team
          </Button>
        </div>
      </div>

      {/* Team Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredTeams.length} of {TEAMS_DATA.length} teams
        {selectedTeams.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedTeams.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredTeams}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedTeams)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No teams found"
          selectable
        />
      </Card>

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New Team"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Team Name" placeholder="e.g., Platform Engineering" required />
            <Textarea
              label="Description"
              placeholder="Brief description of the team's purpose"
              rows={3}
            />
            <Select
              label="Team Lead"
              placeholder="Select team lead"
              options={[
                { value: 'sarah-chen', label: 'Sarah Chen' },
                { value: 'priya-patel', label: 'Priya Patel' },
                { value: 'james-wilson', label: 'James Wilson' },
                { value: 'david-kim', label: 'David Kim' },
                { value: 'alex-rivera', label: 'Alex Rivera' },
              ]}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Team</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Team Modal */}
      <Modal
        isOpen={!!editingTeam}
        onClose={closeModals}
        title="Edit Team"
        size="md"
      >
        {editingTeam && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="Team Name" defaultValue={editingTeam.name} />
              <Textarea
                label="Description"
                defaultValue={editingTeam.description}
                rows={3}
              />
              <Select
                label="Status"
                value={editingTeam.status}
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