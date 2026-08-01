# RFC-0003 v1.1 — Review Items Addressed

**Source Review:** RFC-0003-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**Status:** All Critical and High items addressed in v1.1

---

## Executive Summary

All **5 Critical (C-01 to C-05)** and **6 High-priority (H-01 to H-06)** review items have been incorporated into RFC-0003 v1.1. No review items were deferred without justification.

---

## Critical Items (C-01 to C-05) — ALL ADDRESSED

### C-01: Schema Compatibility Matrix
**Review Location:** §6  
**Resolution:** 
- Added comprehensive compatibility matrix (§6.5) defining allowed changes per field type (primitive, message, repeated, map, enum, oneof)
- Enforcement via `buf breaking` + custom linter on every PR
- Producers must register contract tests for each consumer
- Breaking change = new major version topic + 2-version deprecation window
- Deprecation policy: 2 major versions before removal

### C-02: Per-Tenant Quotas
**Review Location:** §4.1, §18  
**Resolution:**
- Defined NATS Account per tenant with quotas: `max_memory`, `max_storage`, `max_streams`, `max_consumers`, `max_ack_pending`, `max_bytes_required` (§3.4)
- Runtime enforcement via NATS permissions — only owner service account has `publish` on namespace
- Per-tenant stream config overrides for retention
- Cross-tenant event leakage prevented by tenant-prefixed correlation IDs

### C-03: Large Payload Specification
**Review Location:** §3.3, §17.1  
**Resolution:**
- Protocol: chunk >1MB into 1MB pieces → upload to S3/MinIO → publish `hermes.large_payload.{event_id}.chunk.{n}` → final chunk includes `payload_ref` in EventEnvelope metadata (§7.2)
- Consumer reassembles from object store before processing
- Lifecycle: 7-day TTL, then auto-delete
- Stream subject `hermes.large_payload.>` added for chunk events
- `payload_ref` field in EventEnvelope metadata for reference

### C-04: Log Compaction
**Review Location:** §17.1  
**Resolution:**
- Added compacted subjects to stream config: `hermes.agent.*.state` (key=`agent_id`), `hermes.workflow.status` (key=`workflow_id`), `hermes.agent.pool.status` (key=`pool_id`) (§3.3, §7.4)
- Retention aligned with domain TTLs (7 days for agent state, 30 days for workflow status)
- Enables latest-by-key reads for state reconstruction

### C-05: State Manager Partitioned Writers
**Review Location:** §17.3  
**Resolution:**
- Replaced single `state-manager` consumer with 4 partitioned writers:
  - `state-manager-conversation` → consumes `v1.hermes.conversation.*`
  - `state-manager-workflow` → consumes `v1.hermes.workflow.*, v1.hermes.task.*, v1.hermes.approval.*`
  - `state-manager-agent` → consumes `v1.hermes.agent.*`
  - `state-manager-audit` → consumes `v1.hermes.audit.*`
- Each has dedicated PostgreSQL connection pool (20 connections)
- Exactly-once via `event_id` unique constraint
- Read models (projections) built from PostgreSQL
- Updated dependency diagram (§22.1) showing 4 PG pools

---

## High-Priority Items (H-01 to H-06) — ALL ADDRESSED

### H-01: Consumer Group Rebalance Protocol
**Review Location:** §10.2  
**Resolution:**
- Defined 4-phase protocol: PAUSE → DRAIN → REASSIGN → RESUME (§10.4)
- Implementation via NATS Consumer API: `ConsumerPause()`, wait for `AckPending=0` (max 30s), `ConsumerUpdate()` with new `filter_subject`, `ConsumerResume()`
- Safety: max drain time 30s; if exceeded, force-reassign with replay from last acknowledged sequence
- Mermaid sequence diagram showing 64→128 shard scale event (§22.5)

### H-02: Capacity Planning Calculator
**Review Location:** §21  
**Resolution:**
- Published formulas for NATS storage, node count, PostgreSQL storage (§17.4)
- Python examples with `calculate_nats_storage()`, `calculate_nats_nodes()`, `calculate_postgres_storage()`
- Example calculation: 100K eps, 2 KB avg, 7-day hot, 7-year cold = 3.7 TB NVMe + 44 TB HDD/S3
- Formula variables: peak_eps, avg_bytes, retention, replication factor

### H-03: Schema Migration Runbooks
**Review Location:** §6  
**Resolution:**
- Documented v1→v2 examples for key events:
  - `PlanCreated`: add `compensation_dag_v2` field
  - `TaskAssigned`: add `pool_id` field
  - `WorkflowHitlRequired`: add `delegation_chain` repeated field
- Migration pattern: new major topic version (`v2.hermes.plan.created`), parallel run, consumer migration, v1 deprecation after 2 versions
- Acceptance criteria require runbooks (§23.10)

### H-04: Cross-Module Contract Tests
**Review Location:** §23.3  
**Resolution:**
- Defined Pact/Schemathesis test requirements per consumer group:
  - `planning-engine` verifies `v1.hermes.intent.resolved`
  - `workflow-engine` verifies `v1.hermes.plan.created`
  - `task-orchestrator-shard-*` verifies `v1.hermes.workflow.started`
  - `state-manager-*` verifies domain-specific topics
  - `agent-runtime` verifies `v1.hermes.task.assigned`
- CI gate: `pact-verifier` on every PR, `buf breaking` + custom matrix linter
- Consumer-driven: consumers register expected schemas; producers must satisfy

### H-05: Per-Domain Event TTL
**Review Location:** §17.1  
**Resolution:**
- 14 domain-specific retention periods:

| Domain | Retention | Rationale |
|--------|-----------|-----------|
| `hermes.audit.*` | 7 years | Compliance |
| `hermes.approval.*` | 1 year | Audit trail |
| `hermes.workflow.*` | 30 days | Debugging |
| `hermes.conversation.*` | 90 days | Context reconstruction |
| `hermes.task.*` | 7 days | Debugging |
| `hermes.agent.*` | 7 days | Health history |
| `hermes.tool.*` | 7 days | Debugging |
| `hermes.provider.*` | 30 days | Cost tracking |
| `hermes.memory.*` | 90 days | Consolidation |
| `hermes.knowledge.*` | 90 days | Freshness |
| `hermes.system.*` | 1 day | Operations |
| `hermes.config.*` | 7 days | Rollback |
| `hermes.large_payload.*` | 7 days | Reassembly |
| `hermes.dlq.*` | 30 days | Investigation |

- Configurable per tenant via stream config overrides

### H-06: Backpressure Propagation
**Review Location:** §9.2, §18  
**Resolution:**
- When `MaxAckPending` exceeded, consumer publishes `hermes.system.backpressure.{consumer_group}` (§8.4)
- Upstream publishers throttle on receiving backpressure signal (§9.1)
- Topic `hermes.system.backpressure.>` added to stream subjects (§3.3)
- Per-region (local only) — not replicated across supercluster (§18.2)
- Documented in multi-region diagram (§22.4)

---

## Summary

| Category | Total | Addressed | Deferred | % Complete |
|----------|-------|-----------|----------|------------|
| **Critical** | 5 | 5 | 0 | 100% |
| **High** | 6 | 6 | 0 | 100% |
| **TOTAL** | **11** | **11** | **0** | **100%** |

---

**All review items from the Principal Enterprise Architect Review have been incorporated into RFC-0003 v1.1. The document is the canonical Event Bus & Messaging specification for Hermes Agent OS.**