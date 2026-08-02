import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

interface MetricCardProps {
  metricId: string;
  showSparkline?: boolean;
}

export function MetricCard({ metricId, showSparkline = true }: MetricCardProps) {
  const metric = useObservabilityStore((s) => s.metricById(metricId));
  
  if (!metric) return null;

  const statusColor = {
    healthy: 'success' as const,
    warning: 'warning' as const,
    critical: 'error' as const,
  }[metric.status];

  const trend = metric.current >= metric.avg ? 'up' : 'down';

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] truncate">
            {metric.name}
          </h4>
          <p className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mt-1">
            {metric.current.toLocaleString()}{' '}
            <span className="text-[var(--text-sm)] font-normal text-[var(--color-text-tertiary)]">
              {metric.unit}
            </span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-[var(--text-xs)]">
            <Badge size="xs" variant={statusColor} dot>{metric.status}</Badge>
            <span className="text-[var(--color-text-tertiary)]">
              avg {metric.avg.toLocaleString()} · {trend === 'up' ? '↑' : '↓'} {Math.abs(metric.current - metric.avg).toLocaleString()}
            </span>
          </div>
        </div>
        {showSparkline && metric.sparkline.length > 0 && (
          <Sparkline points={metric.sparkline} color={statusColor} width={100} height={40} />
        )}
      </div>
    </Card>
  );
}

function Sparkline({ points, color, width, height }: { points: { timestamp: string; value: number }[]; color: string; width: number; height: number }) {
  const values = points.map(p => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const path = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const variantColors = {
    success: 'var(--color-status-success)',
    warning: 'var(--color-status-warning)',
    error: 'var(--color-status-error)',
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke={variantColors[color as keyof typeof variantColors] || 'var(--color-brand-500)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
