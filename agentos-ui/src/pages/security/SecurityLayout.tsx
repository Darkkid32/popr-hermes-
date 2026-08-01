import { NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

const SECURITY_TABS = [
  { to: '/security', label: 'Overview', end: true },
  { to: '/security/users', label: 'Users & Access' },
  { to: '/security/roles', label: 'Roles & Permissions' },
  { to: '/security/api-keys', label: 'API Keys' },
  { to: '/security/secrets', label: 'Secrets' },
  { to: '/security/certificates', label: 'Certificates' },
  { to: '/security/policies', label: 'Policies' },
  { to: '/security/sessions', label: 'Sessions' },
  { to: '/security/audit', label: 'Audit Log' },
  { to: '/security/threats', label: 'Threat Monitor' },
  { to: '/security/compliance', label: 'Compliance' },
  { to: '/security/settings', label: 'Settings' },
];

export function SecurityLayout() {
  return (
    <div className="space-y-6">
      <nav
        className="flex gap-1 overflow-x-auto pb-1 border-b border-[var(--color-surface-border)]"
        aria-label="Security sections"
      >
        {SECURITY_TABS.map((tab) => (
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
