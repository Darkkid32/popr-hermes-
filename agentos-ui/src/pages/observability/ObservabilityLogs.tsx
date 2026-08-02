import { LogViewer } from '../../components/observability';

export function ObservabilityLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Logs</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Live log stream with filtering and search.
        </p>
      </div>
      <LogViewer maxLines={100} />
    </div>
  );
}
