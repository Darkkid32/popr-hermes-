import { GaugeCard } from './GaugeCard';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function CapacityCharts() {
  const capacity = useObservabilityStore((s) => s.capacity);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {capacity.map(pool => (
          <GaugeCard
            key={pool.id}
            label={pool.resource}
            value={Math.round((pool.used / pool.allocated) * 100)}
            min={0}
            max={100}
            unit="%"
            thresholds={{ warning: 70, critical: 85 }}
            size={140}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {capacity.map(pool => (
          <div key={pool.id} className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] p-4">
            <div className="flex items-start justify-between mb-3">
              <h5 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{pool.resource}</h5>
              <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{pool.region}</span>
            </div>
            <div className="h-2 bg-[var(--color-surface-tertiary)] rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow={Math.round((pool.used / pool.allocated) * 100)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full" style={{ width: `${Math.round((pool.used / pool.allocated) * 100)}%`, background: pool.trend === 'up' ? 'var(--color-status-warning)' : 'var(--color-status-success)' }} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[var(--text-sm)]">
              <div><span className="text-[var(--color-text-tertiary)]">Used</span><div className="font-mono">{pool.used.toLocaleString()} {pool.unit}</div></div>
              <div><span className="text-[var(--color-text-tertiary)]">Allocated</span><div className="font-mono">{pool.allocated.toLocaleString()} {pool.unit}</div></div>
              <div className="col-span-2"><span className="text-[var(--color-text-tertiary)]">Trend</span><div className="font-mono capitalize">{pool.trend}</div></div>
              <div className="col-span-2"><span className="text-[var(--color-text-tertiary)]">Projected</span><div className="font-mono">{pool.projectedDays} days</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
