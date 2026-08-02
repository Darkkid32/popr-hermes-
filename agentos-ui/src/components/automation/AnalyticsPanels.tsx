import { KPICard } from '../observability/KPICard';
import { useAutomationStore } from '../../stores/automationStore';

export function AnalyticsPanels() {
  const analytics = useAutomationStore((s) => s.analytics);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {analytics.map(a => (
        <KPICard key={a.id} label={a.label} value={a.value.toLocaleString()} delta={a.delta} deltaTone={a.deltaTone} accent={a.deltaTone === 'up' ? 'var(--color-status-success)' : a.deltaTone === 'down' ? 'var(--color-status-error)' : 'var(--color-brand-500)'} />
      ))}
    </div>
  );
}
