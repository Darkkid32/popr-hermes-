# RFC-0002: Hermes Core Architecture — Principal Architect Review

**Reviewer:** Principal Software Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Status:** Draft  
**Depends On:** RFC-0001 (Foundation Architecture)

---

## 1. Executive Summary

RFC-0002 is a **substantial, well-structured architectural specification** that translates the vision of RFC-0001 into a concrete, implementable core architecture. It demonstrates strong architectural thinking across event-driven design, saga-based workflows, agent communication, and state management.

**Overall Assessment:** **Approve with Changes** — The architecture is fundamentally sound but has 7 Critical and 12 High-priority issues that must be resolved before implementation begins. These are primarily around coupling boundaries, missing specifications, security gaps, and operational concerns.

**Readiness for Implementation:** ~80% — Core structure excellent; details need hardening.

---

## 2. Strengths

| Area | Strength | Evidence |
|------|----------|----------|
| **Event-Driven Foundation** | Event Bus as central nervous system; NATS JetStream well-chosen for Phase 1–3 | §5: Topic taxonomy (40+ topics), Protobuf envelope, exactly-once, DLQ, schema registry |
| **Saga-Based Workflow Engine** | Proper compensation, checkpointing, HITL as first-class, idempotency keys | §6: DSL, state machine, checkpoint triggers, retry/compensation policies |
| **State Manager (Event Sourcing)** | Clean separation: event store, snapshots, projections; PostgreSQL + NATS dual write | §7: Schema, indexing, retention, 5 materialized views |
| **Agent Communication Protocol (ACP)** | Decoupled, observable, secure, 5 patterns, capability registry, mTLS | §13: Envelope, patterns, registry, security |
| **WASM Sandbox Specification** | Concrete: Wasmtime, WASI 0.2, capability tokens, virtual FS, resource limits | §11.2: Runtime, capabilities, tokens, filesystem, network, limits |
| **Module Decomposition** | 12 modules with clear responsibilities, event contracts, consumed/emitted tables | §4.1: Module specification table |
| **Request Lifecycle** | Complete end-to-end flow with all component interactions | §15.1: Sequence from Gateway → Conversation → Planning → Workflow → Tasks → Agents → Execution → Memory → Response |
| **Scalability Targets** | Concrete P99 targets, horizontal scaling strategies, capacity planning (1x/10x/100x) | §17: Tables for each component, metrics, resources |
| **Architecture Diagrams** | 3 Mermaid diagrams: dependency graph, sequence, ACP topology | §18: Renderable, accurate |
| **Cross-RFC Alignment** | Explicit interfaces to RFC-0004/0005/0006/0007/0008/0009 | §19.4: Consistency checklist |
| **Open Questions** | 7 well-scoped decisions identified with impact and timeline | §20: NATS vs Kafka, Wasmtime vs Wasmer, etc. |

---

## 3. Weaknesses

| Area | Weakness | Impact |
|------|----------|--------|
| **Module Coupling via Shared Event Bus** | All 12 modules read/write same NATS cluster — no domain boundaries, risk of event schema conflicts, tight temporal coupling | High — creates distributed monolith |
| **Conversation Engine as God Module** | Owns context assembly, history, summarization, intent delegation, response streaming, memory coordination — too many responsibilities | High — violates SRP; hard to scale/test |
| **Planning Engine LLM Dependency** | Step 1 "Parse intent → structured goal (LLM with structured output)" — no fallback, no validation schema, no cost control | Critical — planning becomes unbounded LLM call |
| **Task Orchestrator Single Leader** | "Single leader (election via NATS)" — creates bottleneck, failover latency, no multi-region | High — limits horizontal scaling |
| **Agent Runtime Process Model** | "One process per agent instance" — no pooling, no cold-start mitigation, no shared context across tasks | High — resource overhead, latency |
| **Security Layer as Interceptor Only** | "All mutating operations (interceptor)" — no detail on policy engine, token format, revocation, audit storage | Critical — security is cross-cutting, not a module |
| **Memory/Knowledge Coordination Underspecified** | Just event names; no API contracts, no consistency model, no cache invalidation | High — RFC-0005/0006 dependencies undefined |
| **Provider Gateway Routing Logic** | "Model routing (cost/latency/capability)" — no algorithm, no fallback semantics, no streaming coordination | Medium — core to cost/latency |
| **No Configuration Management** | No config schema, no hot-reload strategy, no feature flags, no secrets integration | Medium — operational gap |
| **No Multi-Region / DR Strategy** | Single NATS cluster, single PostgreSQL — no geo-replication, no failover plan | High — enterprise requirement |
| **Observability Emission Underspecified** | "Emit structured traces (OTel), metrics, logs, audit events" — no schema, no sampling, no correlation | Medium — critical for operations |
| **Testing Strategy Absent** | No contract testing, no chaos engineering, no integration test architecture | Medium — quality risk |

---

## 4. Missing Components

| # | Missing Component | Required By | Reason |
|---|-------------------|-------------|--------|
| 1 | **Domain Event Boundaries / Event Ownership** | §4, §5 | Each module must own its event namespace; consumers subscribe, not poll |
| 2 | **Conversation Engine Decomposition** | §8 | Split into: Context Assembler, History Manager, Summarizer, Intent Router, Response Coordinator |
| 3 | **Planning Engine Validation & Fallback** | §9 | Structured output schema, deterministic validator, non-LLM fallback planner |
| 4 | **Task Orchestrator Sharding** | §10 | Partition by conversation_id; leader per shard; global coordinator for cross-shard |
| 5 | **Agent Process Pooling** | §12 | Warm pool per agent type; task assignment to pooled instance; checkpoint/restore |
| 6 | **Security Layer Specification** | §4.1, §13.6, §16 | OPA/Cedar policy engine, capability token format (JWT + SPIFFE), revocation, audit schema |
| 7 | **Memory/Knowledge Coordinator Contracts** | §4.1 | gRPC service definitions with request/response schemas, consistency SLAs |
| 8 | **Provider Gateway Routing Specification** | §4.1 | Cost model, latency SLA, fallback chain definition, streaming coordination |
| 9 | **Configuration & Feature Flag System** | All | Central config (etcd/Consul), schema validation, hot-reload, secrets (Vault) |
| 10 | **Multi-Region / Disaster Recovery** | §17 | NATS supercluster, PostgreSQL streaming replica, RTO/RPO targets |
| 11 | **Observability Schema & Sampling** | §3, §16 | OTel span attributes, metric names, log format, trace sampling (head/tail) |
| 12 | **Contract Testing Framework** | §19 | Pact/Schemathesis for gRPC + NATS event schemas; CI integration |
| 13 | **Agent Manifest Versioning & Migration** | §12.3 | Schema evolution rules, backward compatibility, rollout strategy |
| 14 | **Idle Agent Cleanup / Resource Reclamation** | §12.2 | TTL for IDLE agents, scale-to-zero, checkpoint retention policy |
| 15 | **Inter-Module Transactionality** | §7, §14 | Saga compensation across module boundaries; distributed transaction handling |

---

## 5. Architectural Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| **ARCH-001** | **Event Bus becomes distributed monolith** — all modules couple through shared topics; schema changes cascade | High | Critical | Enforce domain event ownership; consumer-driven contracts; versioned topics |
| **ARCH-002** | **Planning Engine LLM calls become unbounded cost/latency** — no token budget, no fallback, no caching | High | Critical | Hard token limits; deterministic validator; cached plan templates; non-LLM fallback |
| **ARCH-003** | **Task Orchestrator single leader bottleneck** — limits throughput, failover latency > 30s | Medium | High | Shard by conversation_id; leader per shard; async replication |
| **ARCH-004** | **Agent cold-start latency** — process spawn + model load + context restore = 5–30s per task | High | High | Warm pools; checkpoint restore; shared model server (vLLM/TGI) |
| **ARCH-005** | **Security Layer as interceptor cannot enforce policy** — no policy engine, no audit query API | High | Critical | Extract Security Layer as standalone service with gRPC + event API |
| **ARCH-006** | **State Manager single writer (PostgreSQL) becomes bottleneck** — 100K events/sec sustained | Medium | High | Partition event store by correlation_id; async projection updates |
| **ARCH-007** | **Workflow Engine compensation deadlocks** — circular dependencies, partial compensation, no timeout enforcement | Medium | High | DAG validation at plan time; compensation DAG pre-computed; global timeout |
| **ARCH-008** | **WASM sandbox escape / supply chain** — malicious plugin, capability token forgery | Low | Critical | Sigstore signing; capability token short TTL; seccomp profile; admission control |
| **ARCH-009** | **Memory/Knowledge consistency violations** — stale reads, lost updates, no cache invalidation | Medium | High | Event-driven cache invalidation; read-your-writes consistency for working memory |
| **ARCH-010** | **No backpressure / flow control** — burst traffic overwhelms Execution Engine, Agent Runtime | High | High | NATS consumer flow control; queue depth metrics; auto-scale triggers |

---

## 6. Recommendations

### 6.1 Structural Changes (Do Before Approval)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 1 | **Extract Security Layer as standalone service** — not an interceptor module. Define gRPC API: `Authorize`, `IssueToken`, `RevokeToken`, `AuditQuery`. Security events emitted to `audit.*` topics. | Critical | Medium |
| 2 | **Decompose Conversation Engine** into 5 focused modules: `ContextAssembler`, `HistoryManager`, `Summarizer`, `IntentRouter`, `ResponseCoordinator`. Each with single responsibility. | Critical | Medium |
| 3 | **Define Planning Engine contracts**: Input (Intent + Context), Output (Plan), Validator (deterministic), Fallback (template-based). Hard token budget per plan. | Critical | Low |
| 4 | **Shard Task Orchestrator** by `conversation_id` hash. Each shard has leader + followers. Global coordinator for cross-shard dependencies. | High | Medium |
| 5 | **Implement Agent Warm Pools**: Pre-spawn N instances per agent type. Task assignment = route to pooled instance. Checkpoint/restore for context. Scale-to-zero after TTL. | High | Medium |
| 6 | **Define Memory/Knowledge Coordinator gRPC contracts** (RFC-0005/0006 interfaces) — request/response schemas, consistency levels, error codes. | High | Low |
| 7 | **Add Configuration Management module** — central config (etcd), schema validation, feature flags, secrets (Vault), hot-reload via NATS `system.config.updated`. | High | Low |
| 8 | **Specify Observability contracts** — OTel span attributes per module, metric names (Prometheus), log format (JSON), trace sampling (10% + error tail). | High | Low |

### 6.2 Design Improvements (Post-Approval, Pre-Implementation)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 9 | **Event Ownership Registry** — each module declares owned event types; consumers subscribe via contracts; breaking changes require consumer approval. | Medium | Low |
| 10 | **Provider Gateway Routing Algorithm** — weighted scoring (cost, latency, capability, availability); fallback chain with circuit breaker; streaming coordination. | Medium | Medium |
| 11 | **Multi-Region Architecture** — NATS supercluster (leaf nodes), PostgreSQL streaming replicas, RTO < 5min, RPO < 1min. | Medium | High |
| 12 | **Contract Testing Infrastructure** — Pact for gRPC, Schemathesis for NATS event schemas; CI gate on schema compatibility. | Medium | Medium |
| 13 | **Agent Manifest Versioning** — semver for capabilities; migration scripts; canary rollout; rollback procedure. | Medium | Low |
| 14 | **Backpressure Design** — NATS consumer `MaxAckPending`, queue depth metrics, auto-scale HPA rules, circuit breaker integration. | Medium | Low |
| 15 | **Workflow Compensation DAG** — pre-compute at plan time; validate acyclic; timeout per step; operator escalation on deadlock. | Medium | Low |

---

## 7. Required Changes Before Approval

### Critical (Must Fix — Blockers)

| # | Change | Location | Description |
|---|--------|----------|-------------|
| **C-01** | **Extract Security Layer** | §4.1, §13.6, §16 | Security Layer cannot be an "interceptor module." Define as standalone service with gRPC API, policy engine (OPA/Cedar), capability token format (JWT + SPIFFE), revocation, audit query API. All modules call Security Service; events emitted to `audit.*`. |
| **C-02** | **Decompose Conversation Engine** | §4, §8 | Split into 5 modules: `ContextAssembler`, `HistoryManager`, `Summarizer`, `IntentRouter`, `ResponseCoordinator`. Update module table, event contracts, dependency graph. |
| **C-03** | **Planning Engine Validation & Fallback** | §9.3 | Add: Structured output schema (JSON Schema), deterministic validator (no LLM), token budget enforcement (hard limit), non-LLM fallback planner (template-based), plan caching. |
| **C-04** | **Task Orchestrator Sharding** | §10.1, §17.1 | Replace "single leader" with sharded architecture: partition by `conversation_id`, leader per shard, global coordinator for cross-shard. Update scaling strategy. |
| **C-05** | **Agent Warm Pool Model** | §12.2, §12.3 | Replace "one process per agent instance" with: warm pool per agent type (min/max), task routing to pooled instance, checkpoint/restore for context, scale-to-zero after configurable TTL. |
| **C-06** | **Memory/Knowledge Coordinator Contracts** | §4.1, §14.1 | Define gRPC service contracts with request/response Protobuf schemas for: `MemoryService`, `KnowledgeService`. Include consistency levels, error codes, timeouts. |
| **C-07** | **Event Ownership & Domain Boundaries** | §5.2 | Assign each topic namespace to a single owning module. Add "Owner" column to topic taxonomy. Consumers subscribe via contracts; breaking changes require approval. |

### High (Must Fix — Major Gaps)

| # | Change | Location | Description |
|---|--------|----------|-------------|
| **H-01** | **Configuration Management Module** | New §4.1 | Add `ConfigManager` module: central config (etcd), schema validation, feature flags, secrets (Vault), hot-reload via `system.config.updated`. All modules consume config events. |
| **H-02** | **Provider Gateway Routing Spec** | §4.1, §11 | Define routing algorithm: weighted scoring (cost, latency, capability, availability), fallback chain with circuit breaker, streaming coordination, cost tracking per request. |
| **H-03** | **Observability Contracts** | §3, §16 | Define: OTel span attributes per module, Prometheus metric names (with labels), JSON log format, trace sampling (head 10% + tail error 100%), correlation via `trace_id` in event metadata. |
| **H-04** | **Multi-Region / DR Strategy** | §17 | Add: NATS supercluster (leaf nodes per region), PostgreSQL streaming replicas, RTO < 5min, RPO < 1min, failover runbook, data residency per tenant. |
| **H-05** | **Contract Testing Framework** | §19 | Define: Pact for gRPC services, Schemathesis for NATS event schemas, CI gate on backward/forward compatibility, consumer-driven contract testing. |
| **H-06** | **Agent Manifest Versioning** | §12.3 | Semver for capabilities; migration scripts for breaking changes; canary rollout (10% → 50% → 100%); rollback procedure; capability deprecation policy. |
| **H-07** | **Idle Agent Cleanup** | §12.2 | TTL for IDLE state (default 5min); scale-to-zero; checkpoint retention (last 3); resource reclamation on termination. |
| **H-08** | **Inter-Module Transactionality** | §7, §14 | Saga compensation across module boundaries: distributed transaction handling, compensation DAG pre-computed, timeout enforcement, operator escalation on deadlock. |
| **H-09** | **Backpressure / Flow Control** | §11, §17 | NATS consumer `MaxAckPending` per module; queue depth metrics; HPA rules for Execution Engine / Agent Runtime; circuit breaker integration. |
| **H-10** | **WASM Supply Chain Security** | §11.2 | Sigstore signing for plugins; capability token short TTL (5min); seccomp profile; admission control for tool registration; vulnerability scanning. |
| **H-11** | **Memory/Knowledge Consistency Model** | §4.1 | Event-driven cache invalidation; read-your-writes for working memory; eventual consistency for semantic/procedural; stale-read detection. |
| **H-12** | **Workflow Compensation Deadlock Prevention** | §6.3, §6.5 | Pre-compute compensation DAG at plan time; validate acyclic; global workflow timeout; per-compensation timeout; operator escalation on failure. |

### Medium (Should Fix — Quality)

| # | Change | Location | Description |
|---|--------|----------|-------------|
| **M-01** | **Event Schema Versioning Strategy** | §5.3 | Explicit versioning in `event_type` (e.g., `v1.conversation.message.received`); migration path; compatibility matrix. |
| **M-02** | **Conversation Summarization LLM Budget** | §8.3 | Token budget for summarization; fallback to extractive summary; async summarization (non-blocking). |
| **M-03** | **Plan Caching & Reuse** | §9.4 | Cache plans by intent fingerprint; reuse for similar intents; invalidation on capability change. |
| **M-04** | **Agent Health Check Detail** | §12.3 | Health check response includes: model latency, tool availability, memory pressure, last checkpoint age. |
| **M-05** | **Tool Execution Determinism** | §11.2 | Document: no system time, no random, no network (unless capability), fixed FS layout; test harness. |
| **M-06** | **HITL Approval UX Contract** | §15.2 | Define: approval payload schema, delegation API, SLA timer events, escalation notification format. |
| **M-07** | **Artifact Lifecycle Management** | §11.1 | TTL for artifacts; garbage collection; storage tiering (hot/warm/cold); access control per workspace. |

### Low (Nice to Have)

| # | Change | Location | Description |
|---|--------|----------|-------------|
| **L-01** | **Workflow Visual Debugger** | §19.3 | Add Mermaid diagram: workflow state machine with compensation paths. |
| **L-02** | **State Manager Architecture Diagram** | §19.3 | Add diagram for §7.1 (event store, snapshots, projections, query API). |
| **L-03** | **Capacity Planning Formulas** | §17.3 | Document formulas for each resource; auto-scaling thresholds. |
| **L-04** | **OpenAPI/AsyncAPI Specs** | §14 | Generate from Protobuf; publish to registry. |
| **L-05** | **Glossary** | Appendix | Define: correlation_id, causation_id, idempotency_key, saga, HITL, ACP, WASI, etc. |

---

## 8. Approval Decision

### **Decision: APPROVE WITH CHANGES**

**Conditions for Full Approval:**

1. **All 7 Critical changes (C-01 through C-07) must be incorporated** into RFC-0002 or companion RFCs (Security, Memory, Knowledge) before implementation kickoff.

2. **All 12 High-priority changes (H-01 through H-12) must have design decisions documented** (can be in follow-up RFCs or ADRs) before Phase 1 implementation begins.

3. **Open Questions (§20) must be resolved** with Architectural Decision Records (ADRs):
   - ADR-001: NATS JetStream vs Kafka
   - ADR-002: Wasmtime vs Wasmer
   - ADR-003: gRPC vs NATS for internal RPC
   - ADR-004: Workflow partitioning strategy
   - ADR-005: Agent process model (pool vs per-task)
   - ADR-006: ACP payload serialization
   - ADR-007: Embedded vs external NATS

4. **Cross-RFC Interface Contracts** must be signed off with RFC-0005, RFC-0006, RFC-0007, RFC-0008 owners before Phase 1.

---

## 9. Next Steps

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Incorporate Critical changes (C-01..C-07) into RFC-0002 | Chief Architect | 1 week |
| 2 | Resolve 7 Open Questions via ADRs | Architecture Team | 1 week |
| 3 | Sign off interface contracts with RFC-0005/0006/0007/0008 owners | Respective Owners | 2 weeks |
| 4 | Produce Phase 1 Implementation Plan (ADR + task breakdown) | Platform Lead | 2 weeks |
| 5 | Begin prototype: Event Bus + Saga Engine + State Manager + 1 Agent | Engineering | Week 3–8 |

---

**Review Complete.** RFC-0002 has strong architectural foundations but requires the Critical and High-priority changes above before implementation can safely proceed. The event-driven saga architecture, ACP, and WASM sandbox are well-specified; the main risks are coupling boundaries, security model, and operational concerns.

*Principal Software Architect*  
*2026-07-24*