import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SecurityOverviewCards, ThreatFeed } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecurityOverview() {
  const users = useSecurityStore((s) => s.users);
  const apiKeys = useSecurityStore((s) => s.apiKeys);
  const sessions = useSecurityStore((s) => s.sessions);
  const threats = useSecurityStore((s) => s.threats);
  const policies = useSecurityStore((s) => s.policies);
  const settings = useSecurityStore((s) => s.settings);
  const certificates = useSecurityStore((s) => s.certificates);
  const secrets = useSecurityStore((s) => s.secrets);
  const audit = useSecurityStore((s) => s.audit);

  const activeKeys = apiKeys.filter((k) => k.status === 'active').length;
  const openThreats = threats.filter((t) => t.status === 'active').length;
  const mfaCoverage = users.length
    ? Math.round((users.filter((u) => u.mfaEnabled).length / users.length) * 100)
    : 0;
  const certsExpiring = certificates.filter((c) => c.status !== 'valid').length;
  const secretsAtRisk = secrets.filter((s) => s.status !== 'ok').length;
  const enforcedPolicies = policies.filter((p) => p.status === 'enforced').length;

  return (
    <div className="space-y-6">
      <SecurityOverviewCards users={users.length} keys={activeKeys} sessions={sessions.length} threats={openThreats} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">MFA coverage</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{mfaCoverage}%</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">{users.filter((u) => !u.mfaEnabled).length} users missing</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Policies enforced</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">{enforcedPolicies}/{policies.length}</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">Auto-block: {settings.autoBlockThreats ? 'on' : 'off'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Certificates at risk</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{certsExpiring}</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">expiring or expired</p>
        </Card>
        <Card className="p-5">
          <p className="text-[var(--text-xs)] uppercase tracking-wide text-[var(--color-text-tertiary)] font-medium">Secrets at risk</p>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-status-warning)] mt-1">{secretsAtRisk}</p>
          <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-1">need rotation</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Recent audit activity</h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">Latest security events</p>
            </div>
            <Badge variant="neutral" size="sm">live</Badge>
          </div>
          <div className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-secondary)]">
                  <th className="px-4 py-2.5 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Time</th>
                  <th className="px-4 py-2.5 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Actor</th>
                  <th className="px-4 py-2.5 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Action</th>
                  <th className="px-4 py-2.5 text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Resource</th>
                </tr>
              </thead>
              <tbody>
                {audit.slice(0, 5).map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--color-surface-border)] last:border-b-0">
                    <td className="px-4 py-2.5 text-[var(--text-xs)] text-[var(--color-text-tertiary)] whitespace-nowrap">{entry.timestamp}</td>
                    <td className="px-4 py-2.5 text-[var(--text-sm)] text-[var(--color-text-primary)]">{entry.actor}</td>
                    <td className="px-4 py-2.5 text-[var(--text-sm)] text-[var(--color-text-secondary)]">{entry.action}</td>
                    <td className="px-4 py-2.5 text-[var(--text-sm)] text-[var(--color-text-secondary)] truncate max-w-[180px]">{entry.resource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Active threats</h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">Unresolved detections</p>
            </div>
            <Badge variant={openThreats > 0 ? 'warning' : 'success'} size="sm" dot>{openThreats}</Badge>
          </div>
          <ThreatFeed />
        </Card>
      </div>
    </div>
  );
}
