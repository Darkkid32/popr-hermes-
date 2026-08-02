import { TriggerCards } from '../../components/automation';

export function AutomationTriggers() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Triggers</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Schedule, webhook, event, and manual triggers.</p>
      </div>
      <TriggerCards />
    </div>
  );
}
