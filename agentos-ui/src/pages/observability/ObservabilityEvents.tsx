import { EventTimeline } from '../../components/observability';

export function ObservabilityEvents() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Events</h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">
          System and deployment events timeline.
        </p>
      </div>
      <EventTimeline />
    </div>
  );
}
