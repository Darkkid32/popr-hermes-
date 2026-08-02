import { Card } from '../../components/ui/Card';
import { TraceViewer } from '../../components/observability';
import { useObservabilityStore } from '../../stores/observabilityStore';

export function ObservabilityTraces() {
  const traces = useObservabilityStore((s) => s.traces);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Traces</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Distributed tracing across services.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {traces.map(trace => (
          <Card key={trace.id} className="p-4 hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[var(--text-sm)] font-semibold text-[var(--color-text-primary)]">{trace.operation}</h4>
              <span className="text-[var(--text-xs)] font-mono text-[var(--color-text-tertiary)]">{trace.duration}ms</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
              <span>{trace.service}</span>
              <span>{trace.status}</span>
              <span>{trace.timestamp}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <TraceViewer />
      </div>
    </div>
  );
}
