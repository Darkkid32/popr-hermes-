# Hermes Security Subsystem — Enterprise Architecture Specification (Part 2)

---

## 3.3.9 Audit & Compliance Domain (continued)

```typescript
  controls: Control[];
  required: boolean;
  scope: 'global' | 'tenant' | 'workspace';
  createdAt: Date;
  updatedAt: Date;
}

interface Control {
  id: ControlId;
  frameworkId: FrameworkId;
  identifier: string;
  name: string;
  description: string;
  category: string;
  requirement: string;
  testProcedure: string;
  evidenceTypes: EvidenceType[];
  automated: boolean;
  frequency: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

type EvidenceType = 
  | 'audit_log' 
  | 'config_snapshot' 
  | 'policy_document' 
  | 'scan_result' 
  | 'certificate' 
  | 'key_material' 
  | 'access_review' 
  | 'incident_report' 
  | 'training_record' 
  | 'custom';

interface Evidence {
  id: EvidenceId;
  controlId: ControlId;
  type: EvidenceType;
  source: string;
  data: any;
  collectedAt: Date;
  collectedBy: string;
  integrityHash: string;
  metadata: Record<string, any>;
}

interface Assessment {
  id: AssessmentId;
  frameworkId: FrameworkId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  scope: AssessmentScope;
  findings: Finding[];
  overallScore: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserId;
}

interface AssessmentScope {
  includeControls: string[];
  excludeControls: string[];
  workspaces: WorkspaceId[];
  resources: string[];
}

interface Finding {
  id: string;
  controlId: ControlId;
  status: 'pass' | 'fail' | 'not_applicable' | 'not_tested' | 'manual_review';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  evidence: EvidenceId[];
  remediation?: RemediationPlan;
  dueDate?: Date;
}

interface RemediationPlan {
  description: string;
  steps: string[];
  owner: UserId;
  targetDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'verified';
}

interface ComplianceReport {
  id: ComplianceReportId;
  assessmentId: AssessmentId;
  frameworkId: FrameworkId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  period: { start: Date; end: Date };
  status: 'draft' | 'final' | 'published' | 'archived';
  summary: ReportSummary;
  sections: ReportSection[];
  generatedAt: Date;
  generatedBy: UserId;
  approvedBy?: UserId;
  approvedAt?: Date;
}

interface ReportSummary {
  totalControls: number;
  passed: number;
  failed: number;
  notApplicable: number;
  notTested: number;
  overallScore: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
}

interface ReportSection {
  id: string;
  title: string;
  controls: ControlSummary[];
}

interface ControlSummary {
  controlId: ControlId;
  identifier: string;
  name: string;
  status: 'pass' | 'fail' | 'not_applicable' | 'not_tested';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  evidenceCount: number;
  findings: Finding[];
}
```

#### 3.3.10 Threat Detection Domain

```typescript
interface Threat {
  id: ThreatId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  type: ThreatType;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'active' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
  title: string;
  description: string;
  source: ThreatSource;
  indicators: ThreatIndicator[];
  mitreAttack: MITREAttack[];
  affectedEntities: AffectedEntity[];
  riskScore: number;
  detectedAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  assignedTo?: UserId;
  metadata: Record<string, any>;
}

type ThreatType = 
  | 'credential_theft' 
  | 'privilege_escalation' 
  | 'lateral_movement' 
  | 'data_exfiltration' 
  | 'persistence' 
  | 'defense_evasion' 
  | 'credential_access' 
  | 'discovery' 
  | 'collection' 
  | 'command_and_control' 
  | 'exfiltration' 
  | 'impact' 
  | 'initial_access' 
  | 'execution' 
  | 'reconnaissance' 
  | 'resource_development' 
  | 'supply_chain' 
  | 'insider_threat' 
  | 'anomalous_behavior' 
  | 'vulnerability_exploit' 
  | 'misconfiguration' 
  | 'policy_violation';

interface ThreatSource {
  type: 'audit_log' | 'auth_log' | 'network_log' | 'endpoint_log' | 'threat_intel' | 'user_report' | 'automated_scan';
  sourceId: string;
  rawData: any;
}

interface ThreatIndicator {
  type: 'ip' | 'domain' | 'hash' | 'email' | 'user_agent' | 'file_path' | 'registry_key' | 'mutex' | 'certificate' | 'behavior';
  value: string;
  confidence: number;
  source: string;
  tags: string[];
}

interface MITREAttack {
  tactic: string;
  technique: string;
  subTechnique?: string;
  techniqueId: string;
}

interface AffectedEntity {
  type: 'user' | 'service_account' | 'machine_identity' | 'resource' | 'workspace' | 'tenant';
  id: string;
  name: string;
  impact: 'compromised' | 'targeted' | 'exposed' | 'affected';
}

interface Anomaly {
  id: AnomalyId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  type: AnomalyType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  baseline: BaselineMetrics;
  observed: ObservedMetrics;
  deviation: number;
  confidence: number;
  detectedAt: Date;
  relatedEntities: string[];
  metadata: Record<string, any>;
}

type AnomalyType = 
  | 'auth_velocity' 
  | 'geo_impossible' 
  | 'new_device' 
  | 'new_location' 
  | 'unusual_time' 
  | 'privilege_use' 
  | 'permission_change' 
  | 'secret_access' 
  | 'certificate_anomaly' 
  | 'token_anomaly' 
  | 'api_abuse' 
  | 'data_access' 
  | 'configuration_drift' 
  | 'behavioral_deviation';

interface BaselineMetrics {
  period: string;
  metrics: Record<string, number>;
  sampleSize: number;
}

interface ObservedMetrics {
  timestamp: Date;
  metrics: Record<string, number>;
}

interface SecurityAlert {
  id: SecurityAlertId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  threatId?: ThreatId;
  anomalyId?: AnomalyId;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'firing' | 'acknowledged' | 'investigating' | 'resolved' | 'suppressed' | 'false_positive';
  source: 'threat_detection' | 'anomaly_detection' | 'rule_based' | 'external';
  ruleId?: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  startsAt: Date;
  endsAt?: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: UserId;
  resolvedAt?: Date;
  resolvedBy?: UserId;
  fingerprint: string;
}

interface SecurityIncident {
  id: SecurityIncidentId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  alertIds: SecurityAlertId[];
  threatIds: ThreatId[];
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'containing' | 'eradicating' | 'recovering' | 'closed';
  phase: 'detection' | 'analysis' | 'containment' | 'eradication' | 'recovery' | 'post_incident';
  commander?: UserId;
  responders: UserId[];
  timeline: IncidentTimelineEntry[];
  impact: IncidentImpact;
  rootCause?: string;
  lessonsLearned?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

interface IncidentTimelineEntry {
  timestamp: Date;
  action: string;
  actor: UserId;
  details: string;
  automated: boolean;
}

interface IncidentImpact {
  affectedUsers: number;
  affectedWorkspaces: number;
  affectedResources: string[];
  dataExposed: boolean;
  estimatedCost: number;
  downtime: number;
  regulatoryImpact: string[];
}

interface ResponseAction {
  id: string;
  incidentId: SecurityIncidentId;
  type: 'contain' | 'eradicte' | 'recover' | 'notify' | 'investigate' | 'block' | 'revoke' | 'rotate' | 'isolate' | 'patch';
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';
  automated: boolean;
  executedBy?: UserId;
  executedAt?: Date;
  result?: any;
  error?: string;
}
```

#### 3.3.11 Approvals Domain

```typescript
interface ApprovalRequest {
  id: ApprovalRequestId;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  type: ApprovalType;
  requester: UserId;
  status: 'pending' | 'approved' | 'denied' | 'expired' | 'cancelled' | 'escalated';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  steps: ApprovalStep[];
  currentStep: number;
  expiresAt?: Date;
  decidedAt?: Date;
  decidedBy?: UserId;
  decision?: 'approved' | 'denied';
  comments: ApprovalComment[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type ApprovalType = 
  | 'permission_grant' 
  | 'permission_revoke' 
  | 'role_assignment' 
  | 'role_removal' 
  | 'policy_change' 
  | 'secret_access' 
  | 'certificate_issue' 
  | 'key_rotation' 
  | 'access_review' 
  | 'delegation' 
  | 'recertification' 
  | 'emergency_access' 
  | 'break_glass' 
  | 'compliance_exception';

interface ApprovalStep {
  id: string;
  name: string;
  approvers: Approver[];
  logic: 'any' | 'all' | 'quorum';
  quorum?: number;
  timeout: string;
  escalation?: EscalationPolicy;
  conditions?: PolicyCondition[];
}

interface Approver {
  type: 'user' | 'group' | 'role' | 'manager' | 'owner' | 'security_team';
  identifier: string;
}

interface ApprovalComment {
  id: string;
  author: UserId;
  content: string;
  createdAt: Date;
  type: 'comment' | 'decision' | 'question' | 'clarification';
}

interface EscalationPolicy {
  levels: EscalationLevel[];
  autoEscalate: boolean;
}

interface EscalationLevel {
  level: number;
  timeout: string;
  approvers: Approver[];
  notificationChannels: NotificationChannel[];
}

interface Recertification {
  id: RecertificationId;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  name: string;
  description?: string;
  scope: RecertificationScope;
  schedule: RecertificationSchedule;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  reviewers: UserId[];
  items: RecertificationItem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserId;
  lastRunAt?: Date;
  nextRunAt?: Date;
}

interface RecertificationScope {
  type: 'role' | 'group' | 'user' | 'permission' | 'resource' | 'delegation';
  targets: string[];
  includeInherited: boolean;
  includeDelegated: boolean;
  includeExpired: boolean;
}

interface RecertificationSchedule {
  frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  startDate: Date;
  timezone: string;
  reminderDays: number[];
  gracePeriod: string;
}

interface RecertificationItem {
  id: string;
  recertificationId: RecertificationId;
  subject: Subject;
  permission: PermissionId;
  resource?: string;
  scope: BindingScope;
  currentStatus: 'active' | 'revoked' | 'expired';
  reviewerDecision?: 'certify' | 'revoke' | 'defer';
  reviewedBy?: UserId;
  reviewedAt?: Date;
  justification?: string;
}
```

#### 3.3.12 Federation Domain

```typescript
interface IdentityProvider {
  id: IdentityProviderId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  name: string;
  description?: string;
  type: 'oidc' | 'saml' | 'ldap' | 'scim' | 'custom';
  status: 'active' | 'inactive' | 'testing' | 'error';
  configuration: IdPConfiguration;
  attributeMapping: AttributeMapping;
  provisioning: ProvisioningConfig;
  domains: string[];
  createdAt: Date;
  updatedAt: Date;
  lastSyncAt?: Date;
  lastSyncStatus?: 'success' | 'partial' | 'failed';
}

interface IdPConfiguration {
  // OIDC
  issuer?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userInfoEndpoint?: string;
  jwksUri?: string;
  clientId?: string;
  clientSecret?: string;
  scopes?: string[];
  responseType?: string;
  responseMode?: string;
  pkce?: boolean;
  
  // SAML
  ssoUrl?: string;
  sloUrl?: string;
  entityId?: string;
  certificate?: string;
  nameIdFormat?: string;
  attributeConsumingServiceIndex?: number;
  
  // LDAP
  url?: string;
  bindDn?: string;
  bindPassword?: string;
  baseDn?: string;
  userFilter?: string;
  groupFilter?: string;
  startTls?: boolean;
  
  // SCIM
  scimEndpoint?: string;
  scimToken?: string;
  scimVersion?: '1.1' | '2.0';
}

interface AttributeMapping {
  userId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  groups: string;
  roles: string;
  phone: string;
  department: string;
  title: string;
  manager: string;
  costCenter: string;
  custom: Record<string, string>;
}

interface ProvisioningConfig {
  enabled: boolean;
  mode: 'jit' | 'scim' | 'manual';
  createUsers: boolean;
  updateUsers: boolean;
  deleteUsers: boolean;
  createGroups: boolean;
  updateGroups: boolean;
  deleteGroups: boolean;
  defaultRole?: RoleId;
  defaultGroups?: GroupId[];
  attributeSync: boolean;
  syncSchedule?: CronExpression;
}

interface SyncJob {
  id: SyncJobId;
  identityProviderId: IdentityProviderId;
  type: 'full' | 'incremental' | 'delta';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  stats: SyncStats;
  errors: SyncError[];
  triggeredBy: 'schedule' | 'manual' | 'webhook';
}

interface SyncStats {
  usersCreated: number;
  usersUpdated: number;
  usersDeleted: number;
  usersSkipped: number;
  groupsCreated: number;
  groupsUpdated: number;
  groupsDeleted: number;
  groupsSkipped: number;
  membershipsCreated: number;
  membershipsUpdated: number;
  membershipsDeleted: number;
}

interface SyncError {
  entityType: 'user' | 'group' | 'membership';
  entityId: string;
  error: string;
  timestamp: Date;
}
```

#### 3.3.13 Rate Limiting Domain

```typescript
interface RateLimitRule {
  id: RateLimitRuleId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  name: string;
  description?: string;
  scope: RateLimitScope;
  algorithm: 'fixed_window' | 'sliding_window' | 'token_bucket' | 'leaky_bucket' | 'sliding_log';
  limit: number;
  window: string;
  keyExtractor: KeyExtractor;
  action: 'reject' | 'throttle' | 'queue' | 'challenge' | 'log_only';
  responseHeaders: boolean;
  bypassConditions?: PolicyCondition[];
  priority: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RateLimitScope {
  type: 'global' | 'tenant' | 'workspace' | 'user' | 'service_account' | 'ip' | 'api_key' | 'endpoint' | 'custom';
  resource?: string;
  method?: string;
  path?: string;
}

interface KeyExtractor {
  type: 'header' | 'query' | 'claim' | 'ip' | 'user_id' | 'api_key' | 'custom';
  name?: string;
  claim?: string;
  customFunction?: string;
}

interface Quota {
  id: QuotaId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  name: string;
  description?: string;
  resource: string;
  limit: number;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  currentUsage: number;
  resetAt: Date;
  warningThreshold: number;
  criticalThreshold: number;
  actions: QuotaAction[];
  createdAt: Date;
  updatedAt: Date;
}

interface QuotaAction {
  threshold: number;
  action: 'notify' | 'throttle' | 'reject' | 'disable' | 'auto_scale';
  notificationChannels: NotificationChannel[];
}

interface RateLimitMetrics {
  ruleId: RateLimitRuleId;
  key: string;
  currentCount: number;
  limit: number;
  remaining: number;
  resetAt: Date;
  exceeded: boolean;
  rejectedCount: number;
}
```

---

## 4. Core Services (Detailed)

### 4.1 Identity Service

```typescript
interface IdentityService {
  // User lifecycle
  createUser(input: CreateUserInput): Promise<User>;
  getUser(id: UserId): Promise<User | null>;
  updateUser(id: UserId, updates: UserUpdates): Promise<User>;
  deleteUser(id: UserId, options: DeleteOptions): Promise<void>;
  listUsers(query: UserQuery): Promise<PaginatedResult<User>>;
  
  // Identity management
  linkIdentity(userId: UserId, input: LinkIdentityInput): Promise<Identity>;
  unlinkIdentity(userId: UserId, identityId: IdentityId): Promise<void>;
  getIdentities(userId: UserId): Promise<Identity[]>;
  setPrimaryIdentity(userId: UserId, identityId: IdentityId): Promise<void>;
  
  // Group management
  createGroup(input: CreateGroupInput): Promise<Group>;
  getGroup(id: GroupId): Promise<Group | null>;
  updateGroup(id: GroupId, updates: GroupUpdates): Promise<Group>;
  deleteGroup(id: GroupId): Promise<void>;
  listGroups(query: GroupQuery): Promise<PaginatedResult<Group>>;
  addMember(groupId: GroupId, member: GroupMember): Promise<GroupMembership>;
  removeMember(groupId: GroupId, memberId: string): Promise<void>;
  getMembers(groupId: GroupId): Promise<GroupMembership[]>;
  getMemberships(memberId: string, memberType: string): Promise<GroupMembership[]>;
  
  // Service accounts
  createServiceAccount(input: CreateServiceAccountInput): Promise<ServiceAccount>;
  getServiceAccount(id: ServiceAccountId): Promise<ServiceAccount | null>;
  updateServiceAccount(id: ServiceAccountId, updates: ServiceAccountUpdates): Promise<ServiceAccount>;
  deleteServiceAccount(id: ServiceAccountId): Promise<void>;
  listServiceAccounts(query: ServiceAccountQuery): Promise<PaginatedResult<ServiceAccount>>;
  rotateServiceAccountKey(id: ServiceAccountId): Promise<APIKey>;
  
  // Machine identities
  createMachineIdentity(input: CreateMachineIdentityInput): Promise<MachineIdentity>;
  getMachineIdentity(id: MachineIdentityId): Promise<MachineIdentity | null>;
  updateMachineIdentity(id: MachineIdentityId, updates: MachineIdentityUpdates): Promise<MachineIdentity>;
  deleteMachineIdentity(id: MachineIdentityId): Promise<void>;
  listMachineIdentities(query: MachineIdentityQuery): Promise<PaginatedResult<MachineIdentity>>;
  attestMachineIdentity(id: MachineIdentityId, attestation: AttestationData): Promise<void>;
  
  // Identity linking
  linkExternalIdentity(userId: UserId, provider: IdentityProviderType, providerId: string, data: any): Promise<IdentityLink>;
  unlinkExternalIdentity(userId: UserId, linkId: IdentityLinkId): Promise<void>;
  getExternalLinks(userId: UserId): Promise<IdentityLink[]>;
  
  // Provisioning
  provisionUser(input: ProvisionUserInput): Promise<ProvisionResult>;
  deprovisionUser(userId: UserId, options: DeprovisionOptions): Promise<void>;
  syncIdentityProvider(idpId: IdentityProviderId): Promise<SyncJob>;
}
```

### 4.2 Authentication Service

```typescript
interface AuthenticationService {
  // Core authentication
  authenticate(input: AuthenticateInput): Promise<AuthResult>;
  authenticateWithMFA(input: MFAAuthenticateInput): Promise<AuthResult>;
  challengeMFA(sessionId: SessionId, method: MFAMethod): Promise<MFAChallenge>;
  verifyMFA(input: MFAVerifyInput): Promise<AuthResult>;
  
  // Session management
  createSession(input: CreateSessionInput): Promise<Session>;
  getSession(id: SessionId): Promise<Session | null>;
  updateSession(id: SessionId, updates: SessionUpdates): Promise<Session>;
  revokeSession(id: SessionId, reason: string): Promise<void>;
  revokeAllUserSessions(userId: UserId, except?: SessionId): Promise<void>;
  listSessions(query: SessionQuery): Promise<PaginatedResult<Session>>;
  
  // Device management
  registerDevice(input: RegisterDeviceInput): Promise<DeviceInfo>;
  getDevice(id: string): Promise<DeviceInfo | null>;
  updateDevice(id: string, updates: DeviceUpdates): Promise<DeviceInfo>;
  revokeDevice(id: string): Promise<void>;
  listDevices(userId: UserId): Promise<DeviceInfo[]>;
  trustDevice(deviceId: string): Promise<void>;
  
  // MFA management
  registerMFADevice(userId: UserId, input: RegisterMFAInput): Promise<MFADevice>;
  getMFADevice(id: MFADeviceId): Promise<MFADevice | null>;
  updateMFADevice(id: MFADeviceId, updates: MFADeviceUpdates): Promise<MFADevice>;
  deleteMFADevice(id: MFADeviceId): Promise<void>;
  listMFADevices(userId: UserId): Promise<MFADevice[]>;
  generateBackupCodes(userId: UserId, count: number): Promise<RecoveryCode[]>;
  verifyBackupCode(userId: UserId, code: string): Promise<boolean>;
  
  // Passkeys
  registerPasskey(userId: UserId, input: RegisterPasskeyInput): Promise<Passkey>;
  getPasskey(id: PasskeyId): Promise<Passkey | null>;
  deletePasskey(id: PasskeyId): Promise<void>;
  listPasskeys(userId: UserId): Promise<Passkey[]>;
  authenticateWithPasskey(input: PasskeyAuthInput): Promise<AuthResult>;
  
  // Recovery
  generateRecoveryCodes(userId: UserId): Promise<RecoveryCode[]>;
  verifyRecoveryCode(userId: UserId, code: string): Promise<AuthResult>;
  
  // Risk assessment
  assessRisk(context: AuthenticationContext): Promise<RiskAssessment>;
  getRiskIndicators(context: AuthenticationContext): Promise<RiskIndicator[]>;
  
  // Login attempts
  recordLoginAttempt(attempt: LoginAttempt): Promise<void>;
  getLoginAttempts(query: LoginAttemptQuery): Promise<PaginatedResult<LoginAttempt>>;
  getFailedLoginStats(tenantId: TenantId, window: TimeWindow): Promise<LoginStats>;
  
  // Protocol endpoints
  handleOIDCAuthorization(request: OIDCAuthRequest): Promise<OIDCAuthResponse>;
  handleOIDCToken(request: OIDCTokenRequest): Promise<OIDCTokenResponse>;
  handleSAMLAuthnRequest(request: SAMLAuthnRequest): Promise<SAMLResponse>;
  handleSAMLArtifactResolve(request: SAMLArtifactResolve): Promise<SAMLResponse>;
  handleLDAPBind(request: LDAPBindRequest): Promise<LDAPBindResponse>;
  handleWebAuthnRegistration(request: WebAuthnRegistrationRequest): Promise<WebAuthnRegistrationResponse>;
  handleWebAuthnAuthentication(request: WebAuthnAuthenticationRequest): Promise<WebAuthnAuthenticationResponse>;
}
```

### 4.3 Authorization Service

```typescript
interface AuthorizationService {
  // Permission resolution
  checkPermission(request: AuthorizationRequest): Promise<AuthorizationDecision>;
  checkPermissions(requests: AuthorizationRequest[]): Promise<AuthorizationDecision[]>;
  getEffectivePermissions(subject: Subject, scope: BindingScope): Promise<Permission[]>;
  getPermissionsForResource(resource: Resource, subject: Subject): Promise<Permission[]>;
  
  // Role management
  createRole(input: CreateRoleInput): Promise<Role>;
  getRole(id: RoleId): Promise<Role | null>;
  updateRole(id: RoleId, updates: RoleUpdates): Promise<Role>;
  deleteRole(id: RoleId): Promise<void>;
  listRoles(query: RoleQuery): Promise<PaginatedResult<Role>>;
  addPermissionToRole(roleId: RoleId, permissionId: PermissionId): Promise<void>;
  removePermissionFromRole(roleId: RoleId, permissionId: PermissionId): Promise<void>;
  addRoleInheritance(parentId: RoleId, childId: RoleId): Promise<void>;
  removeRoleInheritance(parentId: RoleId, childId: RoleId): Promise<void>;
  getRoleHierarchy(roleId: RoleId): Promise<RoleHierarchy>;
  
  // Permission management
  createPermission(input: CreatePermissionInput): Promise<Permission>;
  getPermission(id: PermissionId): Promise<Permission | null>;
  updatePermission(id: PermissionId, updates: PermissionUpdates): Promise<Permission>;
  deletePermission(id: PermissionId): Promise<void>;
  listPermissions(query: PermissionQuery): Promise<PaginatedResult<Permission>>;
  
  // Policy bindings
  createPolicyBinding(input: CreatePolicyBindingInput): Promise<PolicyBinding>;
  getPolicyBinding(id: PolicyBindingId): Promise<PolicyBinding | null>;
  updatePolicyBinding(id: PolicyBindingId, updates: PolicyBindingUpdates): Promise<PolicyBinding>;
  deletePolicyBinding(id: PolicyBindingId): Promise<void>;
  listPolicyBindings(query: PolicyBindingQuery): Promise<PaginatedResult<PolicyBinding>>;
  getBindingsForSubject(subject: Subject): Promise<PolicyBinding[]>;
  getBindingsForResource(resource: Resource): Promise<PolicyBinding[]>;
  
  // Role bindings
  createRoleBinding(input: CreateRoleBindingInput): Promise<RoleBinding>;
  getRoleBinding(id: string): Promise<RoleBinding | null>;
  updateRoleBinding(id: string, updates: RoleBindingUpdates): Promise<RoleBinding>;
  deleteRoleBinding(id: string): Promise<void>;
  listRoleBindings(query: RoleBindingQuery): Promise<PaginatedResult<RoleBinding>>;
  
  // Delegations
  createDelegation(input: CreateDelegationInput): Promise<Delegation>;
  getDelegation(id: DelegationId): Promise<Delegation | null>;
  updateDelegation(id: DelegationId, updates: DelegationUpdates): Promise<Delegation>;
  revokeDelegation(id: DelegationId, revokedBy: UserId): Promise<void>;
  listDelegations(query: DelegationQuery): Promise<PaginatedResult<Delegation>>;
  getDelegationsForUser(userId: UserId): Promise<Delegation[]>;
  getDelegationsByUser(userId: UserId): Promise<Delegation[]>;
  
  // Access reviews
  createAccessReview(input: CreateAccessReviewInput): Promise<AccessReview>;
  getAccessReview(id: AccessReviewId): Promise<AccessReview | null>;
  updateAccessReview(id: AccessReviewId, updates: AccessReviewUpdates): Promise<AccessReview>;
  startAccessReview(id: AccessReviewId): Promise<void>;
  completeAccessReview(id: AccessReviewId): Promise<void>;
  listAccessReviews(query: AccessReviewQuery): Promise<PaginatedResult<AccessReview>>;
  decideReviewItem(reviewId: AccessReviewId, itemId: string, decision: ReviewDecision): Promise<void>;
  bulkDecideReviewItems(reviewId: AccessReviewId, decisions: ReviewItemDecision[]): Promise<void>;
  
  // Recertification
  createRecertification(input: CreateRecertificationInput): Promise<Recertification>;
  getRecertification(id: RecertificationId): Promise<Recertification | null>;
  updateRecertification(id: RecertificationId, updates: RecertificationUpdates): Promise<Recertification>;
  runRecertification(id: RecertificationId): Promise<RecertificationRun>;
  listRecertifications(query: RecertificationQuery): Promise<PaginatedResult<Recertification>>;
}
```

### 4.4 Policy Engine

```typescript
interface PolicyEngine {
  // Policy lifecycle
  createPolicy(input: CreatePolicyInput): Promise<Policy>;
  getPolicy(id: PolicyId): Promise<Policy | null>;
  updatePolicy(id: PolicyId, updates: PolicyUpdates): Promise<Policy>;
  deletePolicy(id: PolicyId): Promise<void>;
  listPolicies(query: PolicyQuery): Promise<PaginatedResult<Policy>>;
  
  // Policy versions
  createPolicyVersion(policyId: PolicyId, input: CreatePolicyVersionInput): Promise<PolicyVersion>;
  getPolicyVersion(policyId: PolicyId, version: string): Promise<PolicyVersion | null>;
  listPolicyVersions(policyId: PolicyId): Promise<PolicyVersion[]>;
  promotePolicyVersion(policyId: PolicyId, version: string): Promise<void>;
  deprecatePolicyVersion(policyId: PolicyId, version: string): Promise<void>;
  
  // Policy compilation
  compilePolicy(policyId: PolicyId): Promise<CompiledPolicy>;
  validatePolicy(policy: Policy): Promise<ValidationResult>;
  optimizePolicy(policy: Policy): Promise<OptimizedPolicy>;
  getCompiledPolicy(policyId: PolicyId): Promise<CompiledPolicy | null>;
  
  // Policy evaluation
  evaluate(request: EvaluationRequest): Promise<PolicyEvaluation>;
  evaluateBatch(requests: EvaluationRequest[]): Promise<PolicyEvaluation[]>;
  getEvaluation(id: EvaluationId): Promise<PolicyEvaluation | null>;
  listEvaluations(query: EvaluationQuery): Promise<PaginatedResult<PolicyEvaluation>>;
  
  // Simulation
  simulate(input: SimulationInput): Promise<PolicySimulation>;
  getSimulation(id: SimulationId): Promise<PolicySimulation | null>;
  listSimulations(query: SimulationQuery): Promise<PaginatedResult<PolicySimulation>>;
  
  // Testing
  createPolicyTest(input: CreatePolicyTestInput): Promise<PolicyTest>;
  getPolicyTest(id: string): Promise<PolicyTest | null>;
  updatePolicyTest(id: string, updates: PolicyTestUpdates): Promise<PolicyTest>;
  runPolicyTest(id: string): Promise<TestRunResult>;
  listPolicyTests(policyId: PolicyId): Promise<PolicyTest[]>;
  
  // Rule management
  addRule(policyId: PolicyId, rule: Rule): Promise<Rule>;
  updateRule(policyId: PolicyId, ruleId: RuleId, updates: RuleUpdates): Promise<Rule>;
  removeRule(policyId: PolicyId, ruleId: RuleId): Promise<void>;
  reorderRules(policyId: PolicyId, ruleIds: RuleId[]): Promise<void>;
  
  // Decision caching
  getCacheStats(): Promise<CacheStats>;
  clearCache(pattern?: string): Promise<void>;
  warmCache(requests: EvaluationRequest[]): Promise<void>;
}

interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
  evictionRate: number;
  avgLatencyMs: number;
}
```

### 4.5 Secrets Service

```typescript
interface SecretsService {
  // Vault management
  createVault(input: CreateVaultInput): Promise<Vault>;
  getVault(id: VaultId): Promise<Vault | null>;
  updateVault(id: VaultId, updates: VaultUpdates): Promise<Vault>;
  deleteVault(id: VaultId): Promise<void>;
  listVaults(query: VaultQuery): Promise<PaginatedResult<Vault>>;
  testVaultConnection(id: VaultId): Promise<ConnectionTestResult>;
  syncVault(id: VaultId): Promise<SyncResult>;
  
  // Secret management
  createSecret(input: CreateSecretInput): Promise<Secret>;
  getSecret(id: SecretId): Promise<Secret | null>;
  getSecretValue(id: SecretId, version?: number): Promise<SecretValue>;
  updateSecret(id: SecretId, updates: SecretUpdates): Promise<Secret>;
  deleteSecret(id: SecretId, options: DeleteOptions): Promise<void>;
  listSecrets(query: SecretQuery): Promise<PaginatedResult<Secret>>;
  destroySecretVersion(id: SecretId, version: number): Promise<void>;
  undeleteSecretVersion(id: SecretId, version: number): Promise<void>;
  
  // Secret versions
  createSecretVersion(secretId: SecretId, value: string, metadata?: Record<string, any>): Promise<SecretVersion>;
  getSecretVersion(secretId: SecretId, version: number): Promise<SecretVersion | null>;
  listSecretVersions(secretId: SecretId): Promise<SecretVersion[]>;
  promoteSecretVersion(secretId: SecretId, version: number): Promise<void>;
  
  // Rotation
  createRotationPolicy(input: CreateRotationPolicyInput): Promise<RotationPolicy>;
  getRotationPolicy(id: RotationPolicyId): Promise<RotationPolicy | null>;
  updateRotationPolicy(id: RotationPolicyId, updates: RotationPolicyUpdates): Promise<RotationPolicy>;
  deleteRotationPolicy(id: RotationPolicyId): Promise<void>;
  listRotationPolicies(query: RotationPolicyQuery): Promise<PaginatedResult<RotationPolicy>>;
  rotateSecret(secretId: SecretId): Promise<RotationResult>;
  rotateSecretVersion(secretId: SecretId): Promise<SecretVersion>;
  scheduleRotation(secretId: SecretId, schedule: CronExpression): Promise<void>;
  cancelScheduledRotation(secretId: SecretId): Promise<void>;
  
  // Leases
  createLeasePolicy(input: CreateLeasePolicyInput): Promise<LeasePolicy>;
  getLeasePolicy(id: LeasePolicyId): Promise<LeasePolicy | null>;
  updateLeasePolicy(id: LeasePolicyId, updates: LeasePolicyUpdates): Promise<LeasePolicy>;
  deleteLeasePolicy(id: LeasePolicyId): Promise<void>;
  listLeasePolicies(query: LeasePolicyQuery): Promise<PaginatedResult<LeasePolicy>>;
  createLease(secretId: SecretId, input: CreateLeaseInput): Promise<Lease>;
  getLease(id: LeaseId): Promise<Lease | null>;
  renewLease(id: LeaseId, increment: string): Promise<Lease>;
  revokeLease(id: LeaseId, revokedBy: string): Promise<void>;
  listLeases(query: LeaseQuery): Promise<PaginatedResult<Lease>>;
  revokeLeasesForSecret(secretId: SecretId): Promise<void>;
  
  // Dynamic secrets
  createDynamicSecret(input: CreateDynamicSecretInput): Promise<DynamicSecret>;
  getDynamicSecret(id: DynamicSecretId): Promise<DynamicSecret | null>;
  updateDynamicSecret(id: DynamicSecretId, updates: DynamicSecretUpdates): Promise<DynamicSecret>;
  deleteDynamicSecret(id: DynamicSecretId): Promise<void>;
  listDynamicSecrets(query: DynamicSecretQuery): Promise<PaginatedResult<DynamicSecret>>;
  generateDynamicSecretCredentials(id: DynamicSecretId, leasePolicy?: LeasePolicyId): Promise<DynamicSecretCredentials>;
  
  // Access auditing
  recordAccess(input: RecordAccessInput): Promise<void>;
  getAccessLog(query: AccessLogQuery): Promise<PaginatedResult<SecretAccess>>;
  getAccessStats(secretId: SecretId, window: TimeWindow): Promise<AccessStats>;
}
```

### 4.6 Certificate Service

```typescript
interface CertificateService {
  // CA management
  createCA(input: CreateCAInput): Promise<CA>;
  getCA(id: CAId): Promise<CA | null>;
  updateCA(id: CAId, updates: CAUpdates): Promise<CA>;
  deleteCA(id: CAId): Promise<void>;
  listCAs(query: CAQuery): Promise<PaginatedResult<CA>>;
  getCACertificate(id: CAId): Promise<Certificate>;
  exportCA(id: CAId, format: 'pem' | 'der' | 'pkcs12', password?: string): Promise<Buffer>;
  
  // Certificate lifecycle
  issueCertificate(input: IssueCertificateInput): Promise<Certificate>;
  getCertificate(id: CertificateId): Promise<Certificate | null>;
  revokeCertificate(id: CertificateId, reason: RevocationReason, revokedBy: UserId): Promise<void>;
  renewCertificate(id: CertificateId): Promise<Certificate>;
  listCertificates(query: CertificateQuery): Promise<PaginatedResult<Certificate>>;
  getExpiringCertificates(window: TimeWindow): Promise<Certificate[]>;
  getCertificateChain(id: CertificateId): Promise<Certificate[]>;
  
  // Trust bundles
  createTrustBundle(input: CreateTrustBundleInput): Promise<TrustBundle>;
  getTrustBundle(id: TrustBundleId): Promise<TrustBundle | null>;
  updateTrustBundle(id: TrustBundleId, updates: TrustBundleUpdates): Promise<TrustBundle>;
  deleteTrustBundle(id: TrustBundleId): Promise<void>;
  listTrustBundles(query: TrustBundleQuery): Promise<PaginatedResult<TrustBundle>>;
  exportTrustBundle(id: TrustBundleId, format: 'pem' | 'der' | 'jwk' | 'spiffe'): Promise<Buffer>;
  
  // SPIFFE
  createSPIFFEIdentity(input: CreateSPIFFEIdentityInput): Promise<SPIFFEIdentity>;
  getSPIFFEIdentity(id: SPIFFEId): Promise<SPIFFEIdentity | null>;
  updateSPIFFEIdentity(id: SPIFFEId, updates: SPIFFEIdentityUpdates): Promise<SPIFFEIdentity>;
  deleteSPIFFEIdentity(id: SPIFFEId): Promise<void>;
  listSPIFFEIdentities(query: SPIFFEIdentityQuery): Promise<PaginatedResult<SPIFFEIdentity>>;
  rotateSPIFFEIdentity(id: SPIFFEId): Promise<SPIFFEIdentity>;
  
  // mTLS
  createMTLSConfig(input: CreateMTLSConfigInput): Promise<mTLSConfig>;
  getMTLSConfig(id: string): Promise<mTLSConfig | null>;
  updateMTLSConfig(id: string, updates: MTLSConfigUpdates): Promise<mTLSConfig>;
  deleteMTLSConfig(id: string): Promise<void>;
  listMTLSConfigs(query: MTLSConfigQuery): Promise<PaginatedResult<mTLSConfig>>;
  
  // Revocation lists
  publishCRL(caId: CAId): Promise<RevocationList>;
  getCRL(caId: CAId): Promise<RevocationList | null>;
  publishOCSPResponse(caId: CAId, serialNumber: string): Promise<OCSPResponse>;
  checkRevocation(serialNumber: string, caId: CAId): Promise<RevocationStatus>;
  
  // Verification
  verifyCertificate(cert: Buffer, trustBundleId?: TrustBundleId): Promise<VerificationResult>;
  verifyChain(chain: Buffer[]): Promise<ChainVerificationResult>;
}
```

### 4.7 Key Service

```typescript
interface KeyService {
  // KMS key management
  createKMSKey(input: CreateKMSKeyInput): Promise<KMSKey>;
  getKMSKey(id: KMSKeyId): Promise<KMSKey | null>;
  updateKMSKey(id: KMSKeyId, updates: KMSKeyUpdates): Promise<KMSKey>;
  deleteKMSKey(id: KMSKeyId, options: DeleteKeyOptions): Promise<void>;
  listKMSKeys(query: KMSKeyQuery): Promise<PaginatedResult<KMSKey>>;
  enableKMSKey(id: KMSKeyId): Promise<void>;
  disableKMSKey(id: KMSKeyId): Promise<void>;
  scheduleKMSKeyDeletion(id: KMSKeyId, days: number): Promise<void>;
  cancelKMSKeyDeletion(id: KMSKeyId): Promise<void>;
  importKeyMaterial(id: KMSKeyId, material: KeyMaterial): Promise<void>;
  
  // Key rotation
  createRotationPolicy(input: CreateKeyRotationPolicyInput): Promise<KeyRotationPolicy>;
  getRotationPolicy(id: KeyRotationPolicyId): Promise<KeyRotationPolicy | null>;
  updateRotationPolicy(id: KeyRotationPolicyId, updates: KeyRotationPolicyUpdates): Promise<KeyRotationPolicy>;
  deleteRotationPolicy(id: KeyRotationPolicyId): Promise<void>;
  listRotationPolicies(query: KeyRotationPolicyQuery): Promise<PaginatedResult<KeyRotationPolicy>>;
  rotateKMSKey(id: KMSKeyId): Promise<RotationResult>;
  scheduleRotation(id: KMSKeyId, schedule: CronExpression): Promise<void>;
  
  // Encryption keys
  createEncryptionKey(input: CreateEncryptionKeyInput): Promise<EncryptionKey>;
  getEncryptionKey(id: EncryptionKeyId): Promise<EncryptionKey | null>;
  updateEncryptionKey(id: EncryptionKeyId, updates: EncryptionKeyUpdates): Promise<EncryptionKey>;
  deleteEncryptionKey(id: EncryptionKeyId): Promise<void>;
  listEncryptionKeys(query: EncryptionKeyQuery): Promise<PaginatedResult<EncryptionKey>>;
  createEncryptionKeyVersion(keyId: EncryptionKeyId): Promise<KeyVersion>;
  promoteEncryptionKeyVersion(keyId: EncryptionKeyId, version: number): Promise<void>;
  
  // Signing keys
  createSigningKey(input: CreateSigningKeyInput): Promise<SigningKey>;
  getSigningKey(id: SigningKeyId): Promise<SigningKey | null>;
  updateSigningKey(id: SigningKeyId, updates: SigningKeyUpdates): Promise<SigningKey>;
  deleteSigningKey(id: SigningKeyId): Promise<void>;
  listSigningKeys(query: SigningKeyQuery): Promise<PaginatedResult<SigningKey>>;
  createSigningKeyVersion(keyId: SigningKeyId): Promise<KeyVersion>;
  promoteSigningKeyVersion(keyId: SigningKeyId, version: number): Promise<void>;
  
  // Cryptographic operations
  encrypt(keyId: EncryptionKeyId, plaintext: Uint8Array, context: EncryptionContext): Promise<EncryptedData>;
  decrypt(keyId: EncryptionKeyId, encrypted: EncryptedData, context: EncryptionContext): Promise<Uint8Array>;
  reencrypt(keyId: EncryptionKeyId, encrypted: EncryptedData, context: EncryptionContext): Promise<EncryptedData>;
  sign(keyId: SigningKeyId, data: Uint8Array, algorithm: SigningAlgorithm): Promise<Signature>;
  verify(keyId: SigningKeyId, data: Uint8Array, signature: Signature, algorithm: SigningAlgorithm): Promise<boolean>;
  
  // Key hierarchy
  createKeyHierarchy(input: CreateKeyHierarchyInput): Promise<KeyHierarchy>;
  getKeyHierarchy(id: string): Promise<KeyHierarchy | null>;
  updateKeyHierarchy(id: string, updates: KeyHierarchyUpdates): Promise<KeyHierarchy>;
  deleteKeyHierarchy(id: string): Promise<void>;
  deriveDataKey(hierarchyId: string, purpose: string): Promise<EncryptionKey>;
  
  // Envelope encryption
  envelopeEncrypt(data: Uint8Array, context: EncryptionContext): Promise<EncryptedData>;
  envelopeDecrypt(encrypted: EncryptedData, context: EncryptionContext): Promise<Uint8Array>;
  
  // Key usage auditing
  getKeyUsage(keyId: KMSKeyId, window: TimeWindow): Promise<KeyUsageStats>;
  getKeyAccessLog(keyId: KMSKeyId, query: AccessLogQuery): Promise<PaginatedResult<KeyAccess>>;
}

interface Signature {
  algorithm: SigningAlgorithm;
  value: Uint8Array;
  keyId: SigningKeyId;
  version: number;
  timestamp: Date;
}

interface KeyUsageStats {
  encryptOperations: number;
  decryptOperations: number;
  signOperations: number;
  verifyOperations: number;
  totalBytesProcessed: number;
  errorCount: number;
  avgLatencyMs: number;
}
```

### 4.8 Token Service

```typescript
interface TokenService {
  // Token issuance
  issueAccessToken(input: IssueAccessTokenInput): Promise<AccessToken>;
  issueRefreshToken(input: IssueRefreshTokenInput): Promise<RefreshToken>;
  issueIDToken(input: IssueIDTokenInput): Promise<IDToken>;
  issueTokenPair(input: IssueTokenPairInput): Promise<TokenPair>;
  
  // Token validation
  validateAccessToken(token: string): Promise<TokenValidationResult>;
  validateRefreshToken(token: string): Promise<TokenValidationResult>;
  validateIDToken(token: string): Promise<TokenValidationResult>;
  introspectToken(request: TokenIntrospectionRequest): Promise<TokenIntrospectionResponse>;
  
  // Token revocation
  revokeAccessToken(tokenId: AccessTokenId, revokedBy: string, reason: string): Promise<void>;
  revokeRefreshToken(tokenId: RefreshTokenId, revokedBy: string, reason: string): Promise<void>;
  revokeTokenFamily(refreshTokenId: RefreshTokenId): Promise<void>;
  revokeAllUserTokens(userId: UserId, workspaceId?: WorkspaceId): Promise<void>;
  
  // Token exchange
  exchangeToken(request: TokenExchangeRequest): Promise<TokenExchangeResponse>;
  
  // JWKS
  getJWKS(tenantId: TenantId, workspaceId?: WorkspaceId): Promise<JWKS>;
  rotateSigningKey(tenantId: TenantId, workspaceId?: WorkspaceId): Promise<JWK>;
  getSigningKeys(tenantId: TenantId, workspaceId?: WorkspaceId): Promise<JWK[]>;
  
  // DPoP
  validateDPoPProof(proof: DPoPProof, htu: string, htm: string): Promise<DPoPValidationResult>;
  createDPoPProof(input: CreateDPoPProofInput): Promise<DPoPProof>;
  
  // Claims
  getStandardClaims(): TokenClaimsSchema;
  registerCustomClaim(claim: CustomClaim): Promise<void>;
  unregisterCustomClaim(name: string): Promise<void>;
  listCustomClaims(): Promise<CustomClaim[]>;
  
  // Token metadata
  getTokenMetadata(tokenId: AccessTokenId | RefreshTokenId): Promise<TokenMetadata>;
  listTokens(query: TokenQuery): Promise<PaginatedResult<TokenMetadata>>;
}

interface TokenPair {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  idToken?: IDToken;
  expiresIn: number;
  tokenType: 'Bearer';
}

interface TokenValidationResult {
  valid: boolean;
  claims?: TokenClaims;
  error?: string;
  errorCode?: string;
}

interface DPoPValidationResult {
  valid: boolean;
  publicKey?: string;
  error?: string;
}

interface TokenMetadata {
  id: string;
  type: 'access' | 'refresh' | 'id';
  subject: Subject;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  scopes: string[];
  clientId?: string;
}

interface CustomClaim {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  validator?: string;
}
```

### 4.9 Session Service

```typescript
interface SessionService {
  // Session lifecycle
  createSession(input: CreateSessionInput): Promise<Session>;
  getSession(id: SessionId): Promise<Session | null>;
  updateSession(id: SessionId, updates: SessionUpdates): Promise<Session>;
  extendSession(id: SessionId, duration: string): Promise<Session>;
  revokeSession(id: SessionId, revokedBy: UserId, reason: string): Promise<void>;
  revokeAllUserSessions(userId: UserId, except?: SessionId): Promise<void>;
  
  // Session queries
  getActiveSessions(userId: UserId): Promise<Session[]>;
  getSessionsByDevice(deviceId: string): Promise<Session[]>;
  getSessionsByIP(ipAddress: string): Promise<Session[]>;
  listSessions(query: SessionQuery): Promise<PaginatedResult<Session>>;
  getSessionStats(tenantId: TenantId, window: TimeWindow): Promise<SessionStats>;
  
  // Device management
  registerDevice(input: RegisterDeviceInput): Promise<DeviceInfo>;
  getDevice(id: string): Promise<DeviceInfo | null>;
  updateDevice(id: string, updates: DeviceUpdates): Promise<DeviceInfo>;
  revokeDevice(id: string): Promise<void>;
  trustDevice(id: string): Promise<void>;
  listUserDevices(userId: UserId): Promise<DeviceInfo[]>;
  getDeviceFingerprint(deviceId: string): Promise<DeviceFingerprint>;
  
  // Concurrent session limits
  checkConcurrentLimit(userId: UserId, workspaceId: WorkspaceId): Promise<ConcurrentLimitResult>;
  setConcurrentLimit(workspaceId: WorkspaceId, limit: number): Promise<void>;
  getConcurrentLimit(workspaceId: WorkspaceId): Promise<number>;
  
  // Risk assessment
  assessSessionRisk(sessionId: SessionId): Promise<SessionRiskAssessment>;
  updateSessionRisk(sessionId: SessionId, riskScore: number, indicators: RiskIndicator[]): Promise<void>;
  
  // Session cleanup
  cleanupExpiredSessions(): Promise<CleanupResult>;
  cleanupIdleSessions(idleTimeout: string): Promise<CleanupResult>;
  scheduleCleanup(schedule: CronExpression): Promise<void>;
}

interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  idleSessions: number;
  expiredSessions: number;
  revokedSessions: number;
  uniqueUsers: number;
  uniqueDevices: number;
  avgSessionDuration: number;
  mfaEnabledSessions: number;
}

interface DeviceFingerprint {
  deviceId: string;
  components: FingerprintComponent[];
  stability: number;
  firstSeen: Date;
  lastSeen: Date;
}

interface FingerprintComponent {
  name: string;
  value: string;
  entropy: number;
}

interface ConcurrentLimitResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  oldestSession?: SessionId;
}

interface SessionRiskAssessment {
  sessionId: SessionId;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  indicators: RiskIndicator[];
  recommendations: string[];
  requiresMFA: boolean;
  requiresReauth: boolean;
}

interface CleanupResult {
  expiredRemoved: number;
  idleRemoved: number;
  errors: string[];
}
```

### 4.10 Audit Service

```typescript
interface AuditService {
  // Audit logging
  logEvent(event: AuditEventInput): Promise<AuditEvent>;
  logEvents(events: AuditEventInput[]): Promise<AuditEvent[]>;
  
  // Query
  getEvent(id: AuditEventId): Promise<AuditEvent | null>;
  queryEvents(query: AuditQuery): Promise<PaginatedResult<AuditEvent>>;
  getEventsByTrace(traceId: string): Promise<AuditEvent[]>;
  getEventsByResource(resource: string, resourceId: string, window: TimeWindow): Promise<AuditEvent[]>;
  getEventsByPrincipal(principalId: string, window: TimeWindow): Promise<AuditEvent[]>;
  
  // Integrity
  verifyIntegrity(chainId: IntegrityChainId): Promise<IntegrityVerificationResult>;
  verifyEventIntegrity(eventId: AuditEventId): Promise<boolean>;
  createIntegrityChain(window: TimeWindow): Promise<IntegrityChain>;
  getIntegrityChains(query: IntegrityChainQuery): Promise<PaginatedResult<IntegrityChain>>;
  exportIntegrityProof(chainId: IntegrityChainId): Promise<IntegrityProof>;
  
  // Export
  exportEvents(query: AuditQuery, format: 'json' | 'csv' | 'cef' | 'leef'): Promise<ExportResult>;
  scheduleExport(schedule: ExportSchedule): Promise<ExportJob>;
  getExportJob(id: string): Promise<ExportJob | null>;
  listExportJobs(query: ExportJobQuery): Promise<PaginatedResult<ExportJob>>;
  
  // Retention
  applyRetentionPolicy(): Promise<RetentionResult>;
  getRetentionStats(): Promise<RetentionStats>;
  
  // Real-time streaming
  subscribeToEvents(filter: EventFilter, handler: EventHandler): Promise<Subscription>;
  unsubscribe(subscriptionId: string): Promise<void>;
}

interface AuditEventInput {
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  principalId: string;
  principalType: 'user' | 'service_account' | 'machine_identity' | 'system' | 'anonymous';
  action: string;
  resource: string;
  resourceId: string;
  resourceType?: string;
  before?: any;
  after?: any;
  outcome: 'success' | 'failure' | 'partial' | 'denied';
  error?: string;
  traceId: string;
  spanId?: string;
  ipAddress?: string;
  userAgent?: string;
  geoLocation?: GeoLocation;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  complianceTags?: string[];
  metadata?: Record<string, any>;
}

interface IntegrityVerificationResult {
  chainId: IntegrityChainId;
  verified: boolean;
  eventsChecked: number;
  eventsFailed: number;
  failedEvents: IntegrityFailure[];
  merkleRootValid: boolean;
  verifiedAt: Date;
}

interface IntegrityFailure {
  eventId: AuditEventId;
  expectedHash: string;
  actualHash: string;
}

interface IntegrityProof {
  chainId: IntegrityChainId;
  startEvent: AuditEvent;
  endEvent: AuditEvent;
  merkleProof: MerkleProof[];
  rootHash: string;
}

interface MerkleProof {
  hash: string;
  position: 'left' | 'right';
}
```

### 4.11 Threat Detection Service

```typescript
interface ThreatDetectionService {
  // Threat management
  createThreat(input: CreateThreatInput): Promise<Threat>;
  getThreat(id: ThreatId): Promise<Threat | null>;
  updateThreat(id: ThreatId, updates: ThreatUpdates): Promise<Threat>;
  closeThreat(id: ThreatId, resolution: ThreatResolution): Promise<void>;
  listThreats(query: ThreatQuery): Promise<PaginatedResult<Threat>>;
  getThreatStats(tenantId: TenantId, window: TimeWindow): Promise<ThreatStats>;
  
  // Anomaly detection
  detectAnomalies(input: DetectAnomaliesInput): Promise<Anomaly[]>;
  getAnomaly(id: AnomalyId): Promise<Anomaly | null>;
  listAnomalies(query: AnomalyQuery): Promise<PaginatedResult<Anomaly>>;
  acknowledgeAnomaly(id: AnomalyId, userId: UserId): Promise<void>;
  suppressAnomaly(id: AnomalyId, reason: string, duration: string): Promise<void>;
  
  // Risk scoring
  calculateRiskScore(entity: RiskEntity): Promise<RiskScore>;
  getRiskScore(id: RiskScoreId): Promise<RiskScore | null>;
  listRiskScores(query: RiskScoreQuery): Promise<PaginatedResult<RiskScore>>;
  updateRiskFactors(entityId: string, factors: RiskFactor[]): Promise<void>;
  
  // Alerts
  createAlert(input: CreateAlertInput): Promise<SecurityAlert>;
  getAlert(id: SecurityAlertId): Promise<SecurityAlert | null>;
  updateAlert(id: SecurityAlertId, updates: AlertUpdates): Promise<SecurityAlert>;
  acknowledgeAlert(id: SecurityAlertId, userId: UserId): Promise<void>;
  resolveAlert(id: SecurityAlertId, userId: UserId, resolution: string): Promise<void>;
  suppressAlert(id: SecurityAlertId, duration: string, reason: string): Promise<void>;
  listAlerts(query: AlertQuery): Promise<PaginatedResult<SecurityAlert>>;
  getAlertStats(tenantId: TenantId, window: TimeWindow): Promise<AlertStats>;
  
  // Incidents
  createIncident(input: CreateIncidentInput): Promise<SecurityIncident>;
  getIncident(id: SecurityIncidentId): Promise<SecurityIncident | null>;
  updateIncident(id: SecurityIncidentId, updates: IncidentUpdates): Promise<SecurityIncident>;
  assignIncident(id: SecurityIncidentId, commander: UserId, responders: UserId[]): Promise<void>;
  addTimelineEntry(id: SecurityIncidentId, entry: IncidentTimelineEntry): Promise<void>;
  executeResponseAction(id: SecurityIncidentId, action: ResponseAction): Promise<ResponseActionResult>;
  closeIncident(id: SecurityIncidentId, rootCause: string, lessonsLearned: string): Promise<void>;
  listIncidents(query: IncidentQuery): Promise<PaginatedResult<SecurityIncident>>;
  
  // Correlation
  correlateEvents(events: AuditEvent[]): Promise<CorrelationResult>;
  getCorrelationRules(): Promise<CorrelationRule[]>;
  createCorrelationRule(rule: CorrelationRule): Promise<CorrelationRule>;
  updateCorrelationRule(id: string, updates: CorrelationRuleUpdates): Promise<CorrelationRule>;
  deleteCorrelationRule(id: string): Promise<void>;
  
  // Threat intelligence
  importThreatIntel(source: ThreatIntelSource): Promise<ImportResult>;
  getThreatIntelIndicators(query: IndicatorQuery): Promise<ThreatIndicator[]>;
  matchIndicators(events: AuditEvent[]): Promise<IndicatorMatch[]>;
}

interface ThreatResolution {
  status: 'resolved' | 'false_positive' | 'risk_accepted';
  summary: string;
  rootCause?: string;
  remediation?: string;
}

interface ThreatStats {
  total: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  mttr: number;
  openCritical: number;
  openHigh: number;
}

interface RiskEntity {
  type: 'user' | 'service_account' | 'machine_identity' | 'ip' | 'device' | 'resource';
  id: string;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
}

interface RiskScore {
  id: RiskScoreId;
  entity: RiskEntity;
  score: number;
  level: 'critical' | 'high' | 'medium' | 'low';
  factors: RiskFactor[];
  calculatedAt: Date;
  validUntil: Date;
}

interface RiskFactor {
  type: string;
  weight: number;
  value: number;
  description: string;
}

interface CorrelationResult {
  correlated: boolean;
  threatId?: ThreatId;
  confidence: number;
  matchedRules: string[];
  suggestedActions: string[];
}

interface CorrelationRule {
  id: string;
  name: string;
  description: string;
  conditions: CorrelationCondition[];
  actions: CorrelationAction[];
  enabled: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cooldown: string;
}

interface CorrelationCondition {
  eventType: string;
  field: string;
  operator: string;
  value: any;
  timeWindow: string;
}

interface CorrelationAction {
  type: 'create_threat' | 'create_alert' | 'enrich' | 'tag' | 'notify';
  params: Record<string, any>;
}

interface ThreatIntelSource {
  type: 'stix' | 'misp' | 'otx' | 'custom' | 'url' | 'file';
  url?: string;
  apiKey?: string;
  format: 'json' | 'xml' | 'csv' | 'stix';
  tags: string[];
  trustLevel: 'high' | 'medium' | 'low';
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
  indicators: ThreatIndicator[];
}

interface IndicatorQuery {
  types: string[];
  tags: string[];
  confidence: number;
  timeRange: TimeWindow;
}

interface IndicatorMatch {
  indicator: ThreatIndicator;
  events: AuditEvent[];
  confidence: number;
}
```

### 4.12 Compliance Service

```typescript
interface ComplianceService {
  // Framework management
  createFramework(input: CreateFrameworkInput): Promise<ComplianceFramework>;
  getFramework(id: FrameworkId): Promise<ComplianceFramework | null>;
  updateFramework(id: FrameworkId, updates: FrameworkUpdates): Promise<ComplianceFramework>;
  deleteFramework(id: FrameworkId): Promise<void>;
  listFrameworks(query: FrameworkQuery): Promise<PaginatedResult<ComplianceFramework>>;
  importFramework(source: FrameworkSource): Promise<ComplianceFramework>;
  
  // Control management
  createControl(frameworkId: FrameworkId, input: CreateControlInput): Promise<Control>;
  getControl(id: ControlId): Promise<Control | null>;
  updateControl(id: ControlId, updates: ControlUpdates): Promise<Control>;
  deleteControl(id: ControlId): Promise<void>;
  listControls(frameworkId: FrameworkId, query: ControlQuery): Promise<PaginatedResult<Control>>;
  
  // Assessments
  createAssessment(input: CreateAssessmentInput): Promise<Assessment>;
  getAssessment(id: AssessmentId): Promise<Assessment | null>;
  updateAssessment(id: AssessmentId, updates: AssessmentUpdates): Promise<Assessment>;
  runAssessment(id: AssessmentId): Promise<AssessmentResult>;
  listAssessments(query: AssessmentQuery): Promise<PaginatedResult<Assessment>>;
  getAssessmentStats(tenantId: TenantId): Promise<AssessmentStats>;
  
  // Evidence
  collectEvidence(input: CollectEvidenceInput): Promise<Evidence>;
  getEvidence(id: EvidenceId): Promise<Evidence | null>;
  listEvidence(query: EvidenceQuery): Promise<PaginatedResult<Evidence>>;
  validateEvidence(id: EvidenceId): Promise<EvidenceValidationResult>;
  linkEvidenceToControl(evidenceId: EvidenceId, controlId: ControlId): Promise<void>;
  unlinkEvidenceFromControl(evidenceId: EvidenceId, controlId: ControlId): Promise<void>;
  
  // Reports
  generateReport(assessmentId: AssessmentId, options: ReportOptions): Promise<ComplianceReport>;
  getReport(id: ComplianceReportId): Promise<ComplianceReport | null>;
  listReports(query: ReportQuery): Promise<PaginatedResult<ComplianceReport>>;
  publishReport(id: ComplianceReportId, userId: UserId): Promise<void>;
  archiveReport(id: ComplianceReportId): Promise<void>;
  exportReport(id: ComplianceReportId, format: 'pdf' | 'html' | 'json' | 'csv'): Promise<ExportResult>;
  
  // Continuous compliance
  enableContinuousCompliance(frameworkId: FrameworkId, workspaceId: WorkspaceId): Promise<void>;
  disableContinuousCompliance(frameworkId: FrameworkId, workspaceId: WorkspaceId): Promise<void>;
  getContinuousComplianceStatus(frameworkId: FrameworkId, workspaceId: WorkspaceId): Promise<ContinuousComplianceStatus>;
  runContinuousCheck(frameworkId: FrameworkId, workspaceId: WorkspaceId): Promise<ContinuousCheckResult>;
}

interface FrameworkSource {
  type: 'url' | 'file' | 'builtin';
  value: string;
  format: 'json' | 'yaml' | 'csv';
}

interface AssessmentResult {
  assessmentId: AssessmentId;
  status: 'completed' | 'failed';
  findings: Finding[];
  overallScore: number;
  completedAt: Date;
  duration: number;
}

interface AssessmentStats {
  totalAssessments: number;
  completed: number;
  inProgress: number;
  failed: number;
  avgScore: number;
  overdueControls: number;
}

interface EvidenceValidationResult {
  evidenceId: EvidenceId;
  valid: boolean;
  integrityVerified: boolean;
  issues: ValidationIssue[];
}

interface ValidationIssue {
  type: 'integrity' | 'completeness' | 'relevance' | 'timeliness';
  severity: 'error' | 'warning' | 'info';
  description: string;
}

interface ReportOptions {
  format: 'pdf' | 'html' | 'json' | 'csv';
  includeEvidence: boolean;
  includeRemediation: boolean;
  executiveSummary: boolean;
  technicalDetails: boolean;
}

interface ContinuousComplianceStatus {
  enabled: boolean;
  lastCheck: Date;
  nextCheck: Date;
  status: 'compliant' | 'non_compliant' | 'unknown';
  failingControls: string[];
}

interface ContinuousCheckResult {
  checkId: string;
  frameworkId: FrameworkId;
  workspaceId: WorkspaceId;
  status: 'pass' | 'fail' | 'error';
  controlsChecked: number;
  controlsPassed: number;
  controlsFailed: number;
  newFindings: Finding[];
  resolvedFindings: Finding[];
  completedAt: Date;
}
```

### 4.13 Approval Service

```typescript
interface ApprovalService {
  // Approval requests
  createApprovalRequest(input: CreateApprovalRequestInput): Promise<ApprovalRequest>;
  getApprovalRequest(id: ApprovalRequestId): Promise<ApprovalRequest | null>;
  updateApprovalRequest(id: ApprovalRequestId, updates: ApprovalRequestUpdates): Promise<ApprovalRequest>;
  submitDecision(id: ApprovalRequestId, decision: ApprovalDecision, userId: UserId, comment?: string): Promise<void>;
  cancelApprovalRequest(id: ApprovalRequestId, userId: UserId, reason: string): Promise<void>;
  listApprovalRequests(query: ApprovalRequestQuery): Promise<PaginatedResult<ApprovalRequest>>;
  getPendingApprovalsForUser(userId: UserId): Promise<ApprovalRequest[]>;
  getApprovalStats(tenantId: TenantId, window: TimeWindow): Promise<ApprovalStats>;
  
  // Delegations
  createDelegation(input: CreateDelegationInput): Promise<Delegation>;
  getDelegation(id: DelegationId): Promise<Delegation | null>;
  updateDelegation(id: DelegationId, updates: DelegationUpdates): Promise<Delegation>;
  revokeDelegation(id: DelegationId, userId: UserId): Promise<void>;
  listDelegations(query: DelegationQuery): Promise<PaginatedResult<Delegation>>;
  getActiveDelegationsForUser(userId: UserId): Promise<Delegation[]>;
  getDelegationsByDelegatee(delegateeId: UserId): Promise<Delegation[]>;
  
  // Recertification
  createRecertification(input: CreateRecertificationInput): Promise<Recertification>;
  getRecertification(id: RecertificationId): Promise<Recertification | null>;
  updateRecertification(id: RecertificationId, updates: RecertificationUpdates): Promise<Recertification>;
  runRecertification(id: RecertificationId): Promise<RecertificationRun>;
  listRecertifications(query: RecertificationQuery): Promise<PaginatedResult<Recertification>>;
  decideRecertificationItem(recertificationId: RecertificationId, itemId: string, decision: RecertificationDecision): Promise<void>;
  bulkDecideRecertificationItems(recertificationId: RecertificationId, decisions: RecertificationItemDecision[]): Promise<void>;
  
  // Escalation
  escalateApproval(id: ApprovalRequestId, reason: string): Promise<void>;
  getEscalationPolicy(id: string): Promise<EscalationPolicy | null>;
  createEscalationPolicy(policy: EscalationPolicy): Promise<EscalationPolicy>;
  updateEscalationPolicy(id: string, updates: EscalationPolicyUpdates): Promise<EscalationPolicy>;
  deleteEscalationPolicy(id: string): Promise<void>;
}

interface ApprovalDecision {
  decision: 'approved' | 'denied';
  comment?: string;
}

interface ApprovalStats {
  total: number;
  pending: number;
  approved: number;
  denied: number;
  expired: number;
  escalated: number;
  avgDecisionTime: number;
  byType: Record<string, number>;
}

interface RecertificationRun {
  id: string;
  recertificationId: RecertificationId;
  status: 'running' | 'completed' | 'failed';
  itemsTotal: number;
  itemsDecided: number;
  itemsCertified: number;
  itemsRevoked: number;
  itemsDeferred: number;
  startedAt: Date;
  completedAt?: Date;
}
```

### 4.14 Federation Service

```typescript
interface FederationService {
  // Identity provider management
  createIdentityProvider(input: CreateIdPInput): Promise<IdentityProvider>;
  getIdentityProvider(id: IdentityProviderId): Promise<IdentityProvider | null>;
  updateIdentityProvider(id: IdentityProviderId, updates: IdPUpdates): Promise<IdentityProvider>;
  deleteIdentityProvider(id: IdentityProviderId): Promise<void>;
  listIdentityProviders(query: IdPQuery): Promise<PaginatedResult<IdentityProvider>>;
  testIdentityProvider(id: IdentityProviderId): Promise<IdPTestResult>;
  
  // SAML configuration
  createSAMLConfig(idpId: IdentityProviderId, config: SAMLConfig): Promise<SAMLConfig>;
  getSAMLConfig(idpId: IdentityProviderId): Promise<SAMLConfig | null>;
  updateSAMLConfig(idpId: IdentityProviderId, updates: SAMLConfigUpdates): Promise<SAMLConfig>;
  deleteSAMLConfig(idpId: IdentityProviderId): Promise<void>;
  exportSAMLMetadata(idpId: IdentityProviderId): Promise<string>;
  
  // OIDC configuration
  createOIDCConfig(idpId: IdentityProviderId, config: OIDCConfig): Promise<OIDCConfig>;
  getOIDCConfig(idpId: IdentityProviderId): Promise<OIDCConfig | null>;
  updateOIDCConfig(idpId: IdentityProviderId, updates: OIDCConfigUpdates):