# RFC-0004 Changelog: v1.0 → v1.1

**Date:** 2026-07-24  
**Author:** Chief System Architect  
**Based On:** Principal Enterprise Architect Review (RFC-0004-Architectural-Review.md)

---

## Summary

| Metric | v1.0 | v1.1 | Change |
|--------|------|------|--------|
| **Sections** | 27 | 28 | +1 (Protocol Adapters) |
| **Lines** | ~1,420 | ~1,650 | +16% |
| **Critical Changes** | 0 | 5 (C-01..C-05) | All addressed |
| **High-Priority Changes** | 0 | 8 (H-01..H-08) | All addressed |
| **New Sections** | 0 | 2 (Protocol Adapters, Span Linking) | New |
| **Acceptance Criteria** | 9 categories, ~40 checkboxes | 11 categories, ~55 checkboxes | +15 |

---

## Critical Changes (C-01 to C-05) — ALL ADDRESSED

| ID | Change | Sections Modified |
|----|--------|-------------------|
| **C-01** | **Protocol Adapter SDK & Contracts** | §24 (new), §25.5 (diagram), §24.2 (middleware), §24.3 (contracts), §24.4 (tests), §26.3, §26.11 |
| **C-02** | **WebSocket Connection Quotas** | §4.4 (new), §26.6, §26.10 |
| **C-03** | **Event Bridge Subscription API** | §11.5 (new), §26.4, §26.11 |
| **C-04** | **gRPC Retry/Hedging Policy** | §7.3 (new), §26.6, §26.11 |
| **C-05** | **Token Refresh Single-Flight** | §10.4 (new), §8.5 (new), §26.7, §26.11 |

---

## High-Priority Changes (H-01 to H-08) — ALL ADDRESSED

| ID | Change | Sections Modified |
|----|--------|-------------------|
| **H-01** | **Mobile Offline Schema & Sync Scheduler** | §18.4 (enhanced), §26.6 |
| **H-02** | **WhatsApp Cloud API Spec** | §24.3 (contracts), §24.2 (middleware), §26.11 |
| **H-03** | **MCP Adapter Specification** | §24.3 (contracts), §24.2 (middleware), §26.11 |
| **H-04** | **Sync Conflict Resolution Rules** | §11.4 (enhanced), §19.4 (enhanced), §26.6 |
| **H-05** | **Span Linking & Baggage Spec** | §7.4 (new), §25.6 (new), §26.8, §26.11 |
| **H-06** | **Connection Drain on Deploy** | §23.4 (enhanced), §18.5 (new), §26.6, §26.11 |
| **H-07** | **Per-Tenant Rate Limit Overrides** | §16.3 (new), §26.6, §26.11 |
| **H-08** | **Malware Scan Integration** | §21.3 (new), §26.5, §26.11 |

---

## Architectural Risks Mitigated

| Risk | Mitigation in v1.1 |
|------|-------------------|
| **GWY-001**: Protocol Adapter Sprawl | Adapter SDK base class + standard middleware + contract tests (§24) |
| **GWY-002**: WebSocket Connection Exhaustion | Per-IP/tenant/workspace quotas (§4.4) |
| **GWY-003**: Sync Split-Brain | Explicit conflict resolution rules (§11.4, §19.4) |
| **GWY-004**: Event Bridge Backlog | Subscription API with permission validation (§11.5) |
| **GWY-005**: Token Refresh Storm | Single-flight Redis lock (§8.5, §10.4) |
| **GWY-006**: gRPC Cascade Failure | Retry/hedging + circuit breaker (§7.3) |
| **GWY-007**: Mobile Offline Data Loss | Encrypted SQLite + WorkManager (§18.4) |
| **GWY-008**: WhatsApp Template Rejection | WhatsApp Cloud API spec with templates (§24.3) |
| **GWY-009**: MCP Tool Discovery Stale | MCP adapter spec with capability negotiation (§24.3) |
| **GWY-010**: Span Context Loss | Span linking + baggage (§7.4, §25.6) |

---

## Breaking Changes from v1.0

| Area | v1.0 | v1.1 | Migration |
|------|------|------|-----------|
| **Connection Limits** | None | Per-IP/tenant/workspace quotas | Add quota enforcement middleware |
| **Token Refresh** | Concurrent allowed | Single-flight per session | Deploy Redis lock middleware |
| **gRPC Calls** | No retry/hedging | Max 2 retries, 10% hedging, circuit breaker | Update gRPC client config |
| **Event Subscriptions** | Implicit | Explicit subscribe API with permissions | Update clients to use subscribe API |
| **Adapter Implementation** | Ad-hoc | SDK base class + standard middleware | Refactor adapters to extend base class |
| **Token Refresh** | Concurrent allowed | Single-flight per session | Add Redis lock middleware |
| **Connection Drain** | Immediate close | 30s graceful drain on SIGTERM | Add shutdown handler |
| **Rate Limiting** | Tier only | Tenant override via Config Service | Add tenant config lookup |
| **Observability** | Basic tracing | Span linking + baggage | Add baggage propagation |

---

## Files Modified

| File | Description |
|------|-------------|
| `RFC-0004-Hermes-Gateway-Communication-Architecture-v1.1.md` | **Canonical RFC v1.1** (complete revised RFC) |
| `RFC-0004-Architectural-Review.md` | Principal Enterprise Architect Review (source) |
| `RFC-0004-Changelog-v1.0-to-v1.1.md` | This document |

---

## Approval Status

| Gate | Status | Notes |
|------|--------|-------|
| Chief System Architect | **Approved v1.1** | This document |
| Security Architect | **Pending** | §21.3 (malware scan), §8.5 (token lock) |
| Platform Engineer | **Pending** | §23.4 (drain), §7.3 (gRPC retry) |
| Data Architect | **Pending** | §18.4 (mobile offline), §19.4 (conflicts) |
| Agent Framework Lead | **Pending** | §24 (adapters), §11.4 (conflicts) |

---

**Next Step:** Review gates → Resolve any remaining concerns → **Final approval of RFC-0004 v1.1** → Implementation may begin.