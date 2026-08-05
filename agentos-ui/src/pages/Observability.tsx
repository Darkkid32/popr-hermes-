// Observability Workspace - Main Entry Point
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, lazy, Suspense } from 'react'

// Lazy-loaded tab components
const ObservabilityOverview = lazy(() => import('./ObservabilityOverview').then(m => ({ default: m.ObservabilityOverview })))
const ObservabilityMetrics = lazy(() => import('./ObservabilityMetrics').then(m => ({ default: m.ObservabilityMetrics })))
const ObservabilityDashboards = lazy(() => import('./ObservabilityDashboards').then(m => ({ default: m.ObservabilityDashboards })))
const ObservabilityLogs = lazy(() => import('./ObservabilityLogs').then(m => ({ default: m.ObservabilityLogs })))
const ObservabilityTraces = lazy(() => import('./ObservabilityTraces').then(m => ({ default: m.ObservabilityTraces })))
const ObservabilityAlerts = lazy(() => import('./ObservabilityAlerts').then(m => ({ default: m.ObservabilityAlerts })))
const ObservabilityIncidents = lazy(() => import('./ObservabilityIncidents').then(m => ({ default: m.ObservabilityIncidents })))
const ObservabilityServices = lazy(() => import('./ObservabilityServices').then(m => ({ default: m.ObservabilityServices })))
const ObservabilityInfrastructure = lazy(() => import('./ObservabilityInfrastructure').then(m => ({ default: m.ObservabilityInfrastructure })))
const ObservabilityHealth = lazy(() => import('./ObservabilityHealth').then(m => ({ default: m.ObservabilityHealth })))
const ObservabilityPerformance = lazy(() => import('./ObservabilityPerformance').then(m => ({ default: m.ObservabilityPerformance })))
const ObservabilityCapacity = lazy(() => import('./ObservabilityCapacity').then(m => ({ default: m.ObservabilityCapacity })))
const ObservabilityAnalytics = lazy(() => import('./ObservabilityAnalytics').then(m => ({ default: m.ObservabilityAnalytics })))
const ObservabilitySettings = lazy(() => import('./ObservabilitySettings').then(m => ({ default: m.ObservabilitySettings })))

const SuspenseFallback = () => (
  <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
    Loading...
  </div>
)

interface ObservabilityTab {
  id: string
  label: string
  component: React.ComponentType<any>
}

const OBS_TABS: ObservabilityTab[] = [
  { id: 'overview', label: 'Overview', component: ObservabilityOverview },
  { id: 'metrics', label: 'Metrics', component: ObservabilityMetrics },
  { id: 'dashboards', label: 'Dashboards', component: ObservabilityDashboards },
  { id: 'logs', label: 'Logs', component: ObservabilityLogs },
  { id: 'traces', label: 'Traces', component: ObservabilityTraces },
  { id: 'alerts', label: 'Alerts', component: ObservabilityAlerts },
  { id: 'incidents', label: 'Incidents', component: ObservabilityIncidents },
  { id: 'services', label: 'Services', component: ObservabilityServices },
  { id: 'infrastructure', label: 'Infrastructure', component: ObservabilityInfrastructure },
  { id: 'health', label: 'Health', component: ObservabilityHealth },
  { id: 'performance', label: 'Performance', component: ObservabilityPerformance },
  { id: 'capacity', label: 'Capacity', component: ObservabilityCapacity },
  { id: 'analytics', label: 'Analytics', component: ObservabilityAnalytics },
  { id: 'settings', label: 'Settings', component: ObservabilitySettings },
]

export function Observability() {
  const [activeTab, setActiveTab] = useState('overview')

  const ActiveComponent = OBS_TABS.find(t => t.id === activeTab)?.component || ObservabilityOverview

  return (
    <div className="page-body" style={{ padding: 'var(--spacing-6)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="page-header">
          <div className="page-eyebrow">
            <span className="roman">XXIII.</span>
            <span className="sep">·</span>
            <span>Self · Observability</span>
          </div>
          <h1 className="page-title">Observability</h1>
          <p className="page-sub">
            Metrics, logs, traces, dashboards, alerts, and service topology.
          </p>
        </div>

        {/* Status Bar */}
        <div className="status-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success-base)' }} />
            telemetry active
          </span>
          <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-info-base)/15', color: 'var(--color-info-base)', border: '1px solid var(--color-info-base)/30' }}>
            12.4k metrics/s
          </span>
          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: 'var(--radius-chip)', fontSize: 'var(--text-body-xs)', fontWeight: 500, backgroundColor: 'var(--color-success-base)/15', color: 'var(--color-success-base)', border: '1px solid var(--color-success-base)/30' }}>
            847 services
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
        aria-label="Observability tabs"
      >
        {OBS_TABS.map((tab) => (
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