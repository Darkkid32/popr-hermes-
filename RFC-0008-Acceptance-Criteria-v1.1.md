# RFC-0008 Acceptance Criteria v1.1
# Complete Set — Includes AC-001 through AC-040

**Version:** 1.1  
**Date:** 2026-07-25  
**Author:** Chief System Architect  
**Status:** APPROVED

---

## Original Acceptance Criteria (AC-001 through AC-030)

### AC-001: Agent Lifecycle Management
**Given** a registered agent manifest  
**When** the Runtime receives a spawn request  
**Then** the agent transitions through PROVISION → REGISTERED → WARMED → ACTIVE within 500ms (warm) or 5s (cold)  
**And** the agent receives a valid SPIFFE SVID and PASETO capability token

### AC-002: Agent Registry and Discovery
**Given** a tenant with registered agent manifests  
**When** a discover request is issued with capability filters  
**Then** only agents possessing ALL requested capabilities are returned  
**And** discovery response latency is under 50ms

### AC-003: Manifest Validation
**Given** an agent manifest with declared capabilities  
**When** the manifest is submitted for registration  
**Then** all capabilities are validated against the Security Service  
**And** resources are checked against tenant quota  
**And** the entrypoint is verified (WASM signature or container scan)

### AC-004: Capability Enforcement
**Given** an agent with capability token granting code.exec on repo:acme/*  
**When** the agent attempts code.exec on repo:acme/backend  
**Then** the action is allowed  
**When** the agent attempts code.exec on repo:other/*  
**Then** the action is denied and an audit event is published

### AC-005: ACP Request-Response
**Given** Agent A and Agent B on the same tenant  
**When** Agent A sends an ACP request to Agent B  
**Then** Agent B receives the message within 50ms p99  
**And** Agent A receives the response within 30s  
**And** the capability token is validated by Agent B before processing

### AC-006: Planner to Manager to Specialist
**Given** a user goal submitted to the Planner  
**When** the Planner decomposes the goal  
**Then** a Plan with DAG steps is created  
**And** each step specifies the required specialist type and capabilities  
**And** the Manager creates a Workflow from the Plan  
**And** tasks are dispatched to appropriate Specialists via ACP

### AC-007: Task Scheduling Priority
**Given** tasks at CRITICAL, HIGH, NORMAL, and LOW priority  
**When** the scheduler selects the next task  
**Then** CRITICAL tasks are dequeued within 1s  
**And** higher priority tasks are always dispatched before lower priority within the same tenant

### AC-008: Workflow DAG Execution
**Given** a workflow with parallel branches and conditional edges  
**When** the orchestrator executes the workflow  
**Then** independent steps execute in parallel  
**And** conditional edges are evaluated at runtime (CEL expressions)  
**And** each step executes exactly once (idempotency keys)

### AC-009: Saga Compensation (Branch-Aware)
**Given** a workflow with 4 sequential steps, each with REVERSE compensation  
**When** step 4 fails  
**Then** the Saga Coordinator triggers compensation for step 3, then 2, then 1  
**And** each compensation completes within its timeout  
**And** a saga.failed event is published if any compensation fails  
**Given** a workflow with parallel branches, one branch fails  
**When** the Saga Coordinator compensates  
**Then** only the failed branch's steps are compensated (CompensationScope = BRANCH)  
**And** the other branch continues execution

### AC-010: Human-in-the-Loop Approval
**Given** a task with human_approval=true  
**When** the Manager creates an approval request  
**Then** the request is routed to the configured channel (Slack/Telegram/Email/Web)  
**And** the workflow pauses until the approval is resolved  
**And** if the timeout expires, the approval auto-rejects and the task fails

### AC-011: Checkpoint and Recovery
**Given** an agent executing a task with periodic checkpoints (60s interval)  
**When** the agent crashes  
**Then** the latest checkpoint is fetched within 5s  
**And** the checkpoint SHA256 is validated  
**And** state is restored and execution resumes within 30s total (RTO)  
**And** no duplicate tool executions occur (idempotency keys)

### AC-012: Warm Pool Auto-Scaling
**Given** a warm pool with min=3, max=20 for code-specialist  
**When** task queue depth exceeds 2 x warm_pool_size (6)  
**Then** the scale-up policy starts cold agents  
**And** warm pool size increases toward 70% target utilization  
**And** scale-up completes within 30s for 5 additional agents

### AC-013: Failure and Retry
**Given** a task that fails with a transient error (network timeout)  
**When** the retry policy (max_attempts=3, base_delay=1s, backoff=2x) is applied  
**Then** the task is retried up to 3 times  
**And** delays are 1s, 2s, 4s (plus 10% jitter)  
**And** after max_attempts, the task moves to dead letter queue and an alert fires

### AC-014: Tool Execution (WASM)
**Given** an agent with code.exec capability  
**When** the agent invokes the code.execute tool  
**Then** the capability is checked before execution  
**And** the tool executes in a WASM sandbox (Wasmtime + WASI 0.2)  
**And** the result is returned within the tool timeout  
**And** network egress is blocked unless explicitly allowed

### AC-015: Provider Fallback
**Given** a primary provider (OpenAI) and secondary (Anthropic)  
**When** the primary provider returns 5 errors in 10s  
**Then** the circuit breaker opens for 30s  
**And** the secondary provider is used for subsequent requests  
**And** the token budget is enforced across both providers

### AC-016: Event Publication
**Given** an agent spawn event  
**When** the Runtime spawns a new agent  
**Then** the event hermes.{tenant}.agent.runtime.spawned is published to NATS  
**And** the payload includes agent_id, manifest_id, capabilities, and timestamp  
**And** the event is delivered to all subscribers within 50ms

### AC-017: Multi-Tenant Isolation
**Given** two tenants (Tenant A, Tenant B)  
**When** Tenant A schedules a task  
**Then** the task is only dispatched to Tenant A agents  
**And** Tenant A agents cannot access Tenant B memory or knowledge  
**And** Tenant A ACP messages cannot reach Tenant B agents  
**And** per-tenant quota limits are enforced

### AC-018: Audit Logging
**Given** an agent performing a capability.action  
**When** the action is executed  
**Then** an audit event is published to hermes.{tenant}.security.audit.agent  
**And** the event includes agent_id, capability, resource, action, allowed/denied, timestamp  
**And** the event is persisted to the Merkle transparency log

### AC-019: Memory Integration
**Given** an agent executing a task  
**When** the agent calls working_set  
**Then** the value is written to Redis within 10ms  
**And** when the agent calls episodic_record, the event is persisted to PostgreSQL  
**And** when the agent calls semantic_search, results are retrieved from Qdrant + Kuzu

### AC-020: Knowledge Integration
**Given** an agent with knowledge.search capability  
**When** the agent calls knowledge.search(query)  
**Then** the Knowledge Service returns relevant results within 500ms  
**And** results include citations and confidence scores  
**And** the agent can only access collections within its capability scope

### AC-021: Streaming Progress
**Given** a specialist executing a long-running task  
**When** the specialist streams progress updates  
**Then** the manager receives chunks (10%, 45%, 90%, final) via ACP Stream  
**And** chunks arrive in order (per correlation_id)  
**And** the final result is delivered exactly once

### AC-022: Agent Delegation
**Given** a Planner with agent.spawn capability  
**When** the Planner spawns a Manager  
**Then** the Manager receives a PASETO v4 token with delegation_chain including the Planner  
**And** delegation_depth=1  
**When** the Manager spawns a Specialist  
**Then** the Specialist receives a token with delegation_depth=2  
**And** spawn is denied if delegation_depth would exceed max_delegation_depth=3

### AC-023: SVID Rotation
**Given** an agent with a SPIFFE SVID  
**When** the SVID approaches expiry (within 1h)  
**Then** the sidecar proactively requests a new SVID  
**And** the new SVID is applied without dropping active connections  
**And** the old SVID is revoked

### AC-024: Pool Health Check
**Given** a warm pool with WARM agents  
**When** an agent fails health checks (3 consecutive failures)  
**Then** the agent is removed from the pool  
**And** a replacement agent is started if below min_warm  
**And** an agent.failed event is published

### AC-025: Workflow Pause and Resume
**Given** a running workflow  
**When** the PauseWorkflow RPC is called  
**Then** all in-flight agents complete their current action  
**And** no new tasks are dispatched  
**And** the workflow state is persisted  
**When** the ResumeWorkflow RPC is called  
**Then** the workflow resumes from the paused state  
**And** no steps are re-executed (idempotency)

### AC-026: Approval Escalation
**Given** an approval with a 24h timeout and a secondary approver configured  
**When** the primary approver does not respond within the timeout  
**Then** the approval auto-escalates to the secondary approver  
**And** if the secondary approver also does not respond within their timeout, the approval auto-rejects

### AC-027: Dead Letter Queue
**Given** a task that has exhausted all retry attempts  
**When** the task enters the dead letter queue  
**Then** the full task context is preserved (input, execution history, checkpoints)  
**And** an alert is sent to on-call  
**And** the task can be manually replayed after issue resolution

### AC-028: Context Assembly
**Given** an agent about to make an LLM call  
**When** the Runtime assembles the context  
**Then** working memory is included first  
**And** the system prompt is included  
**And** knowledge results are included  
**And** total context does not exceed provider max_tokens  
**And** if exceeding, truncation follows priority order (semantic < episodic < knowledge < system < working)

### AC-029: Provider Circuit Breaker
**Given** a provider with a circuit breaker (5 errors in 10s → open 30s)  
**When** 5 errors occur within 10 seconds  
**Then** the circuit breaker opens and no requests are sent to that provider for 30s  
**And** fallback provider is used if configured  
**And** after 30s, the circuit enters half-open and allows one test request

### AC-030: Cross-RFC Alignment
**Given** the complete Hermes Agent OS v2 architecture  
**When** the Agent Runtime is deployed  
**Then** it integrates with:
- RFC-0002: Core Architecture (ACP, WASM sandbox, Task Orchestrator, warm pools)
- RFC-0003: Event Bus (NATS topics for agent events, JetStream for task queues)
- RFC-0004: Gateway (protocol adapters for agent communication)
- RFC-0005: Memory (4-tier hierarchy, SDK integration)
- RFC-0006: Knowledge (RAG search, ingestion pipeline integration)
- RFC-0007: Security (SPIFFE identity, PASETO capability tokens, audit logging)

---

## New Acceptance Criteria for Critical/High Items (AC-031 through AC-040)

### AC-031: Resource Quota Enforcement (C-01)
**Given** a tenant with configured quotas (max_agents=100, max_cpu=50000m, max_memory=100Gi, max_tokens_per_hour=1000000)  
**When** the tenant attempts to spawn an agent that would exceed any quota  
**Then** the SpawnAgent RPC is rejected with QUOTA_EXCEEDED error  
**And** the Resource Quota Manager publishes hermes.{tenant}.agent.quota.exceeded event  
**And** existing agents continue running (quota only enforced on spawn)  
**And** quota usage is visible via GetRuntimeStats RPC

### AC-032: Checkpoint Storage (C-02)
**Given** an agent executing a task with checkpoint interval 60s  
**When** a checkpoint is created  
**Then** metadata is written to PostgreSQL agent_checkpoints table within 100ms  
**And** serialized state is uploaded to S3 at hermes/checkpoints/{tenant}/{agent_type}/{agent_id}/{checkpoint_id}.zst within 500ms  
**And** cross-region replication (CRR) is enabled on the S3 bucket  
**And** retention policy keeps last 10 checkpoints per agent OR 7 days (whichever is greater)  
**And** nightly GC removes checkpoints older than retention policy and orphaned S3 objects  
**And** checkpoint size limit is 100MB; larger checkpoints are chunked into 50MB parts

### AC-033: ACP Deduplication Window (H-01)
**Given** a long-running workflow executing for 6 hours  
**When** NATS JetStream redelivers an ACP message after 2 hours  
**Then** the message ID is still in the deduplication table (24h default window)  
**And** the duplicate is correctly identified and dropped  
**And** the deduplication window is configurable per-tenant (min 1h, default 24h)  
**And** deduplication uses durable PostgreSQL table (not in-memory)

### AC-034: Agent-to-Agent Backpressure (H-02)
**Given** a Specialist pool with 8/10 agents busy, queue depth 15, avg latency 245ms  
**When** the Specialist publishes CapacityReport (available_capacity = 0.2)  
**Then** the Manager receives the report within 100ms  
**And** the Manager defers new task dispatch for that agent type  
**And** the Manager publishes hermes.{tenant}.agent.backpressure.{agent_type} event  
**When** available_capacity rises above 0.5  
**Then** the Manager resumes normal dispatch for that agent type

### AC-035: Parallel Saga Compensation (H-03)
**Given** a workflow with parallel branches: Step 1 → Step 2A/2B (parallel) → Step 3A/3B  
**When** Step 3B fails and CompensationScope = BRANCH  
**Then** the Saga Coordinator compensates only Step 3B, then Step 2B (failed branch)  
**And** Step 3A and Step 2A (successful branch) continue without compensation  
**And** Step 1 is not compensated  
**When** CompensationScope = FULL  
**Then** all prior steps are compensated in reverse topological order  
**And** saga.failed event is published if any compensation fails

### AC-036: Re-planning Protocol (H-04)
**Given** a workflow where Step 3 fails after all retries + compensation  
**When** the Manager sends PlanRevisionRequest to the Planner  
**Then** the Planner receives: {failed_step, error, actual_vs_estimate, remaining_steps}  
**And** the Planner returns PlanRevisionResponse with updated remaining steps  
**And** the Planner may select alternative specialists, adjust resource estimates, or re-sequence steps  
**And** completed steps are NOT re-planned (only remaining steps)  
**Also triggers** on: token usage > 150% estimate, time > 200% estimate, external state change

### AC-037: Multi-Region Runtime (H-05)
**Given** a Runtime deployed in us-east-1 and eu-west-1 with NATS supercluster  
**When** an agent spawns in us-east-1  
**Then** it joins the us-east-1 warm pool (region-local affinity)  
**And** checkpoints are replicated to eu-west-1 via S3 CRR  
**When** us-east-1 region is lost  
**Then** NATS supercluster routes ACP messages to eu-west-1  
**And** Region Coordinator promotes cold agents in eu-west-1  
**And** agents recover from checkpoints pulled from eu-west-1 S3  
**And** agent state never leaves origin region unless failover

### AC-038: Agent Health Check Protocol (H-06)
**Given** a warm pool with WARM agents  
**When** the HealthCheck RPC is called every 10s  
**Then** the agent responds with SERVING within 1s  
**When** an agent fails 3 consecutive health checks  
**Then** the agent is removed from the pool  
**And** a replacement agent is started if pool size < min_warm  
**And** hermes.{tenant}.agent.health.failed event is published  
**And** the failed agent is gracefully terminated (drain in-flight, save checkpoint)

### AC-039: Per-Agent-Type Queue Isolation (H-07)
**Given** a tenant with code-specialist and research-specialist tasks  
**When** both task types are queued simultaneously  
**Then** each agent type has its own NATS JetStream consumer group:  
  - hermes.{tenant}.tasks.consumer.code-specialist (max_pending: 2000)  
  - hermes.{tenant}.tasks.consumer.research-specialist (max_pending: 500)  
**And** flow control is independent (one type's queue full doesn't block the other)  
**And** Fair Share controller enforces per-type quotas

### AC-040: In-Flight Migration Policy (M-01)
**Given** a new agent version deployed via canary (5% → 25% → 100%)  
**When** the old version has in-flight agents executing tasks  
**Then** by default (DRAIN policy):  
  - In-flight agents complete their current task (max 30 min drain time)  
  - New tasks are assigned to new version agents  
  - hermes.{tenant}.agent.version.drained event published when old version pool empty  
**When** MIGRATE policy configured:  
  - In-flight agents checkpoint, then restart on new version  
  - Max migration time per agent: 2 min  
**When** COEXIST policy configured:  
  - Both versions run indefinitely  
  - Traffic split by version label

---

## Complete AC List Summary

| Range | Count | Description |
|-------|-------|-------------|
| AC-001 to AC-030 | 30 | Original acceptance criteria |
| AC-031 to AC-040 | 10 | New criteria for Critical/High review items |
| **Total** | **40** | **Complete acceptance criteria set** |

---

## Traceability Matrix

| Review Item | AC Added | Section |
|-------------|----------|---------|
| C-01: Resource Quota Manager | AC-031 | 4.1, 28 |
| C-02: Checkpoint Storage | AC-032 | 18.3 |
| C-03: Protobuf Syntax | N/A (code fix) | All protobuf |
| C-04: ACPMessage Field Numbers | N/A (code fix) | 10.2 |
| H-01: ACP Dedup Window | AC-033 | 21.2 |
| H-02: Backpressure | AC-034 | 10.5, 19.4, 21.1 |
| H-03: Parallel Saga | AC-035 | 15.2, 15.3 |
| H-04: Re-planning | AC-036 | 11.5 |
| H-05: Multi-Region | AC-037 | 4.1, 19.5 |
| H-06: Health Check | AC-038 | 19.4, 24 |
| H-07: Queue Isolation | AC-039 | 12.4 |
| M-01: In-Flight Migration | AC-040 | 6.3 |

---

## Verification Status

All 40 acceptance criteria are:
- ✅ **Specified** in RFC-0008 v1.1
- ✅ **Traceable** to review items
- ✅ **Testable** with Given/When/Then format
- ✅ **Aligned** with RFC-0002 through RFC-0007

**RFC-0008 v1.1 Acceptance Criteria: APPROVED**