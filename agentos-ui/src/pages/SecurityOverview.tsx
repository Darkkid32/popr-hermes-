// Security Overview Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

export function SecurityOverview() {
  return (
    <div>
      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-4)', 
        marginBottom: 'var(--spacing-6)' 
      }}>
        {SECURITY_STATS.map((stat) => (
          <Card key={stat.label} variant="elevated" padding="md">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-display-sm)' }}>{stat.icon}</span>
                <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
                  {stat.label}
                </span>
              </div>
              <Badge 
                variant={stat.changeType === 'positive' ? 'success' : stat.changeType === 'negative' ? 'error' : 'default'} 
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
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Recent Threats */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>⚡</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                RECENT THREATS
              </span>
            </div>
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {RECENT_THREATS.map((threat) => (
              <div 
                key={threat.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 'var(--spacing-3)', 
                  padding: 'var(--spacing-3) 0',
                  borderTop: '1px solid var(--color-border-primary)'
                }}
              >
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  marginTop: '6px',
                  backgroundColor: threat.severity === 'critical' ? '#ff4d6d' : 
                    threat.severity === 'high' ? '#ffb347' : 
                    threat.severity === 'medium' ? '#00e5ff' : '#22d97a'
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                    <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {threat.title}
                    </span>
                    <Badge variant={threat.severity === 'critical' ? 'error' : threat.severity === 'high' ? 'warning' : threat.severity === 'medium' ? 'info' : 'success'} size="sm">
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                    <span>{threat.source}</span>
                    <span>{threat.time}</span>
                    <Badge variant="default" size="sm">{threat.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Vulnerability Summary */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>🔍</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                VULNERABILITY SUMMARY
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {VULNERABILITY_SUMMARY.map((vuln) => (
              <div key={vuln.severity} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-2) 0', borderTop: '1px solid var(--color-border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: vuln.color 
                  }} />
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {vuln.severity}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    {vuln.count}
                  </span>
                  <Badge variant={vuln.trend.startsWith('+') ? 'error' : 'success'} size="sm">
                    {vuln.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Compliance & Quick Actions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        {/* Compliance Frameworks */}
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)' }}>🛡️</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                COMPLIANCE FRAMEWORKS
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {COMPLIANCE_FRAMEWORKS.map((comp) => (
              <div 
                key={comp.name} 
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
                    {comp.name}
                  </div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>
                    Last audit: {comp.lastAudit}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <Badge variant={comp.status === 'compliant' ? 'success' : comp.status === 'in_progress' ? 'warning' : 'error'} size="sm" dot>
                    {comp.status === 'compliant' ? 'Compliant' : comp.status === 'in_progress' ? 'In Progress' : 'Non-Compliant'}
                  </Badge>
                  <span style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    {comp.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

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
              <span style={{ marginRight: 'var(--spacing-2)' }}>🔍</span>
              Run Vulnerability Scan
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🔐</span>
              Rotate API Keys
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🛡️</span>
              Update Policies
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>📋</span>
              Generate Compliance Report
            </Button>
            <Button variant="secondary" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>🚫</span>
              Block Suspicious IPs
            </Button>
            <Button variant="ghost" size="md">
              <span style={{ marginRight: 'var(--spacing-2)' }}>⚙️</span>
              Security Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Data constants
const SECURITY_STATS = [
  { label: 'Threats Detected', value: '23', change: '+5', changeType: 'negative', icon: '⚠️', severity: 'critical' },
  { label: 'Vulnerabilities', value: '147', change: '+12', changeType: 'negative', icon: '🔍', severity: 'high' },
  { label: 'Open Incidents', value: '8', change: '-2', changeType: 'positive', icon: '📋', severity: 'medium' },
  { label: 'Compliance Score', value: '94%', change: '+1%', changeType: 'positive', icon: '🛡️', severity: 'good' },
  { label: 'Blocked IPs', value: '1,247', change: '+89', changeType: 'neutral', icon: '🚫', severity: 'info' },
  { label: 'Failed Logins (24h)', value: '342', change: '-15%', changeType: 'positive', icon: '🔐', severity: 'info' },
]

const RECENT_THREATS = [
  { id: '1', type: 'malware', title: 'Suspicious script execution', severity: 'critical', source: 'OpenClaw connector', time: '3m ago', status: 'investigating' },
  { id: '2', type: 'brute_force', title: 'Brute force attack detected', severity: 'high', source: 'SSH endpoint 10.0.0.45', time: '12m ago', status: 'blocked' },
  { id: '3', type: 'data_exfil', title: 'Unusual data transfer', severity: 'high', source: 'Hermes agent', time: '45m ago', status: 'contained' },
  { id: '4', type: 'privilege_esc', title: 'Privilege escalation attempt', severity: 'medium', source: 'OpenCode agent', time: '2h ago', status: 'resolved' },
  { id: '5', type: 'config_drift', title: 'Security config drift', severity: 'medium', source: 'Kubernetes cluster', time: '4h ago', status: 'remediating' },
]

const VULNERABILITY_SUMMARY = [
  { severity: 'Critical', count: 3, color: '#ff4d6d', trend: '+1' },
  { severity: 'High', count: 24, color: '#ffb347', trend: '+5' },
  { severity: 'Medium', count: 67, color: '#00e5ff', trend: '-2' },
  { severity: 'Low', count: 53, color: '#22d97a', trend: '-3' },
]

const COMPLIANCE_FRAMEWORKS = [
  { name: 'SOC 2 Type II', status: 'compliant', score: 98, lastAudit: 'Jan 2026' },
  { name: 'ISO 27001', status: 'compliant', score: 96, lastAudit: 'Nov 2025' },
  { name: 'GDPR', status: 'compliant', score: 94, lastAudit: 'Oct 2025' },
  { name: 'HIPAA', status: 'in_progress', score: 72, lastAudit: '—' },
  { name: 'PCI DSS', status: 'non_compliant', score: 45, lastAudit: '—' },
]