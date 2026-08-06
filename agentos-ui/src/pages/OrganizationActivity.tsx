// Organization Activity Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'

const ACTIVITY_DATA = [
  { id: '1', type: 'member_joined', title: 'Sarah Chen joined', detail: 'Added to Engineering team', actor: 'Alex Rivera', time: '2026-07-15 14:32', severity: 'info', color: '#ff4d6d', icon: '👤' },
  { id: '2', type: 'team_created', title: 'Team created', detail: 'Platform Engineering team created', actor: 'Alex Rivera', time: '2026-07-15 10:15', severity: 'info', color: '#7c6cf5', icon: '📁' },
  { id: '3', type: 'role_assigned', title: 'Role assigned', detail: 'Admin role granted to Marcus Johnson', actor: 'Sarah Chen', time: '2026-07-14 16:45', severity: 'info', color: '#22d97a', icon: '🔐' },
  { id: '4', type: 'workspace_created', title: 'Workspace created', detail: 'New project: Hermes v11', actor: 'Priya Patel', time: '2026-07-14 09:22', severity: 'info', color: '#00e5ff', icon: '🏢' },
  { id: '5', type: 'sso_configured', title: 'SSO configured', detail: 'Okta integration enabled', actor: 'Alex Rivera', time: '2026-07-13 11:30', severity: 'info', color: '#d946ef', icon: '🔗' },
  { id: '6', type: 'project_created', title: 'Project created', detail: 'Security Hardening project started', actor: 'James Wilson', time: '2026-07-13 08:10', severity: 'info', color: '#ff4d6d', icon: '📋' },
  { id: '7', type: 'model_deployed', title: 'Model deployed', detail: 'hermes-m3-large deployed to production', actor: 'Sarah Chen', time: '2026-07-12 19:45', severity: 'info', color: '#22d97a', icon: '🚀' },
  { id: '8', type: 'member_removed', title: 'Member removed', detail: 'Former contractor access revoked', actor: 'Alex Rivera', time: '2026-07-12 14:20', severity: 'warning', color: '#ffb347', icon: '👤' },
  { id: '9', type: 'quota_exceeded', title: 'Quota warning', detail: 'GPU hours at 85% of monthly limit', actor: 'System', time: '2026-07-12 00:00', severity: 'warning', color: '#ffb347', icon: '⚠️' },
  { id: '10', type: 'license_expiring', title: 'License expiring', detail: 'Security Suite expires in 30 days', actor: 'System', time: '2026-07-11 00:00', severity: 'warning', color: '#ffb347', icon: '📄' },
  { id: '11', type: 'security_alert', title: 'Security alert', detail: 'Failed login attempts detected', actor: 'Security System', time: '2026-07-11 22:15', severity: 'error', color: '#ff4d6d', icon: '🔒' },
  { id: '12', type: 'settings_changed', title: 'Settings changed', detail: 'Default workspace changed to Development', actor: 'Priya Patel', time: '2026-07-10 15:30', severity: 'info', color: '#7c6cf5', icon: '⚙️' },
  { id: '13', type: 'member_invited', title: 'Member invited', detail: 'Invitation sent to new Data Scientist', actor: 'Sarah Chen', time: '2026-07-10 10:00', severity: 'info', color: '#d946ef', icon: '📧' },
  { id: '14', type: 'environment_updated', title: 'Environment updated', detail: 'Staging cluster scaled to 6 nodes', actor: 'David Kim', time: '2026-07-09 13:45', severity: 'info', color: '#00e5ff', icon: '☁️' },
  { id: '15', type: 'policy_created', title: 'Policy created', detail: 'New access policy for Security team', actor: 'James Wilson', time: '2026-07-09 11:20', severity: 'info', color: '#ff4d6d', icon: '📜' },
  { id: '16', type: 'integration_added', title: 'Integration added', detail: 'GitHub integration configured for CI/CD', actor: 'Marcus Johnson', time: '2026-07-08 16:50', severity: 'info', color: '#22d97a', icon: '🔧' },
  { id: '17', type: 'backup_completed', title: 'Backup completed', detail: 'Daily backup of Production workspace', actor: 'System', time: '2026-07-08 03:00', severity: 'info', color: '#7c6cf5', icon: '💾' },
  { id: '18', type: 'member_promoted', title: 'Member promoted', detail: 'Emily Davis promoted to Team Lead', actor: 'Sarah Chen', time: '2026-07-07 14:30', severity: 'info', color: '#d946ef', icon: '⬆️' },
  { id: '19', type: 'workspace_archived', title: 'Workspace archived', detail: 'Legacy Support workspace archived', actor: 'Alex Rivera', time: '2026-07-07 09:15', severity: 'warning', color: '#6b7280', icon: '📦' },
  { id: '20', type: 'api_key_created', title: 'API key created', detail: 'New API key for external integration', actor: 'Marcus Johnson', time: '2026-07-06 12:00', severity: 'info', color: '#00e5ff', icon: '🔑' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'member_joined', label: 'Member Joined' },
  { value: 'member_removed', label: 'Member Removed' },
  { value: 'member_invited', label: 'Member Invited' },
  { value: 'member_promoted', label: 'Member Promoted' },
  { value: 'team_created', label: 'Team Created' },
  { value: 'role_assigned', label: 'Role Assigned' },
  { value: 'workspace_created', label: 'Workspace Created' },
  { value: 'workspace_archived', label: 'Workspace Archived' },
  { value: 'project_created', label: 'Project Created' },
  { value: 'model_deployed', label: 'Model Deployed' },
  { value: 'sso_configured', label: 'SSO Configured' },
  { value: 'settings_changed', label: 'Settings Changed' },
  { value: 'environment_updated', label: 'Environment Updated' },
  { value: 'policy_created', label: 'Policy Created' },
  { value: 'integration_added', label: 'Integration Added' },
  { value: 'backup_completed', label: 'Backup Completed' },
  { value: 'api_key_created', label: 'API Key Created' },
  { value: 'quota_exceeded', label: 'Quota Warning' },
  { value: 'license_expiring', label: 'License Expiring' },
  { value: 'security_alert', label: 'Security Alert' },
]

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
]

const tabs = [
  { id: 'all', label: 'All Activity' },
  { id: 'members', label: 'Members' },
  { id: 'security', label: 'Security' },
  { id: 'system', label: 'System' },
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

export function OrganizationActivity() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('time')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set())
  const [dateRange, setDateRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('all')

  const filteredActivities = useMemo(() => {
    return ACTIVITY_DATA.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase()) ||
        activity.detail.toLowerCase().includes(search.toLowerCase()) ||
        activity.actor.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || activity.type === typeFilter
      const matchesSeverity = !severityFilter || activity.severity === severityFilter
      return matchesSearch && matchesType && matchesSeverity
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, typeFilter, severityFilter, sortColumn, sortDirection])

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

  const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value)
  }

  const handleSeverityFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSeverityFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedActivities(new Set(selected))
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'info': return 'info'
      case 'warning': return 'warning'
      case 'error': return 'error'
      default: return 'default'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'info': return 'Info'
      case 'warning': return 'Warning'
      case 'error': return 'Error'
      default: return severity
    }
  }

  const tabFilteredActivities = useMemo(() => {
    if (activeTab === 'all') return filteredActivities
    if (activeTab === 'members') return filteredActivities.filter(a => a.type.includes('member') || a.type.includes('team') || a.type.includes('role') || a.type.includes('promoted'))
    if (activeTab === 'security') return filteredActivities.filter(a => a.type.includes('security') || a.type.includes('sso') || a.type.includes('policy') || a.type.includes('api_key'))
    if (activeTab === 'system') return filteredActivities.filter(a => a.type.includes('workspace') || a.type.includes('project') || a.type.includes('model') || a.type.includes('environment') || a.type.includes('backup') || a.type.includes('integration') || a.type.includes('quota') || a.type.includes('license') || a.type.includes('settings'))
    return filteredActivities
  }, [filteredActivities, activeTab])

  const columns = [
    { key: 'icon', header: '', width: 48, render: (activity: typeof ACTIVITY_DATA[0]) => (
      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: activity.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-body-sm)' }}>
        {activity.icon}
      </div>
    )},
    { key: 'title', header: 'Activity', sortable: true, render: (activity: typeof ACTIVITY_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{activity.title}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{activity.detail}</div>
      </div>
    )},
    { key: 'actor', header: 'Actor', sortable: true, render: (activity: typeof ACTIVITY_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{activity.actor}</div>
    )},
    { key: 'time', header: 'Time', sortable: true, render: (activity: typeof ACTIVITY_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{activity.time}</div>
    )},
    { key: 'severity', header: 'Severity', sortable: true, render: (activity: typeof ACTIVITY_DATA[0]) => (
      <Badge variant={getSeverityVariant(activity.severity)} size="sm" dot>
        {getSeverityLabel(activity.severity)}
      </Badge>
    )},
  ]

  // Stats
  const infoCount = ACTIVITY_DATA.filter(a => a.severity === 'info').length
  const warningCount = ACTIVITY_DATA.filter(a => a.severity === 'warning').length
  const errorCount = ACTIVITY_DATA.filter(a => a.severity === 'error').length

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Events</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {ACTIVITY_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📋</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Info</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-info-base)' }}>
                {infoCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>ℹ️</div>
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
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Errors</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: errorCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {errorCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: errorCount > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: errorCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {errorCount > 0 ? '🔴' : '✅'}
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search activity..."
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
          style={{ minWidth: 180 }}
        />
        <Select
          value={severityFilter}
          onChangeRaw={handleSeverityFilterChange}
          placeholder="All Severities"
          options={SEVERITY_OPTIONS}
          size="sm"
          style={{ minWidth: 160 }}
        />
        <Select
          value={dateRange}
          onChangeRaw={(e) => setDateRange(e.target.value)}
          placeholder="Time Range"
          options={[
            { value: '1d', label: 'Last 24h' },
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
          ]}
          size="sm"
          style={{ minWidth: 140 }}
        />
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
        aria-label="Activity tabs"
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

      {/* Activity Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {tabFilteredActivities.length} of {ACTIVITY_DATA.length} events
        {selectedActivities.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedActivities.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={tabFilteredActivities}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedActivities)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No activity found"
          selectable
        />
      </Card>
    </div>
  )
}