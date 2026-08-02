import { TemplateCards } from '../../components/automation';

export function AutomationTemplates() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Templates</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Pre-built workflow templates for common patterns.</p>
      </div>
      <TemplateCards />
    </div>
  );
}
