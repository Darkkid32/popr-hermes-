import { Card } from '../../components/ui/Card';
import { UserAccessTable } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityUsers() {
  const users = useSecurityStore((s) => s.users);

  const mfaCoverage = users.length
    ? Math.round((users.filter((u) => u.mfaEnabled).length / users.length) * 100)
    : 0;
  const missingMfa = users.filter((u) => !u.mfaEnabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Users &amp; access</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Identity roster, roles, and multi-factor enrollment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Total users</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{users.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">MFA coverage</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{mfaCoverage}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Missing MFA</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{missingMfa}</p>
        </Card>
      </div>

      <UserAccessTable />
    </div>
  );
}
