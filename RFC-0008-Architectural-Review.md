# RFC-0008 — Architectural Review
# Hermes Agent Runtime & Orchestration Architecture

**Reviewer:** Principal Enterprise Architect  
**Date:** 2026-07-25  
**RFC:** RFC-0008 v1.0 — Hermes Agent Runtime & Orchestration Architecture  
**Review Type:** Full Architectural Review  
**Cross-Referenced:** RFC-0001, RFC-0002 v1.1, RFC-0003 v1.1, RFC-0004 v1.1, RFC-0005 v1.1, RFC-0006 v1.1, RFC-0007 v1.1  

---

## 1. Executive Summary

RFC-0008 defines the Hermes Agent Runtime — the execution fabric responsible for agent lifecycle, capability enforcement, task scheduling, workflow orchestration, saga compensation, human-in-the-loop approvals, checkpoint/recovery, warm pools, and inter-agent communication via ACP. This is the most operationally critical RFC in the Hermes Agent OS v2 series: every agent execution path flows through this layer.

The RFC is **structurally comprehensive**, covering 32 sections with 30 acceptance criteria, 4 Mermaid diagrams, 14 protobuf blocks, and detailed cross-RFC integration points. The three-tier Planner → Manager → Specialist hierarchy is well-defined. The ACP protocol, capability enforcement model, and checkpoint/recovery design are strong architectural foundations.

However, the RFC has **several critical gaps** that must be addressed before approval:

1. **No resource quota enforcement mechanism** — The RFC declares per-tenant agent limits (500 concurrent) but provides no architecture for enforcing CPU/memory/token budgets at the Runtime level. Without this, a single tenant's runaway agents can starve the entire cluster.

2. **Checkpoint storage is underspecified** — The RFC describes checkpoint types and format but does not define WHERE checkpoints are stored (PostgreSQL? Object storage? How is replication handled? What is the retention policy? How are they garbage collected?).

3. **ACP message deduplication window is insufficient for long-running workflows** — The 1-hour deduplication window (section 21.2) is too short for workflows that may run for hours or days. A specialist processing a large codebase could see message IDs roll out of the window during a single task.

4. **No agent-to-agent backpressure mechanism** — The RFC defines backpressure for the Gateway (RFC-0004) but is silent on what happens when a Manager sends tasks to Specialists faster than they can process. This can cause task queue explosion and cascading failures.

5. **Saga compensation is only sequential** — The saga model supports only linear forward → reverse compensation. Real workflows with parallel branches need partial compensation (compensate failed branch only, not the entire DAG).

6. **Planner has no re-planning capability** — The Planner creates a plan once. If a specialist fails after retries, there is no mechanism for the Planner to revise the plan based on new information. This makes the system brittle for complex, exploratory tasks.

7. **No multi-region Runtime topology** — RFC-0003 specifies a NATS supercluster for multi-region, but RFC-0008 does not address how agent pools, warm pools, and checkpoint stores operate across regions. Where does agent state live? How does recovery work if a region is lost?

8. **Agent version update has no in-flight migration** — The canary rollout (section 6.3) describes percentage-based traffic shifting but does not address what happens to agents mid-task when a new version is deployed. Do they finish on the old version? Are they migrated?

**Overall Assessment:** The RFC is architecturally sound in its core design but has operational gaps that would cause production incidents if not addressed. The required changes are largely additive (new subsections, additional contract definitions) rather than structural rewrites.

**Approval Decision: APPROVED WITH CHANGES**

---

## 2. Strengths

| # | Strength | Assessment |
|---|----------|------------|
| S-01 | **Capability-first execution model** — Every agent action requires a valid PASETO v4 capability token with delegation chain verification. Integration with RFC-0007 section 11 (max_delegation_depth=3) is correctly referenced. Six enforcement points are identified (task assignment, tool invocation, memory access, knowledge access, agent spawn, network egress). | Excellent |
| S-02 | **Three-tier Planner → Manager → Specialist hierarchy** — Clear separation of concerns: Planner decomposes goals into DAGs, Manager schedules and monitors, Specialists execute domain tasks. Protobuf contracts for Plan, PlanStep, TaskAssignment, and SpecialistOutput are well-defined with proper field numbering. | Excellent |
| S-03 | **Checkpoint taxonomy** — Five checkpoint types (periodic, on-tool, on-LLM, on-complete, on-error) with differentiated RTO targets. The zstd compression + SHA256 integrity verification is a sound approach. RTO < 30s and RPO < 60s are aggressive but achievable with the proposed periodic checkpoint interval. | Strong |
| S-04 | **ACP protocol design** — Four patterns (request-response, event, stream, broadcast) with clear subject naming convention aligned to RFC-0003's `hermes.{tenant}.{domain}.{entity}.{action}` format. TTL hops (default 3) prevents infinite message loops. Capability token embedded in every ACP message and validated by receiver is correct zero-trust design. | Strong |
| S-05 | **Comprehensive event taxonomy** — 16 published events and 7 subscribed events, all following RFC-0003's topic naming convention. Every lifecycle transition, task state change, and workflow state change is published. Event payloads include sufficient metadata for consumers. | Strong |
| S-06 | **Warm pool architecture** — Four pool states (WARM, IDLE, COLD, DRAINING) with clear transitions. Scale-up/scale-down policies are trigger-based with quantified thresholds (queue depth > 2× warm_pool_size). Proactive token refresh every 15 min prevents token expiry during long idle periods. | Strong |
| S-07 | **Failure classification framework** — Five failure categories (transient, permanent, agent crash, provider error, tool error) with differentiated handling strategies. Retry policy with exponential backoff + jitter is a well-established pattern. Dead letter queue with full task context preservation enables manual replay. | Strong |
| S-08 | **Cross-RFC integration** — Explicitly references and integrates with RFC-0002 (ACP section 13, warm pools, WASM sandbox), RFC-0003 (NATS topics, JetStream task queues), RFC-0005 (4-tier memory hierarchy), RFC-0006 (knowledge search, ingestion), RFC-0007 (SPIFFE SVID, PASETO capability tokens, Merkle audit log). AC-030 validates alignment. | Strong |
| S-09 | **Tool execution contract** — WASM component model interface with metadata, validation, and execution separation. Idempotency flag per tool enables correct retry behavior. Capability check before execution is enforced by the sidecar, not the tool itself (correct — tools should not be trusted to self-enforce). | Strong |
| S-10 | **30 acceptance criteria** — Each AC follows Given/When/Then format with specific latency targets, state transitions, and verification conditions. ACs cover all major sections including lifecycle, scheduling, saga, approval, checkpoint, warm pools, failures, and cross-RFC alignment. | Strong |
| S-11 | **HITL approval model** — Three approval policies (UNANIMOUS, MAJORITY, FIRST) with delegation, escalation, and timeout handling. Multi-channel routing (Slack, Telegram, Email, Web, Teams) is practical. Auto-reject on timeout prevents workflow stalls. Audit logging of all approval decisions aligns with RFC-0007. | Strong |
| S-12 | **Context assembly strategy** — Five-tier priority order for LLM context (working memory > system prompt > knowledge > episodic > semantic) with truncation strategy. Prevents context overflow while preserving the most important information. | Good |

---

## 3. Weaknesses

| # | Weakness | Severity | Section |
|---|----------|----------|---------|
| W-01 | **No resource quota enforcement architecture** — The RFC declares per-tenant max agents (500 concurrent) and per-runtime max agents (10,000) in section 28, but there is no section describing HOW these limits are enforced. There is no tenant quota store, no admission control mechanism, no CPU/memory cgroup enforcement, and no per-tenant token budget tracker. A tenant exceeding 500 agents would need to be rejected somewhere, but the RFC does not specify where. | Critical | 4, 12, 28 |
| W-02 | **Checkpoint storage is underspecified** — Section 18 defines checkpoint types, format (protobuf), compression (zstd), and integrity (SHA256), but does not specify: (a) WHERE checkpoints are stored (PostgreSQL? S3? Local disk?), (b) replication factor, (c) retention policy (how long are old checkpoints kept?), (d) garbage collection mechanism, (e) maximum checkpoint size limits, (f) what happens when checkpoint storage is full. Without this, the checkpoint system is not implementable. | Critical | 18 |
| W-03 | **ACP deduplication window too short** — Section 21.2 specifies a 1-hour message ID tracking window for deduplication. For long-running workflows (hours or days), NATS JetStream redelivery could produce a message ID that has already rolled out of the tracking window, causing duplicate processing. The window should be configurable per-tenant and defaulted to at least the maximum workflow TTL. | High | 21.2 |
| W-04 | **No agent-to-agent backpressure** — The Task Scheduler (section 12) dispatches tasks to warm pools, but there is no mechanism for a Specialist to signal to its Manager that it is overloaded. If a Manager dispatches 10 tasks to a 5-agent warm pool, the tasks queue but the Manager has no visibility into queue depth at the specialist level. This can cause head-of-line blocking and unfair task distribution. | High | 12, 21 |
| W-05 | **Saga compensation is sequential only** — Section 15 describes a linear forward → reverse compensation model. But workflows with parallel branches (section 14.2) need partial compensation: if branch B fails, only branch B's steps should be compensated, not branch A's already-completed steps. The RFC does not address this. | High | 15 |
| W-06 | **Planner has no re-planning capability** — The Planner (section 11.2) creates a Plan once. If a Specialist fails after all retries and compensation, there is no mechanism for the Manager to request a revised Plan from the Planner. The RFC mentions `ACP: plan.update` in the hierarchy diagram but does not define a re-planning protocol or when it should be triggered. | High | 11 |
| W-07 | **No multi-region Runtime topology** — Section 28 mentions "horizontal scale" but the RFC does not address: (a) how agent pools span multiple regions, (b) where checkpoint state is stored for cross-region recovery, (c) how warm pools are managed per-region, (d) whether ACP messages cross region boundaries, (e) data residency for agent state. RFC-0003 specifies a NATS supercluster but RFC-0008 does not build on it. | High | 4, 19, 28 |
| W-08 | **Agent version update lacks in-flight migration strategy** — Section 6.3 describes canary rollout (5% → 25% → 100%) with health gates and rollback. But it does not specify what happens to agents actively executing tasks when a new version is deployed: Do they finish on the old version? Are they terminated and recovered from checkpoint on the new version? Is there a drain period? This ambiguity could cause task failures during version updates. | Medium | 6.3 |
| W-09 | **Protobuf syntax errors** — Multiple protobuf blocks use `.` (period) instead of `;` (semicolon) as field terminators. While this is a common artifact of code generation, it would fail validation by `protoc` and must be corrected before the RFC is considered canonical. | Medium | 6.1, 10.2, 11.2-11.4, 13.2, 14.1, 15.2, 16.2, 18.2, 20.2, 23.1, 24 |
| W-10 | **ACPMessage has duplicate field numbers** — In section 10.2, `headers` is field 12 and `ttl_hops` is also field 12. In section 24, multiple gRPC method return statements use `.` instead of `;`. These are protocol-level errors that would cause compilation failures. | Critical | 10.2, 24 |
| W-11 | **Approval timeout not published as event** — Section 25.1 publishes approval.created and approval.resolved events, but there is no approval.expired or approval.escalated event. The Gateway's auto-reject on timeout (section 16.3) and escalation (AC-026) should produce events for audit and monitoring. | Medium | 16, 25 |
| W-12 | **No tool execution timeout enforcement at Runtime level** — Section 22.2 specifies per-tool timeouts (e.g., code.execute = 120s), but the RFC does not describe how the Runtime enforces this timeout. WASM execution timeouts are easy (Wasmtime supports fuel/timeout), but the sidecar needs a mechanism to kill a tool execution that exceeds its timeout. | Medium | 22 |
| W-13 | **Context assembly does not specify token counting** — Section 27.3 says "total context does not exceed provider max_tokens" but does not specify how tokens are counted. Different providers have different tokenizers. The Runtime needs a per-provider tokenizer or a conservative byte-count fallback. | Low | 27.3 |
| W-14 | **No health check protocol for agents** — The warm pool section (19) mentions health checks in the metrics table and AC-024 describes 3-strike failure, but there is no health check RPC or heartbeat protocol defined in the gRPC API (section 24). How does the Runtime know an agent is alive? What is the heartbeat interval? What constitutes a health check failure? | Medium | 19, 24 |
| W-15 | **No per-tenant task queue isolation** — Section 12.4 defines a single NATS JetStream stream per tenant (`hermes.{tenant}.tasks`), but within that stream, all agent types share the same queue. If code-specialist tasks flood the queue, they can starve research-specialist tasks. Per-agent-type sub-streams or consumer groups with independent quotas are needed. | Medium | 12.4 |

---

## 4. Missing Components

| # | Missing Component | Impact |
|---|-------------------|--------|
| M-01 | **Resource Quota Manager** — A component that tracks per-tenant CPU, memory, token, and agent count usage. Enforces hard limits. Rejects spawn requests that would exceed quota. Publishes `hermes.{tenant}.agent.quota.exceeded` events. Integrates with the Task Scheduler as an admission controller. | Critical |
| M-02 | **Checkpoint Storage Specification** — Define storage backend (PostgreSQL tables with `agent_checkpoints` schema, or S3-compatible object storage with metadata in PG), replication strategy, retention policy (keep last N checkpoints per agent, or checkpoint age < 7 days), garbage collection cron job, and maximum checkpoint size (reject if > 100MB, use chunked storage for larger). | Critical |
| M-03 | **Agent Health Check Protocol** — Define a `HealthCheck` RPC or a NATS heartbeat subject. Specify: heartbeat interval (default 10s), health check probe (gRPC HealthCheck protocol or custom), 3-strike failure rule (3 consecutive failed checks → agent removed from pool), and recovery from transient health check failure (retry before removal). | High |
| M-04 | **Re-planning Protocol** — Define the Manager → Planner re-planning flow: when to trigger (step failure after all retries + compensation, or when Plan estimates are exceeded by > 50%), the ACP message format (`plan.revise`), what context is passed (failed step, error, partial results), and the Planner's revision responsibility (update remaining steps only, do not restart completed steps). | High |
| M-05 | **Agent-to-Agent Backpressure Signal** — Define a mechanism for Specialists to communicate queue depth and processing capacity to their Manager. Options: (a) ACP `capacity.report` event published periodically, (b) Manager polls specialist queue depth via gRPC, (c) NATS JetStream consumer info as a proxy for queue depth. Manager should throttle dispatch when specialist queue > threshold. | High |
| M-06 | **Multi-Region Agent Topology** — Define how agent pools, warm pools, and checkpoints operate across regions. Reference RFC-0003 section 18 (NATS supercluster). Specify: per-region warm pools, cross-region checkpoint replication (async, eventual consistency), region-affinity for task dispatch (prefer local region agents), and failover procedure when a region is lost (re-assign tasks to alternate region from replicated checkpoints). | High |
| M-07 | **Parallel Saga Compensation** — Extend the CompensationAction model to support parallel branch compensation. Define: partial compensation scope (only compensate steps in the failed branch, not the entire workflow), compensation DAG (not just reverse order), and a `CompensationScope` field indicating which branch to compensate. | High |
| M-08 | **In-Flight Agent Migration Policy** — Define behavior when a new agent version is deployed during active execution. Options: (a) drain (in-flight agents finish on old version, new tasks go to new version), (b) migrate (checkpoint + restart on new version), (c) coexist (both versions run until old version drains). Default should be drain with configurable max drain time. | Medium |
| M-09 | **DLQ Replay Protocol** — AC-027 says "the task can be manually replayed after issue resolution" but does not define the replay API. Need: a `ReplayTask` RPC, idempotency handling (replayed task gets new task_id but same idempotency_key), and a `replay.reason` field for audit. | Medium |
| M-10 | **Per-Agent-Type Task Queue Isolation** — Within each tenant's task stream, define per-agent-type consumer groups with independent max-pending limits. Code-specialist queue and research-specialist queue should have separate flow control. | Medium |
| M-11 | **Approval Expired and Escalated Events** — Add `hermes.{tenant}.agent.approval.expired` and `hermes.{tenant}.agent.approval.escalated` to the published events table. | Low |
| M-12 | **Token Budget Tracker** — A per-task and per-tenant token budget tracker that aggregates tokens across provider calls, tool calls, and context assembly. Publishes `hermes.{tenant}.agent.tokens.budget_exceeded` when limits are hit. Forces workflow to pause or fail when budget is exhausted. | Medium |
| M-13 | **Workflow TTL and Auto-Cleanup** — No maximum workflow lifetime is defined. A workflow stuck in PAUSED or waiting for approval indefinitely consumes resources. Need: configurable workflow TTL (default 72h), auto-cancel on TTL expiry, cleanup of workflow state and associated agent checkpoints. | Medium |
| M-14 | **Agent Process Isolation Specification** — The RFC mentions WASM sandbox for tools but does not specify how the agent process itself is isolated. If agents run as container processes, what runtime is used (containerd, Docker)? If WASM, what boundaries exist between agent core and tool executor? Are memory limits enforced via cgroups? | Low |

---

## 5. Architectural Risks

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| R-01 | **Resource starvation from unbounded tenant agents** — Without a Resource Quota Manager, a single tenant spawning 1000+ agents with high token usage can exhaust cluster CPU/memory, causing all other tenants' agents to fail or stall. | High | Critical | Implement M-01 (Resource Quota Manager) with hard limits and admission control before any agent spawn is allowed. |
| R-02 | **Checkpoint storage exhaustion** — Without a defined storage backend, retention policy, and GC mechanism, checkpoints accumulate indefinitely. At 500 agents × 60s interval × 100KB average checkpoint = 5MB/min/agent = 2.5GB/min across 500 agents. This will fill any storage system within days. | High | Critical | Implement M-02 (Checkpoint Storage Specification) with retention policy, GC, and storage quotas. |
| R-03 | **Duplicate task execution from short dedup window** — ACP deduplication window of 1 hour is insufficient for multi-hour workflows. NATS JetStream redelivery after 1h+ would produce a message that the dedup tracker no longer recognizes, causing a task to be re-executed. This violates the "exactly-once step execution" guarantee (section 14.3). | Medium | High | Make dedup window configurable per-tenant, default to max(workflow_ttl, 24h). Use durable dedup table in PostgreSQL, not in-memory. |
| R-04 | **Cascading failure from no backpressure** — A Manager dispatching tasks to a saturated Specialist pool causes task queue growth. As the queue grows, NATS JetStream may hit max_messages (1M) or max_bytes (10GB), causing publish failures that cascade to the Workflow Orchestrator and eventually the Planner. | Medium | High | Implement M-05 (Agent-to-Agent Backpressure Signal). Manager must check specialist capacity before dispatch. |
| R-05 | **Incomplete saga compensation for parallel workflows** — Linear compensation on a parallel-branch workflow compensates steps that were part of a successful branch, potentially undoing valid work or causing data inconsistency. | Medium | High | Implement M-07 (Parallel Saga Compensation). Only compensate steps in the failed branch's causal chain. |
| R-06 | **Stale plan execution from no re-planning** — A Plan created at T=0 may be invalid by T=30min if external conditions change (repo updated, API changed, knowledge updated). Executing a stale plan wastes tokens and may produce incorrect results. | Medium | Medium | Implement M-04 (Re-planning Protocol). Trigger re-planning on step failure, estimate overshoot, or external state change. |
| R-07 | **Cross-region recovery gap** — If an agent fails in Region A and needs to recover from a checkpoint, but checkpoints are local to Region A (not replicated), the agent cannot recover in Region B during a regional outage. | Low | Critical | Implement M-06 (Multi-Region Agent Topology) with async checkpoint replication. |
| R-08 | **Version update task loss** — If a new agent version is deployed without a defined in-flight strategy, agents mid-task may be killed, losing unsaved state. Recovery from checkpoint may apply old-version state to new-version code, causing incompatibility. | Medium | Medium | Implement M-08 (In-Flight Agent Migration Policy) with drain-by-default. |
| R-09 | **No health check causes zombie agents** — Without a defined heartbeat protocol, an agent process that has hung (not crashed, but not processing) remains in the warm pool indefinitely. Tasks assigned to it appear as in-progress but never complete. | Medium | High | Implement M-03 (Agent Health Check Protocol) with 3-strike removal. |
| R-10 | **Protobuf compilation failure** — Field terminator errors (`.` instead of `;`) and duplicate field numbers will prevent code generation, blocking implementation. | High | High | Fix all protobuf syntax errors before implementation. |
| R-11 | **Approval stalls with no TTL** — Workflows waiting for human approval can wait indefinitely. If the approver is unavailable and no secondary approver is configured, the workflow sits in PAUSED state consuming warm pool resources. | Medium | Medium | Add workflow TTL (M-13) and approval escalation to all approval requests. |
| R-12 | **Dead letter queue replay without idempotency risk** — Replaying a task from DLQ without proper idempotency key handling could cause duplicate side effects (double API calls, double file writes). | Low | Medium | Ensure DLQ replay preserves original idempotency_key (M-09). |

---

## 6. Recommendations

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| REC-01 | Add a Resource Quota Manager component to the Control Plane (section 4.1). Define per-tenant quotas for: max concurrent agents, max CPU, max memory, max tokens/hour, max tool calls/hour. Implement as admission controller before SpawnAgent. Publish quota events. | Critical | Medium |
| REC-02 | Add a Checkpoint Storage subsection (18.3) specifying: storage backend (PostgreSQL `agent_checkpoints` table for metadata + S3-compatible for serialized state), retention (last 10 per agent, or < 7 days), GC (nightly cron), max size (100MB, chunk if larger), replication (S3 cross-region if multi-region). | Critical | Medium |
| REC-03 | Increase ACP deduplication window default to 24h (or max workflow TTL). Make configurable per-tenant. Use PostgreSQL durable dedup table, not in-memory. Add a `dedup_window_seconds` field to the tenant configuration. | High | Low |
| REC-04 | Add a `CapacityReport` ACP event type that Specialists publish periodically (every 30s) with: current queue depth, active agent count, avg processing time, available capacity. Manager throttles dispatch when available capacity < 1. | High | Medium |
| REC-05 | Extend CompensationAction with `CompensationScope` enum: `FULL` (compensate all prior steps), `BRANCH` (compensate only steps in the failed branch's causal chain), `NONE` (no compensation). Update saga coordinator to evaluate scope before triggering compensation. | High | Medium |
| REC-06 | Define a `PlanRevision` ACP message and re-planning trigger conditions: (a) step failure after all retries + compensation, (b) actual token usage > 150% of estimate, (c) actual time > 200% of estimate, (d) external state change detected (knowledge updated, repo changed). Planner receives `PlanRevisionRequest` with failed step context and produces updated remaining steps. | High | Medium |
| REC-07 | Add a Multi-Region Runtime subsection addressing: per-region warm pools with region-local affinity, async checkpoint replication to alternate region (S3 cross-region replication), task re-assignment on region loss (NATS supercluster handles routing), and data residency (agent state stays in origin region unless failover). | High | Medium |
| REC-08 | Add an In-Flight Migration Policy to section 6.3: default = DRAIN (in-flight agents finish on old version, max drain time 30 min), configurable = MIGRATE (checkpoint + restart on new version), configurable = COEXIST. Publish `hermes.{tenant}.agent.version.deployed` and `hermes.{tenant}.agent.version.drained` events. | Medium | Low |
| REC-09 | Fix all protobuf syntax: replace `.` with `;` for field terminators. Fix duplicate field numbers in ACPMessage (headers=12, ttl_hops should be 13, expires_at_us=14, requires_ack=15). Run `protoc` validation before finalizing. | Critical | Low |
| REC-10 | Add `approval.expired` and `approval.escalated` events to section 25.1. Add `HealthCheck` RPC to section 24 gRPC API. Define heartbeat interval (10s), probe type (gRPC HealthCheck), and 3-strike removal rule. | Medium | Low |
| REC-11 | Add per-agent-type consumer groups within the task queue stream (section 12.4). Each agent type gets its own consumer group with independent max-pending and ack policies. Prevents one agent type's queue from blocking others. | Medium | Low |
| REC-12 | Add a Workflow TTL to the Workflow message (section 14.1): `int64 ttl_seconds = 13;` default 72h. Auto-cancel workflow when TTL expires. Clean up associated checkpoints and agent state on TTL expiry. | Medium | Low |
| REC-13 | Fix ACPMessage field numbering: the current protobuf has field 12 used twice (`headers` and `ttl_hops`). Renumber to avoid collision: `headers = 12`, `ttl_hops = 13`, `expires_at_us = 14`, `requires_ack = 15`. | Critical | Low |
| REC-14 | Add a Token Budget Tracker to the Execution Context (section 13.2): `int32 token_budget = 18;` and `int32 tokens_remaining = 19;`. Runtime decrements on each provider call. Forces workflow to pause or fail when budget exhausted. Publish `hermes.{tenant}.agent.tokens.budget_exceeded` event. | Medium | Low |
| REC-15 | Add a DLQ Replay RPC to section 24: `rpc ReplayTask(ReplayTaskRequest) returns (ReplayTaskResponse);`. Request preserves original `idempotency_key` and includes `replay_reason`. Response confirms new task_id with same idempotency guarantees. | Medium | Low |

---

## 7. Required Changes Before Approval

### Critical (must address before implementation)

| ID | Change | Section |
|----|--------|--------|
| **C-01** | Add Resource Quota Manager to Control Plane with per-tenant admission control for CPU, memory, tokens, and agent count. | 4.1, 28 |
| **C-02** | Add Checkpoint Storage Specification: storage backend, replication, retention, GC, max size limits. | 18.3 (new) |
| **C-03** | Fix all protobuf syntax errors: `.` → `;` for field terminators across all protobuf blocks. | 6.1, 10.2, 11.2-11.4, 13.2, 14.1, 15.2, 16.2, 18.2, 20.2, 23.1, 24 |
| **C-04** | Fix ACPMessage duplicate field numbers: renumber `ttl_hops=13`, `expires_at_us=14`, `requires_ack=15`. | 10.2 |

### High (must address before production)

| ID | Change | Section |
|----|--------|--------|
| **H-01** | Increase ACP deduplication window to 24h (or configurable per-tenant, default = max workflow TTL). Use durable PostgreSQL table. | 21.2 |
| **H-02** | Add Agent-to-Agent Backpressure: `CapacityReport` ACP event from Specialist to Manager. Manager throttles dispatch on low capacity. | 12, 21 |
| **H-03** | Add Parallel Saga Compensation: `CompensationScope` enum (FULL, BRANCH, NONE). Saga Coordinator evaluates scope before compensating. | 15.2 |
| **H-04** | Add Re-planning Protocol: `PlanRevisionRequest` ACP message, trigger conditions, Planner revision responsibility. | 11.2 |
| **H-05** | Add Multi-Region Runtime subsection: per-region warm pools, cross-region checkpoint replication, region affinity, failover. | 4, 19, 28 |
| **H-06** | Add Agent Health Check Protocol: `HealthCheck` RPC, heartbeat interval (10s), 3-strike removal rule. | 19, 24 |
| **H-07** | Add per-agent-type task queue isolation within tenant stream: separate consumer groups with independent flow control. | 12.4 |

### Medium (should address before production)

| ID | Change | Section |
|----|--------|--------|
| **M-01** | Add In-Flight Agent Migration Policy with DRAIN default (max 30 min), MIGRATE, COEXIST options. | 6.3 |
| **M-02** | Add `approval.expired` and `approval.escalated` events to published events table. | 25.1 |
| **M-03** | Add Workflow TTL field to Workflow message (default 72h), auto-cancel on expiry. | 14.1 |
| **M-04** | Add Token Budget Tracker to ExecutionContext with remaining budget tracking. | 13.2 |
| **M-05** | Add DLQ Replay RPC with idempotency preservation. | 24 |
| **M-06** | Add Tool Execution Timeout enforcement mechanism (Wasmtime fuel/timeout + sidecar watchdog timer). | 22 |

---

## 8. Approval Decision

### **APPROVED WITH CHANGES**

**Rationale:**

RFC-0008 demonstrates a strong architectural foundation for the Hermes Agent Runtime. The three-tier agent hierarchy, ACP protocol, capability enforcement, checkpoint taxonomy, and warm pool design are well-conceived and properly aligned with dependent RFCs (0002-0007). The 30 acceptance criteria provide excellent validation coverage, and the 4 Mermaid diagrams aid comprehension.

However, **4 Critical items** (C-01 through C-04) must be resolved before implementation can begin:

- **C-01 (Resource Quota Manager)** and **C-02 (Checkpoint Storage)** are operational showstoppers — without them, the system will fail in production within days.
- **C-03 and C-04 (Protobuf syntax)** are correctness issues that will block code generation.

Additionally, **7 High items** (H-01 through H-07) must be resolved before production deployment. These address backpressure, parallel saga compensation, re-planning, multi-region, health checks, and queue isolation — all of which affect system reliability at scale.

The RFC is approved **contingent on** the incorporation of all Critical items and all High items into a revised v1.1. The Medium items should be addressed but are not blocking for the revised RFC.

**Cross-RFC Alignment Status:**

| RFC | Alignment | Notes |
|-----|-----------|-------|
| RFC-0002 (Core) | ✅ Aligned | ACP (§13), WASM sandbox, Task Orchestrator 64-shard, warm pools referenced correctly |
| RFC-0003 (Event Bus) | ✅ Aligned | NATS topic naming convention followed; JetStream task queues consistent |
| RFC-0004 (Gateway) | ✅ Aligned | Provider adapters referenced; SSE streaming consistent |
| RFC-0005 (Memory) | ✅ Aligned | 4-tier hierarchy integrated; SDK methods match RFC-0005 definitions |
| RFC-0006 (Knowledge) | ✅ Aligned | RAG search, ingestion, graph queries referenced with correct capabilities |
| RFC-0007 (Security) | ✅ Aligned | SPIFFE SVID, PASETO v4 delegation chain, Merkle audit log all integrated |

---

**Review Complete.**

**Document:** RFC-0008-Architectural-Review.md  
**Next Step:** Revise RFC-0008 to v1.1 incorporating all Critical (C-01 to C-04) and High (H-01 to H-07) items.
