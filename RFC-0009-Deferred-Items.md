# RFC-0009 Deferred Items v1.1

**Date:** 2026-07-25  
**Review:** Principal Enterprise Architect Review  
**Verdict:** APPROVED WITH CHANGES  
**Status:** All items addressed in v1.1 — No deferred items

---

## Summary

The Principal Enterprise Architect review of RFC-0009 v1.0 identified 16 review items:
- **6 Critical (C-01 through C-06)**
- **10 High Priority (H-01 through H-10)**

**All 16 items have been fully incorporated into RFC-0009 v1.1.** No items were deferred to future versions.

---

## Deferred Items

| Item | Status | Resolution in v1.1 |
|------|--------|---------------------|
| C-01: Health Check Protocol | ✅ Addressed | Sections 8.1, 8.2, 9.1, 9.2, 10.1, 25.1, 25.9; AC-028 |
| C-02: Dead Letter Queue | ✅ Addressed | Sections 14.6, 17.2, 21.1, 27.1, 27.2; AC-027 |
| C-03: MCP Gateway Specification | ✅ Addressed | Sections 12.3, 12.5, 25.5; AC-029 |
| C-04: Multi-Tenant Registry Isolation | ✅ Addressed | Sections 8.1, 9.1, 10.1; AC-031, AC-038 |
| C-05: Provider Adapter Contract | ✅ Addressed | Sections 7.3, 25.7; AC-032, AC-039 |
| C-06: Plugin Dependency Resolution | ✅ Addressed | Section 9.3, 25.2; AC-030 |
| H-01: Capability Discovery Search | ✅ Addressed | Section 11.4; AC-033 |
| H-02: Backpressure Handling | ✅ Addressed | Sections 17.2, 17.3 |
| H-03: Resource Exhaustion Handling | ✅ Addressed | Sections 14.7, 18.3 |
| H-04: Upgrade/Downgrade Procedures | ✅ Addressed | Section 20.5; AC-041 |
| H-05: CEL Sandbox | ✅ Addressed | Section 15.5; AC-034 |
| H-06: Plugin Hook Timeout & Cancellation | ✅ Addressed | Section 6.6; AC-035 |
| H-07: Orchestration Checkpointing | ✅ Addressed | Sections 16.4, 16.5; AC-036 |
| H-08: MCP Server Versioning | ✅ Addressed | Section 12.5; AC-037 |
| H-09: CEL Sandbox (duplicate) | ✅ Addressed | Covered by H-05 |
| H-10: Capability Revocation Propagation | ✅ Addressed | Sections 19.1, 24.3; AC-040 |

---

## Rationale for No Deferrals

1. **Architectural Completeness:** All identified gaps represented fundamental capabilities required for production deployment of the Extensibility Architecture. Deferring any would leave the architecture incomplete.

2. **Cross-RFC Dependencies:** Several items (C-01, C-02, C-03, H-10) have direct dependencies on RFC-0003 (Event Bus), RFC-0007 (Security), and RFC-0008 (Agent Runtime) which are already approved at v1.1. Aligning now prevents future rework.

3. **Security Posture:** C-04 (Multi-Tenant Isolation), C-05 (Provider Adapter Contract), and H-10 (Capability Revocation) are security-critical and required for compliance.

4. **Operational Readiness:** C-01 (Health Checks), C-02 (DLQ), H-02 (Backpressure), H-03 (Resource Exhaustion) are required for Day 2 operations (observability, debugging, capacity management).

5. **Extensibility Foundation:** C-03 (MCP Gateway), C-06 (Plugin Dependencies), H-01 (Capability Search), H-07 (Orchestration Checkpointing) form the core extensibility contracts that third-party developers will build against.

---

## Future Considerations (Not Deferred from Review)

The following items were **not** part of the review but may be addressed in future RFCs or versions:

| Area | Potential Future Work |
|------|----------------------|
| **RFC-0010** | Observability & Telemetry — Distributed tracing, metrics, logging integration |
| **RFC-0011** | Automation Platform — Trigger/action rules, scheduled workflows |
| **WASM Component Model** | Migration from WASI 0.2 to WASM Component Model when stable |
| **Provider Federation** | Cross-cluster provider routing and model sharing |
| **Plugin Marketplace** | Signed plugin distribution, ratings, dependency resolution UX |
| **MCP Resource Streaming** | Full bidirectional resource streaming beyond tools |

---

## Verification

- ✅ No review items deferred
- ✅ All 16 items incorporated into v1.1
- ✅ Cross-referenced with Changelog, Review Items Addressed, and Acceptance Criteria documents
- ✅ RFC-0009 v1.1 approved with no outstanding review items