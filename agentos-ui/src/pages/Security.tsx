// Security Workspace - Main Entry Point
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, lazy, Suspense } from 'react'

// Lazy-loaded tab components
const SecurityOverview = lazy(() => import('./SecurityOverview').then(m => ({ default: m.SecurityOverview })))
const SecurityUsers = lazy(() => import('./SecurityUsers').then(m => ({ default: m.SecurityUsers })))
const SecurityRoles = lazy(() => import('./SecurityRoles').then(m => ({ default: m.SecurityRoles })))
const SecurityPermissions = lazy(() => import('./SecurityPermissions').then(m => ({ default: m.SecurityPermissions })))
const SecurityApiKeys = lazy(() => import('./SecurityApiKeys').then(m => ({ default: m.SecurityApiKeys })))
const SecuritySecrets = lazy(() => import('./SecuritySecrets').then(m => ({ default: m.SecuritySecrets })))
const SecurityCertificates = lazy(() => import('./SecurityCertificates').then(m => ({ default: m.SecurityCertificates })))
const SecurityPolicies = lazy(() => import('./SecurityPolicies').then(m => ({ default: m.SecurityPolicies })))
const SecuritySessions = lazy(() => import('./SecuritySessions').then(m => ({ default: m.SecuritySessions })))
const SecurityAuditLogs = lazy(() => import('./SecurityAuditLogs').then(m => ({ default: m.SecurityAuditLogs })))
const SecurityThreats = lazy(() => import('./SecurityThreats').then(m => ({ default: m.SecurityThreats })))
const SecurityCompliance = lazy(() => import('./SecurityCompliance').then(m => ({ default: m.SecurityCompliance })))
const SecuritySettings = lazy(() => import('./SecuritySettings').then(m => ({ default: m.SecuritySettings })))

const SuspenseFallback = () => (
  <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
    Loading...
  </div>
)

interface SecurityTab {
  id: string
  label: string
  component: React.ComponentType<any>
}

const SEC_TABS: SecurityTab[] = [
  { id: 'overview', label: 'Overview', component: SecurityOverview },
  { id: 'users', label: 'Users', component: SecurityUsers },
  { id: 'roles', label: 'Roles', component: SecurityRoles },
  { id: 'permissions', label: 'Permissions', component: SecurityPermissions },
  { id: 'api-keys', label: 'API Keys', component: SecurityApiKeys },
  { id: 'secrets', label: 'Secrets', component: SecuritySecrets },
  { id: 'certificates', label: 'Certificates', component: SecurityCertificates },
  { id: 'policies', label: 'Policies', component: SecurityPolicies },
  { id: 'sessions', label: 'Sessions', component: SecuritySessions },
  { id: 'audit', label: 'Audit Logs', component: SecurityAuditLogs },
  { id: 'threats', label: 'Threat Detection', component: SecurityThreats },
  { id: 'compliance', label: 'Compliance', component: SecurityCompliance },
  { id: 'settings', label: 'Settings', component: SecuritySettings },
]

export function Security() {
  const [activeTab, setActiveTab] = useState('overview')

  const ActiveComponent = SEC_TABS.find(t => t.id === activeTab)?.component || SecurityOverview

  return (
    <div className="page-body" style={{ padding: 'var(--spacing-6)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="page-header">
          <div className="page-eyebrow">
            <span className="roman">XXII.</span>
            <span className="sep">·</span>
            <span>Self · Security</span>
          </div>
          <h1 className="page-title">Security</h1>
          <p className="page-sub">
            Threat detection, vulnerability management, compliance, audit logs, and access control.
          </p>
        </div>

        {/* Status Bar */}
        <div className="status-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success-base)' }} />
            security active
          </span>
          <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-info-base)/15', color: 'var(--color-info-base)', border: '1px solid var(--color-info-base)/30' }}>
            Hermes Cloud · minimax-m3
          </span>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            Ollama live
          </span>
          <span className="badge badge-gray" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-text-tertiary)', border: '1px solid var(--color-border-primary)' }}>
            v10.0.0 · 4 agents · 1,261 memories
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
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
        aria-label="Security tabs"
      >
        {SEC_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
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
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Suspense fallback={<SuspenseFallback />}>
        <ActiveComponent />
      </Suspense>
    </div>
  )
}