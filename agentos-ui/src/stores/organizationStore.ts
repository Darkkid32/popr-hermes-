import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type MemberStatus = 'active' | 'invited' | 'suspended';

export type PlanTier = 'Free' | 'Pro' | 'Enterprise';

export type ResourceKey =
  | 'members'
  | 'teams'
  | 'projects'
  | 'environments'
  | 'licenses'
  | 'storage'
  | 'compute'
  | 'bandwidth';

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  roleId: string;
  teamIds: string[];
  status: MemberStatus;
  lastActive: string;
  joinedAt: string;
  color: string;
}

export interface OrgTeam {
  id: string;
  name: string;
  description: string;
  leadId: string;
  color: string;
  createdAt: string;
}

export interface OrgRole {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  isSystem?: boolean;
}

export interface PermissionDef {
  key: string;
  label: string;
}

export interface PermissionGroup {
  resource: string;
  permissions: PermissionDef[];
}

export interface OrgWorkspace {
  id: string;
  name: string;
  slug: string;
  region: string;
  plan: PlanTier;
  status: 'active' | 'provisioning' | 'archived';
  memberCount: number;
  projectCount: number;
  createdAt: string;
}

export interface OrgProject {
  id: string;
  name: string;
  description: string;
  teamId: string;
  status: 'on-track' | 'at-risk' | 'blocked' | 'completed';
  progress: number;
  environmentCount: number;
  memberCount: number;
  budget: number;
  spent: number;
  deadline: string;
  color: string;
}

export type EnvType = 'production' | 'staging' | 'development' | 'sandbox';

export interface OrgEnvironment {
  id: string;
  name: string;
  type: EnvType;
  projectId: string;
  status: 'healthy' | 'degraded' | 'offline' | 'provisioning';
  region: string;
  url: string;
  updatedAt: string;
}

export interface OrgLicense {
  id: string;
  name: string;
  tier: string;
  seats: number;
  used: number;
  status: 'active' | 'expiring' | 'expired' | 'trial';
  expiresAt: string;
  cost: number;
}

export interface OrgQuota {
  id: string;
  resource: ResourceKey;
  label: string;
  limit: number;
  used: number;
  unit: string;
  color: string;
}

export type ActivityType =
  | 'member'
  | 'team'
  | 'project'
  | 'environment'
  | 'license'
  | 'security'
  | 'billing'
  | 'settings';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  outcome: 'success' | 'warning' | 'error';
}

export interface OrgSettings {
  orgName: string;
  slug: string;
  plan: PlanTier;
  region: string;
  timezone: string;
  defaultRoleId: string;
  mfaEnabled: boolean;
  ssoEnabled: boolean;
  passwordPolicy: 'standard' | 'strict';
  emailDigest: boolean;
  slackAlerts: boolean;
  sessionTimeout: number;
}

/* ------------------------------------------------------------------ */
/* Permission catalog                                                  */
/* ------------------------------------------------------------------ */

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    resource: 'Organization',
    permissions: [
      { key: 'org.view', label: 'View org' },
      { key: 'org.manage', label: 'Manage org' },
      { key: 'billing.manage', label: 'Manage billing' },
    ],
  },
  {
    resource: 'Members',
    permissions: [
      { key: 'member.view', label: 'View members' },
      { key: 'member.invite', label: 'Invite members' },
      { key: 'member.manage', label: 'Manage members' },
    ],
  },
  {
    resource: 'Teams',
    permissions: [
      { key: 'team.view', label: 'View teams' },
      { key: 'team.manage', label: 'Manage teams' },
    ],
  },
  {
    resource: 'Workspaces & Projects',
    permissions: [
      { key: 'workspace.view', label: 'View workspaces' },
      { key: 'workspace.manage', label: 'Manage workspaces' },
      { key: 'project.view', label: 'View projects' },
      { key: 'project.manage', label: 'Manage projects' },
    ],
  },
  {
    resource: 'Environments & Deployments',
    permissions: [
      { key: 'env.view', label: 'View environments' },
      { key: 'env.deploy', label: 'Deploy to environments' },
      { key: 'env.manage', label: 'Manage environments' },
    ],
  },
  {
    resource: 'Licenses & Quotas',
    permissions: [
      { key: 'license.view', label: 'View licenses' },
      { key: 'license.manage', label: 'Manage licenses' },
      { key: 'quota.view', label: 'View quotas' },
      { key: 'quota.manage', label: 'Manage quotas' },
    ],
  },
  {
    resource: 'Activity & Audit',
    permissions: [
      { key: 'activity.view', label: 'View activity log' },
      { key: 'audit.export', label: 'Export audit trail' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const MOCK_MEMBERS: OrgMember[] = [
  { id: 'm1', name: 'Alex Operator', email: 'alex@hermes.local', roleId: 'r-owner', teamIds: ['t1'], status: 'active', lastActive: '2m ago', joinedAt: '2024-01-10', color: '#7c6cf5' },
  { id: 'm2', name: 'Priya Raman', email: 'priya@hermes.local', roleId: 'r-admin', teamIds: ['t1', 't2'], status: 'active', lastActive: '12m ago', joinedAt: '2024-02-03', color: '#22d97a' },
  { id: 'm3', name: 'Karthik Selvan', email: 'karthik@hermes.local', roleId: 'r-engineer', teamIds: ['t2'], status: 'active', lastActive: '1h ago', joinedAt: '2024-02-18', color: '#00e5ff' },
  { id: 'm4', name: 'Meera Krishnan', email: 'meera@hermes.local', roleId: 'r-engineer', teamIds: ['t3'], status: 'active', lastActive: '3h ago', joinedAt: '2024-03-05', color: '#ffb347' },
  { id: 'm5', name: 'Rahul Nair', email: 'rahul@hermes.local', roleId: 'r-analyst', teamIds: ['t4'], status: 'active', lastActive: '5h ago', joinedAt: '2024-03-22', color: '#ff4d6d' },
  { id: 'm6', name: 'Sneha Iyer', email: 'sneha@hermes.local', roleId: 'r-engineer', teamIds: ['t5'], status: 'active', lastActive: '1d ago', joinedAt: '2024-04-11', color: '#a78bfa' },
  { id: 'm7', name: 'Vikram Joshi', email: 'vikram@hermes.local', roleId: 'r-admin', teamIds: ['t6'], status: 'active', lastActive: '1d ago', joinedAt: '2024-05-02', color: '#34d399' },
  { id: 'm8', name: 'Divya Menon', email: 'divya@hermes.local', roleId: 'r-engineer', teamIds: ['t2', 't3'], status: 'active', lastActive: '2d ago', joinedAt: '2024-05-19', color: '#f472b6' },
  { id: 'm9', name: 'Arjun Dev', email: 'arjun@hermes.local', roleId: 'r-guest', teamIds: ['t4'], status: 'invited', lastActive: 'Never', joinedAt: '2024-06-01', color: '#fbbf24' },
  { id: 'm10', name: 'Lakshmi Rao', email: 'lakshmi@hermes.local', roleId: 'r-analyst', teamIds: ['t1'], status: 'active', lastActive: '3d ago', joinedAt: '2024-06-14', color: '#60a5fa' },
  { id: 'm11', name: 'Suresh Babu', email: 'suresh@hermes.local', roleId: 'r-engineer', teamIds: ['t6'], status: 'suspended', lastActive: '2w ago', joinedAt: '2024-07-08', color: '#c084fc' },
  { id: 'm12', name: 'Anita George', email: 'anita@hermes.local', roleId: 'r-guest', teamIds: ['t5'], status: 'active', lastActive: '4d ago', joinedAt: '2024-07-25', color: '#2dd4bf' },
];

const MOCK_TEAMS: OrgTeam[] = [
  { id: 't1', name: 'Platform', description: 'Core infrastructure, agent runtimes, and deployment pipelines.', leadId: 'm1', color: '#7c6cf5', createdAt: '2024-01-15' },
  { id: 't2', name: 'Machine Learning', description: 'Model training, evaluation, and inference optimization.', leadId: 'm3', color: '#22d97a', createdAt: '2024-02-10' },
  { id: 't3', name: 'Data Engineering', description: 'Pipelines, warehouses, and data quality tooling.', leadId: 'm4', color: '#00e5ff', createdAt: '2024-03-02' },
  { id: 't4', name: 'Product Analytics', description: 'Usage analytics, experimentation, and insights.', leadId: 'm5', color: '#ffb347', createdAt: '2024-03-20' },
  { id: 't5', name: 'Security', description: 'Access control, audits, and compliance.', leadId: 'm6', color: '#ff4d6d', createdAt: '2024-04-08' },
  { id: 't6', name: 'Growth', description: 'Acquisition, activation, and expansion initiatives.', leadId: 'm7', color: '#a78bfa', createdAt: '2024-05-01' },
];

const MOCK_ROLES: OrgRole[] = [
  {
    id: 'r-owner', name: 'Owner', description: 'Full control over the organization, billing, and all resources.', level: 100, isSystem: true,
    permissions: ['org.view', 'org.manage', 'billing.manage', 'member.view', 'member.invite', 'member.manage', 'team.view', 'team.manage', 'workspace.view', 'workspace.manage', 'project.view', 'project.manage', 'env.view', 'env.deploy', 'env.manage', 'license.view', 'license.manage', 'quota.view', 'quota.manage', 'activity.view', 'audit.export'],
  },
  {
    id: 'r-admin', name: 'Admin', description: 'Manages members, teams, projects, and environments.', level: 80, isSystem: true,
    permissions: ['org.view', 'member.view', 'member.invite', 'member.manage', 'team.view', 'team.manage', 'workspace.view', 'workspace.manage', 'project.view', 'project.manage', 'env.view', 'env.deploy', 'env.manage', 'license.view', 'quota.view', 'quota.manage', 'activity.view', 'audit.export'],
  },
  {
    id: 'r-engineer', name: 'Engineer', description: 'Builds projects and deploys to non-production environments.', level: 60,
    permissions: ['org.view', 'member.view', 'team.view', 'workspace.view', 'project.view', 'project.manage', 'env.view', 'env.deploy', 'license.view', 'quota.view', 'activity.view'],
  },
  {
    id: 'r-analyst', name: 'Analyst', description: 'Read-only access to projects, analytics, and activity.', level: 40,
    permissions: ['org.view', 'member.view', 'team.view', 'workspace.view', 'project.view', 'env.view', 'license.view', 'quota.view', 'activity.view'],
  },
  {
    id: 'r-guest', name: 'Guest', description: 'Limited read access to invited resources only.', level: 20,
    permissions: ['org.view', 'project.view'],
  },
];

const MOCK_WORKSPACES: OrgWorkspace[] = [
  { id: 'ow1', name: 'Production Platform', slug: 'prod-platform', region: 'ap-south-1', plan: 'Enterprise', status: 'active', memberCount: 14, projectCount: 6, createdAt: '2024-01-20' },
  { id: 'ow2', name: 'ML Research', slug: 'ml-research', region: 'us-east-1', plan: 'Pro', status: 'active', memberCount: 9, projectCount: 4, createdAt: '2024-02-14' },
  { id: 'ow3', name: 'Data Pipelines', slug: 'data-pipelines', region: 'eu-west-1', plan: 'Pro', status: 'active', memberCount: 7, projectCount: 3, createdAt: '2024-03-01' },
  { id: 'ow4', name: 'Customer Analytics', slug: 'customer-analytics', region: 'us-west-2', plan: 'Pro', status: 'active', memberCount: 6, projectCount: 2, createdAt: '2024-04-05' },
  { id: 'ow5', name: 'Compliance Sandbox', slug: 'compliance-sandbox', region: 'ap-southeast-1', plan: 'Free', status: 'provisioning', memberCount: 3, projectCount: 1, createdAt: '2024-07-10' },
  { id: 'ow6', name: 'Legacy Migration', slug: 'legacy-migration', region: 'us-east-1', plan: 'Pro', status: 'archived', memberCount: 5, projectCount: 2, createdAt: '2023-11-02' },
];

const MOCK_PROJECTS: OrgProject[] = [
  { id: 'p1', name: 'Agent Mesh v2', description: 'Distributed agent orchestration mesh with zero-config failover.', teamId: 't1', status: 'on-track', progress: 68, environmentCount: 3, memberCount: 6, budget: 120000, spent: 72000, deadline: '2026-09-15', color: '#7c6cf5' },
  { id: 'p2', name: 'Model Registry', description: 'Central registry for model versions, metrics, and promotion.', teamId: 't2', status: 'at-risk', progress: 44, environmentCount: 2, memberCount: 5, budget: 90000, spent: 61000, deadline: '2026-08-30', color: '#22d97a' },
  { id: 'p3', name: 'Realtime Pipelines', description: 'Streaming ingestion with sub-second freshness.', teamId: 't3', status: 'on-track', progress: 81, environmentCount: 3, memberCount: 4, budget: 75000, spent: 54000, deadline: '2026-10-01', color: '#00e5ff' },
  { id: 'p4', name: 'Funnel Explorer', description: 'Drag-and-drop funnel analysis over event streams.', teamId: 't4', status: 'blocked', progress: 22, environmentCount: 2, memberCount: 3, budget: 45000, spent: 29000, deadline: '2026-09-22', color: '#ffb347' },
  { id: 'p5', name: 'SSO Hardening', description: 'SAML/OIDC SSO with conditional access policies.', teamId: 't5', status: 'on-track', progress: 57, environmentCount: 2, memberCount: 4, budget: 60000, spent: 31000, deadline: '2026-08-18', color: '#ff4d6d' },
  { id: 'p6', name: 'Growth Dashboards', description: 'North-star metric dashboards for the growth team.', teamId: 't6', status: 'completed', progress: 100, environmentCount: 3, memberCount: 3, budget: 30000, spent: 27500, deadline: '2026-07-28', color: '#a78bfa' },
  { id: 'p7', name: 'Tenant Isolation', description: 'Hard multi-tenancy with per-workspace encryption keys.', teamId: 't1', status: 'at-risk', progress: 35, environmentCount: 2, memberCount: 5, budget: 110000, spent: 68000, deadline: '2026-11-10', color: '#f472b6' },
  { id: 'p8', name: 'Onboarding Revamp', description: 'Self-serve onboarding with usage-guided setup.', teamId: 't6', status: 'on-track', progress: 49, environmentCount: 1, memberCount: 4, budget: 50000, spent: 21000, deadline: '2026-10-20', color: '#60a5fa' },
];

const MOCK_ENVIRONMENTS: OrgEnvironment[] = [
  { id: 'e1', name: 'prod-agentmesh', type: 'production', projectId: 'p1', status: 'healthy', region: 'ap-south-1', url: 'https://agentmesh.hermes.local', updatedAt: '2h ago' },
  { id: 'e2', name: 'staging-agentmesh', type: 'staging', projectId: 'p1', status: 'healthy', region: 'ap-south-1', url: 'https://staging.agentmesh.hermes.local', updatedAt: '4h ago' },
  { id: 'e3', name: 'dev-agentmesh', type: 'development', projectId: 'p1', status: 'degraded', region: 'ap-south-1', url: 'https://dev.agentmesh.hermes.local', updatedAt: '1d ago' },
  { id: 'e4', name: 'prod-modelreg', type: 'production', projectId: 'p2', status: 'healthy', region: 'us-east-1', url: 'https://modelreg.hermes.local', updatedAt: '30m ago' },
  { id: 'e5', name: 'staging-modelreg', type: 'staging', projectId: 'p2', status: 'degraded', region: 'us-east-1', url: 'https://staging.modelreg.hermes.local', updatedAt: '3h ago' },
  { id: 'e6', name: 'prod-pipelines', type: 'production', projectId: 'p3', status: 'healthy', region: 'eu-west-1', url: 'https://pipelines.hermes.local', updatedAt: '1h ago' },
  { id: 'e7', name: 'staging-pipelines', type: 'staging', projectId: 'p3', status: 'provisioning', region: 'eu-west-1', url: 'https://staging.pipelines.hermes.local', updatedAt: '6h ago' },
  { id: 'e8', name: 'prod-funnel', type: 'production', projectId: 'p4', status: 'offline', region: 'us-west-2', url: 'https://funnel.hermes.local', updatedAt: '2d ago' },
  { id: 'e9', name: 'prod-sso', type: 'production', projectId: 'p5', status: 'healthy', region: 'ap-southeast-1', url: 'https://sso.hermes.local', updatedAt: '45m ago' },
  { id: 'e10', name: 'sandbox-tenant', type: 'sandbox', projectId: 'p7', status: 'provisioning', region: 'us-east-1', url: 'https://sandbox.tenant.hermes.local', updatedAt: '5h ago' },
];

const MOCK_LICENSES: OrgLicense[] = [
  { id: 'l1', name: 'Enterprise Seat', tier: 'Enterprise', seats: 100, used: 62, status: 'active', expiresAt: '2027-01-31', cost: 49900 },
  { id: 'l2', name: 'Agent Runtime', tier: 'Pro', seats: 50, used: 38, status: 'active', expiresAt: '2026-12-15', cost: 19900 },
  { id: 'l3', name: 'Graph Memory Add-on', tier: 'Pro', seats: 25, used: 25, status: 'expiring', expiresAt: '2026-08-20', cost: 9900 },
  { id: 'l4', name: 'Audit Trail', tier: 'Enterprise', seats: 10, used: 4, status: 'active', expiresAt: '2027-06-30', cost: 4900 },
  { id: 'l5', name: 'Legacy Pro Seat', tier: 'Pro', seats: 20, used: 20, status: 'expired', expiresAt: '2026-06-30', cost: 12900 },
];

const MOCK_QUOTAS: OrgQuota[] = [
  { id: 'q1', resource: 'members', label: 'Members', limit: 100, used: 62, unit: 'seats', color: '#7c6cf5' },
  { id: 'q2', resource: 'teams', label: 'Teams', limit: 20, used: 6, unit: 'teams', color: '#22d97a' },
  { id: 'q3', resource: 'projects', label: 'Projects', limit: 50, used: 28, unit: 'projects', color: '#00e5ff' },
  { id: 'q4', resource: 'environments', label: 'Environments', limit: 40, used: 31, unit: 'envs', color: '#ffb347' },
  { id: 'q5', resource: 'licenses', label: 'Licenses', limit: 10, used: 5, unit: 'licenses', color: '#ff4d6d' },
  { id: 'q6', resource: 'storage', label: 'Storage', limit: 2048, used: 1480, unit: 'GB', color: '#a78bfa' },
  { id: 'q7', resource: 'compute', label: 'Compute', limit: 5000, used: 3220, unit: 'hours', color: '#f472b6' },
  { id: 'q8', resource: 'bandwidth', label: 'Bandwidth', limit: 10000, used: 6130, unit: 'GB', color: '#60a5fa' },
];

const MOCK_ACTIVITY: ActivityEvent[] = [
  { id: 'a1', type: 'member', actor: 'Alex Operator', action: 'invited', target: 'Arjun Dev to Product Analytics', timestamp: '18m ago', outcome: 'success' },
  { id: 'a2', type: 'environment', actor: 'Karthik Selvan', action: 'deployed', target: 'staging-modelreg v2.4.1', timestamp: '42m ago', outcome: 'success' },
  { id: 'a3', type: 'security', actor: 'System', action: 'blocked', target: 'sign-in attempt from 103.72.11.9', timestamp: '1h ago', outcome: 'warning' },
  { id: 'a4', type: 'team', actor: 'Priya Raman', action: 'created', target: 'team "Growth Experiments"', timestamp: '2h ago', outcome: 'success' },
  { id: 'a5', type: 'license', actor: 'Vikram Joshi', action: 'assigned', target: 'Enterprise Seat to Lakshmi Rao', timestamp: '3h ago', outcome: 'success' },
  { id: 'a6', type: 'billing', actor: 'Alex Operator', action: 'updated', target: 'payment method (•••• 4421)', timestamp: '5h ago', outcome: 'success' },
  { id: 'a7', type: 'project', actor: 'Divya Menon', action: 'moved', target: 'Model Registry to at-risk', timestamp: '6h ago', outcome: 'warning' },
  { id: 'a8', type: 'environment', actor: 'System', action: 'detected', target: 'degraded health on dev-agentmesh', timestamp: '8h ago', outcome: 'error' },
  { id: 'a9', type: 'settings', actor: 'Alex Operator', action: 'enabled', target: 'MFA for all admins', timestamp: '9h ago', outcome: 'success' },
  { id: 'a10', type: 'member', actor: 'Meera Krishnan', action: 'removed', target: 'Suresh Babu from ML Research', timestamp: '1d ago', outcome: 'success' },
  { id: 'a11', type: 'project', actor: 'Rahul Nair', action: 'completed', target: 'Growth Dashboards', timestamp: '1d ago', outcome: 'success' },
  { id: 'a12', type: 'security', actor: 'System', action: 'rotated', target: 'API keys for agent-runtime', timestamp: '1d ago', outcome: 'success' },
  { id: 'a13', type: 'license', actor: 'System', action: 'renewed', target: 'Graph Memory Add-on (expiring)', timestamp: '2d ago', outcome: 'warning' },
  { id: 'a14', type: 'team', actor: 'Anita George', action: 'joined', target: 'Security team', timestamp: '2d ago', outcome: 'success' },
  { id: 'a15', type: 'member', actor: 'Sneha Iyer', action: 'changed', target: 'role of Vikram Joshi to Admin', timestamp: '3d ago', outcome: 'success' },
];

const DEFAULT_SETTINGS: OrgSettings = {
  orgName: 'Hermes Systems Pvt Ltd',
  slug: 'hermes-systems',
  plan: 'Enterprise',
  region: 'ap-south-1',
  timezone: 'Asia/Kolkata',
  defaultRoleId: 'r-engineer',
  mfaEnabled: true,
  ssoEnabled: false,
  passwordPolicy: 'strict',
  emailDigest: true,
  slackAlerts: true,
  sessionTimeout: 30,
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

interface OrganizationState {
  name: string;
  plan: PlanTier;
  members: OrgMember[];
  teams: OrgTeam[];
  roles: OrgRole[];
  workspaces: OrgWorkspace[];
  projects: OrgProject[];
  environments: OrgEnvironment[];
  licenses: OrgLicense[];
  quotas: OrgQuota[];
  activity: ActivityEvent[];
  settings: OrgSettings;

  // Selectors
  memberById: (id: string) => OrgMember | undefined;
  teamById: (id: string) => OrgTeam | undefined;
  roleById: (id: string) => OrgRole | undefined;
  membersByTeam: (teamId: string) => OrgMember[];
  teamMemberCount: (teamId: string) => number;
  projectsByTeam: (teamId: string) => OrgProject[];
  environmentsByProject: (projectId: string) => OrgEnvironment[];
  usagePct: (quotaId: string) => number;
  utilization: () => number;

  // Actions
  inviteMember: (input: { name: string; email: string; roleId: string; teamIds: string[] }) => void;
  removeMember: (id: string) => void;
  toggleMemberStatus: (id: string) => void;
  updateSettings: (patch: Partial<OrgSettings>) => void;
  logActivity: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  resetOrg: () => void;
}

let memberSeq = 100;

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  name: 'Hermes Systems Pvt Ltd',
  plan: 'Enterprise',
  members: MOCK_MEMBERS,
  teams: MOCK_TEAMS,
  roles: MOCK_ROLES,
  workspaces: MOCK_WORKSPACES,
  projects: MOCK_PROJECTS,
  environments: MOCK_ENVIRONMENTS,
  licenses: MOCK_LICENSES,
  quotas: MOCK_QUOTAS,
  activity: MOCK_ACTIVITY,
  settings: DEFAULT_SETTINGS,

  memberById: (id) => get().members.find((m) => m.id === id),
  teamById: (id) => get().teams.find((t) => t.id === id),
  roleById: (id) => get().roles.find((r) => r.id === id),
  membersByTeam: (teamId) => get().members.filter((m) => m.teamIds.includes(teamId)),
  teamMemberCount: (teamId) => get().members.filter((m) => m.teamIds.includes(teamId)).length,
  projectsByTeam: (teamId) => get().projects.filter((p) => p.teamId === teamId),
  environmentsByProject: (projectId) => get().environments.filter((e) => e.projectId === projectId),
  usagePct: (quotaId) => {
    const q = get().quotas.find((x) => x.id === quotaId);
    if (!q || q.limit === 0) return 0;
    return Math.min(100, Math.round((q.used / q.limit) * 100));
  },
  utilization: () => {
    const total = get().quotas.reduce((acc, q) => acc + q.limit, 0);
    const used = get().quotas.reduce((acc, q) => acc + q.used, 0);
    return total === 0 ? 0 : Math.round((used / total) * 100);
  },

  inviteMember: ({ name, email, roleId, teamIds }) => {
    const id = `m${memberSeq++}`;
    const member: OrgMember = {
      id,
      name,
      email,
      roleId,
      teamIds,
      status: 'invited',
      lastActive: 'Never',
      joinedAt: new Date().toISOString().slice(0, 10),
      color: '#7c6cf5',
    };
    set((s) => ({ members: [...s.members, member] }));
    get().logActivity({
      type: 'member',
      actor: 'You',
      action: 'invited',
      target: `${name} (${email})`,
      outcome: 'success',
    });
  },

  removeMember: (id) => {
    set((s) => ({ members: s.members.filter((m) => m.id !== id) }));
  },

  toggleMemberStatus: (id) => {
    set((s) => ({
      members: s.members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'suspended' ? 'active' : 'suspended' }
          : m
      ),
    }));
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
  },

  logActivity: (event) => {
    const entry: ActivityEvent = {
      ...event,
      id: `a${Date.now()}`,
      timestamp: 'just now',
    };
    set((s) => ({ activity: [entry, ...s.activity].slice(0, 60) }));
  },

  resetOrg: () => {
    set({
      members: MOCK_MEMBERS,
      teams: MOCK_TEAMS,
      roles: MOCK_ROLES,
      workspaces: MOCK_WORKSPACES,
      projects: MOCK_PROJECTS,
      environments: MOCK_ENVIRONMENTS,
      licenses: MOCK_LICENSES,
      quotas: MOCK_QUOTAS,
      activity: MOCK_ACTIVITY,
      settings: DEFAULT_SETTINGS,
    });
  },
}));
