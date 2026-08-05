// Organization Overview Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Avatar } from '../design-system/components/data-display/Avatar'
import { Button } from '../design-system/components/data-display/Button'

const ORG_STATS = [
  { label: 'Members', value: '247', change: '+12', changeType: 'positive', icon: '👥' },
  { label: 'Teams', value: '18', change: '+3', changeType: 'positive', icon: '📁' },
  { label: 'Workspaces', value: '12', change: '0', changeType: 'neutral', icon: '🏢' },
  { label: 'Projects', value: '89', change: '+7', changeType: 'positive', icon: '📋' },
  { label: 'Roles', value: '24', change: '+2', changeType: 'positive', icon: '🔐' },
  { label: 'SSO Providers', value: '3', change: '0', changeType: 'neutral', icon: '🔗' },
]

const RECENT_ACTIVITY = [
  { id: '1', type: 'member_joined', title: 'Sarah Chen joined', detail: 'Added to Engineering team', time: '2m ago', avatar: 'SC', color: '#ff4d6d' },
  { id: '2', type: 'team_created', title: 'Team created', detail: 'Platform Engineering team created', time: '15m ago', avatar: 'PE', color: '#7c6cf5' },
  { id: '3', type: 'role_assigned', title: 'Role assigned', detail: 'Admin role granted to Marcus', time: '1h ago', avatar: 'M', color: '#22d97a' },
  { id: '4', type: 'workspace_created', title: 'Workspace created', detail: 'New project: Hermes v11', time: '3h ago', avatar: 'HV', color: '#00e5ff' },
  { id: '5', type: 'sso_configured', title: 'SSO configured', detail: 'Okta integration enabled', time: '5h ago', avatar: 'OK', color: '#d946ef' },
]

const COMPLIANCE_STATUS = [
  { standard: 'SOC 2 Type II', status: 'compliant', lastAudit: 'Jan 2026', nextAudit: 'Jan 2027' },
  { standard: 'ISO 27001', status: 'compliant', lastAudit: 'Nov 2025', nextAudit: 'Nov 2026' },
  { standard: 'GDPR', status: 'compliant', lastAudit: 'Oct 2025', nextAudit: 'Apr 2026' },
  { standard: 'HIPAA', status: 'in_progress', lastAudit: '—', nextAudit: 'Q3 2026' },
]

function getBadgeVariant(changeType: string) {
  if (changeType === 'positive') return 'success'
  if (changeType === 'negative') return 'error'
  return 'default'
}

function getComplianceVariant(status: string) {
  if (status === 'compliant') return 'success'
  if (status === 'in_progress') return 'warning'
  return 'error'
}

export function OrganizationOverview() {
  return (
    <div>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4)', 
        marginBottom: 'var(--spacing-6)' 
      }}>
        {ORG_STATS.map((stat) => (
          <Card key={stat.label} variant="elevated" padding="md">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-display-sm)' }}>{stat.icon}</span>
                <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
                  {stat.label}
                </span>
              </div>
              <Badge 
                variant={getBadgeVariant(stat.changeType)} 
                size="sm"
              >
                {stat.change}
              </Badge>
            </div>
            <div style={{ fontSize: 'var(--text-display-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Recent Activity */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>📋</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                RECENT ACTIVITY
              </span>
            </div>
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {RECENT_ACTIVITY.map((activity) => (
              <div 
                key={activity.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 'var(--spacing-3)', 
                  padding: 'var(--spacing-3) 0',
                  borderTop: '1px solid var(--color-border-primary)'
                }}
              >
                <Avatar 
                  size="md" 
                  name={activity.title} 
                  src="" 
                  style={{ backgroundColor: activity.color + '22', color: activity.color, borderColor: activity.color + '44', flexShrink: 0 }}
                >
                  {activity.avatar}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                    <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {activity.title}
                    </span>
                    <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>
                      {activity.time}
                    </span>
                  </div>
                  <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                    {activity.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Compliance Status */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>🛡️</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                COMPLIANCE STATUS
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {COMPLIANCE_STATUS.map((comp) => (
              <div 
                key={comp.standard} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-3) 0',
                  borderTop: '1px solid var(--color-border-primary)'
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {comp.standard}
                  </div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                    Last audit: {comp.lastAudit} · Next: {comp.nextAudit}
                  </div>
                </div>
                <Badge 
                  variant={getComplianceVariant(comp.status)} 
                  size="sm"
                  dot
                >
                  {comp.status === 'compliant' ? 'Compliant' : comp.status === 'in_progress' ? 'In Progress' : 'Non-Compliant'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="outlined">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span style={{ fontSize: 'var(--text-display-sm)' }}>⚡</span>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              QUICK ACTIONS
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
          <Button variant="primary" size="md">
            <span style={{ marginRight: 'var(--spacing-2)' }}>➕</span>
            Invite Member
          </Button>
          <Button variant="secondary" size="md">
            <span style={{ marginRight: 'var(--spacing-2)' }}>📁</span>
            Create Team
          </Button>
          <Button variant="secondary" size="md">
            <span style={{ marginRight: 'var(--spacing-2)' }}>🔐</span>
            Manage Roles
          </Button>
          <Button variant="secondary" size="md">
            <span style={{ marginRight: 'var(--spacing-2)' }}>🏢</span>
            New Workspace
          </Button>
          <Button variant="secondary" size="md">
            <span style={{ marginRight: 'var(--spacing-2)' }}>🔗</span>
            Configure SSO
          </Button>
          <Button variant="ghost" size="md">
            <span style={{ marginRight: 'var(--spacing-2)' }}>⚙️</span>
            Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}