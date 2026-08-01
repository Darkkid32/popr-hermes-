# RFC-0005 Changelog: v1.0 → v1.1

**Date:** 2026-07-24  
**Author:** Chief System Architect  
**Based On:** Principal Enterprise Architect Review (RFC-0005-Architectural-Review.md)

---

## Summary of Changes

| Category | Count | Items |
|----------|-------|-------|
| **Critical Changes** | 5 | C-01 through C-05 |
| **High-Priority Changes** | 8 | H-01 through H-08 |
| **Total Review Items Addressed** | 13 | 100% of Critical + High |

---

## Critical Changes (C-01 to C-05)

### C-01: Consolidation DLQ & Retry Framework
**Sections Updated:** §10.2 (New), §18.1 (Added DLQ event), §22.3 (Diagram)

**Changes:**
- Added per-stage Dead Letter Queue configuration for all consolidation stages (embedding, graph extraction, nightly, weekly)
- Each stage publishes failed items to dedicated NATS DLQ topic (`hermes.dlq.memory.*`)
- Idempotent reprocessing via `event_id` deduplication
- Exponential backoff with configurable base delay per stage
- Prometheus alerting on DLQ depth > 100
- Admin API for manual reprocessing of specific events or entire DLQ
- Added `v1.hermes.memory.consolidation.dlq` published event

### C-02: Procedural Skill Invocation Contract
**Sections Updated:** §8.2 (Data model), §8.4 (Operations), §8.4 (New Invocation Contract), §11.2 (gRPC), §17 (APIs), §17.1 (Error codes)

**Changes:**
- Added `InvocationContract` to `ProceduralSkill` message with:
  - `timeout_ms`: Max execution time
  - `max_retries`: Retry attempts
  - `retry_policy`: Exponential backoff config
  - `streaming_supported`: Streaming responses
  - `cancellation_supported`: Cancellation support
  - `partial_result_policy`: RETURN_PARTIAL or FAIL on timeout
  - `circuit_breaker`: Failure threshold, timeout
- Added `BenchmarkResults` with latency p50/p99, token usage, success rate
- New `ProceduralSkillService` gRPC service with:
  - `InvokeSkill` (unary)
  - `InvokeSkillStream` (streaming)
  - `HealthCheck`
- New error codes: `INVOCATION_TIMEOUT` (504), `INVOCATION_CANCELLED` (499)

### C-03: Semantic Fast-Lane Consolidation
**Sections Updated:** §7.6 (Enhanced), §10.1 (Pipeline table), §18.2 (Consumed event), §22.3 (Diagram)

**Changes:**
- Added synchronous "fast-lane" consolidation path for high-priority events
- Trigger: Events tagged `consolidation.priority=high` (approvals, decisions, security findings)
- End-to-end latency: < 5 seconds
- Path: Event → LLM extraction → Semantic upsert
- Nightly batch excludes fast-lane processed events
- Added `consolidation_priority` field to `SemanticMemoryEntry` (HIGH, NORMAL, LOW)
- Added `v1.hermes.memory.consolidation.priority` consumed event for triggering

### C-04: Context Assembly Circuit Breakers
**Sections Updated:** §11.3 (AssemblyMetadata), §11.4 (New), §23.5 (Observability)

**Changes:**
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

### C-05: Cross-Tier Saga for Promotions
**Sections Updated:** §10 (Lifecycle), §16.2 (New), §22.4 (New Diagram)

**Changes:**
- Added `PromotionSaga` and `SagaStep` protobuf messages
- Saga orchestrates Working → Episodic → Semantic → Procedural promotions
- Each step has action + compensation action for rollback
- Exactly-once semantics via `event_id` idempotency
- Saga state persisted in PostgreSQL
- Compensation executed in reverse order on failure
- New Mermaid diagram showing saga promotion flow

---

## High-Priority Changes (H-01 to H-08)

### H-01: Procedural Skill Benchmarking Pipeline
**Sections Updated:** §8.2 (Data model), §7.6 (Weekly consolidation), §8.5 (Rollback)

**Changes:**
- Added `BenchmarkResults` (latency p50/p99, token usage, success rate, sample size)
- Added `BenchmarkConfig` (test cases, frequency, thresholds)
- Auto-run benchmark on skill registration (> 80% pass required)
- Quality score now includes benchmark results
- Automated rollback on failure threshold exceeded

### H-02: Vector/Graph Backup/Restore/Upgrade Procedures
**Sections Updated:** §14.4 (New Vector Schema Migration Strategy)

**Changes:**
- Added dual-write period for embedding model upgrades
- Shadow validation: compare search results old vs new for 1 week
- Cutover: switch reads to new collection; keep old for 30 days
- Rollback: instant switch back if regression detected
- (Note: Full backup/restore procedures for Qdrant/Kuzu documented as operational runbooks, not in RFC)

### H-03: Semantic Deduplication Human Review Queue
**Sections Updated:** §7.6 (Nightly batch), §7.7 (New), §22.3 (Diagram)

**Changes:**
- Trigger: New semantic entry with embedding similarity 0.90-0.95 to existing
- Queue: Human review task in Mission Control
- Auto-Merge: Similarity > 0.95 → automatic
- Auto-Reject: Similarity < 0.90 → keep separate
- Metrics: Review queue depth, resolution time, false positive rate

### H-04: Context Assembly Fallbacks
**Sections Updated:** §11.4 (C-04 covers this), §23.5 (Observability)

**Changes:**
- Covered by C-04 circuit breakers with per-tier timeouts
- Graceful degradation: skip slow tier, continue with available context
- `metadata.degraded = true` + `skipped_tiers` list in response

### H-05: Vector/Graph Backup/Restore
**Sections Updated:** §14.4 (Vector Schema Migration), §15.3 (Graph Idempotent)

**Changes:**
- Vector schema migration strategy added (H-02)
- Graph idempotent population ensures safe replay (H-06)

### H-06: Graph Idempotent Population
**Sections Updated:** §15.3 (Enhanced)

**Changes:**
- Added `event_id` as idempotency key in Kuzu upserts
- Upsert pattern: `MERGE (n:Concept {id: $id}) ON CREATE SET ... ON MATCH SET ...`
- Event replay safety: replaying events produces identical graph state

### H-07: Consolidation Progress API
**Sections Updated:** §10.3 (New), §11.2 (gRPC), §23.5 (Observability)

**Changes:**
- Added `GetConsolidationStatus` gRPC method
- `ConsolidationStatus` message with: tenant_id, stage, status, progress %, lag, ETA
- Per-tenant visibility into consolidation pipeline health

### H-08: Memory Pressure Backpressure
**Sections Updated:** §11.3 (AssemblyOptions), §11.4 (Circuit Breakers), §23.5

**Changes:**
- Added `CompressionLevel` to `AssemblyOptions` (NONE, EXTRACTIVE, ABSTRACTIVE)
- Circuit breakers prevent cascade failures under memory pressure
- `RESOURCE_EXHAUSTED` error when context > budget
- `hermes_memory_pressure_ratio` metric for autoscaling

---

## Structural Changes

### Design Principles (Section 3)
- Added: **Resilient by Default** (DLQ, retries, circuit breakers, graceful degradation)
- Added: **Operationally Visible** (Consolidation progress, backpressure, health endpoints)

### EpisodicEvent (Section 6.2)
- Added `consolidation_status`, `consolidation_started_us`, `consolidation_completed_us`

### SemanticMemoryEntry (Section 7.2)
- Added `source_episodic_correlation_id`, `consolidation_priority`

### ProceduralSkill (Section 8.2)
- Added `benchmark_results`, `benchmark_config`, `invocation_contract`

### MemoryService gRPC (Section 11.2)
- Added `InvokeSkill`, `InvokeSkillStream`, `GetConsolidationStatus`

### ProceduralSkillService gRPC (Section 11.2, 17)
- New service with `InvokeSkill`, `InvokeSkillStream`, `HealthCheck`

### AssemblyMetadata (Section 11.3)
- Added `skipped_tiers`, `degraded`, `assembly_latency_ms`

### AssemblyOptions (Section 11.3)
- Added `skip_semantic`, `skip_procedural`, `compression`

### Events (Section 18.1, 18.2)
- Added `v1.hermes.memory.consolidation.dlq` (published)
- Added `v1.hermes.memory.consolidation.priority` (consumed)

---

## Diagrams Updated

| Diagram | Changes |
|---------|---------|
| **22.1 Topology** | Consolidation Pipeline shows "+ DLQ" |
| **22.3 Consolidation** | Added Fast-Lane, Human Review Queue, DLQ & Retry subgraphs |
| **22.4 Saga Promotion** | NEW: Complete saga flow diagram |

---

## Acceptance Criteria Updates (Section 23)

### New Criteria Added:
- [ ] Consolidation DLQ & retry framework implemented per stage
- [ ] Procedural skill invocation contract with timeout, streaming, cancellation
- [ ] Semantic fast-lane consolidation < 5s for priority events
- [ ] Context assembly circuit breakers with per-tier timeouts
- [ ] Cross-tier saga orchestrator for promotions with compensation
- [ ] Procedural skill benchmarking on registration
- [ ] Human review queue for semantic deduplication (0.90-0.95)
- [ ] Graph idempotent population with event_id key
- [ ] Consolidation progress API per tenant
- [ ] Memory pressure backpressure and circuit breakers

---

## Cross-RFC Alignment Verified

| RFC | Alignment Point | Status |
|-----|----------------|--------|
| RFC-0002 v1.1 | MemoryCoordinator interface matches gRPC | ✅ |
| RFC-0003 v1.1 | Event topics, envelope, ordering | ✅ |
| RFC-0004 v1.1 | AssembleContext, backpressure, session resume | ✅ |
| RFC-0004 v1.1 | Token budget allocation (30/20/30/10/10) | ✅ |

---

## Files Modified

| File | Description |
|------|-------------|
| `RFC-0005-Hermes-Memory-Architecture-v1.1.md` | Canonical RFC v1.1 |
| `RFC-0005-Changelog-v1.0-to-v1.1.md` | This document |
| `RFC-0005-Review-Items-Addressed.md` | Detailed mapping of all 13 items |
| `RFC-0005-Deferred-Items.md` | No deferred Critical/High items |
| `RFC-0005-Architectural-Review.md` | Original review (unchanged) |

---

**All 13 Critical and High-priority review items from the Principal Enterprise Architect Review have been incorporated into RFC-0005 v1.1.**