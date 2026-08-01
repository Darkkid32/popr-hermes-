# RFC-0007 Changelog: v1.0 → v1.1

**Date:** 2026-07-24  
**Author:** Chief System Architect  
**Review Basis:** Principal Enterprise Security Architect Review (RFC-0007-Architectural-Review.md)

---

## Summary

| Category | Count |
|----------|-------|
| **Critical Changes (C-01 to C-05)** | 5 |
| **High-Priority Changes (H-01 to H-07)** | 7 |
| **Total Changes** | 12 |

---

## Critical Changes (C-01 to C-05)

### C-01: Capability Delegation Chain Verification
**Section:** §11 (Capability Tokens)  
**Change:** Enhanced PASETO v4 capability token format with `delegation_chain` array containing signed delegation links. Added `max_delegation_depth` (default: 3) and `delegation_depth` fields. Implemented OPA policy `verify_delegation_chain()` that validates each link's signature and enforces depth increment.  
**Rationale:** Prevents privilege escalation via unbounded delegation without cryptographic proof of chain.

### C-02: Per-Tenant SPIRE Trust Domains
**Section:** §9.2 (Service-to-Service Authentication)  
**Change:** Defined three-tier SPIRE deployment model: Enterprise (dedicated SPIRE server + trust domain `spiffe://hermes.{tenant}`), Community (shared SPIRE + `spiffe://hermes.shared`), System (dedicated `spiffe://hermes.system`). Added cross-trust domain federation requirement.  
**Rationale:** Eliminates cross-tenant mTLS collision risk; provides full PKI isolation for enterprise tenants.

### C-03: Audit Transparency Log Verification
**Section:** §16.3 (Audit Log Integrity)  
**Change:** Added hourly Merkle root computation over audit events, publication to append-only transparency log (immutable object store), and daily verification job (03:00 UTC) that recomputes roots and alerts on mismatch via PagerDuty + Slack.  
**Rationale:** Completes tamper-evidence chain; enables detection of audit log manipulation.

### C-04: Push-Based PDP Cache Invalidation
**Section:** §8.7 (Cache Invalidation Protocol), §17.3 (Policy Bundle)  
**Change:** Added NATS events `v1.hermes.capability.revoked` and `v1.hermes.token.revoked` that trigger immediate PDP decision cache purge via OPA policy `invalidate_on_revocation()` and `invalidate_on_token_revocation()`.  
**Rationale:** Eliminates 30-second stale authorization window after token/capability revocation.

### C-05: Maximum Delegation Depth Limit
**Section:** §11.1, §11.2, §11.4 (Capability Tokens)  
**Change:** Enforced `max_delegation_depth: 3` in PASETO token; PDP rejects tokens where `delegation_depth > max_delegation_depth`; OPA policy validates depth increments by exactly 1 per delegation hop.  
**Rationale:** Prevents unbounded privilege escalation via delegation chains.

---

## High-Priority Changes (H-01 to H-07)

### H-01: Complete NATS Audit Stream Subscribe Policy
**Section:** §22.3 (Event Bus Security)  
**Change:** Completed the truncated Rego policy for audit stream subscription — now explicitly allows subscribe for accounts with `Auditor` role.  
**Rationale:** Fixes incomplete policy that would deny all audit stream access.

### H-02: Session Risk Scoring Algorithm
**Section:** §20.4 (Session Security)  
**Change:** Implemented geo-velocity formula: `velocity_kmh = distance_km / time_diff_hours`; `impossible_travel` signal triggers when velocity > 800 km/h. Added risk signals for new device, new location, credential stuffing. Defined risk levels: critical (impossible travel), high (credential stuffing), medium (new device/location), low (no signals). Step-up authentication required for medium+.  
**Rationale:** Makes risk-based step-up authentication implementable and auditable.

### H-03: Network Egress Enforcement
**Section:** §11.5 (Capability Tokens)  
**Change:** Added OPA policy `allow_egress()` that reads `network_egress` constraint from capability token; Envoy sidecar filter enforces deny-by-default for agents with capability tokens.  
**Rationale:** Enforces the `network_egress` constraint that was declared but not enforced.

### H-04: Property-Based Policy Testing
**Section:** §17.3 (Policy Bundle Structure), §17.5 (Property-Based Testing)  
**Change:** Added `tests/property/` directory with Rust-based property tests using `proptest` crate. Defined properties: RBAC monotonicity (adding roles never reduces access), ABAC tenant isolation (cross-tenant always denied), capability delegation depth limit, ReBAC relationship consistency.  
**Rationale:** Catches Rego/Cedar logic bugs that unit tests miss; validates security invariants.

### H-05: Root CA Rotation Ceremony
**Section:** §13.4 (Encryption)  
**Change:** Documented 6-step ceremony: Preparation (offline HSM, 3-of-5 Shamir key splitting), Quorum Assembly (3 of 5 holders), Ceremony (HSM reconstructs, signs new root), Verification (fingerprint check), Distribution (SPIRE bundle, old root revoked), Documentation (video, signed log, immutable audit).  
**Rationale:** Operationalizes annual root CA rotation with quorum and witnessing.

### H-06: Cross-RFC Contract Tests
**Section:** §29.4 (Acceptance Criteria), §17.3 (Policy Bundle)  
**Change:** Added acceptance criteria item for contract tests between Security↔Gateway, Security↔Memory, Security↔Knowledge. Specified Pact contract testing for gRPC APIs.  
**Rationale:** Prevents integration failures at runtime; validates cross-RFC alignment.

### H-07: Capability Token Cache Invalidation Propagation
**Section:** §8.7 (Cache Invalidation), §17.2 (PDP Architecture)  
**Change:** Extended NATS event-driven invalidation to explicitly target PDP decision cache (not just token cache). OPA policy `invalidate_on_revocation()` purges decision cache entries by `identity_id`.  
**Rationale:** Ensures stale authorization decisions are evicted immediately after revocation.

---

## Cross-Cutting Updates

| Area | Update |
|------|--------|
| **Design Principles** | Added "Delegation Integrity" principle (§3) |
| **Authentication** | Updated token validation table with delegation chain check (§7.5) |
| **Authorization** | Added cache invalidation protocol (§8.7) |
| **Capability Tokens** | Full delegation chain implementation (§11.1–11.5) |
| **Audit Logging** | Transparency log verification job (§16.3) |
| **Policy Engine** | Property-based testing framework (§17.5) |
| **Zero Trust** | Added Delegation Integrity principle (§18.1) |
| **Session Security** | Geo-velocity risk scoring (§20.4) |
| **NATS Security** | Completed audit subscribe policy (§22.3) |
| **gRPC APIs** | Enhanced capability token request/response with delegation fields (§24.1) |
| **Acceptance Criteria** | Updated with all 12 review items (§29.3–29.4) |

---

## Files Modified

| File | Description |
|------|-------------|
| `RFC-0007-Hermes-Security-Identity-Architecture-v1.1.md` | Canonical v1.1 specification |
| `RFC-0007-Changelog-v1.0-to-v1.1.md` | This changelog |
| `RFC-0007-Review-Items-Addressed.md` | Mapping of review items to RFC sections |
| `RFC-0007-Deferred-Items.md` | Deferred items with justification |
| `RFC-0007-Acceptance-Criteria-v1.1.md` | Updated acceptance criteria checklist |