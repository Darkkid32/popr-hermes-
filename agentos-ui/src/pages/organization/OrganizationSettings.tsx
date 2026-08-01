import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { OrgProfileForm, SecurityForm, NotificationsForm } from '../../components/organization';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrganizationSettings() {
  const settings = useOrganizationStore((s) => s.settings);
  const resetOrg = useOrganizationStore((s) => s.resetOrg);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Settings</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Organization profile, security policies, and notification preferences.
        </p>
      </div>

      <OrgProfileForm />
      <SecurityForm />
      <NotificationsForm />

      <Card className="p-6 border-[var(--color-status-error)]/30">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Danger zone</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
          Resetting restores all organization data to the default demo state. This cannot be undone.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Button variant="destructive" onClick={resetOrg}>Reset demo data</Button>
          <Badge variant="error" size="sm">irreversible</Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Current configuration</h4>
        <dl className="grid gap-3 sm:grid-cols-2 mt-4">
          {(
            [
              ['Organization', settings.orgName],
              ['Plan', settings.plan],
              ['Region', settings.region],
              ['Timezone', settings.timezone],
              ['Default role', settings.defaultRoleId],
              ['Session timeout', settings.sessionTimeout + ' minutes'],
              ['MFA', settings.mfaEnabled ? 'Enabled' : 'Disabled'],
              ['SSO', settings.ssoEnabled ? 'Enabled' : 'Disabled'],
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
