// Automation Workspace - Main Entry Point
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, lazy, Suspense } from 'react'

// Lazy-loaded tab components
const AutomationOverview = lazy(() => import('./AutomationOverview').then(m => ({ default: m.AutomationOverview })))
const AutomationWorkflowBuilder = lazy(() => import('./AutomationWorkflowBuilder').then(m => ({ default: m.AutomationWorkflowBuilder })))
const AutomationWorkflowLibrary = lazy(() => import('./AutomationWorkflowLibrary').then(m => ({ default: m.AutomationWorkflowLibrary })))
const AutomationTriggers = lazy(() => import('./AutomationTriggers').then(m => ({ default: m.AutomationTriggers })))
const AutomationActions = lazy(() => import('./AutomationActions').then(m => ({ default: m.AutomationActions })))
const AutomationSchedules = lazy(() => import('./AutomationSchedules').then(m => ({ default: m.AutomationSchedules })))
const AutomationExecutions = lazy(() => import('./AutomationExecutions').then(m => ({ default: m.AutomationExecutions })))
const AutomationJobs = lazy(() => import('./AutomationJobs').then(m => ({ default: m.AutomationJobs })))
const AutomationQueueMonitor = lazy(() => import('./AutomationQueueMonitor').then(m => ({ default: m.AutomationQueueMonitor })))
const AutomationTemplates = lazy(() => import('./AutomationTemplates').then(m => ({ default: m.AutomationTemplates })))
const AutomationVariables = lazy(() => import('./AutomationVariables').then(m => ({ default: m.AutomationVariables })))
const AutomationSecrets = lazy(() => import('./AutomationSecrets').then(m => ({ default: m.AutomationSecrets })))
const AutomationAnalytics = lazy(() => import('./AutomationAnalytics').then(m => ({ default: m.AutomationAnalytics })))
const AutomationSettings = lazy(() => import('./AutomationSettings').then(m => ({ default: m.AutomationSettings })))

const SuspenseFallback = () => (
  <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
    Loading...
  </div>
)

interface AutomationTab {
  id: string
  label: string
  component: React.ComponentType<any>
}

const AUTO_TABS: AutomationTab[] = [
  { id: 'overview', label: 'Overview', component: AutomationOverview },
  { id: 'workflow-builder', label: 'Workflow Builder', component: AutomationWorkflowBuilder },
  { id: 'workflow-library', label: 'Workflow Library', component: AutomationWorkflowLibrary },
  { id: 'triggers', label: 'Triggers', component: AutomationTriggers },
  { id: 'actions', label: 'Actions', component: AutomationActions },
  { id: 'schedules', label: 'Schedules', component: AutomationSchedules },
  { id: 'executions', label: 'Executions', component: AutomationExecutions },
  { id: 'jobs', label: 'Jobs', component: AutomationJobs },
  { id: 'queue', label: 'Queue Monitor', component: AutomationQueueMonitor },
  { id: 'templates', label: 'Templates', component: AutomationTemplates },
  { id: 'variables', label: 'Variables', component: AutomationVariables },
  { id: 'secrets', label: 'Secrets', component: AutomationSecrets },
  { id: 'analytics', label: 'Analytics', component: AutomationAnalytics },
  { id: 'settings', label: 'Settings', component: AutomationSettings },
]

export function Automation() {
  const [activeTab, setActiveTab] = useState('overview')

  const ActiveComponent = AUTO_TABS.find(t => t.id === activeTab)?.component || AutomationOverview

  return (
    <div className="page-body" style={{ padding: 'var(--spacing-6)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="page-header">
          <div className="page-eyebrow">
            <span className="roman">XXIV.</span>
            <span className="sep">·</span>
            <span>Self · Automation</span>
          </div>
          <h1 className="page-title">Automation</h1>
          <p className="page-sub">
            Visual workflow builder, triggers, actions, schedules, and execution monitoring.
          </p>
        </div>

        {/* Status Bar */}
        <div className="status-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success-base)' }} />
            engine running
          </span>
          <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-info-base)/15', color: 'var(--color-info-base)', border: '1px solid var(--color-info-base)/30' }}>
            1,247 workflows
          </span>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            342 active
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
        aria-label="Automation tabs"
      >
        {AUTO_TABS.map((tab) => (
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