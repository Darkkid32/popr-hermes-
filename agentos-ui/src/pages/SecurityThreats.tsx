// Security Threat Detection Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'

const THREATS_DATA = [
  { id: 'threat-001', type: 'brute_force', title: 'SSH Brute Force Attack', severity: 'critical', source: '203.0.113.45', target: 'prod-ssh-bastion', status: 'blocked', detected: '2026-07-15 14:32', mitre: 'T1110.001', color: '#ff4d6d' },
  { id: 'threat-002', type: 'malware', title: 'Suspicious Script Execution', severity: 'critical', source: 'openclaw-connector', target: 'hermes-agent-3', status: 'investigating', detected: '2026-07-15 14:28', mitre: 'T1059.004', color: '#ff4d6d' },
  { id: 'threat-003', type: 'data_exfil', title: 'Unusual Outbound Transfer', severity: 'high', source: 'hermes-agent-7', target: 'external:198.51.100.23', status: 'contained', detected: '2026-07-15 13:45', mitre: 'T1041', color: '#ffb347' },
  { id: 'threat-004', type: 'privilege_esc', title: 'Privilege Escalation Attempt', severity: 'high', source: 'opencode-agent', target: 'k8s-cluster-prod', status: 'resolved', detected: '2026-07-15 11:20', mitre: 'T1068', color: '#ffb347' },
  { id: 'threat-005', type: 'config_drift', title: 'Security Config Drift Detected', severity: 'medium', source: 'k8s-cluster-staging', target: 'network-policy', status: 'remediating', detected: '2026-07-15 09:15', mitre: 'T1578.002', color: '#00e5ff' },
  { id: 'threat-006', type: 'credential_access', title: 'Credential Dumping Attempt', severity: 'high', source: '192.168.1.200', target: 'workstation-dev-04', status: 'blocked', detected: '2026-07-14 16:45', mitre: 'T1003', color: '#ffb347' },
  { id: 'threat-007', type: 'lateral_movement', title: 'Suspicious Lateral Movement', severity: 'high', source: 'compromised-svc-acct', target: 'internal-db', status: 'investigating', detected: '2026-07-14 14:30', mitre: 'T1080', color: '#ffb347' },
  { id: 'threat-008', type: 'phishing', title: 'Phishing Email Detected', severity: 'medium', source: 'email-gateway', target: 'user-12', status: 'quarantined', detected: '2026-07-14 10:00', mitre: 'T1566.002', color: '#00e5ff' },
  { id: 'threat-009', type: 'crypto_mining', title: 'Cryptomining Process', severity: 'high', source: 'dev-worker-3', target: 'k8s-node-7', status: 'resolved', detected: '2026-07-13 22:15', mitre: 'T1496', color: '#ffb347' },
  { id: 'threat-010', type: 'supply_chain', title: 'Malicious Dependency Detected', severity: 'critical', source: 'npm-registry', target: 'build-pipeline', status: 'blocked', detected: '2026-07-13 18:00', mitre: 'T1195.001', color: '#ff4d6d' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'brute_force', label: 'Brute Force' },
  { value: 'malware', label: 'Malware' },
  { value: 'data_exfil', label: 'Data Exfiltration' },
  { value: 'privilege_esc', label: 'Privilege Escalation' },
  { value: 'config_drift', label: 'Config Drift' },
  { value: 'credential_access', label: 'Credential Access' },
  { value: 'lateral_movement', label: 'Lateral Movement' },
  { value: 'phishing', label: 'Phishing' },
  { value: 'crypto_mining', label: 'Cryptomining' },
  { value: 'supply_chain', label: 'Supply Chain' },
]

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'contained', label: 'Contained' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'remediating', label: 'Remediating' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'quarantined', label: 'Quarantined' },
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

export function SecurityThreats() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('detected')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedThreats, setSelectedThreats] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('active')

  const filteredThreats = useMemo(() => {
    return THREATS_DATA.filter(threat => {
      const matchesSearch = threat.title.toLowerCase().includes(search.toLowerCase()) ||
        threat.source.toLowerCase().includes(search.toLowerCase()) ||
        threat.target.toLowerCase().includes(search.toLowerCase()) ||
        threat.mitre.toLowerCase().includes(search.toLowerCase())
      const matchesType = !typeFilter || threat.type === typeFilter
      const matchesSeverity = !severityFilter || threat.severity === severityFilter
      const matchesStatus = !statusFilter || threat.status === statusFilter
      return matchesSearch && matchesType && matchesSeverity && matchesStatus
    }).sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a]
      const bVal = b[sortColumn as keyof typeof b]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [search, typeFilter, severityFilter, statusFilter, sortColumn, sortDirection])

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

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedThreats(new Set(selected))
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error'
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'blocked': return 'success'
      case 'contained': return 'success'
      case 'resolved': return 'success'
      case 'investigating': return 'warning'
      case 'remediating': return 'warning'
      case 'quarantined': return 'info'
      default: return 'default'
    }
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (threat: typeof THREATS_DATA[0]) => (
      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: threat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: threat.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
        {threat.type === 'brute_force' ? '🔑' : threat.type === 'malware' ? '🦠' : threat.type === 'data_exfil' ? '📤' : threat.type === 'privilege_esc' ? '⬆️' : threat.type === 'config_drift' ? '🔧' : threat.type === 'credential_access' ? '🔐' : threat.type === 'lateral_movement' ? '➡️' : threat.type === 'phishing' ? '🎣' : threat.type === 'crypto_mining' ? '⛏️' : '📦'}
      </div>
    )},
    { key: 'title', header: 'Threat', sortable: true, render: (threat: typeof THREATS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{threat.title}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{threat.mitre}</div>
      </div>
    )},
    { key: 'severity', header: 'Severity', sortable: true, render: (threat: typeof THREATS_DATA[0]) => (
      <Badge variant={getSeverityVariant(threat.severity)} size="sm" dot>
        {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
      </Badge>
    )},
    { key: 'source', header: 'Source', sortable: true, render: (threat: typeof THREATS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{threat.source}</div>
    )},
    { key: 'target', header: 'Target', sortable: true, render: (threat: typeof THREATS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{threat.target}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (threat: typeof THREATS_DATA[0]) => (
      <Badge variant={getStatusVariant(threat.status)} size="sm" dot>
        {threat.status.charAt(0).toUpperCase() + threat.status.slice(1).replace('_', ' ')}
      </Badge>
    )},
    { key: 'detected', header: 'Detected', sortable: true, render: (threat: typeof THREATS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{threat.detected}</div>
    )},
    { key: 'actions', header: '', width: 80, render: () => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation() }}>Details</Button>
    )},
  ]

  // Stats
  const criticalCount = THREATS_DATA.filter(t => t.severity === 'critical').length
  const investigatingCount = THREATS_DATA.filter(t => t.status === 'investigating' || t.status === 'remediating').length
  const blockedCount = THREATS_DATA.filter(t => t.status === 'blocked' || t.status === 'contained' || t.status === 'resolved').length

  const tabs = [
    { id: 'active', label: 'Active Threats' },
    { id: 'history', label: 'Threat History' },
    { id: 'rules', label: 'Detection Rules' },
  ]

  const tabFilteredThreats = useMemo(() => {
    if (activeTab === 'active') return filteredThreats.filter(t => t.status !== 'resolved' && t.status !== 'contained' && t.status !== 'blocked')
    if (activeTab === 'history') return filteredThreats
    return filteredThreats
  }, [filteredThreats, activeTab])

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Threats</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {THREATS_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>⚠️</div>
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
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Investigating</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: investigatingCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {investigatingCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: investigatingCount > 0 ? 'var(--color-warning-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: investigatingCount > 0 ? 'var(--color-warning-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {investigatingCount > 0 ? '🔍' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Blocked/Resolved</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                {blockedCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search threats..."
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
          style={{ minWidth: 160 }}
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
          value={statusFilter}
          onChangeRaw={handleStatusFilterChange}
          placeholder="All Status"
          options={STATUS_OPTIONS}
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
        aria-label="Threat detection tabs"
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

      {/* Threat Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {tabFilteredThreats.length} of {THREATS_DATA.length} threats
        {selectedThreats.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedThreats.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={tabFilteredThreats}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedThreats)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No threats found"
          selectable
        />
      </Card>

      {/* Detection Rules Tab Content */}
      {activeTab === 'rules' && (
        <Card variant="elevated" style={{ marginTop: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>DETECTION RULES</span>
            <Button variant="primary" size="sm">Create Rule</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {[
              { name: 'SSH Brute Force', query: 'failed_ssh_login > 5/5m', severity: 'critical', enabled: true, lastTriggered: '2m ago' },
              { name: 'Suspicious Script Execution', query: 'process_exec where cmd contains "eval"', severity: 'critical', enabled: true, lastTriggered: '6m ago' },
              { name: 'Large Data Transfer', query: 'network_out > 100MB/1h', severity: 'high', enabled: true, lastTriggered: '15m ago' },
              { name: 'Privilege Escalation', query: 'sudo_exec where user != root', severity: 'high', enabled: true, lastTriggered: '2h ago' },
              { name: 'Config Drift', query: 'k8s_policy_change where not approved', severity: 'medium', enabled: true, lastTriggered: '6h ago' },
              { name: 'Credential Access', query: 'lsass_access or sam_dump', severity: 'high', enabled: true, lastTriggered: '1d ago' },
              { name: 'Cryptomining', query: 'cpu_high and network_pool_stratum', severity: 'high', enabled: false, lastTriggered: '3d ago' },
              { name: 'Supply Chain Attack', query: 'npm_install where package_new < 7d', severity: 'critical', enabled: true, lastTriggered: '1w ago' },
            ].map((rule, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{rule.name}</div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{rule.query}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <Badge variant={rule.severity === 'critical' ? 'error' : rule.severity === 'high' ? 'error' : rule.severity === 'medium' ? 'warning' : 'info'} size="sm">{rule.severity}</Badge>
                  <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>Last: {rule.lastTriggered}</span>
                  <input type="checkbox" defaultChecked={rule.enabled} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}