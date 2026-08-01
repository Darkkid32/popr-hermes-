import { Card } from '../../components/ui/Card';
import { ApiKeyTable } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityApiKeys() {
  const apiKeys = useSecurityStore((s) => s.apiKeys);

  const active = apiKeys.filter((k) => k.status === 'active').length;
  const expiring = apiKeys.filter((k) => k.status === 'expiring').length;
  const revoked = apiKeys.filter((k) => k.status === 'revoked').length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">API keys</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Scoped credentials for agents, pipelines, and integrations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Active</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-success)] mt-1">{active}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Expiring soon</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{expiring}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Revoked</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-tertiary)] mt-1">{revoked}</p>
        </Card>
      </div>

      <ApiKeyTable />
    </div>
  );
}
