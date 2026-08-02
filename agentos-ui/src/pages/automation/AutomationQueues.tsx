import { QueueMonitor } from '../../components/automation';

export function AutomationQueues() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Queues</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Queue depth, throughput, and consumer monitoring.</p>
      </div>
      <QueueMonitor />
    </div>
  );
}
