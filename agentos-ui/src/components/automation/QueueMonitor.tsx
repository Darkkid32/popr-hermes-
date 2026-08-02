import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAutomationStore } from '../../stores/automationStore';

const STATUS_VARIANT = { healthy: 'success' as const, degraded: 'warning' as const, 'backed-up': 'error' as const, empty: 'neutral' as const };

export function QueueMonitor() {
  const queues = useAutomationStore((s) => s.queues);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {queues.map(q => (
        <Card key={q.id} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{q.name}</h4>
            <Badge size="xs" variant={STATUS_VARIANT[q.status]} dot>{q.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[var(--text-xs)]">
            <div><span className="text-[var(--color-text-tertiary)]">Depth</span><div className="font-mono text-[var(--color-text-primary)]">{q.depth}</div></div>
            <div><span className="text-[var(--color-text-tertiary)]">Throughput</span><div className="font-mono text-[var(--color-text-primary)]">{q.throughput}/s</div></div>
            <div><span className="text-[var(--color-text-tertiary)]">Lag</span><div className="font-mono text-[var(--color-text-primary)]">{q.lag}ms</div></div>
            <div><span className="text-[var(--color-text-tertiary)]">Consumers</span><div className="font-mono text-[var(--color-text-primary)]">{q.consumers}</div></div>
            <div><span className="text-[var(--color-text-tertiary)]">Processed (24h)</span><div className="font-mono text-[var(--color-text-primary)]">{q.processed24h}</div></div>
            <div><span className="text-[var(--color-text-tertiary)]">Failed (24h)</span><div className="font-mono text-[var(--color-text-primary)]">{q.failed24h}</div></div>
          </div>
        </Card>
      ))}
    </div>
  );
}
