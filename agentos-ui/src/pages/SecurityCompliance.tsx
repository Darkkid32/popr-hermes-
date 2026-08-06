// Security Compliance Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

const COMPLIANCE_FRAMEWORKS = [
  { id: '1', name: 'SOC 2 Type II', description: 'Security, availability, and confidentiality', status: 'compliant', score: 98, lastAudit: 'Jan 2026', nextAudit: 'Jan 2027', auditor: 'Deloitte', controls: 64, passed: 63, failed: 1, color: '#22d97a' },
  { id: '2', name: 'ISO 27001', description: 'Information security management', status: 'compliant', score: 96, lastAudit: 'Nov 2025', nextAudit: 'Nov 2026', auditor: 'BSI', controls: 114, passed: 110, failed: 4, color: '#00e5ff' },
  { id: '3', name: 'GDPR', description: 'EU data protection regulation', status: 'compliant', score: 94, lastAudit: 'Oct 2025', nextAudit: 'Apr 2026', auditor: 'Internal', controls: 87, passed: 82, failed: 5, color: '#d946ef' },
  { id: '4', name: 'HIPAA', description: 'US healthcare data protection', status: 'in_progress', score: 72, lastAudit: '—', nextAudit: 'Q3 2026', auditor: 'Scheduled', controls: 52, passed: 37, failed: 15, color: '#ffb347' },
  { id: '5', name: 'PCI DSS', description: 'Payment card industry security', status: 'non_compliant', score: 45, lastAudit: '—', nextAudit: 'Q4 2026', auditor: 'Not Scheduled', controls: 78, passed: 35, failed: 43, color: '#ff4d6d' },
  { id: '6', name: 'SOX', description: 'Financial reporting controls', status: 'compliant', score: 91, lastAudit: 'Mar 2026', nextAudit: 'Mar 2027', auditor: 'PwC', controls: 45, passed: 41, failed: 4, color: '#7c6cf5' },
]

const CONTROLS_DATA = [
  { id: 'ctrl-1', framework: 'SOC 2', control: 'CC6.1', title: 'Logical Access Controls', status: 'passed', evidence: 'Quarterly access reviews', owner: 'Security Admin' },
  { id: 'ctrl-2', framework: 'SOC 2', control: 'CC6.2', title: 'Credential Management', status: 'passed', evidence: 'MFA enforced for all users', owner: 'Security Admin' },
  { id: 'ctrl-3', framework: 'SOC 2', control: 'CC6.3', title: 'Network Segmentation', status: 'passed', evidence: 'Prod/dev network isolation', owner: 'Platform Eng' },
  { id: 'ctrl-4', framework: 'ISO 27001', control: 'A.9.2.3', title: 'Privileged Access Rights', status: 'passed', evidence: 'Just-in-time access', owner: 'Security Admin' },
  { id: 'ctrl-5', framework: 'ISO 27001', control: 'A.12.6.1', title: 'Vulnerability Management', status: 'failed', evidence: 'Weekly scans not completed', owner: 'Security Team' },
  { id: 'ctrl-6', framework: 'GDPR', control: 'Art. 32', title: 'Encryption at Rest', status: 'passed', evidence: 'AES-256 for all storage', owner: 'Platform Eng' },
  { id: 'ctrl-7', framework: 'GDPR', control: 'Art. 25', title: 'Data Minimization', status: 'failed', evidence: 'PII retention policy missing', owner: 'Legal' },
  { id: 'ctrl-8', framework: 'HIPAA', control: '164.312(a)', title: 'Access Control', status: 'in_progress', evidence: 'RBAC implementation 60%', owner: 'Security Admin' },
  { id: 'ctrl-9', framework: 'PCI DSS', control: 'Req 3.4', title: 'PAN Encryption', status: 'failed', evidence: 'Tokenization not implemented', owner: 'Payments Team' },
  { id: 'ctrl-10', framework: 'SOX', control: '404', title: 'IT Change Controls', status: 'passed', evidence: 'Automated change tracking', owner: 'Platform Eng' },
]

export function SecurityCompliance() {
  const [activeTab, setActiveTab] = useState('frameworks')
  const [selectedFramework, setSelectedFramework] = useState('SOC 2')

  const tabs = [
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'controls', label: 'Control Matrix' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'reports', label: 'Reports' },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'compliant': return 'success'
      case 'in_progress': return 'warning'
      case 'non_compliant': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant': return 'Compliant'
      case 'in_progress': return 'In Progress'
      case 'non_compliant': return 'Non-Compliant'
      default: return status
    }
  }

  const filteredControls = CONTROLS_DATA.filter(c => c.framework === selectedFramework)

  return (
    <div>
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-2)',
          marginBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--color-border-primary)',
          paddingBottom: 'var(--spacing-2)'
        }}
        role="tablist"
        aria-label="Compliance tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary-glow)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Frameworks Tab */}
      {activeTab === 'frameworks' && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Frameworks</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {COMPLIANCE_FRAMEWORKS.length}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>🛡️</div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Compliant</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                    {COMPLIANCE_FRAMEWORKS.filter(f => f.status === 'compliant').length}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>In Progress</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-warning-base)' }}>
                    {COMPLIANCE_FRAMEWORKS.filter(f => f.status === 'in_progress').length}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning-base)', fontSize: 'var(--text-display-sm)' }}>📝</div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Non-Compliant</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-error-base)' }}>
                    {COMPLIANCE_FRAMEWORKS.filter(f => f.status === 'non_compliant').length}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-error-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-error-base)', fontSize: 'var(--text-display-sm)' }}>🔴</div>
              </div>
            </Card>
          </div>

          {/* Frameworks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-4)' }}>
            {COMPLIANCE_FRAMEWORKS.map(framework => (
              <Card key={framework.id} variant="elevated">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', backgroundColor: framework.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: framework.color, fontSize: 'var(--text-display-sm)' }}>
                      📋
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)' }}>{framework.name}</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{framework.description}</div>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(framework.status)} size="sm" dot>
                    {getStatusLabel(framework.status)}
                  </Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Compliance Score</div>
                      <div style={{ fontSize: 'var(--text-display-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: framework.score >= 90 ? 'var(--color-success-base)' : framework.score >= 70 ? 'var(--color-warning-base)' : 'var(--color-error-base)' }}>
                        {framework.score}%
                      </div>
                    </div>
                    <div style={{ width: 1, height: 40, backgroundColor: 'var(--color-border-primary)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Controls</div>
                      <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                        {framework.passed} / {framework.controls}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Last Audit</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{framework.lastAudit}</div>
                    </div>
                    <div style={{ width: 1, height: 40, backgroundColor: 'var(--color-border-primary)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Next Audit</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{framework.nextAudit}</div>
                    </div>
                    <div style={{ width: 1, height: 40, backgroundColor: 'var(--color-border-primary)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Auditor</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)' }}>{framework.auditor}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button variant="secondary" size="sm">View Controls</Button>
                  <Button variant="ghost" size="sm">Export Report</Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Control Matrix Tab */}
      {activeTab === 'controls' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>CONTROL MATRIX</span>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                style={{ padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-background-base)', color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}
              >
                {['SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 'SOX'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface)' }}>
                  <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-primary)' }}>Control ID</th>
                  <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-primary)' }}>Title</th>
                  <th style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-primary)' }}>Status</th>
                  <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-primary)' }}>Evidence</th>
                  <th style={{ padding: 'var(--spacing-3)', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-primary)' }}>Owner</th>
                </tr>
              </thead>
              <tbody>
                {filteredControls.map(control => (
                  <tr key={control.id} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <td style={{ padding: 'var(--spacing-3)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{control.control}</td>
                    <td style={{ padding: 'var(--spacing-3)', color: 'var(--color-text-primary)' }}>{control.title}</td>
                    <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                      <Badge
                        variant={control.status === 'passed' ? 'success' : control.status === 'failed' ? 'error' : 'warning'}
                        size="sm"
                        dot
                      >
                        {control.status.charAt(0).toUpperCase() + control.status.slice(1)}
                      </Badge>
                    </td>
                    <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{control.evidence}</td>
                    <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{control.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>COMPLIANCE EVIDENCE</span>
            <Button variant="primary" size="sm">Upload Evidence</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {[
              { name: 'SOC 2 Access Review Q2 2026', framework: 'SOC 2', type: 'PDF', size: '2.4 MB', uploaded: '2026-07-01', status: 'approved' },
              { name: 'ISO 27001 Vulnerability Scan Report', framework: 'ISO 27001', type: 'PDF', size: '5.1 MB', uploaded: '2026-07-10', status: 'pending' },
              { name: 'GDPR Data Processing Register', framework: 'GDPR', type: 'XLSX', size: '890 KB', uploaded: '2026-06-15', status: 'approved' },
              { name: 'HIPAA Risk Assessment Draft', framework: 'HIPAA', type: 'PDF', size: '3.2 MB', uploaded: '2026-07-12', status: 'draft' },
              { name: 'PCI DSS Network Diagram', framework: 'PCI DSS', type: 'VSDX', size: '1.5 MB', uploaded: '2026-06-01', status: 'rejected' },
              { name: 'SOX Change Control Logs', framework: 'SOX', type: 'CSV', size: '4.7 MB', uploaded: '2026-07-05', status: 'approved' },
            ].map((evidence, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{evidence.name}</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{evidence.framework} • {evidence.type} • {evidence.size}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <Badge variant={evidence.status === 'approved' ? 'success' : evidence.status === 'pending' ? 'warning' : evidence.status === 'draft' ? 'info' : 'error'} size="sm" dot>
                    {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
                  </Badge>
                  <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)' }}>{evidence.uploaded}</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>COMPLIANCE REPORTS</span>
            <Button variant="primary" size="sm">Generate Report</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
            {[
              { name: 'SOC 2 Type II Report 2026', framework: 'SOC 2', period: 'Jan 2026', status: 'published', size: '12.4 MB' },
              { name: 'ISO 27001 Surveillance Audit', framework: 'ISO 27001', period: 'Nov 2025', status: 'published', size: '8.7 MB' },
              { name: 'GDPR Compliance Assessment', framework: 'GDPR', period: 'Oct 2025', status: 'published', size: '5.2 MB' },
              { name: 'HIPAA Gap Analysis', framework: 'HIPAA', period: 'Q3 2026 (Planned)', status: 'draft', size: '—' },
              { name: 'PCI DSS Readiness Report', framework: 'PCI DSS', period: 'Q4 2026 (Planned)', status: 'draft', size: '—' },
              { name: 'SOX 404 IT Controls Report', framework: 'SOX', period: 'Mar 2026', status: 'published', size: '6.3 MB' },
            ].map((report, i) => (
              <Card key={i} variant="outlined">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{report.name}</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{report.framework} • {report.period}</div>
                  </div>
                  <Badge variant={report.status === 'published' ? 'success' : 'warning'} size="sm" dot>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{report.size}</span>
                  <Button variant="ghost" size="sm" disabled={report.status === 'draft'}>Download</Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}