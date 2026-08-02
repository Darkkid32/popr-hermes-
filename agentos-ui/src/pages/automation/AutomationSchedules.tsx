import { ScheduleTable } from '../../components/automation';

export function AutomationSchedules() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Schedules</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Cron and interval-based workflow schedules.</p>
      </div>
      <ScheduleTable />
    </div>
  );
}
