import { NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

const OBS_TABS = [
  { to: '/observability', label: 'Overview', end: true },
  { to: '/observability/metrics', label: 'Metrics' },
  { to: '/observability/dashboards', label: 'Dashboards' },
  { to: '/observability/logs', label: 'Logs' },
  { to: '/observability/traces', label: 'Traces' },
  { to: '/observability/events', label: 'Events' },
  { to: '/observability/alerts', label: 'Alerts' },
  { to: '/observability/incidents', label: 'Incidents' },
  { to: '/observability/services', label: 'Services' },
  { to: '/observability/infrastructure', label: 'Infrastructure' },
  { to: '/observability/health', label: 'Health' },
  { to: '/observability/performance', label: 'Performance' },
  { to: '/observability/capacity', label: 'Capacity' },
  { to: '/observability/analytics', label: 'Analytics' },
  { to: '/observability/settings', label: 'Settings' },
];

export function ObservabilityLayout() {
  return (
    <div className="space-y-6">
      <nav
        className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--color-surface-border)]"
        aria-label="Observability sections"
      >
        {OBS_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              clsx(
                'px-3.5 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-[var(--color-brand-500)/15] text-[var(--color-brand-500)]'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
