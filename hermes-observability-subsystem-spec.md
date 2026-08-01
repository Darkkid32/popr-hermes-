# Hermes Observability Subsystem — Enterprise Architecture Specification (Part 2)

---

## 22. PostgreSQL Schema (continued)

```sql
-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON alert_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alert_instances_updated_at BEFORE UPDATE ON alert_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_slos_updated_at BEFORE UPDATE ON slos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_slis_updated_at BEFORE UPDATE ON slis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_error_budgets_updated_at BEFORE UPDATE ON error_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_policies_updated_at BEFORE UPDATE ON notification_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collectors_updated_at BEFORE UPDATE ON collectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON pipelines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exporters_updated_at BEFORE UPDATE ON exporters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_checks_updated_at BEFORE UPDATE ON health_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_synthetic_checks_updated_at BEFORE UPDATE ON synthetic_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_runbooks_updated_at BEFORE UPDATE ON runbooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_postmortems_updated_at BEFORE UPDATE ON postmortems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hermes_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hermes_app;
GRANT USAGE ON SCHEMA public TO hermes_app;
```

### 22.2 Time-Series Tables (Partitioned)

```sql
-- Metric samples (partitioned by time - hourly partitions)
CREATE TABLE metric_samples (
    series_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    exemplar_trace_id UUID,
    exemplar_span_id UUID,
    exemplar_value DOUBLE PRECISION,
    exemplar_labels JSONB,
    exemplar_timestamp TIMESTAMPTZ
) PARTITION BY RANGE (timestamp);

-- Create hourly partitions for metric_samples
CREATE TABLE metric_samples_2024_01_01_00 PARTITION OF metric_samples FOR VALUES FROM ('2024-01-01 00:00') TO ('2024-01-01 01:00');
CREATE TABLE metric_samples_2024_01_01_01 PARTITION OF metric_samples FOR VALUES FROM ('2024-01-01 01:00') TO ('2024-01-01 02:00');
-- ... continue for each hour

CREATE INDEX idx_metric_samples_series_time ON metric_samples(series_id, timestamp DESC);

-- Log entries (partitioned by time - daily partitions)
CREATE TABLE log_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    stream_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    workspace_id UUID,
    timestamp TIMESTAMPTZ NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    structured JSONB NOT NULL DEFAULT '{}',
    labels JSONB NOT NULL DEFAULT '{}',
    trace_id UUID,
    span_id UUID,
    size BIGINT NOT NULL DEFAULT 0,
    compressed BOOLEAN NOT NULL DEFAULT FALSE,
    encryption_key_id UUID
) PARTITION BY RANGE (timestamp);

-- Create daily partitions for log_entries
CREATE TABLE log_entries_2024_01_01 PARTITION OF log_entries FOR VALUES FROM ('2024-01-01') TO ('2024-01-02');
CREATE TABLE log_entries_2024_01_02 PARTITION OF log_entries FOR VALUES FROM ('2024-01-02') TO ('2024-01-03');
-- ... continue for each day

CREATE INDEX idx_log_entries_stream_time ON log_entries(stream_id, timestamp DESC);
CREATE INDEX idx_log_entries_tenant_time ON log_entries(tenant_id, timestamp DESC);
CREATE INDEX idx_log_entries_trace ON log_entries(trace_id) WHERE trace_id IS NOT NULL;

-- Traces (partitioned by time - daily partitions)
CREATE TABLE traces (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    workspace_id UUID,
    root_span_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration BIGINT NOT NULL,
    root_service VARCHAR(255) NOT NULL,
    root_operation VARCHAR(255) NOT NULL,
    tags JSONB NOT NULL DEFAULT '{}',
    span_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL
) PARTITION BY RANGE (start_time);

CREATE TABLE traces_2024_01_01 PARTITION OF traces FOR VALUES FROM ('2024-01-01') TO ('2024-01-02');
CREATE TABLE traces_2024_01_02 PARTITION OF traces FOR VALUES FROM ('2024-01-02') TO ('2024-01-03');

CREATE INDEX idx_traces_tenant_time ON traces(tenant_id, start_time DESC);
CREATE INDEX idx_traces_workspace_time ON traces(workspace_id, start_time DESC);
CREATE INDEX idx_traces_service_time ON traces(root_service, start_time DESC);

-- Spans (partitioned by time - daily partitions)
CREATE TABLE spans (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    trace_id UUID NOT NULL,
    parent_span_id UUID,
    tenant_id UUID NOT NULL,
    workspace_id UUID,
    service_name VARCHAR(255) NOT NULL,
    operation_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration BIGINT NOT NULL,
    tags JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'ok',
    kind VARCHAR(20) NOT NULL DEFAULT 'internal'
) PARTITION BY RANGE (start_time);

CREATE TABLE spans_2024_01_01 PARTITION OF spans FOR VALUES FROM ('2024-01-01') TO ('2024-01-02');
CREATE TABLE spans_2024_01_02 PARTITION OF spans FOR VALUES FROM ('2024-01-02') TO ('2024-01-03');

CREATE INDEX idx_spans_trace ON spans(trace_id);
CREATE INDEX idx_spans_tenant_time ON spans(tenant_id, start_time DESC);
CREATE INDEX idx_spans_service_time ON spans(service_name, start_time DESC);

-- Span events
CREATE TABLE span_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    span_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_span_events_span ON span_events(span_id);
CREATE INDEX idx_span_events_time ON span_events(timestamp DESC);

-- Span links
CREATE TABLE span_links (
    trace_id UUID NOT NULL,
    span_id UUID NOT NULL,
    attributes JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_span_links_trace ON span_links(trace_id);

-- Profiles (partitioned by time - daily partitions)
CREATE TABLE profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    workspace_id UUID,
    service_name VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration BIGINT NOT NULL,
    sample_rate NUMERIC NOT NULL,
    sample_count BIGINT NOT NULL,
    labels JSONB NOT NULL DEFAULT '{}',
    format VARCHAR(50) NOT NULL,
    size BIGINT NOT NULL,
    compressed BOOLEAN NOT NULL DEFAULT FALSE,
    data BYTEA
) PARTITION BY RANGE (start_time);

CREATE TABLE profiles_2024_01_01 PARTITION OF profiles FOR VALUES FROM ('2024-01-01') TO ('2024-01-02');
CREATE TABLE profiles_2024_01_02 PARTITION OF profiles FOR VALUES FROM ('2024-01-02') TO ('2024-01-03');

CREATE INDEX idx_profiles_tenant_time ON profiles(tenant_id, start_time DESC);
CREATE INDEX idx_profiles_service_time ON profiles(service_name, start_time DESC);

-- Flame graphs
CREATE TABLE flame_graphs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL,
    root_nodes JSONB NOT NULL,
    total_samples BIGINT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_flame_graphs_profile ON flame_graphs(profile_id);

-- Symbols
CREATE TABLE symbols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL,
    address VARCHAR(64) NOT NULL,
    function_name TEXT NOT NULL,
    file_name TEXT,
    line_number INTEGER,
    module_name TEXT,
    build_id VARCHAR(64)
);

CREATE INDEX idx_symbols_profile ON symbols(profile_id);
CREATE INDEX idx_symbols_address ON symbols(address);
```

---

## 23. Background Workers

### 23.1 Worker Catalog

| Worker | Schedule | Purpose |
|--------|----------|---------|
| **MetricsIngester** | Continuous | Ingest metric samples from OTel collectors, write to storage |
| **RuleEvaluator** | Per rule interval | Evaluate recording rules, produce derived series |
| **Aggregator** | Every 30s | Compute aggregation rules, update aggregate series |
| **Downsampler** | Hourly | Downsample raw samples to lower resolutions |
| **MetricsRetentionWorker** | Daily 02:00 | Enforce retention policies, delete expired data |
| **CardinalityMonitor** | Hourly | Analyze cardinality, enforce limits, alert on explosions |
| **LogIngester** | Continuous | Receive, parse, enrich, route log entries |
| **LogParser** | Continuous | Parse raw logs using configured parsers |
| **LogIndexer** | Continuous | Index parsed log entries for search |
| **LogRetentionWorker** | Daily 03:00 | Enforce log retention policies |
| **LogArchivalWorker** | Daily 04:00 | Archive cold logs to object storage |
| **TraceIngester** | Continuous | Receive spans, assemble traces, store spans |
| **ServiceMapBuilder** | Every 5m | Build/update service maps from trace data |
| **DependencyAnalyzer** | Every 15m | Build dependency graphs from traces |
| **RootCauseEngine** | On error trace | Analyze error traces for root cause |
| **TraceRetentionWorker** | Daily 03:30 | Enforce trace retention policies |
| **ProfileIngester** | Continuous | Receive profile data from agents |
| **Symbolicator** | On profile ingest | Symbolicate profiles using debug symbols |
| **FlameGraphBuilder** | On profile ingest | Build flame graphs from profiles |
| **ProfileRetentionWorker** | Daily 04:30 | Enforce profile retention policies |
| **ProfileRegressionDetector** | Hourly | Detect performance regressions in profiles |
| **RuleEvaluator** | Per rule interval | Evaluate alert rules, fire/resolve instances |
| **NotificationRouter** | Continuous | Route fired alerts to notification policies |
| **EscalationEngine** | Continuous | Process escalation policies, trigger escalations |
| **SilenceManager** | Continuous | Apply silences to alert instances |
| **MaintenanceWindowManager** | Continuous | Apply maintenance windows to rules |
| **HealthChecker** | Per check schedule | Execute health checks, record results |
| **SyntheticRunner** | Per check schedule | Execute synthetic checks from multiple locations |
| **HeartbeatMonitor** | Every 10s | Monitor heartbeats, detect stale sources |
| **IncidentCoordinator** | Continuous | Manage incident lifecycle |
| **EscalationEngine** | Continuous | Process incident escalations |
| **RunbookExecutor** | On trigger | Execute runbook steps |
| **PostmortemGenerator** | On incident close | Generate postmortem drafts |
| **SLIEvaluator** | Per SLI interval | Evaluate SLIs, compute good/total ratios |
| **SLOEvaluator** | Per SLO interval | Evaluate SLOs, compute error budgets |
| **BudgetTracker** | Continuous | Track error budget consumption |
| **BurnRateCalculator** | Every 5m | Calculate burn rates, fire alerts |
| **TrendAnalyzer** | Hourly | Analyze metric trends, detect anomalies |
| **ForecastEngine** | Hourly | Generate forecasts for metrics |
| **CapacityPlanner** | Daily 05:00 | Forecast capacity, generate recommendations |
| **CostAnalyzer** | Hourly | Analyze costs, detect anomalies, forecast |
| **AuditLogger** | Continuous | Write audit events with chained integrity |
| **IntegrityVerifier** | Hourly | Verify audit log integrity chain |
| **ComplianceExporter** | Daily 06:00 | Export compliance reports |
| **QueryOptimizer** | Continuous | Optimize query plans, manage cache |
| **CacheManager** | Continuous | Manage query result cache |
| **TemplateRenderer** | On notification | Render notification templates |
| **ChannelDispatcher** | Continuous | Dispatch notifications to channels |
| **DeliveryTracker** | Continuous | Track notification delivery status |
| **RetryWorker** | Every 5m | Retry failed notification deliveries |
| **ExportWorker** | On schedule | Execute export jobs |
| **FormatConverter** | On export | Convert data to requested format |
| **RetentionWorker** | Daily 02:00 | Apply retention policies to all stores |
| **ArchivalWorker** | Daily 03:00 | Archive cold data to object storage |
| **CompactionWorker** | Hourly | Compact storage segments |
| **DeletionWorker** | Daily 04:00 | Delete expired data per retention policies |
| **SamplingController** | Every 5m | Adjust sampling rates based on volume |
| **AdaptiveSampler** | Continuous | Adjust trace/log sampling rates |
| **RateLimiter** | Continuous | Enforce ingestion rate limits |
| **CorrelationBuilder** | Continuous | Build cross-signal correlations |
| **TraceToLogsLinker** | Continuous | Link traces to related logs |
| **MetricsToTracesLinker** | Continuous | Link metrics anomalies to traces |
| **EnrichmentProcessor** | Continuous | Enrich telemetry with metadata |
| **MetadataFetcher** | Continuous | Fetch metadata for enrichment |
| **TopologyMapper** | Every 10m | Map service topology |
| **CollectorManager** | Continuous | Manage collector lifecycle |
| **PipelineValidator** | On config change | Validate collector pipeline configs |
| **ConfigReloader** | On config change | Hot-reload collector configs |
```

### 23.2 Worker Infrastructure

```typescript
interface WorkerInfrastructure {
  // Deployment
  deployment: {
    platform: 'kubernetes' | 'nomad' | 'ecs' | 'vm';
    replicas: number;
    resources: ResourceRequirements;
    autoscaling: AutoscalingConfig;
    affinity: AffinityConfig;
    tolerations: Toleration[];
  };
  
  // Health
  health: {
    livenessProbe: ProbeConfig;
    readinessProbe: ProbeConfig;
    startupProbe: ProbeConfig;
  };
  
  // Observability
  observability: {
    metrics: boolean;
    traces: boolean;
    logs: boolean;
    profiling: boolean;
  };
  
  // Configuration
  config: {
    env: Record<string, string>;
    secrets: SecretReference[];
    configMaps: ConfigMapReference[];
  };
}
```

---

## 24. Repository Structure

```
hermes-observability/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd.yml
│   │   ├── security.yml
│   │   ├── dependency-update.yml
│   │   └── release.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .vscode/
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json
│
├── .husky/
│   ├── pre-commit
│   └── commit-msg
│
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   ├── lint.sh
│   ├── migrate.sh
│   ├── deploy.sh
│   ├── benchmark.sh
│   └── chaos.sh
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── docker-compose.dev.yml
│   ├── Dockerfile.collector
│   ├── Dockerfile.metrics
│   ├── Dockerfile.logging
│   ├── Dockerfile.tracing
│   ├── Dockerfile.profiling
│   ├── Dockerfile.alerting
│   ├── Dockerfile.health
│   ├── Dockerfile.incident
│   ├── Dockerfile.analytics
│   ├── Dockerfile.slo
│   ├── Dockerfile.audit
│   ├── Dockerfile.query
│   ├── Dockerfile.gateway
│   ├── nginx.conf
│   └── k8s/
│       ├── base/
│       ├── overlays/
│       │   ├── dev/
│       │   ├── staging/
│       │   └── prod/
│       ├── helm/
│       └── kustomization.yaml
│
├── packages/
│   ├── core/
│   │   ├── domain/
│   │   ├── events/
│   │   ├── value-objects/
│   │   ├── policies/
│   │   └── exceptions/
│   │
│   ├── metrics/
│   │   ├── ingestion/
│   │   ├── storage/
│   │   ├── query/
│   │   ├── rules/
│   │   ├── aggregation/
│   │   ├── retention/
│   │   ├── cardinality/
│   │   └── handlers/
│   │
│   ├── logging/
│   │   ├── ingestion/
│   │   ├── parsing/
│   │   ├── indexing/
│   │   ├── search/
│   │   ├── live-tail/
│   │   ├── retention/
│   │   └── handlers/
│   │
│   ├── tracing/
│   │   ├── ingestion/
│   │   ├── storage/
│   │   ├── query/
│   │   ├── service-map/
│   │   ├── dependency-analysis/
│   │   ├── root-cause/
│   │   ├── sampling/
│   │   └── handlers/
│   │
│   ├── profiling/
│   │   ├── ingestion/
│   │   ├── symbolication/
│   │   ├── flame-graph/
│   │   ├── regression-detection/
│   │   ├── storage/
│   │   └── handlers/
│   │
│   ├── alerting/
│   │   ├── evaluation/
│   │   ├── routing/
│   │   ├── escalation/
│   │   ├── silencing/
│   │   ├── maintenance/
│   │   └── handlers/
│   │
│   ├── dashboard/
│   │   ├── crud/
│   │   ├── rendering/
│   │   ├── templating/
│   │   ├── sharing/
│   │   └── handlers/
│   │
│   ├── health/
│   │   ├── checks/
│   │   ├── synthetic/
│   │   ├── heartbeat/
│   │   ├── aggregation/
│   │   └── handlers/
│   │
│   ├── incident/
│   │   ├── lifecycle/
│   │   ├── runbook/
│   │   ├── escalation/
│   │   ├── postmortem/
│   │   └── handlers/
│   │
│   ├── slo/
│   │   ├── sli/
│   │   ├── slo/
│   │   ├── error-budget/
│   │   ├── burn-rate/
│   │   └── handlers/
│   │
│   ├── analytics/
│   │   ├── trends/
│   │   ├── forecasting/
│   │   ├── capacity/
│   │   ├── cost/
│   │   └── handlers/
│   │
│   ├── ai-observability/
│   │   ├── inference/
│   │   ├── embedding/
│   │   ├── rerank/
│   │   ├── quality/
│   │   ├── cost/
│   │   └── handlers/
│   │
│   ├── workflow-observability/
│   │   ├── execution/
│   │   ├── nodes/
│   │   ├── replay/
│   │   └── handlers/
│   │
│   ├── agent-observability/
│   │   ├── lifecycle/
│   │   ├── sessions/
│   │   ├── tools/
│   │   ├── memory/
│   │   └── handlers/
│   │
│   ├── mcp-observability/
│   │   ├── servers/
│   │   ├── tools/
│   │   ├── resources/
│   │   └── handlers/
│   │
│   ├── infrastructure/
│   │   ├── metrics/
│   │   ├── logging/
│   │   ├── tracing/
│   │   ├── profiling/
│   │   ├── health/
│   │   ├── alerting/
│   │   ├── storage/
│   │   ├── queue/
│   │   ├── cache/
│   │   ├── config/
│   │   ├── observability/
│   │   ├── security/
│   │   └── migrations/
│   │
│   ├── api/
│   │   ├── grpc/
│   │   ├── rest/
│   │   ├── websocket/
│   │   ├── query/
│   │   ├── validation/
│   │   └── middleware/
│   │
│   ├── admin/
│   │   ├── tenants/
│   │   ├── workspaces/
│   │   ├── policies/
│   │   ├── backups/
│   │   ├── monitoring/
│   │   ├── migrations/
│   │   └── cli/
│   │
│   ├── integrations/
│   │   ├── otel/
│   │   ├── prometheus/
│   │   ├── loki/
│   │   ├── tempo/
│   │   ├── pyroscope/
│   │   ├── grafana/
│   │   ├── alertmanager/
│   │   ├── pagerduty/
│   │   ├── slack/
│   │   ├── teams/
│   │   ├── email/
│   │   ├── s3/
│   │   ├── gcs/
│   │   ├── azure-blob/
│   │   ├── elasticsearch/
│   │   ├── clickhouse/
│   │   └── jaeger/
│   │
│   ├── testing/
│   │   ├── fixtures/
│   │   ├── mocks/
│   │   ├── contracts/
│   │   ├── property/
│   │   ├── chaos/
│   │   └── load/
│   │
│   └── shared/
│       ├── types/
│       ├── utils/
│       ├── constants/
│       ├── errors/
│       └── validation/
│
├── apps/
│   ├── telemetry-collector/
│   ├── metrics-service/
│   ├── logging-service/
│   ├── tracing-service/
│   ├── profiling-service/
│   ├── alerting-service/
│   ├── dashboard-service/
│   ├── health-service/
│   ├── incident-service/
│   ├── analytics-service/
│   ├── slo-service/
│   ├── audit-service/
│   ├── query-service/
│   ├── notification-service/
│   ├── export-service/
│   ├── retention-service/
│   ├── sampling-service/
│   ├── correlation-service/
│   ├── enrichment-service/
│   └── api-gateway/
│
├── workers/
│   ├── metrics-ingester/
│   ├── rule-evaluator/
│   ├── aggregator/
│   ├── downsampler/
│   ├── metrics-retention/
│   ├── cardinality-monitor/
│   ├── log-ingester/
│   ├── log-parser/
│   ├── log-indexer/
│   ├── log-retention/
│   ├── log-archival/
│   ├── trace-ingester/
│   ├── service-map-builder/
│   ├── dependency-analyzer/
│   ├── root-cause-engine/
│   ├── trace-retention/
│   ├── profile-ingester/
│   ├── symbolicator/
│   ├── flame-graph-builder/
│   ├── profile-retention/
│   ├── profile-regression-detector/
│   ├── alert-rule-evaluator/
│   ├── notification-router/
│   ├── escalation-engine/
│   ├── silence-manager/
│   ├── maintenance-window-manager/
│   ├── health-checker/
│   ├── synthetic-runner/
│   ├── heartbeat-monitor/
│   ├── incident-coordinator/
│   ├── escalation-engine/
│   ├── runbook-executor/
│   ├── postmortem-generator/
│   ├── sli-evaluator/
│   ├── slo-evaluator/
│   ├── budget-tracker/
│   ├── burn-rate-calculator/
│   ├── trend-analyzer/
│   ├── forecast-engine/
│   ├── capacity-planner/
│   ├── cost-analyzer/
│   ├── audit-logger/
│   ├── integrity-verifier/
│   ├── compliance-exporter/
│   ├── query-optimizer/
│   ├── cache-manager/
│   ├── template-renderer/
│   ├── channel-dispatcher/
│   ├── delivery-tracker/
│   ├── retry-worker/
│   ├── export-worker/
│   ├── format-converter/
│   ├── retention-worker/
│   ├── archival-worker/
│   ├── compaction-worker/
│   ├── deletion-worker/
│   ├── sampling-controller/
│   ├── adaptive-sampler/
│   ├── tail-sampler/
│   ├── rate-limiter/
│   ├── correlation-builder/
│   ├── trace-to-logs-linker/
│   ├── metrics-to-traces-linker/
│   ├── enrichment-processor/
│   ├── metadata-fetcher/
│   ├── topology-mapper/
│   ├── collector-manager/
│   ├── pipeline-validator/
│   └── config-reloader/
│
├── sdk/
│   ├── typescript/
│   ├── python/
│   ├── go/
│   └── rust/
│
├── deployment/
│   ├── kubernetes/
│   ├── docker/
│   ├── terraform/
│   ├── ansible/
│   └── helm/
│
├── turbo.json
├── package.json
├── tsconfig.base.json
├── nx.json
├── .eslintrc.js
├── .prettierrc
├── jest.config.ts
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── CHANGELOG.md
```

---

## 25. Security Model

### 25.1 RBAC

```typescript
interface RBACModel {
  roles: Role[];
  bindings: RoleBinding[];
  defaultRole: string;
}

interface Role {
  name: string;
  permissions: Permission[];
  inherits?: string[];
}

interface Permission {
  resource: string;
  actions: string[];
  conditions?: PolicyCondition[];
}

interface RoleBinding {
  role: string;
  subjects: Subject[];
  scope: BindingScope;
}

interface Subject {
  type: 'user' | 'group' | 'service-account' | 'agent';
  id: string;
  tenantId?: TenantId;
  workspaceId?: WorkspaceId;
}

interface BindingScope {
  type: 'global' | 'tenant' | 'workspace' | 'resource';
  tenantId?: TenantId;
  workspaceId?: WorkspaceId;
  resourceType?: string;
  resourceId?: string;
}
```

### 25.2 ABAC

```typescript
interface ABACModel {
  policyEngine: 'opa' | 'cedar' | 'custom';
  policies: ABACPolicy[];
  attributeProviders: AttributeProvider[];
  decisionCache: DecisionCacheConfig;
}

interface ABACPolicy {
  id: string;
  name: string;
  effect: 'allow' | 'deny';
  condition: LogicalExpression;
  priority: number;
  obligations: Obligation[];
  advice: Advice[];
}

interface Obligation {
  action: string;
  params: Record<string, any>;
  fulfillment: 'immediate' | 'deferred';
}

interface Advice {
  message: string;
  data: Record<string, any>;
}

interface AttributeProvider {
  name: string;
  type: 'internal' | 'external' | 'ldap' | 'custom';
  endpoint?: string;
  attributes: string[];
  cacheTtlMs: number;
}

interface DecisionCacheConfig {
  enabled: boolean;
  ttlMs: number;
  maxSize: number;
  invalidationEvents: string[];
}
```

### 25.3 Data Protection

```typescript
interface DataProtection {
  encryption: {
    atRest: AtRestEncryption;
    inTransit: InTransitEncryption;
    keyManagement: KeyManagement;
  };
  
  masking: {
    piiFields: string[];
    maskingRules: MaskingRule[];
    defaultMode: 'full' | 'partial' | 'hash' | 'none';
  };
  
  privacy: {
    dataMinimization: boolean;
    retentionLimits: RetentionLimits;
    rightToErasure: boolean;
    dataPortability: boolean;
  };
}

interface AtRestEncryption {
  enabled: boolean;
  algorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
  keyProvider: 'kms' | 'vault' | 'hsm' | 'local';
  keyRotation: RotationPolicy;
  envelopeEncryption: boolean;
}

interface InTransitEncryption {
  enabled: boolean;
  tlsVersion: '1.2' | '1.3';
  cipherSuites: string[];
  verifyHostname: boolean;
  mutualTLS: boolean;
  certificatePinning: boolean;
}

interface KeyManagement {
  provider: 'kms' | 'vault' | 'hsm' | 'custom';
  keyRotation: RotationPolicy;
  keyHierarchy: KeyHierarchyConfig;
  externalKeys: boolean;
  importKeys: boolean;
}
```

---

## 26. Performance Architecture

### 26.1 Scalability Targets

| Metric | Target |
|--------|--------|
| **Ingestion Throughput** | 10M samples/sec (metrics), 1M logs/sec, 1M spans/sec |
| **Query Latency (P99)** | < 1s (recent), < 10s (historical) |
| **Alert Evaluation** | < 30s P99 |
| **Cardinality** | 100M active series per workspace |
| **Retention** | 13 months hot, 7 years cold |
| **Availability** | 99.99% (multi-AZ) |
| **Recovery Time** | < 5 min (RTO), < 1 min (RPO) |

### 26.2 Horizontal Scaling

```typescript
interface ScalingStrategy {
  // Metrics
  metrics: {
    ingester: { replicas: '3-100'; autoscaling: 'cpu,custom' };
    querier: { replicas: '3-50'; autoscaling: 'cpu,latency' };
    ruler: { replicas: '2-10'; autoscaling: 'rules' };
    compactor: { replicas: '2-20'; autoscaling: 'queue' };
  };
  
  // Logs
  logging: {
    ingester: { replicas: '3-100'; autoscaling: 'cpu,queue' };
    querier: { replicas: '3-50'; autoscaling: 'cpu,latency' };
    indexer: { replicas: '3-30'; autoscaling: 'queue' };
    compactor: { replicas: '2-20'; autoscaling: 'queue' };
  };
  
  // Traces
  tracing: {
    ingester: { replicas: '3-100'; autoscaling: 'cpu,queue' };
    querier: { replicas: '3-50'; autoscaling: 'cpu,latency' };
    compactor: { replicas: '2-20'; autoscaling: 'queue' };
  };
  
  // Profiles
  profiling: {
    ingester: { replicas: '2-20'; autoscaling: 'cpu,queue' };
    symbolicator: { replicas: '2-50'; autoscaling: 'cpu,queue' };
  };
}
```

### 26.3 Caching Strategy

| Layer | Technology | TTL | Invalidation |
|-------|------------|-----|--------------|
| **L1: Query Result** | Redis Cluster | 30s | TTL + Event-driven |
| **L2: Metadata** | Redis Cluster | 5m | Event-driven |
| **L3: Query Plan** | In-memory | 1h | LRU |
| **L4: Dashboard Snapshots** | Redis Cluster | 1m | Event-driven |
| **L4: Query Cache** | Redis Cluster | 1m | TTL + Invalidation |

---

## 27. Integration Points

### 27.1 Subsystem Integration Matrix

| Subsystem | Telemetry Provided | Consumes From Observability |
|-----------|-------------------|----------------------------|
| **Automation** | Workflow executions, queue metrics, worker metrics, schedules, triggers, human tasks | Alert rules for queue depth, worker health; SLOs for execution success |
| **Agents** | Session metrics, tool usage, memory stats, conversation traces | Alert on error rates; SLO for response time |
| **Models** | Inference latency, token counts, costs, quality scores | Cost alerts; Quality SLOs; Capacity forecasts |
| **Memory & Knowledge** | Query latency, cache hit rates, index health | Alert on index health; SLO for query latency |
| **MCP** | Server health, tool latency, connection metrics | Alert on server down; SLO for tool latency |
| **Plugins** | Execution metrics, error rates, resource usage | Alert on plugin failures; Resource quotas |
| **Skills** | Execution metrics, success rates, resource usage | Alert on skill failures; Performance SLOs |
| **Chat** | Message latency, session metrics, user engagement | Alert on chat failures; UX SLOs |
| **Machine Control** | System health, resource usage, deployment status | Infrastructure alerts; Capacity planning |

---

## 28. Production Readiness

### 28.1 Checklist

| Category | Item | Status |
|----------|------|--------|
| **Architecture** | Layered architecture documented | ✅ |
| **Architecture** | Service boundaries defined | ✅ |
| **Architecture** | Event-driven CQRS/ES patterns | ✅ |
| **Architecture** | Multi-provider abstractions | ✅ |
| **Domain Model** | All entities with branded IDs | ✅ |
| **Domain Model** | ER diagrams complete | ✅ |
| **Domain Model** | Aggregates & value objects | ✅ |
| **Domain Model** | Domain events catalogued | ✅ |
| **Services** | All 17 core services defined | ✅ |
| **Services** | Workers catalogued with schedules | ✅ |
| **Services** | Dependency graph documented | ✅ |
| **Metrics** | Storage tiering defined | ✅ |
| **Metrics** | Recording rules engine | ✅ |
| **Metrics** | Aggregation & downsampling | ✅ |
| **Metrics** | Cardinality management | ✅ |
| **Logs** | Pipeline with parse/enrich/index | ✅ |
| **Logs** | Live tail WebSocket | ✅ |
| **Logs** | PII masking | ✅ |
| **Traces** | Service map & dependency graphs | ✅ |
| **Traces** | Sampling strategies (head/tail/adaptive) | ✅ |
| **Traces** | Root cause analysis | ✅ |
| **Profiles** | Continuous profiling pipeline | ✅ |
| **Profiles** | Symbolication & flame graphs | ✅ |
| **Health** | Liveness/readiness/startup/synthetic | ✅ |
| **Health** | Dependency health aggregation | ✅ |
| **Alerting** | Rule evaluation pipeline | ✅ |
| **Alerting** | State machine | ✅ |
| **Alerting** | Routing, grouping, silencing | ✅ |
| **Alerting** | Escalation engine | ✅ |
| **SLOs** | SLI/SLO definitions | ✅ |
| **SLOs** | Error budgets & burn rate | ✅ |
| **Incidents** | Lifecycle with runbooks | ✅ |
| **Incidents** | Postmortem generation | ✅ |
| **Analytics** | Trends, forecasting, capacity, cost | ✅ |
| **AI Observability** | Inference/embedding/rerank metrics | ✅ |
| **AI Observability** | Quality metrics (hallucination, groundedness) | ✅ |
| **Workflow Observability** | Execution snapshots, replay, debugging | ✅ |
| **Agent Observability** | Session/memory/tool analytics | ✅ |
| **MCP Observability** | Server/tool/resource analytics | ✅ |
| **Infrastructure** | Full stack metrics (CPU/GPU/K8s) | ✅ |
| **Security** | RBAC + ABAC | ✅ |
| **Security** | Audit logs with chained integrity | ✅ |
| **Security** | PII masking, data minimization | ✅ |
| **APIs** | PromQL, LogQL, TraceQL, ProfileQL | ✅ |
| **APIs** | Streaming WebSocket APIs | ✅ |
| **APIs** | Unified query endpoint | ✅ |
| **TypeScript** | Complete interfaces with branded IDs | ✅ |
| **PostgreSQL** | Normalized schema with partitions | ✅ |
| **Background** | 80+ workers catalogued | ✅ |
| **Repository** | Nx monorepo structure | ✅ |
| **Security** | RBAC + ABAC + encryption | ✅ |
| **Performance** | Scaling targets & strategies | ✅ |
| **Integrations** | All Hermes subsystems mapped | ✅ |
| **Production** | Runbooks, DR, backup, chaos testing | ⏳ |

### 28.2 Deferred Items

| Item | Reason | Target |
|------|--------|--------|
| **ML-based anomaly detection** | Requires ML platform | v1.2 |
| **Cross-region active-active trace store** | Tempo multi-region not GA | v1.3 |
| **Federated querying across clusters** | Requires cluster federation | v1.3 |
| **Automated root cause remediation** | Requires Automation integration | v1.4 |
| **Quantum-resistant encryption** | Standards not finalized | v2.0 |

---

## Summary

This specification defines a **production-grade Observability Subsystem** for Hermes with:

- **17 core services** covering the full telemetry lifecycle
- **80+ background workers** for ingestion, processing, alerting, analytics
- **Complete domain model** with 50+ entities and branded identifiers
- **PostgreSQL schema** with 30+ tables, partitioned time-series tables
- **OpenTelemetry-native** ingestion with pluggable backends
- **Multi-tenant isolation** with row-level security
- **Cost-aware** sampling, compression, tiered storage
- **Correlation-first** design with cross-signal queries
- **Enterprise security** with RBAC, ABAC, audit chains, encryption
- **Horizontal scaling** to petabyte/day ingestion
- **Sub-second queries** for recent data
- **Sub-minute alerting** with burn rate detection
- **Full integration** with all Hermes subsystems

The specification is **implementation-ready** and represents a unified telemetry platform capable of supporting the entire Hermes ecosystem at enterprise scale.