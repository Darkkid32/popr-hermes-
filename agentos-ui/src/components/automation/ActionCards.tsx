import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAutomationStore } from '../../stores/automationStore';

export function ActionCards() {
  const actions = useAutomationStore((s) => s.actions);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {actions.map(act => (
        <Card key={act.id} className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-[var(--radius-lg)] flex items-center justify-center text-lg shrink-0" style={{ background: `color-mix(in oklab, ${act.color} 15%, transparent)`, color: act.color }} aria-hidden="true">{act.icon}</div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{act.name}</h4>
            <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] truncate">{act.description}</p>
          </div>
          <Badge size="xs" variant="neutral">{act.usageCount} uses</Badge>
        </Card>
      ))}
    </div>
  );
}
