import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SecurityUserStatus = 'active' | 'invited' | 'suspended';

export interface SecurityUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  department: string;
  mfaEnabled: boolean;
  lastLogin: string;
  status: SecurityUserStatus;
}

export interface SecurityRole {
  id: string;
  name: string;
  description: string;
  level: number;
  isSystem?: boolean;
  permissions: string[];
}

export interface SecurityPermissionGroup {
  resource: string;
  permissions: { key: string; label: string }[];
}

export type ApiKeyStatus = 'active' | 'revoked' | 'expiring';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdBy: string;
  createdAt: string;
  lastUsed: string;
  expiresAt: string;
  status: ApiKeyStatus;
}

export interface Secret {
  id: string;
  name: string;
  reference: string;
  environment: 'production' | 'staging' | 'development';
  rotationDays: number;
  lastRotated: string;
  status: 'ok' | 'expiring' | 'overdue';
  owner: string;
}

export type CertificateStatus = 'valid' | 'expiring' | 'expired';

export interface Certificate {
  id: string;
  name: string;
  domain: string;
  issuer: string;
  keyType: string;
  status: CertificateStatus;
  expiresAt: string;
  daysLeft: number;
}

export type PolicyStatus = 'enforced' | 'recommended' | 'disabled';

export interface SecurityPolicy {
  id: string;
  name: string;
  category: string;
  description: string;
  status: PolicyStatus;
  controls: string[];
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  startedAt: string;
  lastActive: string;
  current: boolean;
}

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
  severity: AuditSeverity;
}

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'active' | 'contained' | 'blocked' | 'resolved';

export interface Threat {
  id: string;
  severity: ThreatSeverity;
  type: string;
  source: string;
  target: string;
  detectedAt: string;
  status: ThreatStatus;
  description: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  standard: string;
  score: number;
  status: 'compliant' | 'in-progress' | 'at-risk';
  controlsTotal: number;
  controlsPassed: number;
  dueDate: string;
}

export interface SecuritySettings {
  mfaRequired: boolean;
  passwordPolicy: 'standard' | 'strict';
  sessionTimeout: number;
  ipAllowlistEnabled: boolean;
  alertEmail: string;
  autoBlockThreats: boolean;
  auditRetentionDays: number;
}

/* ------------------------------------------------------------------ */
/* Security permission catalog                                         */
/* ------------------------------------------------------------------ */

export const SECURITY_PERMISSION_GROUPS: SecurityPermissionGroup[] = [
  {
    resource: 'Access',
    permissions: [
      { key: 'sec.user.view', label: 'View users' },
      { key: 'sec.user.manage', label: 'Manage users' },
      { key: 'sec.role.manage', label: 'Manage roles' },
    ],
  },
  {
    resource: 'Keys & Secrets',
    permissions: [
      { key: 'sec.apikey.view', label: 'View API keys' },
      { key: 'sec.apikey.manage', label: 'Manage API keys' },
      { key: 'sec.secret.view', label: 'View secrets' },
      { key: 'sec.secret.manage', label: 'Manage secrets' },
    ],
  },
  {
    resource: 'Certificates',
    permissions: [
      { key: 'sec.cert.view', label: 'View certificates' },
      { key: 'sec.cert.manage', label: 'Manage certificates' },
    ],
  },
  {
    resource: 'Policies & Sessions',
    permissions: [
      { key: 'sec.policy.view', label: 'View policies' },
      { key: 'sec.policy.manage', label: 'Manage policies' },
      { key: 'sec.session.view', label: 'View sessions' },
      { key: 'sec.session.revoke', label: 'Revoke sessions' },
    ],
  },
  {
    resource: 'Audit & Threats',
    permissions: [
      { key: 'sec.audit.view', label: 'View audit log' },
      { key: 'sec.audit.export', label: 'Export audit log' },
      { key: 'sec.threat.view', label: 'View threats' },
      { key: 'sec.threat.respond', label: 'Respond to threats' },
    ],
  },
  {
    resource: 'Compliance & Settings',
    permissions: [
      { key: 'sec.compliance.view', label: 'View compliance' },
      { key: 'sec.settings.manage', label: 'Manage security settings' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const MOCK_USERS: SecurityUser[] = [
  { id: 'su1', name: 'Alex Operator', email: 'alex@hermes.local', roleId: 'sr-admin', department: 'Platform', mfaEnabled: true, lastLogin: '2m ago', status: 'active' },
  { id: 'su2', name: 'Priya Raman', email: 'priya@hermes.local', roleId: 'sr-admin', department: 'Platform', mfaEnabled: true, lastLogin: '25m ago', status: 'active' },
  { id: 'su3', name: 'Karthik Selvan', email: 'karthik@hermes.local', roleId: 'sr-engineer', department: 'Machine Learning', mfaEnabled: true, lastLogin: '1h ago', status: 'active' },
  { id: 'su4', name: 'Meera Krishnan', email: 'meera@hermes.local', roleId: 'sr-engineer', department: 'Data Engineering', mfaEnabled: false, lastLogin: '3h ago', status: 'active' },
  { id: 'su5', name: 'Rahul Nair', email: 'rahul@hermes.local', roleId: 'sr-analyst', department: 'Product Analytics', mfaEnabled: true, lastLogin: '6h ago', status: 'active' },
  { id: 'su6', name: 'Vikram Joshi', email: 'vikram@hermes.local', roleId: 'sr-engineer', department: 'Growth', mfaEnabled: false, lastLogin: '1d ago', status: 'active' },
  { id: 'su7', name: 'Divya Menon', email: 'divya@hermes.local', roleId: 'sr-engineer', department: 'Data Engineering', mfaEnabled: true, lastLogin: '2d ago', status: 'active' },
  { id: 'su8', name: 'Arjun Dev', email: 'arjun@hermes.local', roleId: 'sr-auditor', department: 'Finance', mfaEnabled: true, lastLogin: 'Never', status: 'invited' },
  { id: 'su9', name: 'Suresh Babu', email: 'suresh@hermes.local', roleId: 'sr-analyst', department: 'Growth', mfaEnabled: false, lastLogin: '2w ago', status: 'suspended' },
];

const MOCK_ROLES: SecurityRole[] = [
  { id: 'sr-owner', name: 'Security Owner', description: 'Full control over all security surfaces, settings, and compliance.', level: 100, isSystem: true, permissions: ['sec.user.view', 'sec.user.manage', 'sec.role.manage', 'sec.apikey.view', 'sec.apikey.manage', 'sec.secret.view', 'sec.secret.manage', 'sec.cert.view', 'sec.cert.manage', 'sec.policy.view', 'sec.policy.manage', 'sec.session.view', 'sec.session.revoke', 'sec.audit.view', 'sec.audit.export', 'sec.threat.view', 'sec.threat.respond', 'sec.compliance.view', 'sec.settings.manage'] },
  { id: 'sr-admin', name: 'Security Admin', description: 'Manages users, keys, secrets, sessions, and threat response.', level: 80, isSystem: true, permissions: ['sec.user.view', 'sec.user.manage', 'sec.role.manage', 'sec.apikey.view', 'sec.apikey.manage', 'sec.secret.view', 'sec.secret.manage', 'sec.cert.view', 'sec.cert.manage', 'sec.policy.view', 'sec.policy.manage', 'sec.session.view', 'sec.session.revoke', 'sec.audit.view', 'sec.audit.export', 'sec.threat.view', 'sec.threat.respond', 'sec.compliance.view'] },
  { id: 'sr-engineer', name: 'Engineer', description: 'Manages keys, secrets, and certificates for own workloads.', level: 60, permissions: ['sec.user.view', 'sec.apikey.view', 'sec.apikey.manage', 'sec.secret.view', 'sec.secret.manage', 'sec.cert.view', 'sec.cert.manage', 'sec.policy.view', 'sec.session.view', 'sec.audit.view', 'sec.threat.view'] },
  { id: 'sr-analyst', name: 'Analyst', description: 'Read-only access to audit logs and threat monitor.', level: 40, permissions: ['sec.user.view', 'sec.apikey.view', 'sec.secret.view', 'sec.cert.view', 'sec.policy.view', 'sec.session.view', 'sec.audit.view', 'sec.threat.view', 'sec.compliance.view'] },
  { id: 'sr-auditor', name: 'Auditor', description: 'Read-only audit and compliance access for external review.', level: 30, permissions: ['sec.audit.view', 'sec.audit.export', 'sec.threat.view', 'sec.compliance.view'] },
];

const MOCK_API_KEYS: ApiKey[] = [
  { id: 'k1', name: 'agent-runtime', prefix: 'hrs_live_a1b2', scopes: ['agents:read', 'agents:write', 'workflows:run'], createdBy: 'Alex Operator', createdAt: '2026-05-12', lastUsed: '2m ago', expiresAt: '2027-05-12', status: 'active' },
  { id: 'k2', name: 'graphify-sync', prefix: 'hrs_live_c3d4', scopes: ['graph:read', 'graph:write'], createdBy: 'Priya Raman', createdAt: '2026-04-03', lastUsed: '18m ago', expiresAt: '2027-04-03', status: 'active' },
  { id: 'k3', name: 'telegram-bridge', prefix: 'hrs_live_e5f6', scopes: ['messaging:send'], createdBy: 'Karthik Selvan', createdAt: '2026-03-21', lastUsed: '1h ago', expiresAt: '2027-03-21', status: 'active' },
  { id: 'k4', name: 'ci-deploy', prefix: 'hrs_live_g7h8', scopes: ['deploy:prod', 'environments:manage'], createdBy: 'Alex Operator', createdAt: '2026-02-14', lastUsed: '3d ago', expiresAt: '2026-08-14', status: 'expiring' },
  { id: 'k5', name: 'legacy-worker', prefix: 'hrs_live_i9j0', scopes: ['agents:read'], createdBy: 'Suresh Babu', createdAt: '2025-11-05', lastUsed: '6mo ago', expiresAt: '2026-11-05', status: 'revoked' },
  { id: 'k6', name: 'billing-webhook', prefix: 'hrs_live_k1l2', scopes: ['billing:read'], createdBy: 'Priya Raman', createdAt: '2026-06-18', lastUsed: '4d ago', expiresAt: '2027-06-18', status: 'active' },
];

const MOCK_SECRETS: Secret[] = [
  { id: 'sec1', name: 'DATABASE_URL', reference: 'vault://prod/database', environment: 'production', rotationDays: 90, lastRotated: '2026-07-01', status: 'ok', owner: 'Platform' },
  { id: 'sec2', name: 'OPENAI_API_KEY', reference: 'vault://prod/openai', environment: 'production', rotationDays: 90, lastRotated: '2026-05-20', status: 'expiring', owner: 'Machine Learning' },
  { id: 'sec3', name: 'STRIPE_SECRET', reference: 'vault://prod/stripe', environment: 'production', rotationDays: 180, lastRotated: '2026-02-10', status: 'overdue', owner: 'Growth' },
  { id: 'sec4', name: 'REDIS_PASSWORD', reference: 'vault://staging/redis', environment: 'staging', rotationDays: 90, lastRotated: '2026-06-25', status: 'ok', owner: 'Platform' },
  { id: 'sec5', name: 'WEBHOOK_SIGNING_KEY', reference: 'vault://prod/webhook', environment: 'production', rotationDays: 30, lastRotated: '2026-07-20', status: 'ok', owner: 'Data Engineering' },
  { id: 'sec6', name: 'GRAFANA_TOKEN', reference: 'vault://dev/grafana', environment: 'development', rotationDays: 60, lastRotated: '2026-06-02', status: 'expiring', owner: 'Platform' },
];

const MOCK_CERTIFICATES: Certificate[] = [
  { id: 'c1', name: 'agentmesh.hermes.local', domain: '*.agentmesh.hermes.local', issuer: "Let's Encrypt", keyType: 'RSA-2048', status: 'valid', expiresAt: '2026-10-15', daysLeft: 74 },
  { id: 'c2', name: 'api.hermes.local', domain: 'api.hermes.local', issuer: 'DigiCert', keyType: 'ECDSA-P256', status: 'valid', expiresAt: '2027-01-30', daysLeft: 181 },
  { id: 'c3', name: 'sso.hermes.local', domain: 'sso.hermes.local', issuer: "Let's Encrypt", keyType: 'RSA-2048', status: 'expiring', expiresAt: '2026-08-12', daysLeft: 10 },
  { id: 'c4', name: 'legacy.hermes.local', domain: 'legacy.hermes.local', issuer: 'DigiCert', keyType: 'RSA-4096', status: 'expired', expiresAt: '2026-06-01', daysLeft: -62 },
  { id: 'c5', name: 'graph.hermes.local', domain: 'graph.hermes.local', issuer: "Let's Encrypt", keyType: 'ECDSA-P256', status: 'valid', expiresAt: '2026-11-02', daysLeft: 92 },
];

const MOCK_POLICIES: SecurityPolicy[] = [
  { id: 'pol1', name: 'MFA for all admin access', category: 'Authentication', status: 'enforced', description: 'Requires multi-factor authentication for every admin-level sign-in.', controls: ['MFA enrollment mandatory', 'Re-auth every 30 days'] },
  { id: 'pol2', name: 'Minimum password strength', category: 'Authentication', status: 'enforced', description: '14+ characters, mixed case, digits, and symbols; no dictionary words.', controls: ['Length ≥ 14', 'Blocked common passwords'] },
  { id: 'pol3', name: 'Session idle timeout', category: 'Sessions', status: 'enforced', description: 'Sessions expire after 30 minutes of inactivity.', controls: ['Idle timeout 30m', 'Absolute cap 12h'] },
  { id: 'pol4', name: 'API key rotation', category: 'Keys', status: 'recommended', description: 'Rotate long-lived API keys every 90 days.', controls: ['Rotation ≤ 90 days', 'Revoke unused keys'] },
  { id: 'pol5', name: 'IP allowlist for admin', category: 'Network', status: 'recommended', description: 'Restrict admin console access to approved IP ranges.', controls: ['Allowlist enforced', 'VPN required'] },
  { id: 'pol6', name: 'Secret rotation cadence', category: 'Secrets', status: 'enforced', description: 'Database and provider secrets rotate on a fixed cadence.', controls: ['90-day rotation', 'Automatic re-encrypt'] },
];

const MOCK_SESSIONS: Session[] = [
  { id: 's1', userId: 'su1', device: 'MacBook Pro', browser: 'Chrome 138', ip: '103.72.11.9', location: 'Chennai, IN', startedAt: '2h ago', lastActive: '2m ago', current: true },
  { id: 's2', userId: 'su2', device: 'Windows 11', browser: 'Edge 138', ip: '49.207.212.44', location: 'Bengaluru, IN', startedAt: '5h ago', lastActive: '25m ago', current: false },
  { id: 's3', userId: 'su3', device: 'iPhone 15', browser: 'Safari 18', ip: '182.76.10.3', location: 'Hyderabad, IN', startedAt: '1d ago', lastActive: '1h ago', current: false },
  { id: 's4', userId: 'su4', device: 'Linux Workstation', browser: 'Firefox 137', ip: '203.122.41.77', location: 'Pune, IN', startedAt: '2d ago', lastActive: '3h ago', current: false },
  { id: 's5', userId: 'su5', device: 'iPad Air', browser: 'Safari 18', ip: '115.98.201.5', location: 'Mumbai, IN', startedAt: '3d ago', lastActive: '6h ago', current: false },
  { id: 's6', userId: 'su1', device: 'Unknown', browser: 'curl 8.7', ip: '45.61.139.88', location: 'Frankfurt, DE', startedAt: '4h ago', lastActive: '4h ago', current: false },
];

const MOCK_AUDIT: AuditEntry[] = [
  { id: 'au1', timestamp: '18m ago', actor: 'Priya Raman', action: 'rotated', resource: 'API key graphify-sync', ip: '49.207.212.44', severity: 'info' },
  { id: 'au2', timestamp: '42m ago', actor: 'System', action: 'blocked', resource: 'sign-in from 45.61.139.88', ip: '45.61.139.88', severity: 'critical' },
  { id: 'au3', timestamp: '1h ago', actor: 'Karthik Selvan', action: 'created', resource: 'secret WEBHOOK_SIGNING_KEY', ip: '182.76.10.3', severity: 'info' },
  { id: 'au4', timestamp: '2h ago', actor: 'Alex Operator', action: 'enabled', resource: 'MFA policy for admins', ip: '103.72.11.9', severity: 'warning' },
  { id: 'au5', timestamp: '3h ago', actor: 'System', action: 'renewed', resource: 'certificate sso.hermes.local', ip: 'system', severity: 'info' },
  { id: 'au6', timestamp: '5h ago', actor: 'Vikram Joshi', action: 'requested', resource: 'session revoke for su5', ip: '203.122.41.77', severity: 'warning' },
  { id: 'au7', timestamp: '8h ago', actor: 'System', action: 'failed', resource: 'API key legacy-worker auth', ip: '45.61.139.88', severity: 'critical' },
  { id: 'au8', timestamp: '1d ago', actor: 'Divya Menon', action: 'exported', resource: 'audit log (7 days)', ip: '115.98.201.5', severity: 'warning' },
  { id: 'au9', timestamp: '1d ago', actor: 'Meera Krishnan', action: 'updated', resource: 'policy Session idle timeout', ip: '203.122.41.77', severity: 'info' },
  { id: 'au10', timestamp: '2d ago', actor: 'Alex Operator', action: 'configured', resource: 'IP allowlist for admin', ip: '103.72.11.9', severity: 'warning' },
];

const MOCK_THREATS: Threat[] = [
  { id: 't1', severity: 'critical', type: 'Brute force', source: '45.61.139.88 (FR)', target: 'Admin console', detectedAt: '42m ago', status: 'active', description: '21 failed sign-in attempts in 3 minutes against the admin console.' },
  { id: 't2', severity: 'high', type: 'API key abuse', source: 'revoked key legacy-worker', target: 'Agents API', detectedAt: '8h ago', status: 'contained', description: 'Requests with a revoked API key were observed; requests rejected.' },
  { id: 't3', severity: 'medium', type: 'Anomalous login', source: '182.76.10.3 (IN)', target: 'User account su3', detectedAt: '1d ago', status: 'blocked', description: 'Login from a new device outside the usual geographic pattern.' },
  { id: 't4', severity: 'low', type: 'Port scan', source: '115.98.201.5 (IN)', target: 'Edge gateways', detectedAt: '2d ago', status: 'resolved', description: 'Sequential port scan detected and dropped at the edge.' },
  { id: 't5', severity: 'medium', type: 'Certificate risk', source: 'legacy.hermes.local', target: 'TLS endpoints', detectedAt: '3d ago', status: 'contained', description: 'Expired certificate no longer serves traffic; renewal pending.' },
];

const MOCK_COMPLIANCE: ComplianceFramework[] = [
  { id: 'cf1', name: 'SOC 2 Type II', standard: 'AICPA Trust Services', score: 92, status: 'compliant', controlsTotal: 64, controlsPassed: 59, dueDate: '2026-10-30' },
  { id: 'cf2', name: 'ISO 27001', standard: 'ISO/IEC 27001:2022', score: 88, status: 'compliant', controlsTotal: 93, controlsPassed: 82, dueDate: '2027-01-15' },
  { id: 'cf3', name: 'GDPR', standard: 'EU General Data Protection Regulation', score: 76, status: 'in-progress', controlsTotal: 42, controlsPassed: 32, dueDate: '2026-09-30' },
  { id: 'cf4', name: 'PCI DSS 4.0', standard: 'Payment Card Industry', score: 61, status: 'at-risk', controlsTotal: 51, controlsPassed: 31, dueDate: '2026-08-25' },
];

const DEFAULT_SETTINGS: SecuritySettings = {
  mfaRequired: true,
  passwordPolicy: 'strict',
  sessionTimeout: 30,
  ipAllowlistEnabled: false,
  alertEmail: 'security@hermes.local',
  autoBlockThreats: true,
  auditRetentionDays: 365,
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

interface SecurityState {
  users: SecurityUser[];
  roles: SecurityRole[];
  apiKeys: ApiKey[];
  secrets: Secret[];
  certificates: Certificate[];
  policies: SecurityPolicy[];
  sessions: Session[];
  audit: AuditEntry[];
  threats: Threat[];
  compliance: ComplianceFramework[];
  settings: SecuritySettings;

  // Selectors
  userById: (id: string) => SecurityUser | undefined;
  roleById: (id: string) => SecurityRole | undefined;
  sessionsByUser: (userId: string) => Session[];
  activeThreats: () => Threat[];
  openSessions: () => number;
  keysExpiring: () => number;

  // Actions
  revokeSession: (id: string) => void;
  revokeApiKey: (id: string) => void;
  rotateApiKey: (id: string) => void;
  rotateSecret: (id: string) => void;
  resolveThreat: (id: string) => void;
  updatePolicyStatus: (id: string, status: PolicyStatus) => void;
  updateSettings: (patch: Partial<SecuritySettings>) => void;
  logAudit: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  resetSecurity: () => void;
}

export const useSecurityStore = create<SecurityState>((set, get) => ({
  users: MOCK_USERS,
  roles: MOCK_ROLES,
  apiKeys: MOCK_API_KEYS,
  secrets: MOCK_SECRETS,
  certificates: MOCK_CERTIFICATES,
  policies: MOCK_POLICIES,
  sessions: MOCK_SESSIONS,
  audit: MOCK_AUDIT,
  threats: MOCK_THREATS,
  compliance: MOCK_COMPLIANCE,
  settings: DEFAULT_SETTINGS,

  userById: (id) => get().users.find((u) => u.id === id),
  roleById: (id) => get().roles.find((r) => r.id === id),
  sessionsByUser: (userId) => get().sessions.filter((s) => s.userId === userId),
  activeThreats: () => get().threats.filter((t) => t.status === 'active' || t.status === 'contained'),
  openSessions: () => get().sessions.length,
  keysExpiring: () => get().apiKeys.filter((k) => k.status === 'expiring' || k.status === 'revoked').length,

  revokeSession: (id) => {
    set((s) => ({
      sessions: s.sessions.filter((x) => x.id !== id),
    }));
    get().logAudit({
      actor: 'You',
      action: 'revoked',
      resource: 'user session',
      ip: 'console',
      severity: 'warning',
    });
  },

  revokeApiKey: (id) => {
    set((s) => ({
      apiKeys: s.apiKeys.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)),
    }));
  },

  rotateApiKey: (id) => {
    set((s) => ({
      apiKeys: s.apiKeys.map((k) =>
        k.id === id
          ? { ...k, status: 'active', lastUsed: 'just rotated', createdAt: new Date().toISOString().slice(0, 10) }
          : k
      ),
    }));
  },

  rotateSecret: (id) => {
    set((s) => ({
      secrets: s.secrets.map((x) =>
        x.id === id
          ? { ...x, status: 'ok', lastRotated: new Date().toISOString().slice(0, 10) }
          : x
      ),
    }));
  },

  resolveThreat: (id) => {
    set((s) => ({
      threats: s.threats.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t)),
    }));
  },

  updatePolicyStatus: (id, status) => {
    set((s) => ({
      policies: s.policies.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
  },

  logAudit: (entry) => {
    const full: AuditEntry = {
      ...entry,
      id: `au${Date.now()}`,
      timestamp: 'just now',
    };
    set((s) => ({ audit: [full, ...s.audit].slice(0, 200) }));
  },

  resetSecurity: () => {
    set({
      users: MOCK_USERS,
      roles: MOCK_ROLES,
      apiKeys: MOCK_API_KEYS,
      secrets: MOCK_SECRETS,
      certificates: MOCK_CERTIFICATES,
      policies: MOCK_POLICIES,
      sessions: MOCK_SESSIONS,
      audit: MOCK_AUDIT,
      threats: MOCK_THREATS,
      compliance: MOCK_COMPLIANCE,
      settings: DEFAULT_SETTINGS,
    });
  },
}));
