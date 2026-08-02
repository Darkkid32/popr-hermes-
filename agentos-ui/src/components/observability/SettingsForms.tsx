import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function ObservabilitySettingsForm() {
  const settings = useObservabilityStore((s) => s.settings);
  const updateSettings = useObservabilityStore((s) => s.updateSettings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Data Retention</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
          Configure how long observability data is retained.
        </p>
        <div className="grid gap-4 mt-5 sm:grid-cols-2">
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="retention-days">
              Retention (days)
            </label>
            <input
              id="retention-days"
              type="number"
              min={1}
              max={365}
              value={settings.retentionDays}
              onChange={e => updateSettings({ retentionDays: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
            />
          </div>
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="sampling-rate">
              Sampling Rate (%)
            </label>
            <input
              id="sampling-rate"
              type="number"
              min={1}
              max={100}
              value={settings.samplingRate}
              onChange={e => updateSettings({ samplingRate: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Collection</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
          Enable or disable observability data collection.
        </p>
        <div className="space-y-4 mt-5">
          <ToggleRow
            label="Metrics Collection"
            description="Collect and store service metrics."
            checked={settings.metricsEnabled}
            onChange={checked => updateSettings({ metricsEnabled: checked })}
          />
          <ToggleRow
            label="Distributed Tracing"
            description="Collect trace data for request flows."
            checked={settings.tracingEnabled}
            onChange={checked => updateSettings({ tracingEnabled: checked })}
          />
          <ToggleRow
            label="Auto-resolve Alerts"
            description="Automatically resolve alerts when conditions clear."
            checked={settings.autoResolveAlerts}
            onChange={checked => updateSettings({ autoResolveAlerts: checked })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Alerts & Dashboard</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
          Notification and display preferences.
        </p>
        <div className="space-y-4 mt-5">
          <ToggleRow
            label="Alert Notifications"
            description="Receive alert notifications via configured channels."
            checked={settings.alertNotifications}
            onChange={checked => updateSettings({ alertNotifications: checked })}
          />
          <div>
            <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="refresh-interval">
              Dashboard Refresh Interval (seconds)
            </label>
            <div className="flex items-center gap-3 max-w-xs">
              <input
                id="refresh-interval"
                type="range"
                min={5}
                max={300}
                step={5}
                value={settings.dashboardRefreshInterval}
                onChange={e => updateSettings({ dashboardRefreshInterval: Number(e.target.value) })}
                className="w-full accent-[var(--color-brand-500)]"
              />
              <span className="text-[var(--text-sm)] font-mono text-[var(--color-text-primary)] w-14 text-right">
                {settings.dashboardRefreshInterval}s
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Logging</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">
          Default log level for all services.
        </p>
        <div className="mt-5">
          <label className="block text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] mb-2" htmlFor="log-level">
            Default Log Level
          </label>
          <select
            id="log-level"
            value={settings.logLevel}
            onChange={e => updateSettings({ logLevel: e.target.value as any })}
            className="w-full max-w-xs px-3 py-2 bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-md)] text-[var(--text-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="fatal">Fatal</option>
          </select>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save}>{saved ? 'Saved ✓' : 'Save settings'}</Button>
      </div>
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
