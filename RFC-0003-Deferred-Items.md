# RFC-0003 v1.1 — Deferred Items

**Source Review:** RFC-0003-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**Status:** Justified deferrals — not blockers for v1.1 approval

---

## Deferred Items

| Item | Reason for Deferral | Target RFC/Phase |
|------|---------------------|------------------|
| **Event Catalog / Discovery Service** | Internal API for schema lookup, ownership, consumers. v1.1 scope is messaging foundation only; developer tooling belongs in Automation Platform (RFC-0009). | RFC-0009 / Phase 2 |
| **Chaos Engineering Suite** | Failure injection: NATS node loss, network partition, disk full, schema violation. v1.1 is specification; chaos engineering is Phase 2 validation activity. | Phase 2 / Operational Readiness |
| **Correlation ID Namespace Prefix** | Prefix with tenant: `tenant-123:conv-uuid` | **Already implemented** in §16.1 — not deferred |
| **Per-Tenant Stream Quotas Enforcement** | Max events/sec, storage, consumer groups via NATS accounts | **Already implemented** in §3.4 — not deferred |
| **Backpressure Propagation to Gateway** | Gateway throttles on `hermes.system.backpressure.*` | Gateway is RFC-0004; signal defined in §8.4, topic in §3.3 — integration in RFC-0004 |

---

## Justification Summary

| Category | Deferred | Implemented in v1.1 | Rationale |
|----------|----------|---------------------|-----------|
| **Developer Experience** | Event Catalog | — | Separate platform capability (RFC-0009) |
| **Operational Validation** | Chaos Engineering | DR runbook (§18.5) | Spec vs. validation; Phase 2 |
| **Integration** | Gateway Backpressure | Signal defined (§8.4) | RFC-0004 boundary |
| **Security** | — | PII encryption (§20.3) | Fully implemented |
| **Multi-tenancy** | — | NATS accounts (§3.4) | Fully implemented |

---

**No Critical or High-priority review items were deferred.** All 11 actionable items (5 Critical + 6 High) are fully addressed in RFC-0003 v1.1.