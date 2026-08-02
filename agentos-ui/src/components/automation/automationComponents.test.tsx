// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { useAutomationStore } from '../../stores/automationStore';

describe('automation components (smoke)', () => {
  it('store has expected mock data', () => {
    const s = useAutomationStore.getState();
    expect(s.workflows.length).toBeGreaterThan(0);
    expect(s.triggers.length).toBeGreaterThan(0);
    expect(s.actions.length).toBeGreaterThan(0);
  });

  it('store selectors work', () => {
    const s = useAutomationStore.getState();
    expect(s.activeWorkflows()).toBeGreaterThan(0);
    expect(s.workflowsByStatus('active').length).toBeGreaterThan(0);
  });

  it('workflow actions work', () => {
    const s = useAutomationStore.getState();
    s.setWorkflowStatus('wf1', 'paused');
    expect(useAutomationStore.getState().workflows.find(w => w.id === 'wf1')?.status).toBe('paused');
    useAutomationStore.getState().resetAutomation();
  });
});
