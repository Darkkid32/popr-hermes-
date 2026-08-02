import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAutomationStore } from '../../stores/automationStore';

const TYPE_VARIANT = { schedule: 'info' as const, webhook: 'brand' as const, event: 'success' as const, file: 'neutral' as const, manual: 'warning' as const, http: 'info' as const };

export function TriggerCards() {
  const triggers = useAutomationStore((s) => s.triggers);
  const toggleTrigger = useAutomationStore((s) => s.toggleTrigger);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {triggers.map(trg => (
        <Card key={trg.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">{trg.name}</h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono mt-0.5">{trg.config}</p>
            </div>
            <Badge size="xs" variant={TYPE_VARIANT[trg.type]}>{trg.type}</Badge>
          </div>
          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            <span>Fired: <span className="font-mono">{trg.fireCount}</span></span>
            <span>Last: {trg.lastFired}</span>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-surface-border)]">
            <Badge size="xs" variant={trg.enabled ? 'success' : 'neutral'} dot>{trg.enabled ? 'enabled' : 'disabled'}</Badge>
            <Button variant="ghost" size="xs" onClick={() => toggleTrigger(trg.id)}>{trg.enabled ? 'Disable' : 'Enable'}</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
