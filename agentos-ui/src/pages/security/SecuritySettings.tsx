import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SecuritySettingsForm } from '../../components/security';
import { useSecurityStore } from '../../stores/securityStore';

export function SecuritySettings() {
  const settings = useSecurityStore((s) => s.settings);
  const resetSecurity = useSecurityStore((s) => s.resetSecurity);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Security settings</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Authentication, session, threat-response, and audit preferences.
        </p>
      </div>

      <SecuritySettingsForm />

      <Card className="p-6 border-[var(--color-status-error)]/30">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Danger zone</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
          Resetting restores all security data to the default demo state. This cannot be undone.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Button variant="destructive" onClick={resetSecurity}>Reset demo data</Button>
          <Badge variant="error" size="sm">irreversible</Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Current configuration</h4>
        <dl className="grid gap-3 sm:grid-cols-2 mt-4">
          {(
            [
              ['MFA required', settings.mfaRequired ? 'Yes' : 'No'],
              ['Password policy', settings.passwordPolicy],
              ['Session timeout', settings.sessionTimeout + ' minutes'],
              ['IP allowlist', settings.ipAllowlistEnabled ? 'Enabled' : 'Disabled'],
              ['Alert email', settings.alertEmail],
              ['Auto-block threats', settings.autoBlockThreats ? 'Enabled' : 'Disabled'],
              ['Audit retention', settings.auditRetentionDays + ' days'],
            ] as const
          ).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-[var(--color-surface-border)] last:border-b-0">
              <dt className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{key}</dt>
              <dd className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
