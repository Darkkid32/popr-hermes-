# RFC-0007 Deferred Items

**Source:** Principal Enterprise Security Architect Review → RFC-0007 v1.1  
**Date:** 2026-07-24  
**Status:** All review items addressed; no deferrals required.

---

## Deferred Items

| Item | Original Priority | Reason for Deferral | Target RFC/ADR |
|------|-------------------|---------------------|----------------|
| *(none)* | — | All 12 review items (5 Critical + 7 High) have been incorporated into RFC-0007 v1.1 | — |

---

## Items Reserved for Implementation Phase

These items are **not deferred** — they are fully specified in RFC-0007 v1.1 but require implementation effort. They are tracked here for implementation planning.

| Area | Item | RFC-0007 v1.1 Reference | Implementation Owner |
|------|------|------------------------|---------------------|
| **SPIRE** | Enterprise tenant SPIRE server provisioning automation | §9.2 | Platform Team |
| **Audit** | Transparency log storage backend (immutable object store) | §16.3 | Security Team |
| **PDP** | NATS event subscription for cache invalidation | §8.7, §17.2 | Security Team |
| **Capability Tokens** | Delegation chain signature verification library | §11.2 | Agent Framework Team |
| **Session** | Geo-velocity risk scoring integration with device fingerprinting | §20.4 | Gateway Team |
| **Network** | Envoy sidecar filter for `network_egress` enforcement | §11.5 | Platform Team |
| **Policy Testing** | Property-based test CI pipeline integration | §17.5 | Security Team |
| **Root CA** | HSM key ceremony tooling and video recording | §13.4 | Security Team |
| **Contract Tests** | Pact contract definitions for Security↔Gateway/Memory/Knowledge | §29.4 | All Service Teams |
| **Compliance** | DSAR portal implementation | §26.2 | Compliance Team |

---

## Notes

- No architectural decisions were deferred — all review findings have been resolved in the specification.
- The items above are **implementation tasks**, not architectural gaps.
- Each item has a clear RFC-0007 v1.1 reference and assigned owner for Phase 1 implementation planning.