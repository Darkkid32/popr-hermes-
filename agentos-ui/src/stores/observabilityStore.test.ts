import { describe, it, expect, beforeEach } from 'vitest';
import { useObservabilityStore } from './observabilityStore';

describe('observabilityStore', () => {
  beforeEach(() => {
    useObservabilityStore.getState().resetObservability();
  });

  it('loads mock observability data', () => {
    const s = useObservabilityStore.getState();
    expect(s.metrics.length).toBeGreaterThan(0);
    expect(s.dashboards.length).toBeGreaterThan(0);
    expect(s.logs.length).toBeGreaterThan(0);
    expect(s.traces.length).toBeGreaterThan(0);
    expect(s.events.length).toBeGreaterThan(0);
    expect(s.alerts.length).toBeGreaterThan(0);
    expect(s.incidents.length).toBeGreaterThan(0);
    expect(s.services.length).toBeGreaterThan(0);
    expect(s.infrastructure.length).toBeGreaterThan(0);
    expect(s.health.length).toBeGreaterThan(0);
    expect(s.performance.length).toBeGreaterThan(0);
    expect(s.capacity.length).toBeGreaterThan(0);
    expect(s.analytics.length).toBeGreaterThan(0);
  });

  it('filters metrics by service', () => {
    const s = useObservabilityStore.getState();
    const svcMetrics = s.metricsByService('svc1');
    expect(svcMetrics.length).toBeGreaterThan(0);
    expect(svcMetrics.every(m => m.serviceId === 'svc1')).toBe(true);
  });

  it('returns firing alerts', () => {
    const s = useObservabilityStore.getState();
    const firing = s.firingAlerts();
    expect(firing.length).toBeGreaterThan(0);
    expect(firing.every(a => a.state === 'firing')).toBe(true);
  });

  it('returns open incidents', () => {
    const s = useObservabilityStore.getState();
    const open = s.openIncidents();
    expect(open.length).toBeGreaterThan(0);
    expect(open.every(i => i.status !== 'resolved')).toBe(true);
  });

  it('counts service health statuses', () => {
    const s = useObservabilityStore.getState();
    expect(s.healthyServices()).toBeGreaterThan(0);
    expect(s.degradedServices()).toBeGreaterThan(0);
    expect(s.downServices()).toBeGreaterThanOrEqual(0);
  });

  it('filters logs by level and service', () => {
    const s = useObservabilityStore.getState();
    const errors = s.logsByLevel('error');
    expect(errors.every(l => l.level === 'error')).toBe(true);
    
    const hermesLogs = s.logsByService('hermes-agent');
    expect(hermesLogs.every(l => l.service === 'hermes-agent')).toBe(true);
  });

  it('filters traces by service and status', () => {
    const s = useObservabilityStore.getState();
    const svcTraces = s.tracesByService('hermes-agent');
    expect(svcTraces.every(t => t.service === 'hermes-agent')).toBe(true);
    
    const okTraces = s.tracesByStatus('ok');
    expect(okTraces.every(t => t.status === 'ok')).toBe(true);
  });

  it('acks an alert', () => {
    const s = useObservabilityStore.getState();
    const alert = s.alerts.find(a => !a.acknowledged);
    if (alert) {
      s.ackAlert(alert.id);
      const updated = useObservabilityStore.getState().alerts.find(a => a.id === alert.id);
      expect(updated?.acknowledged).toBe(true);
    }
  });

  it('resolves an alert', () => {
    const s = useObservabilityStore.getState();
    const alert = s.alerts.find(a => a.state === 'firing');
    if (alert) {
      s.resolveAlert(alert.id);
      const updated = useObservabilityStore.getState().alerts.find(a => a.id === alert.id);
      expect(updated?.state).toBe('resolved');
      expect(updated?.resolvedAt).toBe('just now');
    }
  });

  it('silences an alert', () => {
    const s = useObservabilityStore.getState();
    const alert = s.alerts.find(a => a.state !== 'silenced');
    if (alert) {
      s.silenceAlert(alert.id);
      const updated = useObservabilityStore.getState().alerts.find(a => a.id === alert.id);
      expect(updated?.state).toBe('silenced');
    }
  });

  it('adds incident update and updates status', () => {
    const s = useObservabilityStore.getState();
    const incident = s.incidents.find(i => i.status !== 'resolved');
    if (incident) {
      s.addIncidentUpdate(incident.id, { status: 'resolved', message: 'Test resolution', author: 'Test' });
      const updated = useObservabilityStore.getState().incidents.find(i => i.id === incident.id);
      expect(updated?.status).toBe('resolved');
      expect(updated?.updates.length).toBe(incident.updates.length + 1);
    }
  });

  it('resolves an incident directly', () => {
    const s = useObservabilityStore.getState();
    const incident = s.incidents.find(i => i.status !== 'resolved');
    if (incident) {
      s.resolveIncident(incident.id);
      const updated = useObservabilityStore.getState().incidents.find(i => i.id === incident.id);
      expect(updated?.status).toBe('resolved');
    }
  });

  it('updates settings with partial patch', () => {
    useObservabilityStore.getState().updateSettings({ retentionDays: 90, samplingRate: 50 });
    const s = useObservabilityStore.getState();
    expect(s.settings.retentionDays).toBe(90);
    expect(s.settings.samplingRate).toBe(50);
    expect(s.settings.alertNotifications).toBe(true);
  });

  it('logs an event at the head of the timeline', () => {
    const s = useObservabilityStore.getState();
    s.logEvent({
      type: 'deploy',
      title: 'Test deploy',
      detail: 'Test deployment',
      service: 'test-service',
      icon: '🚀',
    });
    const head = useObservabilityStore.getState().events[0];
    expect(head.title).toBe('Test deploy');
    expect(head.service).toBe('test-service');
  });

  it('resets to default state', () => {
    useObservabilityStore.getState().resolveAlert('al1');
    useObservabilityStore.getState().updateSettings({ retentionDays: 7 });
    useObservabilityStore.getState().resetObservability();
    const s = useObservabilityStore.getState();
    expect(s.alerts.find(a => a.id === 'al1')?.state).toBe('firing');
    expect(s.settings.retentionDays).toBe(30);
    expect(s.settings.samplingRate).toBe(10);
  });
});
