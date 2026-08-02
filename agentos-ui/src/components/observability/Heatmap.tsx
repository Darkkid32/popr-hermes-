import { Card } from '../ui/Card';

interface HeatmapProps {
  title: string;
  data: { x: string; y: string; value: number }[];
  xLabels: string[];
  yLabels: string[];
  colorScale?: string;
}

export function Heatmap({ title, data, xLabels, yLabels, colorScale = 'var(--color-brand-500)' }: HeatmapProps) {
  if (data.length === 0) return <Card className="p-5"><p className="text-[var(--color-text-tertiary)]">No data</p></Card>;

  const values = data.map(d => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const getColor = (value: number) => {
    const intensity = (value - min) / range;
    const opacity = 0.3 + intensity * 0.7;
    return `color-mix(in oklab, ${colorScale} ${Math.round(opacity * 100)}%, transparent)`;
  };

  return (
    <Card className="p-5">
      <h4 className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-3">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="img" aria-label={title}>
          <thead>
            <tr>
              <th className="w-24 text-left px-2 py-1 text-[var(--text-xs)] text-[var(--color-text-tertiary)]" />
              {xLabels.map(label => (
                <th key={label} className="px-2 py-1 text-[var(--text-xs)] text-[var(--color-text-tertiary)] text-center">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yLabels.map(yLabel => (
              <tr key={yLabel}>
                <td className="px-2 py-1 text-[var(--text-xs)] text-[var(--color-text-secondary)] font-mono">
                  {yLabel}
                </td>
                {xLabels.map(xLabel => {
                  const point = data.find(d => d.x === xLabel && d.y === yLabel);
                  const value = point?.value ?? 0;
                  return (
                    <td key={xLabel} className="px-2 py-1.5 text-center">
                      <div
                        className="h-full min-h-[28px] flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-xs)] font-medium"
                        style={{ background: getColor(value) }}
                      >
                        {value > 0 ? value.toLocaleString() : '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
