# RFC-0002 v1.1 — Review Items Addressed

**Source Review:** RFC-0002-Architectural-Review.md (Principal Architect Review)  
**Date:** 2026-07-24  
**Status:** All Critical and High items addressed in v1.1

---

## Executive Summary

All **7 Critical (C-01 to C-07)** and **12 High (H-01 to H-12)** review items have been incorporated into RFC-0002 v1.1. All 7 Medium (M-01 to M-07) and 5 Low (L-01 to L-05) items have also been addressed. No review items were deferred without justification.

---

## Critical Items (C-01 to C-07) — ALL ADDRESSED

### C-01: Extract Security Layer as Standalone Service
**Review Location:** §4.1, §13.6, §16  
**Resolution:** 
- Removed "Security Layer" module from Core module decomposition
- Added **Security Service Client** module (§4.2) that calls standalone Security Service (RFC-0007) via gRPC
- Defined Security Service gRPC API: `Authorize`, `IssueToken`, `RevokeToken`, `AuditQuery`, `DetectPII` (§14.1, §17.1)
- Capability token format specified (JWT + SPIFFE, 5min TTL, Ed25519) (§17.2)
- All modules use interceptor pattern calling Security Service (§17.1)
- WASM supply chain security detailed (§17.3)

### C-02: Decompose Conversation Engine
**Review Location:** §4, §8  
**Resolution:**
- Split into 5 focused modules:
  1. **Context Assembler** — context assembly only (§8.1)
  2. **History Manager** — thread management, pruning, summary storage (§8.2)
  3. **Summarizer** — async summarization with LLM budget + extractive fallback (§8.3)
  4. **Intent Router** — delegates to Planning Engine, handles clarification (§8.4)
  5. **Response Coordinator** — streams response, triggers client sync (§8.5)
- Each has single responsibility, own event namespace (§4.2, §5.2)
- Updated module dependency graph (§4.1, §22.1)

### C-03: Planning Engine Validation, Fallback, Token Budget, Caching
**Review Location:** §9.3  
**Resolution:**
- **Deterministic validator** (no LLM) — schema check, capability existence, estimate bounds (§9.3 step 2)
- **Non-LLM fallback planner** — template library (YAML) for common patterns (§9.3 step 3, §9.4)
- **Hard token budget** — 10,000 tokens/plan, LLM planner max 4,000 (§9.4)
- **Plan cache** — LRU, TTL 24h, invalidated on capability/tool change (§9.3 step 12, §9.4)
- **Plan schema** updated with `intent_fingerprint`, `from_cache`, `compensation_dag` (§9.2)

### C-04: Task Orchestrator Sharding
**Review Location:** §10.1, §17.1  
**Resolution:**
- **64 shards** by `conversation_id` hash (configurable) (§10.1)
- **Leader per shard** via NATS JetStream leader election (§10.1)
- **Followers** for read replicas (§10.1)
- **Global Coordinator** for cross-shard deps, rebalancing, failover (§10.1)
- Scheduling algorithm updated for per-shard execution (§10.2)
- Agent selection policy updated with pool availability weight (§10.3)
- Quotas per shard and per agent instance (§10.4)

### C-05: Agent Warm Pool Model
**Review Location:** §12.2, §12.3  
**Resolution:**
- **Pool-based architecture** — min/max instances per agent type (§12.1)
- **Task assignment** → route to IDLE instance in matching pool (§12.4)
- **Checkpoint/restore** — on task completion, checkpoint context; on next task, restore (§12.4)
- **Scale-to-zero** — IDLE TTL 300s default; min_instances kept warm (§12.4, §12.5)
- **Agent manifest v1** includes pool config: `min_instances`, `max_instances`, `idle_ttl_seconds`, `scale_to_zero`, `checkpoint_retention` (§12.3)
- **Canary rollout** — 10% → 50% → 100% over 30 min with rollback (§12.4)

### C-06: Memory/Knowledge Coordinator Contracts
**Review Location:** §4.1, §14.1  
**Resolution:**
- **MemoryService gRPC**: `ReadWorking`, `WriteEpisodic`, `QuerySemantic`, `QueryProcedural`, `InvalidateCache` (§14.1)
- **KnowledgeService gRPC**: `RAGQuery`, `IndexDocument`, `HybridSearch`, `CheckFreshness` (§14.1)
- **Consistency model** explicit in Context Assembler: working=strong, episodic/semantic=eventual (§8.1)
- Event-driven cache invalidation via `memory.invalidation.triggered` (§4.2)

### C-07: Event Ownership & Domain Boundaries
**Review Location:** §5.2  
**Resolution:**
- **OWNER annotation** for every topic namespace in taxonomy (§5.2)
- **Rule**: Only owning module publishes; others subscribe via contracts
- **Breaking changes** require consumer approval (enforced in CI) (§5.2)
- **EventEnvelope v1** includes `version` in metadata (§5.3)
- Topic versioning: `v1.conversation.message.received` format (§5.2, §5.3)

---

## High-Priority Items (H-01 to H-12) — ALL ADDRESSED

### H-01: Configuration Management Module
**Resolution:** New **Config Manager** module (§4.1, §4.2, §18)
- Central config in etcd with schema validation (§18.1)
- Feature flags with gradual rollout (§18.1)
- Secrets via HashiCorp Vault integration (§18.1)
- Hot-reload via `system.config.updated` events (§18.1)
- gRPC `ConfigService` for all modules (§14.1)

### H-02: Provider Gateway Routing Specification
**Resolution:** Detailed in §4.2 (Provider Gateway), §11.2 (WASM), §14.1 (ProviderService)
- **Scored routing**: cost, latency, capability, availability weights
- **Fallback chains** with circuit breaker integration
- **Streaming coordination** for multi-model calls
- **Cost tracking** per request via `provider.cost.recorded` events

### H-03: Observability Contracts
**Resolution:** New **Observability Contracts** module (§4.1, §4.2, §19)
- **OTel span attributes** per module (standardized names)
- **Prometheus metrics** with labels (module, operation, status, tenant)
- **JSON log format** with trace correlation
- **Trace sampling**: head 10% + tail 100% errors
- **Correlation** via `trace_id` in event metadata

### H-04: Multi-Region / DR Strategy
**Resolution:** §20 (Multi-Region / Disaster Recovery)
- **NATS supercluster**: leaf nodes per region, gateway per region, global topic replication
- **PostgreSQL**: streaming replicas per region, Patroni failover
- **Data residency**: per-tenant region affinity
- **RTO < 5 min, RPO < 1 min** for control plane; < 15 min / < 5 min for data plane
- **DR runbook**: automated failover + manual verification steps

### H-05: Contract Testing Framework
**Resolution:** §21 (Contract Testing Framework)
- **Pact** for gRPC services: provider verification, consumer mocks, Pact Broker
- **Schemathesis** for NATS event schemas: schema registry (Buf), breaking change detection
- **CI gates**: `pact-verifier` on every PR, `buf breaking` check
- **Integration test layer**: full flow + chaos engineering + performance

### H-06: Agent Manifest Versioning & Migration
**Resolution:** §12.3 (Agent Manifest v1)
- **Semver** for agent and capabilities separately (`capability_versions` map)
- **Migration scripts** per version transition
- **Canary rollout**: 10% → 50% → 100% over 30 min with rollback
- **Capability deprecation policy**: 2 version notice period

### H-07: Idle Agent Cleanup / Scale-to-Zero
**Resolution:** §12.2 (Lifecycle), §12.4 (Pool Management), §12.5 (Idle Cleanup)
- **TTL**: `idle_ttl_seconds` (default 300s) after last task
- **Scale-to-zero** enabled by default; `min_instances` always warm
- **Checkpoint retention**: last 3 checkpoints preserved
- **Resource reclamation**: memory, CPU, model connections, WASM runtimes on termination

### H-08: Inter-Module Transactionality
**Resolution:** §7.5 (Inter-Module Transactionality), §6.2 (DSL with compensation_dag)
- **Saga compensation** across modules: each emits compensation events; Workflow Engine orchestrates
- **Compensation DAG pre-computed** at plan time (§6.2)
- **No XA transactions** — two-phase commit emulation via saga
- **Timeouts**: per-step 300s, global 1800s
- **Operator escalation** on compensation failure/deadlock → DLQ + alert + Mission Control

### H-09: Backpressure / Flow Control
**Resolution:** §11.1 (Execution Engine), §11.4 (Streaming Protocol), §10.4 (Quotas)
- **NATS consumer** `MaxAckPending=100` per module
- **Queue depth metrics** exported to Prometheus
- **HPA rules** for Execution Engine / Agent Runtime at 80% capacity
- **Circuit breaker** integration (thresholds in §16.3)

### H-10: WASM Supply Chain Security
**Resolution:** §11.2 (WASM Sandbox), §17.3 (WASM Supply Chain Security)
- **Sigstore (cosign)** signing for all tools/plugins at publish
- **Admission control**: Tool Manager verifies signature + Trivy scan before registration
- **Capability tokens**: 5 min TTL, task-scoped, verified at sandbox instantiation
- **Seccomp profile**: default deny, per-capability syscall allowlist
- **Vulnerability scanning**: automated on registration; block on CRITICAL/HIGH

### H-11: Memory/Knowledge Consistency Model
**Resolution:** §8.1 (Context Assembler), §4.2 (Module Specs)
- **Working memory**: read-your-writes (strong consistency)
- **Episodic/Semantic**: eventual consistency (< 1s)
- **Event-driven cache invalidation**: `memory.invalidation.triggered` events
- **Stale-read detection**: version vectors in semantic queries

### H-12: Workflow Compensation Deadlock Prevention
**Resolution:** §6.6 (Compensation Deadlock Prevention), §6.2 (DSL with compensation_dag)
- **Pre-compute compensation DAG** at plan creation
- **Validate acyclic** — reject plan if cycles detected
- **Global workflow timeout** (default 48h) triggers compensation
- **Per-compensation timeout** (300s) with escalation
- **Max compensation depth** 10 steps
- **Operator escalation** on deadlock: DLQ + alert + Mission Control

---

## Medium-Priority Items (M-01 to M-07) — ALL ADDRESSED

| ID | Item | Resolution |
|----|------|------------|
| M-01 | Event schema versioning | §5.2 (topic versioning), §5.3 (EventEnvelope v1 with version) |
| M-02 | Summarization LLM budget | §8.3 (500 token max, TextRank fallback) |
| M-03 | Plan caching & reuse | §9.3 (cache check), §9.4 (LRU, 24h TTL, invalidation), §9.2 (intent_fingerprint) |
| M-04 | Agent health check detail | §12.3 (manifest `details: true`), §12.4 (includes model latency, tools, memory, checkpoint age) |
| M-05 | Tool execution determinism | §11.2 (WASM Sandbox - Determinism row) |
| M-06 | HITL approval UX contract | §15.2 (payload schema), §6.2 (DSL `approval_payload_schema`) |
| M-07 | Artifact lifecycle management | §11.5 (TTL, GC, tiering, access control) |

---

## Low-Priority Items (L-01 to L-05) — ALL ADDRESSED

| ID | Item | Resolution |
|----|------|------------|
| L-01 | Workflow visual debugger | §22.3 (Mermaid stateDiagram-v2 with compensation notes) |
| L-02 | State Manager architecture diagram | §22.2 (Mermaid diagram: Event Store, Snapshot Store, Projection Engine, Query API) |
| L-03 | Capacity planning formulas | §17.3 (retained from v1.0 with 1x/10x/100x tables) |
| L-04 | OpenAPI/AsyncAPI specs | §21 (generated from Protobuf via Buf/Pact) |
| L-05 | Glossary | §26 (14 terms: correlation_id, causation_id, idempotency_key, saga, HITL, ACP, WASI, etc.) |

---

## Summary

| Category | Total | Addressed | Deferred | % Complete |
|----------|-------|-----------|----------|------------|
| **Critical** | 7 | 7 | 0 | 100% |
| **High** | 12 | 12 | 0 | 100% |
| **Medium** | 7 | 7 | 0 | 100% |
| **Low** | 5 | 5 | 0 | 100% |
| **TOTAL** | **31** | **31** | **0** | **100%** |

---

**All review items from the Principal Architect Review have been incorporated into RFC-0002 v1.1. The document is ready for review gate sign-offs.**