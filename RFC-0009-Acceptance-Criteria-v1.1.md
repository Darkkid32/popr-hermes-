# RFC-0009 Acceptance Criteria v1.1

**Status:** Approved  
**Version:** 1.1  
**Date:** 2026-07-25  
**Review:** Principal Enterprise Architect Review  
**Total Criteria:** 41 (26 original + 15 new)

---

## Original Acceptance Criteria (AC-001 through AC-026)

### AC-001: Tool Registry Registration
**Given** a valid tool manifest with WASM module reference  
**When** `RegisterTool` is called  
**Then** the tool is stored with ACTIVE status and `tool.lifecycle.created` event published

### AC-002: Tool Discovery by Capability
**Given** tools registered with capabilities  
**When** `DiscoverTools` is called with capability filter  
**Then** all tools with matching capabilities returned within 20ms p99

### AC-003: Plugin Registry Registration
**Given** a valid plugin manifest with WASM component reference  
**When** `RegisterPlugin` is called  
**Then** the plugin is stored with ACTIVE status and `plugin.lifecycle.created` event published

### AC-004: Provider Registry Registration
**Given** a valid provider manifest with capabilities and models  
**When** `RegisterProvider` is called  
**Then** the provider is stored with ACTIVE status and `provider.lifecycle.created` event published

### AC-005: Capability Discovery Unified Index
**Given** tools, plugins, and providers registered  
**When** `DiscoverByCapability` is called  
**Then** unified results returned from all three registries

### AC-006: MCP Server Registration
**Given** a valid MCP server manifest  
**When** `RegisterServer` is called on MCPGateway  
**Then** server stored with CONNECTING status, connection pool established

### AC-007: WASM Sandbox Execution
**Given** a tool execution request with valid capability token  
**When** Tool Executor loads WASM module  
**Then** module signature verified, instance created with fuel/memory limits, execution proceeds

### AC-008: Tool Capability Enforcement
**Given** a tool requiring capabilities `["code.exec", "file.read"]`  
**When** execution requested with capability token lacking `code.exec`  
**Then** execution rejected with `CAPABILITY_DENIED` error

### AC-009: Tool Timeout Enforcement
**Given** a tool with `max_time_ms=5000`  
**When** execution exceeds 5000ms wall-clock time  
**Then** instance killed, `TIMEOUT` status returned

### AC-010: Tool Fuel Limit Enforcement
**Given** a tool with `max_fuel=1000000`  
**When** WASM instructions exceed fuel limit  
**Then** instance killed, `RESOURCE_EXCEEDED` status returned

### AC-011: Streaming Tool Execution
**Given** a streaming-capable tool  
**When** `ExecuteStream` is called  
**Then** chunks yielded via ACP STREAM, final chunk marked `is_final=true`

### AC-012: Provider Routing with Fallback
**Given** primary provider returns error  
**When** circuit breaker open or error threshold exceeded  
**Then** request routed to next provider in fallback chain

### AC-013: Circuit Breaker Operation
**Given** provider with 5 errors in 10s  
**When** error threshold reached  
**Then** circuit breaker opens for 30s, half-open test request sent

### AC-014: Token Budget Enforcement
**Given** tenant with 100K tokens/hour budget  
**When** budget would be exceeded by request  
**Then** request rejected with `QUOTA_EXCEEDED` before provider call

### AC-015: Multi-Model Orchestration
**Given** orchestration plan with 3 dependent steps  
**When** `Execute` called  
**Then** steps execute in dependency order, context passed via `output_mapping`

### AC-016: Orchestration Streaming
**Given** multi-step orchestration plan  
**When** `ExecuteStream` called  
**Then** progress events streamed for each step with partial outputs

### AC-017: Provider Streaming
**Given** LLM provider supporting streaming  
**When** `ChatStream` called  
**Then** token chunks streamed via bidirectional gRPC stream

### AC-018: MCP Tool Execution
**Given** registered MCP server with stdio transport  
**When** agent invokes MCP tool  
**Then** MCP Gateway translates JSON-RPC to ACP, capability token injected

### AC-019: Capability Token Issuance
**Given** agent spawn with declared capabilities  
**When** Security Service issues PASETO v4 token  
**Then** token includes capabilities, delegation_chain, max_delegation_depth=3, token_budget

### AC-020: Event Publishing
**Given** tool execution completes  
**When** result available  
**Then** `tool.execution.completed` published to NATS with execution_id, status, metrics

### AC-021: Multi-Tenant Registry Isolation
**Given** tenant A and tenant B sharing registry  
**When** tenant A queries tools  
**Then** only tenant A's tools returned, cross-tenant queries return 403

### AC-022: Version Compatibility
**Given** tool v1.2.0 requires runtime >=1.0.0 <2.0.0  
**When** agent runtime v1.5.0 spawns  
**Then** tool version resolved and validated against compatibility matrix

### AC-023: Resource Quota Enforcement
**Given** tenant with 100 cores CPU quota  
**When** agent spawn would exceed quota  
**Then** spawn rejected, `QUOTA_EXCEEDED` event published

### AC-024: Tool Result Caching
**Given** idempotent tool with idempotency key  
**When** same input executed twice  
**Then** second execution returns cached result from Redis/PostgreSQL

### AC-025: Plugin Lifecycle Management
**Given** plugin with dependencies  
**When** plugin loaded  
**Then** dependencies resolved topologically, loaded first, `plugin.loaded` event published

### AC-026: Cross-RFC Alignment
**Given** complete Hermes Agent OS v2 architecture  
**When** Extensibility Architecture deployed  
**Then** integrates with RFC-0002 through RFC-0008 v1.1

---

## New Acceptance Criteria (AC-027 through AC-041)

### AC-027: Dead Letter Queue (C-02)
**Given** a tool execution that fails after maximum retry attempts  
**When** the Tool Executor exhausts all retry attempts  
**Then** the execution context is published to the NATS Dead Letter Queue  
**And** the `hermes.{tenant}.tool.dlq.new` event is published  
**And** an alert is sent to on-call if DLQ depth exceeds 100  
**And** the execution can be replayed via `ReplayTool` RPC with original `idempotency_key`

### AC-028: Health Check Protocol (C-01)
**Given** a registered tool, plugin, or provider  
**When** the registry performs a health check  
**Then** the component responds to `HealthCheck` RPC within 5s  
**And** the registry tracks consecutive failures  
**After** 3 consecutive failures, the component is marked `UNHEALTHY`  
**And** the component is removed from discovery results  
**And** `hermes.{tenant}.{component}.health.failed` event is published  
**And** a replacement is started if pool size < min_warm

### AC-029: MCP Gateway Specification (C-03)
**Given** an MCP server registered with stdio transport  
**When** an agent invokes an MCP tool  
**Then** the MCP Gateway establishes a connection pool (min 2, max 10)  
**And** maps MCP tool names to Hermes capabilities via YAML schema  
**And** injects PASETO v4 token into JSON-RPC `meta.auth.capability_token`  
**And** translates JSON-RPC 2.0 `tools/call` to ACP `tool.execute`  
**And** supports streaming with max 1MB chunks, auto-batching <1KB yields  
**And** enforces per-server (100 req/s) and per-tool rate limits  
**And** performs ping/pong health checks every 30s  
**And** auto-reconnects with exponential backoff (1s, 2s, 4s, 8s, max 30s)

### AC-030: Plugin Dependency Resolution (C-06)
**Given** a plugin with declared dependencies  
**When** the plugin is loaded  
**Then** the Plugin Registry resolves dependencies via topological sort  
**And** selects latest versions satisfying all semver constraints  
**And** detects and rejects `VERSION_MISMATCH`, `CIRCULAR`, `CAPABILITY_CONFLICT`  
**And** loads dependencies in topological order before the plugin

### AC-031: Multi-Tenant Registry Isolation (C-04)
**Given** multiple tenants sharing a registry  
**When** a tenant queries for tools/plugins/providers  
**Then** results are filtered by `tenant_id` namespace  
**And** row-level security prevents cross-tenant data access  
**And** cross-tenant queries return 403 FORBIDDEN  
**And** admin API can query across tenants with explicit permission

### AC-032: Provider Adapter Contract (C-05)
**Given** a custom provider adapter  
**When** the adapter is registered  
**Then** the adapter implements the full `Provider` gRPC service  
**And** supports all error codes: `UNAVAILABLE`, `RESOURCE_EXHAUSTED`, `INVALID_ARGUMENT`, `DEADLINE_EXCEEDED`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `INTERNAL`, `MODEL_NOT_FOUND`, `RATE_LIMITED`  
**And** supports bidirectional streaming for chat  
**And** exposes JSON Schema for model-specific parameters

### AC-033: Capability Discovery Search (H-01)
**Given** tools, plugins, and providers registered  
**When** a capability discovery query is issued for "llm.chat"  
**Then** all providers with `llm.chat` capability are returned  
**And** compatible plugins/tools are included  
**And** results ranked: exact capability match > prefix > fuzzy > overlap  
**And** response latency under 20ms p99  
**And** 5s TTL caching per tenant+query

### AC-034: CEL Sandbox (H-05, H-09)
**Given** a routing rule with CEL expression  
**When** the Provider Router evaluates the rule  
**Then** evaluation is limited to 10,000 instructions  
**And** wall-clock time limited to 10ms  
**And** memory limited to 1MB  
**And** only allowlisted functions permitted (`in`, `startsWith`, `endsWith`, `contains`, `matches`, `size`, `has`, `filter`, `map`, `all`, `exists`)  
**And** file I/O, network, time, random, reflection are forbidden  
**And** violations return `INVALID_ARGUMENT` with details

### AC-035: Plugin Hook Timeout & Cancellation (H-06)
**Given** a workflow with plugin hooks  
**When** a `pre-step` hook exceeds 30s timeout  
**Then** the step is aborted and error returned to workflow  
**When** a `compensate` hook is cancelled  
**Then** hook retries up to 3x with exponential backoff  
**And** escalation event published on final failure  
**When** `CancellationToken` is triggered  
**Then** hook returns partial results if possible  
**And** `hook-result` marked as `cancelled`

### AC-036: Orchestration Checkpointing (H-07)
**Given** a multi-model orchestration plan  
**When** the Model Orchestrator executes the plan  
**Then** per-step state is serialized (output + context + token usage)  
**And** global snapshot taken every 5 min or 5 steps  
**And** on failure, resume from last checkpoint skipping completed steps  
**And** steps use `idempotency_key = plan_id + step_id` for safe re-execution  
**And** checkpoints stored in PostgreSQL (metadata) + S3 (serialized state)

### AC-037: MCP Server Versioning (H-08)
**Given** an MCP server registered with stdio transport  
**When** the server is initialized  
**Then** MCP `initialize` handshake negotiates protocol version  
**And** Hermes supports 2024-11-05, 2025-03-26; fallback to 2024-11-05  
**And** capability deprecation follows 90-day notice with `deprecated: true`  
**And** capability mapping is versioned: `mcp_tool@v1` → `hermes_capability@v1`  
**And** transport compatibility negotiated at `initialize` (stdio, SSE, WebSocket, HTTP)

### AC-038: Multi-Tenant Registry Isolation (C-04)
**Given** multiple tenants sharing a registry  
**When** a tenant queries for tools/plugins/providers  
**Then** results are filtered by `tenant_id` namespace  
**And** row-level security prevents cross-tenant data access  
**And** cross-tenant queries return 403 FORBIDDEN  
**And** admin API can query across tenants with explicit permission

### AC-039: Provider Adapter Contract (C-05)
**Given** a custom provider adapter  
**When** the adapter is registered  
**Then** the adapter implements the full `Provider` gRPC service  
**And** supports all error codes: `UNAVAILABLE`, `RESOURCE_EXHAUSTED`, `INVALID_ARGUMENT`, `DEADLINE_EXCEEDED`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `INTERNAL`, `MODEL_NOT_FOUND`, `RATE_LIMITED`  
**And** supports bidirectional streaming for chat  
**And** exposes JSON Schema for model-specific parameters

### AC-040: Capability Revocation Propagation (H-10)
**Given** a capability revocation event  
**When** the Security Service revokes a capability  
**Then** the revocation is pushed via NATS pub/sub to all sidecars within 5s  
**And** sidecars invalidate local capability cache within 100ms  
**And** any in-flight operations with revoked capability are gracefully terminated  
**And** the revocation is logged to the Merkle transparency log

### AC-041: In-Flight Migration Policy (H-04)
**Given** a new component version is deployed  
**When** the rollout policy is DRAIN (default)  
**Then** in-flight agents complete on old version (max 30 min drain time)  
**And** new tasks are assigned to new version agents  
**And** `hermes.{tenant}.component.version.drained` event published when old version pool empty  
**When** policy is MIGRATE  
**Then** agents checkpoint and restart on new version  
**And** max migration time per agent: 2 min  
**When** policy is COEXIST  
**Then** both versions run indefinitely  
**And** traffic split by version label

---

## Traceability Matrix

| Review Item | AC(s) | Sections |
|-------------|-------|----------|
| C-01 | AC-028 | 8.1, 8.2, 9.1, 9.2, 10.1, 25.1, 25.9 |
| C-02 | AC-027 | 14.6, 17.2, 21.1, 27.1, 27.2 |
| C-03 | AC-029 | 12.3, 12.5, 25.5 |
| C-04 | AC-031, AC-038 | 8.1, 9.1, 10.1 |
| C-05 | AC-032, AC-039 | 7.3, 25.7 |
| C-06 | AC-030 | 9.3, 25.2 |
| H-01 | AC-033 | 11.4 |
| H-02 | — | 17.2, 17.3 |
| H-03 | — | 14.7, 18.3 |
| H-04 | AC-041 | 20.5 |
| H-05 | AC-034 | 15.5 |
| H-06 | AC-035 | 6.6 |
| H-07 | AC-036 | 16.4, 16.5 |
| H-08 | AC-037 | 12.5 |
| H-09 | AC-034 | 15.5 |
| H-10 | AC-040 | 19.1, 24.3 |

---

## Verification

- ✅ All 41 acceptance criteria are testable and specific
- ✅ Each review item maps to at least one AC
- ✅ ACs reference specific sections and behaviors
- ✅ No AC conflicts with existing criteria
- ✅ Cross-RFC alignment maintained