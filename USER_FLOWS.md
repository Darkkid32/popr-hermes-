# Hermes AI OS - User Flows

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Core User Flows

### 1. Agent Deployment Flow
**Persona**: Platform Operator / DevOps Engineer  
**Entry**: Mission Control → Quick Actions → "Deploy Agent"  
**Goal**: Deploy a new AI agent to the fleet

```
Mission Control Dashboard
    │
    ▼
[Quick Actions] → "Deploy Agent" (Primary Button)
    │
    ▼
Deploy Agent Modal (Stepper: 4 steps)
    │
    ├── Step 1: Select Template
    │   ├── Browse templates (grid cards)
    │   ├── Filter by category (Analysis, Automation, Creative, etc.)
    │   ├── Search templates
    │   └── [Next] →
    │
    ├── Step 2: Configure Agent
    │   ├── Name, Description
    │   ├── Model selection (dropdown with search)
    │   ├── Resource allocation (CPU, Memory, GPU sliders)
    │   ├── Environment variables (key-value table)
    │   ├── Secrets reference (vault picker)
    │   └── [Next] →
    │
    ├── Step 3: Network & Security
    │   ├── Network policy (dropdown)
    │   ├── Ingress/Egress rules
    │   ├── Service account selection
    │   ├── RBAC roles (multi-select)
    │   └── [Next] →
    │
    └── Step 4: Review & Deploy
        ├── Summary card (all config)
        ├── Estimated cost/month
        ├── [Deploy] (Primary) / [Back] / [Cancel]
        │
        ▼
    Deploying... (Progress modal with live logs)
        │
        ├── Step 1: Provisioning infrastructure ████████ 100%
        ├── Step 2: Pulling model ████████████ 100%
        ├── Step 3: Starting container ████████░░ 80%
        ├── Step 4: Health checks ██████░░░░░ 60%
        │
        ▼
    Success Toast + Redirect to Fleet Manager
        │
        ▼
Fleet Manager → New agent row (status: Starting → Running)
```

**Error States**:
- Template not found → Inline error, retry
- Insufficient quota → Link to Settings → Quotas
- Model pull failed → Show logs, retry button
- Health check failed → Show diagnostic, destroy/retry

**Success Criteria**: Agent shows "Running" status in Fleet Manager

---

### 2. Security Incident Response Flow
**Persona**: Security Analyst / SOC Engineer  
**Entry**: Notification Center → "Critical: Threat Detected" OR Security → Threat Detection  
**Goal**: Investigate, contain, and resolve security threat

```
Notification Center (⌘⇧N)
    │
    ├── "Critical: Unauthorized access attempt - Agent-Prod-03"
    │   │
    │   ▼
    ▼
Threat Detection Dashboard
    │
    ├── Threat Timeline (expandable)
    │   ├── 10:23:45 - Failed login (IP: 45.12.34.56)
    │   ├── 10:23:47 - Brute force detected (15 attempts)
    │   ├── 10:23:50 - Account lockout triggered
    │   └── 10:24:00 - Alert generated
    │
    ├── Affected Entities
    │   ├── Agent-Prod-03 (Compromised)
    │   ├── Network Segment: prod-east
    │   └── Service Account: sa-data-processor
    │
    ├── MITRE ATT&CK Mapping
    │   ├── T1110 - Brute Force
    │   └── T1078 - Valid Accounts
    │
    └── [Investigate] (Primary Action)
        │
        ▼
Incident Detail View (Drawer/Modal)
    │
    ├── Evidence Tab
    │   ├── Raw logs (live tail)
    │   ├── Network captures
    │   ├── Process tree
    │   └── File integrity hashes
    │
    ├── Timeline Tab (interactive)
    │   ├── Zoom, filter, annotate
    │   └── Export timeline
    │
    ├── Response Actions (Right Panel)
    │   ├── [Isolate Agent] (Danger)
    │   ├── [Block IP] (Primary)
    │   ├── [Rotate Credentials] (Primary)
    │   ├── [Snapshot Forensics] (Secondary)
    │   └── [Run Playbook] (Dropdown)
    │
    └── [Resolve Incident] → Resolution Form
        ├── Root cause (textarea)
        ├── Actions taken (checklist)
        ├── Preventive measures (textarea)
        ├── Severity reassessment (dropdown)
        └── [Close Incident]
            │
            ▼
        Success Toast + Incident moves to "Resolved" in Threat Detection
```

**Parallel Actions** (can run concurrently):
- Isolate Agent → Immediate network quarantine
- Block IP → Firewall rule propagation (< 30s)
- Rotate Credentials → Vault rotation + notification

**Escalation**: If not resolved in 30 min → Auto-escalate to Security Lead

---

### 3. Model Routing Configuration Flow
**Persona**: ML Engineer / Platform Engineer  
**Entry**: Models → Routing Rules  
**Goal**: Configure intelligent model routing for cost/performance optimization

```
Models Workspace
    │
    ├── Tab: Routing Rules
    │   │
    │   ▼
    ▼
Routing Rules Builder
    │
    ├── Rules List (draggable priority order)
    │   ├── Rule 1: "Code Generation → GPT-4o (Cloud)"
    │   ├── Rule 2: "Chat → Llama-3-70B (Local)"
    │   ├── Rule 3: "Embeddings → BGE-Large (Local)"
    │   └── [+ Add Rule]
    │
    ├── Rule Editor (Drawer on click/+ Add)
    │   ├── Name: "Code Generation"
    │   ├── Conditions (AND/OR groups)
    │   │   ├── Task Type = "code_generation"
    │   │   ├── Complexity > 0.7
    │   │   └── Language IN ["python", "typescript", "rust"]
    │   ├── Target Model: GPT-4o (Cloud) [Dropdown with health]
    │   ├── Fallback: Claude-3.5-Sonnet (Cloud)
    │   ├── Cost Cap: $0.05/request
    │   ├── Latency SLA: < 5s p95
    │   ├── Weight: 100 (for A/B testing)
    │   └── [Save Rule]
    │
    ├── Testing Panel (Right side)
    │   ├── Sample Requests (10 test cases)
    │   ├── [Run Simulation] → Results table
    │   │   ├── Expected: GPT-4o, Actual: GPT-4o ✓
    │   │   ├── Expected: Local, Actual: Local ✓
    │   │   └── Cost estimate: $0.032/req
    │   └── [Deploy Rules]
    │
    └── Deployment Confirmation
        ├── Staged rollout (10% → 50% → 100%)
        ├── Rollback trigger: Error rate > 5%
        └── [Confirm Deploy]
            │
            ▼
        Success Toast + Rules active
```

**Validation**:
- No overlapping conditions without priority
- All target models healthy
- Cost caps within budget
- Fallback chain terminates

---

### 4. Workflow Creation Flow
**Persona**: Automation Engineer / Citizen Developer  
**Entry**: Automation → Visual Workflow Builder  
**Goal**: Create, test, and deploy an automation workflow

```
Automation Hub
    │
    ├── [+ New Workflow] → Template Selection Modal
    │   ├── Blank Canvas
    │   ├── Scheduled Job
    │   ├── Event-Driven
    │   ├── Data Pipeline
    │   └── Approval Workflow
    │
    ▼
Visual Workflow Builder (Canvas)
    │
    ├── Left Panel: Node Library (collapsible categories)
    │   ├── Triggers (Schedule, Webhook, Event, Manual)
    │   ├── Logic (Condition, Loop, Parallel, Switch)
    │   ├── Actions (HTTP, Agent, Model, Script, Notify)
    │   └── Transform (Map, Filter, Aggregate, Template)
    │
    ├── Canvas (Center)
    │   ├── Drag nodes from library
    │   ├── Connect ports (drag edge)
    │   ├── Auto-layout button
    │   ├── Minimap (bottom-right)
    │   └── Zoom controls
    │
    ├── Right Panel: Node Properties (contextual)
    │   ├── Config form per node type
    │   ├── Input/Output schema viewer
    │   ├── Test input panel
    │   └── [Test Node]
    │
    ├── Top Toolbar
    │   ├── Workflow name (editable)
    │   ├── Version: v1.0.0 (dropdown)
    │   ├── [Run] [Save] [Export] [Import] [Validate]
    │   ├── Status: Draft / Testing / Deployed
    │   └── Collaborators (avatars)
    │
    └── [Run] → Execution Modal
        ├── Select trigger payload (JSON editor)
        ├── [Start Execution]
        │
        ▼
    Live Execution View
        ├── Node status: Pending → Running → Success/Error
        ├── Real-time logs per node
        ├── Timeline view (Gantt)
        ├── [Pause] [Cancel] [Retry Failed]
        │
        ▼
    Execution Complete
        ├── Summary: Duration, Cost, Status
        ├── Output artifacts
        ├── [Deploy] / [Save as Template] / [Back to Canvas]
```

**Node Configuration Details**:
- **HTTP Action**: Method, URL, Headers, Body template, Auth, Retry policy, Timeout
- **Agent Action**: Agent selector, Input mapping, Output mapping, Async/Sync
- **Model Action**: Model selector, Prompt template, Parameters, Streaming
- **Script Action**: Language (Python/JS), Code editor, Dependencies, Sandbox config

**Validation**:
- No cycles (unless explicit loop)
- All required inputs connected
- Schema validation pass
- Secrets referenced exist in vault

---

### 5. Knowledge Graph Query Flow
**Persona**: Data Scientist / Knowledge Engineer  
**Entry**: Memory → Knowledge Graph  
**Goal**: Explore relationships, discover insights, answer questions

```
Memory Workspace
    │
    ├── Tab: Knowledge Graph
    │   │
    ▼
Knowledge Graph Explorer
    │
    ├── Left Panel: Node Explorer
    │   ├── Search entities (fuzzy, type-ahead)
    │   ├── Filter by type (Project, Person, Document, Concept, Model)
    │   ├── Recent entities
    │   ├── Bookmarked entities
    │   └── [+ New Entity]
    │
    ├── Center: Graph Canvas
    │   ├── Force-directed layout
    │   ├── Node size = degree/importance
    │   ├── Edge thickness = relationship strength
    │   ├── Color coding by type
    │   ├── [Focus] on selected node
    │   ├── [Expand] neighbors
    │   ├── [Collapse] leaf nodes
    │   └── [Layout] dropdown
    │
    ├── Right Panel: Entity Detail (on click)
    │   ├── Properties table
    │   ├── Relationships (incoming/outgoing)
    │   ├── Documents (linked)
    │   ├── Notes
    │   ├── History (who/when changed)
    │   └── Actions: [Edit] [Delete] [Bookmark] [Share]
    │
    ├── Top Bar
    │   ├── Search: "How does Project Alpha relate to Model Beta?"
    │   ├── [Natural Language Query] → Cypher translation
    │   ├── Filters: Types, Date range, Confidence
    │   └── [Export] [Share View] [Bookmark]
    │
    └── Natural Language Query Example:
        User: "Show me all models used in Project Alpha"
        │
        ▼
    Cypher: MATCH (p:Project {name:"Alpha"})-[:USES]->(m:Model) RETURN m
        │
        ▼
    Graph highlights matching subgraph
        │
        ▼
    Right Panel shows results table with export
```

**Advanced Features**:
- Time-travel: Slider to see graph at date
- Diff view: Compare two snapshots
- Path finding: Shortest path between entities
- Community detection: Auto-cluster

---

### 6. Observability Alert Creation Flow
**Persona**: SRE / Platform Engineer  
**Entry**: Observability → Alert Rules → [+ New Rule]  
**Goal**: Create, test, and deploy an alert rule

```
Alert Rules Management
    │
    ├── Rules Table (sortable, filterable)
    │   ├── Name | Query | Severity | Status | Last Fired | Actions
    │   └── [+ New Alert Rule]
    │
    ▼
Alert Rule Builder (Stepper: 4 steps)
    │
    ├── Step 1: Define Query
    │   ├── Data Source: Metrics / Logs / Traces
    │   ├── Query Editor (PromQL/LogQL/TraceQL)
    │   │   ├── Syntax highlighting
    │   │   ├── Auto-complete
    │   │   ├── [Run Query] → Preview chart
    │   │   └── [Test Range] (1h, 6h, 24h, 7d)
    │   ├── Condition: > 0.8 for 5m
    │   └── [Next]
    │
    ├── Step 2: Configure Alert
    │   ├── Name, Description
    │   ├── Severity: Critical / Warning / Info
    │   ├── Labels (key-value for routing)
    │   ├── Annotations (summary, description, runbook URL)
    │   ├── Evaluation Interval: 1m
    │   ├── For Duration: 5m
    │   └── [Next]
    │
    ├── Step 3: Notification Routing
    │   ├── Channels: Slack, PagerDuty, Email, Webhook, OpsGenie
    │   ├── Routing Rules (match labels → channel)
    │   ├── Grouping: Group by [alertname, cluster, service]
    │   ├── Group Wait: 30s
    │   ├── Group Interval: 5m
    │   ├── Repeat Interval: 4h
    │   ├── Inhibition Rules
    │   └── [Next]
    │
    ├── Step 4: Test & Deploy
    │   ├── Test Scenarios
    │   │   ├── [Fire Test Alert] → Shows notification preview
    │   │   ├── [Simulate History] → Last 24h would fire X times
    │   │   └── [Check Inhibition] → No conflicts
    │   ├── Staged Rollout: 10% → 50% → 100%
    │   └── [Deploy Rule]
    │
    ▼
Success Toast → Rule appears in table (Status: Active)
```

**Alert Lifecycle**:
```
Firing → [Acknowledge] → Acknowledged → [Resolve] → Resolved
    │                      │
    ▼                      ▼
Auto-resolve          Auto-resolve
when condition       when condition
clears               clears + ack timeout
```

---

### 7. Plugin Installation Flow
**Persona**: Developer / Power User  
**Entry**: Plugins → Marketplace  
**Goal**: Discover, evaluate, install, and configure a plugin

```
Plugin Marketplace
    │
    ├── Featured Banner (rotating)
    │
    ├── Categories (chips): All, Productivity, Analysis, Automation, Creative
    │
    ├── Search Bar (placeholder: "Search plugins...")
    │
    ├── Plugin Grid (cards)
    │   ├── Logo, Name, Description
    │   ├── Rating (4.8★), Installs (10k+)
    │   ├── Tags: [Free] [Verified] [Official]
    │   ├── [Install] / [Details]
    │   └── Hover: Quick preview
    │
    ├── Plugin Detail (Modal/Drawer on click Details)
    │   ├── Hero: Logo, Name, Tagline, Version, Updated
    │   ├── Tabs: Overview, Permissions, Changelog, Reviews, Config
    │   ├── Overview: Description, Features, Screenshots, Requirements
    │   ├── Permissions: Required scopes, Data access, Network access
    │   ├── Changelog: Version history
    │   ├── Reviews: Rating breakdown, User reviews
    │   ├── Config: Default settings, Schema
    │   └── [Install] (Primary) / [Report]
    │
    ├── Install Confirmation Modal
    │   ├── Plugin name, version
    │   ├── Permissions summary (expandable)
    │   ├── Data access warning (if applicable)
    │   ├── [Confirm Install] / [Cancel]
    │
    ├── Installing... (Progress toast)
    │   ├── Downloading ████████████ 100%
    │   ├── Verifying signature ████████████ 100%
    │   ├── Installing dependencies ████████░░ 80%
    │   ├── Registering ████████████ 100%
    │
    ▼
Success Toast → Redirect to Installed Plugins
    │
    ▼
Installed Plugins
    │
    ├── Plugin Card (installed state)
    │   ├── [Configure] → Configuration Modal
    │   ├── [Disable] → Confirm
    │   ├── [Uninstall] → Confirm + Data cleanup option
    │   └── Version badge + Update available indicator
    │
    └── Configuration Modal
        ├── Settings form (dynamic from plugin schema)
        ├── [Save] / [Reset to Defaults] / [Cancel]
        └── Test connection button (if applicable)
```

**Security**:
- Signature verification mandatory
- Sandbox isolation level shown
- Permission review required
- Enterprise: Admin approval workflow

---

### 8. Settings Configuration Flow
**Persona**: Platform Admin / User  
**Entry**: Top Nav → User Menu → Settings OR ⌘,  
**Goal**: Configure platform preferences

```
Settings Workspace
    │
    ├── Left Nav: Categories (6 tabs)
    │   ├── General
    │   ├── Appearance
    │   ├── Integrations
    │   ├── Privacy
    │   ├── Performance
    │   └── Advanced
    │
    ├── Tab: General
    │   ├── Language, Timezone, Date format
    │   ├── Startup behavior (Last workspace, Mission Control, Blank)
    │   ├── Auto-save interval
    │   ├── Confirmation dialogs (toggle)
    │   └── [Save]
    │
    ├── Tab: Appearance
    │   ├── Theme: Dark (only) / System (future)
    │   ├── Density: Compact / Comfortable / Spacious
    │   ├── Accent Color: Cyan (default) / Magenta / Emerald / Amber
    │   ├── Font Size: Small / Medium / Large
    │   ├── Animations: Full / Reduced / None
    │   ├── Sidebar: Always expanded / Auto-collapse
    │   └── [Save] + Live preview
    │
    ├── Tab: Integrations
    │   ├── Connected Services (GitHub, GitLab, Jira, Slack, etc.)
    │   │   ├── Status: Connected / Expired / Error
    │   │   ├── [Configure] [Disconnect]
    │   │   └── [+ Connect New]
    │   ├── API Keys
    │   │   ├── List: Name, Scopes, Created, Last Used, [Revoke]
    │   │   └── [+ Generate Key] → Modal (name, scopes, expiry)
    │   ├── Webhooks
    │   │   ├── List: URL, Events, Secret, Status, [Test] [Delete]
    │   │   └── [+ Add Webhook]
    │   └── [Save]
    │
    ├── Tab: Privacy
    │   ├── Telemetry: Anonymous usage / Crash reports / Performance
    │   ├── Data Retention: 30d / 90d / 1y / Custom
    │   ├── Analytics: Enable / Disable
    │   ├── [Export My Data] → Download JSON
    │   ├── [Delete Account] → Danger zone
    │   └── [Save]
    │
    ├── Tab: Performance
    │   ├── Cache: Size limit, TTL, [Clear Cache]
    │   ├── Workers: Max concurrent (1-16)
    │   ├── GPU Acceleration: Auto / Enabled / Disabled
    │   ├── Lazy Loading: On / Off
    │   ├── Virtual Scrolling: On / Off
    │   └── [Save]
    │
    └── Tab: Advanced
        ├── Feature Flags (toggles with descriptions)
        ├── Debug Mode: On / Off
        ├── Developer Tools: Console, Network, React DevTools
        ├── Experimental Features (collapsed)
        ├── Reset to Defaults (confirm)
        └── [Save]
```

**Persistence**: All settings → localStorage + sync to backend (if authenticated)

---

## Flow Quality Metrics

| Flow | Steps | Decision Points | Error States | Avg Time |
|------|-------|-----------------|--------------|----------|
| Agent Deployment | 4 | 3 | 5 | 3 min |
| Security Incident | 3 | 4 | 6 | 15 min |
| Model Routing | 3 | 2 | 4 | 5 min |
| Workflow Creation | 4 | 5 | 8 | 10 min |
| Knowledge Query | 2 | 1 | 3 | 2 min |
| Alert Creation | 4 | 3 | 5 | 5 min |
| Plugin Install | 3 | 2 | 4 | 1 min |
| Settings Config | 1 | 6 | 2 | 2 min |

---

## Cross-Flow Patterns

### Consistent Patterns Across All Flows
1. **Stepper Pattern**: Multi-step with validation, back/next, review step
2. **Drawer/Modal**: Contextual details without losing context
3. **Live Preview**: Test before commit (queries, workflows, alerts)
4. **Staged Rollout**: Gradual deployment with rollback triggers
5. **Toast Feedback**: Success/Error with action links
6. **Keyboard Shortcuts**: Power user acceleration
7. **Undo/Redo**: Where applicable (workflow builder, settings)
8. **Auto-save**: Draft persistence (workflows, queries, rules)

### Error Handling Standards
- **Inline**: Form validation, field-level
- **Toast**: Transient success/info/warning
- **Modal**: Critical errors requiring action
- **Banner**: System-wide issues
- **Page**: Catastrophic failure (fallback UI)

### Loading Standards
- **Skeleton**: Known structure, unknown data
- **Spinner**: Unknown duration, single action
- **Progress Bar**: Known steps, determinate
- **Live Logs**: Long-running operations
- **Optimistic**: Immediate UI update, rollback on error

---

## Mobile/Tablet Flow Adaptations

| Flow | Mobile Adaptation | Tablet Adaptation |
|------|-------------------|-------------------|
| Agent Deploy | Full-screen modal steps | Side-by-side stepper + preview |
| Security Incident | Bottom sheet detail | Split view timeline + actions |
| Model Routing | Stacked rule cards | Two-pane list + editor |
| Workflow Builder | Simplified canvas | Full canvas, touch-optimized |
| Knowledge Graph | Search-first, no canvas | Canvas + side panels |
| Alert Creation | Full-screen steps | Side-by-side |
| Plugin Install | Full-screen detail | Drawer detail |
| Settings | Stacked tabs | Two-pane nav + content |

---

## Implementation Notes

### State Management
- **Flow State**: URL-based (deep linkable)
- **Form State**: React Hook Form + Zod
- **Draft Persistence**: localStorage + periodic sync
- **Collaboration**: Operational Transform / CRDT (future)

### Analytics Integration
Each flow step emits:
```typescript
{
  flow: 'agent_deployment',
  step: 'configure_agent',
  action: 'next_clicked',
  duration_ms: 45000,
  success: true,
  metadata: { template_id: '...', model: '...' }
}
```

### Testing Requirements
- Happy path E2E for each flow
- Error injection at each step
- Keyboard-only completion
- Screen reader navigation
- Mobile/tablet viewport testing
- Performance budgets (TTI < 3s)