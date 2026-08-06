// Organization Audit Logs Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'
import { Avatar } from '../design-system/components/data-display/Avatar'

const AUDIT_LOGS_DATA = [
  { id: '1', timestamp: '2026-07-15 14:32:18', actor: 'Alex Rivera', actorId: 'user-3', action: 'member.invite', resource: 'member', resourceId: 'user-45', detail: 'Invited new member: john.doe@company.com', ip: '192.168.1.100', status: 'success', severity: 'info', color: '#ff4d6d' },
  { id: '2', timestamp: '2026-07-15 14:30:45', actor: 'Alex Rivera', actorId: 'user-3', action: 'team.create', resource: 'team', resourceId: 'team-8', detail: 'Created team: Platform Engineering', ip: '192.168.1.100', status: 'success', severity: 'info', color: '#7c6cf5' },
  { id: '3', timestamp: '2026-07-15 10:15:22', actor: 'Sarah Chen', actorId: 'user-1', action: 'role.assign', resource: 'member', resourceId: 'user-2', detail: 'Assigned Admin role to Marcus Johnson', ip: '10.0.0.50', status: 'success', severity: 'info', color: '#22d97a' },
  { id: '4', timestamp: '2026-07-15 09:22:10', actor: 'Priya Patel', actorId: 'user-4', action: 'workspace.create', resource: 'workspace', resourceId: 'ws-7', detail: 'Created workspace: Research', ip: '10.0.0.75', status: 'success', severity: 'info', color: '#00e5ff' },
  { id: '5', timestamp: '2026-07-14 16:45:33', actor: 'Alex Rivera', actorId: 'user-3', action: 'sso.configure', resource: 'sso', resourceId: 'sso-okta', detail: 'Configured Okta SSO provider', ip: '192.168.1.100', status: 'success', severity: 'info', color: '#d946ef' },
  { id: '6', timestamp: '2026-07-14 14:20:11', actor: 'Alex Rivera', actorId: 'user-3', action: 'member.remove', resource: 'member', resourceId: 'user-38', detail: 'Removed member: contractor@temp.com', ip: '192.168.1.100', status: 'success', severity: 'warning', color: '#ffb347' },
  { id: '7', timestamp: '2026-07-14 11:30:00', actor: 'System', actorId: 'system', action: 'quota.alert', resource: 'quota', resourceId: 'quota-gpu', detail: 'GPU hours quota at 85% threshold', ip: 'internal', status: 'success', severity: 'warning', color: '#ffb347' },
  { id: '8', timestamp: '2026-07-13 19:45:22', actor: 'Sarah Chen', actorId: 'user-1', action: 'model.deploy', resource: 'model', resourceId: 'model-hermes-m3-large', detail: 'Deployed hermes-m3-large to production', ip: '10.0.0.50', status: 'success', severity: 'info', color: '#22d97a' },
  { id: '9', timestamp: '2026-07-13 15:30:45', actor: 'Priya Patel', actorId: 'user-4', action: 'settings.update', resource: 'settings', resourceId: 'default-workspace', detail: 'Changed default workspace to Development', ip: '10.0.0.75', status: 'success', severity: 'info', color: '#7c6cf5' },
  { id: '10', timestamp: '2026-07-13 11:20:18', actor: 'James Wilson', actorId: 'user-5', action: 'policy.create', resource: 'policy', resourceId: 'policy-security-isolation', detail: 'Created security isolation policy', ip: '10.0.0.80', status: 'success', severity: 'info', color: '#ff4d6d' },
  { id: '11', timestamp: '2026-07-12 22:15:30', actor: 'Security System', actorId: 'system', action: 'security.alert', resource: 'auth', resourceId: 'login-failed', detail: '5 failed login attempts for user-12', ip: '203.0.113.45', status: 'blocked', severity: 'error', color: '#ff4d6d' },
  { id: '12', timestamp: '2026-07-12 16:50:12', actor: 'Marcus Johnson', actorId: 'user-2', action: 'integration.add', resource: 'integration', resourceId: 'int-github', detail: 'Added GitHub integration for CI/CD', ip: '10.0.0.55', status: 'success', severity: 'info', color: '#22d97a' },
  { id: '13', timestamp: '2026-07-12 14:30:00', actor: 'Sarah Chen', actorId: 'user-1', action: 'member.promote', resource: 'member', resourceId: 'user-6', detail: 'Promoted Emily Davis to Team Lead', ip: '10.0.0.50', status: 'success', severity: 'info', color: '#d946ef' },
  { id: '14', timestamp: '2026-07-11 14:20:55', actor: 'Alex Rivera', actorId: 'user-3', action: 'workspace.archive', resource: 'workspace', resourceId: 'ws-6', detail: 'Archived workspace: Legacy Support', ip: '192.168.1.100', status: 'success', severity: 'warning', color: '#6b7280' },
  { id: '15', timestamp: '2026-07-11 12:00:33', actor: 'Marcus Johnson', actorId: 'user-2', action: 'apikey.create', resource: 'apikey', resourceId: 'key-abc123', detail: 'Created API key for external integration', ip: '10.0.0.55', status: 'success', severity: 'info', color: '#00e5ff' },
  { id: '16', timestamp: '2026-07-11 09:15:44', actor: 'David Kim', actorId: 'user-7', action: 'environment.scale', resource: 'environment', resourceId: 'env-staging', detail: 'Scaled staging cluster from 4 to 6 nodes', ip: '10.0.0.70', status: 'success', severity: 'info', color: '#f06292' },
  { id: '17', timestamp: '2026-07-10 03:00:00', actor: 'System', actorId: 'system', action: 'backup.complete', resource: 'backup', resourceId: 'backup-prod-20260710', detail: 'Completed daily backup of Production workspace', ip: 'internal', status: 'success', severity: 'info', color: '#7c6cf5' },
  { id: '18', timestamp: '2026-07-10 00:00:00', actor: 'System', actorId: 'system', action: 'license.expiring', resource: 'license', resourceId: 'license-security-suite', detail: 'Security Suite license expires in 30 days', ip: 'internal', status: 'success', severity: 'warning', color: '#ffb347' },
  { id: '19', timestamp: '2026-07-09 16:45:22', actor: 'System', actorId: 'system', action: 'model.retrain', resource: 'model', resourceId: 'model-hermes-m3-small', detail: 'Automated retrain of hermes-m3-small completed', ip: 'internal', status: 'success', severity: 'info', color: '#22d97a' },
  { id: '20', timestamp: '2026-07-09 13:30:11', actor: 'Priya Patel', actorId: 'user-4', action: 'project.create', resource: 'project', resourceId: 'proj-analytics', detail: 'Created project: Analytics Dashboard', ip: '10.0.0.75', status: 'success', severity: 'info', color: '#d946ef' },
]

const ACTION_OPTIONS = [
  { value: '', label: 'All Actions' },
  { value: 'member.invite', label: 'Member Invite' },
  { value: 'member.remove', label: 'Member Remove' },
  { value: 'member.promote', label: 'Member Promote' },
  { value: 'team.create', label: 'Team Create' },
  { value: 'role.assign', label: 'Role Assign' },
  { value: 'workspace.create', label: 'Workspace Create' },
  { value: 'workspace.archive', label: 'Workspace Archive' },
  { value: 'project.create', label: 'Project Create' },
  { value: 'model.deploy', label: 'Model Deploy' },
  { value: 'model.retrain', label: 'Model Retrain' },
  { value: 'sso.configure', label: 'SSO Configure' },
  { value: 'settings.update', label: 'Settings Update' },
  { value: 'policy.create', label: 'Policy Create' },
  { value: 'integration.add', label: 'Integration Add' },
  { value: 'apikey.create', label: 'API Key Create' },
  { value: 'environment.scale', label: 'Environment Scale' },
  { value: 'backup.complete', label: 'Backup Complete' },
  { value: 'quota.alert', label: 'Quota Alert' },
  { value: 'license.expiring', label: 'License Expiring' },
  { value: 'security.alert', label: 'Security Alert' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'pending', label: 'Pending' },
]

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
]

export function OrganizationAuditLogs() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set())
  const [dateRange, setDateRange] = useState('7d')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    return AUDIT_LOGS_DATA.filter(log => {
      const matchesSearch = log.actor.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase()) ||
        log.detail.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.toLowerCase().includes(search.toLowerCase())
      const matchesAction = !actionFilter || log.action === actionFilter
      const matchesStatus = !statusFilter || log.status === statusFilter
      const matchesSeverity = !severityFilter || log.severity === severityFilter
      return matchesSearch && matchesAction && matchesStatus && matchesSeverity
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, actionFilter, statusFilter, severityFilter, sortColumn, sortDirection])

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

  const handleActionFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setActionFilter(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSeverityFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSeverityFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedLogs(new Set(selected))
  }

  const toggleExpand = (id: string) => {
    setExpandedLog(expandedLog === id ? null : id)
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'info': return 'info'
      case 'warning': return 'warning'
      case 'error': return 'error'
      default: return 'default'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success': return 'success'
      case 'failed': return 'error'
      case 'blocked': return 'warning'
      case 'pending': return 'info'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Success'
      case 'failed': return 'Failed'
      case 'blocked': return 'Blocked'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  // Stats
  const totalLogs = AUDIT_LOGS_DATA.length
  const errorLogs = AUDIT_LOGS_DATA.filter(l => l.severity === 'error').length
  const warningLogs = AUDIT_LOGS_DATA.filter(l => l.severity === 'warning').length
  const uniqueActors = new Set(AUDIT_LOGS_DATA.map(l => l.actor)).size

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Events</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {totalLogs.toLocaleString()}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>📋</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Unique Actors</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {uniqueActors}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>👥</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Warnings</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: warningLogs > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {warningLogs}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: warningLogs > 0 ? 'var(--color-warning-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: warningLogs > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {warningLogs > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Errors</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: errorLogs > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {errorLogs}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: errorLogs > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: errorLogs > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {errorLogs > 0 ? '🔴' : '✅'}
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search audit logs..."
            value={search}
            onChange={handleSearchChange}
            prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
            size="sm"
          />
        </div>
        <Select
          value={actionFilter}
          onChangeRaw={handleActionFilterChange}
          placeholder="All Actions"
          options={ACTION_OPTIONS}
          size="sm"
          style={{ minWidth: 180 }}
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
          value={severityFilter}
          onChangeRaw={handleSeverityFilterChange}
          placeholder="All Severities"
          options={SEVERITY_OPTIONS}
          size="sm"
          style={{ minWidth: 140 }}
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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="secondary" size="sm">
            <span style={{ marginRight: 'var(--spacing-1)' }}>⬇️</span>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Log Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredLogs.length} of {AUDIT_LOGS_DATA.length} log entries
        {selectedLogs.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedLogs.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={[
            { key: 'timestamp', header: 'Timestamp', sortable: true, width: 160, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{log.timestamp}</div>
            )},
            { key: 'actor', header: 'Actor', sortable: true, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <Avatar size="sm" name={log.actor} src="" style={{ backgroundColor: log.color + '22', color: log.color, borderColor: log.color + '44' }}>
                  {log.actor.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{log.actor}</div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>{log.actorId}</div>
                </div>
              </div>
            )},
            { key: 'action', header: 'Action', sortable: true, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <Badge variant="default" size="sm">{log.action}</Badge>
            )},
            { key: 'resource', header: 'Resource', sortable: true, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-body-sm)' }}>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{log.resource}</span>
                <span style={{ color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>{log.resourceId}</span>
              </div>
            )},
            { key: 'detail', header: 'Detail', sortable: true, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', maxWidth: 300, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{log.detail}</div>
            )},
            { key: 'ip', header: 'IP Address', sortable: true, width: 140, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{log.ip}</div>
            )},
            { key: 'status', header: 'Status', sortable: true, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <Badge variant={getStatusVariant(log.status)} size="sm" dot>
                {getStatusLabel(log.status)}
              </Badge>
            )},
            { key: 'severity', header: 'Severity', sortable: true, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <Badge variant={getSeverityVariant(log.severity)} size="sm" dot>
                {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
              </Badge>
            )},
            { key: 'expand', header: '', width: 40, render: (log: typeof AUDIT_LOGS_DATA[0]) => (
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleExpand(log.id) }} style={{ padding: '2px 6px' }}>
                {expandedLog === log.id ? '▼' : '▶'}
              </Button>
            )},
          ]}
          rows={filteredLogs}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedLogs)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No audit logs found"
          selectable
        />
      </Card>

      {/* Expanded Detail Row */}
      {expandedLog && (
        <Card variant="outlined" style={{ marginTop: 'var(--spacing-2)' }}>
          {(() => {
            const log = AUDIT_LOGS_DATA.find(l => l.id === expandedLog)
            if (!log) return null
            return (
              <div style={{ padding: 'var(--spacing-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Actor</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{log.actor} ({log.actorId})</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Action</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{log.action}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Resource</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{log.resource} / {log.resourceId}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>IP Address</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{log.ip}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Status</div>
                    <Badge variant={getStatusVariant(log.status)} size="sm">{getStatusLabel(log.status)}</Badge>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Severity</div>
                    <Badge variant={getSeverityVariant(log.severity)} size="sm">{log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}</Badge>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border-primary)' }}>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Detail</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', backgroundColor: 'var(--color-surface-container)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)' }}>
                    {log.detail}
                  </div>
                </div>
              </div>
            )
          })()}
        </Card>
      )}
    </div>
  )
}