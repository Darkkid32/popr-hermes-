import { useState } from 'react';
import { clsx } from 'clsx';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useOrganizationStore } from '../../stores/organizationStore';
import type { OrgMember } from '../../stores/organizationStore';

const STATUS_VARIANT = {
  active: 'success' as const,
  invited: 'info' as const,
  suspended: 'error' as const,
};

export function MemberTable() {
  const members = useOrganizationStore((s) => s.members);
  const roleById = useOrganizationStore((s) => s.roleById);
  const teamById = useOrganizationStore((s) => s.teamById);
  const toggleMemberStatus = useOrganizationStore((s) => s.toggleMemberStatus);
  const removeMember = useOrganizationStore((s) => s.removeMember);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'invited' | 'suspended'>('all');

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (roleById(m.roleId)?.name.toLowerCase() || '').includes(q);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members, email, role..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'active', 'invited', 'suspended'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
                statusFilter === s
                  ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Member</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Role</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Teams</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Last active</th>
                <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <MemberRow
                  key={m.id}
                  member={m}
                  roleName={roleById(m.roleId)?.name || '—'}
                  teamNames={m.teamIds.map((t) => teamById(t)?.name || t)}
                  onToggleStatus={() => toggleMemberStatus(m.id)}
                  onRemove={() => removeMember(m.id)}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
                    No members match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
        Showing {filtered.length} of {members.length} members
      </p>
    </div>
  );
}

interface MemberRowProps {
  member: OrgMember;
  roleName: string;
  teamNames: string[];
  onToggleStatus: () => void;
  onRemove: () => void;
}

function MemberRow({ member, roleName, teamNames, onToggleStatus, onRemove }: MemberRowProps) {
  return (
    <tr className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar fallback={member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="sm" />
          <div className="min-w-0">
            <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] truncate">{member.name}</p>
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] truncate">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">{roleName}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {teamNames.slice(0, 2).map((t) => (
            <Badge key={t} size="xs" variant="neutral">{t}</Badge>
          ))}
          {teamNames.length > 2 && (
            <Badge size="xs" variant="default">+{teamNames.length - 2}</Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge size="xs" variant={STATUS_VARIANT[member.status]} dot>
          {member.status}
        </Badge>
      </td>
      <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{member.lastActive}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="xs" onClick={onToggleStatus}>
            {member.status === 'suspended' ? 'Reactivate' : 'Suspend'}
          </Button>
          <Button variant="ghost" size="xs" onClick={onRemove} className="text-[var(--color-status-error)]">
            Remove
          </Button>
        </div>
      </td>
    </tr>
  );
}
