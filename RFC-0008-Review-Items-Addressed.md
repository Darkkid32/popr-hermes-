# RFC-0008 Review Items Addressed
# v1.0 → v1.1

**Date:** 2026-07-25  
**Author:** Chief System Architect  
**Source:** Principal Enterprise Architect Review (RFC-0008-Architectural-Review.md)

---

## Critical Items (C-01 through C-04) — ALL ADDRESSED

| ID | Review Item | Resolution | RFC-0008 v1.1 Section |
|----|-------------|------------|------------------------|
| **C-01** | No resource quota enforcement architecture | Added **Resource Quota Manager** to Control Plane (Section 4.1). Per-tenant admission control for CPU, memory, tokens, agent count. Called before SpawnAgent. Publishes quota events. | 4.1, 28, AC-031 |
| **C-02** | Checkpoint storage underspecified | Added complete **Checkpoint Storage Specification** (Section 18.3): PostgreSQL metadata + S3 payload, CRR, retention (10 checkpoints or 7 days), 100MB max, chunking, nightly GC, RPO/RTO targets. | 18.3, AC-032 |
| **C-03** | Protobuf syntax errors (`.` instead of `;`) | Fixed all 14 protobuf blocks: replaced `.` with `;` for field terminators. Validated with `protoc`. | 6.1, 10.2, 11.2-11.4, 13.2, 14.1, 15.2, 16.2, 18.2, 20.2, 23.1, 24 |
| **C-04** | ACPMessage duplicate field 12 (`headers` and `ttl_hops`) | Renumbered: `headers = 12`, `ttl_hops = 13`, `expires_at_us = 14`, `requires_ack = 15`. No wire-format impact. | 10.2 |

---

## High-Priority Items (H-01 through H-07) — ALL ADDRESSED

| ID | Review Item | Resolution | RFC-0008 v1.1 Section |
|----|-------------|------------|------------------------|
| **H-01** | ACP deduplication window too short (1h) | Extended to **24h** (configurable per tenant). Uses durable PostgreSQL `acp_message_dedup` table. | 21.2, AC-033 |
| **H-02** | No agent-to-agent backpressure | Added **CapacityReport** ACP event (every 30s). Manager throttles when `available_capacity < 0.25`. Publishes `hermes.{tenant}.agent.backpressure.{agent_type}`. | 10.5, 19.4, 21.1, AC-034 |
| **H-03** | Saga compensation only sequential | Added **CompensationScope** enum: `FULL`, `BRANCH`, `NONE`. Branch-aware compensation for parallel DAGs. Only failed branch compensated. | 15.2, 15.3, AC-035 |
| **H-04** | Planner has no re-planning capability | Added **PlanRevisionRequest/Response** ACP messages. Triggers: step failure after retries, >150% token estimate, >200% time estimate, external state change. | 11.5, AC-036 |
| **H-05** | No multi-region Runtime topology | Added **Region Coordinator** to Control Plane (Section 4.1). Per-region warm pools, async checkpoint CRR, NATS supercluster failover, data residency. | 4.1, 19.5, AC-037 |
| **H-06** | No health check protocol for agents | Added **HealthCheck** RPC (Section 24). 10s interval, 3-strike removal, replacement agent, `agent.health.failed` event. | 19.4, 24, AC-038 |
| **H-07** | Per-tenant task queue not isolated by agent type | Added **per-agent-type consumer groups** within tenant stream: `planner`, `manager`, `specialist` sub-types. Independent `max_pending`, `ack_wait`, flow control. | 12.4, AC-039 |

---

## Medium-Priority Items (Incorporated)

| ID | Review Item | Resolution | RFC-0008 v1.1 Section |
|----|-------------|------------|------------------------|
| **M-01** | In-flight agent migration policy | Added to Section 6.3: DRAIN (default, 30 min), MIGRATE, COEXIST. Version events published. | 6.3, AC-040 |
| **M-02** | Missing approval events | Added `approval.expired` and `approval.escalated` to published events table. | 25.1 |
| **M-03** | No workflow TTL | Added `ttl_seconds` to Workflow message (default 72h). Background auto-cancel + cleanup. | 14.1, AC-025 |
| **M-04** | No per-task token budget tracker | Added `token_budget` and `tokens_remaining` to ExecutionContext. Event on exhaustion. | 13.2, AC-028 |
| **M-05** | DLQ replay without idempotency | Added `ReplayTask` RPC preserving original `idempotency_key`. | 20.5, AC-027 |
| **M-06** | Tool timeout enforcement | Wasmtime fuel limit + sidecar watchdog (tool timeout + 5s grace). Kills WASM on timeout. | 22.3 |
| **M-07** | Tool execution idempotency not enforced | Each tool declares `idempotent` flag in metadata. Runtime uses for retry decisions. | 22.1, 22.2 |

---

## Low-Priority Items (Deferred — See Deferred Items Document)

| ID | Review Item | Justification |
|----|-------------|---------------|
| **L-01** | Context assembly token counting | Deferred to RFC-0010 (Observability); tokenizer per-provider is provider concern |
| **L-02** | Agent process isolation specification | Deferred to RFC-0009 (Plugin SDK); container/WASM isolation is implementation detail |
| **L-03** | Per-provider tokenizers | Deferred to provider adapter implementations; not a Runtime contract |
| **L-04** | Observability metrics specification | Deferred to RFC-0010 (Observability & Telemetry) |

---

## Cross-RFC Alignment — VERIFIED

| RFC | v1.1 Alignment |
|-----|----------------|
| RFC-0001 | Foundation architecture referenced |
| RFC-0002 v1.1 | ACP (§13), WASM sandbox (§22), Task Orchestrator 64-shard, warm pools |
| RFC-0003 v1.1 | NATS topic naming, JetStream streams, consumer groups, supercluster |
| RFC-0004 v1.1 | Provider adapters, SSE streaming |
| RFC-0005 v1.1 | 4-tier memory, SDK integration |
| RFC-0006 v1.1 | RAG search, ingestion, hybrid search |
| RFC-0007 v1.1 | SPIFFE SVID, PASETO v4 delegation, Merkle audit log |

---

## Acceptance Criteria — UPDATED

Total: **40 ACs** (30 original + 10 new for Critical/High items)

New ACs added:
- **AC-031:** Resource Quota Enforcement (C-01)
- **AC-032:** Checkpoint Storage (C-02)
- **AC-033:** ACP Deduplication Window (H-01)
- **AC-034:** Agent-to-Agent Backpressure (H-02)
- **AC-035:** Parallel Saga Compensation (H-03)
- **AC-036:** Re-planning Protocol (H-04)
- **AC-037:** Multi-Region Runtime (H-05)
- **AC-038:** Agent Health Check Protocol (H-06)
- **AC-039:** Per-Agent-Type Queue Isolation (H-07)
- **AC-040:** In-Flight Migration Policy (M-01)

---

## Approval Status

**RFC-0008 v1.1: APPROVED** — All Critical and High review items incorporated. Cross-RFC alignment verified. Ready for implementation.