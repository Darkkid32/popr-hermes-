import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useSecurityStore } from '../../stores/securityStore';

export function SecuritySettingsForm() {
  const settings = useSecurityStore((s) => s.settings);
  const updateSettings = useSecurityStore((s) => s.updateSettings);
  const [alertEmail, setAlertEmail] = useState(settings.alertEmail);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings({ alertEmail: alertEmail.trim() || settings.alertEmail });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Authentication</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Org-wide authentication requirements.</p>
        <div className="space-y-4 mt-5">
          <ToggleRow
            label="Require MFA for all users"
            description="Every user must enroll a second factor before first sign-in."
            checked={settings.mfaRequired}
            onChange={(checked) => updateSettings({ mfaRequired: checked })}
          />
          <ToggleRow
            label="Strict password policy"
            description="14+ characters, mixed case, digits, symbols, no reuse."
            checked={settings.passwordPolicy === 'strict'}
            onChange={(checked) => updateSettings({ passwordPolicy: checked ? 'strict' : 'standard' })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Network &amp; sessions</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Session lifetimes and network access control.</p>
        <div className="space-y-4 mt-5">
          <ToggleRow
            label="IP allowlist for admin console"
            description="Only approved IP ranges can reach admin surfaces."
            checked={settings.ipAllowlistEnabled}
            onChange={(checked) => updateSettings({ ipAllowlistEnabled: checked })}
          />
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="sec-session-timeout">
              Session timeout (minutes)
            </label>
            <div className="flex items-center gap-3 max-w-xs">
              <input
                id="sec-session-timeout"
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
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Threat response</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Automated handling of detected threats.</p>
        <div className="space-y-4 mt-5">
          <ToggleRow
            label="Auto-block high-severity threats"
            description="Block sources automatically when critical or high threats are detected."
            checked={settings.autoBlockThreats}
            onChange={(checked) => updateSettings({ autoBlockThreats: checked })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Audit &amp; alerts</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Retention and delivery of security events.</p>
        <div className="grid gap-4 mt-5 sm:grid-cols-2">
          <Input
            label="Security alert email"
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            placeholder="security@hermes.local"
            fullWidth
          />
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="sec-audit-retention">
              Audit retention (days)
            </label>
            <select
              id="sec-audit-retention"
              value={settings.auditRetentionDays}
              onChange={(e) => updateSettings({ auditRetentionDays: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
            >
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>365 days</option>
              <option value={730}>730 days</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <Button onClick={save}>{saved ? 'Saved ✓' : 'Save alert settings'}</Button>
        </div>
      </Card>
    </div>
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
