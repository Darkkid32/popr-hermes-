# Hermes Automation Workspace — Enterprise UI/UX Architecture Specification (Part 3)

## 13. Human Tasks (continued)

### 13.7 Comments Tab

```typescript
interface CommentsSectionProps {
  comments: HumanTaskComment[];
  onAddComment: (comment: string, type: 'comment' | 'decision' | 'delegation' | 'escalation') => void;
  currentUser: User;
}

// Features:
// - Threaded comments
// - @mention support
// - Rich text (markdown)
// - Comment types: comment, decision, delegation, escalation
// - Edit/Delete own comments
// - Reactions (👍 👎 ❤️)
// - Timestamps with relative time
// - Anchor links to comments
```

### 13.8 Attachments Tab

```typescript
interface AttachmentsSectionProps {
  attachments: HumanTaskAttachment[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (attachmentId: string) => void;
  maxFileSize: number;
  allowedTypes: string[];
}

// Features:
// - Drag-drop upload
// - Progress indicator
// - Preview (images, PDFs)
// - Download
// - Delete (with confirmation)
// - Virus scan status
// - File size/type validation
```

### 13.9 History Tab

```typescript
interface TaskHistoryEntry {
  id: string;
  timestamp: Date;
  user: User;
  action: 'created' | 'assigned' | 'started' | 'completed' | 'rejected' | 'delegated' | 'escalated' | 'commented' | 'attachment' | 'form-change';
  details: string;
  metadata: Record<string, any>;
}

// Timeline view with icons per action type
```

### 13.10 Audit Trail Tab

```typescript
interface TaskAuditEntry {
  id: string;
  timestamp: Date;
  user: User;
  action: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  integrityHash: string;
}

// Immutable audit log with integrity verification
```

### 13.11 Task Actions

| Action | When Available | Confirmation |
|--------|----------------|--------------|
| **Assign** | Pending | Select user/role |
| **Start** | Assigned | - |
| **Complete** | In-progress | Form validation |
| **Reject** | In-progress | Required comment |
| **Delegate** | Any | Select user, requires approval |
| **Escalate** | Any | Select level, confirm |
| **Add Comment** | Any | - |
| **Upload Attachment** | Any | - |
| **Edit Form** | In-progress | Auto-save draft |
| **Reassign** | Any | Select user, notify |

---

## 14. Event Explorer

### 14.1 Layout

```css
.events-layout {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Event Stream + Filters */
.event-stream { grid-column: 1; grid-row: 1 / -1; }

/* Center: Event Detail */
.event-detail { grid-column: 2; grid-row: 1 / -1; }

/* Right: Correlation / Tracing */
.event-correlation { grid-column: 3; grid-row: 1 / -1; }
```

### 14.2 Live Event Stream (Left)

```typescript
interface EventStreamProps {
  filters: EventFilters;
  onEventSelect: (event: DomainEvent) => void;
  paused: boolean;
  bufferSize: number;
}

// Features:
// - Real-time WebSocket feed
// - Pause/Resume
// - Buffer (last 1000 events)
// - Color-coded by type/severity
// - Expandable payload
// - Copy event ID / trace ID
// - Filter toolbar (type, source, tenant, workspace, time range)
// - Search within buffer
// - Export buffer (JSONL)
// - Auto-scroll toggle
// - Event rate indicator (events/sec)
```

### 14.3 Event Filters

```typescript
interface EventFilters {
  eventTypes: string[];        // multi-select
  sources: string[];           // multi-select
  tenants: TenantId[];         // multi-select
  workspaces: WorkspaceId[];   // multi-select
  executions: WorkflowExecutionId[]; // multi-select
  correlations: CorrelationId[];     // multi-select
  timeRange: { from: Date; to: Date };
  textSearch: string;          // payload search
  severity: string[];          // for alert events
}

// Quick filter chips above stream
```

### 14.4 Event Detail (Center)

```typescript
interface EventDetailProps {
  event: DomainEvent;
  onCorrelate: (correlationId: string) => void;
  onReplay: (event: DomainEvent) => void;
}

// Tabs:
interface EventDetailTabs {
  payload: 'Payload';
  metadata: 'Metadata';
  trace: 'Trace';
  correlations: 'Correlations';
  replay: 'Replay';
}

// Payload Tab:
// - JSON tree viewer (expand/collapse, search, copy path)
// - Syntax highlighting
// - Schema validation indicator
// - Diff vs previous event (for same aggregate)

// Metadata Tab:
// - All metadata fields (structured)
// - Links to related resources (execution, workflow, user, etc.)

// Trace Tab:
// - OpenTelemetry trace waterfall
// - Span details on click
// - Service map

// Correlations Tab:
// - Related events (same correlationId, causationId)
// - Event chain visualization
// - Filter by relationship type

// Replay Tab:
// - Replay this event
// - Replay from this event
// - Modify payload before replay
// - Dry-run option
```

### 14.5 Correlation Panel (Right)

```typescript
interface CorrelationPanelProps {
  correlationId: CorrelationId;
  events: DomainEvent[];
  onEventSelect: (event: DomainEvent) => void;
}

// Visualization:
// - Timeline of events in correlation
// - Service/Component swimlanes
// - Error propagation path
// - Duration analysis
// - Bottleneck identification
```

---

## 15. Variables & Secrets

### 15.1 Layout

```css
.vars-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Variable/Secret Browser */
.vars-browser { grid-column: 1; grid-row: 1 / -1; }

/* Right: Detail / Editor */
.vars-detail { grid-column: 2; grid-row: 1 / -1; }
```

### 15.2 Variable Browser (Left)

```typescript
interface VariableBrowserProps {
  scope: 'global' | 'workspace' | 'workflow' | 'execution';
  scopeId?: string;
  onVariableSelect: (variable: Variable) => void;
  onCreate: () => void;
}

// Toolbar:
// [Scope ▼] [Search 🔍] [Filter: Type/Encrypted/Readonly] [New Variable +]

// Table:
| Name | Type | Value | Scope | Encrypted | Readonly | Usage | Actions |
```

### 15.3 Variable Detail (Right)

```typescript
interface VariableDetailProps {
  variable: Variable;
  onSave: (variable: Variable) => void;
  onDelete: () => void;
  onResolve: (executionId: string) => void;
}

// Form:
// - Name (readonly if not new)
// - Type (dropdown)
// - Value (editor based on type)
// - Scope (dropdown)
// - Encrypted (toggle)
// - Readonly (toggle)
// - Validation Rules (add/remove)
// - Description
// - Tags
// - Usage Graph (which workflows/nodes reference this)
// - Resolution History (per execution)
```

### 15.4 Secret Browser

```typescript
interface SecretBrowserProps {
  scope: 'global' | 'workspace' | 'workflow' | 'execution';
  scopeId?: string;
  onSecretSelect: (secret: Secret) => void;
  onCreate: () => void;
}

// Toolbar similar to variables
// Additional filters: Rotation Status, Expiry, Vault Provider

// Table:
| Name | Type | Scope | Rotation | Vault | Masking | Expires | Usage | Actions |
```

### 15.5 Secret Detail

```typescript
interface SecretDetailProps {
  secret: Secret;
  onSave: (secret: Secret) => void;
  onDelete: () => void;
  onRotate: () => void;
  onResolve: (executionId: string) => void;
}

// Form:
// - Name, Type, Description
// - Scope
// - Rotation Policy (enabled, interval, auto-rotate, notify)
// - Vault Integration (provider, path, auth)
// - Masking Mode
// - Tags
// - Rotation History
// - Access Log (who, when, execution)
// - Expiry Warning
// - Actions: Rotate Now, Test Resolution, View Access Log
```

### 15.6 Environment Manager

```typescript
interface EnvironmentManagerProps {
  environments: Environment[];
  onCreate: () => void;
  onSelect: (env: Environment) => void;
}

// List:
// ┌─────────────────────────────────────────────────────────────┐
// │ 🟢 production          [Active]    Variables: 45  Secrets: 12 │
// │    Inherits: base                                              │
// │    Targets: k8s-prod (cluster)                                │
// ├─────────────────────────────────────────────────────────────┤
// │ 🟡 staging             [Active]    Variables: 38  Secrets: 10 │
// │    Inherits: base                                              │
// │    Targets: k8s-staging (cluster)                             │
// ├─────────────────────────────────────────────────────────────┤
// │ ⚪ development         [Inactive]  Variables: 25  Secrets: 5  │
// │    Inherits: base                                              │
// └─────────────────────────────────────────────────────────────┘

// Detail: Variable/Secret overrides, Deployment targets, Validation
```

---

## 16. Notifications

### 16.1 Layout

```css
.notifications-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

.notifications-tabs {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
```

### 16.2 Tabs

| Tab | Description |
|-----|-------------|
| **Rules** | Notification rules (when, channel, template, recipients) |
| **Channels** | Configured channels (email, Slack, Teams, webhook, etc.) |
| **Templates** | Message templates with variables |
| **History** | Sent/failed/delivered notifications |
| **Escalation** | Escalation policies for approvals/alerts |

### 16.3 Notification Rules

```typescript
interface NotificationRule {
  id: string;
  name: string;
  events: string[];           // event types to trigger on
  conditions: LogicalExpression; // additional filtering
  channels: NotificationChannelConfig[]; // channel + config per channel
  recipients: RecipientConfig[]; // static/dynamic recipients
  templateId: string;
  enabled: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  throttleMs?: number;        // prevent spam
  batchWindowMs?: number;     // batch multiple events
}

// Channel Config:
interface NotificationChannelConfig {
  type: NotificationChannel;
  config: Record<string, any>; // webhook URL, Slack channel, email template, etc.
  enabled: boolean;
}

// Recipient Config:
interface RecipientConfig {
  type: 'static' | 'dynamic' | 'role' | 'assignee' | 'owner';
  value: string; // email, user ID, role name, etc.
  dynamicHandler?: string; // for dynamic resolution
}
```

### 16.4 Template Editor

```typescript
interface TemplateEditorProps {
  template: NotificationTemplate;
  onSave: (template: NotificationTemplate) => void;
  availableVariables: TemplateVariable[];
  onPreview: (data: Record<string, any>) => void;
}

// Features:
// - Subject/Body editors (markdown + variables)
// - Variable autocomplete ({{variableName}})
// - Preview pane with sample data
// - Channel-specific overrides
// - Localization support
// - Version history
```

### 16.5 History

```typescript
interface NotificationHistoryFilters {
  status: ('pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'suppressed')[];
  channel: NotificationChannel[];
  recipient: string;
  dateRange: { from: Date; to: Date };
  templateId: string;
  alertId: string;
  approvalRequestId: string;
}

// Table:
// | Timestamp | Channel | Recipient | Subject | Status | Retry | Error | Actions |
```

---

## 17. Analytics

### 17.1 Layout

```css
.analytics-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Report Navigator */
.analytics-nav { grid-column: 1; grid-row: 1 / -1; }

/* Right: Report View */
.analytics-report { grid-column: 2; grid-row: 1 / -1; }
```

### 17.2 Report Categories

```typescript
interface AnalyticsCategory {
  id: string;
  label: string;
  icon: string;
  reports: AnalyticsReport[];
}

const ANALYTICS_CATEGORIES: AnalyticsCategory[] = [
  {
    id: 'workflow',
    label: 'Workflow Analytics',
    icon: 'git-branch',
    reports: [
      { id: 'exec-volume', label: 'Execution Volume', type: 'line' },
      { id: 'success-rate', label: 'Success Rate', type: 'gauge' },
      { id: 'duration-dist', label: 'Duration Distribution', type: 'histogram' },
      { id: 'node-performance', label: 'Node Performance', type: 'bar' },
      { id: 'failure-analysis', label: 'Failure Analysis', type: 'sunburst' },
      { id: 'retry-patterns', label: 'Retry Patterns', type: 'heatmap' },
    ]
  },
  {
    id: 'execution',
    label: 'Execution Analytics',
    icon: 'play-circle',
    reports: [
      { id: 'exec-trends', label: 'Execution Trends', type: 'line' },
      { id: 'queue-metrics', label: 'Queue Metrics', type: 'multi-line' },
      { id: 'worker-util', label: 'Worker Utilization', type: 'area' },
      { id: 'parallel-efficiency', label: 'Parallel Efficiency', type: 'scatter' },
    ]
  },
  {
    id: 'reliability',
    label: 'Reliability',
    icon: 'shield',
    reports: [
      { id: 'availability', label: 'Availability', type: 'slo' },
      { id: 'error-budget', label: 'Error Budget', type: 'burn-rate' },
      { id: 'mttr', label: 'MTTR', type: 'trend' },
      { id: 'compensation-rate', label: 'Compensation Rate', type: 'bar' },
    ]
  },
  {
    id: 'cost',
    label: 'Cost Analysis',
    icon: 'dollar-sign',
    reports: [
      { id: 'cost-breakdown', label: 'Cost Breakdown', type: 'stacked-area' },
      { id: 'cost-per-workflow', label: 'Cost per Workflow', type: 'bar' },
      { id: 'cost-forecast', label: 'Cost Forecast', type: 'forecast' },
      { id: 'token-usage', label: 'Token Usage', type: 'line' },
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: 'zap',
    reports: [
      { id: 'latency-percentiles', label: 'Latency Percentiles', type: 'percentiles' },
      { id: 'throughput', label: 'Throughput', type: 'line' },
      { id: 'resource-util', label: 'Resource Utilization', type: 'multi-line' },
      { id: 'bottlenecks', label: 'Bottlenecks', type: 'ranking' },
    ]
  },
  {
    id: 'custom',
    label: 'Custom Reports',
    icon: 'plus-circle',
    reports: []
  }
];
```

### 17.3 Report View Components

```typescript
interface ReportViewProps {
  report: AnalyticsReport;
  timeRange: TimeRange;
  filters: AnalyticsFilters;
  onExport: (format: 'png' | 'pdf' | 'csv' | 'json') => void;
  onSchedule: (schedule: ReportSchedule) => void;
}

// Common Report Elements:
// - Header: Title, Description, Last Updated, Refresh Button
// - Time Range Picker (1h, 6h, 24h, 7d, 30d, 90d, Custom)
// - Filters Drawer (tenant, workspace, workflow, env, etc.)
// - Chart/Visualization (responsive, interactive)
// - Data Table (toggleable, sortable, exportable)
// - Annotations (deployments, incidents, config changes)
// - Actions: Export, Schedule, Share, Duplicate, Delete
```

### 17.4 Custom Report Builder

```typescript
interface CustomReportBuilderProps {
  onSave: (report: CustomReport) => void;
  availableMetrics: MetricDefinition[];
  availableDimensions: DimensionDefinition[];
}

// Steps:
// 1. Select Metrics (multi-select, with aggregations)
// 2. Select Dimensions (group by)
// 3. Select Filters
// 4. Choose Visualization Type
// 5. Configure Axes/Legends/Colors
// 6. Preview
// 6. Save + Schedule
```

---

## 18. SLA Dashboard

### 18.1 Layout

```css
.sla-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
}

/* Row 1: SLO Cards (4) */
.slo-card { grid-column: span 1; }

/* Row 2: Error Budget Cards (4) */
.budget-card { grid-column: span 1; }

/* Row 3: Detailed Views */
.slo-detail { grid-column: span 4; }
```

### 18.2 SLO Cards

```typescript
interface SLOCardProps {
  slo: SLO;
  currentValue: number;
  status: 'healthy' | 'warning' | 'critical';
  burnRate?: BurnRate[];
  onClick: () => void;
}

// Visual:
// ┌─────────────────────────────────────┐
// │ Workflow Execution Availability     │
// │ ████████████████░░  99.2% / 99.9%  │
// │ Error Budget:  67% remaining        │
// │ Burn Rate:  1.2x (1h)  0.8x (6h)   │
// │ Status: ⚠ Warning                   │
// └─────────────────────────────────────┘
```

### 18.3 Error Budget Policy

```typescript
interface ErrorBudgetPanelProps {
  slos: SLO[];
  policies: ErrorBudgetPolicy[];
  onPolicyChange: (policy: ErrorBudgetPolicy) => void;
}

// Features:
// - Budget remaining % per SLO
// - Burn rate alerting (multi-window)
// - Exhaustion prediction
// - Automated freeze threshold
// - Policy editor (alerting, burn rate windows, exhaustion)
```

### 18.4 SLA Detail View

```typescript
interface SLADetailProps {
  slo: SLO;
  timeRange: TimeRange;
}

// Tabs:
interface SLADetailTabs {
  trend: 'Trend';           // SLI over time with target line
  budget: 'Error Budget';   // Budget consumption over time
  breaches: 'Breaches';     // Breach events, duration, root cause
  burnRate: 'Burn Rate';    // Multi-window burn rate chart
  availability: 'Availability'; // Uptime calendar
}
```

---

## 19. Operations Center

### 19.1 Layout

```css
.ops-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Operations Navigator */
.ops-nav { grid-column: 1; grid-row: 1 / -1; }

/* Right: Operation Panel */
.ops-panel { grid-column: 2; grid-row: 1 / -1; }
```

### 19.2 Operations Categories

```typescript
interface OperationsCategory {
  id: string;
  label: string;
  icon: string;
  operations: Operation[];
}

const OPERATIONS_CATEGORIES: OperationsCategory[] = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: 'wrench',
    operations: [
      { id: 'drain-queues', label: 'Drain Queues', risk: 'low' },
      { id: 'pause-schedules', label: 'Pause All Schedules', risk: 'low' },
      { id: 'drain-workers', label: 'Drain Worker Pools', risk: 'medium' },
      { id: 'rotate-secrets', label: 'Rotate All Secrets', risk: 'medium' },
      { id: 'rebalance-queues', label: 'Rebalance Queue Partitions', risk: 'high' },
      { id: 'vacuum-db', label: 'Vacuum Database', risk: 'high' },
    ]
  },
  {
    id: 'deployments',
    label: 'Deployments',
    icon: 'rocket',
    operations: [
      { id: 'deploy-workflow', label: 'Deploy Workflow', risk: 'medium' },
      { id: 'rollback-workflow', label: 'Rollback Workflow', risk: 'high' },
      { id: 'blue-green', label: 'Blue-Green Deploy', risk: 'high' },
      { id: 'canary', label: 'Canary Deploy', risk: 'high' },
      { id: 'promote-version', label: 'Promote Version', risk: 'medium' },
    ]
  },
  {
    id: 'replay',
    label: 'Replay & Repair',
    icon: 'repeat',
    operations: [
      { id: 'replay-execution', label: 'Replay Execution', risk: 'medium' },
      { id: 'replay-from-checkpoint', label: 'Replay from Checkpoint', risk: 'medium' },
      { id: 'replay-dlq', label: 'Replay Dead Letter Queue', risk: 'high' },
      { id: 'repair-state', label: 'Repair Execution State', risk: 'critical' },
      { id: 'reconcile', label: 'Reconcile State', risk: 'high' },
    ]
  },
  {
    id: 'diagnostics',
    label: 'Diagnostics',
    icon: 'stethoscope',
    operations: [
      { id: 'health-check', label: 'Run Health Checks', risk: 'low' },
      { id: 'collect-diagnostics', label: 'Collect Diagnostics Bundle', risk: 'low' },
      { id: 'trace-analysis', label: 'Trace Analysis', risk: 'low' },
      { id: 'performance-profile', label: 'Performance Profile', risk: 'medium' },
      { id: 'memory-dump', label: 'Heap Dump', risk: 'medium' },
    ]
  },
  {
    id: 'emergency',
    label: 'Emergency Controls',
    icon: 'alert-triangle',
    operations: [
      { id: 'pause-all', label: 'Pause All Executions', risk: 'critical', confirm: true },
      { id: 'cancel-all', label: 'Cancel All Running', risk: 'critical', confirm: true },
      { id: 'stop-workers', label: 'Stop All Workers', risk: 'critical', confirm: true },
      { id: 'disable-triggers', label: 'Disable All Triggers', risk: 'critical', confirm: true },
      { id: 'revoke-sessions', label: 'Revoke All Sessions', risk: 'critical', confirm: true },
    ]
  },
];
```

### 19.3 Operation Execution Modal

```typescript
interface OperationModalProps {
  operation: Operation;
  onExecute: (params: Record<string, any>) => void;
  onCancel: () => void;
}

// Features:
// - Parameter form (validated)
// - Risk indicator (low/medium/high/critical)
// - Confirmation steps for critical operations
// - Dry-run option
// - Progress tracking (real-time)
// - Rollback option (if applicable)
// - Result display (success/failure, logs, artifacts)
// - Audit log entry preview
```

---

## 20. Settings

### 20.1 Tab Structure

```typescript
interface SettingsTabs {
  workspace: 'Workspace';
  defaults: 'Defaults';
  security: 'Security';
  notifications: 'Notifications';
  audit: 'Audit';
  retention: 'Retention';
  integrations: 'Integrations';
  advanced: 'Advanced';
}
```

### 20.2 Workspace Settings

```typescript
interface WorkspaceSettingsForm {
  name: string;
  description: string;
  timezone: string;
  locale: string;
  dateFormat: string;
  defaultWorkflowTimeout: number;
  defaultMaxRetries: number;
  defaultConcurrencyLimit: number;
  defaultPriority: ExecutionPriority;
  executionMode: 'sequential' | 'parallel' | 'hybrid';
  autoCleanup: {
    completedAfterDays: number;
    failedAfterDays: number;
    suspendedAfterDays: number;
  };
  features: {
    enableAI: boolean;
    enableHumanTasks: boolean;
    enableApprovals: boolean;
    enableSchedules: boolean;
    enableTriggers: boolean;
    enableRules: boolean;
    enablePackages: boolean;
  };
}
```

### 20.3 Defaults

```typescript
interface DefaultsSettings {
  workflow: {
    timeout: number;
    maxRetries: number;
    concurrencyLimit: number;
    retryPolicy: RetryPolicyId;
    rollbackPolicy: RollbackPolicyId;
    circuitBreaker: CircuitBreakerId;
    checkpointing: CheckpointConfig;
    logging: LoggingConfig;
    notifications: NotificationConfig;
    security: ExecutionSecurityConfig;
    cost: CostConfig;
  };
  schedule: {
    timezone: string;
    businessCalendar: CalendarId;
    jitter: JitterConfig;
  };
  queue: {
    type: QueueType;
    priorityLevels: number;
    defaultPriority: number;
    maxRetries: number;
    visibilityTimeoutMs: number;
    deadLetterAfterRetries: boolean;
  };
  worker: {
    defaultPoolType: WorkerPoolType;
    defaultResources: ResourceRequirements;
    startupTimeout: number;
    shutdownTimeout: number;
    healthCheck: HealthCheckConfig;
  };
  approval: {
    defaultPolicy: ApprovalPolicyId;
    defaultPriority: 'low' | 'normal' | 'high' | 'urgent';
    defaultDueDateOffset: number;
    escalationPolicy: EscalationPolicyConfig;
    delegationPolicy: DelegationPolicyConfig;
    reminders: ReminderConfig[];
  };
}
```

### 20.4 Security Settings

```typescript
interface SecuritySettings {
  rbac: {
    enabled: boolean;
    defaultRole: string;
    roles: RoleDefinition[];
  };
  abac: {
    enabled: boolean;
    policyEngine: 'opa' | 'cedar';
    policies: ABACPolicy[];
  };
  workflowSigning: {
    enabled: boolean;
    requireForPublish: boolean;
    allowedSigners: string[];
    algorithm: 'rsa-sha256' | 'ecdsa-sha256' | 'ed25519';
    verifyOnExecute: boolean;
  };
  sandbox: {
    enabled: boolean;
    runtime: 'gvisor' | 'kata' | 'firecracker' | 'wasm';
    defaultProfile: string;
  };
  network: {
    defaultPolicy: 'allow' | 'deny';
    allowedEgress: EgressRule[];
    dnsPolicy: 'allow-all' | 'allow-cluster' | 'custom';
  };
  secrets: {
    defaultVaultProvider: string;
    defaultRotationInterval: number;
    defaultMasking: 'full' | 'partial' | 'hash' | 'none';
  };
  rateLimits: {
    global: RateLimitRule;
    perTenant: RateLimitRule;
    perWorkflow: RateLimitRule;
    perUser: RateLimitRule;
  };
  audit: {
    enabled: boolean;
    events: AuditEventType[];
    destination: AuditDestination[];
    retentionDays: number;
    encryption: boolean;
    integrity: boolean;
    realTime: boolean;
  };
}
```

### 20.5 Retention Settings

```typescript
interface RetentionSettings {
  executions: {
    completed: { days: number; action: 'archive' | 'delete' | 'anonymize' };
    failed: { days: number; action: 'archive' | 'delete' | 'anonymize' };
    suspended: { days: number; action: 'archive' | 'delete' | 'anonymize' };
  };
  logs: {
    execution: number;
    audit: number;
    metrics: number;
    events: number;
  };
  snapshots: {
    maxPerExecution: number;
    maxAgeDays: number;
  };
  checkpoints: {
    maxPerExecution: number;
    maxAgeDays: number;
  };
  dlq: {
    maxAgeDays: number;
    maxSize: number;
  };
  notifications: number;
  auditRecords: number;
}
```

### 20.6 Integrations

```typescript
interface IntegrationsSettings {
  agent: { enabled: boolean; config: Record<string, any> };
  skill: { enabled: boolean; config: Record<string, any> };
  plugin: { enabled: boolean; config: Record<string, any> };
  model: { enabled: boolean; config: Record<string, any> };
  mcp: { enabled: boolean; config: Record<string, any> };
  memory: { enabled: boolean; config: Record<string, any> };
  chat: { enabled: boolean; config: Record<string, any> };
  external: {
    github: { enabled: boolean; config: GitHubConfig };
    gitlab: { enabled: boolean; config: GitLabConfig };
    jira: { enabled: boolean; config: JiraConfig };
    slack: { enabled: boolean; config: SlackConfig };
    teams: { enabled: boolean; config: TeamsConfig };
    pagerduty: { enabled: boolean; config: PagerDutyConfig };
    datadog: { enabled: boolean; config: DatadogConfig };
    prometheus: { enabled: boolean; config: PrometheusConfig };
  };
}
```

---

## 21. Global Components

### 21.1 Notification System

```typescript
interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  onAction: (action: string) => void;
}

// Types: success, info, warning, error, loading
// Position: top-right (stacked)
// Actions: View, Dismiss, Retry, Configure
// Auto-dismiss: 5s (success/info), persistent (warning/error)
// Sound: subtle, configurable
```

### 21.2 Command Palette (⌘K)

```typescript
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: Command) => void;
}

// Sections:
// - Recent (last 10)
// - Workflows
// - Executions
// - Schedules
// - Triggers
// - Workers/Queues
// - Human Tasks
// - Settings
// - Navigation
// - Debug

// Features:
// - Fuzzy search
// - Keyboard navigation (↑/↓, Enter, Esc)
// - Command groups with icons
// - Shortcuts displayed
// - Arguments input (for parameterized commands)
// - History
```

### 21.3 Activity Drawer (Right Slide-out)

```typescript
interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  filters: ActivityFilters;
  onFilterChange: (filters: ActivityFilters) => void;
}

// Tabs:
// - All Activity
// - My Activity
// - Workflow Activity
// - Execution Activity
// - System Activity

// Features:
// - Real-time updates (WebSocket)
// - Group by date
// - Expandable details
// - Links to related resources
// - Export
```

### 21.4 Quick Search (Header)

```typescript
interface QuickSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
}

// Features:
// - Debounced search (300ms)
// - Recent searches
// - Suggestions: workflows, executions, workers, queues, schedules, triggers, docs
// - Keyboard: ↑/↓, Enter, Esc
// - Scoped search (type: prefix)
// - Command mode (type: >command)
```

### 21.5 Context Panel (Right Slide-out)

```typescript
interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: PanelContext;
  tabs: ContextTab[];
}

// Context types:
// - Execution Context (variables, secrets, state, trace)
// - Node Context (config, input, output, error, metrics)
// - Workflow Context (variables, secrets, versions, deployments)
// - Queue Context (metrics, partitions, consumers, messages)
// - Worker Context (health, assignments, logs, resources)
// - Approval Context (policy, assignees, form, history)

// Tabs per context:
// - Overview
// - Details
// - Related
// - Actions
```

### 21.6 Property Inspector (Reusable)

```typescript
interface PropertyInspectorProps<T> {
  object: T;
  schema: InspectorSchema;
  onChange: (path: string, value: any) => void;
  validation: ValidationResult;
  readOnly?: boolean;
  sections?: InspectorSection[];
}

// Features:
// - Auto-generated from JSON Schema / TypeScript types
// - Field types: text, number, boolean, select, multiselect, date, datetime, json, code, file, secret
// - Conditional fields
// - Array editors (add/remove/reorder)
// - Object editors (nested)
// - Validation (inline errors)
// - Tooltips / help text
// - Dirty tracking
// - Reset to default
```

### 21.7 Confirmation Dialogs

```typescript
interface ConfirmDialogProps {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'critical';
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  requireInput?: string; // e.g., "Type workflow name to confirm"
  checkbox?: { label: string; required: boolean }; // "I understand this cannot be undone"
  loading?: boolean;
}

// Variants:
// - Standard (Cancel / Confirm)
// - Danger (Cancel / Delete)
// - Critical (Type name / Confirm)
// - With checkbox (acknowledgment)
```

### 21.8 Side Drawers (Reusable)

```typescript
interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'left' | 'right';
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Sizes: sm(320px), md(480px), lg(640px), xl(800px), full(100%)
```

### 21.9 Resizable Panels / Split Views

```typescript
interface SplitViewProps {
  direction: 'horizontal' | 'vertical';
  panes: SplitPane[];
  onResize: (sizes: number[]) => void;
  minSize?: number;
  maxSize?: number;
  persistSizes?: boolean;
}

interface SplitPane {
  id: string;
  size: number; // percentage
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  component: React.ReactNode;
}

// Features:
// - Drag handles
// - Double-click to equalize
// - Keyboard resize (⌘+Arrow)
// - Persist to localStorage
// - Nested splits
```

### 21.10 Live Updates (WebSocket)

```typescript
interface LiveDataProviderProps<T> {
  channel: string;
  filters: Record<string, any>;
  onData: (data: T) => void;
  onError: (error: Error) => void;
  reconnect: boolean;
  reconnectInterval: number;
}

// Features:
// - Auto-reconnect with exponential backoff
// - Message deduplication
// - Optimistic updates
// - Conflict resolution (last-write-wins + server authority)
// - Subscription management
// - Connection status indicator
```

---

## 22. Design System

### 22.1 Color Semantics

```css
:root {
  /* Status Colors */
  --color-status-success: #10b981;
  --color-status-warning: #f59e0b;
  --color-status-error: #ef4444;
  --color-status-info: #3b82f6;
  --color-status-running: #8b5cf6;
  --color-status-pending: #6b7280;
  --color-status-suspended: #f97316;
  --color-status-compensating: #f97316;
  --color-status-cancelled: #6b7280;

  /* Priority Colors */
  --color-priority-low: #6b7280;
  --color-priority-normal: #3b82f6;
  --color-priority-high: #f59e0b;
  --color-priority-urgent: #ef4444;
  --color-priority-critical: #991b1b;

  /* Node Type Colors */
  --color-node-flow: #8b5cf6;
  --color-node-execution: #10b981;
  --color-node-human: #f97316;
  --color-node-data: #3b82f6;
  --color-node-ai: #ec4899;
  --color-node-reliability: #ef4444;

  /* Background Layers */
  --color-bg-0: #0d0d0d;      /* Base */
  --color-bg-1: #141414;      /* Surface */
  --color-bg-2: #1c1c1c;      /* Elevated */
  --color-bg-3: #242424;      /* Overlay */
  --color-bg-4: #2d2d2d;      /* Modal */

  /* Borders */
  --color-border: #333333;
  --color-border-subtle: #262626;
  --color-border-focus: #3b82f6;

  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;
  --color-text-inverse: #0d0d0d;

  /* Accent (Hermes Gold) */
  --color-gold-50: #fefce8;
  --color-gold-100: #fef9c3;
  --color-gold-200: #fef08a;
  --color-gold-300: #fde047;
  --color-gold-400: #facc15;
  --color-gold-500: #eab308;  /* Primary */
  --color-gold-600: #ca8a04;
  --color-gold-700: #a16207;
  --color-gold-800: #854d0e;
  --color-gold-900: #713f12;
}
```

### 22.2 Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --font-ui: var(--font-sans);

  --text-xs: 0.625rem;    /* 10px */
  --text-sm: 0.75rem;     /* 12px */
  --text-base: 0.875rem;  /* 14px */
  --text-lg: 1rem;        /* 16px */
  --text-xl: 1.125rem;    /* 18px */
  --text-2xl: 1.25rem;    /* 20px */
  --text-3xl: 1.5rem;     /* 24px */
  --text-4xl: 2rem;       /* 32px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 22.3 Spacing

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### 22.4 Shadows

```css
:root {
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
  --shadow-2xl: 0 25px 50px rgba(0,0,0,0.15);
  --shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06);
  --shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.4);
}
```

### 22.5 Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;  /* 2px */
  --radius-md: 0.25rem;   /* 4px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
}
```

### 22.6 Component Tokens

```css
/* Buttons */
--btn-height-sm: 28px;
--btn-height-md: 36px;
--btn-height-lg: 44px;
--btn-padding-x-sm: 12px;
--btn-padding-x-md: 16px;
--btn-padding-x-lg: 24px;
--btn-font-size: var(--text-sm);
--btn-font-weight: var(--font-weight-medium);
--btn-radius: var(--radius-md);

/* Inputs */
--input-height-sm: 28px;
--input-height-md: 36px;
--input-height-lg: 44px;
--input-padding-x: 12px;
--input-font-size: var(--text-sm);
--input-border-width: 1px;
--input-radius: var(--radius-md);

/* Tables */
--table-cell-padding-y: 8px;
--table-cell-padding-x: 12px;
--table-header-height: 40px;
--table-row-height: 44px;
--table-stripe-bg: var(--color-bg-1);

/* Cards */
--card-padding: var(--space-4);
--card-radius: var(--radius-lg);
--card-border: 1px solid var(--color-border);
--card-shadow: var(--shadow-sm);

/* Tabs */
--tab-height: 40px;
--tab-padding-x: 16px;
--tab-indicator-height: 2px;
--tab-indicator-color: var(--color-gold-500);

/* Badges */
--badge-height: 20px;
--badge-padding-x: 8px;
--badge-font-size: var(--text-xs);
--badge-radius: var(--radius-full);

/* Tooltips */
--tooltip-delay: 200ms;
--tooltip-max-width: 320px;
--tooltip-bg: var(--color-bg-4);
--tooltip-text: var(--color-text-primary);
--tooltip-radius: var(--radius-md);
--tooltip-shadow: var(--shadow-lg);
```

---

## 23. Interaction Design

### 23.1 Keyboard Shortcuts (Global)

| Shortcut | Action | Context |
|----------|--------|---------|
| `⌘K` | Command Palette | Global |
| `⌘/` | Quick Search | Global |
| `⌘⇧A` | My Approvals | Global |
| `⌘⇧E` | Start Execution | Global |
| `⌘⇧S` | Create Schedule | Global |
| `⌘⇧N` | New Workflow | Registry/Designer |
| `⌘S` | Save | Designer/Forms |
| `⌘Z` / `⌘⇧Z` | Undo/Redo | Designer/Forms |
| `⌘C` / `⌘V` | Copy/Paste | Designer |
| `⌘D` | Duplicate | Designer |
| `Delete` | Delete | Designer/Lists |
| `⌘A` | Select All | Designer/Lists |
| `⌘↑/↓/←/→` | Navigate/Move | Designer/Tree |
| `Enter` | Open/Edit | Lists/Designer |
| `Esc` | Close/Cancel/Deselect | Global |
| `⌘⇧V` | Validate | Designer |
| `⌘⇧R` | Run Simulation | Designer |
| `⌘⇧P` | Publish | Designer/Registry |
| `⌘⇧D` | Deploy | Designer/Registry |
| `⌘+/-` / `⌘0` | Zoom In/Out/Fit | Designer/Graph |
| `Space + Drag` | Pan | Canvas/Graph |
| `⌘⇧F` | Find | Designer/Code |
| `⌘⇧M` | Toggle Mini-map | Designer |
| `⌘⇧L` | Toggle Layout | Designer |
| `F2` | Rename | Designer/Lists |
| `F11` | Step Into | Execution Debug |
| `F10` | Step Over | Execution Debug |
| `⇧F11` | Step Out | Execution Debug |
| `⌘⇧P` | Pause | Execution |
| `⌘⇧R` | Resume | Execution |
| `⌘⇧X` | Cancel | Execution |
| `⌘⇧T` | Retry | Execution |
| `⌘⇧B` | Rollback | Execution |

### 23.2 Drag-and-Drop

| Source | Target | Behavior |
|--------|--------|----------|
| Palette Node | Canvas | Create node at drop position |
| Canvas Node | Canvas Node (port) | Create connection |
| Canvas Node | Canvas Node (body) | Reorder (in sequential/parallel) |
| Canvas Node | Group | Add to group |
| Group | Group | Nest groups |
| File | Canvas | Import workflow |
| File | Drop Zone | Upload (attachments, import) |
| Table Row | Table Row | Reorder (priority, order) |
| Tree Node | Tree Node | Move (folders, workflows) |

### 23.3 Bulk Editing

```typescript
interface BulkEditBarProps {
  selectedCount: number;
  selectedIds: string[];
  actions: BulkAction[];
  onAction: (action: BulkAction, ids: string[]) => void;
  onClear: () => void;
}

// Actions per resource:
// Workflows: Archive, Publish, Deploy, Export, Delete, Change Owner, Add Tag
// Executions: Cancel, Retry, Replay, Export Logs
// Schedules: Enable, Disable, Pause, Resume, Delete
// Triggers: Enable, Disable, Delete
// Approvals: Approve, Reject, Escalate, Delegate
// Workers: Drain, Restart, Terminate
// Queues: Pause, Resume, Drain, Purge DLQ
```

### 23.4 Inline Editing

```typescript
interface InlineEditProps<T> {
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  validator?: (value: T) => ValidationResult;
  renderInput: (props: InputRenderProps) => React.ReactNode;
  renderDisplay: (value: T) => React.ReactNode;
}

// Triggers: Click (text), Double-click (code/json), Enter (focus)
// Save: Enter, Blur, ⌘Enter
// Cancel: Esc
// Validation: Inline error, prevent save if invalid
```

### 23.5 Autosave

```typescript
interface AutosaveConfig {
  enabled: boolean;
  intervalMs: number;          // 30000 (30s)
  debounceMs: number;          // 1000
  maxRetries: number;          // 3
  retryDelayMs: number;        // 5000
  onSave: (data: any) => Promise<void>;
  onConflict: (serverData: any, localData: any) => ConflictResolution;
  onError: (error: Error) => void;
}

// Features:
// - Dirty state indicator (●)
// - Save status: Saving... / Saved / Failed
// - Conflict resolution (server wins / merge / manual)
// - Offline queue (IndexedDB)
// - Recovery on reconnect
```

### 23.6 Undo/Redo

```typescript
interface UndoRedoManager {
  history: HistoryEntry[];
  index: number;
  maxHistory: number;        // 100
  push: (entry: HistoryEntry) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

// History Entry:
interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: 'create' | 'update' | 'delete' | 'move' | 'connect' | 'group' | 'property';
  targetId: string;
  before: any;
  after: any;
  metadata: Record<string, any>;
}

// Keyboard: ⌘Z / ⌘⇧Z
// Toolbar buttons with dropdown history
```

### 23.7 Context Menus

```typescript
interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  trigger: 'right-click' | 'long-press' | 'keyboard';
}

interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
  shortcut?: string;
  dangerous?: boolean;
}

// Trigger: Right-click, ⌘+Click, Shift+F10, Long-press (touch)
// Position: Cursor (clamped to viewport)
// Dismiss: Click outside, Esc, Scroll, Resize
```

### 23.8 Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG 2.1 AA** | All components compliant |
| **Keyboard Navigation** | Full tab order, focus visible, skip links |
| **Screen Readers** | ARIA labels, roles, live regions, landmarks |
| **Color Contrast** | 4.5:1 normal, 3:1 large text |
| **Focus Management** | Trap in modals, restore on close |
| **Reduced Motion** | Respect `prefers-reduced-motion` |
| **High Contrast** | Support `prefers-contrast: high` |
| **Zoom** | Functional at 200% zoom |
| **Language** | `lang` attribute, RTL support |

---

## 24. State Management

### 24.1 Architecture (Zustand + React Query)

```typescript
interface StoreArchitecture {
  // Server State (React Query / TanStack Query)
  queries: {
    workflows: UseQueryResult<Workflow[]>;
    workflow: UseQueryResult<Workflow>;
    executions: UseQueryResult<WorkflowExecution[]>;
    execution: UseQueryResult<WorkflowExecution>;
    schedules: UseQueryResult<Schedule[]>;
    triggers: UseQueryResult<Trigger[]>;
    queues: UseQueryResult<Queue[]>;
    workers: UseQueryResult<Worker[]>;
    approvals: UseQueryResult<ApprovalRequest[]>;
    humanTasks: UseQueryResult<HumanTask[]>;
    metrics: UseQueryResult<Metrics>;
    slos: UseQueryResult<SLO[]>;
  };

  // Mutations (React Query)
  mutations: {
    createWorkflow: UseMutationResult;
    updateWorkflow: UseMutationResult;
    startExecution: UseMutationResult;
    cancelExecution: UseMutationResult;
    retryNode: UseMutationResult;
    createSchedule: UseMutationResult;
    registerTrigger: UseMutationResult;
    decideApproval: UseMutationResult;
    completeHumanTask: UseMutationResult;
  };

  // Client State (Zustand)
  ui: {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    activeTab: string;
    commandPaletteOpen: boolean;
    activityDrawerOpen: boolean;
    contextPanelOpen: boolean;
    contextPanelContext: PanelContext | null;
    notifications: NotificationToast[];
    toasts: Toast[];
    modals: ModalStack[];
    drawers: DrawerStack[];
    splitViewSizes: Record<string, number[]>;
    theme: 'dark' | 'light' | 'system';
    locale: string;
    timezone: string;
  };

  // Optimistic Updates
  optimistic: {
    workflows: Map<string, Workflow>;
    executions: Map<string, WorkflowExecution>;
    variables: Map<string, Variable>;
    approvals: Map<string, ApprovalRequest>;
  };

  // Real-time (WebSocket)
  realtime: {
    connected: boolean;
    subscriptions: Map<string, WebSocketSubscription>;
    eventBuffer: DomainEvent[];
    metricsStream: Metrics[];
    executionUpdates: Map<string, ExecutionUpdate>;
  };
}
```

### 24.2 Offline Mode

```typescript
interface OfflineManager {
  enabled: boolean;
  pendingMutations: OfflineMutation[];
  pendingReads: OfflineRead[];
  syncOnReconnect: boolean;
  conflictStrategy: 'server-wins' | 'client-wins' | 'merge' | 'manual';
  storage: 'indexeddb' | 'localstorage';
  maxOfflineTime: number; // 24h
  maxPendingMutations: number; // 1000
}

// Features:
// - Queue mutations offline
// - Cache reads (stale-while-revalidate)
// - Background sync on reconnect
// - Conflict resolution UI
// - Offline indicator (banner)
// - Data freshness indicators
```

### 24.3 Real-time Synchronization

```typescript
interface RealtimeSync {
  channels: {
    executions: 'execution:*';
    workflows: 'workflow:*';
    queues: 'queue:*';
    workers: 'worker:*';
    approvals: 'approval:*';
    humanTasks: 'task:*';
    alerts: 'alert:*';
    metrics: 'metrics:*';
  };
  filters: {
    tenantId: TenantId;
    workspaceId: WorkspaceId;
    workflowIds?: WorkflowId[];
    executionIds?: WorkflowExecutionId[];
  };
  handlers: {
    onExecutionUpdate: (update: ExecutionUpdate) => void;
    onWorkflowChange: (change: WorkflowChange) => void;
    onQueueMetric: (metric: QueueMetric) => void;
    onWorkerHealth: (health: WorkerHealth) => void;
    onApprovalChange: (change: ApprovalChange) => void;
    onTaskChange: (change: TaskChange) => void;
    onAlert: (alert: Alert) => void;
    onMetric: (metric: MetricDataPoint) => void;
  };
  reconnect: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    jitter: boolean;
  };
}
```

### 24.4 Caching Strategy

```typescript
interface CacheStrategy {
  // Query Cache (React Query)
  queries: {
    staleTime: number;           // 30s
    cacheTime: number;           // 5min
    refetchOnWindowFocus: boolean; // true
    refetchOnReconnect: boolean;   // true
    retry: number;               // 3
    retryDelay: number;          // exponential
  };

  // Mutation Cache
  mutations: {
    cacheTime: number;           // 5min
    onError: 'rollback' | 'retry' | 'none';
  };

  // Client State
  client: {
    maxAge: number;              // 10min
    maxSize: number;             // 1000 entries
    eviction: 'lru' | 'lfu' | 'fifo';
  };

  // Real-time
  realtime: {
    bufferSize: number;          // 1000
    flushInterval: number;       // 100ms
    dedupeWindow: number;        // 50ms
  };
}
```

### 24.5 Error Handling

```typescript
interface ErrorBoundary {
  // Global Error Boundary
  fallback: React.ReactNode;
  onError: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys: unknown[];
  onReset: () => void;
}

// Error Types:
type AppError = 
  | NetworkError
  | ValidationError
  | AuthorizationError
  | NotFoundError
  | ConflictError
  | ServerError
  | TimeoutError
  | WebSocketError;

// Handling:
// - Global error boundary (capture, report, UI)
// - Query error boundaries (per section)
// - Mutation error toasts
// - WebSocket reconnection UI
// - Offline banner
// - Retry with exponential backoff
// - Error reporting (Sentry)
```

---

## 25. API Integration

### 25.1 API Client Configuration

```typescript
interface ApiClientConfig {
  baseUrl: string;
  timeout: number;           // 30000
  retries: number;           // 3
  retryDelay: (attempt: number) => number; // exponential
  headers: {
    'Content-Type': 'application/json';
    'Accept': 'application/json';
    'X-Request-ID': string;  // per request
    'X-Trace-ID': string;    // for distributed tracing
  };
  interceptors: {
    request: (config) => config;
    response: (response) => response;
    error: (error) => Promise<never>;
  };
}
```

### 25.2 Component-to-API Mapping

| UI Component | API Endpoints |
|--------------|---------------|
| **Global Dashboard** | `GET /monitor/health`, `GET /analytics/executions`, `GET /queues/metrics`, `GET /workers/metrics`, `GET /monitor/slos`, `GET /monitor/alerts`, `GET /analytics/heatmap`, `WS /events/stream` |
| **Workflow Registry** | `GET/POST /workflows`, `GET/PATCH/DELETE /workflows/{id}`, `POST /workflows/{id}/versions`, `POST /workflows/{id}/validate`, `POST /workflows/import`, `POST /workflows/export` |
| **Workflow Designer** | `GET /workflows/{id}/versions/{version}`, `POST /workflows/{id}/validate`, `POST /workflows/{id}/dry-run`, `POST /workflows/{id}/simulate`, `POST /workflows/{id}/versions/{version}/publish`, `POST /workflows/{id}/deploy` |
| **Workflow Detail** | `GET /workflows/{id}`, `GET /workflows/{id}/versions`, `GET /workflows/{id}/executions`, `GET /workflows/{id}/analytics`, `GET /workflows/{id}/audit`, `GET /workflows/{id}/deployments` |
| **Execution Monitor** | `GET /executions/{id}`, `GET /executions/{id}/state`, `GET /executions/{id}/nodes`, `GET /executions/{id}/logs`, `GET /executions/{id}/snapshots`, `GET /executions/{id}/cost`, `POST /executions/{id}/pause`, `POST /executions/{id}/resume`, `POST /executions/{id}/cancel`, `POST /executions/{id}/retry`, `POST /executions/{id}/rollback`, `POST /executions/{id}/snapshot`, `POST /executions/{id}/restore` |
| **Scheduler** | `GET/POST/PATCH/DELETE /schedules`, `POST /schedules/{id}/trigger`, `GET /schedules/{id}/next-runs`, `POST/GET/PATCH/DELETE /calendars`, `POST /cron/validate`, `POST /cron/next-occurrences` |
| **Trigger Manager** | `GET/POST/PATCH/DELETE /triggers`, `POST /triggers/{id}/enable`, `POST /triggers/{id}/disable`, `POST /triggers/{id}/test`, `GET/POST/DELETE /triggers/{id}/subscriptions` |
| **Queue Manager** | `GET/POST/PATCH/DELETE /queues`, `POST /queues/{id}/pause`, `POST /queues/{id}/resume`, `GET /queues/{id}/metrics`, `POST/GET/DELETE /queues/{id}/messages`, `POST/GET/PATCH/DELETE /dead-letter-queues`, `POST /dead-letter-queues/{id}/reprocess` |
| **Worker Management** | `GET/POST/PATCH/DELETE /worker-pools`, `GET /worker-pools/{id}/workers`, `POST /worker-pools/{id}/scale` |
| **Rule Engine** | `GET/POST/PATCH/DELETE /rules`, `POST /rules/{id}/evaluate`, `POST /rules/{id}/compile`, `GET/POST/PATCH/DELETE /decision-tables`, `POST /decision-tables/{id}/evaluate`, `GET/POST/PATCH/DELETE /policies`, `POST /policies/{id}/evaluate` |
| **Human Tasks** | `GET /approval-requests`, `GET /approval-requests/{id}`, `POST /approval-requests/{id}/decide`, `POST /approval-requests/{id}/delegate`, `GET /human-tasks`, `POST /human-tasks/{id}/complete`, `POST /human-tasks/{id}/reject` |
| **Event Explorer** | `POST /events/publish`, `POST /events/subscribe`, `GET /events/streams/{streamId}`, `GET /events/streams/{streamId}/metadata` |
| **Variables/Secrets** | `GET/POST/PATCH/DELETE /variables`, `POST /variables/{id}/resolve`, `GET/POST/PATCH/DELETE /secrets`, `POST /secrets/{id}/rotate`, `GET/POST/PATCH/DELETE /environments` |
| **Notifications** | `GET/POST/PATCH/DELETE /notifications/rules`, `GET/POST/PATCH/DELETE /notifications/channels`, `GET/POST/PATCH/DELETE /notifications/templates`, `GET /notifications/history` |
| **Analytics** | `GET /analytics/executions`, `GET /analytics/costs`, `GET /analytics/performance`, `GET /analytics/forecast`, `POST /analytics/export` |
| **SLA Dashboard** | `GET /monitor/slos`, `GET /monitor/health`, `GET /monitor/metrics`, `GET /monitor/alerts` |
| **Operations Center** | `POST /operations/install`, `POST /operations/remove`, `POST /operations/update`, `POST /operations/rollback`, `POST /operations/validate`, `POST /operations/sign` |
| **Settings** | `GET/PUT/DELETE /admin/config/{scope}/{key}`, `GET/POST/PATCH/DELETE /admin/tenants`, `GET/POST/PATCH/DELETE /admin/workspaces`, `GET/POST/PATCH/DELETE /admin/policies`, `GET/POST /admin/backups`, `POST /admin/restore` |

---

## 26. Component Hierarchy

```mermaid
graph TD
    App[App] --> Providers[Providers]
    Providers --> QueryClient[QueryClientProvider]
    Providers --> ThemeProvider[ThemeProvider]
    Providers --> AuthProvider[AuthProvider]
    Providers --> RealtimeProvider[RealtimeProvider]
    Providers --> OfflineProvider[OfflineProvider]
    Providers --> ErrorBoundary[ErrorBoundary]
    
    ErrorBoundary --> Router[Router]
    Router --> Layout[WorkspaceLayout]
    
    Layout --> TopBar[TopBar]
    Layout --> Sidebar[Sidebar]
    Layout --> Main[MainContent]
    Layout --> ContextPanel[ContextPanel]
    Layout --> ActivityDrawer[ActivityDrawer]
    Layout --> CommandPalette[CommandPalette]
    Layout --> Toasts[ToastContainer]
    Layout --> Modals[ModalStack]
    Layout --> Drawers[DrawerStack]
    
    Main --> Dashboard[DashboardPage]
    Main --> Registry[RegistryPage]
    Main --> Designer[DesignerPage]
    Main --> Execution[ExecutionPage]
    Main --> Scheduler[SchedulerPage]
    Main --> Triggers[TriggersPage]
    Main --> Queues[QueuesPage]
    Main --> Workers[WorkersPage]
    Main --> Rules[RulesPage]
    Main --> HumanTasks[HumanTasksPage]
    Main --> Events[EventsPage]
    Main --> Variables[VariablesPage]
    Main --> Notifications[NotificationsPage]
    Main --> Analytics[AnalyticsPage]
    Main --> SLA[SLAPage]
    Main --> Operations[OperationsPage]
    Main --> Settings[SettingsPage]
    
    %% Designer Components
    Designer --> DesignerToolbar[DesignerToolbar]
    Designer --> DesignerPalette[DesignerPalette]
    Designer --> DesignerCanvas[DesignerCanvas]
    Designer --> DesignerInspector[DesignerInspector]
    Designer --> DesignerValidation[DesignerValidation]
    DesignerCanvas --> NodeRenderer[NodeRenderer]
    DesignerCanvas --> EdgeRenderer[EdgeRenderer]
    DesignerCanvas --> MiniMap[MiniMap]
    DesignerCanvas --> GridOverlay[GridOverlay]
    DesignerInspector --> ConfigTab[ConfigTab]
    DesignerInspector --> InputsTab[InputsTab]
    DesignerInspector --> OutputsTab[OutputsTab]
    DesignerInspector --> ConditionsTab[ConditionsTab]
    DesignerInspector --> RetriesTab[RetriesTab]
    DesignerInspector --> CompensationTab[CompensationTab]
    DesignerInspector --> AdvancedTab[AdvancedTab]
    DesignerInspector --> DocsTab[DocsTab]
    
    %% Execution Components
    Execution --> ExecutionToolbar[ExecutionToolbar]
    Execution --> ExecutionTimeline[ExecutionTimeline]
    Execution --> ExecutionGraph[ExecutionGraph]
    Execution --> ExecutionInspector[ExecutionInspector]
    Execution --> ExecutionLogs[ExecutionLogs]
    ExecutionGraph --> ExecNodeRenderer[ExecNodeRenderer]
    ExecutionGraph --> ExecEdgeRenderer[ExecEdgeRenderer]
    ExecutionInspector --> ExecNodeTab[ExecNodeTab]
    ExecutionInspector --> ExecVariablesTab[ExecVariablesTab]
    ExecutionInspector --> ExecStateTab[ExecStateTab]
    ExecutionInspector --> ExecTraceTab[ExecTraceTab]
    ExecutionInspector --> ExecCostTab[ExecCostTab]
    ExecutionInspector --> ExecResourcesTab[ExecResourcesTab]
    
    %% Registry Components
    Registry --> RegistryToolbar[RegistryToolbar]
    Registry --> RegistryTable[RegistryTable]
    Registry --> RegistryGrid[RegistryGrid]
    Registry --> RegistryFilters[RegistryFilters]
    RegistryTable --> RegistryRow[RegistryRow]
    RegistryRow --> RegistryActions[RegistryActions]
    RegistryGrid --> WorkflowCard[WorkflowCard]
    
    %% Scheduler Components
    Scheduler --> SchedulerToolbar[SchedulerToolbar]
    Scheduler --> ScheduleList[ScheduleList]
    Scheduler --> ScheduleCalendar[ScheduleCalendar]
    Scheduler --> CronEditor[CronEditor]
    Scheduler --> BusinessCalendar[BusinessCalendar]
    Scheduler --> ScheduleSimulation[ScheduleSimulation]
    
    %% Queue Components
    Queues --> QueueList[QueueList]
    Queues --> QueueDetail[QueueDetail]
    QueueDetail --> QueueOverview[QueueOverview]
    QueueDetail --> QueuePartitions[QueuePartitions]
    QueueDetail --> QueueConsumers[QueueConsumers]
    QueueDetail --> QueueMessages[QueueMessages]
    QueueDetail --> QueueDLQ[QueueDLQ]
    QueueDetail --> QueueScaling[QueueScaling]
    QueueDetail --> QueueHealth[QueueHealth]
    QueueMessages --> MessageBrowser[MessageBrowser]
    
    %% Workers Components
    Workers --> WorkerPoolList[WorkerPoolList]
    Workers --> WorkerPoolDetail[WorkerPoolDetail]
    WorkerPoolDetail --> WorkersGrid[WorkersGrid]
    WorkerPoolDetail --> WorkerScaling[WorkerScaling]
    WorkerPoolDetail --> WorkerConfig[WorkerConfig]
    WorkerPoolDetail --> WorkerAssignments[WorkerAssignments]
    WorkerPoolDetail --> WorkerLogs[WorkerLogs]
    
    %% Rules Components
    Rules --> RulesList[RulesList]
    Rules --> RuleEditor[RuleEditor]
    Rules --> DecisionTableEditor[DecisionTableEditor]
    Rules --> ExpressionEditor[ExpressionEditor]
    Rules --> PolicyEditor[PolicyEditor]
    Rules --> RuleSimulator[RuleSimulator]
    
    %% Human Tasks Components
    HumanTasks --> TaskList[TaskList]
    HumanTasks --> TaskDetail[TaskDetail]