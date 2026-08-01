import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/Card';
import { useOrganizationStore } from '../../stores/organizationStore';

export function QuotaCharts() {
  const quotas = useOrganizationStore((s) => s.quotas);
  const usagePct = useOrganizationStore((s) => s.usagePct);
  const total = useOrganizationStore((s) => s.utilization());

  const data = quotas.map((q) => ({
    name: q.label,
    used: q.used,
    limit: q.limit,
    pct: usagePct(q.id),
    fill: q.color,
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="p-5 xl:col-span-2">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-4">
          Resource usage vs limit
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} width={44} />
              <Tooltip
                cursor={{ fill: 'var(--color-surface-hover)' }}
                contentStyle={{
                  background: 'var(--color-surface-primary)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: 'var(--color-text-primary)',
                }}
              />
              <Bar dataKey="used" name="Used" radius={[4, 4, 0, 0]}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.fill} />
                ))}
              </Bar>
              <Bar dataKey="limit" name="Limit" radius={[4, 4, 0, 0]} fill="var(--color-surface-tertiary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="text-[var(--text-base)] font-semibold text-[var(--color-text-primary)] mb-4">
          Overall utilization
        </h4>
        <div className="flex flex-col items-center">
          <div
            className="relative h-36 w-36 rounded-full flex items-center justify-center"
            style={{
              background: 'conic-gradient(var(--color-brand-500) ' + total * 3.6 + 'deg, var(--color-surface-tertiary) 0deg)',
            }}
            role="img"
            aria-label={`${total}% overall utilization`}
          >
            <div className="h-28 w-28 rounded-full bg-[var(--color-surface-primary)] flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-[var(--color-text-primary)]">{total}%</span>
              <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">utilized</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full mt-5">
            {quotas.slice(0, 4).map((q) => (
              <div key={q.id} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: q.color }} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)] truncate">{q.label}</p>
                  <p className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] font-mono">
                    {q.used} / {q.limit} {q.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
