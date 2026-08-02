import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

const STATUS_VARIANT = {
  healthy: 'success' as const,
  warning: 'warning' as const,
  critical: 'error' as const,
  offline: 'neutral' as const,
};

const TYPE_ICON = {
  compute: '🖥️',
  storage: '💾',
  network: '🌐',
  database: '🗄️',
  cache: '⚡',
};

export function InfrastructureCards() {
  const infrastructure = useObservabilityStore((s) => s.infrastructure);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {infrastructure.map(node => (
        <Card key={node.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">{TYPE_ICON[node.type] || '📦'}</span>
              <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
                {node.name}
              </h4>
            </div>
            <Badge size="xs" variant={STATUS_VARIANT[node.status]} dot>{node.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[var(--text-xs)]">
            <div>
              <p className="text-[var(--color-text-tertiary)]">Region</p>
              <p className="font-medium text-[var(--color-text-primary)]">{node.region}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)]">Type</p>
              <p className="font-medium text-[var(--color-text-primary)] capitalize">{node.type}</p>
            </div>
            <div>
              <p className="text-[var(--color-text-tertiary)]">Uptime</p>
              <p className="font-medium text-[var(--color-text-primary)]">{node.uptime}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-2 border-t border-[var(--color-surface-border)]">
            <ResourceBar label="CPU" value={node.cpu} max={100} unit="%" />
            <ResourceBar label="Mem" value={node.memory} max={100} unit="%" />
            <ResourceBar label="Disk" value={node.disk} max={100} unit="%" />
            <ResourceBar label="Net" value={node.network} max={100} unit="%" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ResourceBar({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 90 ? 'var(--color-status-error)' : pct >= 70 ? 'var(--color-status-warning)' : 'var(--color-status-success)';
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[var(--text-xs)]">
        <span className="text-[var(--color-text-tertiary)]">{label}</span>
        <span className="font-mono text-[var(--color-text-primary)]">{value}{unit}</span>
      </div>
      <div className="h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: pct + '%', background: color }}
        />
      </div>
    </div>
  );
}
