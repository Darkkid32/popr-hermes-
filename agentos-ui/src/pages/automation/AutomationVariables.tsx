import { VariableEditor } from '../../components/automation';

export function AutomationVariables() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Variables</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Environment-specific variables for workflow configuration.</p>
      </div>
      <VariableEditor />
    </div>
  );
}
