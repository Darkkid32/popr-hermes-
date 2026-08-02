import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAutomationStore } from '../../stores/automationStore';

export function AutomationSettingsForm() {
  const settings = useAutomationStore((s) => s.settings);
  const updateSettings = useAutomationStore((s) => s.updateSettings);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2500); };
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Execution Limits</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Concurrency, timeouts, and retry policies.</p>
        <div className="grid gap-4 mt-5 sm:grid-cols-2">
          <div><label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="max-concurrent">Max concurrent executions</label>
          <input id="max-concurrent" type="number" min={1} max={50} value={settings.maxConcurrentExecutions} onChange={e => updateSettings({ maxConcurrentExecutions: Number(e.target.value) })} className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]" /></div>
          <div><label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="default-timeout">Default timeout (seconds)</label>
          <input id="default-timeout" type="number" min={10} max={3600} value={settings.defaultTimeoutSec} onChange={e => updateSettings({ defaultTimeoutSec: Number(e.target.value) })} className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]" /></div>
          <div><label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="max-retries">Max retries</label>
          <input id="max-retries" type="number" min={0} max={10} value={settings.maxRetries} onChange={e => updateSettings({ maxRetries: Number(e.target.value) })} className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]" /></div>
          <div><label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="retry-backoff">Retry backoff (ms)</label>
          <input id="retry-backoff" type="number" min={100} max={30000} value={settings.retryBackoffMs} onChange={e => updateSettings({ retryBackoffMs: Number(e.target.value) })} className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]" /></div>
        </div>
      </Card>
      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Notifications & Security</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Alerts, audit, and encryption.</p>
        <div className="space-y-4 mt-5">
          <ToggleRow label="Notifications enabled" description="Send notifications for automation events." checked={settings.notificationsEnabled} onChange={v => updateSettings({ notificationsEnabled: v })} />
          <ToggleRow label="Notify on failure" description="Send a notification when an execution fails." checked={settings.notifyOnFailure} onChange={v => updateSettings({ notifyOnFailure: v })} />
          <ToggleRow label="Notify on success" description="Send a notification on successful execution." checked={settings.notifyOnSuccess} onChange={v => updateSettings({ notifyOnSuccess: v })} />
          <ToggleRow label="Audit trail" description="Record all actions for compliance." checked={settings.auditTrailEnabled} onChange={v => updateSettings({ auditTrailEnabled: v })} />
          <ToggleRow label="Variable encryption" description="Encrypt sensitive variables at rest." checked={settings.variableEncryptionEnabled} onChange={v => updateSettings({ variableEncryptionEnabled: v })} />
          <ToggleRow label="Webhook signing" description="HMAC-sign all outbound webhook payloads." checked={settings.webhookSecretEnabled} onChange={v => updateSettings({ webhookSecretEnabled: v })} />
          <div><label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="exec-retention">Execution retention (days)</label>
          <select id="exec-retention" value={settings.executionRetentionDays} onChange={e => updateSettings({ executionRetentionDays: Number(e.target.value) })} className="w-full max-w-xs px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]">
            <option value={30}>30 days</option><option value={60}>60 days</option><option value={90}>90 days</option><option value={180}>180 days</option><option value={365}>365 days</option>
          </select></div>
          <div><label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="sched-tz">Schedule timezone</label>
          <select id="sched-tz" value={settings.scheduleTimezone} onChange={e => updateSettings({ scheduleTimezone: e.target.value })} className="w-full max-w-xs px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]">
            <option value="UTC">UTC</option><option value="Asia/Kolkata">Asia/Kolkata</option><option value="America/New_York">America/New_York</option><option value="Europe/London">Europe/London</option>
          </select></div>
        </div>
      </Card>
      <div><Button onClick={save}>{saved ? 'Saved ✓' : 'Save settings'}</Button></div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{label}</p><p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-0.5">{description}</p></div>
      <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0" style={{ background: checked ? 'var(--color-brand-500)' : 'var(--color-surface-tertiary)' }}>
        <span className="inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform" style={{ transform: checked ? 'translateX(24px)' : 'translateX(4px)' }} />
      </button>
    </div>
  );
}
