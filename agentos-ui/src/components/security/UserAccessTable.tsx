import { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useSecurityStore } from '../../stores/securityStore';
import type { SecurityUser } from '../../stores/securityStore';

const STATUS_VARIANT = {
  active: 'success' as const,
  invited: 'info' as const,
  suspended: 'error' as const,
};

export function UserAccessTable() {
  const users = useSecurityStore((s) => s.users);
  const roleById = useSecurityStore((s) => s.roleById);
  const [query, setQuery] = useState('');

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (roleById(u.roleId)?.name.toLowerCase() || '').includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-72">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users, email, role..."
          className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent"
        />
      </div>

      <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">User</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Role</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Department</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">MFA</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Last login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <UserRow key={user.id} user={user} roleName={roleById(user.roleId)?.name || '—'} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, roleName }: { user: SecurityUser; roleName: string }) {
  return (
    <tr className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar fallback={user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="sm" />
          <div className="min-w-0">
            <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] truncate">{user.name}</p>
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{roleName}</td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{user.department}</td>
      <td className="px-4 py-3">
        <Badge size="xs" variant={user.mfaEnabled ? 'success' : 'neutral'}>
          {user.mfaEnabled ? 'Enabled' : 'Missing'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Badge size="xs" variant={STATUS_VARIANT[user.status]} dot>{user.status}</Badge>
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{user.lastLogin}</td>
    </tr>
  );
}
