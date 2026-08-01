# RFC-0008 Changelog
# v1.0 → v1.1

**Date:** 2026-07-25  
**Author:** Chief System Architect  
**Based On:** Principal Enterprise Architect Review (RFC-0008-Architectural-Review.md)

---

## Summary

RFC-0008 v1.1 incorporates all **Critical (C-01 through C-04)** and **High (H-01 through H-07)** review items from the Principal Enterprise Architect review. The revision adds resource quota enforcement, checkpoint storage specification, backpressure/capacity reporting, branch-aware saga compensation, re-planning protocol, multi-region runtime topology, health check protocol, per-agent-type queue isolation, and fixes all protobuf syntax errors.

---

## Critical Changes (C-01 through C-04)

### C-01: Resource Quota Manager (Section 4.1, 28, AC-031)
- **Added:** Resource Quota Manager component to Control Plane
- **Function:** Per-tenant admission control for CPU, memory, tokens, agent count
- **Integration:** Called before SpawnAgent; denies requests exceeding quota
- **Event:** `hermes.{tenant}.agent.quota.exceeded` published on denial
- **AC-031:** Validates quota enforcement at spawn time

### C-02: Checkpoint Storage Specification (Section 18.3)
- **Added:** Complete checkpoint storage architecture
- **Metadata Store:** PostgreSQL `agent_checkpoints` table
- **State Payload:** S3-compatible object storage (MinIO, AWS S3, GCS)
- **Path Pattern:** `hermes/checkpoints/{tenant}/{agent_type}/{agent_id}/{checkpoint_id}.zst`
- **Compression:** zstd
- **Replication:** Cross-region replication (CRR) enabled
- **Retention:** Last 10 checkpoints per agent OR 7 days, whichever is greater
- **Max Size:** 100MB per checkpoint; chunked into 50MB parts if larger
- **GC:** Nightly cron removes expired checkpoints and orphaned objects
- **RPO/RTO:** <60s / <30s p99
- **AC-032:** Validates storage specification

### C-03: Protobuf Syntax Fixes (All protobuf blocks)
- **Fixed:** All field terminators changed from `.` to `;`
- **Affected Blocks:** 14 protobuf definitions across sections 6.1, 10.2, 11.2-11.4, 13.2, 14.1, 15.2, 16.2, 18.2, 20.2, 23.1, 24
- **Validation:** All blocks now pass `protoc` syntax validation

### C-04: ACPMessage Field Numbering (Section 10.2)
- **Fixed:** Duplicate field 12 (`headers` and `ttl_hops`)
- **Renumbered:** `headers = 12`, `ttl_hops = 13`, `expires_at_us = 14`, `requires_ack = 15`
- **Impact:** No wire-format change (field numbers only affect generated code)

---

## High-Priority Changes (H-01 through H-07)

### H-01: ACP Deduplication Window Extended (Section 21.2, AC-033)
- **Changed:** Deduplication window from 1h → 24h
- **Storage:** Durable PostgreSQL table `acp_message_dedup` with message_id + timestamp
- **TTL:** 24 hours (configurable per tenant)
- **Scope:** Covers long-running workflows that may exceed 1 hour
- **AC-033:** Validates 24h window with durable storage

### H-02: Agent-to-Agent Backpressure (Section 10.5, 19.4, 21.1, AC-034)
- **Added:** `CapacityReport` ACP event type
- **Frequency:** Every 30s from Specialist to Manager
- **Payload:** `{active_agents, max_agents, queue_depth, avg_latency_ms, available_capacity}`
- **Throttling Logic:** Manager defers dispatch when `available_capacity < 0.25`
- **Event:** `hermes.{tenant}.agent.backpressure.{agent_type}` published
- **Lift Condition:** Throttling lifts when `available_capacity > 0.5`
- **AC-034:** Validates backpressure detection and throttling

### H-03: Parallel Saga Compensation (Section 15.2, 15.3, AC-035)
- **Added:** `CompensationScope` enum: `FULL` (default), `BRANCH` (parallel branches), `NONE`
- **Branch-Aware Logic:** On parallel branch failure, only the failed branch's causal chain is compensated
- **Other Branches:** Continue execution unaffected
- **Saga Coordinator:** Evaluates scope before triggering compensation
- **AC-035:** Validates branch-isolated compensation

### H-04: Re-planning Protocol (Section 11.5, AC-036)
- **Added:** `PlanRevisionRequest` / `PlanRevisionResponse` ACP messages
- **Trigger Conditions:**
  1. Step failure after all retries + compensation completed
  2. Actual token usage > 150% of estimate
  3. Actual execution time > 200% of estimate
  4. External state change detected (knowledge updated, repo changed)
- **Flow:** Manager → Planner with failed step context → Planner returns updated Plan
- **AC-036:** Validates re-planning trigger and updated plan continuation

### H-05: Multi-Region Runtime Topology (Section 19.5, AC-037)
- **Per-Region Pools:** Independent warm pools with region-local affinity
- **Region Affinity:** Tasks prefer agents in same region as their data
- **Checkpoint CRR:** Async S3 cross-region replication to alternate region
- **Failover:** NATS supercluster routes to healthy region; Region Coordinator promotes cold agents
- **Data Residency:** Agent state never leaves origin region unless failover
- **AC-037:** Validates multi-region deployment and failover behavior

### H-06: Agent Health Check Protocol (Section 19.4, AC-038)
- **Health Check RPC:** Added to gRPC API (Section 24)
- **Interval:** 10s (configurable)
- **Probe:** gRPC HealthCheck protocol
- **Failure Threshold:** 3 consecutive failures = removed from pool
- **Replacement:** New agent started if below min_warm
- **Event:** `hermes.{tenant}.agent.health.failed` published
- **AC-038:** Validates 3-strike removal and replacement

### H-07: Per-Agent-Type Queue Isolation (Section 12.4, AC-039)
- **Consumer Groups:** Each agent type gets dedicated NATS JetStream consumer group
- **Groups:** `planner`, `manager`, `specialist` (sub-types as needed)
- **Independent Flow Control:** Each group has independent `max_pending` and `ack_wait`
- **Isolation:** One agent type's backlog cannot block another's dispatch
- **AC-039:** Validates independent consumer groups with independent flow control

---

## Medium-Priority Changes (Incorporated)

### M-01: In-Flight Migration Policy (Section 6.3, AC-040)
- **Default:** DRAIN (max 30 min drain time)
- **Options:** MIGRATE (checkpoint + restart), COEXIST (indefinite)
- **Events:** `hermes.{tenant}.agent.version.deployed`, `hermes.{tenant}.agent.version.drained`

### M-02: Additional Approval Events (Section 25.1)
- **Added:** `hermes.{tenant}.agent.approval.expired`
- **Added:** `hermes.{tenant}.agent.approval.escalated`

### M-03: Workflow TTL (Section 14.1)
- **Added:** `ttl_seconds` field to Workflow message (default: 72h / 259200s)
- **Background Job:** Cancels workflows exceeding TTL; cleans up checkpoints and agent state

### M-04: Token Budget Tracker (Section 13.2)
- **Added:** `token_budget` and `tokens_remaining` to ExecutionContext
- **Decrement:** Per provider call
- **Event:** `hermes.{tenant}.agent.tokens.budget_exceeded` on exhaustion

### M-05: DLQ Replay RPC (Section 20.5, AC-027)
- **Added:** `ReplayTask` RPC preserving original `idempotency_key`
- **Request:** `original_task_id`, `idempotency_key`, `replay_reason`
- **Response:** `new_task_id`, `idempotency_key`

### M-06: Tool Timeout Enforcement (Section 22.3)
- **Mechanism:** Wasmtime fuel-based instruction limit + sidecar watchdog timer
- **Hard Timeout:** Tool timeout + 5s grace
- **On Timeout:** Kill WASM instance, return `ToolError(TIMEOUT)`, trigger checkpoint recovery

---

## Cross-RFC Alignment Verification

| RFC | v1.1 Alignment Status |
|-----|----------------------|
| RFC-0002 v1.1 | ✅ ACP, WASM sandbox, Task Orchestrator, warm pools |
| RFC-0003 v1.1 | ✅ NATS topics, JetStream task queues, JetStream consumer groups |
| RFC-0004 v1.1 | ✅ Provider adapters, SSE streaming |
| RFC-0005 v1.1 | ✅ 4-tier memory hierarchy, SDK methods |
| RFC-0006 v1.1 | ✅ RAG search, ingestion, hybrid search |
| RFC-0007 v1.1 | ✅ SPIFFE SVID, PASETO v4 delegation, Merkle audit log |

---

## Files Modified

1. `RFC-0008-Hermes-Agent-Runtime-Orchestration-Architecture-v1.1.md` — Canonical specification
2. `RFC-0008-Review-Items-Addressed.md` — Detailed mapping of review items to changes
3. `RFC-0008-Deferred-Items.md` — Items not incorporated (with justification)
4. `RFC-0008-Acceptance-Criteria-v1.1.md` — Complete AC list (40 criteria)
5. `RFC-0008-Architectural-Review.md` — Original review (reference)

---

## Approval Status

**RFC-0008 v1.1: APPROVED** — All Critical and High review items incorporated. Ready for implementation phase.