import { KPICard } from './KPICard';
import { Heatmap } from './Heatmap';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function AnalyticsPanels() {
  const analytics = useObservabilityStore((s) => s.analytics);

  const heatmapData = [
    { x: 'Mon', y: 'Latency', value: 95 }, { x: 'Tue', y: 'Latency', value: 98 }, { x: 'Wed', y: 'Latency', value: 92 },
    { x: 'Thu', y: 'Latency', value: 96 }, { x: 'Fri', y: 'Latency', value: 102 }, { x: 'Sat', y: 'Latency', value: 88 },
    { x: 'Sun', y: 'Latency', value: 85 },
    { x: 'Mon', y: 'Errors', value: 0.3 }, { x: 'Tue', y: 'Errors', value: 0.4 }, { x: 'Wed', y: 'Errors', value: 0.2 },
    { x: 'Thu', y: 'Errors', value: 0.5 }, { x: 'Fri', y: 'Errors', value: 0.6 }, { x: 'Sat', y: 'Errors', value: 0.3 },
    { x: 'Sun', y: 'Errors', value: 0.2 },
    { x: 'Mon', y: 'Throughput', value: 1200 }, { x: 'Tue', y: 'Throughput', value: 1180 }, { x: 'Wed', y: 'Throughput', value: 1250 },
    { x: 'Thu', y: 'Throughput', value: 1220 }, { x: 'Fri', y: 'Throughput', value: 1300 }, { x: 'Sat', y: 'Throughput', value: 1100 },
    { x: 'Sun', y: 'Throughput', value: 1050 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.map(a => (
          <KPICard
            key={a.id}
            label={a.label}
            value={a.value.toLocaleString()}
            delta={a.delta}
            deltaTone={a.deltaTone}
            accent={a.deltaTone === 'up' ? 'var(--color-status-success)' : a.deltaTone === 'down' ? 'var(--color-status-error)' : 'var(--color-brand-500)'}
          />
        ))}
      </div>

      <Heatmap
        title="Weekly Metric Heatmap"
        data={heatmapData}
        xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        yLabels={['Latency', 'Errors', 'Throughput']}
        colorScale="var(--color-brand-500)"
      />
    </div>
  );
}
