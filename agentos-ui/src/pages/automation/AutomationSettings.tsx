import { AutomationSettingsForm } from '../../components/automation';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAutomationStore } from '../../stores/automationStore';

export function AutomationSettingsPage() {
  const settings = useAutomationStore((s) => s.settings);
  const resetAutomation = useAutomationStore((s) => s.resetAutomation);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Automation Settings</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Execution limits, notifications, security, and retention.</p>
      </div>
      <AutomationSettingsForm />
      <Card className="p-6 border-[var(--color-status-error)]/30">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Danger zone</h4>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-0.5">Resetting restores all automation data to the default demo state. This cannot be undone.</p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Button variant="destructive" onClick={resetAutomation}>Reset demo data</Button>
          <Badge variant="error" size="sm">irreversible</Badge>
        </div>
      </Card>
      <Card className="p-6">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">Current configuration</h4>
        <dl className="grid gap-3 sm:grid-cols-2 mt-4">
          {([ ['Max concurrent', settings.maxConcurrentExecutions], ['Timeout', settings.defaultTimeoutSec + 's'], ['Max retries', settings.maxRetries], ['Backoff', settings.retryBackoffMs + 'ms'], ['Retention', settings.executionRetentionDays + 'd'], ['Audit trail', settings.auditTrailEnabled ? 'On' : 'Off'], ['Webhook signing', settings.webhookSecretEnabled ? 'On' : 'Off'], ['Timezone', settings.scheduleTimezone] ] as const).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-[var(--color-surface-border)] last:border-b-0"><dt className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">{k}</dt><dd className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{v}</dd></div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
