# RFC-0004 v1.1 — Review Items Addressed

**Source Review:** RFC-0004-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**Status:** All Critical and High items addressed in v1.1

---

## Executive Summary

All **5 Critical (C-01 to C-05)** and **8 High-priority (H-01 to H-08)** review items have been incorporated into RFC-0004 v1.1. No review items were deferred without justification.

---

## Critical Items (C-01 to C-05) — ALL ADDRESSED

### C-01: Protocol Adapter SDK & Contracts
**Review Location:** §3.1, §25.3  
**Resolution:** 
- Added **§24 Protocol Adapters** with complete Adapter SDK specification
- **§24.1**: Abstract base class with middleware chain
- **§24.2**: 6 standard middleware (Tracing, Metrics, Auth, RateLimit, Retry, CircuitBreaker)
- **§24.3**: Contracts for Telegram, Discord, WhatsApp, MCP adapters
- **§24.4**: Pact contract tests + CI gates
- **§25.6**: Protocol Adapter Architecture diagram
- **§26.3**: Acceptance criteria for adapter contracts

### C-02: WebSocket Connection Quotas
**Review Location:** §4.3, §16, §22  
**Resolution:**
- Added **§4.4 Connection Quotas** with explicit limits:
  - Per IP: 100 concurrent WebSocket connections
  - Per Tenant: 10,000 concurrent WebSocket connections  
  - Per Workspace: 5,000 concurrent WebSocket connections
  - Per User: 20 concurrent WebSocket connections
- Enforcement at Gateway ingress middleware
- Exceed action: HTTP 429 / WebSocket close 1013
- **§26.6**: Acceptance criteria for quotas
- **§26.10**: Performance target for quota enforcement

### C-03: Event Bridge Subscription API
**Review Location:** §11.2, §15  
**Resolution:**
- Added **§11.5 Event Bridge Subscription API** with full specification:
  - Subscribe/Unsubscribe request/response format
  - Wildcard support: `hermes.conversation.*`, `hermes.workflow.workflow-123.*`
  - Permission validation on each subscribe
  - Auto-unsubscribe on permission revoke
  - Max 100 topics per connection
- **§26.4**: Acceptance criteria for subscription API
- **§11.5**: Features documented (wildcards, permissions, max subscriptions)

### C-04: gRPC Retry/Hedging Policy
**Review Location:** §7.2  
**Resolution:**
- Added **§7.3 gRPC Retry & Hedging Policy** with complete YAML specification:
  - Max 3 attempts (initial + 2 retries)
  - 10% hedging with 50ms delay
  - Token bucket retry budget (100 tokens, 10/sec refill)
  - Retry on: UNAVAILABLE, DEADLINE_EXCEEDED, INTERNAL
  - Circuit breaker: 50% errors/10s → open 30s, 3 half-open requests
- **§26.6**: Acceptance criteria for circuit breakers and retry policy

### C-05: Token Refresh Single-Flight
**Review Location:** §8.4, §10.2  
**Resolution:**
- Added **§8.5 Token Refresh Single-Flight** and **§10.4 Token Refresh Lock**:
  - Redis `SETNX` lock key: `lock:refresh:{session_id}` with 10s TTL
  - Single-flight algorithm: acquire lock → one refresh → waiters get same token
  - Lock auto-expires in 10s if holder crashes
- **§26.2**: Acceptance criteria for single-flight refresh
- **§26.7**: Security acceptance for token refresh lock

---

## High-Priority Items (H-01 to H-08) — ALL ADDRESSED

### H-01: Mobile Offline Schema & Sync Scheduler
**Review Location:** §18.4, §19  
**Resolution:**
- Enhanced **§18.4 Offline Queue (Mobile)** with full specification:
  - SQLite schema: `messages(id, content, timestamp, status)`, `drafts(id, content, updated_at)`, `uploads(id, upload_id, chunk_index, status)`
  - AES-256 encryption via SQLCipher, key from device keystore
  - Max 500 MB (configurable)
  - WorkManager (Android) / BackgroundTasks (iOS) — 15 min interval
  - CRDT merge (Automerge) for conflict resolution
- **§26.6**: Acceptance criteria for offline sync with schema + WorkManager

### H-02: WhatsApp Cloud API Spec
**Review Location:** §3.1, §25.3  
**Resolution:**
- **§24.3 Adapter Contracts** includes WhatsApp Cloud API:
  - Inbound: Cloud API Webhook
  - Outbound: Cloud API (messages, templates)
  - Auth: App secret + signature verification
  - Rate limit: 1000/day
- **§24.3**: Template management, opt-in flow, webhook verification, status callbacks
- **§26.3**: Acceptance criteria for WhatsApp adapter

### H-03: MCP Adapter Specification
**Review Location:** §3.1, §25.3  
**Resolution:**
- **§24.3 Adapter Contracts** includes MCP Adapter:
  - Inbound: Streamable HTTP
  - Outbound: Tool calls, resource reads
  - Auth: OAuth 2.0 + mTLS
  - Rate limit: 100 req/s
- **§24.3**: Tool discovery, capability negotiation, streamable HTTP transport
- **§26.3**: Acceptance criteria for MCP adapter

### H-04: Sync Conflict Resolution Rules
**Review Location:** §11.4, §19.4  
**Resolution:**
- **§11.4 Conflict Resolution (CRDT)** with explicit matrix:
  - Messages: CRDT (Automerge) — last-writer-wins per character
  - Drafts: LWW-Register — last-write-wins by timestamp
  - Workflow Actions: Server-Authoritative — reject local edits
  - Files: Chunked Upload Resume — idempotent, server-authoritative metadata
  - Presence: LWW-Register — last timestamp wins
  - Read Receipts: G-Counter — monotonic
- **§19.4**: Explicit conflict resolution table
- **§26.4**: Acceptance criteria for conflict resolution rules

### H-05: Span Linking & Baggage Spec
**Review Location:** §7.3, §25.7  
**Resolution:**
- Added **§25.6 Span Linking & Baggage** with Mermaid sequence diagram:
  - Gateway creates child span of client trace
  - Adds baggage: `tenant_id`, `workspace_id`
  - Propagates via gRPC metadata to Core
  - Core processes with tenant context
- **§26.8**: Acceptance criteria for span linking & baggage

### H-06: Connection Drain on Deploy
**Review Location:** §18, §23.2  
**Resolution:**
- Added **§23.4 Connection Drain on Deploy** with step-by-step:
  - SIGTERM → stop accepting (LB health fails)
  - Send WebSocket close frame (code 1001 "Going Away")
  - Wait max 30s for graceful close
  - Force close remaining
  - Exit
- **§18.5**: Detailed drain procedure
- **§26.6**: Acceptance criteria for connection drain

### H-07: Per-Tenant Rate Limit Overrides
**Review Location:** §16, §3.4  
**Resolution:**
- **§16.3 Per-Tenant Override**:
  - Config key: `tenant:{tenant_id}:rate_limit_tier` or custom `requests_per_minute`
  - Source: Config Service (RFC-0002 Config Manager)
  - Precedence: Tenant override > Tier default
- **§26.6**: Acceptance criteria for per-tenant overrides

### H-08: Malware Scan Integration
**Review Location:** §13.1, §25.5  
**Resolution:**
- Added **§21.3 Malware Scan Integration**:
  - Scanner: ClamAV (async, containerized)
  - Trigger: On chunk complete (final chunk or `complete` call)
  - Quarantine: Infected → separate S3 bucket (no public access)
  - Callback: `v1.hermes.file.scan.complete` event with result
  - Clean: Promote to main bucket, issue download URL
  - Infected: Quarantine, `file.scan.failed` event, user notified
- **§26.5**: Acceptance criteria for malware scan (async, quarantine, callback)

---

## Summary

| Category | Total | Addressed | Deferred | % Complete |
|----------|-------|-----------|----------|------------|
| **Critical** | 5 | 5 | 0 | 100% |
| **High** | 8 | 8 | 0 | 100% |
| **TOTAL** | **13** | **13** | **0** | **100%** |

---

**All review items from the Principal Enterprise Architect Review have been incorporated into RFC-0004 v1.1. The document is ready for implementation.**

*Chief System Architect*  
*2026-07-24*