import { IncidentTimeline } from '../../components/observability';

export function ObservabilityIncidents() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Incidents</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          Active and resolved incidents with timeline.
        </p>
      </div>
      <IncidentTimeline />
    </div>
  );
}
