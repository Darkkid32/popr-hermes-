import { NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

const AUT_TABS = [
  { to: '/automation', label: 'Overview', end: true },
  { to: '/automation/workflows', label: 'Workflows' },
  { to: '/automation/builder', label: 'Builder' },
  { to: '/automation/triggers', label: 'Triggers' },
  { to: '/automation/actions', label: 'Actions' },
  { to: '/automation/executions', label: 'Executions' },
  { to: '/automation/schedules', label: 'Schedules' },
  { to: '/automation/jobs', label: 'Jobs' },
  { to: '/automation/queues', label: 'Queues' },
  { to: '/automation/templates', label: 'Templates' },
  { to: '/automation/variables', label: 'Variables' },
  { to: '/automation/secrets', label: 'Secrets' },
  { to: '/automation/history', label: 'History' },
  { to: '/automation/analytics', label: 'Analytics' },
  { to: '/automation/settings', label: 'Settings' },
];

export function AutomationLayout() {
  return (
    <div className="space-y-6">
      <nav className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--color-surface-border)]" aria-label="Automation sections">
        {AUT_TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => clsx('px-3.5 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium whitespace-nowrap transition-colors', isActive ? 'bg-[var(--color-brand-500)/15] text-[var(--color-brand-500)]' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]')}>{tab.label}</NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
