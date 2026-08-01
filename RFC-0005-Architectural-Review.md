# RFC-0005: Hermes Memory Architecture — Principal Enterprise Architect Review

**Reviewer:** Principal Enterprise Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Status:** Draft  
**Depends On:** RFC-0001, RFC-0002 v1.1, RFC-0003 v1.1, RFC-0004 v1.1

---

## 1. Executive Summary

RFC-0005 is a **comprehensive, well-structured specification** for the Hermes Memory Architecture that demonstrates strong architectural thinking across memory hierarchy design, consolidation pipelines, retrieval optimization, and cross-cutting concerns (security, multi-tenancy, observability). It correctly implements the "single memory system" principle from RFC-0001 and aligns well with RFC-0002/0003/0004.

**Overall Assessment: APPROVED WITH CHANGES**

The architecture is fundamentally sound but has **5 Critical** and **8 High-priority** gaps that must be resolved before implementation begins. These are primarily around consolidation pipeline reliability, semantic memory freshness guarantees, procedural skill invocation contracts, vector storage operational details, and cross-tier transactionality.

---

## 2. Strengths

| Area | Strength |
|------|----------|
| **Tiered Architecture** | Clear 4-tier hierarchy (Working → Episodic → Semantic → Procedural) with distinct characteristics, latencies, and use cases |
| **Event-Sourced Foundation** | All mutations via RFC-0003 events; proper correlation/causation ID propagation |
| **Consolidation Pipeline Design** | Well-structured: event-driven (embedding+graph) → nightly (Episodic→Semantic) → weekly (Pattern→Procedural) → monthly (quality) |
| **Hybrid Search Pipeline** | Vector + Keyword + Graph with RRF + cross-encoder re-ranking — industry best practice |
| **Context Assembly** | Explicit token budget allocation (30/20/30/10/10) with compression pipeline — aligns with RFC-0004 |
| **Procedural Memory as Skills** | Versioned, executable skills with SemVer, dependencies, quality metrics — not just static docs |
| **Multi-Tenant Isolation** | Physical (separate Qdrant collections, Kuzu DBs) + Logical (PG RLS, Qdrant filters) |
| **Security & Privacy** | PII detection (Presidio) → field-level encryption (Vault Transit) → exclusion from vectors/graph |
| **Observability** | Full metrics, traces with span linking, consolidation monitoring, capacity planning |
| **Cross-RFC Alignment** | Explicit integration points with RFC-0002 (MemoryCoordinator), RFC-0003 (events), RFC-0004 (AssembleContext) |

---

## 3. Weaknesses

| Area | Weakness |
|------|----------|
| **Consolidation Reliability** | No exactly-once guarantees for nightly/weekly batches; no dead letter handling for failed LLM extractions |
| **Semantic Freshness** | "Eventual (< 24h)" consolidation lag with no read-after-write consistency for newly consolidated knowledge |
| **Procedural Skill Invocation** | `InvokeSkill` delegates to agent but no contract for timeout, retry, partial failure, or streaming results |
| **Vector Storage Ops** | No detail on snapshot/restore, backup/restore, rolling upgrades, or schema migration for Qdrant/Kuzu |
| **Cross-Tier Transactions** | No saga pattern for multi-tier updates (e.g., Working→Episodic→Semantic atomic promotion) |
| **Context Assembly Latency** | 500ms P99 includes 4 parallel RPCs — no circuit breaker/fallback if one tier is slow |
| **Semantic Deduplication** | "Embedding similarity > 0.95" threshold arbitrary; no human-in-the-loop for borderline cases |
| **Procedural Skill Quality** | "Quality score 0-1" but no definition of evaluation criteria or automated benchmarking |
| **Working Memory Eviction** | "Flush to Episodic on eviction" but no detail on partial flush vs full, ordering guarantees |
| **Graph Population Reliability** | Event-driven Kuzu upsert — no idempotency, no replay mechanism for failed extractions |

---

## 4. Missing Components

| # | Component | Required By | Impact |
|---|-----------|-------------|--------|
| 1 | **Consolidation DLQ & Retry** | §10.1 | Failed nightly/weekly batches lost silently |
| 2 | **Semantic Read-After-Write** | §7, §11 | Newly consolidated knowledge not immediately queryable |
| 3 | **Procedural Skill Invocation Contract** | §8.4 | Agents cannot reliably invoke skills with guarantees |
| 4 | **Vector/Graph Backup/Restore** | §14, §15 | No disaster recovery for Qdrant/Kuzu |
| 5 | **Cross-Tier Saga Orchestration** | §10, §16 | Multi-tier promotions lack atomicity |
| 6 | **Context Assembly Fallbacks** | §11, §12 | Partial tier failure degrades entire context |
| 7 | **Semantic Deduplication Human Review** | §7.6, §10.2 | Borderline duplicates (0.90-0.95) need human review queue |
| 8 | **Procedural Skill Benchmarking** | §8.2, §10.2 | No automated quality benchmarking pipeline |
| 9 | **Working Memory Partial Eviction** | §5.4 | Ordering guarantees during partial flush to Episodic |
| 10 | **Graph Idempotent Population** | §15.3 | Kuzu upsert lacks idempotency key |
| 11 | **Consolidation Progress Visibility** | §10.1 | No per-tenant consolidation status API |
| 12 | **Vector Schema Migration** | §14 | No strategy for embedding model upgrades |
| 13 | **Memory Pressure Backpressure** | §17, §11 | AssembleContext can OOM on large contexts |
| 14 | **Tenant-Aware Consolidation Scheduling** | §10.1 | No priority/preemption for high-value tenants |
| 15 | **Procedural Skill Rollback Procedure** | §8.5 | "Instant via version pinning" but no automated rollback on failure |

---

## 5. Architectural Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| **MEM-001** | **Consolidation Pipeline Data Loss** — Nightly batch fails, no DLQ, events not re-processed | High | Critical | Add DLQ per stage; idempotent reprocessing; alerting on lag |
| **MEM-002** | **Semantic Staleness** — 24h consolidation lag breaks read-after-write for new knowledge | High | High | Add synchronous "fast lane" for high-priority consolidations |
| **MEM-003** | **Procedural Skill Invocation Failures** — No contract for timeouts/retries causes agent hangs | Medium | High | Define gRPC contract with timeout, retry, streaming, cancellation |
| **MEM-004** | **Vector Store Corruption/Upgrade Risk** — No backup/restore/migration plan for Qdrant/Kuzu | Low | Critical | Document backup/restore; test migration; blue-green deployment |
| **MEM-005** | **Context Assembly Cascade Failure** — One slow tier (e.g., Semantic 150ms) blocks entire 500ms budget | Medium | High | Add per-tier timeouts; graceful degradation (skip slow tier) |
| **MEM-006** | **Cross-Tier Inconsistency** — Working→Episodic→Semantic promotion not atomic | Medium | High | Implement saga orchestrator for multi-tier promotions |
| **MEM-007** | **Semantic Deduplication Errors** — 0.95 threshold causes false merges/splits | Medium | High | Add human review queue for 0.90-0.95 similarity |
| **MEM-008** | **Working Memory Eviction Race** — Partial flush to Episodic loses ordering | Low | High | Single-writer per session; atomic flush with sequence numbers |
| **MEM-009** | **Graph Population Idempotency** — Kuzu upsert duplicates on event replay | Medium | High | Add event_id as idempotency key in Kuzu |
| **MEM-010** | **Consolidation Resource Contention** — Nightly batch consumes DB/CPU, impacts live queries | High | Medium | Priority scheduling; read replicas for consolidation reads |

---

## 6. Recommendations

### 6.1 Structural Changes (Do Before Approval)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 1 | **Add Consolidation DLQ & Retry Framework** — Per-stage DLQ (Kafka/NATS topic); idempotent reprocessing; exponential backoff; alerting on DLQ depth | Critical | Medium |
| 2 | **Define Procedural Skill Invocation gRPC Contract** — `InvokeSkill` with timeout, streaming, cancellation, partial results, error codes | Critical | Medium |
| 4 | **Add Semantic Fast-Lane Consolidation** — Synchronous path for high-priority events (approvals, decisions) with < 5s latency | Critical | Low |
| 5 | **Add Context Assembly Circuit Breakers** — Per-tier timeout (Semantic 100ms, Episodic 20ms); graceful degradation (skip tier) | Critical | Low |
| 6 | **Define Cross-Tier Saga for Promotions** — Working→Episodic→Semantic as saga with compensation | Critical | Medium |
| 7 | **Add Human Review Queue for Deduplication** — 0.90-0.95 similarity → human review UI; auto-merge > 0.95 | High | Medium |
| 8 | **Define Vector/Graph Backup/Restore/Upgrade Procedures** — Snapshot schedules, point-in-time recovery, blue-green migration | High | Medium |
| 9 | **Add Procedural Skill Invocation Observability** — Metrics: latency, success rate, token usage, partial failures | High | Low |
| 10 | **Define Memory Pressure Backpressure** — AssembleContext returns `RESOURCE_EXHAUSTED` if context > budget; client backoff | High | Low |

### 6.2 Design Improvements (Post-Approval, Pre-Implementation)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 11 | **Semantic Read-After-Write Consistency** — Sync fast-lane for critical writes; version vectors for causal consistency | Medium | Medium |
| 12 | **Procedural Skill Benchmarking Pipeline** — Auto-run test suites on registration; benchmark latency/tokens/success | Medium | Medium |
| 13 | **Consolidation Priority Scheduling** — High-value tenants get resource priority; preemption for urgent consolidations | Medium | Medium |
| 14 | **Vector Schema Migration Strategy** — Embedding model upgrade path; dual-write during transition | Medium | Medium |
| 15 | **Working Memory Atomic Flush** — Sequence numbers per turn; single-writer per session; exactly-once Episodic append | Medium | Low |
| 16 | **Graph Idempotent Population** — Add `event_id` as idempotency key in Kuzu upserts | Medium | Low |
| 17 | **Consolidation Progress API** — Per-tenant status: stage, progress %, lag, ETA | Medium | Low |
| 18 | **Memory Pressure Metric** — Export `hermes_memory_pressure_ratio` for autoscaling | Medium | Low |
| 19 | **Procedural Skill Rollback Automation** — On invocation failure > threshold, auto-rollback to previous version | Low | Medium |
| 20 | **Consolidation Resource Isolation** — Dedicated read replicas for consolidation reads; CPU/memory limits | Low | Medium |

---

## 7. Required Changes Before Approval

### Critical (Must Fix — Blockers)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **C-01** | **Consolidation DLQ & Retry** | §10.1 | Add per-stage DLQ (NATS topic); idempotent reprocessing; alerting on DLQ depth > 100 |
| **C-02** | **Procedural Skill Invocation Contract** | §8.4, §17 | Define `InvokeSkill` gRPC: timeout, streaming, cancellation, partial results, error codes |
| **C-03** | **Semantic Fast-Lane Consolidation** | §7.6, §10.1 | Synchronous path for high-priority events (< 5s); event tag `consolidation.priority=high` |
| **C-04** | **Context Assembly Circuit Breakers** | §11.1, §11.3 | Per-tier timeouts (Semantic 100ms, Episodic 20ms); graceful degradation (skip tier, log warning) |
| **C-05** | **Cross-Tier Saga for Promotions** | §10, §16 | Working→Episodic→Semantic as saga with compensation; exactly-once per tier |

### High (Must Fix — Major Gaps)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **H-01** | **Procedural Skill Benchmarking Pipeline** | §8.2, §10.2 | Auto-test on registration; benchmark latency/tokens/success; quality score definition |
| **H-02** | **Vector/Graph Backup/Restore/Upgrade** | §14, §15 | Snapshot schedules, PITR, blue-green migration for Qdrant/Kuzu |
| **H-03** | **Semantic Deduplication Human Review** | §7.6, §10.2 | Queue for 0.90-0.95 similarity; auto-merge > 0.95 |
| **H-04** | **Context Assembly Fallbacks** | §11.1, §12 | Per-tier timeouts; skip slow tier; log degradation |
| **H-05** | **Vector/Graph Backup/Restore** | §14, §15 | Snapshot schedules, PITR, blue-green migration for Qdrant/Kuzu |
| **H-06** | **Graph Idempotent Population** | §15.3 | Add `event_id` as idempotency key in Kuzu upserts |
| **H-07** | **Consolidation Progress API** | §10.1 | Per-tenant status: stage, progress %, lag, ETA |
| **H-08** | **Memory Pressure Backpressure** | §11, §17 | AssembleContext returns `RESOURCE_EXHAUSTED` if context > budget |

---

## 8. Approval Decision

### **APPROVED WITH CHANGES**

**Conditions for Full Approval:**

1. **All 5 Critical changes (C-01 to C-05) implemented** in RFC-0005 v1.1
2. **All 8 High-priority changes (H-01 to H-08) documented** as follow-up ADRs or RFC amendments
3. **Vector/Graph operational procedures** (backup, restore, upgrade, migration) documented
3. **Cross-RFC contract tests** signed off with RFC-0002, RFC-0003, RFC-0004 owners
4. **Security review** of PII handling, field-level encryption, multi-tenant isolation

---

> **RFC-0005 is approved as the architectural foundation for Hermes Memory and implementation may begin once the Critical conditions above are met.**

---

*Principal Enterprise Architect*  
*2026-07-24*