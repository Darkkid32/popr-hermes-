import { describe, it, expect, beforeEach } from 'vitest';
import { useOrganizationStore } from './organizationStore';

describe('organizationStore', () => {
  beforeEach(() => {
    useOrganizationStore.getState().resetOrg();
  });

  it('loads mock organization data', () => {
    const s = useOrganizationStore.getState();
    expect(s.members.length).toBeGreaterThan(0);
    expect(s.teams.length).toBeGreaterThan(0);
    expect(s.roles.length).toBeGreaterThan(0);
    expect(s.workspaces.length).toBeGreaterThan(0);
    expect(s.projects.length).toBeGreaterThan(0);
    expect(s.environments.length).toBeGreaterThan(0);
    expect(s.licenses.length).toBeGreaterThan(0);
    expect(s.quotas.length).toBeGreaterThan(0);
    expect(s.activity.length).toBeGreaterThan(0);
  });

  it('invites a member with the invited status and logs activity', () => {
    const before = useOrganizationStore.getState().members.length;
    const beforeActivity = useOrganizationStore.getState().activity.length;

    useOrganizationStore.getState().inviteMember({
      name: 'Test User',
      email: 'test@hermes.local',
      roleId: 'r-engineer',
      teamIds: ['t1'],
    });

    const s = useOrganizationStore.getState();
    const invited = s.members.find((m) => m.email === 'test@hermes.local');
    expect(invited).toBeDefined();
    expect(invited?.status).toBe('invited');
    expect(s.members.length).toBe(before + 1);
    expect(s.activity.length).toBe(beforeActivity + 1);
    expect(s.activity[0].type).toBe('member');
  });

  it('removes a member', () => {
    const before = useOrganizationStore.getState().members.length;
    useOrganizationStore.getState().removeMember('m1');
    expect(useOrganizationStore.getState().members.length).toBe(before - 1);
    expect(useOrganizationStore.getState().memberById('m1')).toBeUndefined();
  });

  it('toggles member status between active and suspended', () => {
    useOrganizationStore.getState().toggleMemberStatus('m11');
    expect(useOrganizationStore.getState().memberById('m11')?.status).toBe('active');
    useOrganizationStore.getState().toggleMemberStatus('m11');
    expect(useOrganizationStore.getState().memberById('m11')?.status).toBe('suspended');
  });

  it('updates settings with a partial patch', () => {
    useOrganizationStore.getState().updateSettings({ mfaEnabled: false, sessionTimeout: 45 });
    const s = useOrganizationStore.getState();
    expect(s.settings.mfaEnabled).toBe(false);
    expect(s.settings.sessionTimeout).toBe(45);
    expect(s.settings.orgName).toBe('Hermes Systems Pvt Ltd');
  });

  it('computes team membership counts', () => {
    const s = useOrganizationStore.getState();
    expect(s.teamMemberCount('t1')).toBeGreaterThan(0);
    expect(s.membersByTeam('t1').every((m) => m.teamIds.includes('t1'))).toBe(true);
  });

  it('caps quota usage percentage at 100', () => {
    const s = useOrganizationStore.getState();
    const pct = s.usagePct('q1');
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it('logs activity at the head of the timeline', () => {
    const s = useOrganizationStore.getState();
    s.logActivity({
      type: 'security',
      actor: 'System',
      action: 'flagged',
      target: 'suspicious login',
      outcome: 'warning',
    });
    const head = useOrganizationStore.getState().activity[0];
    expect(head.target).toBe('suspicious login');
    expect(head.outcome).toBe('warning');
  });

  it('resets to default state', () => {
    useOrganizationStore.getState().inviteMember({
      name: 'Temp',
      email: 'temp@hermes.local',
      roleId: 'r-guest',
      teamIds: [],
    });
    useOrganizationStore.getState().resetOrg();
    const s = useOrganizationStore.getState();
    expect(s.members.some((m) => m.email === 'temp@hermes.local')).toBe(false);
    expect(s.settings.orgName).toBe('Hermes Systems Pvt Ltd');
  });
});
