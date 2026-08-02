import { ActionCards } from '../../components/automation';

export function AutomationActions() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Actions</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Reusable action blocks for building workflows.</p>
      </div>
      <ActionCards />
    </div>
  );
}
