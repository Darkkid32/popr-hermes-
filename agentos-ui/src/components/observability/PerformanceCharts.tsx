import { TimeSeriesChart } from './TimeSeriesChart';
import { GaugeCard } from './GaugeCard';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function PerformanceCharts() {
  const performance = useObservabilityStore((s) => s.performance);
  const services = useObservabilityStore((s) => s.services);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {services.map(svc => {
          const perf = performance.find(p => p.service === svc.id);
          if (!perf) return null;
          return (
            <GaugeCard
              key={svc.id}
              label={svc.name}
              value={perf.latencyP95}
              min={0}
              max={500}
              unit="ms"
              thresholds={{ warning: 200, critical: 400 }}
              size={140}
            />
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {services.map(svc => {
          const perf = performance.find(p => p.service === svc.id);
          if (!perf) return null;
          return (
            <TimeSeriesChart
              key={svc.id}
              title={`${svc.name} - Latency Percentiles`}
              points={[
                { timestamp: '5m', value: perf.latencyP50 },
                { timestamp: '4m', value: (perf.latencyP50 + perf.latencyP95) / 2 },
                { timestamp: '3m', value: perf.latencyP95 },
                { timestamp: '2m', value: (perf.latencyP95 + perf.latencyP99) / 2 },
                { timestamp: '1m', value: perf.latencyP99 },
              ]}
              color="var(--color-brand-500)"
              unit="ms"
            />
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map(svc => {
          const perf = performance.find(p => p.service === svc.id);
          if (!perf) return null;
          return (
            <div key={svc.id} className="bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] rounded-[var(--radius-lg)] p-4">
              <h5 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-2">{svc.name}</h5>
              <div className="space-y-2 text-[var(--text-sm)]">
                <div className="flex justify-between"><span className="text-[var(--color-text-tertiary)]">P50</span><span className="font-mono">{perf.latencyP50}ms</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-tertiary)]">P95</span><span className="font-mono">{perf.latencyP95}ms</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-tertiary)]">P99</span><span className="font-mono">{perf.latencyP99}ms</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-tertiary)]">Throughput</span><span className="font-mono">{perf.throughput}/s</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-tertiary)]">Error Rate</span><span className="font-mono">{perf.errorRate}%</span></div>
                <div className="flex justify-between"><span className="text-[var(--color-text-tertiary)]">Saturation</span><span className="font-mono">{perf.saturation}%</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
