# Hermes Automation Subsystem — Production Architecture Specification (Part 2)

## 4.3 Complete TypeScript Interfaces (continued)

```typescript
interface PackageDependency {
  id: string;
  name: string;
  version: string;
  type: 'workflow' | 'skill' | 'plugin' | 'model' | 'package' | 'external';
  required: boolean;
  resolution: 'strict' | 'loose' | 'latest' | 'pinned';
}

interface PackageMetadata {
  minHermesVersion: string;
  maxHermesVersion?: string;
  supportedPlatforms: string[];
  supportedArchitectures: string[];
  languages: string[];
  frameworks: string[];
  keywords: string[];
  badges: Badge[];
  custom: Record<string, any>;
}

interface Badge {
  label: string;
  message: string;
  color: string;
  link?: string;
}

interface PackageSignature {
  algorithm: 'rsa-sha256' | 'ecdsa-sha256' | 'ed25519';
  signature: string;
  publicKey: string;
  signedAt: Date;
  signedBy: string;
  verified: boolean;
}

interface SBOM {
  format: 'spdx' | 'cyclonedx' | 'swid';
  data: any;
  generatedAt: Date;
  tool: string;
}

interface ScanResult {
  scanner: string;
  timestamp: Date;
  vulnerabilities: Vulnerability[];
  passed: boolean;
  summary: ScanSummary;
}

interface ScanSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

type PackageStatus = 'draft' | 'published' | 'deprecated' | 'archived' | 'quarantined' | 'failed-scan';

interface AutomationRegistry {
  id: AutomationRegistryId;
  name: string;
  description: string;
  url: string;
  type: 'public' | 'private' | 'hybrid';
  auth: RegistryAuthConfig;
  priority: number;
  mirrors: RegistryMirror[];
  trustPolicy: TrustPolicy;
  offlineCache: OfflineCacheConfig;
  lastSyncAt?: Date;
  packagesCount: number;
  status: RegistryStatus;
  health: RegistryHealth;
  createdAt: Date;
  updatedAt: Date;
}

type RegistryStatus = 'active' | 'syncing' | 'error' | 'disabled' | 'deprecated';

interface RegistryAuthConfig {
  type: 'none' | 'api-key' | 'oauth2' | 'basic' | 'mtls' | 'custom';
  config: Record<string, any>;
}

interface RegistryMirror {
  url: string;
  priority: number;
  region: string;
  syncIntervalMs: number;
}

interface TrustPolicy {
  requireSignatures: boolean;
  allowedSigners: string[];
  allowUnsigned: boolean;
  maxAgeDays: number;
  scanRequired: boolean;
  blockedPackages: string[];
}

interface OfflineCacheConfig {
  enabled: boolean;
  path: string;
  maxSizeGb: number;
  ttlDays: number;
  preloadPopular: boolean;
}

interface RegistryHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs: number;
  lastCheckAt: Date;
  errors: string[];
}

// ============================================================
// COST & ANALYTICS DOMAIN
// ============================================================

interface CostRecord {
  id: CostRecordId;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  executionId: WorkflowExecutionId;
  nodeId?: ExecutionNodeId;
  modelId?: string;
  providerId?: string;
  tokensIn: bigint;
  tokensOut: bigint;
  totalTokens: bigint;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
  billingModel: 'per-token' | 'per-request' | 'per-second' | 'custom';
  metadata: Record<string, any>;
  recordedAt: Date;
}

interface Alert {
  id: AlertId;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  ruleId: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  status: AlertStatus;
  source: AlertSource;
  sourceId: string;
  acknowledgedAt?: Date;
  acknowledgedBy?: UserId;
  resolvedAt?: Date;
  resolvedBy?: UserId;
  annotations: Record<string, string>;
  labels: Record<string, string>;
  fingerprint: string;
  createdAt: Date;
  updatedAt: Date;
}

type AlertStatus = 'firing' | 'acknowledged' | 'resolved' | 'silenced' | 'suppressed';

type AlertSource = 'workflow' | 'execution' | 'node' | 'queue' | 'worker' | 'schedule' | 'trigger' | 'approval' | 'cost' | 'sla' | 'security' | 'system';

interface Notification {
  id: NotificationId;
  tenantId: TenantId;
  workspaceId: WorkspaceId;
  alertId?: AlertId;
  approvalRequestId?: ApprovalRequestId;
  humanTaskId?: HumanTaskId;
  executionId?: WorkflowExecutionId;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  body: string;
  templateId?: string;
  templateVars: Record<string, any>;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

type NotificationChannel = 'email' | 'slack' | 'teams' | 'discord' | 'webhook' | 'sms' | 'push' | 'pagerduty' | 'opsgenie' | 'victorops' | 'custom';

type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'suppressed';

interface AuditRecord {
  id: AuditRecordId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  timestamp: Date;
  principalId: string;
  principalType: 'user' | 'agent' | 'system' | 'service';
  action: string;
  resource: string;
  resourceId: string;
  before?: any;
  after?: any;
  outcome: 'success' | 'failure' | 'partial';
  error?: string;
  traceId: string;
  spanId: string;
  ipAddress?: string;
  userAgent?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
  integrityHash: string;
  previousHash: string;
}

// ============================================================
// METRICS DOMAIN
// ============================================================

interface Metrics {
  id: MetricsId;
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
  timestamp: Date;
  interval: number;
  // Workflow metrics
  workflows: {
    total: number;
    active: number;
    completed: number;
    failed: number;
    avgDurationMs: number;
    p99DurationMs: number;
  };
  // Execution metrics
  executions: {
    total: number;
    running: number;
    queued: number;
    completed: number;
    failed: number;
    cancelled: number;
    suspended: number;
    avgDurationMs: number;
    p99DurationMs: number;
    throughputPerSec: number;
  };
  // Node metrics
  nodes: {
    total: number;
    completed: number;
    failed: number;
    retried: number;
    compensated: number;
    avgDurationMs: number;
    p99DurationMs: number;
    byType: Record<string, number>;
  };
  // Queue metrics
  queues: {
    totalMessages: number;
    visibleMessages: number;
    inFlightMessages: number;
    deadLetterMessages: number;
    throughputPerSec: number;
    avgLatencyMs: number;
    p99LatencyMs: number;
    errorRate: number;
  };
  // Worker metrics
  workers: {
    total: number;
    healthy: number;
    busy: number;
    idle: number;
    unhealthy: number;
    avgUtilization: number;
    throughputPerSec: number;
  };
  // Schedule metrics
  schedules: {
    total: number;
    active: number;
    triggered: number;
    failed: number;
    nextRunAt?: Date;
  };
  // Trigger metrics
  triggers: {
    total: number;
    fired: number;
    failed: number;
    avgLatencyMs: number;
  };
  // Approval metrics
  approvals: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    expired: number;
    escalated: number;
    avgDecisionTimeMs: number;
  };
  // Cost metrics
  costs: {
    total: number;
    byProvider: Record<string, number>;
    byModel: Record<string, number>;
    byWorkflow: Record<string, number>;
    forecasted: number;
    budgetUtilization: number;
  };
  // SLA metrics
  slas: {
    availability: number;
    latencyP99: number;
    errorRate: number;
    throughput: number;
    budgetBurnRate: number;
  };
}
```

---

## 5. Database Architecture

### 5.1 PostgreSQL Schema

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    current_version_id UUID,
    retry_policy_id UUID,
    rollback_policy_id UUID,
    circuit_breaker_id UUID,
    dead_letter_queue_id UUID,
    timeout_ms BIGINT NOT NULL DEFAULT 3600000,
    max_retries INTEGER NOT NULL DEFAULT 3,
    concurrency_limit INTEGER NOT NULL DEFAULT 10,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_workflows_tenant ON workflows(tenant_id);
CREATE INDEX idx_workflows_workspace ON workflows(workspace_id);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_category ON workflows(category);

-- Workflow Versions
CREATE TABLE workflow_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    definition JSONB NOT NULL,
    changelog TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    breaking_changes BOOLEAN NOT NULL DEFAULT FALSE,
    migration_script TEXT,
    schema_hash CHAR(64) NOT NULL,
    published_at TIMESTAMPTZ,
    published_by UUID,
    deprecated_at TIMESTAMPTZ,
    deprecated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_workflow_versions_unique ON workflow_versions(workflow_id, version);
CREATE INDEX idx_workflow_versions_workflow ON workflow_versions(workflow_id);
CREATE INDEX idx_workflow_versions_status ON workflow_versions(status);

-- Workflow Templates
CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    definition JSONB NOT NULL,
    parameters JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    published_at TIMESTAMPTZ,
    downloads INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_templates_tenant ON workflow_templates(tenant_id);
CREATE INDEX idx_templates_workspace ON workflow_templates(workspace_id);
CREATE INDEX idx_templates_status ON workflow_templates(status);

-- Workflow Executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES workflows(id),
    workflow_version_id UUID NOT NULL REFERENCES workflow_versions(id),
    trigger_id UUID,
    schedule_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    input JSONB NOT NULL DEFAULT '{}',
    output JSONB,
    error JSONB,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_ms BIGINT,
    current_node_id VARCHAR(255),
    completed_nodes TEXT[] DEFAULT '{}',
    failed_nodes TEXT[] DEFAULT '{}',
    skipped_nodes TEXT[] DEFAULT '{}',
    suspended_at TIMESTAMPTZ,
    suspended_by UUID,
    resume_count INTEGER NOT NULL DEFAULT 0,
    retry_count INTEGER NOT NULL DEFAULT 0,
    variables JSONB NOT NULL DEFAULT '{}',
    secrets JSONB NOT NULL DEFAULT '[]',
    trace_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    span_id UUID,
    parent_execution_id UUID REFERENCES workflow_executions(id),
    root_execution_id UUID NOT NULL REFERENCES workflow_executions(id),
    plan_id UUID,
    cost_record_id UUID,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_executions_tenant ON workflow_executions(tenant_id);
CREATE INDEX idx_executions_workspace ON workflow_executions(workspace_id);
CREATE INDEX idx_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_executions_status ON workflow_executions(status);
CREATE INDEX idx_executions_trace ON workflow_executions(trace_id);
CREATE INDEX idx_executions_parent ON workflow_executions(parent_execution_id);
CREATE INDEX idx_executions_start_time ON workflow_executions(start_time DESC);

-- Execution Plans
CREATE TABLE execution_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    stages JSONB NOT NULL DEFAULT '[]',
    total_nodes INTEGER NOT NULL DEFAULT 0,
    estimated_duration_ms BIGINT,
    critical_path TEXT[] DEFAULT '{}',
    parallel_groups JSONB NOT NULL DEFAULT '[]',
    resource_requirements JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_execution ON execution_plans(execution_id);

-- Execution Nodes
CREATE TABLE execution_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES execution_plans(id) ON DELETE CASCADE,
    stage_id UUID,
    workflow_node_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    input JSONB NOT NULL DEFAULT '{}',
    output JSONB,
    error JSONB,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_ms BIGINT,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    worker_id UUID,
    queue_id UUID,
    checkpoint_id UUID,
    compensation_action_id UUID,
    retry_policy JSONB NOT NULL DEFAULT '{}',
    circuit_breaker JSONB NOT NULL DEFAULT '{}',
    timeout_ms BIGINT NOT NULL DEFAULT 300000,
    trace_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    span_id UUID,
    metrics JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nodes_execution ON execution_nodes(execution_id);
CREATE INDEX idx_nodes_plan ON execution_nodes(plan_id);
CREATE INDEX idx_nodes_stage ON execution_nodes(stage_id);
CREATE INDEX idx_nodes_status ON execution_nodes(status);
CREATE INDEX idx_nodes_worker ON execution_nodes(worker_id);

-- Execution Edges
CREATE TABLE execution_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES execution_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES execution_nodes(id) ON DELETE CASCADE,
    source_output VARCHAR(255) NOT NULL,
    target_input VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    data JSONB,
    evaluated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_edges_execution ON execution_edges(execution_id);
CREATE INDEX idx_edges_source ON execution_edges(source_node_id);
CREATE INDEX idx_edges_target ON execution_edges(target_node_id);

-- Execution Logs (partitioned by time)
CREATE TABLE execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id UUID REFERENCES execution_nodes(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB NOT NULL DEFAULT '{}',
    trace_id UUID NOT NULL,
    span_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_logs_execution ON execution_logs(execution_id);
CREATE INDEX idx_logs_timestamp ON execution_logs(timestamp DESC);
CREATE INDEX idx_logs_level ON execution_logs(level);
CREATE INDEX idx_logs_trace ON execution_logs(trace_id);

-- Monthly partitions for execution_logs
CREATE TABLE execution_logs_2024_01 PARTITION OF execution_logs FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE execution_logs_2024_02 PARTITION OF execution_logs FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE execution_logs_2024_03 PARTITION OF execution_logs FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE execution_logs_2024_04 PARTITION OF execution_logs FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE execution_logs_2024_05 PARTITION OF execution_logs FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE execution_logs_2024_06 PARTITION OF execution_logs FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE execution_logs_2024_07 PARTITION OF execution_logs FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE execution_logs_2024_08 PARTITION OF execution_logs FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE execution_logs_2024_09 PARTITION OF execution_logs FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE execution_logs_2024_10 PARTITION OF execution_logs FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE execution_logs_2024_11 PARTITION OF execution_logs FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE execution_logs_2024_12 PARTITION OF execution_logs FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE execution_logs_2025_01 PARTITION OF execution_logs FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Workflow Snapshots
CREATE TABLE workflow_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    state JSONB NOT NULL,
    variables JSONB NOT NULL DEFAULT '{}',
    completed_nodes TEXT[] DEFAULT '{}',
    node_outputs JSONB NOT NULL DEFAULT '{}',
    node_statuses JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL,
    trigger VARCHAR(50) NOT NULL
);

CREATE INDEX idx_snapshots_execution ON workflow_snapshots(execution_id);
CREATE INDEX idx_snapshots_created ON workflow_snapshots(created_at DESC);

-- Triggers
CREATE TABLE triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    group_id UUID,
    config JSONB NOT NULL DEFAULT '{}',
    filter JSONB NOT NULL DEFAULT '{}',
    target_workflows JSONB NOT NULL DEFAULT '[]',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_fired_at TIMESTAMPTZ,
    fire_count BIGINT NOT NULL DEFAULT 0,
    error_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_triggers_tenant ON triggers(tenant_id);
CREATE INDEX idx_triggers_workspace ON triggers(workspace_id);
CREATE INDEX idx_triggers_type ON triggers(type);
CREATE INDEX idx_triggers_status ON triggers(status);
CREATE INDEX idx_triggers_group ON triggers(group_id);

-- Trigger Groups
CREATE TABLE trigger_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    triggers UUID[] DEFAULT '{}',
    logic VARCHAR(20) NOT NULL DEFAULT 'or',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trigger_groups_tenant ON trigger_groups(tenant_id);
CREATE INDEX idx_trigger_groups_workspace ON trigger_groups(workspace_id);

-- Event Filters
CREATE TABLE event_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_types TEXT[] DEFAULT '{}',
    sources TEXT[] DEFAULT '{}',
    conditions JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_filters_tenant ON event_filters(tenant_id);
CREATE INDEX idx_event_filters_workspace ON event_filters(workspace_id);

-- Event Subscriptions
CREATE TABLE event_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trigger_id UUID NOT NULL REFERENCES triggers(id) ON DELETE CASCADE,
    event_type VARCHAR(255) NOT NULL,
    source VARCHAR(255),
    filter_id UUID REFERENCES event_filters(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_event_at TIMESTAMPTZ,
    event_count BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_subscriptions_trigger ON event_subscriptions(trigger_id);
CREATE INDEX idx_subscriptions_event_type ON event_subscriptions(event_type);

-- Schedules
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    target_workflows JSONB NOT NULL DEFAULT '[]',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    next_run_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    run_count BIGINT NOT NULL DEFAULT 0,
    error_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_schedules_tenant ON schedules(tenant_id);
CREATE INDEX idx_schedules_workspace ON schedules(workspace_id);
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_schedules_next_run ON schedules(next_run_at) WHERE next_run_at IS NOT NULL;

-- Calendars
CREATE TABLE calendars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    business_hours JSONB NOT NULL DEFAULT '{}',
    holidays JSONB NOT NULL DEFAULT '[]',
    working_days TEXT[] DEFAULT '{"MO","TU","WE","TH","FR"}',
    exceptions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calendars_tenant ON calendars(tenant_id);
CREATE INDEX idx_calendars_workspace ON calendars(workspace_id);

-- Cron Definitions
CREATE TABLE cron_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expression VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    description TEXT,
    next_occurrences TIMESTAMPTZ[] DEFAULT '{}',
    last_occurrence TIMESTAMPTZ,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    validation_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Approval Policies
CREATE TABLE approval_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL DEFAULT '{}',
    required_approvals INTEGER NOT NULL DEFAULT 1,
    approval_type VARCHAR(20) NOT NULL DEFAULT 'any',
    assignees JSONB NOT NULL DEFAULT '[]',
    role VARCHAR(100),
    form_schema JSONB,
    due_date_offset_ms BIGINT,
    escalation_policy JSONB NOT NULL DEFAULT '{}',
    delegation_policy JSONB NOT NULL DEFAULT '{}',
    reminders JSONB NOT NULL DEFAULT '[]',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

CREATE INDEX idx_approval_policies_tenant ON approval_policies(tenant_id);
CREATE INDEX idx_approval_policies_workspace ON approval_policies(workspace_id);

-- Approval Requests
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES execution_nodes(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES approval_policies(id),
    title VARCHAR(512) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    assignees JSONB NOT NULL DEFAULT '[]',
    required_approvals INTEGER NOT NULL DEFAULT 1,
    current_approvals INTEGER NOT NULL DEFAULT 0,
    approval_type VARCHAR(20) NOT NULL DEFAULT 'any',
    form_data JSONB NOT NULL DEFAULT '{}',
    form_schema JSONB,
    due_date TIMESTAMPTZ,
    escalated_at TIMESTAMPTZ,
    escalation_level INTEGER NOT NULL DEFAULT 0,
    escalation_policy JSONB NOT NULL DEFAULT '{}',
    delegation_policy JSONB NOT NULL DEFAULT '{}',
    reminders JSONB NOT NULL DEFAULT '[]',
    decided_at TIMESTAMPTZ,
    decided_by UUID,
    decision VARCHAR(20),
    comments JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approval_requests_tenant ON approval_requests(tenant_id);
CREATE INDEX idx_approval_requests_workspace ON approval_requests(workspace_id);
CREATE INDEX idx_approval_requests_execution ON approval_requests(execution_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_due_date ON approval_requests(due_date) WHERE due_date IS NOT NULL;

-- Human Tasks
CREATE TABLE human_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES execution_nodes(id) ON DELETE CASCADE,
    approval_request_id UUID REFERENCES approval_requests(id) ON DELETE SET NULL,
    title VARCHAR(512) NOT NULL,
    description TEXT,
    instructions TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    assignees JSONB NOT NULL DEFAULT '[]',
    form_schema JSONB,
    form_data JSONB NOT NULL DEFAULT '{}',
    due_date TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    completed_by UUID,
    output JSONB,
    attachments JSONB NOT NULL DEFAULT '[]',
    comments JSONB NOT NULL DEFAULT '[]',
    reminders JSONB NOT NULL DEFAULT '[]',
    escalation_policy JSONB NOT NULL DEFAULT '{}',
    delegation_policy JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_human_tasks_tenant ON human_tasks(tenant_id);
CREATE INDEX idx_human_tasks_workspace ON human_tasks(workspace_id);
CREATE INDEX idx_human_tasks_execution ON human_tasks(execution_id);
CREATE INDEX idx_human_tasks_status ON human_tasks(status);
CREATE INDEX idx_human_tasks_due_date ON human_tasks(due_date) WHERE due_date IS NOT NULL;

-- Queues
CREATE TABLE queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'fifo',
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    partitions INTEGER NOT NULL DEFAULT 1,
    replication_factor INTEGER NOT NULL DEFAULT 1,
    dead_letter_queue_id UUID REFERENCES queues(id),
    retry_queue_id UUID REFERENCES queues(id),
    scheduled_queue_id UUID REFERENCES queues(id),
    priority_levels INTEGER NOT NULL DEFAULT 10,
    default_priority INTEGER NOT NULL DEFAULT 5,
    max_message_size_bytes BIGINT NOT NULL DEFAULT 1048576,
    retention_ms BIGINT NOT NULL DEFAULT 604800000,
    cleanup_interval_ms BIGINT NOT NULL DEFAULT 3600000,
    metrics JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_queues_tenant ON queues(tenant_id);
CREATE INDEX idx_queues_workspace ON queues(workspace_id);
CREATE INDEX idx_queues_status ON queues(status);
CREATE INDEX idx_queues_type ON queues(type);

-- Worker Pools
CREATE TABLE worker_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'dynamic',
    queues UUID[] DEFAULT '{}',
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    min_workers INTEGER NOT NULL DEFAULT 1,
    max_workers INTEGER NOT NULL DEFAULT 100,
    desired_workers INTEGER NOT NULL DEFAULT 1,
    current_workers INTEGER NOT NULL DEFAULT 0,
    healthy_workers INTEGER NOT NULL DEFAULT 0,
    scaling_policy JSONB NOT NULL DEFAULT '{}',
    resource_limits JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_worker_pools_tenant ON worker_pools(tenant_id);
CREATE INDEX idx_worker_pools_workspace ON worker_pools(workspace_id);
CREATE INDEX idx_worker_pools_status ON worker_pools(status);

-- Workers
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID NOT NULL REFERENCES worker_pools(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'starting',
    queues UUID[] DEFAULT '{}',
    current_execution_id UUID REFERENCES execution_nodes(id),
    capabilities JSONB NOT NULL DEFAULT '[]',
    resources JSONB NOT NULL DEFAULT '{}',
    health JSONB NOT NULL DEFAULT '{}',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_executions BIGINT NOT NULL DEFAULT 0,
    failed_executions BIGINT NOT NULL DEFAULT 0,
    avg_execution_ms BIGINT NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_workers_pool ON workers(pool_id);
CREATE INDEX idx_workers_tenant ON workers(tenant_id);
CREATE INDEX idx_workers_workspace ON workers(workspace_id);
CREATE INDEX idx_workers_status ON workers(status);
CREATE INDEX idx_workers_heartbeat ON workers(last_heartbeat_at);

-- Retry Policies
CREATE TABLE retry_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    scope JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_retry_policies_tenant ON retry_policies(tenant_id);
CREATE INDEX idx_retry_policies_workspace ON retry_policies(workspace_id);

-- Rollback Policies
CREATE TABLE rollback_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy VARCHAR(50) NOT NULL DEFAULT 'compensate',
    compensation_order VARCHAR(20) NOT NULL DEFAULT 'reverse',
    timeout_ms BIGINT NOT NULL DEFAULT 300000,
    max_compensation_retries INTEGER NOT NULL DEFAULT 3,
    on_compensation_failure VARCHAR(20) NOT NULL DEFAULT 'continue',
    notification_channels TEXT[] DEFAULT '{}',
    scope JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rollback_policies_tenant ON rollback_policies(tenant_id);
CREATE INDEX idx_rollback_policies_workspace ON rollback_policies(workspace_id);

-- Circuit Breakers
CREATE TABLE circuit_breakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    state VARCHAR(20) NOT NULL DEFAULT 'closed',
    metrics JSONB NOT NULL DEFAULT '{}',
    scope JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_circuit_breakers_tenant ON circuit_breakers(tenant_id);
CREATE INDEX idx_circuit_breakers_workspace ON circuit_breakers(workspace_id);
CREATE INDEX idx_circuit_breakers_state ON circuit_breakers(state);

-- Dead Letter Queues
CREATE TABLE dead_letter_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_queue_id UUID NOT NULL REFERENCES queues(id),
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    message_count BIGINT NOT NULL DEFAULT 0,
    max_retention_ms BIGINT NOT NULL DEFAULT 2592000000,
    reprocess_policy JSONB NOT NULL DEFAULT '{}',
    alerting JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dlq_tenant ON dead_letter_queues(tenant_id);
CREATE INDEX idx_dlq_workspace ON dead_letter_queues(workspace_id);
CREATE INDEX idx_dlq_source ON dead_letter_queues(source_queue_id);
CREATE INDEX idx_dlq_status ON dead_letter_queues(status);

-- Compensation Actions
CREATE TABLE compensation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES execution_nodes(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    input JSONB NOT NULL DEFAULT '{}',
    output JSONB,
    error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INTEGER NOT NULL DEFAULT 0,
    trace_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compensation_execution ON compensation_actions(execution_id);
CREATE INDEX idx_compensation_node ON compensation_actions(node_id);
CREATE INDEX idx_compensation_status ON compensation_actions(status);

-- Variables
CREATE TABLE variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    value JSONB,
    encrypted BOOLEAN NOT NULL DEFAULT FALSE,
    scope VARCHAR(50) NOT NULL DEFAULT 'global',
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    readonly BOOLEAN NOT NULL DEFAULT FALSE,
    validation JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

CREATE UNIQUE INDEX idx_variables_unique ON variables(tenant_id, workspace_id, scope, workflow_id, execution_id, name);
CREATE INDEX idx_variables_tenant ON variables(tenant_id);
CREATE INDEX idx_variables_workspace ON variables(workspace_id);
CREATE INDEX idx_variables_scope ON variables(scope);
CREATE INDEX idx_variables_execution ON variables(execution_id);

-- Secrets
CREATE TABLE secrets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    rotation JSONB NOT NULL DEFAULT '{}',
    vault_integration JSONB,
    masking VARCHAR(20) NOT NULL DEFAULT 'full',
    scope VARCHAR(50) NOT NULL DEFAULT 'global',
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_secrets_unique ON secrets(tenant_id, workspace_id, scope, workflow_id, execution_id, name);
CREATE INDEX idx_secrets_tenant ON secrets(tenant_id);
CREATE INDEX idx_secrets_workspace ON secrets(workspace_id);
CREATE INDEX idx_secrets_scope ON secrets(scope);
CREATE INDEX idx_secrets_execution ON secrets(execution_id);

-- Environments
CREATE TABLE environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    variables UUID[] DEFAULT '{}',
    secrets UUID[] DEFAULT '{}',
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

CREATE INDEX idx_environments_tenant ON environments(tenant_id);
CREATE INDEX idx_environments_workspace ON environments(workspace_id);

-- Automation Packages
CREATE TABLE automation_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    author VARCHAR(255) NOT NULL,
    license VARCHAR(100) NOT NULL,
    repository VARCHAR(500),
    homepage VARCHAR(500),
    icon VARCHAR(500),
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    workflows UUID[] DEFAULT '{}',
    dependencies JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    install_size_bytes BIGINT NOT NULL DEFAULT 0,
    runtime_size_bytes BIGINT NOT NULL DEFAULT 0,
    checksums JSONB NOT NULL DEFAULT '{}',
    signatures JSONB NOT NULL DEFAULT '[]',
    sbom JSONB,
    scan_results JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    installed_at TIMESTAMPTZ,
    published_by UUID,
    downloads BIGINT NOT NULL DEFAULT 0,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX idx_packages_unique ON automation_packages(tenant_id, name, version);
CREATE INDEX idx_packages_tenant ON automation_packages(tenant_id);
CREATE INDEX idx_packages_status ON automation_packages(status);

-- Automation Registry
CREATE TABLE automation_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'public',
    auth JSONB,
    priority INTEGER NOT NULL DEFAULT 100,
    mirrors JSONB NOT NULL DEFAULT '[]',
    trust_policy JSONB NOT NULL DEFAULT '{}',
    offline_cache JSONB NOT NULL DEFAULT '{}',
    last_sync_at TIMESTAMPTZ,
    packages_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    health JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_registry_status ON automation_registry(status);

-- Cost Records
CREATE TABLE cost_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id UUID REFERENCES execution_nodes(id) ON DELETE SET NULL,
    model_id VARCHAR(255),
    provider_id VARCHAR(255),
    tokens_in BIGINT NOT NULL DEFAULT 0,
    tokens_out BIGINT NOT NULL DEFAULT 0,
    total_tokens BIGINT NOT NULL DEFAULT 0,
    input_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
    output_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
    total_cost NUMERIC(18,8) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    billing_model VARCHAR(50) NOT NULL DEFAULT 'per-token',
    metadata JSONB NOT NULL DEFAULT '{}',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cost_records_tenant ON cost_records(tenant_id);
CREATE INDEX idx_cost_records_workspace ON cost_records(workspace_id);
CREATE INDEX idx_cost_records_execution ON cost_records(execution_id);
CREATE INDEX idx_cost_records_recorded ON cost_records(recorded_at DESC);

-- Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    rule_id VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(512) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'firing',
    source VARCHAR(50) NOT NULL,
    source_id UUID,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    annotations JSONB NOT NULL DEFAULT '{}',
    labels JSONB NOT NULL DEFAULT '{}',
    fingerprint CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_tenant ON alerts(tenant_id);
CREATE INDEX idx_alerts_workspace ON alerts(workspace_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_source ON alerts(source);
CREATE INDEX idx_alerts_fingerprint ON alerts(fingerprint);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    approval_request_id UUID REFERENCES approval_requests(id) ON DELETE SET NULL,
    human_task_id UUID REFERENCES human_tasks(id) ON DELETE SET NULL,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE SET NULL,
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(512),
    body TEXT NOT NULL,
    template_id VARCHAR(255),
    template_vars JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_workspace ON notifications(workspace_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_alert ON notifications(alert_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Audit Records (partitioned by time)
CREATE TABLE audit_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    principal_id VARCHAR(255) NOT NULL,
    principal_type VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id UUID NOT NULL,
    before JSONB,
    after JSONB,
    outcome VARCHAR(20) NOT NULL DEFAULT 'success',
    error TEXT,
    trace_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    span_id UUID,
    ip_address INET,
    user_agent TEXT,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low',
    metadata JSONB NOT NULL DEFAULT '{}',
    integrity_hash CHAR(64) NOT NULL,
    previous_hash CHAR(64) NOT NULL
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_audit_tenant ON audit_records(tenant_id);
CREATE INDEX idx_audit_workspace ON audit_records(workspace_id);
CREATE INDEX idx_audit_principal ON audit_records(principal_id);
CREATE INDEX idx_audit_resource ON audit_records(resource, resource_id);
CREATE INDEX idx_audit_timestamp ON audit_records(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_records(action);

-- Monthly partitions for audit_records
CREATE TABLE audit_records_2024_01 PARTITION OF audit_records FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE audit_records_2024_02 PARTITION OF audit_records FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE audit_records_2024_03 PARTITION OF audit_records FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE audit_records_2024_04 PARTITION OF audit_records FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE audit_records_2024_05 PARTITION OF audit_records FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE audit_records_2024_06 PARTITION OF audit_records FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE audit_records_2024_07 PARTITION OF audit_records FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE audit_records_2024_08 PARTITION OF audit_records FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE audit_records_2024_09 PARTITION OF audit_records FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE audit_records_2024_10 PARTITION OF audit_records FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE audit_records_2024_11 PARTITION OF audit_records FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE audit_records_2024_12 PARTITION OF audit_records FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE audit_records_2025_01 PARTITION OF audit_records FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Metrics (partitioned by time)
CREATE TABLE metrics (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    workspace_id UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    interval_ms BIGINT NOT NULL,
    workflows JSONB NOT NULL DEFAULT '{}',
    executions JSONB NOT NULL DEFAULT '{}',
    nodes JSONB NOT NULL DEFAULT '{}',
    queues JSONB NOT NULL DEFAULT '{}',
    workers JSONB NOT NULL DEFAULT '{}',
    schedules JSONB NOT NULL DEFAULT '{}',
    triggers JSONB NOT NULL DEFAULT '{}',
    approvals JSONB NOT NULL DEFAULT '{}',
    costs JSONB NOT NULL DEFAULT '{}',
    slas JSONB NOT NULL DEFAULT '{}'
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_metrics_tenant_time ON metrics(tenant_id, timestamp DESC);
CREATE INDEX idx_metrics_workspace_time ON metrics(workspace_id, timestamp DESC);

-- Monthly partitions for metrics
CREATE TABLE metrics_2024_01 PARTITION OF metrics FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE metrics_2024_02 PARTITION OF metrics FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
CREATE TABLE metrics_2024_03 PARTITION OF metrics FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
CREATE TABLE metrics_2024_04 PARTITION OF metrics FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
CREATE TABLE metrics_2024_05 PARTITION OF metrics FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
CREATE TABLE metrics_2024_06 PARTITION OF metrics FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
CREATE TABLE metrics_2024_07 PARTITION OF metrics FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
CREATE TABLE metrics_2024_08 PARTITION OF metrics FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
CREATE TABLE metrics_2024_09 PARTITION OF metrics FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
CREATE TABLE metrics_2024_10 PARTITION OF metrics FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
CREATE TABLE metrics_2024_11 PARTITION OF metrics FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');
CREATE TABLE metrics_2024_12 PARTITION OF metrics FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE metrics_2025_01 PARTITION OF metrics FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_templates_updated_at BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_executions_updated_at BEFORE UPDATE ON workflow_executions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_execution_plans_updated_at BEFORE UPDATE ON execution_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_execution_nodes_updated_at BEFORE UPDATE ON execution_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_triggers_updated_at BEFORE UPDATE ON triggers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trigger_groups_updated_at BEFORE UPDATE ON trigger_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_filters_updated_at BEFORE UPDATE ON event_filters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendars_updated_at BEFORE UPDATE ON calendars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_policies_updated_at BEFORE UPDATE ON approval_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_requests_updated_at BEFORE UPDATE ON approval_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_human_tasks_updated_at BEFORE UPDATE ON human_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queues_updated_at BEFORE UPDATE ON queues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_worker_pools_updated_at BEFORE UPDATE ON worker_pools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retry_policies_updated_at BEFORE UPDATE ON retry_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rollback_policies_updated_at BEFORE UPDATE ON rollback_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_circuit_breakers_updated_at BEFORE UPDATE ON circuit_breakers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dead_letter_queues_updated_at BEFORE UPDATE ON dead_letter_queues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compensation_actions_updated_at BEFORE UPDATE ON compensation_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_variables_updated_at BEFORE UPDATE ON variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_secrets_updated_at BEFORE UPDATE ON secrets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_environments_updated_at BEFORE UPDATE ON environments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_packages_updated_at BEFORE UPDATE ON automation_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_registry_updated_at BEFORE UPDATE ON automation_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hermes_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hermes_app;
GRANT USAGE ON SCHEMA public TO hermes_app;
```

---

## 6. Workflow Engine

### 6.1 Engine Architecture

```typescript
interface WorkflowEngine {
  // Core execution
  execute(executionId: WorkflowExecutionId): Promise<ExecutionResult>;
  plan(executionId: WorkflowExecutionId): Promise<ExecutionPlan>;
  
  // Control operations
  pause(executionId: WorkflowExecutionId): Promise<void>;
  resume(executionId: WorkflowExecutionId): Promise<void>;
  cancel(executionId: WorkflowExecutionId, reason: string): Promise<void>;
  retry(executionId: WorkflowExecutionId, fromNode?: string): Promise<void>;
  rollback(executionId: WorkflowExecutionId): Promise<void>;
  
  // Snapshots
  snapshot(executionId: WorkflowExecutionId, trigger: SnapshotTrigger): Promise<WorkflowSnapshot>;
  restore(executionId: WorkflowExecutionId, snapshotId: WorkflowSnapshotId): Promise<void>;
  
  // Node operations
  retryNode(executionId: WorkflowExecutionId, nodeId: string): Promise<void>;
  skipNode(executionId: WorkflowExecutionId, nodeId: string): Promise<void>;
  compensateNode(executionId: WorkflowExecutionId, nodeId: string): Promise<CompensationAction>;
}

interface ExecutionCoordinator {
  coordinate(executionId: WorkflowExecutionId): Promise<void>;
  onNodeComplete(executionId: WorkflowExecutionId, nodeId: string, output: any): Promise<void>;
  onNodeError(executionId: WorkflowExecutionId, nodeId: string, error: ExecutionError): Promise<void>;
  evaluateEdges(executionId: WorkflowExecutionId, sourceNodeId: string): Promise<void>;
  checkStageCompletion(executionId: WorkflowExecutionId, stageId: ExecutionStageId): Promise<void>;
}

interface NodeExecutor {
  execute(node: ExecutionNode, context: ExecutionContext): Promise<NodeExecutionResult>;
  canExecute(nodeType: NodeType): boolean;
  getCapabilities(): NodeExecutorCapabilities;
}

interface ExecutionContext {
  executionId: WorkflowExecutionId;
  workflowDefinition: WorkflowDefinition;
  variables: Record<string, any>;
  secrets: SecretReference[];
  traceId: string;
  spanId: string;
  services: ServiceRegistry;
}

interface ServiceRegistry {
  agent: AgentIntegration;
  skill: SkillIntegration;
  plugin: PluginIntegration;
  model: ModelIntegration;
  mcp: MCPIntegration;
  memory: MemoryIntegration;
  chat: ChatIntegration;
}

interface NodeExecutionResult {
  success: boolean;
  output?: any;
  error?: ExecutionError;
  checkpoint?: Checkpoint;
  compensationAction?: CompensationAction;
  metadata: ExecutionMetadata;
}

interface ParallelExecutor {
  executeParallel(group: ParallelGroup, context: ExecutionContext): Promise<ParallelExecutionResult>;
  maxConcurrency: number;
}

interface ParallelExecutionResult {
  results: Map<string, NodeExecutionResult>;
  completed: boolean;
  failed: boolean;
}
```

### 6.2 Node Type Implementations

| Node Type | Executor | Key Features |
|-----------|----------|--------------|
| `task` | `TaskExecutor` | Custom handler, container runtime, resource limits |
| `script` | `ScriptExecutor` | Node/Python/Deno/WASM, sandboxed execution |
| `http` | `HTTPExecutor` | REST calls, retries, circuit breaker, auth |
| `grpc` | `GRPCExecutor` | gRPC calls, streaming, metadata |
| `mcp` | `MCPExecutor` | Tool/resource/prompt calls via MCP |
| `agent` | `AgentExecutor` | Agent invocation, streaming, context |
| `skill` | `SkillExecutor` | Skill execution, input/output mapping |
| `plugin` | `PluginExecutor` | Plugin sandbox, capability negotiation |
| `model` | `ModelExecutor` | Inference, embedding, streaming |
| `condition` | `ConditionEvaluator` | Boolean expression, short-circuit |
| `switch` | `SwitchEvaluator` | Multi-case routing, default case |
| `parallel` | `ParallelExecutor` | Fan-out, dynamic concurrency |
| `sequential` | `SequentialExecutor` | Ordered execution, dependency tracking |
| `foreach` | `ForEachExecutor` | Collection iteration, parallel/sequential |
| `while` | `WhileExecutor` | Condition-based looping, max iterations |
| `subworkflow` | `SubworkflowExecutor` | Nested workflow, isolated state |
| `human` | `HumanTaskExecutor` | Task creation, assignment, forms |
| `approval` | `ApprovalExecutor` | Policy evaluation, escalation |
| `wait` | `WaitExecutor` | External signal, timeout |
| `delay` | `DelayExecutor` | Time-based delay, jitter |
| `timer` | `TimerExecutor` | Cron/interval scheduling |
| `fanout` | `FanoutExecutor` | Broadcast to multiple targets |
| `fanin` | `FaninExecutor` | Aggregate from multiple sources |
| `merge` | `MergeExecutor` | Combine results, deduplication |
| `split` | `SplitExecutor` | Partition data, parallel processing |
| `join` | `JoinExecutor` | Synchronize parallel branches |
| `rollback` | `RollbackExecutor` | Trigger compensation |
| `compensate` | `CompensationExecutor` | Execute compensation action |
| `checkpoint` | `CheckpointExecutor` | Persist execution state |
| `snapshot` | `SnapshotExecutor` | Full state capture |
| `variable` | `VariableExecutor` | Get/set variables, scoping |
| `secret` | `SecretExecutor` | Resolve/inject secrets |
| `transform` | `TransformExecutor` | Data transformation, mapping |
| `filter` | `FilterExecutor` | Data filtering, validation |
| `map` | `MapExecutor` | Collection mapping |
| `reduce` | `ReduceExecutor` | Collection reduction |
| `ai-generate` | `AIGenerateExecutor` | LLM text generation |
| `ai-classify` | `AIClassifyExecutor` | LLM classification |
| `ai-extract` | `AIExtractExecutor` | LLM extraction |
| `ai-summarize` | `AISummarizeExecutor` | LLM summarization |
| `ai-decide` | `AIDecideExecutor` | LLM decision making |

---

## 7. Scheduling System

### 7.1 Scheduler Architecture

```typescript
interface SchedulerService {
  // Schedule management
  createSchedule(schedule: Schedule): Promise<Schedule>;
  updateSchedule(id: ScheduleId, updates: Partial<Schedule>): Promise<Schedule>;
  deleteSchedule(id: ScheduleId): Promise<void>;
  getSchedule(id: ScheduleId): Promise<Schedule | null>;
  listSchedules(query: ScheduleQuery): Promise<Schedule[]>;
  
  // Schedule control
  enableSchedule(id: ScheduleId): Promise<void>;
  disableSchedule(id: ScheduleId): Promise<void>;
  pauseSchedule(id: ScheduleId): Promise<void>;
  resumeSchedule(id: ScheduleId): Promise<void>;
  triggerSchedule(id: ScheduleId, payload?: Record<string, any>): Promise<WorkflowExecution>;
  
  // Next runs
  getNextRuns(id: ScheduleId, count: number): Promise<Date[]>;
  getScheduleHistory(id: ScheduleId, limit: number): Promise<ScheduleRun[]>;
}

interface ScheduleEvaluator {
  evaluate(schedule: Schedule): Promise<ScheduleEvaluation>;
  getNextOccurrence(schedule: Schedule, from: Date): Promise<Date | null>;
}

interface ScheduleEvaluation {
  shouldRun: boolean;
  nextRunAt?: Date;
  payload?: Record<string, any>;
  jitterMs?: number;
}

interface CronEvaluator {
  parse(expression: string): CronDefinition;
  nextOccurrences(cron: CronDefinition, from: Date, count: number): Date[];
  validate(expression: string, timezone: string): ValidationResult;
}

interface CalendarResolver {
  isBusinessDay(calendar: Calendar, date: Date): boolean;
  getBusinessHours(calendar: Calendar, date: Date): BusinessHours | null;
  getNextBusinessDay(calendar: Calendar, from: Date): Date;
  addBusinessDays(calendar: Calendar, from: Date, days: number): Date;
}

interface DelayedJobReaper {
  processDelayedJobs(): Promise<void>;
  scheduleDelayedJob(job: DelayedJob): Promise<void>;
  cancelDelayedJob(jobId: string): Promise<void>;
}

interface DelayedJob {
  id: string;
  scheduleId: ScheduleId;
  executeAt: Date;
  payload: Record<string, any>;
  retryPolicy: RetryConfig;
  status: 'scheduled' | 'execut