# RFC-0003: Hermes Event Bus & Messaging Architecture — Principal Enterprise Architect Review

**Reviewer:** Principal Enterprise Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Status:** Draft  
**Depends On:** RFC-0001, RFC-0002

---

## 1. Executive Summary

RFC-0003 is a **comprehensive, well-structured specification** for the Hermes Event Bus that demonstrates strong architectural thinking. It correctly identifies NATS JetStream as the right technology choice for Phase 1–3, establishes clear domain ownership, defines complete event schemas, and addresses all critical messaging concerns (ordering, exactly-once, idempotency, replay, DLQ, multi-region).

**Overall Assessment: APPROVED WITH CHANGES**

The architecture is fundamentally sound but has **4 Critical** and **6 High-priority** gaps that must be resolved before implementation begins. These are primarily around schema governance, tenant isolation, operational procedures, and cross-cutting concerns that affect the entire platform.

---

## 2. Strengths

| Area | Strength |
|------|----------|
| **Technology Choice** | NATS JetStream correctly selected for embedded-friendly, streaming-native, exactly-once, multi-region requirements |
| **Domain Ownership** | Explicit ownership table (§4.1) with 15 namespaces; enforced via NATS permissions + CI gates |
| **Event Schemas** | Complete Protobuf v1 schemas for envelope + 5 domain payloads; versioning strategy clear |
| **Ordering Guarantees** | Per-correlation_id via NATS ordered consumers; caveats honestly documented |
| **Exactly-Once** | Dual-layer: NATS deduplication (120s) + consumer idempotency keys (Redis) |
| **DLQ Design** | Structured `DeadLetterEvent` envelope, per-topic DLQs, alerting, reprocessing flow |
| **Retry Policy** | Standard exponential backoff + per-consumer overrides with rationale |
| **Replay Safety** | Idempotent consumers, ordered replay, rate limiting, metrics |
| **Correlation/Causation** | UUID v7, W3C traceparent mapping, clear propagation rules |
| **Multi-Region** | NATS supercluster topology, global/local topic split, data residency routing |
| **Observability** | 8 Prometheus metrics, OTel spans, structured JSON logs, 5 alert rules |
| **Security** | mTLS (SPIFFE), publish/subscribe authorization, PII encryption, audit trail |
| **Performance Targets** | Concrete P99 targets (publish <5ms, e2e <50ms, 100K eps) |
| **Diagrams** | 4 Mermaid diagrams (topology, sequence, DLQ flow, multi-region) |

---

## 3. Weaknesses

| Area | Weakness |
|------|----------|
| **Schema Governance** | No breaking-change policy beyond "consumer approval"; no schema compatibility matrix, no deprecation timeline |
| **Tenant Isolation** | No per-tenant stream quotas, no noisy-neighbor protection, no cross-tenant event leakage prevention |
| **Consumer Group Scaling** | Sharding strategy for Task Orchestrator defined but no auto-rebalance on shard count change |
| **Large Payload Handling** | 1 MB limit with "larger via object store" mentioned but no specification (chunking, references, cleanup) |
| **Event Compaction** | No log compaction strategy for key-based deduplication (e.g., latest agent state) |
| **Consumer Lag Alerting** | Single threshold (>10K) — no per-topic, per-consumer-group, or per-tenant baselines |
| **Disaster Recovery Testing** | DR runbook exists but no RTO/RPO validation procedure, no chaos engineering integration |
| **Capacity Planning** | No formula for sizing NATS nodes, JetStream storage, PostgreSQL partitions per tenant scale |
| **Schema Evolution Examples** | No concrete examples of v1→v2 migration for any domain event |
| **Cross-RFC Contract Testing** | No defined contract tests between Event Bus and RFC-0002 modules (Planning, Workflow, etc.) |

---

## 4. Missing Components

| # | Component | Required By | Impact |
|---|-----------|-------------|--------|
| 1 | **Schema Compatibility Matrix** | §6 | Producers/consumers cannot safely evolve independently |
| 2 | **Per-Tenant Quotas & Isolation** | §18, §19 | Noisy neighbor can starve other tenants; compliance risk |
| 3 | **Large Payload Specification** | §3.3 | 1 MB limit undefined for >1MB payloads (artifacts, large contexts) |
| 4 | **Log Compaction Policy** | §17.1 | State reconstruction (agent health, workflow status) requires latest-by-key |
| 5 | **Consumer Group Rebalance Protocol** | §10.2 | Shard count changes require manual intervention |
| 6 | **Capacity Planning Calculator** | §21 | Cannot size infrastructure for target scale |
| 7 | **Schema Migration Runbooks** | §6 | v1→v2 migrations will be ad-hoc and risky |
| 8 | **Cross-Module Contract Tests** | §23.3 | Consumer-driven contracts unverified in CI |
| 9 | **Event TTL per Domain** | §17.1 | 7-day default inappropriate for audit (years) vs. ephemeral (hours) |
| 10 | **Failure Injection Testing** | §18.4 | DR runbook untested; no chaos engineering hooks |
| 11 | **Event Catalog/Discovery** | §5 | No developer-facing registry of all event types, owners, schemas |
| 12 | **Backpressure Propagation** | §9.2 | No mechanism to signal upstream when consumer saturated |

---

## 5. Architectural Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| **EVT-001** | **Schema Breaking Change in Production** | High | Critical | No enforced compatibility matrix; rely on manual consumer approval |
| **EVT-002** | **Tenant Noisy Neighbor** | Medium | High | No per-tenant stream limits, consumer quotas, or priority queuing |
| **EVT-003** | **Event Loss During Rebalance** | Medium | High | Sharded Task Orchestrator has no rebalance protocol |
| **EVT-004** | **Large Payload OOM / Latency** | Medium | High | 1 MB limit with unspecified object-store fallback |
| **EVT-005** | **State Manager Write Bottleneck** | Medium | High | Single consumer group `state-manager` writes all events to PostgreSQL |
| **EVT-006** | **DLQ Poison Pill Cascade** | Low | Critical | No circuit breaker on DLQ consumer; bad event blocks queue |
| **EVT-007** | **Cross-Region Split-Brain** | Low | Critical | Supercluster quorum requires majority; 3-region = 2 for quorum |
| **EVT-008** | **PII Leakage via Events** | Medium | Critical | Auto-detection (Presidio) not guaranteed; no field-level encryption mandate |
| **EVT-009** | **Replay Storm on New Consumer** | Medium | High | `deliver_policy: all` on high-volume topics can overwhelm |
| **EVT-010** | **Correlation ID Collision** | Very Low | High | UUID v7 time-ordered but no namespace per tenant |

---

## 6. Recommendations

### 6.1 Structural Changes (Do Before Approval)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 1 | **Add Schema Compatibility Matrix** — Define allowed changes per field type; enforce via `buf breaking` + custom rules | Critical | Low |
| 2 | **Define Per-Tenant Stream Quotas** — Max events/sec, storage, consumer groups; enforce via NATS account limits | Critical | Medium |
| 3 | **Specify Large Payload Handling** — Chunking protocol, object store (S3/MinIO) references, TTL, cleanup | Critical | Medium |
| 4 | **Add Log Compaction** — `hermes.agent.*.state` compacted by `agent_id`; `hermes.workflow.status` by `workflow_id` | Critical | Low |
| 5 | **Redesign State Manager Persistence** — Partition consumers by domain (not single `hermes.>`); parallel PostgreSQL writers | Critical | High |

### 6.2 Design Improvements (Pre-Implementation)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 6 | **Consumer Group Rebalance Protocol** — NATS `Consumer` API for pausing/draining shards on count change | High | Medium |
| 7 | **Capacity Planning Calculator** — Spreadsheet/formula: events/sec × avg size × retention × replication = storage | High | Low |
| 8 | **Schema Migration Runbooks** — v1→v2 examples for `PlanCreated`, `TaskAssigned`, `WorkflowHitlRequired` | High | Medium |
| 9 | **Cross-Module Contract Tests** — Pact/Schemathesis suites for each consumer group in RFC-0002 | High | Medium |
| 10 | **Per-Domain Event TTL** — Audit: 7 years, Conversation: 90 days, Task: 7 days, System: 1 day | High | Low |
| 11 | **Backpressure Propagation** — `NATS` consumer `MaxAckPending` + custom header `hermes.backpressure=true` to upstream | High | Medium |
| 12 | **Event Catalog Service** — Internal API: `GET /events/{type}` returns schema, owner, examples, consumers | Medium | Medium |

### 6.3 Operational Hardening (Post-Approval, Pre-Production)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 13 | **Chaos Engineering Suite** — Failure injection: NATS node loss, network partition, disk full, schema violation | Medium | High |
| 14 | **DR Validation Procedure** — Quarterly failover test with RTO/RPO measurement | Medium | Medium |
| 15 | **PII Field-Level Encryption** — Mandate Vault transit for `user_id`, `email`, `pii.*` fields | Medium | Medium |
| 16 | **Correlation ID Namespace** — Prefix with tenant: `tenant-123:conv-uuid` | Low | Low |

---

## 7. Required Changes Before Approval

### Critical (Must Fix — Blockers)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **C-01** | **Schema Compatibility Matrix** | §6 | Add table: field type → allowed changes (add optional, remove optional, type widen/narrow). Enforce via `buf breaking` + custom linter. |
| **C-02** | **Per-Tenant Quotas** | §4.1, §18 | Define: `max_events_per_sec`, `max_storage_gb`, `max_consumer_groups`. Enforce via NATS accounts + JetStream limits. |
| **C-03** | **Large Payload Specification** | §3.3, §17.1 | Protocol: chunk >1MB into `hermes.large_payload.{chunk_id}`; reference via `payload_ref` in envelope; S3 lifecycle 7 days. |
| **C-04** | **Log Compaction** | §17.1 | Add compacted subjects: `hermes.agent.*.state` (key=`agent_id`), `hermes.workflow.status` (key=`workflow_id`). |
| **C-05** | **State Manager Partitioned Writers** | §17.3 | Replace single `state-manager` consumer with 4: `state-manager-conversation`, `state-manager-workflow`, `state-manager-agent`, `state-manager-audit` — each with own PostgreSQL writer pool. |

### High (Must Fix — Major Gaps)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **H-01** | **Consumer Group Rebalance Protocol** | §10.2 | Define: pause shard → drain → reassign → resume. Implement via NATS `ConsumerInfo` API. |
| **H-02** | **Capacity Planning Calculator** | §21 | Publish spreadsheet: `nodes = ceil(peak_eps / 50000)`, `storage_gb = peak_eps × avg_bytes × retention_days × 3 / 1e9` |
| **H-03** | **Schema Migration Runbooks** | §6 | Document v1→v2 for `PlanCreated` (add `compensation_dag_v2`), `TaskAssigned` (add `pool_id`), `WorkflowHitlRequired` (add `delegation_chain`). |
| **H-04** | **Cross-Module Contract Tests** | §23.3 | Add Pact tests: `planning-engine` verifies `intent.resolved`; `workflow-engine` verifies `plan.created`; etc. |
| **H-05** | **Per-Domain Event TTL** | §17.1 | Table: `audit.*`=7yr, `conversation.*`=90d, `task.*`=7d, `workflow.*`=30d, `system.*`=1d, `approval.*`=1yr. |
| **H-06** | **Backpressure Propagation** | §9.2 | When `MaxAckPending` exceeded, publish `hermes.system.backpressure.{consumer_group}`; upstream publishers throttle. |

---

## 8. Approval Decision

### **APPROVED WITH CHANGES**

**Conditions for Full Approval:**

1. **All 5 Critical changes (C-01 to C-05) implemented** in RFC-0003 v1.1
2. **All 6 High-priority changes (H-01 to H-06) documented** as follow-up ADRs or RFC amendments
3. **Schema Compatibility Matrix** published and CI-enforced before any v2 event schema
4. **Per-Tenant Quotas** configured in NATS before multi-tenant pilot
5. **State Manager partitioned writers** designed and reviewed by Data Architect

---

**Once conditions are met:**

> **RFC-0003 is approved as the canonical messaging specification for Hermes Agent OS and implementation may begin.**

---

*Principal Enterprise Architect*  
*2026-07-24*