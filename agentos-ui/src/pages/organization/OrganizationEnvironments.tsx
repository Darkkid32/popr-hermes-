import { Card } from '../../components/ui/Card';
import { EnvironmentCards } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationEnvironments() {
  const environments = useOrganizationStore((s) => s.environments);

  const byType = environments.reduce<Record<string, number>>((acc, env) => {
    acc[env.type] = (acc[env.type] || 0) + 1;
    return acc;
  }, {});
  const healthy = environments.filter((e) => e.status === 'healthy').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Environments</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Deployment targets across projects with live health status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Total</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{environments.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Healthy</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{healthy}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Production</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-error)] mt-1">{byType.production || 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Non-prod</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {environments.length - (byType.production || 0)}
          </p>
        </Card>
      </div>

      <EnvironmentCards />
    </div>
  );
}
