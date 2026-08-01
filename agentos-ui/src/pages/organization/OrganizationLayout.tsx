import { NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

const ORG_TABS = [
  { to: '/org', label: 'Overview', end: true },
  { to: '/org/members', label: 'Members' },
  { to: '/org/teams', label: 'Teams' },
  { to: '/org/roles', label: 'Roles & Permissions' },
  { to: '/org/workspaces', label: 'Workspaces' },
  { to: '/org/projects', label: 'Projects' },
  { to: '/org/environments', label: 'Environments' },
  { to: '/org/licenses', label: 'Licenses' },
  { to: '/org/quotas', label: 'Quotas' },
  { to: '/org/activity', label: 'Activity' },
  { to: '/org/settings', label: 'Settings' },
];

export function OrganizationLayout() {
  return (
    <div className="space-y-6">
      <nav
        className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--color-surface-border)]"
        aria-label="Organization sections"
      >
        {ORG_TABS.map((tab) => (
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
