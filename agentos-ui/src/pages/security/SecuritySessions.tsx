import { Card } from '../../components/ui/Card';
import { SessionMonitor } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecuritySessions() {
  const sessions = useSecurityStore((s) => s.sessions);

  const current = sessions.filter((x) => x.current).length;
  const foreign = sessions.filter((x) => x.location === 'Frankfurt, DE').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Active sessions</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Every authenticated device with live activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Total sessions</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{sessions.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">This device</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-brand-500)] mt-1">{current}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Unusual locations</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{foreign}</p>
        </Card>
      </div>

      <SessionMonitor />
    </div>
  );
}
