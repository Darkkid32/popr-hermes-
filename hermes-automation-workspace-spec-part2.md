# Hermes Automation Workspace — Enterprise UI/UX Architecture Specification (Part 2)

## 8. Scheduler

### 8.1 Layout

```css
.scheduler-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Schedule List + Filters */
.schedule-list { grid-column: 1; grid-row: 1 / -1; }

/* Right: Calendar View */
.schedule-calendar { grid-column: 2; grid-row: 1 / -1; }

/* Top Bar (spans both) */
.scheduler-toolbar { grid-column: 1 / -1; grid-row: 1; }
```

### 8.2 Calendar View (FullCalendar.js style)

```typescript
interface CalendarViewOptions {
  view: 'month' | 'week' | 'day' | 'agenda' | 'timeline';
  timezone: string;
  businessHours: boolean;
  holidays: boolean;
  maintenanceWindows: boolean;
  scheduleColors: Record<string, string>; // by category
  clickableEvents: boolean;
  draggable: boolean;
  selectable: boolean;
}

// Event Rendering:
// ┌─────────────────────────────────────┐
// │ 📅 Daily Order Processing          │
// │    02:00 AM - 02:30 AM             │
// │    Workflow: order-processing v2.3 │
// │    ⚡ Cron: 0 2 * * *               │
// └─────────────────────────────────────┘
```

### 8.3 Schedule List (Left Panel)

| Column | Type | Filterable |
|--------|------|------------|
| **Name** | Link | ✓ |
| **Type** | Badge | ✓ |
| **Cron/Config** | Code | ✓ (text) |
| **Timezone** | Badge | ✓ |
| **Next Run** | DateTime | ✓ |
| **Last Run** | DateTime | ✓ |
| **Status** | StatusBadge | ✓ |
| **Workflow** | Link | ✓ |
| **Success Rate** | Percentage | ✓ |
| **Actions** | Dropdown | - |

### 8.4 Cron Editor (Modal)

```typescript
interface CronEditorProps {
  value: string;
  onChange: (cron: string) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  preview: NextOccurrences[];
  validation: ValidationResult;
}

// Features:
// - Real-time validation
// - Next 10 occurrences preview
// - Human-readable description
// - Presets (hourly, daily, weekly, monthly, business hours)
// - Timezone selector with offset display
// - Business calendar integration
// - Holiday exclusion toggle
```

### 8.5 Business Calendar Manager

```typescript
interface BusinessCalendar {
  id: string;
  name: string;
  timezone: string;
  businessHours: { start: string; end: string; breaks: Break[] };
  workingDays: WeekDay[];
  holidays: Holiday[];
  exceptions: CalendarException[];
}

// UI:
// - Calendar grid with working days highlighted
// - Business hours editor (start/end/breaks)
// - Holiday list (add/remove, recurring)
// - Exception dates (closed/modified hours)
// - Import/Export (iCal, CSV)
// - Clone calendar
```

### 8.5 Schedule Simulation

```typescript
interface SimulationRequest {
  scheduleId?: string;
  cronExpression?: string;
  calendarId?: string;
  timezone: string;
  startDate: Date;
  endDate: Date;
  maxOccurrences?: number;
}

interface SimulationResult {
  occurrences: Date[];
  skipped: SkippedOccurrence[];
  conflicts: Conflict[];
  nextRun: Date;
}

interface SkippedOccurrence {
  scheduledAt: Date;
  reason: 'holiday' | 'non-business-hours' | 'maintenance' | 'exception';
}

interface Conflict {
  scheduleId: string;
  scheduleName: string;
  overlappingAt: Date;
  severity: 'warning' | 'error';
}
```

---

## 9. Trigger Manager

### 9.1 Trigger Type Tabs

```typescript
type TriggerCategory = 
  | 'webhook' | 'api' | 'mcp' | 'file' | 'queue' | 'database'
  | 'agent' | 'chat' | 'memory' | 'plugin' | 'skill' | 'model'
  | 'timer' | 'manual' | 'event';
```

### 9.2 Trigger List (Per Tab)

| Column | Type | Filterable |
|--------|------|------------|
| **Name** | Link | ✓ |
| **Type** | Badge | - |
| **Status** | StatusBadge | ✓ |
| **Target Workflows** | Count + Links | ✓ |
| **Last Fired** | DateTime | ✓ |
| **Fire Count** | Number | ✓ |
| **Error Rate** | Percentage | ✓ |
| **Actions** | Dropdown | - |

### 9.3 Trigger Configuration (Per Type)

| Type | Key Configuration Fields |
|------|--------------------------|
| **Webhook** | Path, Method, Headers, Secret, Signature Verification, Payload Schema |
| **API** | Endpoint, Auth (Bearer/OAuth/mTLS), Rate Limit, Request/Response Schema |
| **MCP** | Server, Capability (Tool/Resource/Prompt), Name, Arguments Schema |
| **File** | Path, Pattern, Watch Mode (Create/Modify/Delete/All), Recursive |
| **Queue** | Queue, Message Filter, Batch Size, Visibility Timeout |
| **Database** | Table, Operation (Insert/Update/Delete), Condition, CDC |
| **Agent** | Agent ID, Event Types, Filter |
| **Chat** | Session ID, Message Types, Filter |
| **Memory** | Memory Type, Query, Filter |
| **Plugin** | Plugin ID, Event Types, Filter |
| **Skill** | Skill ID, Event Types, Filter |
| **Model** | Model ID, Event Types, Filter |
| **Timer** | Interval, Cron, Timezone, Start/End Date, Max Runs, Jitter |
| **Manual** | Input Schema, Confirmation Required |
| **Event** | Event Type, Source, Filter |

### 9.4 Webhook Registration

```typescript
interface WebhookRegistration {
  triggerId: string;
  publicUrl: string;
  secret: string;
  headers: Record<string, string>;
  verification: {
    method: 'signature' | 'token' | 'mutual-tls';
    config: Record<string, any>;
  };
  retry: {
    maxAttempts: number;
    backoff: 'exponential' | 'linear' | 'fixed';
    initialDelayMs: number;
  };
  healthCheck: {
    enabled: boolean;
    intervalMs: number;
    timeoutMs: number;
  };
}

// UI:
// - Auto-generated public URL (copy button)
// - Secret generation (regenerate button)
// - Test payload sender
// - Delivery history (last 100)
// - Signature verification tester
```

### 9.5 Trigger Testing (Modal)

```typescript
interface TestTriggerRequest {
  triggerId: string;
  payload: Record<string, any>;
  headers?: Record<string, string>;
  async?: boolean;
}

interface TestTriggerResult {
  success: boolean;
  executionId?: string;
  matchedWorkflows: WorkflowTarget[];
  evaluationTimeMs: number;
  errors: string[];
  warnings: string[];
}

// Features:
// - JSON editor with schema validation
// - Sample payload generator
// - History of test runs
// - Evaluation trace
// - Matched workflow preview
```

---

## 10. Queue Manager

### 10.1 Layout

```css
.queue-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Queue List */
.queue-list { grid-column: 1; grid-row: 1 / -1; }

/* Right: Queue Detail */
.queue-detail { grid-column: 2; grid-row: 1 / -1; }
```

### 10.2 Queue List

| Column | Type | Filterable |
|--------|------|------------|
| **Name** | Link | ✓ |
| **Type** | Badge | ✓ |
| **Status** | StatusBadge | ✓ |
| **Messages** | Count (visible/delayed/in-flight/DLQ) | - |
| **Throughput** | /sec | - |
| **Avg Latency** | Duration | - |
| **Workers** | Count (healthy/total) | - |
| **Partitions** | Number | - |
| **Actions** | Dropdown | - |

### 10.3 Queue Detail Tabs

| Tab | Content |
|-----|---------|
| **Overview** | Metrics cards, Real-time charts, Health status |
| **Partitions** | Partition list, Leader/Follower, Lag, Rebalance |
| **Consumers** | Consumer list, Assignment, Lag, Throughput |
| **Messages** | Message browser (peek, search, filter), DLQ access |
| **DLQ** | Dead letter messages, Reprocess, Discard, Archive |
| **Scaling** | Scaling policy, Current/Desired/Min/Max, History |
| **Health** | Checks, Alerts, Recommendations |

### 10.4 Message Browser

```typescript
interface MessageBrowserProps {
  queueId: QueueId;
  mode: 'peek' | 'consume';
  filters: MessageFilters;
  onMessageAction: (messageId: string, action: 'retry' | 'discard' | 'requeue' | 'dlq') => void;
}

// Features:
// - Virtualized (100k+ messages)
// - Search: payload (JSON path), headers, traceId, timestamp
// - Filters: status, priority, age, size
// - Columns: ID, Priority, Age, Size, Trace ID, Headers (expandable)
// - Actions: View Payload, Retry, Requeue, Move to DLQ, Copy Trace ID
// - Batch actions (multi-select)
// - Export (JSON, CSV)
```

### 10.5 DLQ Management

```typescript
interface DLQMessage {
  id: string;
  originalQueueId: string;
  payload: any;
  error: string;
  failedAt: Date;
  retryCount: number;
  originalTraceId: string;
  headers: Record<string, string>;
}

// Actions:
// - View Payload (JSON editor)
// - Retry (with optional payload modification)
// - Reprocess Batch (with filter)
// - Discard (with reason)
// - Archive (to object storage)
// - Root Cause Analysis (link to execution)
```

---

## 11. Worker Management

### 11.1 Worker Pool List

| Column | Type |
|--------|------|
| **Name** | Link |
| **Type** | Badge |
| **Status** | StatusBadge |
| **Queues** | Count + Links |
| **Workers** | Current/Desired/Min/Max |
| **Healthy** | Count |
| **Utilization** | Percentage + Bar |
| **Scaling** | Badge (auto/manual) |
| **Actions** | Dropdown |

### 11.2 Worker Pool Detail

| Tab | Content |
|-----|---------|
| **Workers** | Worker grid, Health, Assignments, Logs |
| **Scaling** | Policy editor, Metrics, History, Predictions |
| **Configuration** | Image, Resources, Runtime, Health Check, Sandbox |
| **Assignments** | Current executions, Queue distribution |
| **Logs** | Aggregated logs, Level filter, Search |

### 11.3 Worker Grid

```typescript
interface WorkerCardProps {
  worker: Worker;
  onAction: (action: string, workerId: string) => void;
}

// Card:
// ┌────────────────────────────────────┐
// │ worker-abc123            [⋮]       │
// │ 🟢 Healthy    ████████░░ 78% CPU   │
// │ Queue: order-processing (3)        │
// │ Current: charge-payment (45s)      │
// │ Completed: 1,234  Failed: 12       │
// │ Uptime: 4d 12h                     │
// └────────────────────────────────────┘
```

### 11.4 Worker Actions

| Action | Description |
|--------|-------------|
| **View Logs** | Open log drawer |
| **Drain** | Stop accepting work, complete current |
| **Restart** | Graceful restart |
| **Terminate** | Force stop (with confirmation) |
| **Debug** | Attach debugger (if supported) |
| **Scale Pool** | Quick scale up/down |

---

## 12. Rule Engine

### 12.1 Layout

```css
.rules-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Rules List */
.rules-list { grid-column: 1; grid-row: 1 / -1; }

/* Right: Rule Editor / Decision Table */
.rules-editor { grid-column: 2; grid-row: 1 / -1; }
```

### 12.2 Rules List

| Column | Type |
|--------|------|
| **Name** | Link |
| **Type** | Badge |
| **Priority** | Number |
| **Status** | Badge |
| **Scope** | Badge |
| **Last Evaluated** | DateTime |
| **Hit Rate** | Percentage |
| **Actions** | Dropdown |

### 12.3 Rule Editor (Boolean Rules)

```typescript
interface BooleanRuleEditorProps {
  rule: BooleanRule;
  onChange: (rule: BooleanRule) => void;
  availableVariables: Variable[];
  availableFunctions: Function[];
  validation: ValidationResult;
}

// Features:
// - Visual expression builder (drag-drop conditions)
// - Raw expression editor (Monaco, with IntelliSense)
// - Variable/function autocomplete
// - Real-time validation
// - Test panel (input → output)
// - Version history
// - Dependency graph
```

### 12.4 Decision Table Editor

```typescript
interface DecisionTableEditorProps {
  table: DecisionTable;
  onChange: (table: DecisionTable) => void;
  validation: ValidationResult;
}

// Features:
// - Excel-like grid (AG Grid / Handsontable)
// - Add/Remove rows/columns
// - Hit policy selector
// - Cell validation (type, enum, range)
// - Gap/Overlap detection (highlighted)
// - Test harness (input → matched rows)
// - Import/Export (CSV, Excel)
// - Version control
```

### 12.5 Expression Language

```typescript
interface ExpressionEditorProps {
  expression: string;
  onChange: (expr: string) => void;
  context: ExpressionContext;
  onValidate: (result: ValidationResult) => void;
}

// Monaco-based with:
// - Syntax highlighting
// - Autocomplete (variables, functions, operators)
// - Type checking
// - Error squiggles
// - Hover documentation
// - Format on save
// - Snippets
```

### 12.6 Policy Management

```typescript
interface PolicyEditorProps {
  policy: Policy;
  onChange: (policy: Policy) => void;
  availableRules: Rule[];
}

// Policy Rule Row:
// ┌─────────────────────────────────────────────────────────┐
// │ ☐  Rule: validate-payment    Priority: 10   Effect: allow │
// │    Condition: amount > 10000 && currency == "USD"       │
// │    Obligations: [log-audit, notify-finance]             │
// │    [↑] [↓] [✏️] [🗑️]                                   │
// └─────────────────────────────────────────────────────────┘
```

### 12.7 Simulation & Testing

```typescript
interface RuleSimulatorProps {
  ruleId?: string;
  tableId?: string;
  policyId?: string;
  input: Record<string, any>;
  onRun: (result: SimulationResult) => void;
}

// Simulation Result:
// ┌─────────────────────────────────────────────┐
// │ Input: { amount: 15000, currency: "USD" }   │
// │                                             │
// │ Matched Rules:                              │
// │ ✓ validate-payment (priority 10)            │
// │   → Actions: [log-audit, notify-finance]    │
// │                                             │
// │ ✗ block-sanctioned (priority 5)             │
// │   Condition: country in sanctioned-list     │
// │                                             │
// │ Policy Decision: ALLOW                      │
// │ Obligations: [log-audit, notify-finance]    │
// │ Evaluation Time: 2.3ms                      │
// └─────────────────────────────────────────────┘
```

---

## 13. Human Tasks

### 13.1 Layout (Inbox Style)

```css
.human-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-template-rows: 56px 1fr;
  height: 100vh;
}

/* Left: Task List */
.task-list { grid-column: 1; grid-row: 1 / -1; }

/* Right: Task Detail */
.task-detail { grid-column: 2; grid-row: 1 / -1; }
```

### 13.2 Task List (Inbox)

```typescript
interface TaskFilters {
  status: ('pending' | 'assigned' | 'in-progress' | 'completed' | 'rejected' | 'expired' | 'escalated' | 'delegated')[];
  priority: ('low' | 'normal' | 'high' | 'urgent')[];
  assignee: 'me' | 'my-team' | 'unassigned' | 'all';
  type: ('approval' | 'task')[];
  dateRange: { from: Date; to: Date };
  search: string;
}

// Toolbar:
// [Filters ▼] [Sort ▼] [Search 🔍] [Bulk Actions ▼] [Refresh 🔄]
```

### 13.3 Task List Columns

| Column | Type | Sortable |
|--------|------|----------|
| **Title** | Link | ✓ |
| **Type** | Badge | ✓ |
| **Status** | StatusBadge | ✓ |
| **Priority** | PriorityBadge | ✓ |
| **Assignee** | Avatar | ✓ |
| **Workflow** | Link | ✓ |
| **Due Date** | DateTime (red if overdue) | ✓ |
| **Time Remaining** | Countdown | - |
| **Actions** | Dropdown | - |

### 13.4 Task Detail (Right Panel)

```typescript
interface TaskDetailTabs {
  details: 'Details';
  form: 'Form';
  comments: 'Comments';
  attachments: 'Attachments';
  history: 'History';
  audit: 'Audit Trail';
}
```

### 13.5 Details Tab

```typescript
interface TaskDetailsProps {
  task: HumanTask;
  approvalRequest?: ApprovalRequest;
  onAction: (action: TaskAction) => void;
}

// Layout:
// ┌────────────────────────────────────────────────────────────┐
// │ Title: Approve Payment #12345          [Approve] [Reject] │
// │ Status: Pending Review    Priority: High    Due: 2h 34m   │
// ├────────────────────────────────────────────────────────────┤
// │ Description:                                               │
// │ Please review and approve the payment of $15,000 to      │
// │ Acme Corp for invoice INV-2024-001.                      │
// ├────────────────────────────────────────────────────────────┤
// │ Assignees:                                                 │
// │ 👤 john.doe (You) - Pending                               │
// │ 👤 jane.smith - Approved (10 min ago)                    │
// │ 👤 finance-team - Pending                                 │
// ├────────────────────────────────────────────────────────────┤
// │ Form Data:                                                 │
// │ Amount: $15,000.00                                        │
// │ Currency: USD                                             │
// │ Vendor: Acme Corp                                         │
// │ Invoice: INV-2024-001                                     │
// │ Cost Center: Engineering                                  │
// │ [Edit] [Save]                                             │
// ├────────────────────────────────────────────────────────────┤
// │ Escalation: Level 1 → Finance Manager (in 4h)            │
// │ Delegation: Allowed (requires approval)                   │
// └────────────────────────────────────────────────────────────┘
```

### 13.6 Form Tab

```typescript
interface TaskFormProps {
  schema: JSONSchema;
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSubmit: (data: Record<string, any>) => void;
  readonly: boolean;
  validation: ValidationResult;
}

// Features:
// - Auto-generated from JSON Schema
// - Field types: text, number, select, multiselect, date, datetime, file, boolean, object, array
// - Conditional fields (show/hide based on other values)
// - Validation (client + server)
// - Auto-save draft
// - Dirty state tracking
// - Required field indicators
// - Help text / tooltips
```

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