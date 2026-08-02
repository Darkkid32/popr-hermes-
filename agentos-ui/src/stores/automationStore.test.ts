import { describe, it, expect, beforeEach } from 'vitest';
import { useAutomationStore } from './automationStore';

describe('automationStore', () => {
  beforeEach(() => {
    useAutomationStore.getState().resetAutomation();
  });

  it('loads mock automation data', () => {
    const s = useAutomationStore.getState();
    expect(s.workflows.length).toBeGreaterThan(0);
    expect(s.triggers.length).toBeGreaterThan(0);
    expect(s.actions.length).toBeGreaterThan(0);
    expect(s.executions.length).toBeGreaterThan(0);
    expect(s.schedules.length).toBeGreaterThan(0);
    expect(s.jobs.length).toBeGreaterThan(0);
    expect(s.queues.length).toBeGreaterThan(0);
    expect(s.templates.length).toBeGreaterThan(0);
    expect(s.variables.length).toBeGreaterThan(0);
    expect(s.secrets.length).toBeGreaterThan(0);
    expect(s.analytics.length).toBeGreaterThan(0);
  });

  it('filters workflows by status', () => {
    const s = useAutomationStore.getState();
    const active = s.workflowsByStatus('active');
    expect(active.length).toBeGreaterThan(0);
    expect(active.every(w => w.status === 'active')).toBe(true);
  });

  it('filters workflows by category', () => {
    const s = useAutomationStore.getState();
    const deploy = s.workflowsByCategory('deploy');
    expect(deploy.every(w => w.category === 'deploy')).toBe(true);
  });

  it('sets workflow status', () => {
    useAutomationStore.getState().setWorkflowStatus('wf1', 'paused');
    expect(useAutomationStore.getState().workflowById('wf1')?.status).toBe('paused');
    useAutomationStore.getState().setWorkflowStatus('wf1', 'active');
    expect(useAutomationStore.getState().workflowById('wf1')?.status).toBe('active');
  });

  it('toggles trigger enabled state', () => {
    const before = useAutomationStore.getState().triggers.find(t => t.id === 'trg1')?.enabled;
    useAutomationStore.getState().toggleTrigger('trg1');
    expect(useAutomationStore.getState().triggers.find(t => t.id === 'trg1')?.enabled).toBe(!before);
    useAutomationStore.getState().toggleTrigger('trg1');
    expect(useAutomationStore.getState().triggers.find(t => t.id === 'trg1')?.enabled).toBe(before);
  });

  it('toggles schedule', () => {
    const sch = useAutomationStore.getState().schedules.find(s => s.id === 'sch1');
    if (sch) {
      useAutomationStore.getState().toggleSchedule('sch1');
      const updated = useAutomationStore.getState().schedules.find(s => s.id === 'sch1');
      expect(updated?.enabled).toBe(!sch.enabled);
    }
  });

  it('rotates a secret', () => {
    useAutomationStore.getState().rotateSecret('as3');
    const sec = useAutomationStore.getState().secrets.find(s => s.id === 'as3');
    expect(sec?.status).toBe('ok');
    expect(sec?.lastRotated).toBe(new Date().toISOString().slice(0, 10));
  });

  it('cancels an execution', () => {
    useAutomationStore.getState().cancelExecution('ex1');
    const ex = useAutomationStore.getState().executions.find(e => e.id === 'ex1');
    expect(ex?.status).toBe('cancelled');
    expect(ex?.finishedAt).toBe('just now');
  });

  it('retries a failed job', () => {
    useAutomationStore.getState().retryJob('job4');
    const job = useAutomationStore.getState().jobs.find(j => j.id === 'job4');
    expect(job?.status).toBe('queued');
    expect(job?.attempts).toBe(0);
  });

  it('cancels a job', () => {
    useAutomationStore.getState().cancelJob('job1');
    const job = useAutomationStore.getState().jobs.find(j => j.id === 'job1');
    expect(job?.status).toBe('cancelled');
  });

  it('updates settings with partial patch', () => {
    useAutomationStore.getState().updateSettings({ maxConcurrentExecutions: 20, defaultTimeoutSec: 600 });
    const s = useAutomationStore.getState();
    expect(s.settings.maxConcurrentExecutions).toBe(20);
    expect(s.settings.defaultTimeoutSec).toBe(600);
    expect(s.settings.maxRetries).toBe(3);
  });

  it('resets to default state', () => {
    useAutomationStore.getState().setWorkflowStatus('wf1', 'paused');
    useAutomationStore.getState().rotateSecret('as3');
    useAutomationStore.getState().resetAutomation();
    const s = useAutomationStore.getState();
    expect(s.workflows.find(w => w.id === 'wf1')?.status).toBe('active');
    expect(s.secrets.find(x => x.id === 'as3')?.status).toBe('expiring');
  });
});
