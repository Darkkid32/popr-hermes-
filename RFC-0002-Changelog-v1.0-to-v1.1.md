# RFC-0002 Changelog: v1.0 → v1.1

**Date:** 2026-07-24  
**Author:** Chief System Architect  
**Based On:** Principal Architect Review (RFC-0002-Architectural-Review.md)

---

## Summary

| Metric | v1.0 | v1.1 | Change |
|--------|------|------|--------|
| **Modules** | 12 | 18 | +6 (Conversation decomposed, Config Manager, Observability Contracts, Security Service Client) |
| **Event Topics** | 40+ | 50+ | +10 (config.*, new conversation.*, agent.pool.*) |
| **Diagrams** | 3 | 8 | +5 (State Manager, Workflow with Compensation, NATS Supercluster, Sharded Orchestrator, Agent Pool) |
| **Protobuf Schemas** | 3 | 7 | +4 (Plan with CompensationDAG, Artifact, ACP with pool_id, EventEnvelope v1) |
| **Pages (approx)** | 1,240 lines | ~1,800 lines | +45% |

---

## Critical Changes (C-01 to C-07) — ALL ADDRESSED

| ID | Change | Location in v1.1 | Status |
|----|--------|------------------|--------|
| **C-01** | Extract Security Layer as standalone service | §3 (Responsibilities), §4.1 (Module table), §14.1 (SecurityService gRPC), §17 (Security Architecture) | ✅ **DONE** |
| **C-02** | Decompose Conversation Engine into 5 modules | §4.1 (Module Overview), §4.2 (Module Specs), §8 (Conversation Modules) | ✅ **DONE** |
| **C-03** | Planning Engine validation, fallback, token budget, caching | §9.3 (Algorithm), §9.4 (Token Budget), §9.2 (Plan Schema with cache fields) | ✅ **DONE** |
| **C-04** | Task Orchestrator sharding | §4.1 (Overview), §10 (Task Orchestrator Sharded), §22.1 (Dependency Graph) | ✅ **DONE** |
| **C-05** | Agent Runtime warm pools with checkpoint/restore | §4.1 (Overview), §12 (Agent Runtime Pooled), §12.3 (Manifest with pool config) | ✅ **DONE** |
| **C-06** | Memory/Knowledge Coordinator gRPC contracts | §4.2 (Module Specs), §14.1 (MemoryService, KnowledgeService), §8.1 (Context Assembler) | ✅ **DONE** |
| **C-07** | Event ownership & domain boundaries | §5.2 (Topic Taxonomy with OWNER), §5.3 (EventEnvelope v1 with version) | ✅ **DONE** |

---

## High-Priority Changes (H-01 to H-12) — ALL ADDRESSED

| ID | Change | Location in v1.1 | Status |
|----|--------|------------------|--------|
| **H-01** | Configuration Management module | §4.1 (Config Manager), §18 (Config Management), §14.1 (ConfigService) | ✅ **DONE** |
| **H-02** | Provider Gateway routing specification | §4.2 (Provider Gateway), §11.2 (WASM), §14.1 (ProviderService) | ✅ **DONE** |
| **H-03** | Observability contracts | §4.1 (Observability Contracts), §19 (Observability Contracts) | ✅ **DONE** |
| **H-04** | Multi-region / DR strategy | §5.4 (Multi-Region), §20 (Multi-Region / DR), §22 (Diagrams) | ✅ **DONE** |
| **H-05** | Contract testing framework | §21 (Contract Testing Framework) | ✅ **DONE** |
| **H-06** | Agent manifest versioning & migration | §12.3 (Agent Manifest v1 with migration) | ✅ **DONE** |
| **H-07** | Idle agent cleanup / scale-to-zero | §12.2 (Lifecycle), §12.4 (Pool Management), §12.5 (Idle Cleanup) | ✅ **DONE** |
| **H-08** | Inter-module transactionality | §7.5 (Inter-Module Transactionality), §6.2 (Compensation DAG) | ✅ **DONE** |
| **H-09** | Backpressure / flow control | §11.1 (Execution Engine), §11.4 (Streaming Protocol), §10.4 (Quotas) | ✅ **DONE** |
| **H-10** | WASM supply chain security | §11.2 (WASM Sandbox), §17.3 (WASM Supply Chain Security) | ✅ **DONE** |
| **H-11** | Memory/Knowledge consistency model | §8.1 (Context Assembler with consistency params), §4.2 (Module Specs) | ✅ **DONE** |
| **H-12** | Workflow compensation deadlock prevention | §6.6 (Compensation Deadlock Prevention), §6.2 (DSL with compensation_dag) | ✅ **DONE** |

---

## Medium-Priority Changes (M-01 to M-07) — ADDRESSED

| ID | Change | Location in v1.1 | Status |
|----|--------|------------------|--------|
| **M-01** | Event schema versioning strategy | §5.2 (Topic Taxonomy), §5.3 (EventEnvelope v1 with version) | ✅ **DONE** |
| **M-02** | Conversation summarization LLM budget | §8.3 (Summarizer with 500 token budget + extractive fallback) | ✅ **DONE** |
| **M-03** | Plan caching & reuse | §9.3 (Algorithm step 12), §9.4 (Plan Cache), §9.2 (Plan Schema with fingerprint) | ✅ **DONE** |
| **M-04** | Agent health check detail | §12.3 (Manifest with details: true), §12.4 (Pool Management) | ✅ **DONE** |
| **M-05** | Tool execution determinism | §11.2 (WASM Sandbox - Determinism row) | ✅ **DONE** |
| **M-06** | HITL approval UX contract | §15.2 (HITL Flow), §6.2 (DSL with approval_payload_schema) | ✅ **DONE** |
| **M-07** | Artifact lifecycle management | §11.5 (Artifact Lifecycle Management) | ✅ **DONE** |

---

## Low-Priority Changes (L-01 to L-05) — ADDRESSED

| ID | Change | Location in v1.1 | Status |
|----|--------|------------------|--------|
| **L-01** | Workflow visual debugger diagram | §22.3 (Workflow State Machine with Compensation) | ✅ **DONE** |
| **L-02** | State Manager architecture diagram | §22.2 (State Manager Architecture Diagram) | ✅ **DONE** |
| **L-03** | Capacity planning formulas | §17.3 (Capacity Planning - retained from v1.0) | ✅ **RETAINED** |
| **L-04** | OpenAPI/AsyncAPI specs | §21 (Contract Testing - generates from Protobuf) | ✅ **ADDRESSED** |
| **L-05** | Glossary | §26 (Glossary) | ✅ **DONE** |

---

## Architectural Risks (ARCH-001 to ARCH-010) — MITIGATED

| Risk | Mitigation in v1.1 |
|------|-------------------|
| **ARCH-001**: Event Bus as distributed monolith | Domain event ownership (§5.2), consumer-driven contracts (§5.2), versioned topics (§5.3) |
| **ARCH-002**: Planning Engine LLM unbounded | Hard token budget (§9.4), deterministic validator (§9.3), fallback planner (§9.3), plan cache (§9.4) |
| **ARCH-003**: Task Orchestrator single leader bottleneck | Sharded architecture (§10.1), 64 shards, global coordinator |
| **ARCH-004**: Agent cold-start latency | Warm pools (§12.1), checkpoint/restore (§12.4), min_instances kept warm |
| **ARCH-005**: Security Layer as interceptor cannot enforce | Extracted as Security Service (RFC-0007) (§17), gRPC API with OPA/Cedar |
| **ARCH-006**: State Manager single writer bottleneck | Partitioned event store (§7.2), 64 partitions, single writer per partition |
| **ARCH-007**: Workflow compensation deadlocks | Pre-computed compensation DAG (§6.2), acyclic validation (§6.6), max depth 10 |
| **ARCH-008**: WASM sandbox escape / supply chain | Sigstore signing (§11.2, §17.3), admission control (§11.2), seccomp (§17.3), vulnerability scanning |
| **ARCH-009**: Memory/Knowledge consistency violations | Explicit consistency params in Context Assembler (§8.1), event-driven invalidation (§4.2) |
| **ARCH-010**: No backpressure / flow control | NATS MaxAckPending (§11.1, §11.4), queue depth metrics, HPA integration (§11.1) |

---

## New Sections Added in v1.1

| Section | Title | Purpose |
|---------|-------|---------|
| §4.1 | Module Overview (Updated) | 18 modules with ASCII architecture diagram |
| §8 | Conversation Modules | Decomposed Context Assembler, History Manager, Summarizer, Intent Router, Response Coordinator |
| §10 | Task Orchestrator (Sharded) | Sharded architecture, scheduling algorithm, global coordinator |
| §12 | Agent Runtime (Warm Pools) | Pool-based architecture, lifecycle, manifest with pool config, checkpoint/restore |
| §17 | Security Architecture | Security Service interface, capability tokens, WASM supply chain security |
| §18 | Configuration Management | Config Manager module, schema, feature flags, secrets, hot-reload |
| §19 | Observability Contracts | OTel span attributes, Prometheus metrics, JSON logs, trace sampling |
| §20 | Multi-Region / Disaster Recovery | NATS supercluster, PostgreSQL replicas, data residency, DR runbook |
| §21 | Contract Testing Framework | Pact for gRPC, Schemathesis for NATS, CI gates |
| §22 | Architecture Diagrams (Updated) | Dependency graph, State Manager, Workflow with compensation, NATS supercluster |
| §23 | Acceptance Criteria (Updated) | 50+ checkboxes across 5 categories |
| §24 | Open Questions (Resolved) | 7 ADRs with decisions |
| §26 | Glossary | 14 key terms defined |

---

## Sections Significantly Updated

| Section | Key Updates |
|---------|-------------|
| §3 | Added Security Enforcement, Observability Emission, Configuration Management to responsibilities |
| §4.1 | Complete rewrite: 18 modules, ASCII diagram, event ownership |
| §4.2 | Module specification table with Owned/Consumed events for all 18 modules |
| §5.2 | Topic taxonomy with OWNER annotations, config.* namespace |
| §5.3 | EventEnvelope v1 with version field |
| §5.4 | Added Versioning and Multi-Region guarantees |
| §6.2 | DSL v1 with compensation_dag, idempotency_key, approval_payload_schema |
| §6.6 | New: Compensation Deadlock Prevention (H-12) |
| §7.2 | Event store partitioned by correlation_id hash |
| §7.5 | New: Inter-Module Transactionality (H-08) |
| §9.2 | Plan schema with compensation_dag, intent_fingerprint, from_cache |
| §9.3 | Planning algorithm with deterministic validation, fallback, cache check |
| §9.4 | New: Token Budget & Cost Control (C-03) |
| §11.2 | WASM sandbox with supply chain security (H-10) |
| §11.3 | Execution envelope with Artifact message |
| §11.4 | Streaming protocol with backpressure |
| §11.5 | New: Artifact Lifecycle Management (M-07) |
| §12.2 | Updated agent lifecycle with SCALE-TO-0 |
| §12.3 | Agent manifest v1 with pool config, capability_versions, migration |
| §12.4 | Pool management table |
| §12.5 | New: Idle Agent Cleanup (H-07) |
| §13.3 | ACP envelope v1 with pool_id, version in metadata |
| §14.1 | Updated gRPC services for all 18 modules |
| §15.1 | Complete request lifecycle with 5 conversation modules |
| §15.2 | HITL flow with ApprovalPayload.v1 schema reference |
| §16.3 | Added Security Service circuit breaker |

---

## Breaking Changes from v1.0

| Area | v1.0 | v1.1 | Migration |
|------|------|------|-----------|
| **Conversation Engine** | Single module | 5 modules | Update event consumers to new topics |
| **Task Orchestrator** | Single leader | 64 shards | Add shard routing logic |
| **Agent Runtime** | Per-instance process | Warm pools | Update agent manifests with pool config |
| **Event Topics** | No ownership | Domain ownership | Assign owners; update CI for contract checks |
| **Event Envelope** | No version | `v1.` prefix | Update producers/consumers |
| **Plan Schema** | No compensation DAG, cache | Added compensation_dag, intent_fingerprint, from_cache | Update Planning Engine consumers |
| **Security** | Interceptor module | Standalone Security Service | Update all AuthZ calls to gRPC |
| **ACP Envelope** | No pool_id, version | Added pool_id, version in metadata | Update agent implementations |

---

## Files Modified

| File | Description |
|------|-------------|
| `RFC-0002-Hermes-Core-Architecture-v1.1.md` | Complete revised RFC (this document) |
| `RFC-0002-Architectural-Review.md` | Principal Architect Review (source of changes) |
| `RFC-0002-Hermes-Core-Architecture.md` | Original v1.0 (archived) |

---

## Approval Status

| Gate | Status | Notes |
|------|--------|-------|
| Chief System Architect | **Pending** | This document |
| Security Architect | **Pending** | §17, §11.2, §17.3 |
| Platform Engineer | **Pending** | §10, §12, §20, §7 |
| Agent Framework Lead | **Pending** | §12, §13, §4.2 |
| Data Architect | **Pending** | §7, §5, §20 |

---

**Next Step:** Review gates → Resolve any remaining concerns → **Approve RFC-0002 v1.1** → Begin Phase 1 Implementation