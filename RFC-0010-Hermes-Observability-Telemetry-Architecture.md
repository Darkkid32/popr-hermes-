# RFC-0010
# Hermes Observability & Telemetry Architecture

**Status:** Approved
**Author:** Hermes Team
**Owner:** Chief System Architect
**Version:** 1.0
**Priority:** Critical
**Depends On:** RFC-0001 (Foundation), RFC-0002 v1.1 (Core Architecture), RFC-0003 v1.1 (Event Bus), RFC-0004 v1.1 (Gateway), RFC-0005 v1.1 (Memory Architecture), RFC-0006 v1.1 (Knowledge Architecture), RFC-0007 v1.1 (Security & Identity Architecture), RFC-0008 v1.1 (Agent Runtime & Orchestration Architecture), RFC-0009 v1.1 (Tool, Plugin & Provider Architecture)

---

## 1. Executive Summary

This RFC defines the **Hermes Observability & Telemetry Architecture** — the comprehensive monitoring, alerting, debugging, and compliance framework for the Hermes Agent OS. It establishes standardized observability across all distributed components including the Agent Runtime, Event Bus, Gateway, Memory, Knowledge, Security, and Extensibility layers.

The architecture provides **four pillars of observability**:
- **Metrics** — Prometheus-compatible time-series with OpenTelemetry semantic conventions
- **Logs** — Structured JSON logging with correlation IDs, severity levels, and tenant isolation
- **Traces** — Distributed tracing via OpenTelemetry with W3C TraceContext propagation
- **Audit** — Tamper-evident Merkle transparency log for all security-relevant events

All observability data flows through the **Observability Plane** — a dedicated infrastructure layer that collects, processes, stores, and exposes telemetry without interfering with the control plane or data plane.

---

## 2. Problem Statement

Hermes Agent OS operates as a distributed system spanning multiple services, tenants, and geographic regions. Without a unified observability architecture:

1. **Debugging distributed workflows** across Agent Runtime, Event Bus, Gateway, and Extensibility components is impossible without correlated traces
2. **SLO compliance** cannot be measured or enforced without standardized SLI definitions
3. **Security incidents** cannot be investigated without tamper-evident audit trails
4. **Capacity planning** requires per-tenant, per-component resource utilization metrics
5. **Regulatory compliance** (GDPR, SOC2, HIPAA) demands structured audit logging with retention policies
6. **Cost attribution** requires per-tenant token usage, compute, and storage metrics

---

## 3. Goals

| Goal | Description |
|------|-------------|
| **Unified Telemetry** | Single OpenTelemetry SDK across all components; auto-instrumentation where possible |
| **Correlation** | End-to-end traceability from user request to agent to tool to provider to response |
| **Tenant Isolation** | Complete observability data separation per tenant; no cross-tenant leakage |
| **Security by Default** | All telemetry encrypted in transit (mTLS) and at rest; PII redaction |
| **Audit Integrity** | Merkle transparency log for all authZ/authN, capability, and data access events |
| **Operational Simplicity** | Self-describing metrics with semantic conventions; standardized dashboards |
| **Cost Efficiency** | Adaptive sampling, tiered storage (hot/warm/cold), compression |
| **Compliance Ready** | GDPR right-to-erasure, SOC2 audit trails, HIPAA-compliant retention |

---

## 4. Non-Goals

| Non-Goal | Rationale |
|----------|-----------|
| **Custom Time-Series Database** | Leverage Prometheus/Thanos/Cortex ecosystem |
| **Custom Log Aggregation** | Use OpenTelemetry Collector + Loki/Elasticsearch |
| **Custom Trace Storage** | Use Tempo/Jaeger backend |
| **Alerting Engine** | Delegate to Prometheus Alertmanager / Grafana Alerting |
| **Visualization** | Grafana dashboards; no custom UI |
| **Anomaly Detection** | ML-based detection deferred to RFC-0011 (Automation) |
| **Business Analytics** | Separate data warehouse pipeline; not real-time observability |

---

## 5. Architecture Overview

```
+==============================================================================+
|                        HERMES OBSERVABILITY PLANE                            |
|                                                                              |
|  +------------------+  +------------------+  +------------------+            |
|  |   METRICS        |  |   LOGS           |  |   TRACES         |            |
|  |   PIPELINE       |  |   PIPELINE       |  |   PIPELINE       |            |
|  |                  |  |                  |  |                  |            |
|  | OpenTelemetry    |  | OpenTelemetry    |  | OpenTelemetry    |            |
|  |   Collector      |  |   Collector      |  |   Collector      |            |
|  | Prometheus       |  | Loki             |  | Tempo            |            |
|  |   Remote Write   |  | Structured JSON  |  | W3C              |            |
|  | Thanos           |  | Correlation      |  |   TraceContext   |            |
|  |   Sidecar        |  |                  |  | Sampling         |            |
|  +--------+---------+  +--------+---------+  +--------+---------+            |
|           |                   |                   |                        |
|           +---------+---------+---------+---------+                        |
|                     |                   |                                  |
|                     v                   v                                  |
|  +=========================================================================+ |
|  |                    AUDIT PIPELINE (Merkle Transparency)                 | |
|  |  RFC-0007 Integration: authZ/authN, capability, data access events     | |
|  +=========================================================================+ |
|                                                                              |
+==============================================================================+
                              |
                              v
+==============================================================================+
|                         CONTROL PLANE INTEGRATION                            |
|                                                                              |
|  RFC-0002 Core          RFC-0003 Event Bus      RFC-0004 Gateway            |
|  - Agent Runtime        - NATS JetStream        - Protocol Adapters         |
|  - Task Orchestrator    - Consumer Groups       - Connection Manager        |
|  - WASM Sandbox         - DLQ                   - Rate Limiter              |
|  - Memory/Knowledge     - Supercluster          - CRDT Sync                 |
|                                                                              |
|  RFC-0005 Memory        RFC-0006 Knowledge      RFC-0007 Security           |
|  - 4-Tier Hierarchy     - Ingestion Pipeline    - SPIFFE/PASETO             |
|  - Consolidation        - RAG + Graph           - Envoy Egress              |
|  - Vector Search        - Freshness             - Audit Log                 |
|                                                                              |
|  RFC-0008 Runtime       RFC-0009 Extensibility                              |
|  - Agent Lifecycle      - Tool/Plugin/Provider  - MCP Gateway               |
|  - Workflow Orchestrat. - Provider Router       - WASM Execution            |
|  - Checkpointing        - Model Orchestrator    - Capability Discovery      |
|                                                                              |
+==============================================================================+
```

### 5.1 Data Flow

```
COMPONENT (OTel SDK) -> OTel Collector (Agent) -> OTel Collector (Gateway)
                                                          |
                    +-------------------------------------+------------------+
                    v                                     v                    v
            PROMETHEUS/THANOS                       LOKI/ELASTICSEARCH        TEMPO
            (Metrics)                                (Logs)                    (Traces)
                    |                                     |                       |
                    +-------------------------------------+-----------------------+
                                                          |
                                                          v
                                                +---------------------+
                                                |  MERKLE AUDIT LOG   |
                                                |  (RFC-0007)         |
                                                |  Immutable,         |
                                                |  Tamper-evident     |
                                                +---------------------+
                                                          |
                    +-------------------------------------+------------------+
                    v                                     v                    v
            GRAFANA DASHBOARDS                     ALERTMANAGER            COMPLIANCE
            (Visualization)                        (Alerting)              (Audit/API)
```

---

## 6. Components

### 6.1 OpenTelemetry Collector (Agent)

**Deployment:** DaemonSet per node; one per Kubernetes node / VM

**Responsibilities:**
- Receive OTLP/gRPC, OTLP/HTTP, Prometheus scrape, Jaeger, Zipkin
- Process: batch, memory_limiter, k8sattributes, resource detection, tail sampling
- Export: Prometheus Remote Write, Loki, Tempo, Audit Log Forwarder
- Resource Attributes: `service.name`, `service.namespace`, `service.instance.id`, `deployment.environment`, `hermes.tenant_id`, `hermes.component_type`

```yaml
# otel-collector-agent-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
  prometheus:
    config:
      scrape_configs:
        - job_name: 'hermes-components'
          kubernetes_sd_configs:
            - role: pod
          relabel_configs:
            - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
              action: keep
              regex: true

processors:
  batch:
    timeout: 10s
    send_batch_max_size: 1024
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
  k8sattributes:
    auth_type: service_account
    filter:
      node_from_env_var: KUBERNETES_NODE_NAME
  resource:
    attributes:
      - key: hermes.component_type
        action: insert
        value: "${HERMES_COMPONENT_TYPE}"
      - key: hermes.tenant_id
        action: insert
        value: "${HERMES_TENANT_ID}"

exporters:
  prometheusremotewrite:
    endpoint: "https://thanos-receive:19291/api/v1/receive"
    tls:
      ca_file: /etc/otel/certs/ca.crt
      cert_file: /etc/otel/certs/client.crt
      key_file: /etc/otel/certs/client.key
  loki:
    endpoint: "https://loki-gateway:3100/loki/api/v1/push"
    tenant_id: "${HERMES_TENANT_ID}"
  tempo:
    endpoint: "tempo-distributor:4317"
    tls:
      ca_file: /etc/otel/certs/ca.crt
  auditevents:
    endpoint: "https://audit-ingest:8443/v1/events"
    headers:
      Authorization: "Bearer ${AUDIT_TOKEN}"

service:
  pipelines:
    metrics:
      receivers: [otlp, prometheus]
      processors: [memory_limiter, batch, k8sattributes, resource]
      exporters: [prometheusremotewrite]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, batch, k8sattributes, resource]
      exporters: [loki]
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch, k8sattributes, resource, tail_sampling]
      exporters: [tempo]
    audit:
      receivers: [otlp]
      processors: [memory_limiter, batch, resource]
      exporters: [auditevents]
```

### 6.2 OpenTelemetry Collector (Gateway)

**Deployment:** Deployment with HPA; central aggregation point

**Responsibilities:**
- Aggregate from all Agent Collectors
- Tail-based sampling decisions (see Section 16.3)
- PII redaction and data classification
- Multi-tenant log/metric/trace routing
- Forward to Thanos, Loki, Tempo, Audit Ingest

### 6.3 Prometheus / Thanos

**Components:**
- **Prometheus (Sidecar per namespace):** Local scrape, 2h retention, remote write to Thanos Receive
- **Thanos Receive:** Ingest from all Prometheus instances; deduplication; 14d hot storage
- **Thanos Store:** Query historical data from object storage (S3/GCS)
- **Thanos Query:** Global query endpoint for Grafana
- **Thanos Compactor:** Downsampling (5m to 1h), compaction, retention enforcement

### 6.4 Loki

**Components:**
- **Loki Distributor:** Ingest from Gateway Collectors; tenant validation
- **Loki Ingester:** Write-ahead log; chunk encoding; flush to object storage
- **Loki Querier/Query Frontend:** Query acceleration; result caching
- **Loki Compactor:** Retention, index compaction, chunk deduplication

### 6.5 Tempo

**Components:**
- **Tempo Distributor:** Ingest traces; tenant validation; batching
- **Tempo Ingester:** Write-ahead log; block formation; flush to object storage
- **Tempo Querier:** Trace lookup by trace ID, service, operation, tags
- **Tempo Compactor:** Block compaction, retention, bloom filter generation

### 6.6 Audit Ingest Service

**Deployment:** StatefulSet with leader election; dedicated infra

**Responsibilities:**
- Receive audit events from Gateway Collectors
- Validate event schema and signatures
- Append to Merkle tree; publish Merkle root to transparency log
- Serve audit queries with cryptographic proofs
- Enforce retention policies (7 years default)

---

## 7. Interfaces

### 7.1 Component to Collector (OTLP)

All Hermes components **MUST** instrument using OpenTelemetry SDK and export via OTLP/gRPC to the local Agent Collector.

**Required SDK Configuration:**
```go
// Go example - all components use this pattern
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
    "go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"
    "go.opentelemetry.io/otel/sdk/resource"
    semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

func initTelemetry(componentType, tenantID string) (*sdktrace.TracerProvider, *sdkmetric.MeterProvider, *sdklog.LoggerProvider, error) {
    res, _ := resource.New(context.Background(),
        resource.WithAttributes(
            semconv.ServiceName("hermes-" + componentType),
            semconv.ServiceNamespace("hermes"),
            semconv.DeploymentEnvironment(os.Getenv("DEPLOYMENT_ENV")),
            attribute.String("hermes.component_type", componentType),
            attribute.String("hermes.tenant_id", tenantID),
        ),
    )

    traceExp, _ := otlptracegrpc.New(context.Background(),
        otlptracegrpc.WithEndpoint("localhost:4317"),
        otlptracegrpc.WithInsecure(),
    )
    metricExp, _ := otlpmetricgrpc.New(context.Background(),
        otlpmetricgrpc.WithEndpoint("localhost:4317"),
        otlpmetricgrpc.WithInsecure(),
    )
    logExp, _ := otlploggrpc.New(context.Background(),
        otlploggrpc.WithEndpoint("localhost:4317"),
        otlploggrpc.WithInsecure(),
    )

    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(traceExp),
        sdktrace.WithResource(res),
        sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.TraceIDRatioBased(0.1))),
    )
    mp := sdkmetric.NewMeterProvider(
        sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExp, sdkmetric.WithInterval(30*time.Second))),
        sdkmetric.WithResource(res),
    )
    lp := sdklog.NewLoggerProvider(
        sdklog.WithProcessor(sdklog.NewBatchProcessor(logExp)),
        sdklog.WithResource(res),
    )

    otel.SetTracerProvider(tp)
    otel.SetMeterProvider(mp)

    return tp, mp, lp, nil
}
```

### 7.2 Collector to Backends

| Pipeline | Protocol | Endpoint | Auth |
|----------|----------|----------|------|
| Metrics | Prometheus Remote Write | `thanos-receive:19291/api/v1/receive` | mTLS |
| Logs | Loki Push API | `loki-gateway:3100/loki/api/v1/push` | Bearer (tenant) |
| Traces | OTLP/gRPC | `tempo-distributor:4317` | mTLS |
| Audit | HTTPS/JSON | `audit-ingest:8443/v1/events` | mTLS + JWT |

---

## 8. APIs / gRPC / Protobuf Definitions

### 8.1 Observability Configuration API

```protobuf
// observability.proto
syntax = "proto3";

package hermes.observability.v1;

import "google/protobuf/duration.proto";
import "google/protobuf/struct.proto";

service ObservabilityConfig {
  rpc GetConfig(GetConfigRequest) returns (ObservabilityConfig);
  rpc UpdateConfig(UpdateConfigRequest) returns (ObservabilityConfig);
  rpc GetSamplingConfig(GetSamplingConfigRequest) returns (SamplingConfig);
  rpc UpdateSamplingConfig(UpdateSamplingConfigRequest) returns (SamplingConfig);
  rpc GetRedactionRules(GetRedactionRulesRequest) returns (RedactionRules);
  rpc UpdateRedactionRules(UpdateRedactionRulesRequest) returns (RedactionRules);
}

message GetConfigRequest {
  string component_type = 1;
  string tenant_id = 2;
}

message UpdateConfigRequest {
  string component_type = 1;
  string tenant_id = 2;
  ObservabilityConfig config = 3;
}

message ObservabilityConfig {
  MetricsConfig metrics = 1;
  LogsConfig logs = 2;
  TracesConfig traces = 3;
  AuditConfig audit = 4;
  map<string, string> resource_attributes = 5;
}

message MetricsConfig {
  bool enabled = 1;
  int32 scrape_interval_seconds = 2;
  int32 remote_write_timeout_seconds = 3;
  repeated string extra_label_keys = 4;
  bool exemplars_enabled = 5;
}

message LogsConfig {
  bool enabled = 1;
  int32 batch_timeout_seconds = 2;
  int32 batch_max_size = 3;
  LogLevel min_level = 4;
  bool structured_logging = 5;
  bool include_trace_context = 6;
}

message TracesConfig {
  bool enabled = 1;
  SamplingConfig sampling = 2;
  int32 batch_timeout_seconds = 3;
  int32 batch_max_size = 4;
  bool w3c_tracecontext = 5;
}

message AuditConfig {
  bool enabled = 1;
  repeated AuditEventType event_types = 2;
  int32 batch_timeout_seconds = 3;
  bool sign_events = 4;
}

enum LogLevel {
  LOG_LEVEL_UNSPECIFIED = 0;
  LOG_LEVEL_DEBUG = 1;
  LOG_LEVEL_INFO = 2;
  LOG_LEVEL_WARN = 3;
  LOG_LEVEL_ERROR = 4;
  LOG_LEVEL_FATAL = 5;
}

enum AuditEventType {
  AUDIT_EVENT_TYPE_UNSPECIFIED = 0;
  AUDIT_AUTHN = 1;
  AUDIT_AUTHZ = 2;
  AUDIT_CAPABILITY = 3;
  AUDIT_DATA_ACCESS = 4;
  AUDIT_TOOL_EXEC = 5;
  AUDIT_PROVIDER_CALL = 6;
  AUDIT_CONFIG_CHANGE = 7;
  AUDIT_TENANT_LIFECYCLE = 8;
}
```

### 8.2 Sampling Configuration

```protobuf
message SamplingConfig {
  HeadSampling head_sampling = 1;
  TailSampling tail_sampling = 2;
  map<string, SamplingConfig> tenant_overrides = 3;
}

message HeadSampling {
  SamplingStrategy strategy = 1;
  double probability = 2;
  int32 rate_limit_per_second = 3;
  bool parent_based = 4;
}

message TailSampling {
  bool enabled = 1;
  repeated TailSamplingPolicy policies = 2;
  google.protobuf.Duration decision_wait = 3;
  int32 max_traces_in_buffer = 4;
}

message TailSamplingPolicy {
  string name = 1;
  PolicyType type = 2;
  PolicyCondition condition = 3;
  double rate = 4;
}

enum PolicyType {
  POLICY_TYPE_UNSPECIFIED = 0;
  ALWAYS_SAMPLE = 1;
  ERROR_SAMPLE = 2;
  LATENCY_SAMPLE = 3;
  RATE_LIMIT = 4;
}

message PolicyCondition {
  repeated string service_names = 1;
  repeated string operation_names = 2;
  google.protobuf.Duration min_duration = 3;
  repeated int32 status_codes = 4;
  map<string, string> attributes = 5;
}
```

### 8.3 PII Redaction Rules

```protobuf
message RedactionRules {
  repeated RedactionRule rules = 1;
  RedactionMode default_mode = 2;
}

message RedactionRule {
  string field_path = 1;
  string pattern = 2;
  RedactionAction action = 3;
}

enum RedactionMode {
  REDACTION_MODE_UNSPECIFIED = 0;
  REDACT = 1;
  HASH = 2;
  MASK = 3;
  ALLOW = 4;
}

enum RedactionAction {
  REDACTION_ACTION_UNSPECIFIED = 0;
  REDACT = 1;
  HASH = 2;
  MASK = 3;
  ALLOW = 4;
}
```

### 8.4 Metrics Query API

```protobuf
service MetricsQuery {
  rpc Query(QueryRequest) returns (QueryResponse);
  rpc QueryRange(QueryRangeRequest) returns (QueryRangeResponse);
  rpc LabelValues(LabelValuesRequest) returns (LabelValuesResponse);
  rpc Series(SeriesRequest) returns (SeriesResponse);
  rpc Metadata(MetadataRequest) returns (MetadataResponse);
}

message QueryRequest {
  string query = 1;
  string tenant_id = 2;
  google.protobuf.Timestamp time = 3;
}

message QueryResponse {
  string result_type = 1;
  repeated Sample samples = 2;
  string error = 3;
}

message Sample {
  map<string, string> labels = 1;
  double value = 2;
  google.protobuf.Timestamp timestamp = 3;
}
```

### 8.5 Logs Query API

```protobuf
service LogsQuery {
  rpc Query(LogsQueryRequest) returns (LogsQueryResponse);
  rpc Tail(LogsTailRequest) returns (stream LogEntry);
  rpc LabelValues(LogsLabelValuesRequest) returns (LogsLabelValuesResponse);
}

message LogsQueryRequest {
  string query = 1;
  string tenant_id = 2;
  google.protobuf.Timestamp start = 3;
  google.protobuf.Timestamp end = 4;
  int32 limit = 5;
  bool reverse = 6;
}

message LogsQueryResponse {
  repeated LogEntry entries = 1;
  string error = 2;
}

message LogEntry {
  google.protobuf.Timestamp timestamp = 1;
  map<string, string> labels = 2;
  string line = 3;
  google.protobuf.Struct structured = 4;
  string trace_id = 5;
  string span_id = 6;
}
```

### 8.6 Traces Query API

```protobuf
service TracesQuery {
  rpc GetTrace(GetTraceRequest) returns (Trace);
  rpc Search(SearchTracesRequest) returns (SearchTracesResponse);
  rpc GetSpan(GetSpanRequest) returns (Span);
  rpc ServiceGraph(ServiceGraphRequest) returns (ServiceGraphResponse);
}

message GetTraceRequest {
  string trace_id = 1;
  string tenant_id = 2;
}

message Trace {
  string trace_id = 1;
  repeated Span spans = 2;
  map<string, string> resources = 3;
}

message Span {
  string span_id = 1;
  string trace_id = 2;
  string parent_span_id = 3;
  string service_name = 4;
  string operation_name = 5;
  google.protobuf.Timestamp start_time = 6;
  google.protobuf.Timestamp end_time = 7;
  SpanStatus status = 8;
  map<string, string> attributes = 9;
  repeated SpanEvent events = 10;
  repeated SpanLink links = 11;
}

message SpanStatus {
  StatusCode code = 1;
  string message = 2;
}
```

### 8.7 Audit Event Schema

```protobuf
// audit.proto
syntax = "proto3";

package hermes.audit.v1;

import "google/protobuf/timestamp.proto";
import "google/protobuf/struct.proto";

message AuditEvent {
  string event_id = 1;
  AuditEventType event_type = 2;
  google.protobuf.Timestamp timestamp = 3;
  Actor actor = 4;
  Resource target = 5;
  string action = 6;
  AuditDecision decision = 7;
  RequestContext request_context = 8;
  Result result = 9;
  AuditProof proof = 10;
}

enum AuditEventType {
  AUDIT_EVENT_TYPE_UNSPECIFIED = 0;
  AUTHN_LOGIN = 1;
  AUTHN_LOGOUT = 2;
  AUTHN_MFA_CHALLENGE = 3;
  AUTHZ_DECISION = 10;
  CAPABILITY_GRANT = 20;
  CAPABILITY_REVOKE = 21;
  CAPABILITY_DELEGATE = 22;
  TOOL_EXECUTE = 30;
  TOOL_EXECUTE_STREAM = 31;
  PROVIDER_CALL = 40;
  PROVIDER_STREAM = 41;
  MEMORY_READ = 50;
  MEMORY_WRITE = 51;
  MEMORY_DELETE = 52;
  KNOWLEDGE_INGEST = 60;
  KNOWLEDGE_SEARCH = 61;
  KNOWLEDGE_DELETE = 62;
  CONFIG_CHANGE = 70;
  TENANT_CREATE = 80;
  TENANT_SUSPEND = 81;
  TENANT_DELETE = 82;
}

message Actor {
  string actor_id = 1;
  ActorType actor_type = 2;
  string tenant_id = 3;
  AuthnContext authn = 4;
}

enum ActorType {
  ACTOR_TYPE_UNSPECIFIED = 0;
  USER = 1;
  AGENT = 2;
  SERVICE = 3;
  SYSTEM = 4;
}

message AuthnContext {
  string method = 1;
  string credential_id = 2;
  google.protobuf.Timestamp authenticated_at = 3;
  repeated string granted_capabilities = 4;
}

message Resource {
  string resource_id = 1;
  ResourceType resource_type = 2;
  string tenant_id = 3;
  map<string, string> labels = 4;
}

enum ResourceType {
  RESOURCE_TYPE_UNSPECIFIED = 0;
  AGENT = 1;
  TASK = 2;
  WORKFLOW = 3;
  TOOL = 4;
  PROVIDER = 5;
  MODEL = 6;
  MEMORY_WORKING = 10;
  MEMORY_EPISODIC = 11;
  MEMORY_SEMANTIC = 12;
  MEMORY_PROCEDURAL = 13;
  KNOWLEDGE_COLLECTION = 20;
  KNOWLEDGE_DOCUMENT = 21;
  EVENT_STREAM = 30;
  GATEWAY_CONNECTION = 40;
  CAPABILITY_TOKEN = 50;
  CONFIGURATION = 60;
  TENANT = 70;
}

enum AuditDecision {
  AUDIT_DECISION_UNSPECIFIED = 0;
  ALLOW = 1;
  DENY = 2;
  ERROR = 3;
}

message RequestContext {
  string request_id = 1;
  string source_ip = 2;
  string user_agent = 3;
  string protocol = 4;
  map<string, string> headers = 5;
}

message Result {
  bool success = 1;
  string error_code = 2;
  string error_message = 3;
  google.protobuf.Struct metadata = 4;
  int64 duration_ms = 5;
  int64 tokens_used = 6;
  int64 bytes_read = 7;
  int64 bytes_written = 8;
}

message AuditProof {
  string merkle_root = 1;
  int64 tree_size = 2;
  repeated string sibling_hashes = 3;
  int64 leaf_index = 4;
  string signature = 5;
  string signing_key_id = 6;
  google.protobuf.Timestamp signed_at = 7;
}
```

---

## 9. Data Models

### 9.1 Metric Naming Convention

All metrics **MUST** follow OpenTelemetry Semantic Conventions v1.21+ with Hermes-specific extensions.

**Format:** `{domain}.{subsystem}.{operation}.{unit}`

| Metric | Type | Description |
|--------|------|-------------|
| `hermes.agent.runtime.spawn.duration.ms` | Histogram | Agent spawn latency |
| `hermes.agent.runtime.active.count` | Gauge | Active agents |
| `hermes.task.duration.ms` | Histogram | Task execution latency |
| `hermes.task.status.total` | Counter | Task completions by status |
| `hermes.tool.execution.duration.ms` | Histogram | Tool execution latency |
| `hermes.tool.execution.status.total` | Counter | Tool execution outcomes |
| `hermes.provider.request.duration.ms` | Histogram | Provider API latency |
| `hermes.provider.tokens.used` | Counter | Token consumption |
| `hermes.memory.working.set.duration.ms` | Histogram | Working memory set latency |
| `hermes.memory.episodic.query.duration.ms` | Histogram | Episodic query latency |
| `hermes.memory.semantic.search.duration.ms` | Histogram | Semantic search latency |
| `hermes.knowledge.ingest.duration.ms` | Histogram | Knowledge ingestion latency |
| `hermes.knowledge.search.duration.ms` | Histogram | Knowledge search latency |
| `hermes.eventbus.publish.duration.ms` | Histogram | NATS publish latency |
| `hermes.eventbus.consume.duration.ms` | Histogram | NATS consume latency |
| `hermes.eventbus.dlq.depth` | Gauge | Dead letter queue depth |
| `hermes.gateway.connection.active.count` | Gauge | Active connections |
| `hermes.gateway.rate_limit.exceeded.total` | Counter | Rate limit rejections |
| `hermes.security.authz.decision.duration.ms` | Histogram | AuthZ decision latency |
| `hermes.security.capability.grant.total` | Counter | Capability grants |
| `hermes.security.capability.revoke.total` | Counter | Capability revocations |

### 9.2 Required Labels

All metrics **MUST** include these labels:

| Label | Description | Example |
|-------|-------------|---------|
| `tenant_id` | Tenant identifier | `tenant-abc123` |
| `component_type` | Component category | `agent-runtime`, `event-bus`, `gateway`, `memory`, `knowledge`, `security`, `tool-executor`, `plugin-loader`, `provider-router` |
| `component_instance` | Unique instance ID | `agent-runtime-7b4f2` |
| `deployment_env` | Environment | `production`, `staging`, `development` |
| `region` | Geographic region | `us-east-1`, `eu-west-1` |

**Component-specific labels:**

| Component | Additional Labels |
|-----------|-------------------|
| `agent-runtime` | `agent_type`, `pool_name` |
| `tool-executor` | `tool_name`, `tool_category` |
| `provider-router` | `provider_id`, `model`, `capability` |
| `memory` | `tier` (working/episodic/semantic/procedural), `operation` |
| `knowledge` | `operation` (ingest/search/retrieve/graph), `collection` |
| `event-bus` | `subject`, `consumer_group`, `stream` |
| `gateway` | `protocol` (ws/sse/grpc/http), `adapter_type` |
| `security` | `decision` (allow/deny), `policy_type` |

### 9.3 Log Structure

All structured logs **MUST** be JSON with these fields:

```json
{
  "timestamp": "2026-07-25T10:30:45.123456789Z",
  "level": "INFO",
  "logger": "hermes.agent.runtime",
  "message": "Agent spawned successfully",
  "tenant_id": "tenant-abc123",
  "component_type": "agent-runtime",
  "component_instance": "agent-runtime-7b4f2",
  "trace_id": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "span_id": "00f067aa0ba902b7",
  "fields": {
    "agent_id": "agent-xyz789",
    "agent_type": "planner",
    "pool": "default",
    "spawn_duration_ms": 45
  }
}
```

**Required fields:** `timestamp`, `level`, `logger`, `message`, `tenant_id`, `component_type`, `component_instance`

**Correlation fields:** `trace_id`, `span_id` (when available)

**Structured fields:** `fields` object with component-specific data

### 9.4 Trace Span Attributes

All spans **MUST** include these standard attributes:

```go
span.SetAttributes(
    attribute.String("service.name", "hermes-agent-runtime"),
    attribute.String("service.namespace", "hermes"),
    attribute.String("service.instance.id", "agent-runtime-7b4f2"),
    attribute.String("deployment.environment", "production"),
    attribute.String("hermes.tenant_id", "tenant-abc123"),
    attribute.String("hermes.component_type", "agent-runtime"),
    attribute.String("hermes.component_instance", "agent-runtime-7b4f2"),
    attribute.String("hermes.agent.id", "agent-xyz789"),
    attribute.String("hermes.agent.type", "planner"),
    attribute.String("hermes.task.id", "task-123"),
    attribute.String("hermes.workflow.id", "wf-456"),
    attribute.String("hermes.tool.name", "code.execute"),
    attribute.String("hermes.tool.category", "code"),
    attribute.String("hermes.tool.idempotency_key", "idem-789"),
    attribute.String("hermes.provider.id", "openai"),
    attribute.String("hermes.provider.model", "gpt-4o"),
    attribute.String("hermes.provider.capability", "llm.chat"),
    attribute.Int64("hermes.provider.tokens.prompt", 1500),
    attribute.Int64("hermes.provider.tokens.completion", 800),
    attribute.Int64("hermes.provider.tokens.total", 2300),
    attribute.String("hermes.memory.tier", "semantic"),
    attribute.String("hermes.memory.operation", "search"),
    attribute.String("hermes.memory.collection", "user-patterns"),
    attribute.String("hermes.knowledge.operation", "search"),
    attribute.String("hermes.knowledge.collection", "docs"),
    attribute.Int64("hermes.knowledge.results.count", 10),
    attribute.String("hermes.eventbus.subject", "hermes.tenant-abc123.agent.spawned"),
    attribute.String("hermes.eventbus.stream", "AGENT_EVENTS"),
    attribute.String("hermes.eventbus.consumer_group", "agent-runtime-group"),
    attribute.String("hermes.gateway.protocol", "websocket"),
    attribute.String("hermes.gateway.adapter", "telegram"),
    attribute.String("hermes.gateway.connection_id", "conn-123"),
    attribute.String("hermes.security.decision", "allow"),
    attribute.String("hermes.security.policy_type", "cedar"),
    attribute.String("hermes.security.capability", "code.exec"),
)
```

---

## 10. Event Model

### 10.1 Observability Events (NATS JetStream)

All observability state changes **MUST** be published to NATS JetStream per RFC-0003.

**Subject Pattern:** `hermes.{tenant}.observability.{component}.{event}`

| Event | Subject | Payload |
|-------|---------|---------|
| Collector Started | `hermes.{tenant}.observability.collector.started` | `{collector_id, component_type, version, config_hash}` |
| Collector Stopped | `hermes.{tenant}.observability.collector.stopped` | `{collector_id, reason, uptime_seconds}` |
| Config Changed | `hermes.{tenant}.observability.config.changed` | `{component_type, changed_fields, changed_by, old_hash, new_hash}` |
| Sampling Changed | `hermes.{tenant}.observability.sampling.changed` | `{policy_name, old_rate, new_rate, changed_by}` |
| Redaction Rule Added | `hermes.{tenant}.observability.redaction.added` | `{rule_id, field_path, action}` |
| Redaction Rule Removed | `hermes.{tenant}.observability.redaction.removed` | `{rule_id, reason}` |
| Backend Unhealthy | `hermes.{tenant}.observability.backend.unhealthy` | `{backend, error, consecutive_failures}` |
| Backend Recovered | `hermes.{tenant}.observability.backend.recovered` | `{backend, recovered_at}` |
| Alert Fired | `hermes.{tenant}.observability.alert.fired` | `{alert_name, severity, labels, annotations, generator_url}` |
| Alert Resolved | `hermes.{tenant}.observability.alert.resolved` | `{alert_name, resolved_at}` |
| SLO Breach | `hermes.{tenant}.observability.slo.breach` | `{slo_name, current_value, target, window}` |
| SLO Recovered | `hermes.{tenant}.observability.slo.recovered` | `{slo_name, recovered_at}` |

---

## 11. Lifecycle

### 11.1 Component Instrumentation Lifecycle

```
COMPONENT START
      |
      v
+------------------+
| INIT OTel SDK   |  -> Create TracerProvider, MeterProvider, LoggerProvider
|                 |  -> Configure resource attributes (tenant, component, instance)
|                 |  -> Configure exporters (OTLP to local Agent Collector)
+--------+--------+
         |
         v
+------------------+
| REGISTER VIEWS  |  -> Define metric views (aggregations, buckets, cardinality limits)
|                 |  -> Register custom instruments
+--------+--------+
         |
         v
+------------------+
| START EXPORT    |  -> Begin periodic metric export (30s interval)
|                 |  -> Begin log batch processing
|                 |  -> Begin trace batch processing
+--------+--------+
         |
         v
+------------------+
| HEALTH CHECK    |  -> Register /healthz endpoint with observability status
| REGISTRATION    |  -> Publish collector.started event
+--------+--------+
         |
         v
   COMPONENT RUNNING
         |
         +--> NORMAL OPERATION (emit telemetry)
         |
         +--> CONFIG RELOAD (SIGHUP / config watch)
         |       |
         |       v
         |  +------------------+
         |  | RECONFIGURE     |  -> Update samplers, redaction rules, log levels
         |  | OTel SDK        |  -> Re-register views if needed
         |  +--------+--------+
         |          |
         |          v
         |  PUBLISH config.changed EVENT
         |
         +--> SIGTERM / SHUTDOWN
         |       |
         |       v
         |  +------------------+
         |  | FLUSH BUFFERS   |  -> Force export all pending metrics, logs, traces
         |  |                 |  -> Timeout: 30s
         |  +--------+--------+
         |          |
         |          v
         |  PUBLISH collector.stopped EVENT
         |
         v
   COMPONENT STOPPED
```

### 11.2 Collector Lifecycle

```
COLLECTOR START
      |
      v
+------------------+
| LOAD CONFIG     |  -> Parse YAML; validate; compute config hash
+--------+--------+
         |
         v
+------------------+
| START RECEIVERS |  -> OTLP gRPC/HTTP, Prometheus, Jaeger, Zipkin
|                 |  -> Health check endpoints
+--------+--------+
         |
         v
+------------------+
| START PROCESSORS|  -> Batch, Memory Limiter, K8s Attributes, Resource
|                 |  -> Tail Sampling (Gateway only)
+--------+--------+
         |
         v
+------------------+
| START EXPORTERS |  -> Connect to backends with retry/backoff
|                 |  -> Validate mTLS certificates
+--------+--------+
         |
         v
+------------------+
| HEALTH CHECKS   |  -> /healthz (liveness), /readyz (readiness)
+--------+--------+
         |
         v
   COLLECTOR RUNNING
```

---

## 12. Security Model

### 12.1 Encryption

| Layer | Protocol | Algorithm | Key Management |
|-------|----------|-----------|----------------|
| In Transit (Component to Collector) | mTLS 1.3 | TLS_AES_256_GCM_SHA384 | SPIFFE/SPIRE (RFC-0007) |
| In Transit (Collector to Backend) | mTLS 1.3 | TLS_AES_256_GCM_SHA384 | SPIFFE/SPIRE |
| In Transit (Audit) | HTTPS + mTLS | TLS_AES_256_GCM_SHA384 | SPIFFE + JWT |
| At Rest (Metrics) | Thanos Object Storage | AES-256-GCM | KMS (per-tenant DEK) |
| At Rest (Logs) | Loki Object Storage | AES-256-GCM | KMS (per-tenant DEK) |
| At Rest (Traces) | Tempo Object Storage | AES-256-GCM | KMS (per-tenant DEK) |
| At Rest (Audit) | PostgreSQL + S3 | AES-256-GCM | KMS (per-tenant DEK) |

### 12.2 Authentication and Authorization

- **Component to Collector:** SPIFFE identity via mTLS; workload attestation
- **Collector to Backend:** SPIFFE identity via mTLS; workload attestation
- **Query APIs:** PASETO v4 capability tokens (RFC-0007) with `observability.query` capability
- **Admin APIs:** PASETO v4 with `observability.admin` capability + MFA

### 12.3 PII Protection

| Protection | Implementation |
|------------|----------------|
| Redaction | Configurable rules at Collector (Gateway); default rules for email, SSN, credit card, API keys |
| Hashing | SHA-256 for identifiers that need correlation without exposure |
| Masking | Partial masking for fields requiring format preservation |
| Classification | Data classification tags on all telemetry (PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED) |
| Tenant Isolation | Separate storage namespaces; row-level security in Loki/Tempo/Thanos |

### 12.4 Audit Integrity

- **Merkle Transparency Log:** All audit events appended to Merkle tree (RFC-0007)
- **Signed Merkle Roots:** Published hourly to transparency log with Ed25519 signatures
- **Proofs:** Inclusion and consistency proofs available for all audit events
- **Tamper Evidence:** Any modification detectable via Merkle proof verification

---

## 13. Authentication and Authorization

### 13.1 Observability Query Permissions

| Capability | Resources | Actions |
|------------|-----------|---------|
| `observability.metrics.read` | Metrics | Query, LabelValues, Series |
| `observability.logs.read` | Logs | Query, Tail, LabelValues |
| `observability.traces.read` | Traces | GetTrace, Search, GetSpan, ServiceGraph |
| `observability.audit.read` | Audit | GetEvent, Search, VerifyProof |
| `observability.config.read` | Config | GetConfig, GetSamplingConfig, GetRedactionRules |
| `observability.config.write` | Config | UpdateConfig, UpdateSamplingConfig, UpdateRedactionRules |
| `observability.admin` | All | Full administrative access |

### 13.2 Authorization Policy (Cedar)

```cedar
permit(
  principal,
  action == Action::"observability.metrics.read",
  resource
) when {
  resource.tenant_id == principal.tenant_id &&
  principal.has_capability("observability.metrics.read")
};

permit(
  principal,
  action == Action::"observability.logs.read",
  resource
) when {
  resource.tenant_id == principal.tenant_id &&
  principal.has_capability("observability.logs.read")
};

permit(
  principal,
  action == Action::"observability.traces.read",
  resource
) when {
  resource.tenant_id == principal.tenant_id &&
  principal.has_capability("observability.traces.read")
};

permit(
  principal,
  action in [Action::"observability.config.write", Action::"observability.admin"],
  resource
) when {
  principal.has_capability("observability.admin") &&
  principal.mfa_verified == true
};
```

---

## 14. Multi-Tenant Considerations

### 14.1 Data Isolation

| Layer | Mechanism |
|-------|-----------|
| Metrics | Thanos Receive per-tenant ingestion; PromQL tenant enforcement |
| Logs | Loki tenant ID in HTTP header; separate index per tenant |
| Traces | Tempo tenant ID in HTTP header; separate blocks per tenant |
| Audit | Separate PostgreSQL schemas + S3 prefixes per tenant |

### 14.2 Cross-Tenant Queries

**MUST NOT** be permitted by default. Admin API with explicit `cross_tenant=true` flag and audit logging required.

### 14.3 Resource Quotas

| Resource | Default Quota | Enforcement |
|----------|---------------|-------------|
| Metric Series | 100,000 per tenant | Thanos Receive rejection |
| Log Volume | 10 GB/day per tenant | Loki distributor rejection |
| Trace Volume | 5 GB/day per tenant | Tempo distributor rejection |
| Audit Events | 1 M/month per tenant | Audit ingest rate limiting |
| Retention (Hot) | 14 days metrics, 7 days logs, 7 days traces | Compactor enforcement |
| Retention (Cold) | 7 years audit, 1 year metrics, 90 days logs/traces | Object storage lifecycle |

### 14.4 Cost Attribution

All usage metrics include `tenant_id` label for chargeback/showback:
- `hermes.observability.metrics.ingested.series` - Active series count
- `hermes.observability.logs.ingested.bytes` - Log bytes ingested
- `hermes.observability.traces.ingested.spans` - Spans ingested
- `hermes.observability.audit.events.written` - Audit events written

---

## 15. Failure Handling

### 15.1 Collector Failure Modes

| Failure | Detection | Response |
|---------|-----------|----------|
| Receiver Port Bind Failure | Startup health check | CrashLoopBackOff; alert |
| Processor OOM | Memory limiter processor | Drop oldest batches; alert |
| Exporter Backend Unavailable | Exporter health check | Queue in memory (max 100MB); retry with exponential backoff (1s, 2s, 4s, 8s, max 30s); alert after 5 min |
| Certificate Expiry | mTLS handshake failure | Auto-rotate via SPIRE; alert 30 days before expiry |
| Config Validation Failure | Startup validation | Reject config; keep previous valid config; alert |

### 15.2 Backend Failure Modes

| Backend | Failure | Detection | Response |
|---------|---------|-----------|----------|
| Thanos Receive | Write rejection | HTTP 5xx, timeout | Queue in Collector (max 100MB); alert; circuit breaker |
| Loki | Push rejection | HTTP 5xx, timeout | Queue in Collector (max 100MB); alert; circuit breaker |
| Tempo | Push rejection | gRPC error, timeout | Queue in Collector (max 100MB); alert; circuit breaker |
| Audit Ingest | Write rejection | HTTP 5xx, timeout | Queue in Collector (max 10MB); alert; **block component operations** if queue full |

### 15.3 Data Loss Prevention

| Scenario | Protection |
|----------|------------|
| Collector crash | In-memory buffer flushed on SIGTERM (30s timeout) |
| Backend unavailable | Local disk spool (optional, max 1GB) |
| Network partition | Collector queues; backpressure to components via gRPC flow control |
| Backend data corruption | Thanos/Loki/Tempo replication (3x); object storage versioning |

---

## 16. Retry Policies

### 16.1 Collector to Backend

```yaml
exporters:
  prometheusremotewrite:
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 30s
      max_elapsed_time: 300s
  loki:
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 30s
      max_elapsed_time: 300s
  tempo:
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 30s
      max_elapsed_time: 300s
  auditevents:
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 60s
      max_elapsed_time: 600s
```

### 16.2 Component to Collector

Components **MUST** implement client-side retry with:
- Initial interval: 100ms
- Max interval: 10s
- Max elapsed time: 30s
- Exponential backoff with jitter (+/-10%)

### 16.3 Query API Retry

Clients **SHOULD** retry with:
- Idempotent queries: 3 retries, exponential backoff (1s, 2s, 4s)
- Non-idempotent: No retry (return error)

---

## 17. Timeouts

| Operation | Timeout | Rationale |
|-----------|---------|-----------|
| Component to Collector (gRPC) | 10s | Fast local network |
| Collector to Backend (Metrics) | 10s | Prometheus Remote Write |
| Collector to Backend (Logs) | 15s | Loki Push API |
| Collector to Backend (Traces) | 20s | Tempo OTLP |
| Collector to Audit | 30s | Critical path; Merkle proof |
| Query API (Metrics) | 30s | PromQL evaluation |
| Query API (Logs) | 60s | LogQL evaluation |
| Query API (Traces) | 60s | Trace retrieval |
| Query API (Audit) | 30s | Proof verification |
| Collector Shutdown Flush | 30s | SIGTERM grace period |
| Component Shutdown Flush | 30s | SIGTERM grace period |

---

## 18. Resource Management

### 18.1 Collector Resource Limits

| Resource | Agent Collector | Gateway Collector |
|----------|-----------------|-------------------|
| CPU Limit | 500m | 2000m |
| Memory Limit | 512 MiB | 4 GiB |
| Memory Request | 256 MiB | 1 GiB |
| Disk (Buffer) | 100 MiB (tmpfs) | 1 GiB (ephemeral) |
| File Descriptors | 1024 | 8192 |

### 18.2 Backend Resource Planning

| Backend | Sizing Formula |
|---------|----------------|
| Thanos Receive | 1 vCPU + 2 GiB per 50K series/s |
| Thanos Store | 1 vCPU + 4 GiB per 100M samples |
| Thanos Query | 1 vCPU + 1 GiB per 10 QPS |
| Loki Distributor | 1 vCPU + 1 GiB per 10 MB/s ingest |
| Loki Ingester | 1 vCPU + 4 GiB per 50 MB/s ingest |
| Loki Querier | 1 vCPU + 2 GiB per 5 QPS |
| Tempo Distributor | 1 vCPU + 1 GiB per 10 MB/s ingest |
| Tempo Ingester | 1 vCPU + 4 GiB per 50 MB/s ingest |
| Tempo Querier | 1 vCPU + 2 GiB per 5 QPS |
| Audit Ingest | 2 vCPU + 4 GiB per 10K events/s |

### 18.3 Adaptive Sampling

When collector memory exceeds 80% limit:
1. Increase head sampling rate reduction (10% to 5% to 1%)
2. Enable aggressive tail sampling (error-only + latency p99)
3. Drop DEBUG/TRACE log levels
4. Reduce metric cardinality (drop high-cardinality labels)
5. Alert on-call

---

## 19. Performance Requirements

### 19.1 SLIs / SLOs

| SLI | SLO | Measurement Window |
|-----|-----|-------------------|
| Metrics Ingestion Latency | p99 < 5s | 5m |
| Logs Ingestion Latency | p99 < 10s | 5m |
| Traces Ingestion Latency | p99 < 15s | 5m |
| Audit Ingestion Latency | p99 < 30s | 5m |
| Metrics Query Latency | p99 < 3s | 5m |
| Logs Query Latency | p99 < 10s | 5m |
| Traces Query Latency | p99 < 10s | 5m |
| Audit Query Latency | p99 < 5s | 5m |
| Collector Availability | 99.95% | 30d |
| Backend Availability | 99.9% | 30d |
| Data Durability | 99.999999999% (11 9s) | Annual |

### 19.2 Throughput Targets

| Pipeline | Target | Burst |
|----------|--------|-------|
| Metrics | 1M samples/s per tenant | 5M samples/s |
| Logs | 10 MB/s per tenant | 50 MB/s |
| Traces | 100K spans/s per tenant | 500K spans/s |
| Audit | 10K events/s per tenant | 50K events/s |

---

## 20. Scalability Considerations

### 20.1 Horizontal Scaling

| Component | Scaling Trigger | Max Replicas |
|-----------|-----------------|--------------|
| Agent Collector | Per node (DaemonSet) | 1 per node |
| Gateway Collector | CPU > 70%, Memory > 70%, Queue depth > 1000 | 50 |
| Thanos Receive | Ingest rate > 80% capacity | 20 |
| Loki Distributor | Ingest rate > 80% capacity | 20 |
| Loki Ingester | Ingest rate > 80% capacity | 20 |
| Tempo Distributor | Ingest rate > 80% capacity | 20 |
| Tempo Ingester | Ingest rate > 80% capacity | 20 |
| Audit Ingest | Event rate > 80% capacity | 10 |

### 20.2 Multi-Region

| Requirement | Implementation |
|-------------|----------------|
| Data Residency | Per-region backends; tenant pinned to region |
| Cross-Region Query | Thanos Query Federation; Tempo multi-tenant querier |
| Failover | Active-passive for collectors; active-active for backends |
| Replication | Thanos/Loki/Tempo cross-region replication (async, <5min RPO) |

### 20.3 Cardinality Management

| Strategy | Implementation |
|----------|----------------|
| Label Enforcement | Reject metrics with > 20 labels; drop labels not in allowlist |
| Cardinality Limits | 100K unique label value combinations per metric per tenant |
| Auto-Reduction | Drop highest-cardinality labels when limit approached |
| Relabeling | Standardize common labels (e.g., `k8s_pod` to `component_instance`) |

---

## 21. Versioning Strategy

### 21.1 API Versioning

| API | Versioning | Compatibility |
|-----|------------|---------------|
| ObservabilityConfig | Protobuf package version (`v1`, `v2`) | Backward compatible within major |
| MetricsQuery | PromQL (stable) | PromQL backward compatible |
| LogsQuery | LogQL (stable) | LogQL backward compatible |
| TracesQuery | Protobuf package version | Backward compatible within major |
| AuditQuery | Protobuf package version | Backward compatible within major |
| OTLP Export | OTLP 1.0.0 (stable) | OTLP backward compatible |

### 21.2 Collector Config Versioning

- Config stored in ConfigMap with `version` annotation
- Rolling updates with validation gate
- Canary deployment (5% to 25% to 100%)
- Rollback on error rate increase > 1%

### 21.3 Semantic Versioning for Dashboards/Alerts

- Dashboard JSON: `major.minor.patch` in metadata
- Alert rules: `group.version` in labels
- Grafana provisioning: GitOps with version tags

---

## 22. Migration Strategy

### 22.1 From No Observability

1. Deploy Agent Collectors (DaemonSet) with minimal config
2. Instrument core components (Agent Runtime, Event Bus, Gateway) with OTel SDK
3. Enable metrics pipeline first (lowest overhead)
4. Enable logs pipeline
5. Enable traces pipeline with 10% head sampling
6. Enable audit pipeline (mandatory)
7. Gradually increase trace sampling
8. Deploy Gateway Collectors
9. Configure tail sampling policies
10. Deploy standard dashboards and alerts

### 22.2 Major Version Upgrades

| Step | Action |
|------|--------|
| 1 | Deploy new Collector version to canary (5%) |
| 2 | Validate health, no data loss, no latency regression |
| 3 | Expand to 25% |
| 4 | Validate for 24h |
| 5 | Expand to 100% |
| 6 | Update component OTel SDK versions |
| 7 | Deprecate old config after 30 days |

---

## 23. Upgrade and Downgrade Procedures

### 23.1 Collector Upgrade

```
DRAIN POLICY (default):
  1. Stop accepting new connections (drain receivers)
  2. Flush buffers (30s timeout)
  3. Shutdown gracefully
  4. New version starts
  5. Verify health
  6. Traffic shifted

MIGRATE POLICY (for config schema changes):
  1. Dual-write to old and new config format
  2. Validate equivalence
  3. Switch read path
  4. Stop dual-write

COEXIST POLICY (for breaking API changes):
  1. Run old and new versions side-by-side
  2. Route traffic by component version
  3. Migrate components incrementally
  4. Decommission old when complete
```

### 23.2 Backend Upgrade

- Thanos/Loki/Tempo: Follow upstream upgrade procedures
- Use blue/green for stateful components
- Validate query compatibility before cutover
- Maintain 2-version query compatibility window

---

## 24. Compatibility Matrix

| Component | Collector v1.0 | Collector v1.1 | Collector v2.0 |
|-----------|----------------|----------------|----------------|
| Agent Runtime v1.1 | Yes | Yes | No |
| Event Bus v1.1 | Yes | Yes | No |
| Gateway v1.1 | Yes | Yes | No |
| Memory v1.1 | Yes | Yes | No |
| Knowledge v1.1 | Yes | Yes | No |
| Security v1.1 | Yes | Yes | No |
| Runtime v1.1 | Yes | Yes | No |
| Extensibility v1.1 | Yes | Yes | No |

**Rule:** Collector minor versions backward compatible for 2 major RFC versions. Collector major versions require coordinated component SDK upgrade.

---

## 25. Observability

### 25.1 Observability of Observability

The Observability Plane **MUST** be observable via itself:

| Metric | Purpose |
|--------|---------|
| `hermes.observability.collector.uptime` | Collector health |
| `hermes.observability.collector.buffer.size` | Backpressure detection |
| `hermes.observability.collector.export.latency` | Backend latency |
| `hermes.observability.collector.export.errors` | Backend errors |
| `hermes.observability.backend.latency` | Query latency |
| `hermes.observability.backend.errors` | Query errors |
| `hermes.observability.data.freshness` | Ingestion lag |
| `hermes.observability.data.completeness` | Dropped samples/spans |

### 25.2 Self-Monitoring Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| `CollectorDown` | No heartbeat for 2m | CRITICAL |
| `CollectorBufferHigh` | Buffer > 80% for 5m | WARNING |
| `BackendWriteFailing` | Export error rate > 1% for 5m | CRITICAL |
| `IngestionLatencyHigh` | p99 latency > SLO for 5m | WARNING |
| `DataFreshnessStale` | No new data for 2x scrape interval | WARNING |
| `CardinalityLimitApproaching` | Unique label values > 80% limit | WARNING |
| `AuditQueueBacklog` | Audit events queued > 1000 | CRITICAL |

---

## 26. Metrics

### 26.1 Standard Metrics (OpenTelemetry Semantic Conventions)

All components **MUST** export these standard metrics:

| Metric | Type | Description |
|--------|------|-------------|
| `process.runtime.go.goroutines` | Gauge | Active goroutines |
| `process.runtime.go.gc.count` | Counter | GC cycles |
| `process.cpu.time` | Counter | CPU time |
| `process.memory.usage` | Gauge | Memory usage |
| `process.network.io` | Counter | Network I/O |
| `runtime.gc.duration` | Histogram | GC pause duration |

### 26.2 Hermes-Specific Metrics (Recap)

See Section 9.1 for complete list. Key categories:
- **Agent Runtime:** spawn, task, workflow metrics
- **Tool Execution:** latency, status, resource usage
- **Provider:** request latency, tokens, errors
- **Memory:** tier-specific operation latency
- **Knowledge:** ingest, search, retrieval latency
- **Event Bus:** publish, consume, DLQ depth
- **Gateway:** connections, rate limits, protocol adapters
- **Security:** authZ decisions, capability grants/revokes

### 26.3 Metric Cardinality Limits

| Metric | Max Cardinality (per tenant) |
|--------|------------------------------|
| `hermes.agent.runtime.*` | 10,000 |
| `hermes.task.*` | 50,000 |
| `hermes.tool.execution.*` | 20,000 |
| `hermes.provider.request.*` | 10,000 |
| `hermes.memory.*` | 5,000 |
| `hermes.knowledge.*` | 5,000 |
| `hermes.eventbus.*` | 5,000 |
| `hermes.gateway.*` | 10,000 |
| `hermes.security.*` | 5,000 |

---

## 27. Logging

### 27.1 Log Levels

| Level | Use Case | Sampling |
|-------|----------|----------|
| **DEBUG** | Detailed diagnostic info | 1% (dev), 0% (prod) |
| **INFO** | Normal operation events | 100% |
| **WARN** | Recoverable anomalies | 100% |
| **ERROR** | Failed operations | 100% |
| **FATAL** | Process termination | 100% |

### 27.2 Structured Logging Requirements

All components **MUST**:
1. Use structured JSON logging
2. Include required fields (timestamp, level, logger, message, tenant_id, component_type, component_instance)
3. Include trace correlation (trace_id, span_id) when available
4. Sanitize sensitive data per redaction rules
5. Use consistent field names across components

### 27.3 Log Retention

| Tier | Retention | Storage |
|------|-----------|---------|
| **Hot** | 7 days | SSD (Loki Ingester) |
| **Warm** | 90 days | Object Storage (Loki) |
| **Cold** | 1 year | Object Storage (Loki, compressed) |
| **Audit** | 7 years | PostgreSQL + S3 (immutable) |

---

## 28. Distributed Tracing

### 28.1 Trace Context Propagation

All components **MUST** propagate W3C TraceContext headers:
- `traceparent`: `00-{trace-id}-{parent-span-id}-{flags}`
- `tracestate`: Vendor-specific state (e.g., `hermes=tenant:abc123,sampling:1`)

### 28.2 Sampling Strategy

| Strategy | Rate | Use Case |
|----------|------|----------|
| **Head (Probabilistic)** | 10% default | Baseline coverage |
| **Head (Rate Limiting)** | 1000 traces/s per instance | Prevent overload |
| **Tail (Error)** | 100% | All error traces |
| **Tail (Latency p99)** | 100% | Slow request analysis |
| **Tail (Custom)** | Configurable | Business-critical flows |

### 28.3 Span Attributes

See Section 9.4 for complete span attribute requirements.

### 28.4 Trace Retention

| Tier | Retention | Storage |
|------|-----------|---------|
| **Hot** | 7 days | SSD (Tempo Ingester) |
| **Warm** | 90 days | Object Storage (Tempo) |
| **Cold** | 1 year | Object Storage (Tempo, compressed) |

---

## 29. Audit Requirements

### 29.1 Mandatory Audit Events

All components **MUST** emit audit events for:

| Category | Events |
|----------|--------|
| **Authentication** | Login, Logout, MFA Challenge, Token Refresh |
| **Authorization** | Allow, Deny, Policy Evaluation |
| **Capabilities** | Grant, Revoke, Delegate, Delegate Chain |
| **Data Access** | Memory Read/Write/Delete, Knowledge Ingest/Search/Delete |
| **Tool Execution** | Execute, Stream, Validate |
| **Provider Calls** | Chat, Embed, Stream, Transcribe, Synthesize |
| **Configuration** | Create, Update, Delete, Rollback |
| **Tenant Lifecycle** | Create, Suspend, Delete, Restore |

### 29.2 Audit Log Integrity

| Property | Implementation |
|----------|----------------|
| **Immutability** | Append-only Merkle tree; no UPDATE/DELETE |
| **Tamper Evidence** | Merkle proofs; hourly signed roots |
| **Verification** | Inclusion/consistency proofs via API |
| **Retention** | 7 years minimum; legal hold support |
| **Access Control** | `observability.audit.read` capability; tenant isolation |

### 29.3 Compliance Mapping

| Regulation | Audit Requirement | Implementation |
|------------|-------------------|----------------|
| **GDPR Art. 30** | Processing records | Audit events for all data access |
| **GDPR Art. 17** | Right to erasure | Audit trail of deletion events |
| **SOC2 CC6.1** | Logical access | AuthZ audit events |
| **SOC2 CC7.2** | System monitoring | All component audit events |
| **HIPAA Section 164.312(b)** | Audit controls | Immutable audit log |
| **ISO 27001 A.12.4** | Event logging | Comprehensive audit events |

---

## 30. Compliance Considerations

### 30.1 Data Residency

- Tenant data **MUST** remain in configured region
- Cross-region replication **MUST** be opt-in
- Audit logs **MUST** be stored in same region as tenant

### 30.2 Right to Erasure (GDPR)

| Data Type | Erasure Mechanism |
|-----------|-------------------|
| **Metrics** | Label-based deletion via Thanos Admin API |
| **Logs** | Loki label-based deletion; compactor purge |
| **Traces** | Tempo trace ID deletion; block rewrite |
| **Audit** | **NOT erasable** - legal hold; encryption key destruction for crypto-shredding |


### 30.3 Encryption Key Management

- Per-tenant Data Encryption Keys (DEK) in KMS
- Key rotation: 90 days (automated)
- Key hierarchy: Root KEK (HSM) → Tenant KEK → DEK
- Audit trail for all key operations

### 30.4 Access Logging

All administrative actions on observability infrastructure **MUST** be audited:
- Config changes
- Sampling policy changes
- Redaction rule changes
- Retention policy changes
- Backup/restore operations
- Key rotations

---

## 31. Testing Strategy

### 31.1 Unit Tests

| Target | Coverage Requirement |
|--------|---------------------|
| OTel SDK Instrumentation | 90% |
| Collector Processors | 85% |
| Redaction Rules | 100% |
| Sampling Policies | 90% |
| Audit Event Construction | 95% |
| Query APIs | 85% |

### 31.2 Integration Tests

| Scenario | Validation |
|----------|------------|
| Component → Collector → Backend | End-to-end telemetry flow |
| Trace Context Propagation | W3C headers across 5+ hops |
| Multi-Tenant Isolation | No cross-tenant data leakage |
| Redaction | PII not present in backend |
| Sampling | Correct rates at head/tail |
| Audit Integrity | Merkle proof verification |
| Failover | Collector/Backend failure handling |
| Backpressure | Buffer limits, dropped telemetry alerting |

### 31.3 Chaos Engineering

| Experiment | Frequency | Success Criteria |
|------------|-----------|------------------|
| Collector Kill | Weekly | No data loss; <30s recovery |
| Backend Partition | Monthly | Queue buffers; alert fires |
| Certificate Expiry | Quarterly | Auto-rotation; no downtime |
| Config Corruption | Monthly | Rejection; previous config active |
| Cardinality Explosion | Quarterly | Cardinality limit enforced |

### 31.4 Conformance Testing

All components **MUST** pass the OpenTelemetry Conformance Test Suite for:
- Metrics SDK
- Logs SDK
- Traces SDK
- Collector (receivers, processors, exporters)

---

## 32. Conformance Requirements

### 32.1 Component Conformance

A Hermes component is **conformant** iff it:

1. **Instrumentation:** Exports metrics, logs, traces via OTel SDK to local Agent Collector
2. **Resource Attributes:** Includes all required labels (Section 9.2)
3. **Span Attributes:** Includes all required span attributes (Section 9.4)
4. **Log Structure:** Emits structured JSON with required fields (Section 9.3)
5. **Audit Events:** Emits audit events for all mandatory categories (Section 29.1)
6. **Trace Context:** Propagates W3C TraceContext headers correctly
7. **Redaction:** Respects Gateway Collector redaction rules
8. **Sampling:** Respects head/tail sampling decisions
9. **Health Endpoint:** Exposes `/healthz` and `/readyz` with observability status

### 32.2 Collector Conformance

An OpenTelemetry Collector deployment is **conformant** iff it:

1. **Receives:** OTLP gRPC/HTTP, Prometheus, Jaeger, Zipkin
2. **Processes:** Batch, Memory Limiter, K8s Attributes, Resource, Tail Sampling (Gateway)
3. **Exports:** Prometheus Remote Write, Loki, Tempo, Audit
4. **Security:** mTLS for all connections; SPIFFE identity
5. **Multi-Tenant:** Enforces tenant isolation at ingestion and query
6. **Redaction:** Applies PII redaction rules at Gateway
7. **Audit Forwarding:** Forwards audit events to Audit Ingest
8. **Health:** Exposes `/healthz` (liveness) and `/readyz` (readiness)
9. **Config:** Supports hot reload with validation gate

### 32.3 Backend Conformance

Backend services **MUST** meet:

| Backend | Requirements |
|---------|--------------|
| **Thanos** | PromQL compatibility; multi-tenancy; deduplication; downsampling |
| **Loki** | LogQL compatibility; multi-tenancy; structured metadata; compression |
| **Tempo** | TraceQL compatibility; multi-tenancy; bloom filters; native TSDB |
| **Audit Ingest** | Merkle tree; hourly signed roots; inclusion/consistency proofs; 7-year retention |

---

## 33. Acceptance Criteria

### 33.1 Telemetry Ingestion

| AC-ID | Criterion |
|-------|-----------|
| **AC-001** | Component emits metrics to Agent Collector within 5s of startup |
| **AC-002** | Metrics appear in Thanos Query within 10s of emission |
| **AC-003** | Logs appear in Loki within 15s of emission |
| **AC-004** | Traces appear in Tempo within 20s of emission |
| **AC-005** | Audit events appear in Audit Ingest within 30s of emission |
| **AC-006** | All required labels present on all metrics (Section 9.2) |
| **AC-007** | All required span attributes present (Section 9.4) |
| **AC-008** | Logs contain required fields (Section 9.3) |
| **AC-009** | Trace context propagated across 5+ component hops |
| **AC-010** | Head sampling rate matches configured probability ±1% |

### 33.2 Query & Visualization

| AC-ID | Criterion |
|-------|-----------|
| **AC-011** | Metrics query (instant) p99 < 3s |
| **AC-012** | Metrics query (range, 1h) p99 < 5s |
| **AC-013** | Logs query (1h, 10k lines) p99 < 10s |
| **AC-014** | Trace get-by-ID p99 < 5s |
| **AC-015** | Trace search p99 < 10s |
| **AC-016** | Audit query p99 < 5s |
| **AC-017** | Grafana dashboards load < 3s |
| **AC-018** | Service graph renders < 5s |

### 33.3 Multi-Tenant Isolation

| AC-ID | Criterion |
|-------|-----------|
| **AC-019** | Tenant A cannot query Tenant B metrics |
| **AC-020** | Tenant A cannot query Tenant B logs |
| **AC-021** | Tenant A cannot query Tenant B traces |
| **AC-022** | Tenant A cannot query Tenant B audit |
| **AC-023** | Cross-tenant query rejected with 403 |

### 33.4 Security & Compliance

| AC-ID | Criterion |
|-------|-----------|
| **AC-024** | All telemetry encrypted in transit (mTLS) |
| **AC-025** | All telemetry encrypted at rest (AES-256) |
| **AC-026** | PII redacted before leaving Gateway Collector |
| **AC-027** | Audit events have valid Merkle proof |
| **AC-028** | Audit Merkle roots signed hourly |
| **AC-029** | GDPR erasure works for metrics/logs/traces |
| **AC-030** | Audit events immutable for 7 years |

### 33.5 Failure Handling

| AC-ID | Criterion |
|-------|-----------|
| **AC-031** | Collector buffers during backend outage (max 100MB) |
| **AC-032** | No data loss on Collector restart (30s flush) |
| **AC-033** | Circuit breaker opens after 5 consecutive failures |
| **AC-034** | Alert fires within 1m of backend unavailability |
| **AC-035** | Audit queue blocks component operations when full |

### 33.6 Resource Management

| AC-ID | Criterion |
|-------|-----------|
| **AC-036** | Collector memory < limit under sustained load |
| **AC-037** | Adaptive sampling activates at 80% memory |
| **AC-038** | Cardinality limit enforced per metric per tenant |
| **AC-039** | Resource quotas enforced per tenant |

### 33.7 Upgrade & Migration

| AC-ID | Criterion |
|-------|-----------|
| **AC-040** | Collector upgrade zero-downtime (drain policy) |
| **AC-041** | Config rollback < 1m on error rate increase |
| **AC-042** | Major version upgrade maintains 2-version compatibility |

---

## 34. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Cardinality Explosion** | High | High | Enforced limits, auto-reduction, alerting |
| **Backend Cost Overrun** | Medium | High | Quotas, tiered storage, compression, sampling |
| **PII Leakage** | Low | Critical | Gateway redaction, classification, audit |
| **Audit Log Tampering** | Low | Critical | Merkle transparency, signed roots, verification |
| **Collector Resource Exhaustion** | Medium | High | Memory limiters, adaptive sampling, buffer limits |
| **Cross-Tenant Data Leak** | Low | Critical | Tenant isolation at every layer, query enforcement |
| **Trace Context Loss** | Medium | High | W3C propagation mandatory, auto-instrumentation |
| **Clock Skew** | Low | Medium | NTP on all nodes, OTel timestamps in UTC |
| **Schema Drift** | Medium | Medium | Protobuf versioning, conformance testing |
| **Sampling Bias** | Medium | Medium | Tail sampling for errors/latency, configurable policies |

---

## 35. Future Extensions

| Extension | Description | Target RFC |
|-----------|-------------|------------|
| **RFC-0011: Automation** | ML-based anomaly detection, automated remediation, predictive scaling | 0011 |
| **RFC-0012: Continuous Profiling** | eBPF-based continuous profiling integrated with traces | 0012 |
| **RFC-0013: Real User Monitoring** | Browser/mobile RUM with frontend trace correlation | 0013 |
| **RFC-0014: Synthetic Monitoring** | Proactive synthetic checks with trace generation | 0014 |
| **RFC-0015: Cost Optimization** | ML-based cost attribution, rightsizing recommendations | 0015 |
| **RFC-0016: Compliance Dashboard** | Pre-built SOC2/GDPR/HIPAA compliance dashboards | 0016 |
| **OpenTelemetry Metrics v2** | Native delta temporality, exemplars, streaming | Tracking |
| **OpenTelemetry Logs v2** | Structured log records, severity standards | Tracking |
| **W3C Trace Context v2** | Extended baggage, vendor fields | Tracking |

---

## End of RFC-0010