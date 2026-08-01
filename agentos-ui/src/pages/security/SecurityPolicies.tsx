import { Card } from '../../components/ui/Card';
import { PolicyBuilder } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityPolicies() {
  const policies = useSecurityStore((s) => s.policies);

  const enforced = policies.filter((p) => p.status === 'enforced').length;
  const recommended = policies.filter((p) => p.status === 'recommended').length;
  const disabled = policies.filter((p) => p.status === 'disabled').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Security policies</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Enforce controls across authentication, sessions, keys, and secrets.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Enforced</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{enforced}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Recommended</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{recommended}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Disabled</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-tertiary)] mt-1">{disabled}</p>
        </Card>
      </div>

      <PolicyBuilder />
    </div>
  );
}
