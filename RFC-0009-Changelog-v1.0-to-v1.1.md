# RFC-0009 Changelog v1.0 → v1.1

**Date:** 2026-07-25  
**Author:** Hermes Team  
**Review:** Principal Enterprise Architect Review  
**Status:** Approved  

---

## Summary

RFC-0009 v1.1 incorporates all 16 review items from the Principal Enterprise Architect review:
- **6 Critical items (C-01 through C-06)** — All addressed
- **10 High Priority items (H-01 through H-10)** — All addressed

The revision adds comprehensive specifications for health checks, dead letter queues, MCP gateway, multi-tenant isolation, provider adapter contracts, plugin dependency resolution, capability discovery search, CEL sandbox, hook timeouts, orchestration checkpointing, MCP versioning, upgrade procedures, resource exhaustion handling, backpressure, and capability revocation propagation.

---

## Critical Items Addressed

### C-01: Health Check Protocol
**Finding:** No standardized health check protocol for tools, plugins, and providers.

**Resolution:** Added `HealthCheck` RPC to all three registries (Tool, Plugin, Provider) with standardized `HealthCheckRequest`/`HealthCheckResponse` messages. Components must respond within 5s. 3 consecutive failures mark component `UNHEALTHY` and remove from discovery.

**Sections Updated:** 8.1, 8.2, 9.1, 9.2, 10.1, 25.1, 25.9  
**New AC:** AC-028

---

### C-02: Dead Letter Queue
**Finding:** Failed tool executions had no dead letter queue for observability and replay.

**Resolution:** NATS JetStream stream `hermes.{tenant}.tool.dlq` with 7-day retention. Full execution context published on max retries exhausted. `ReplayTool` RPC with original `idempotency_key` for manual replay. Alert on DLQ depth > 100.

**Sections Updated:** 14.6, 17.2, 21.1, 27.1, 27.2  
**New AC:** AC-027

---

### C-03: MCP Gateway Specification
**Finding:** MCP Gateway lacked detailed specification for connection pooling, capability mapping, auth injection, protocol translation, streaming, rate limiting, health monitoring, and version negotiation.

**Resolution:** Complete specification table with 12 features including connection pool (min 2/max 10), exponential backoff reconnection (1s→30s, max 5 retries), YAML capability mapping schema, PASETO v4 token injection into `meta.auth.capability_token`, JSON-RPC 2.0 ↔ ACP translation, 1MB streaming chunks with auto-batching, per-server (100 req/s) and per-tool rate limits, ping/pong every 30s, protocol negotiation for 2024-11-05/2025-03-26.

**Sections Updated:** 12.3, 12.5, 25.5  
**New AC:** AC-029

---

### C-04: Multi-Tenant Registry Isolation
**Finding:** Registry queries could leak cross-tenant data.

**Resolution:** Enforced `tenant_id` namespace with PostgreSQL row-level security. Cross-tenant queries return 403 FORBIDDEN. Admin API requires explicit permission for cross-tenant queries.

**Sections Updated:** 8.1, 9.1, 10.1  
**New ACs:** AC-031, AC-038

---

### C-05: Provider Adapter Contract
**Finding:** Custom provider adapters had no standardized contract.

**Resolution:** Full gRPC service contract with 9 standard error codes (`UNAVAILABLE`, `RESOURCE_EXHAUSTED`, `INVALID_ARGUMENT`, `DEADLINE_EXCEEDED`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `INTERNAL`, `MODEL_NOT_FOUND`, `RATE_LIMITED`), bidirectional streaming for chat, JSON Schema for model parameters.

**Sections Updated:** 7.3, 25.7  
**New ACs:** AC-032, AC-039

---

### C-06: Plugin Dependency Resolution
**Finding:** Plugin dependencies lacked formal resolution algorithm.

**Resolution:** Complete specification with 5-step algorithm: (1) topological sort with cycle detection, (2) SemVer constraint solving for latest compatible versions, (3) conflict detection (no duplicate capabilities at different versions), (4) topological load order, (5) fail fast on circular dependencies. Conflict types: `VERSION_MISMATCH`, `CIRCULAR`, `CAPABILITY_CONFLICT`.

**Sections Updated:** 9.3 (new), 25.2  
**New AC:** AC-030

---

## High Priority Items Addressed

### H-01: Capability Discovery Search
**Resolution:** Natural language + field-based search with ranking, pagination, and caching. Query syntax: `field:value` (exact), `field:*value*` (wildcard), `text` (fuzzy). Fields: name, capability, category, type, version, tenant. Ranking: exact > prefix > fuzzy > overlap. Pagination: limit 100, offset, cursor. Caching: 5s TTL per tenant+query.

**Section:** 11.4 (new)  
**New AC:** AC-033

---

### H-02: Backpressure Handling
**Resolution:** Explicit backpressure in streaming architecture. NATS JetStream `max_pending` limits, producer throttling when consumer buffer full, 1MB max chunk size, auto-batching of small yields.

**Sections:** 17.2, 17.3

---

### H-03: Resource Exhaustion Handling
**Resolution:** Comprehensive table for 6 exhaustion scenarios: OOM, Fuel Exhaustion, Wall-Clock Timeout, Disk Full, Network Partition, SIGKILL/OOM Killer. Each with detection mechanism and response (kill instance, checkpoint recovery, circuit breaker, alert on-call).

**Sections:** 14.7, 18.3

---

### H-04: Upgrade/Downgrade Procedures
**Resolution:** Canary deployment (5%→25%→100% with health gates) with three migration policies: DRAIN (default, max 30 min), MIGRATE (checkpoint+restart, max 2 min), COEXIST (indefinite). Events: `version.deployed`, `version.drained`.

**Section:** 20.5 (new)  
**New AC:** AC-041

---

### H-05: CEL Sandbox
**Resolution:** Resource limits and allowlist for CEL expression evaluation. 10,000 instructions, 10ms wall time, 1MB memory. Allowlisted: `in`, `startsWith`, `endsWith`, `contains`, `matches`, `size`, `has`, `filter`, `map`, `all`, `exists`. Forbidden: file I/O, network, time, random, reflection.

**Section:** 15.5  
**New AC:** AC-034 (also covers H-09)

---

### H-06: Plugin Hook Timeout & Cancellation
**Resolution:** Timeout/cancellation behavior for all 4 hook types: pre-step (30s, abort), post-step (30s, log), compensate (300s, 3 retries), on-approval (24h, auto-reject). `CancellationToken` via `hook-context`, partial results on cancel, `hook-result` marked `cancelled`.

**Section:** 6.6 (new)  
**New AC:** AC-035

---

### H-07: Orchestration Checkpointing
**Resolution:** Per-step state serialization (output + context + tokens), global snapshot every 5 min or 5 steps, resume from last checkpoint skipping completed steps, `idempotency_key = plan_id + step_id` for safe re-execution, storage in PostgreSQL (metadata) + S3 (serialized state).

**Sections:** 16.4, 16.5  
**New AC:** AC-036

---

### H-08: MCP Server Versioning/Compatibility
**Resolution:** Protocol negotiation via MCP `initialize` handshake (supports 2024-11-05, 2025-03-26, fallback to 2024-11-05), 90-day deprecation with `deprecated: true`, versioned capability mapping (`mcp_tool@v1` → `hermes_capability@v1`), transport compatibility negotiated at `initialize`.

**Section:** 12.5 (new)  
**New AC:** AC-037

---

### H-09: CEL Sandbox (Duplicate of H-05)
**Resolution:** Covered by H-05 specification. Section 15.5 header reads `(H-05, H-09)`.

---

### H-10: Capability Revocation Propagation
**Resolution:** 5s propagation SLA via NATS pub/sub, sidecar cache invalidation within 100ms, in-flight operations gracefully terminated, all revocations logged to Merkle transparency log (RFC-0007).

**Sections:** 19.1, 24.3 (new)  
**New AC:** AC-040

---

## Structural Changes

### Header
- **Status:** Draft → Approved
- **Version:** 1.0 → 1.1

### Design Principles (Section 3)
Added two new principles:
- **Health-Aware Operations** — Standard health checks for all components; automatic failure detection
- **Resilient by Default** — Dead letter queues, circuit breakers, fallback chains, graceful degradation

### Architecture Diagrams (Section 27)
- **27.1 Tool Execution Flow:** Added DLQ alt path with `Publish to DLQ (C-02)` and `Alert on-call`
- **27.2 Provider Routing & Fallback:** Added `Max retries exhausted → Publish to DLQ (C-02) → Alert on-call`

### Protobuf Annotations (Section 25)
Added review item annotations to service definitions:
- `ToolRegistry` — `(C-01)` on HealthCheck
- `MCPGateway` — `(C-03)`
- `ProviderRouter` — `(C-05)`
- `ModelOrchestrator` — `(H-07)`
- `QuotaManager` — `(C-01)`

### Glossary (Section 29)
Added 10 new terms: Dead Letter Queue, Health Check, Multi-Tenant Isolation, Plugin Dependency Resolution, CEL Sandbox, Orchestration Checkpointing, MCP Server Versioning, Provider Adapter Contract, Capability Revocation Propagation.

---

## Acceptance Criteria Changes

**Total ACs:** 26 → 41 (+15)

### New Acceptance Criteria
| AC | Title | Review Item |
|----|-------|-------------|
| AC-027 | Dead Letter Queue | C-02 |
| AC-028 | Health Check Protocol | C-01 |
| AC-029 | MCP Gateway Specification | C-03 |
| AC-030 | Plugin Dependency Resolution | C-06 |
| AC-031 | Multi-Tenant Registry Isolation | C-04 |
| AC-032 | Provider Adapter Contract | C-05 |
| AC-033 | Capability Discovery Search | H-01 |
| AC-034 | CEL Sandbox | H-05, H-09 |
| AC-035 | Plugin Hook Timeout & Cancellation | H-06 |
| AC-036 | Orchestration Checkpointing | H-07 |
| AC-037 | MCP Server Versioning | H-08 |
| AC-038 | Multi-Tenant Registry Isolation (dup) | C-04 |
| AC-039 | Provider Adapter Contract (dup) | C-05 |
| AC-040 | Capability Revocation Propagation | H-10 |
| AC-041 | In-Flight Migration Policy | H-04 |

---

## Cross-RFC Alignment

All changes maintain alignment with approved RFCs:
- RFC-0002 v1.1: WASM sandbox, ACP, Task Orchestrator
- RFC-0003 v1.1: NATS JetStream topics, consumer groups, DLQ
- RFC-0004 v1.1: Provider adapters, protocol translation
- RFC-0005 v1.1: Memory host functions (working/episodic/semantic)
- RFC-0006 v1.1: Knowledge host functions (search/retrieve/ingest)
- RFC-0007 v1.1: SPIFFE, PASETO, Envoy egress, audit, Merkle log
- RFC-0008 v1.1: Agent Runtime (tool execution, provider routing, warm pools, checkpoints)

---

## Files Modified

| File | Description |
|------|-------------|
| RFC-0009-Hermes-Tool-Plugin-Provider-Architecture-v1.1.md | Canonical RFC v1.1 |
| RFC-0009-Changelog-v1.0-to-v1.1.md | This document |
| RFC-0009-Review-Items-Addressed.md | Detailed review item mapping |
| RFC-0009-Deferred-Items.md | Deferred items (none) |
| RFC-0009-Acceptance-Criteria-v1.1.md | Updated ACs (41 total) |

---

## Verification

- ✅ All 6 Critical items addressed
- ✅ All 10 High Priority items addressed
- ✅ All affected sections updated
- ✅ Architecture diagrams updated
- ✅ Protobuf definitions updated with annotations
- ✅ Acceptance criteria updated (41 total)
- ✅ Cross-RFC alignment maintained
- ✅ No existing content removed
- ✅ Version 1.1, Status Approved
- ✅ Design Principles extended