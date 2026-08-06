// Security Sessions Tab
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

const SESSIONS_DATA = [
  { id: 'sess-001', user: 'Sarah Chen', email: 'sarah.chen@hermes.ai', ip: '192.168.1.100', location: 'San Francisco, CA', device: 'Chrome on macOS', created: '2026-07-15 08:00', lastActive: '2026-07-15 14:32', status: 'active', mfa: true, riskScore: 12, color: '#ff4d6d' },
  { id: 'sess-002', user: 'Marcus Johnson', email: 'marcus.j@hermes.ai', ip: '10.0.0.50', location: 'New York, NY', device: 'Firefox on Windows', created: '2026-07-15 09:15', lastActive: '2026-07-15 14:28', status: 'active', mfa: true, riskScore: 8, color: '#7c6cf5' },
  { id: 'sess-003', user: 'Alex Rivera', email: 'alex.r@hermes.ai', ip: '10.0.0.75', location: 'Austin, TX', device: 'Safari on iOS', created: '2026-07-15 10:30', lastActive: '2026-07-15 14:25', status: 'active', mfa: true, riskScore: 5, color: '#d946ef' },
  { id: 'sess-004', user: 'Priya Patel', email: 'priya.p@hermes.ai', ip: '172.16.0.45', location: 'Seattle, WA', device: 'Chrome on Linux', created: '2026-07-15 11:00', lastActive: '2026-07-15 14:20', status: 'active', mfa: true, riskScore: 15, color: '#22d97a' },
  { id: 'sess-005', user: 'James Wilson', email: 'james.w@hermes.ai', ip: '203.0.113.45', location: 'Unknown', device: 'curl/7.68.0', created: '2026-07-15 12:00', lastActive: '2026-07-15 14:15', status: 'suspicious', mfa: false, riskScore: 85, color: '#ff4d6d' },
  { id: 'sess-006', user: 'Emily Davis', email: 'emily.d@hermes.ai', ip: '192.168.1.200', location: 'Boston, MA', device: 'Edge on Windows', created: '2026-07-14 18:00', lastActive: '2026-07-14 22:30', status: 'idle', mfa: true, riskScore: 22, color: '#ffb347' },
  { id: 'sess-007', user: 'David Kim', email: 'david.k@hermes.ai', ip: '10.0.0.80', location: 'Chicago, IL', device: 'Chrome on macOS', created: '2026-07-14 09:00', lastActive: '2026-07-14 17:45', status: 'expired', mfa: false, riskScore: 45, color: '#f06292' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'idle', label: 'Idle' },
  { value: 'expired', label: 'Expired' },
  { value: 'suspicious', label: 'Suspicious' },
  { value: 'revoked', label: 'Revoked' },
]

export function SecuritySessions() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortColumn, setSortColumn] = useState('lastActive')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set())
  const [revokingSession, setRevokingSession] = useState<string | null>(null)

  const filteredSessions = useMemo(() => {
    return SESSIONS_DATA.filter(session => {
      const matchesSearch = session.user.toLowerCase().includes(search.toLowerCase()) ||
        session.email.toLowerCase().includes(search.toLowerCase()) ||
        session.ip.includes(search) ||
        session.location.toLowerCase().includes(search.toLowerCase()) ||
        session.device.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || session.status === statusFilter
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

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedSessions(new Set(selected))
  }

  const revokeSession = (sessionId: string) => {
    setRevokingSession(sessionId)
    // In a real app, this would call an API
    setTimeout(() => {
      setRevokingSession(null)
    }, 1000)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'idle': return 'warning'
      case 'expired': return 'default'
      case 'suspicious': return 'error'
      case 'revoked': return 'default'
      default: return 'default'
    }
  }

  const getRiskVariant = (score: number) => {
    if (score <= 20) return 'success'
    if (score <= 50) return 'warning'
    return 'error'
  }

  const columns = [
    { key: 'avatar', header: '', width: 48, render: (session: typeof SESSIONS_DATA[0]) => (
      <Avatar size="sm" name={session.user} src="" style={{ backgroundColor: session.color + '22', color: session.color, borderColor: session.color + '44' }}>
        {session.user.split(' ').map(n => n[0]).join('')}
      </Avatar>
    )},
    { key: 'user', header: 'User', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{session.user}</div>
        <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{session.email}</div>
      </div>
    )},
    { key: 'ip', header: 'IP Address', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{session.ip}</div>
    )},
    { key: 'location', header: 'Location', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{session.location}</div>
    )},
    { key: 'device', header: 'Device', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{session.device}</div>
    )},
    { key: 'created', header: 'Created', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{session.created}</div>
    )},
    { key: 'lastActive', header: 'Last Active', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{session.lastActive}</div>
    )},
    { key: 'status', header: 'Status', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <Badge variant={getStatusVariant(session.status)} size="sm" dot>
        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
      </Badge>
    )},
    { key: 'mfa', header: 'MFA', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <Badge variant={session.mfa ? 'success' : 'error'} size="sm" dot>
        {session.mfa ? 'Verified' : 'Not Verified'}
      </Badge>
    )},
    { key: 'riskScore', header: 'Risk', sortable: true, render: (session: typeof SESSIONS_DATA[0]) => (
      <Badge variant={getRiskVariant(session.riskScore)} size="sm">{session.riskScore}</Badge>
    )},
    { key: 'actions', header: '', width: 100, render: (session: typeof SESSIONS_DATA[0]) => (
      <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
        <Button variant="ghost" size="sm" onClick={() => revokeSession(session.id)} disabled={revokingSession === session.id || session.status === 'revoked' || session.status === 'expired'}>
          {revokingSession === session.id ? '...' : 'Revoke'}
        </Button>
      </div>
    )},
  ]

  // Summary
  const activeCount = SESSIONS_DATA.filter(s => s.status === 'active').length
  const suspiciousCount = SESSIONS_DATA.filter(s => s.status === 'suspicious').length
  const mfaVerifiedCount = SESSIONS_DATA.filter(s => s.mfa).length
  const avgRisk = Math.round(SESSIONS_DATA.reduce((sum, s) => sum + s.riskScore, 0) / SESSIONS_DATA.length)

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Active Sessions</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                {activeCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>🔐</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Suspicious</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: suspiciousCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)' }}>
                {suspiciousCount}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: suspiciousCount > 0 ? 'var(--color-error-base)/15' : 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: suspiciousCount > 0 ? 'var(--color-error-base)' : 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>
              {suspiciousCount > 0 ? '⚠️' : '✅'}
            </div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>MFA Verified</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                {mfaVerifiedCount} / {SESSIONS_DATA.length}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>🛡️</div>
          </div>
        </Card>
        <Card variant="elevated" padding="md">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Avg Risk Score</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: avgRisk > 50 ? 'var(--color-error-base)' : avgRisk > 20 ? 'var(--color-warning-base)' : 'var(--color-success-base)' }}>
                {avgRisk}
              </div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>📊</div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Search sessions..."
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
          style={{ minWidth: 160 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="secondary" size="sm" onClick={() => selectedSessions.size > 0 && selectedSessions.forEach(id => revokeSession(id))} disabled={selectedSessions.size === 0}>
            <span style={{ marginRight: 'var(--spacing-1)' }}>🚫</span>
            Revoke Selected
          </Button>
        </div>
      </div>

      {/* Session Count */}
      <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
        {filteredSessions.length} of {SESSIONS_DATA.length} sessions
        {selectedSessions.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedSessions.size} selected</span>}
      </div>

      {/* Table */}
      <Card variant="elevated" padding="none">
        <Table
          columns={columns}
          rows={filteredSessions}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedRows={Array.from(selectedSessions)}
          onSelectionChange={handleSelectionChange}
          emptyMessage="No sessions found"
          selectable
        />
      </Card>

      {/* Revoke All Modal */}
      <Modal
        isOpen={selectedSessions.size > 0 && false} // This would be triggered by a "Revoke All" action
        onClose={() => setSelectedSessions(new Set())}
        title="Revoke Selected Sessions"
        size="md"
      >
        <div style={{ padding: 'var(--spacing-4)' }}>
          <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-4)' }}>
            Are you sure you want to revoke <strong>{selectedSessions.size}</strong> session(s)? This will immediately log out the affected users.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
            <Button variant="ghost" onClick={() => setSelectedSessions(new Set())}>Cancel</Button>
            <Button variant="danger" size="sm">Revoke All</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}