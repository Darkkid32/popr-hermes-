// Organization Workspace - Main Entry Point
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, lazy, Suspense } from 'react'

// Lazy-loaded tab components
const OrganizationOverview = lazy(() => import('./OrganizationOverview').then(m => ({ default: m.OrganizationOverview })))
const OrganizationMembers = lazy(() => import('./OrganizationMembers').then(m => ({ default: m.OrganizationMembers })))
const OrganizationTeams = lazy(() => import('./OrganizationTeams').then(m => ({ default: m.OrganizationTeams })))
const OrganizationRoles = lazy(() => import('./OrganizationRoles').then(m => ({ default: m.OrganizationRoles })))
const OrganizationPermissions = lazy(() => import('./OrganizationPermissions').then(m => ({ default: m.OrganizationPermissions })))
const OrganizationRBAC = lazy(() => import('./OrganizationRBAC').then(m => ({ default: m.OrganizationRBAC })))
const OrganizationWorkspaces = lazy(() => import('./OrganizationWorkspaces').then(m => ({ default: m.OrganizationWorkspaces })))
const OrganizationProjects = lazy(() => import('./OrganizationProjects').then(m => ({ default: m.OrganizationProjects })))
const OrganizationEnvironments = lazy(() => import('./OrganizationEnvironments').then(m => ({ default: m.OrganizationEnvironments })))
const OrganizationLicenses = lazy(() => import('./OrganizationLicenses').then(m => ({ default: m.OrganizationLicenses })))
const OrganizationQuotas = lazy(() => import('./OrganizationQuotas').then(m => ({ default: m.OrganizationQuotas })))
const OrganizationActivity = lazy(() => import('./OrganizationActivity').then(m => ({ default: m.OrganizationActivity })))
const OrganizationAuditLogs = lazy(() => import('./OrganizationAuditLogs').then(m => ({ default: m.OrganizationAuditLogs })))
const OrganizationSSO = lazy(() => import('./OrganizationSSO').then(m => ({ default: m.OrganizationSSO })))
const OrganizationSettings = lazy(() => import('./OrganizationSettings').then(m => ({ default: m.OrganizationSettings })))

const SuspenseFallback = () => (
  <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
    Loading...
  </div>
)

interface OrganizationTab {
  id: string
  label: string
  component: React.ComponentType<any>
}

const ORG_TABS: OrganizationTab[] = [
  { id: 'overview', label: 'Overview', component: OrganizationOverview },
  { id: 'members', label: 'Members', component: OrganizationMembers },
  { id: 'teams', label: 'Teams', component: OrganizationTeams },
  { id: 'roles', label: 'Roles', component: OrganizationRoles },
  { id: 'permissions', label: 'Permissions', component: OrganizationPermissions },
  { id: 'rbac', label: 'RBAC Builder', component: OrganizationRBAC },
  { id: 'workspaces', label: 'Workspaces', component: OrganizationWorkspaces },
  { id: 'projects', label: 'Projects', component: OrganizationProjects },
  { id: 'environments', label: 'Environments', component: OrganizationEnvironments },
  { id: 'licenses', label: 'Licenses', component: OrganizationLicenses },
  { id: 'quotas', label: 'Quotas', component: OrganizationQuotas },
  { id: 'activity', label: 'Activity', component: OrganizationActivity },
  { id: 'audit', label: 'Audit Logs', component: OrganizationAuditLogs },
  { id: 'sso', label: 'SSO Config', component: OrganizationSSO },
  { id: 'settings', label: 'Settings', component: OrganizationSettings },
]

export function Organization() {
  const [activeTab, setActiveTab] = useState('overview')

  const ActiveComponent = ORG_TABS.find(t => t.id === activeTab)?.component || OrganizationOverview

  return (
    <div className="page-body" style={{ padding: 'var(--spacing-6)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="page-header">
          <div className="page-eyebrow">
            <span className="roman">II.</span>
            <span className="sep">·</span>
            <span>Self · Organization</span>
          </div>
          <h1 className="page-title">Organization</h1>
          <p className="page-sub">
            Manage organization structure, teams, RBAC, workspaces, projects, and compliance.
          </p>
        </div>

        {/* Status Bar */}
        <div className="status-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success-base)' }} />
            organization active
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

      {/* Tabs Navigation - Simple implementation */}
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
        aria-label="Organization tabs"
      >
        {ORG_TABS.map((tab) => (
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