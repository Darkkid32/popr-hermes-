import { describe, it, expect, beforeEach } from 'vitest';
import { useSecurityStore } from './securityStore';

describe('securityStore', () => {
  beforeEach(() => {
    useSecurityStore.getState().resetSecurity();
  });

  it('loads mock security data', () => {
    const s = useSecurityStore.getState();
    expect(s.users.length).toBeGreaterThan(0);
    expect(s.roles.length).toBeGreaterThan(0);
    expect(s.apiKeys.length).toBeGreaterThan(0);
    expect(s.secrets.length).toBeGreaterThan(0);
    expect(s.certificates.length).toBeGreaterThan(0);
    expect(s.policies.length).toBeGreaterThan(0);
    expect(s.sessions.length).toBeGreaterThan(0);
    expect(s.audit.length).toBeGreaterThan(0);
    expect(s.threats.length).toBeGreaterThan(0);
    expect(s.compliance.length).toBeGreaterThan(0);
  });

  it('revokes an API key and keeps its record', () => {
    useSecurityStore.getState().revokeApiKey('k1');
    const key = useSecurityStore.getState().apiKeys.find((k) => k.id === 'k1');
    expect(key?.status).toBe('revoked');
  });

  it('rotates an API key back to active', () => {
    useSecurityStore.getState().rotateApiKey('k4');
    const key = useSecurityStore.getState().apiKeys.find((k) => k.id === 'k4');
    expect(key?.status).toBe('active');
  });

  it('rotates a secret to healthy with a fresh date', () => {
    useSecurityStore.getState().rotateSecret('sec2');
    const secret = useSecurityStore.getState().secrets.find((x) => x.id === 'sec2');
    expect(secret?.status).toBe('ok');
    expect(secret?.lastRotated).toBe(new Date().toISOString().slice(0, 10));
  });

  it('resolves a threat', () => {
    useSecurityStore.getState().resolveThreat('t1');
    expect(useSecurityStore.getState().threats.find((t) => t.id === 't1')?.status).toBe('resolved');
    expect(useSecurityStore.getState().activeThreats().some((t) => t.id === 't1')).toBe(false);
  });

  it('revokes a session and logs an audit entry', () => {
    const before = useSecurityStore.getState().sessions.length;
    const beforeAudit = useSecurityStore.getState().audit.length;
    useSecurityStore.getState().revokeSession('s3');
    expect(useSecurityStore.getState().sessions.length).toBe(before - 1);
    expect(useSecurityStore.getState().audit.length).toBe(beforeAudit + 1);
    expect(useSecurityStore.getState().audit[0].action).toBe('revoked');
  });

  it('updates policy status', () => {
    useSecurityStore.getState().updatePolicyStatus('pol4', 'enforced');
    expect(useSecurityStore.getState().policies.find((p) => p.id === 'pol4')?.status).toBe('enforced');
  });

  it('updates security settings with a partial patch', () => {
    useSecurityStore.getState().updateSettings({ mfaRequired: false, auditRetentionDays: 180 });
    const s = useSecurityStore.getState();
    expect(s.settings.mfaRequired).toBe(false);
    expect(s.settings.auditRetentionDays).toBe(180);
    expect(s.settings.autoBlockThreats).toBe(true);
  });

  it('filters sessions by user', () => {
    const s = useSecurityStore.getState();
    const forUser = s.sessionsByUser('su1');
    expect(forUser.length).toBeGreaterThan(0);
    expect(forUser.every((x) => x.userId === 'su1')).toBe(true);
  });

  it('logs audit entries at the head of the log', () => {
    const s = useSecurityStore.getState();
    s.logAudit({
      actor: 'System',
      action: 'blocked',
      resource: 'test source',
      ip: '1.2.3.4',
      severity: 'critical',
    });
    const head = useSecurityStore.getState().audit[0];
    expect(head.resource).toBe('test source');
    expect(head.severity).toBe('critical');
  });

  it('resets to default state', () => {
    useSecurityStore.getState().revokeApiKey('k2');
    useSecurityStore.getState().resolveThreat('t3');
    useSecurityStore.getState().resetSecurity();
    const s = useSecurityStore.getState();
    expect(s.apiKeys.find((k) => k.id === 'k2')?.status).toBe('active');
    expect(s.threats.find((t) => t.id === 't3')?.status).toBe('blocked');
    expect(s.settings.mfaRequired).toBe(true);
  });
});
