import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAutomationStore } from '../../stores/automationStore';

export function BuilderCanvas() {
  const actions = useAutomationStore((s) => s.actions);
  const triggers = useAutomationStore((s) => s.triggers);
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-3">Available Blocks</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {triggers.slice(0, 3).map(t => (
            <div key={t.id} className="p-3 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)] border border-[var(--color-surface-border)] text-center cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors">
              <span className="text-xl block mb-1">⚡</span>
              <p className="text-[var(--text-xs)] font-medium text-[var(--color-text-primary)]">{t.name}</p>
              <Badge size="xs" variant="info">{t.type}</Badge>
            </div>
          ))}
          {actions.map(a => (
            <div key={a.id} className="p-3 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)] border border-[var(--color-surface-border)] text-center cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors">
              <span className="text-xl block mb-1">{a.icon}</span>
              <p className="text-[var(--text-xs)] font-medium text-[var(--color-text-primary)]">{a.name}</p>
              <Badge size="xs" variant="neutral">{a.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-[var(--color-text-tertiary)] text-[var(--text-sm)]">Drag blocks here to build a workflow</p>
        <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] mt-2">This is a visual placeholder for the workflow builder canvas.</p>
      </Card>
    </div>
  );
}
