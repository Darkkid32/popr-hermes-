import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useSecurityStore } from '../../stores/securityStore';

export function SessionMonitor() {
  const sessions = useSecurityStore((s) => s.sessions);
  const userById = useSecurityStore((s) => s.userById);
  const revokeSession = useSecurityStore((s) => s.revokeSession);

  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">User</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Device</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Location</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Started</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Last active</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Status</th>
              <th className="px-4 py-3 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const user = userById(session.userId);
              return (
                <tr key={session.id} className="border-b border-[var(--color-surface-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">
                      {user?.name || 'Unknown user'}
                    </p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{session.browser}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{session.device}</td>
                  <td className="px-4 py-3">
                    <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">{session.location}</p>
                    <p className="text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">{session.ip}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{session.startedAt}</td>
                  <td className="px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{session.lastActive}</td>
                  <td className="px-4 py-3">
                    {session.current ? (
                      <Badge size="xs" variant="brand" dot>current</Badge>
                    ) : (
                      <Badge size="xs" variant="neutral">active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {session.current ? (
                        <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">this device</span>
                      ) : (
                        <Button variant="ghost" size="xs" className="text-[var(--color-status-error)]" onClick={() => revokeSession(session.id)}>
                          Revoke
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
