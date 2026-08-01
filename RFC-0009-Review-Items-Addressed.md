# RFC-0009 Review Items Addressed

**Date:** 2026-07-25  
**Review:** Principal Enterprise Architect Review  
**Verdict:** APPROVED WITH CHANGES  
**Status:** All items incorporated into RFC-0009 v1.1

---

## Review Summary

| Category | Count | Status |
|----------|-------|--------|
| Critical (C-01 to C-06) | 6 | ✅ All Addressed |
| High Priority (H-01 to H-10) | 10 | ✅ All Addressed |
| **Total** | **16** | **✅ 16/16 Complete** |

---

## Critical Items (C-01 to C-06)

### C-01: Health Check Protocol ✅
**Review Finding:** Registries lacked standardized health check endpoints for tools, plugins, and providers.

**Resolution:** Added `HealthCheck` RPC to all three registry services with standardized request/response messages.

| Section | Change |
|---------|--------|
| 8.1 | Added "Health Monitoring" and "Multi-Tenant Isolation" responsibilities |
| 8.2 | Added `rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse)` to ToolRegistry |
| 8.2 | Added `HealthCheckRequest` and `HealthCheckResponse` protobuf messages |
| 9.1 | Added "Health Monitoring" and "Multi-Tenant Isolation" responsibilities |
| 9.2 | Added `HealthCheck` RPC to PluginRegistry |
| 9.2 | Added `HealthCheckRequest`, `HealthCheckResponse`, `ResolveDependenciesRequest/Response`, `DependencyConflict` messages |
| 10.1 | Added "Multi-Tenant Isolation" responsibility |
| 25.1 | Annotated `HealthCheck` with `(C-01)` |
| 25.9 | Annotated QuotaManager with `(C-01)` |
| AC-028 | New acceptance criteria for Health Check Protocol |

**Health Check Behavior:** Components must respond within 5s. 3 consecutive failures → marked `UNHEALTHY` → removed from discovery → `health.failed` event published → replacement started if pool < min_warm.

---

### C-02: Dead Letter Queue (DLQ) ✅
**Review Finding:** Failed tool executions had no persistent queue for inspection, replay, or alerting.

**Resolution:** Complete DLQ specification using NATS JetStream.

| Section | Change |
|---------|--------|
| 14.6 (new) | Dead Letter Queue specification with 6 aspects: Trigger, Storage, Payload, Alerting, Replay, Retention |
| 17.2 | Streaming protocol includes DLQ path |
| 21.1 | Added `Tool DLQ` event: `hermes.{tenant}.tool.dlq.new` |
| 27.1 | Tool Execution Flow diagram: added DLQ alt path for max retries exhausted |
| 27.2 | Provider Routing diagram: added DLQ branch for max retries exhausted |
| AC-027 | New acceptance criteria for Dead Letter Queue |

**DLQ Spec:** Stream `hermes.{tenant}.tool.dlq`, 7-day retention, full execution context payload, alert if depth > 100, replay via `ReplayTool` RPC with original `idempotency_key`, manual approval required.

---

### C-03: MCP Gateway Specification ✅
**Review Finding:** MCP integration underspecified — missing connection pooling, auth injection, protocol translation, streaming, reconnection logic, version negotiation.

**Resolution:** 13 detailed MCP Gateway requirements in tabular format.

| Section | Change |
|---------|--------|
| 12.3 (revised) | Complete MCP Gateway specification table with 13 features |
| 12.5 (new) | MCP Server Versioning/Compatibility (H-08) |
| 25.5 | Annotated MCPGateway with `(C-03)` |
| AC-029 | New acceptance criteria for MCP Gateway Specification |

**Key Features:**
- Connection pool: min 2, max 10, 30s idle timeout
- Reconnection: exponential backoff 1s→2s→4s→8s→16s→30s, max 5 retries
- Capability mapping: YAML schema `mcp_tool_name` → `hermes_capability`
- Auth injection: PASETO v4 in `meta.auth.capability_token`
- Protocol translation: JSON-RPC 2.0 `tools/call` ↔ ACP `tool.execute`
- Streaming: max 1MB chunks, auto-batch <1KB yields within 10ms
- Rate limiting: 100 req/s per server, configurable per tool
- Health monitoring: ping/pong every 30s, 3 failures = DISCONNECTED
- Protocol negotiation: supports 2024-11-05, 2025-03-26, fallback to 2024-11-05

---

### C-04: Multi-Tenant Registry Isolation ✅
**Review Finding:** Registry queries could potentially leak cross-tenant data.

**Resolution:** Enforced tenant isolation at database and API level.

| Section | Change |
|---------|--------|
| 8.1 | Added "Multi-Tenant Isolation" responsibility |
| 9.1 | Added "Multi-Tenant Isolation" responsibility |
| 10.1 | Added "Multi-Tenant Isolation" responsibility |
| AC-031 | New AC for Multi-Tenant Registry Isolation |
| AC-038 | Duplicate AC for Multi-Tenant Registry Isolation |

**Implementation:** PostgreSQL row-level security on `tenant_id` namespace. Cross-tenant queries return 403 FORBIDDEN. Admin API requires explicit permission for cross-tenant queries.

---

### C-05: Provider Adapter Contract ✅
**Review Finding:** Custom provider adapters had no standardized contract.

**Resolution:** Full gRPC service contract with standard error codes, streaming, and parameter schemas.

| Section | Change |
|---------|--------|
| 7.3 | Annotated Provider Interface with `(C-05)` |
| 7.3 | Added `ProviderError` with 9 standard error codes |
| 25.7 | Annotated ProviderRouter with `(C-05)` |
| AC-032 | New AC for Provider Adapter Contract |
| AC-039 | Duplicate AC for Provider Adapter Contract |

**Contract:** All 9 error codes (`UNAVAILABLE`, `RESOURCE_EXHAUSTED`, `INVALID_ARGUMENT`, `DEADLINE_EXCEEDED`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `INTERNAL`, `MODEL_NOT_FOUND`, `RATE_LIMITED`), bidirectional streaming for chat, JSON Schema for model parameters.

---

### C-06: Plugin Dependency Resolution ✅
**Review Finding:** Plugin dependencies had no formal resolution algorithm.

**Resolution:** Complete specification with topological sort, SemVer constraint solving, and conflict detection.

| Section | Change |
|---------|--------|
| 9.3 (new) | Plugin Dependency Resolution algorithm with 5 steps |
| 9.3 | Conflict types: `VERSION_MISMATCH`, `CIRCULAR`, `CAPABILITY_CONFLICT` |
| 25.2 | Added `ResolveDependencies` RPC to PluginRegistry |
| AC-030 | New AC for Plugin Dependency Resolution |

**Algorithm:** 1) Topological sort with cycle detection, 2) SemVer constraint solving for latest compatible versions, 3) Conflict detection (no duplicate capabilities at different versions), 4) Topological load order, 5) Fail fast on circular dependencies.

---

## High Priority Items (H-01 to H-10)

### H-01: Capability Discovery Search ✅
**Resolution:** Natural language + field-based search with ranking, pagination, caching.

| Section | Change |
|---------|--------|
| 11.4 (new) | Capability Discovery Search specification table |
| AC-033 | New AC for Capability Discovery Search |

**Spec:** Query syntax `field:value` (exact), `field:*value*` (wildcard), `text` (fuzzy). Fields: name, capability, category, type, version, tenant. Ranking: exact > prefix > fuzzy > overlap. Pagination: limit 100, offset, cursor. Caching: 5s TTL per tenant+query.

---

### H-02: Backpressure Handling ✅
**Resolution:** Explicit backpressure in streaming architecture.

| Section | Change |
|---------|--------|
| 17.2 | ACP streaming protocol with chunk structure |
| 17.3 | Backpressure handling: NATS `max_pending`, producer throttling, 1MB chunk limit, auto-batching |

---

### H-03: Resource Exhaustion Handling ✅
**Resolution:** Comprehensive table for 6 exhaustion scenarios.

| Section | Change |
|---------|--------|
| 14.7 | Resource Exhaustion Handling table (6 conditions) |
| 18.3 | Duplicate table in Resource Quotas section |
| AC-027, AC-028 | Referenced in DLQ and Health Check ACs |

**Conditions:** OOM, Fuel Exhaustion, Wall-Clock Timeout, Disk Full, Network Partition, SIGKILL/OOM Killer. Each with detection mechanism and response.

---

### H-04: Upgrade/Downgrade Procedures ✅
**Resolution:** Canary deployment with three migration policies.

| Section | Change |
|---------|--------|
| 20.5 (new) | Upgrade/Downgrade Procedures table with 3 policies |
| AC-041 | New AC for In-Flight Migration Policy |

**Policies:** Canary (5%→25%→100% with health gates), DRAIN (default, max 30 min), MIGRATE (checkpoint+restart, max 2 min), COEXIST (indefinite). Events: `version.deployed`, `version.drained`.

---

### H-05: CEL Sandbox ✅
**Resolution:** Resource limits and allowlist for CEL expression evaluation.

| Section | Change |
|---------|--------|
| 15.5 | CEL Sandbox specification table (H-05, H-09) |
| AC-034 | New AC for CEL Sandbox |

**Limits:** 10,000 instructions, 10ms wall time, 1MB memory. Allowlisted: `in`, `startsWith`, `endsWith`, `contains`, `matches`, `size`, `has`, `filter`, `map`, `all`, `exists`. Forbidden: file I/O, network, time, random, reflection.

---

### H-06: Plugin Hook Timeout & Cancellation ✅
**Resolution:** Timeout/cancellation behavior for all 4 hook types.

| Section | Change |
|---------|--------|
| 6.6 (new) | Plugin Hook Timeout & Cancellation table |
| AC-035 | New AC for Plugin Hook Timeout & Cancellation |

**Timeouts:** pre-step 30s (abort), post-step 30s (log), compensate 300s (3 retries), on-approval 24h (auto-reject). `CancellationToken` via `hook-context`, partial results on cancel.

---

### H-07: Orchestration Checkpointing ✅
**Resolution:** Per-step state, periodic global snapshots, resume capability.

| Section | Change |
|---------|--------|
| 16.4 | Orchestration Checkpointing specification |
| 16.5 | Orchestration State Management (duplicate for emphasis) |
| AC-036 | New AC for Orchestration Checkpointing |

**Spec:** Per-step serialized (output + context + tokens), global snapshot every 5 min or 5 steps, resume from last checkpoint, `idempotency_key = plan_id + step_id`, storage: PostgreSQL (metadata) + S3 (serialized state).

---

### H-08: MCP Server Versioning/Compatibility ✅
**Resolution:** Protocol negotiation, deprecation policy, versioned mapping.

| Section | Change |
|---------|--------|
| 12.5 | MCP Server Versioning/Compatibility table |
| AC-037 | New AC for MCP Server Versioning |

**Spec:** MCP `initialize` handshake, supports 2024-11-05 and 2025-03-26, fallback to 2024-11-05, 90-day deprecation with `deprecated: true`, versioned capability mapping `mcp_tool@v1` → `hermes_capability@v1`, transport negotiated at `initialize`.

---

### H-09: CEL Sandbox (Duplicate of H-05) ✅
**Resolution:** Covered by H-05 specification. Section 15.5 header reads `(H-05, H-09)`.

---

### H-10: Capability Revocation Propagation ✅
**Resolution:** 5s SLA, NATS pub/sub, 100ms cache invalidation, Merkle log audit.

| Section | Change |
|---------|--------|
| 19.1 | Added `revoke_propagation` Rego rule |
| 24.3 (new) | Capability Revocation Propagation specification table |
| AC-040 | New AC for Capability Revocation Propagation |

**Spec:** Max 5s propagation SLA, NATS pub/sub for instant push, sidecar cache invalidation within 100ms, in-flight operations gracefully terminated, all revocations logged to Merkle transparency log (RFC-0007).

---

## Supporting Documents Created

| Document | Description |
|----------|-------------|
| RFC-0009-Hermes-Tool-Plugin-Provider-Architecture-v1.1.md | Canonical RFC v1.1 |
| RFC-0009-Changelog-v1.0-to-v1.1.md | This changelog |
| RFC-0009-Review-Items-Addressed.md | This document |
| RFC-0009-Deferred-Items.md | Deferred items (none) |
| RFC-0009-Acceptance-Criteria-v1.1.md | Updated ACs (41 total) |

---

## Verification Checklist

- [x] All 6 Critical items (C-01 to C-06) addressed
- [x] All 10 High Priority items (H-01 to H-10) addressed
- [x] All affected sections updated
- [x] Architecture diagrams updated (27.1, 27.2)
- [x] Protobuf definitions updated with annotations
- [x] Acceptance criteria updated (41 total, +15 new)
- [x] Cross-RFC alignment maintained (RFC-0002 through RFC-0008 v1.1)
- [x] No existing content removed
- [x] Version updated to 1.1, Status to Approved
- [x] Design Principles extended (Health-Aware, Resilient by Default)