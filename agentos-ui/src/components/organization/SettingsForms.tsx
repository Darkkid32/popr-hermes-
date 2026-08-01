import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useOrganizationStore } from '../../stores/organizationStore';

export function OrgProfileForm() {
  const settings = useOrganizationStore((s) => s.settings);
  const updateSettings = useOrganizationStore((s) => s.updateSettings);
  const [orgName, setOrgName] = useState(settings.orgName);
  const [slug, setSlug] = useState(settings.slug);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings({ orgName: orgName.trim() || settings.orgName, slug: slug.trim() || settings.slug });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card className="p-6">
      <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Organization profile</h4>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
        Public identity used across workspaces, invoices, and agent surfaces.
      </p>
      <div className="grid gap-4 mt-5 sm:grid-cols-2">
        <Input label="Organization name" value={orgName} onChange={(e) => setOrgName(e.target.value)} fullWidth />
        <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} fullWidth />
      </div>
      <div className="flex items-center gap-3 mt-5">
        <Button onClick={save}>{saved ? 'Saved ✓' : 'Save changes'}</Button>
        <Badge variant="neutral" size="sm">{settings.plan} plan</Badge>
        <Badge variant="neutral" size="sm">{settings.region}</Badge>
      </div>
    </Card>
  );
}

export function SecurityForm() {
  const settings = useOrganizationStore((s) => s.settings);
  const updateSettings = useOrganizationStore((s) => s.updateSettings);

  return (
    <Card className="p-6">
      <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Security</h4>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
        Authentication and session policies for all members.
      </p>
      <div className="space-y-4 mt-5">
        <ToggleRow
          label="Require multi-factor authentication"
          description="All admins and engineers must enroll an authenticator."
          checked={settings.mfaEnabled}
          onChange={(checked) => updateSettings({ mfaEnabled: checked })}
        />
        <ToggleRow
          label="Single sign-on (SAML/OIDC)"
          description="Connect your identity provider for enterprise access."
          checked={settings.ssoEnabled}
          onChange={(checked) => updateSettings({ ssoEnabled: checked })}
        />
        <ToggleRow
          label="Strict password policy"
          description="Minimum 14 characters, rotated every 90 days."
          checked={settings.passwordPolicy === 'strict'}
          onChange={(checked) => updateSettings({ passwordPolicy: checked ? 'strict' : 'standard' })}
        />
      </div>
      <div className="mt-5">
        <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="session-timeout">
          Session timeout (minutes)
        </label>
        <div className="flex items-center gap-3 max-w-xs">
          <input
            id="session-timeout"
            type="range"
            min={5}
            max={120}
            step={5}
            value={settings.sessionTimeout}
            onChange={(e) => updateSettings({ sessionTimeout: Number(e.target.value) })}
            className="w-full accent-[var(--color-brand-500)]"
          />
          <span className="text-[var(--text-sm)] font-mono text-[var(--color-text-primary)] w-10 text-right">
            {settings.sessionTimeout}m
          </span>
        </div>
      </div>
    </Card>
  );
}

export function NotificationsForm() {
  const settings = useOrganizationStore((s) => s.settings);
  const updateSettings = useOrganizationStore((s) => s.updateSettings);

  return (
    <Card className="p-6">
      <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Notifications</h4>
      <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
        How the organization receives operational and billing alerts.
      </p>
      <div className="space-y-4 mt-5">
        <ToggleRow
          label="Weekly email digest"
          description="Usage, cost, and security summary every Monday."
          checked={settings.emailDigest}
          onChange={(checked) => updateSettings({ emailDigest: checked })}
        />
        <ToggleRow
          label="Slack alerts"
          description="Real-time alerts to #org-ops for incidents and quotas."
          checked={settings.slackAlerts}
          onChange={(checked) => updateSettings({ slackAlerts: checked })}
        />
      </div>
      <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-5">
        Changes apply immediately to all members.
      </p>
    </Card>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
        style={{
          background: checked ? 'var(--color-brand-500)' : 'var(--color-surface-tertiary)',
        }}
      >
        <span
          className="inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform"
          style={{ transform: checked ? 'translateX(24px)' : 'translateX(4px)' }}
        />
      </button>
    </div>
  );
}
