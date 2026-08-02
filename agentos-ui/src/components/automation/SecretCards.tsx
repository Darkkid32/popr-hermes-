import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT = { ok: 'success' as const, expiring: 'warning' as const, overdue: 'error' as const };
const ENV_VARIANT: Record<string, 'error' | 'warning' | 'info' | 'neutral'> = { production: 'error', staging: 'warning', development: 'info', all: 'neutral' };

export function SecretCards() {
  const secrets = useAutomationStore((s) => s.secrets);
  const rotateSecret = useAutomationStore((s) => s.rotateSecret);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {secrets.map(sec => (
        <Card key={sec.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] font-mono truncate">{sec.name}</h4>
              <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono">{sec.reference}</p>
            </div>
            <Badge size="xs" variant={STATUS_VARIANT[sec.status]} dot>{sec.status}</Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge size="xs" variant={ENV_VARIANT[sec.environment]}>{sec.environment}</Badge>
            <Badge size="xs" variant="neutral">{sec.owner}</Badge>
          </div>
          <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-surface-border)]">
            <span>Rotate every <span className="font-mono">{sec.rotationDays}d</span> · last {sec.lastRotated}</span>
            <Button variant="ghost" size="xs" onClick={() => rotateSecret(sec.id)}>Rotate now</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
