# RFC-0001: Hermes Agent OS v2 — Principal Architect Review

**Status:** Draft Review  
**Reviewer:** Principal Software Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Verdict:** **DO NOT APPROVE** — Requires Phase 1 expansion with 13 new architectural specifications

---

## 1. Strengths

| Area | Strength |
|------|----------|
| **Vision Clarity** | "Hermes is not a chatbot — it's an AI OS" — clear, differentiated positioning |
| **Single Core Philosophy** | Single Hermes Core serving all clients eliminates split-brain architecture |
| **Multi-Layer Agent Hierarchy** | Executive → Management → Specialist mirrors real org structures; 30-40 agents is realistic scope |
| **Explicit Request Lifecycle** | 11-step linear workflow is unambiguous and auditable |
| **Mission Control Separation** | Clear separation: Mission Control = observability/ops, Core = execution |
| **Phased Roadmap** | 8 phases with logical dependency ordering; Phase 1 (Foundation) before Core is correct |
| **Multi-Client First** | Telegram, Discord, WhatsApp, Mobile, Web, Desktop all first-class — no second-class clients |
| **No Production Code in RFC** | Correct: architecture review before implementation |

---

## 2. Weaknesses

| Area | Weakness |
|------|----------|
| **No Event Architecture** | §5 mentions "Event Bus" but §7 Request Lifecycle is purely synchronous/sequential. No event-driven async patterns, event sourcing, CQRS, or saga patterns for long-running workflows |
| **No State Machine / Workflow Engine** | 11-step linear lifecycle won't survive retries, compensation, human-in-the-loop, or parallel sub-workflows |
| **No Agent Communication Protocol** | §6 lists agent roles but no protocol: A2A protocol, message bus topology, pub/sub vs request/response, agent discovery, capability advertisement, negotiation |
| **Memory Architecture Underspecified** | §5 "Memory Engine" + §7 "Update Memory" step — no memory model (episodic/semantic/procedural), no vector + graph hybrid, no consolidation, no TTL/retention, no privacy boundaries |
| **No Security Model** | Zero mention of: authentication, authorization (RBAC/ABAC), audit logging, encryption at rest/in transit, tenant isolation, PII handling, prompt injection defense, tool sandboxing |
| **No Plugin/Extension System** | "Tool Manager" exists but no plugin SDK, manifest, capability registry, hot-reload, sandboxing, marketplace, versioning |
| **No Multi-Tenant / Multi-Org Architecture** | Single-tenant assumption throughout; no org/workspace isolation, no data residency, no RBAC per workspace |
| **No Observability / Telemetry Spec** | "Logging" and "Monitoring" listed under infrastructure but no OpenTelemetry, structured logging, distributed tracing, metrics, alerting, SLOs |
| **No Data Architecture** | "Database, File Storage, Vector Storage" listed but no schema strategy, migration strategy, multi-model (relational + vector + graph + object), backup/restore, PITR |
| **No Failure Recovery Model** | §7 step 7 "Recover from failures gracefully" — but no retry policies, dead letter queues, saga compensation, checkpointing, idempotency keys |
| **No Human Approval Workflow** | §7 step "Validate Results" → "Update Memory" — no human-in-the-loop gates, approval workflows, escalation, SLA timers |
| **No Multi-Client Sync Protocol** | "Synchronize every connected client" — no conflict resolution, eventual consistency model, offline-first, presence, read receipts |
| **No Provider Abstraction Depth** | "Provider Manager" listed but no model routing, cost optimization, fallback chains, streaming, structured output enforcement, eval harness |
| **No Knowledge Engine Spec** | §5 lists "Knowledge Engine" — no RAG architecture, chunking strategy, embedding model management, hybrid search, knowledge graph, freshness |
| **No Local-First / Offline Architecture** | Desktop app listed but no local-first sync, CRDTs, offline queue, conflict resolution |
| **No Enterprise Features Spec** | Phase 8 "Enterprise Features" but no SSO/SAML/OIDC, SCIM, audit logs, data export, compliance (SOC2, GDPR, HIPAA), tenant admin console |
| **No Testing / Quality Architecture** | No contract testing, chaos engineering, eval harness, regression testing for agents |
| **No Deployment Architecture** | No container orchestration, service mesh, blue-green, canary, feature flags, config management, secrets management |

---

## 3. Missing Components (Critical Gaps)

| # | Missing Component | Why Critical |
|---|-------------------|--------------|
| 1 | **Event-Driven Architecture / Event Bus Spec** | Core of async agent coordination; without it, everything is blocking RPC |
| 2 | **Workflow / Saga Orchestration Engine** | 11-step linear flow fails on any retry, human gate, or parallel branch |
| 3 | **Agent Communication Protocol (ACP)** | 30-40 agents need discovery, capability negotiation, streaming, handoff |
| 4 | **Memory Architecture (Episodic + Semantic + Procedural + Working)** | "Memory Engine" is a black box; needs consolidation, retrieval, privacy |
| 5 | **Security & Tenancy Model** | Enterprise blocker; no authz, no multi-tenant, no audit |
| 6 | **Plugin / Tool SDK & Sandbox** | Extensibility requires SDK, manifest, WASM/WASI sandbox, capability graph |
| 7 | **Human Approval / HITL Workflow Engine** | Enterprise requires approval gates, escalation, SLA, delegation |
| 8 | **Multi-Client Sync Protocol (CRDT / Event Sourcing)** | "Single source of truth" across Telegram/Desktop/Web needs conflict resolution |
| 9 | **Provider Router / Model Gateway** | Cost, latency, fallback, streaming, structured output, eval — all missing |
| 10 | **Observability Stack (OTel, Tracing, Metrics, Logs, Evals)** | Operability at scale requires this from Day 1 |
| 11 | **Data Layer Architecture (Multi-Model DB, Migrations, PITR)** | Foundation for everything else |
| 12 | **Failure Recovery / Resilience Patterns** | Retry, circuit breaker, DLQ, idempotency, checkpointing |
| 13 | **Knowledge / RAG Architecture** | Chunking, embedding lifecycle, hybrid search, graph RAG, freshness |
| 14 | **Local-First / Offline-First Sync Engine** | Desktop app requirement |
| 15 | **Enterprise Auth / Compliance Layer** | Phase 8 blocker without this |

---

## 4. Risks (Prioritized by Impact × Likelihood)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R1: Synchronous Request Lifecycle Collapse** | Critical | High | §7 is synchronous; any long-running agent, human approval, or tool call blocks the entire pipeline. Must adopt async event-driven saga pattern before Phase 2. |
| **R2: Agent Communication Chaos** | Critical | High | 30-40 agents with no protocol = spaghetti mesh. Define ACP (Agent Communication Protocol) in Phase 1. |
| **R3: Memory Architecture Underspec → Re-architecture** | High | High | Memory is central to "AI OS"; bolting on vector+graph+episodic later requires full rewrite. Spec memory model in Phase 1. |
| **R4: Security/Privacy Retrofit Impossible** | Critical | Medium | No authz, tenancy, audit, PII handling in foundation = enterprise dead end. Add Security Model to Phase 1. |
| **R5: Plugin System Afterthought** | High | High | Tool Manager without SDK/sandbox = fragile integrations. Define Plugin SDK in Phase 1. |
| **R6: Multi-Client Sync Conflicts** | High | Medium | "Single source of truth" across Telegram/Desktop/Web needs CRDT/event-sourcing from Day 1. |
| **R7: Provider Lock-in / Cost Explosion** | High | Medium | No router = single provider lock-in, no cost control, no fallback. Provider Gateway in Phase 1. |
| **R8: Observability Blindness** | High | Medium | No OTel/tracing = un-debuggable at 30+ agents. Instrument from Phase 1. |
| **R9: Data Layer Migration Hell** | Medium | High | No migration strategy = schema changes break everything. Adopt migration framework Phase 1. |
| **R10: Human Approval Gap** | High | High | Enterprise workflows require approval gates; not in lifecycle. Add HITL workflow engine Phase 2. |
| **R11: Local-First Desktop Failure** | Medium | Medium | Desktop app without offline sync = broken UX. CRDT/sync engine Phase 1. |
| **R12: Agent Lifecycle Management Gap** | High | Medium | No agent spawn/scale/down/health/checkpoint/restart spec. Agent Manager underspecified. |

---

## 5. Recommendations (Prioritized)

### Phase 1 Additions (Must Add to Foundation Architecture)

| # | Recommendation | Deliverable |
|---|----------------|-------------|
| 1 | **Define Event-Driven Architecture** | Event Bus spec: topics, partitions, ordering, exactly-once, schema registry (Avro/Protobuf), consumer groups, DLQ |
| 2 | **Define Workflow / Saga Engine** | State machine DSL, compensation actions, checkpointing, human task integration, idempotency keys |
| 3 | **Specify Agent Communication Protocol (ACP)** | Capability advertisement, discovery, streaming RPC, handoff protocol, delegation, negotiation |
| 4 | **Define Memory Architecture** | 4-layer model (Working → Episodic → Semantic → Procedural), consolidation pipeline, vector+graph hybrid, TTL/retention, privacy scopes |
| 5 | **Define Security & Tenancy Model** | AuthN (OIDC), AuthZ (RBAC/ABAC per workspace), Audit log (immutable), Encryption (at rest/in transit), PII tagging, Prompt injection defenses, Tool sandboxing (WASM) |
| 6 | **Define Plugin / Tool SDK** | Manifest (JSON Schema), Capability graph, WASM sandbox, Hot reload, Versioning, Marketplace spec |
| 7 | **Define Multi-Client Sync Protocol** | Event sourcing + CRDT for conversation state, Presence, Read receipts, Optimistic UI, Conflict resolution |
| 8 | **Define Provider Gateway / Router** | Model routing (cost/latency/capability), Fallback chains, Streaming, Structured output enforcement, Cost tracking, Eval harness |
| 9 | **Define Observability Foundation** | OTel tracing (W3C tracecontext), Structured JSON logs, Metrics (RED + USE), Distributed tracing across agents, Eval pipeline |
| 10 | **Define Data Layer Architecture** | Multi-model (PostgreSQL + pgvector + Redis + S3 + Neo4j), Migration framework (Atlas/Golang-migrate), PITR, Backup/restore test |
| 11 | **Define Human Approval / HITL Workflow** | Approval tasks, Escalation policies, SLA timers, Delegation, Audit trail |
| 12 | **Define Local-First Sync Engine** | CRDT (Yjs/Automerge), Offline queue, Conflict resolution, Background sync |
| 13 | **Define Agent Lifecycle Manager Spec** | Spawn, health check, checkpoint, restart, scale, graceful drain, resource quotas |

### Phase 2+ Sequencing Adjustments

| Current Phase | Recommended Adjustment |
|---------------|------------------------|
| Phase 2: Hermes Core | Split into: 2a Core Runtime (Event Bus, Workflow Engine, State Manager), 2b Agent Runtime (ACP, Agent Manager, Sandbox), 2c Memory & Knowledge |
| Phase 3: Mission Control | Add: Real-time OTel dashboard, Agent topology viz, Workflow debugger, Approval queue |
| Phase 4: Communication Channels | Add: Sync protocol implementation per channel, Channel-specific adapters (Telegram/Discord/WhatsApp/WebSocket) |
| Phase 5: Multi-Agent Framework | Prereq: ACP, Agent Lifecycle Manager, Capability Registry must be done in Phase 2b |
| Phase 6: Automation Platform | Add: Cron/Event triggers, Workflow templates, Marketplace |
| Phase 7: Memory & Knowledge | Prereq: Memory Architecture (Phase 1), Vector+Graph DB (Phase 2a) |
| Phase 8: Enterprise Features | Prereq: Security Model (Phase 1), Multi-tenancy, Audit, SSO/SCIM |

---

## 6. Updated Architecture Proposal

### 6.1 Revised Core Architecture (Layered)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                           │
│  ┌─────────┐ ┌───────────┐ ┌────────┐ ┌───────┐ ┌──────┐ ┌─────┐ ┌───────┐  │
│  │ Desktop │ │ Mission   │ │Telegram│ │Discord│ │WhatsApp│ │Web │ │Mobile │  │
│  │  App    │ │ Control   │ │        │ │       │ │      │ │    │ │       │  │
│  └────┬────┘ └─────┬─────┘ └────┬───┘ └───┬───┘ └──┬───┘ └──┬──┘ └───┬───┘  │
└───────┼─────────────┼────────────┼─────────┼────────┼───────┼──────┼───────┘
        │             │            │         │        │       │      │
        ▼             ▼            ▼         ▼        ▼       ▼      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HERMES GATEWAY (API Gateway / Protocol Adapters)       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ REST/WS API  │ │ Telegram     │ │ Discord      │ │ WhatsApp / Mobile  │  │
│  │ (OpenAPI)    │ │ Bot API      │ │ Gateway      │ │ Push / Webhooks    │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HERMES CORE (Event-Driven, Multi-Tenant)             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                        EVENT BUS (Apache Kafka / Redpanda / NATS)       │  │
│  │  Topics: conversations, tasks, agents, memory, approvals, audit, sync  │  │
│  │  Schema Registry (Protobuf), Exactly-once, DLQ, Consumer Groups        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ CONVERSATION │ │   WORKFLOW   │ │    AGENT     │ │      MEMORY        │  │
│  │   ENGINE     │ │   ENGINE     │ │  RUNTIME     │ │    ENGINE          │  │
│  │              │ │  (Saga/      │ │              │ │                    │  │
│  │ - Intent     │ │   State      │ │ - ACP        │ │ - Working Memory   │  │
│  │ - Context    │ │   Machine)   │ │ - Discovery  │ │ - Episodic (KV)    │  │
│  │ - History    │ │ - Compensate │ │ - Lifecycle  │ │ - Semantic (Vector)│  │
│  │ - Sync       │ │ - HITL       │ │ - Sandbox    │ │ - Procedural       │  │
│  │   (CRDT)     │ │ - Checkpoint │ │ - Metrics    │ │ - Knowledge Graph  │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────────┘  │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │  PLANNING    │ │   PROVIDER   │ │    TOOL      │ │     KNOWLEDGE      │  │
│  │  ENGINE      │ │   GATEWAY    │ │  MANAGER     │ │     ENGINE         │  │
│  │              │ │              │ │  (SDK +      │ │                    │  │
│  │ - Decompose  │ │ - Router     │ │   WASM       │ │ - RAG Pipeline     │  │
│  │ - Schedule   │ │ - Fallback   │ │   Sandbox)   │ │ - Chunk/Embed      │  │
│  │ - Optimize   │ │ - Cost Ctrl  │ │ - Manifest   │ │ - Hybrid Search    │  │
│  │ - Dependencies│ │ - Streaming  │ │ - Marketplace│ │ - Freshness        │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────────┘  │
│                                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │  AUTOMATION  │ │   STATE      │ │   SECURITY   │ │    OBSERVABILITY   │  │
│  │  ENGINE      │ │  MANAGER     │ │   LAYER      │ │     STACK          │  │
│  │              │ │              │ │              │ │                    │  │
│  │ - Triggers   │ │ - Event      │ │ - AuthN/Z    │ │ - OTel Traces      │  │
│  │ - Schedules  │ │   Sourcing   │ │ - Audit Log  │ │ - Metrics (Prom)   │  │
│  │ - Templates  │ │ - Snapshots  │ │ - PII Guard  │ │ - Logs (Loki)      │  │
│  │ - Marketplace│ │ - Migration  │ │ - Sandbox    │ │ - Evals (CI/CD)    │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER (Multi-Model)                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │
│  │ PostgreSQL   │ │  pgvector /  │ │   Redis      │ │   Object Storage   │  │
│  │ (Relational, │ │  Qdrant /    │ │  (Cache,     │ │   (S3 / MinIO)     │  │
│  │  Event Store,│ │  Weaviate    │ │   Session,   │ │   Files, Artifacts │  │
│  │  Audit Log)  │ │  (Vector)    │ │   Queue)     │ │                    │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────────┘  │
│  ┌──────────────┐                                                          │
│  │  Neo4j /     │                                                          │
│  │  Kuzu        │                                                          │
│  │  (Knowledge  │                                                          │
│  │   Graph)     │                                                          │
│  └──────────────┘                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Agent Communication Protocol (ACP) — New Section

| Layer | Specification |
|-------|---------------|
| **Transport** | gRPC streaming + NATS/Kafka for async; WebSocket for real-time |
| **Discovery** | Capability Registry (etcd/Consul): agent_id, capabilities[], version, health, capacity |
| **Message Envelope** | `{id, corr_id, causation_id, timestamp, source, target, payload, metadata}` |
| **Patterns** | Request/Response, Fire-and-Forget, Streaming, Pub/Sub, Handoff (delegate), Negotiation (contract net) |
| **Serialization** | Protocol Buffers (schema registry) |
| **Auth** | mTLS between agents; JWT for external clients; capability tokens for tool access |
| **Observability** | W3C TraceContext propagation mandatory |

### 6.3 Memory Architecture — New Section

| Layer | Storage | TTL | Access Pattern | Consolidation |
|-------|---------|-----|----------------|---------------|
| **Working Memory** | Redis (STM) | Session | LRU, key-value | Flush to Episodic on context switch |
| **Episodic Memory** | PostgreSQL (JSONB) + Vector | Configurable (90d default) | Time-range, similarity, keyword | Nightly consolidation → Semantic |
| **Semantic Memory** | Vector DB (Qdrant/Weaviate) + Graph (Neo4j) | Long-term | Hybrid search (vector + graph + keyword) | Continuous embedding update |
| **Procedural Memory** | PostgreSQL (skills, workflows, tools) | Permanent | Capability lookup, versioned | Human-curated + auto-extracted |
| **Privacy Scopes** | Per-workspace, per-user, per-conversation tags; encryption keys per scope | | | |

### 6.4 Request Lifecycle — Revised (Event-Driven Saga)

```
┌─────────────┐
│  RECEIVE    │  (Gateway → Event: conversation.message.received)
└──────┬──────┘
       ▼
┌─────────────┐
│  UNDERSTAND │  (Conversation Engine → Event: intent.resolved)
└──────┬──────┘
       ▼
┌─────────────┐
│   PLAN      │  (Planning Engine → Event: plan.created {tasks[], dependencies})
└──────┬──────┘
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ASSIGN     │────▶│  EXECUTE    │────▶│  VALIDATE   │  (Parallel tasks via Agent Runtime)
│  AGENTS     │     │  TASKS      │     │  RESULTS    │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                    │
                    (Saga orchestrates)   (Human approval gate?)
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  COMPENSATE │     │  APPROVE    │
                    │  (on fail)  │     │  (HITL)     │
                    └──────┬──────┘     └──────┬──────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────────────────────┐
                    │      CONSOLIDATE            │
                    │  - Update Memory (async)    │
                    │  - Update Knowledge (async) │
                    │  - Emit Audit Events        │
                    │  - Sync Clients (CRDT)      │
                    └──────────────┬──────────────┘
                                   ▼
                          ┌─────────────────┐
                          │   RESPOND       │
                          │ (Gateway pushes │
                          │  to all clients)│
                          └─────────────────┘
```

### 6.5 Security & Tenancy Model — New Section

| Layer | Mechanism |
|-------|-----------|
| **Authentication** | OIDC (Keycloak/Auth0/Clerk), API Keys, mTLS for agent-to-agent |
| **Authorization** | ABAC: `resource:workspace:conversation:action` policies via OPA/Cedar |
| **Tenancy** | Workspace isolation (Row-Level Security + separate vector namespaces) |
| **Audit** | Immutable append-only log (Kafka topic + PostgreSQL) — all decisions, tool calls, approvals |
| **PII** | Automatic detection (Presidio), field-level encryption, retention policies |
| **Prompt Injection** | Input classification, tool sandboxing (WASM), capability-based tool access |
| **Secrets** | HashiCorp Vault / AWS Secrets Manager / 1Password — never in DB |

---

## Summary: RFC-0001 Readiness Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| Architectural Completeness | ❌ Incomplete | 15 critical gaps identified |
| Scalability Foundation | ⚠️ Partial | Event bus, saga, multi-tenant missing |
| Security Foundation | ❌ Missing | Zero security model defined |
| Extensibility | ⚠️ Partial | Tool Manager exists but no SDK/sandbox |
| Operability | ❌ Missing | No observability, no failure recovery |
| Enterprise Ready | ❌ No | AuthZ, tenancy, audit, compliance absent |
| **Verdict** | **DO NOT APPROVE** | Requires Phase 1 expansion with 13 new architectural specifications |

---

## Next Steps (Recommended)

1. **Split RFC-0001** into: RFC-0001 (Vision/Principles), RFC-0002 (Core Architecture + Event Bus), RFC-0003 (Agent Runtime + ACP), RFC-0004 (Memory Architecture), RFC-0005 (Security & Tenancy), RFC-0006 (Plugin SDK), RFC-0007 (Workflow/HITL), RFC-0008 (Multi-Client Sync), RFC-0009 (Observability)
2. **Prototype Phase 1**: Event Bus + Saga Engine + Memory Model + Security Model + Plugin SDK (6-8 weeks)
3. **Architecture Review Board**: Weekly reviews for each sub-RFC
4. **Proof of Concept**: 3-agent workflow (Planner → Coder → Reviewer) with HITL gate, event-sourced, multi-client sync

---

**Awaiting your approval to:**
- Split into sub-RFCs and proceed with detailed specifications
- Begin Phase 1 prototype implementation
- Or revise this review based on your priorities