# RFC-0004: Hermes Gateway & Communication Architecture — Principal Enterprise Architect Review

**Reviewer:** Principal Enterprise Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Status:** Draft  
**Depends On:** RFC-0001, RFC-0002 v1.1, RFC-0003 v1.1

---

## 1. Executive Summary

RFC-0004 is a **comprehensive, well-structured specification** for the Hermes Gateway that demonstrates strong architectural thinking across protocol translation, session management, real-time synchronization, file transfer, and multi-region routing. It correctly positions the Gateway as the single ingress/egress point and aligns well with RFC-0002 v1.1 (Core) and RFC-0003 v1.1 (Event Bus).

**Overall Assessment: APPROVED WITH CHANGES**

The architecture is fundamentally sound but has **5 Critical** and **8 High-priority** gaps that must be resolved before implementation. These are primarily around protocol adapter specifications, sync conflict resolution details, WebSocket connection limits, observability correlations, and security hardening.

---

## 2. Strengths

| Area | Strength |
|------|----------|
| **Single Ingress Principle** | Clear mandate: no client talks to Core directly; all traffic via Gateway |
| **Protocol Adapter Pattern** | Clean abstraction for Telegram, Discord, WhatsApp, MCP → internal gRPC |
| **WebSocket + SSE Fallback** | Pragmatic choice for real-time; SSE for firewall-friendly environments |
| **Chunked Upload Protocol** | Well-specified: 5 MB chunks, SHA-256 per chunk, resumable, 7-day TTL |
| **CRDT Sync (Automerge)** | Correct choice for message/presence sync; server-authoritative for workflows |
| **Backpressure Propagation** | NATS signal → Gateway throttle → Client event; end-to-end flow defined |
| **Session Resume** | Within 5 min: resume with missed events; >5 min: full re-auth |
| **Multi-Region Routing** | GeoDNS → nearest Gateway → NATS supercluster; data residency support |
| **Rate Limiting Tiers** | Token bucket with 5 tiers (Anonymous → Service); endpoint-specific overrides |
| **Observability Foundation** | W3C trace context propagation, structured JSON logs, Prometheus metrics |
| **Security Headers** | Complete CSP, HSTS, COOP, CORP, Permissions-Policy |
| **File Transfer** | Signed URL downloads, Range requests, streaming (no buffering) |

---

## 3. Weaknesses

| Area | Weakness |
|------|----------|
| **Protocol Adapter Specifications** | Telegram/Discord/WhatsApp/MCP adapters mentioned but no API contracts, webhook signatures, retry policies, or rate limits per adapter |
| **WebSocket Connection Limits** | "1M concurrent connections" target but no per-IP, per-tenant, or per-workspace connection quotas |
| **Sync Conflict Resolution** | Automerge for messages is correct but no spec for: concurrent workflow actions, file metadata conflicts, agent config drift |
| **Event Bridge Filtering** | Four filters listed but no implementation: how are subscriptions managed? Wildcard support? Permission changes mid-stream? |
| **Observability Correlation** | W3C trace context propagated but no spec for: span linking across Gateway→Core, baggage for multi-tenant queries |
| **gRPC Retry Policy** | Connection pool defined but no retry/hedging policy for transient Core failures |
| **Token Refresh Race** | Sliding window refresh on activity but no spec for concurrent refresh requests (double-issue) |
| **Mobile Offline Queue** | SQLite mentioned but no schema, size limits, encryption, or background sync scheduler spec |
| **WhatsApp Adapter** | "Webhook" only — no Cloud API integration, template message handling, or opt-in management |
| **MCP Adapter** | Listed but no spec for tool discovery, capability negotiation, or streamable HTTP transport |

---

## 4. Missing Components

| # | Component | Required By | Impact |
|---|-----------|-------------|--------|
| 1 | **Protocol Adapter Contracts** | §3.1, §25.3 | Cannot implement Telegram/Discord/WhatsApp/MCP without specs |
| 2 | **WebSocket Quota System** | §4.3, §16, §22 | No protection against connection exhaustion per tenant/IP |
| 3 | **Sync Subscription Management** | §11, §15 | How clients subscribe/unsubscribe; wildcard support; permission changes |
| 3 | **gRPC Retry/Hedging Policy** | §7.2 | Transient Core failures will cascade to clients |
| 4 | **Token Refresh Concurrency Control** | §8, §10 | Double-issue risk under concurrent requests |
| 5 | **Mobile Offline Schema** | §18.4, §19 | SQLite schema, encryption, size limits, sync scheduler |
| 6 | **WhatsApp Cloud API Spec** | §3.1, §25.3 | Template messages, opt-in, webhook verification |
| 7 | **MCP Adapter Spec** | §3.1, §25.3 | Tool discovery, capability negotiation, streamable HTTP |
| 8 | **Event Bridge Subscription API** | §11.2, §15 | Subscribe/unsubscribe, wildcards, permission changes |
| 9 | **Span Linking Spec** | §7.3, §25.7 | Gateway→Core trace correlation for debugging |
| 10 | **Connection Drain on Deploy** | §18, §23.2 | Graceful WebSocket close during rolling updates |
| 11 | **Tenant-Aware Rate Limit Quotas** | §16, §3.4 | Per-tenant custom limits beyond tiers |
| 12 | **File Upload Malware Scan Integration** | §13.1, §25.5 | Async scan, quarantine, callback on completion |

---

## 5. Architectural Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| **GWY-001** | **Protocol Adapter Sprawl** — Each adapter becomes custom code with inconsistent error handling, retries, observability | High | High | Define adapter SDK with base class, standard middleware, contract tests |
| **GWY-002** | **WebSocket Connection Exhaustion** — No per-tenant/IP limits; single tenant can starve others | High | Critical | Implement connection quotas (§16.1 enhancement) |
| **GWY-003** | **Sync Split-Brain** — CRDT merge conflicts on workflow state (server-authoritative) + local edits | Medium | High | Explicit conflict resolution rules; reject local workflow edits |
| **GWY-004** | **Event Bridge Backlog** — Slow consumer causes NATS consumer lag; missed events on reconnect | Medium | High | Consumer lag alerts; max delivery attempts; replay from sequence |
| **GWY-005** | **Token Refresh Storm** — Concurrent requests trigger parallel refresh → multiple valid access tokens | High | Medium | Single-flight refresh per session (Redis lock) |
| **GWY-006** | **gRPC Cascade Failure** — Core latency spike → Gateway thread pool exhaustion → 503 cascade | Medium | Critical | Retry budget, hedging, circuit breaker per service |
| **GWY-007** | **Mobile Offline Data Loss** — SQLite unencrypted, no size limit, no background sync guarantee | Medium | High | Encrypt DB; max size; WorkManager/BackgroundTasks scheduler |
| **GWY-008** | **WhatsApp Template Rejection** — No template approval flow; messages fail silently | High | Medium | Template management UI; pre-send validation |
| **GWY-009** | **MCP Tool Discovery Stale** — Agent capabilities change but MCP adapter caches old manifest | Medium | Medium | TTL cache + invalidation via `hermes.agent.capabilities.changed` |
| **GWY-010** | **Span Context Loss** — Gateway→Core gRPC metadata not linked to client trace | Medium | High | Mandatory span linking; baggage for tenant/workspace |

---

## 6. Recommendations

### 6.1 Structural Changes (Do Before Approval)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 1 | **Define Protocol Adapter SDK** — Base class with standard middleware (retry, metrics, tracing, auth), contract tests per adapter | Critical | Medium |
| 2 | **Add WebSocket Connection Quotas** — Per-IP (100), per-tenant (10K), per-workspace (5K); enforce at Gateway ingress | Critical | Low |
| 3 | **Specify Event Bridge Subscription API** — `subscribe(topics[])`, `unsubscribe()`, wildcard support, permission validation | Critical | Medium |
| 4 | **Define gRPC Retry/Hedging Policy** — Max 2 retries, 10% hedging, retry budget per service, circuit breaker | Critical | Low |
| 5 | **Specify Token Refresh Concurrency Control** — Redis `SETNX` lock per session_id; single-flight refresh | Critical | Low |
| 6 | **Mobile Offline Schema & Sync Scheduler** — SQLite schema (messages, drafts, uploads), AES-256, max 500MB, WorkManager 15min | High | Medium |

### 6.2 Design Improvements (Pre-Implementation)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 7 | **WhatsApp Cloud API Spec** — Template management, opt-in webhook, message status callbacks, rate limits | High | Medium |
| 8 | **MCP Adapter Spec** — Tool list endpoint, capability negotiation, streamable HTTP transport, auth delegation | High | Medium |
| 9 | **Sync Conflict Resolution Rules** — Explicit matrix: messages=CRDT, drafts=LWW, workflows=reject, files=resume | High | Low |
| 10 | **Span Linking & Baggage Spec** — Gateway creates child span of client trace; propagates baggage for tenant/workspace | High | Low |
| 11 | **Connection Drain Protocol** — SIGTERM → stop accept → wait 30s for WS close → force close | High | Low |
| 12 | **Per-Tenant Rate Limit Quotas** — Extend tiers with tenant override via Config Service | High | Low |
| 13 | **Malware Scan Integration** — Async ClamAV; quarantine bucket; callback on clean/infected | High | Medium |
| 14 | **Event Bridge Consumer Lag Alerting** — Prometheus rule: `hermes_consumer_lag > 10000 for 5m` | Medium | Low |

---

## 7. Required Changes Before Approval

### Critical (Must Fix — Blockers)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **C-01** | **Protocol Adapter SDK & Contracts** | §3.1, §25.3 | Define base adapter class, standard middleware, contract tests. Provide OpenAPI specs for Telegram, Discord, WhatsApp, MCP adapters. |
| **C-02** | **WebSocket Connection Quotas** | §4.3, §16, §22 | Per-IP (100), per-tenant (10K), per-workspace (5K); enforce at Gateway ingress with 429 on exceed. |
| **C-03** | **Event Bridge Subscription API** | §11.2, §15 | `subscribe(topics[])`, `unsubscribe()`, wildcard `hermes.conversation.*`, permission validation on each subscribe. |
| **C-04** | **gRPC Retry/Hedging Policy** | §7.2 | Max 2 retries, 10% hedging, per-service retry budget, circuit breaker (50% errors/10s → open 30s). |
| **C-05** | **Token Refresh Single-Flight** | §8.4, §10.2 | Redis `SETNX lock:refresh:{session_id}` TTL 10s; only one refresh at a time per session. |

### High (Must Fix — Major Gaps)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **H-01** | **Mobile Offline Schema & Sync Scheduler** | §18.4, §19 | SQLite schema (messages, drafts, uploads), AES-256, max 500MB, WorkManager/BackgroundTasks 15min interval. |
| **H-02** | **WhatsApp Cloud API Spec** | §3.1, §25.3 | Template management, opt-in flow, webhook verification, status callbacks, 1000 msg/day limit. |
| **H-03** | **MCP Adapter Specification** | §3.1, §25.3 | Tool list endpoint, capability negotiation, streamable HTTP transport, auth delegation via Gateway. |
| **H-04** | **Sync Conflict Resolution Rules** | §11.4, §19.4 | Explicit matrix: messages=CRDT, drafts=LWW, workflows=reject local, files=resume, presence=LWW. |
| **H-05** | **Span Linking & Baggage Spec** | §7.3, §25.7 | Gateway creates child span of client trace; propagates `baggage: tenant_id,workspace_id` for multi-tenant queries. |
| **H-06** | **Connection Drain on Deploy** | §18, §23.2 | SIGTERM → stop accept → wait 30s for WS close (send `close` frame) → force close remaining. |
| **H-07** | **Per-Tenant Rate Limit Overrides** | §16, §3.4 | Config Service provides tenant-specific `rate_limit_tier` or custom `requests_per_minute`. |
| **H-08** | **Malware Scan Integration** | §13.1, §25.5 | Async ClamAV scan on chunk complete; quarantine bucket; callback `file.scan.complete` with result. |

---

## 8. Approval Decision

### **APPROVED WITH CHANGES**

**Conditions for Full Approval:**

1. **All 5 Critical changes (C-01 to C-05) implemented** in RFC-0004 v1.1
2. **All 8 High-priority changes (H-01 to H-08) documented** as follow-up ADRs or RFC amendments
3. **Protocol Adapter SDK** defined and reviewed by Agent Framework Lead
3. **Cross-RFC contract tests** signed off with RFC-0002, RFC-0003, RFC-0007 owners
4. **Security review** of WhatsApp/MCP adapters and mobile offline encryption

---

> **RFC-0004 is approved as the architectural foundation for Hermes Gateway and implementation may begin once the Critical conditions above are met.**

---

*Principal Enterprise Architect*  
*2026-07-24*