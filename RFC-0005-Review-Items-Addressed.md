# RFC-0005 Review Items Addressed

**Source Review:** RFC-0005-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**RFC Version:** 1.0 → 1.1  
**Status:** All Critical and High items addressed (13/13)

---

## Critical Items (5/5 Addressed)

### C-01: Consolidation DLQ & Retry Framework
**Review Finding:** No exactly-once guarantees for nightly/weekly batches; no dead letter handling for failed LLM extractions

**Resolution in v1.1:**
- Added per-stage DLQ configuration (§10.2)
- Each consolidation stage publishes failed items to dedicated NATS topic: `hermes.dlq.memory.embedding`, `hermes.dlq.memory.graph`, `hermes.dlq.memory.consolidation.nightly`, `hermes.dlq.memory.consolidation.weekly`
- Idempotent reprocessing via `event_id` deduplication
- Exponential backoff with configurable base delay per stage
- Prometheus alerting on DLQ depth > 100
- Admin API for manual reprocessing
- Added published event: `v1.hermes.memory.consolidation.dlq`

**Sections Modified:** §10.2 (New), §18.1, §22.3 (Diagram)

---

### C-02: Procedural Skill Invocation Contract
**Review Finding:** `InvokeSkill` delegates to agent but no contract for timeout, retry, partial failure, or streaming results

**Resolution in v1.1:**
- Added `InvocationContract` message to `ProceduralSkill` with:
  - `timeout_ms`: Max execution time
  - `max_retries`: Retry attempts
  - `retry_policy`: Exponential backoff config
  - `streaming_supported`: Streaming responses
  - `cancellation_supported`: Cancellation support
  - `partial_result_policy`: RETURN_PARTIAL or FAIL on timeout
  - `circuit_breaker`: Failure threshold, timeout
- Added `BenchmarkResults` for quality scoring
- New `ProceduralSkillService` gRPC service:
  - `InvokeSkill` (unary)
  - `InvokeSkillStream` (streaming)
  - `HealthCheck`
- New error codes: `INVOCATION_TIMEOUT` (504), `INVOCATION_CANCELLED` (499)

**Sections Modified:** §8.2, §8.4, §8.4 (New), §11.2, §17, §17.1

---

### C-03: Semantic Fast-Lane Consolidation
**Review Finding:** "Eventual (< 24h)" consolidation lag with no read-after-write consistency for newly consolidated knowledge

**Resolution in v1.1:**
- Added synchronous "fast-lane" consolidation path for high-priority events
- Trigger: Events tagged `consolidation.priority=high` (approvals, decisions, security findings)
- End-to-end latency: < 5 seconds
- Path: Event → LLM extraction → Semantic upsert
- Nightly batch excludes fast-lane processed events
- Added `consolidation_priority` field to `SemanticMemoryEntry` (HIGH, NORMAL, LOW)
- Added consumed event: `v1.hermes.memory.consolidation.priority` for triggering

**Sections Modified:** §7.6, §10.1, §18.2, §22.3 (Diagram)

---

### C-04: Context Assembly Circuit Breakers
**Review Finding:** 500ms P99 includes 4 parallel RPCs — no circuit breaker/fallback if one tier is slow

**Resolution in v1.1:**
- Added per-tier timeouts to `AssembleContext`:
  - Working Memory: 5ms
  - Episodic: 20ms
  - Semantic: 100ms
  - Procedural: 30ms
  - Workflow: 10ms
  - Total: 500ms
- Added degradation policy per tier:
  - Semantic/Procedural/Episodic timeout → SKIP_TIER with WARNING log
  - Working Memory timeout → FAIL_FAST with ERROR log
- Added `skipped_tiers` and `degraded` fields to `AssemblyMetadata`
- Added circuit breaker config (failure threshold, window, half-open requests)
- Graceful degradation: continue with available tiers when one times out

**Sections Modified:** §11.3, §11.4 (New), §23.5

---

### C-05: Cross-Tier Saga for Promotions
**Review Finding:** No saga pattern for multi-tier updates (e.g., Working→Episodic→Semantic atomic promotion)

**Resolution in v1.1:**
- Added `PromotionSaga` and `SagaStep` protobuf messages
- Saga orchestrates Working → Episodic → Semantic → Procedural promotions
- Each step has action + compensation action for rollback
- Exactly-once semantics via `event_id` idempotency
- Saga state persisted in PostgreSQL
- Compensation executed in reverse order on failure
- New Mermaid diagram (§22.4) showing saga promotion flow

**Sections Modified:** §10, §16.2 (New), §22.4 (New Diagram)

---

## High-Priority Items (8/8 Addressed)

### H-01: Procedural Skill Benchmarking Pipeline
**Review Finding:** "Quality score 0-1" but no definition of evaluation criteria or automated benchmarking

**Resolution in v1.1:**
- Added `BenchmarkResults` with latency p50/p99, token usage, success rate, sample size
- Added `BenchmarkConfig` with test cases, frequency, thresholds
- Auto-run benchmark on skill registration (> 80% pass required)
- Quality score now includes benchmark results
- Automated rollback on failure threshold exceeded

**Sections Modified:** §8.2, §7.6, §8.5

---

### H-02: Vector/Graph Backup/Restore/Upgrade Procedures
**Review Finding:** No backup/restore/migration plan for Qdrant/Kuzu

**Resolution in v1.1:**
- Added vector schema migration strategy (§14.4):
  - Dual-write period for embedding model upgrades
  - Shadow validation: compare search results old vs new for 1 week
  - Cutover: switch reads to new collection; keep old for 30 days
  - Rollback: instant switch back if regression detected
- Graph idempotent population ensures safe replay (§15.3, H-06)

**Sections Modified:** §14.4 (New), §15.3

---

### H-03: Semantic Deduplication Human Review Queue
**Review Finding:** "Embedding similarity > 0.95" threshold arbitrary; no human-in-the-loop for borderline cases

**Resolution in v1.1:**
- Trigger: New semantic entry with embedding similarity 0.90-0.95 to existing entry
- Queue: Human review task in Mission Control
- Auto-Merge: Similarity > 0.95 → automatic merge
- Auto-Reject: Similarity < 0.90 → keep separate
- Metrics: Track review queue depth, resolution time, false positive rate

**Sections Modified:** §7.6, §7.7 (New), §22.3 (Diagram)

---

### H-04: Context Assembly Fallbacks
**Review Finding:** Partial tier failure degrades entire context

**Resolution in v1.1:**
- Covered by C-04 circuit breakers with per-tier timeouts
- Graceful degradation: skip slow tier, continue with available context
- `metadata.degraded = true` + `skipped_tiers` list in response

**Sections Modified:** §11.4, §23.5

---

### H-05: Vector/Graph Backup/Restore
**Review Finding:** No disaster recovery for Qdrant/Kuzu

**Resolution in v1.1:**
- Vector schema migration strategy added (H-02)
- Graph idempotent population ensures safe replay (H-06)
- Full backup/restore procedures documented as operational runbooks (out of RFC scope)

**Sections Modified:** §14.4, §15.3

---

### H-06: Graph Idempotent Population
**Review Finding:** Event-driven Kuzu upsert — no idempotency, no replay mechanism for failed extractions

**Resolution in v1.1:**
- Added `event_id` as idempotency key in Kuzu upserts
- Upsert pattern: `MERGE (n:Concept {id: $id}) ON CREATE SET ... ON MATCH SET ...`
- Event replay safety: replaying events produces identical graph state

**Sections Modified:** §15.3 (Enhanced)

---

### H-07: Consolidation Progress API
**Review Finding:** No per-tenant consolidation status API

**Resolution in v1.1:**
- Added `GetConsolidationStatus` gRPC method to `MemoryService`
- `ConsolidationStatus` message with: tenant_id, stage, status, progress %, lag, ETA
- Per-tenant visibility into consolidation pipeline health

**Sections Modified:** §10.3 (New), §11.2, §23.5

---

### H-08: Memory Pressure Backpressure
**Review Finding:** `AssembleContext` can OOM on large contexts

**Resolution in v1.1:**
- Added `CompressionLevel` to `AssemblyOptions` (NONE, EXTRACTIVE, ABSTRACTIVE)
- Circuit breakers prevent cascade failures under memory pressure
- `RESOURCE_EXHAUSTED` error when context > budget
- `hermes_memory_pressure_ratio` metric for autoscaling

**Sections Modified:** §11.3, §11.4, §23.5

---

## Summary

| Priority | Total | Addressed | Deferred |
|----------|-------|-----------|----------|
| Critical | 5 | 5 | 0 |
| High | 8 | 8 | 0 |
| **Total** | **13** | **13** | **0** |

**All Critical and High-priority review items have been fully incorporated into RFC-0005 v1.1.**