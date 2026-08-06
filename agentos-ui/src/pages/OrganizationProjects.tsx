// Organization Projects Tab
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

const PROJECTS_DATA = [
  { id: '1', name: 'Hermes Core', description: 'Core platform development', workspace: 'Development', team: 'Engineering', status: 'active', progress: 78, members: 12, tasks: 156, dueDate: '2026-08-15', color: '#7c6cf5' },
  { id: '2', name: 'AI Agent Runtime', description: 'Agent execution engine', workspace: 'Production', team: 'Engineering', status: 'active', progress: 92, members: 8, tasks: 89, dueDate: '2026-07-30', color: '#22d97a' },
  { id: '3', name: 'Model Registry', description: 'Model versioning & deployment', workspace: 'Production', team: 'Platform', status: 'active', progress: 65, members: 6, tasks: 67, dueDate: '2026-09-01', color: '#00e5ff' },
  { id: '4', name: 'Security Hardening', description: 'SOC 2 compliance improvements', workspace: 'Staging', team: 'Security', status: 'active', progress: 45, members: 5, tasks: 43, dueDate: '2026-10-15', color: '#ff4d6d' },
  { id: '5', name: 'Data Pipeline v2', description: 'Next-gen data processing', workspace: 'Research', team: 'Data Science', status: 'active', progress: 38, members: 9, tasks: 124, dueDate: '2026-11-30', color: '#d946ef' },
  { id: '6', name: 'Plugin Marketplace', description: 'Community plugin distribution', workspace: 'Development', team: 'DevRel', status: 'active', progress: 71, members: 7, tasks: 78, dueDate: '2026-08-31', color: '#f06292' },
  { id: '7', name: 'Mobile SDK', description: 'iOS & Android SDKs', workspace: 'Development', team: 'Engineering', status: 'on_hold', progress: 23, members: 4, tasks: 34, dueDate: '2027-01-15', color: '#ffb347' },
  { id: '8', name: 'Documentation Portal', description: 'Public docs & API reference', workspace: 'Staging', team: 'DevRel', status: 'active', progress: 88, members: 3, tasks: 29, dueDate: '2026-07-15', color: '#7c6cf5' },
  { id: '9', name: 'Billing System', description: 'Subscription & usage billing', workspace: 'Production', team: 'Platform', status: 'active', progress: 56, members: 6, tasks: 52, dueDate: '2026-09-30', color: '#22d97a' },
  { id: '10', name: 'Analytics Dashboard', description: 'Real-time usage analytics', workspace: 'Research', team: 'Data Science', status: 'completed', progress: 100, members: 4, tasks: 31, dueDate: '2026-06-30', color: '#d946ef' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

const WORKSPACE_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
  { value: 'research', label: 'Research' },
  { value: 'platform', label: 'Platform' },
]

const TEAM_OPTIONS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'platform', label: 'Platform' },
  { value: 'security', label: 'Security' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'devrel', label: 'DevRel' },
  { value: 'product', label: 'Product' },
]

export function OrganizationProjects() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [workspaceFilter, setWorkspaceFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<typeof PROJECTS_DATA[0] | null>(null)

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || project.status === statusFilter
      const matchesWorkspace = !workspaceFilter || project.workspace.toLowerCase() === workspaceFilter
      const matchesTeam = !teamFilter || project.team.toLowerCase() === teamFilter
      return matchesSearch && matchesStatus && matchesWorkspace && matchesTeam
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, statusFilter, workspaceFilter, teamFilter, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const openEditModal = (project: typeof PROJECTS_DATA[0]) => {
    setEditingProject(project)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingProject(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleWorkspaceFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setWorkspaceFilter(e.target.value)
  }

  const handleTeamFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedProjects(new Set(selected))
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'on_hold': return 'warning'
      case 'completed': return 'info'
      case 'archived': return 'default'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'on_hold': return 'On Hold'
      case 'completed': return 'Completed'
      case 'archived': return 'Archived'
      default: return status
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (project: typeof PROJECTS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: project.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: project.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {project.name.charAt(0)}
      </div>
    )},
    { key: 'name', header: 'Project', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{project.name}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{project.description}</div>
      </div>
    )},
    { key: 'workspace', header: 'Workspace', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <Badge variant="info" size="sm">{project.workspace}</Badge>
    )},
    { key: 'team', header: 'Team', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <Badge variant="default" size="sm">{project.team}</Badge>
    )},
    { key: 'progress', header: 'Progress', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <div style={{ minWidth: 120 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
          <div style={{ flex: 1, height: 6, backgroundColor: 'var(--color-surface-container-high)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: project.color, borderRadius: '3px', transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard)' }} />
          </div>
          <span style={{ fontSize: 'var(--text-body-xs)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: project.color }}>{project.progress}%</span>
        </div>
      </div>
    )},
    { key: 'members', header: 'Members', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <Badge variant="default" size="sm">{project.members}</Badge>
    )},
    { key: 'tasks', header: 'Tasks', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <Badge variant="default" size="sm">{project.tasks}</Badge>
    )},
    { key: 'dueDate', header: 'Due Date', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{project.dueDate}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (project: typeof PROJECTS_DATA[0]) => (
      <Badge variant={getStatusBadgeVariant(project.status)} size="sm" dot>
        {getStatusLabel(project.status)}
      </Badge>
    )},
    { key: 'actions', header: '', width: 80, render: (project: typeof PROJECTS_DATA[0]) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(project) }}>Edit</Button>
    )},
  ]

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search projects..."
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
        <Select
          value={workspaceFilter}
          onChangeRaw={handleWorkspaceFilterChange}
          placeholder="All Workspaces"
          options={WORKSPACE_OPTIONS}
          size="sm"
          style={{ minWidth: 140 }}
        />
        <Select
          value={teamFilter}
          onChangeRaw={handleTeamFilterChange}
          placeholder="All Teams"
          options={TEAM_OPTIONS}
          size="sm"
          style={{ minWidth: 140 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
            Create Project
          </Button>
        </div>
      </div>

      {/* Project Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredProjects.length} of {PROJECTS_DATA.length} projects
        {selectedProjects.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedProjects.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredProjects}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedProjects)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No projects found"
          selectable
        />
      </Card>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New Project"
        size="md"
      >
        <form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Input label="Project Name" placeholder="e.g., AI Agent Runtime" required />
            <Textarea
              label="Description"
              placeholder="Brief description of the project"
              rows={3}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <Select
                label="Workspace"
                placeholder="Select workspace"
                options={WORKSPACE_OPTIONS}
                required
              />
              <Select
                label="Team"
                placeholder="Select team"
                options={TEAM_OPTIONS}
                required
              />
            </div>
            <Select
              label="Status"
              placeholder="Select status"
              options={STATUS_OPTIONS}
              required
            />
            <Input
              label="Due Date"
              type="date"
              placeholder="2026-08-15"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={closeModals}>Cancel</Button>
              <Button variant="primary" type="submit">Create Project</Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={closeModals}
        title="Edit Project"
        size="md"
      >
        {editingProject && (
          <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <Input label="Project Name" defaultValue={editingProject.name} />
              <Textarea
                label="Description"
                defaultValue={editingProject.description}
                rows={3}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                <Select
                  label="Workspace"
                  value={editingProject.workspace.toLowerCase()}
                  onChangeRaw={() => { /* update workspace */ }}
                  options={WORKSPACE_OPTIONS}
                />
                <Select
                  label="Team"
                  value={editingProject.team.toLowerCase()}
                  onChangeRaw={() => { /* update team */ }}
                  options={TEAM_OPTIONS}
                />
              </div>
              <Select
                label="Status"
                value={editingProject.status}
                onChangeRaw={() => { /* update status */ }}
                options={STATUS_OPTIONS}
              />
              <Input
                label="Due Date"
                type="date"
                defaultValue={editingProject.dueDate}
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