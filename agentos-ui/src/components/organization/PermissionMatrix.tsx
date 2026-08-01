import { Fragment } from 'react';
import { Card } from '../ui/Card';
import { useOrganizationStore } from '../../stores/organizationStore';
import { PERMISSION_GROUPS } from '../../stores/organizationStore';

export function PermissionMatrix() {
  const roles = useOrganizationStore((s) => s.roles);

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
                Resource / Permission
              </th>
              {roles.map((role) => (
                <th key={role.id} className="px-3 py-3 text-center text-[var(--text-xs)] font-semibold text-[var(--color-text-secondary)]">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_GROUPS.map((group) => (
              <Fragment key={group.resource}>
                <tr key={group.resource} className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-tertiary)]/50">
                  <td className="px-4 py-2 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                    {group.resource}
                  </td>
                  <td colSpan={roles.length} />
                </tr>
                {group.permissions.map((perm) => (
                  <tr key={perm.key} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)]">
                    <td className="px-4 py-2.5 text-[var(--text-sm)] text-[var(--color-text-primary)]">{perm.label}</td>
                    {roles.map((role) => {
                      const granted = role.permissions.includes(perm.key);
                      return (
                        <td key={role.id} className="px-3 py-2.5 text-center">
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-[var(--radius-sm)]"
                            style={
                              granted
                                ? { background: 'color-mix(in oklab, var(--color-status-success) 15%, transparent)' }
                                : { background: 'var(--color-surface-tertiary)' }
                            }
                            aria-label={granted ? 'Granted' : 'Not granted'}
                          >
                            {granted ? (
                              <svg className="h-3 w-3 text-[var(--color-status-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg className="h-2.5 w-2.5 text-[var(--color-text-tertiary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                                <line x1="5" y1="5" x2="19" y2="19" />
                              </svg>
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
