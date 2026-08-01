# RFC-0004 v1.1 — Deferred Items

**Source Review:** RFC-0004-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**Status:** Justified deferrals — no Critical or High items deferred

---

## Deferred Items

| Item | Reason for Deferral | Target RFC/Phase |
|------|---------------------|------------------|
| **Event Catalog / Discovery Service** | Internal API for schema lookup, ownership, consumers. v1.1 scope is communication foundation only; developer tooling belongs in Automation Platform (RFC-0009). | RFC-0009 / Phase 2 |
| **Chaos Engineering Suite** | Failure injection: NATS node loss, network partition, disk full, schema violation. v1.1 is specification; chaos engineering is Phase 2 validation activity. | Phase 2 / Operational Readiness |
| **Correlation ID Namespace Prefix** | Prefix with tenant: `tenant-123:conv-uuid` | **Already implemented** in §8.3 / §16 — not deferred |
| **Per-Tenant Stream Quotas Enforcement** | Max events/sec, storage, consumer groups via NATS accounts | **Already implemented** in RFC-0003 v1.1 §3.4 — not deferred |
| **Backpressure Propagation to Gateway** | Gateway throttles on `hermes.system.backpressure.*` | **Already implemented** in §17 — not deferred |

---

## Justification Summary

| Category | Deferred | Implemented in v1.1 | Rationale |
|----------|----------|---------------------|-----------|
| **Developer Experience** | Event Catalog | — | Separate platform capability (RFC-0009) |
| **Operational Validation** | Chaos Engineering | DR runbook (§23.4) | Spec vs. validation; Phase 2 |
| **Security** | — | Correlation ID tenant prefix (§8.3) | Implemented |
| **Multi-tenancy** | — | NATS account quotas (RFC-0003) | Implemented in RFC-0003 |
| **Resilience** | — | Backpressure propagation (§17) | Implemented |

---

**No Critical or High-priority review items were deferred.** All 13 actionable items (5 Critical + 8 High) are fully addressed in RFC-0004 v1.1.