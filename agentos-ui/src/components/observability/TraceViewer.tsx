import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

const STATUS_VARIANT: Record<'ok' | 'error' | 'timeout' | 'cancelled', 'success' | 'error' | 'warning' | 'neutral'> = {
  ok: 'success',
  error: 'error',
  timeout: 'warning',
  cancelled: 'neutral',
};

interface TraceViewerProps {
  traceId?: string;
}

export function TraceViewer({ traceId }: TraceViewerProps) {
  const traces = useObservabilityStore((s) => s.traces);
  const trace = traceId ? traces.find(t => t.id === traceId) : traces[0];

  if (!trace) return <Card className="p-5">No trace selected</Card>;

  const rootSpan = trace.spans.find(s => s.parentId === null);
  const childSpans = trace.spans.filter(s => s.parentId !== null);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)]">
            {trace.operation}
          </h4>
          <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
            Service: <span className="font-mono">{trace.service}</span> · 
            Duration: <span className="font-mono">{trace.duration}ms</span>
          </p>
        </div>
        <Badge size="sm" variant={STATUS_VARIANT[trace.status]}>{trace.status}</Badge>
      </div>

      {rootSpan && (
        <div className="p-4 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)]">
          <div className="flex items-center gap-2 text-[var(--text-sm)]">
            <span className="font-mono text-[var(--color-text-primary)]">{rootSpan.name}</span>
            <Badge size="xs" variant={STATUS_VARIANT[rootSpan.status]}>{rootSpan.status}</Badge>
            <span className="text-[var(--color-text-tertiary)]">{rootSpan.duration}ms</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h5 className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">Spans</h5>
        {childSpans.map(span => (
          <TraceSpanRow key={span.id} span={span} />
        ))}
      </div>
    </Card>
  );
}

function TraceSpanRow({ span }: { span: any }) {
  return (
    <div className="p-3 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)]">
      <div className="flex flex-wrap items-center gap-2 text-[var(--text-sm)]">
        <span className="text-[var(--color-text-tertiary)] w-32">│</span>
        <span className="font-mono text-[var(--color-text-primary)] flex-1">{span.name}</span>
        <Badge size="xs" variant={STATUS_VARIANT[span.status as keyof typeof STATUS_VARIANT]}>{span.status}</Badge>
        <span className="text-[var(--color-text-tertiary)]">{span.duration}ms</span>
        <span className="text-[var(--color-text-tertiary)]">offset {span.startOffset}ms</span>
        <span className="font-mono text-[var(--color-text-secondary)]">{span.service}</span>
      </div>
    </div>
  );
}
