import { Card } from '../../components/ui/Card';
import { SecretCards } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecuritySecrets() {
  const secrets = useSecurityStore((s) => s.secrets);

  const ok = secrets.filter((x) => x.status === 'ok').length;
  const expiring = secrets.filter((x) => x.status === 'expiring').length;
  const overdue = secrets.filter((x) => x.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Secrets</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Managed references with rotation cadence. Values are never displayed.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Healthy</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{ok}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Expiring soon</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{expiring}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Overdue</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{overdue}</p>
        </Card>
      </div>

      <SecretCards />
    </div>
  );
}
