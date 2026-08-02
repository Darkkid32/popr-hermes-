import { KPICard } from '../../components/observability/KPICard';
import { WorkflowTable, QueueMonitor } from '../../components/automation';
import { ExecutionTimeline } from '../../components/automation/ExecutionTimeline';
import { useAutomationStore } from '../../stores/automationStore';

export function AutomationOverview() {
  const workflows = useAutomationStore((s) => s.workflows);
  const executions = useAutomationStore((s) => s.executions);
  const queues = useAutomationStore((s) => s.queues);
  const triggers = useAutomationStore((s) => s.triggers);
  const active = workflows.filter(w => w.status === 'active').length;
  const running = executions.filter(e => e.status === 'running').length;
  const failed = executions.filter(e => e.status === 'failed').length;
  const totalDepth = queues.reduce((a, q) => a + q.depth, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard label="Workflows" value={active} delta={workflows.length} deltaLabel="total" deltaTone="up" icon="🔄" />
        <KPICard label="Running" value={running} delta={failed} deltaLabel="failed" deltaTone={running > 0 ? 'up' : 'up'} icon="▶️" accent="var(--color-status-warning)" />
        <KPICard label="Triggers" value={triggers.filter(t => t.enabled).length} delta={triggers.length} deltaLabel="total" deltaTone="up" icon="⚡" />
        <KPICard label="Queue Depth" value={totalDepth} delta={queues.filter(q => q.status === 'healthy').length} deltaLabel="healthy queues" deltaTone="up" icon="📦" accent="var(--color-accent-cyan-500)" />
      </div>
      <ExecutionTimeline />
      <QueueMonitor />
      <WorkflowTable />
    </div>
  );
}
