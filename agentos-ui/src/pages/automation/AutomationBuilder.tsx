import { BuilderCanvas } from '../../components/automation';

export function AutomationBuilder() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Workflow Builder</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Drag and drop blocks to compose automation workflows.</p>
      </div>
      <BuilderCanvas />
    </div>
  );
}
