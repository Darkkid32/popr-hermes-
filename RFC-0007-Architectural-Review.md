# RFC-0007: Hermes Security & Identity Architecture — Principal Enterprise Security Architect Review

**Reviewer:** Principal Enterprise Security Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Status:** Draft  
**Depends On:** RFC-0001, RFC-0002 v1.1, RFC-0003 v1.1, RFC-0004 v1.1, RFC-0005 v1.1, RFC-0006 v1.1

---

## 1. Executive Summary

RFC-0007 is a **comprehensive, production-grade security architecture** that correctly positions Security as a standalone, centralized service — the "single authority for all security decisions" — and integrates deeply with the Hermes platform (Gateway, Core, Memory, Knowledge, Event Bus, Agents). The document demonstrates strong security engineering across identity, authentication, authorization, encryption, audit, and compliance.

**Overall Assessment: APPROVED WITH CHANGES**

The architecture is fundamentally sound with excellent Zero Trust foundations, but has **4 Critical** and **7 High-priority** gaps that must be resolved before implementation begins. These center on capability token delegation safety, SPIFFE trust domain isolation, audit log tamper-evidence completeness, and cross-RFC contract alignment.

---

## 2. Strengths

| Area | Strength |
|------|----------|
| **Zero Trust Foundation** | Explicit 4-zone segmentation (Public/App/Data/Mgmt); mTLS everywhere via SPIFFE; deny-by-default NATS policies |
| **Hybrid Authorization** | Cedar (RBAC+ReBAC) + OPA (ABAC+Capabilities) with parallel evaluation and decision merge — correct engine selection per paradigm |
| **Agent Security Model** | SPIFFE SVID + PASETO v4 capability tokens with constraints, rate limits, delegation TTL, and audit trail |
| **SPIFFE/SPIRE Integration** | Full mTLS everywhere; auto-rotating SVIDs (1-24h); workload API per node; bundle distribution |
| **PII Protection** | Presidio detection pipeline with 4 protection actions (redact/encrypt/tokenize/quarantine); component-specific handling |
| **Data Classification** | L0-L4 with propagation rules (document → chunks → embeddings → entities → graph); OPA enforcement |
| **Audit Logging** | Immutable NATS stream + PG + hash chaining + Merkle trees + cross-region replication + daily verification |
| **Policy Engine** | Cedar (RBAC/ReBAC) + OPA (ABAC/Capabilities) with hot reload (<1s), decision caching (95% hit), GitOps deployment |
| **Multi-Tenant Isolation** | 10-layer model (network, identity, auth, authz, PG RLS, Qdrant collections, Kuzu files, Vault namespaces, Redis DBs, NATS accounts) |
| **Compliance Readiness** | SOC2, GDPR, HIPAA, FedRAMP High, ISO 27001 mapped to automated controls (OPA policies as controls) |
| **Performance Targets** | Realistic P99 targets per operation; availability/RTO/RPO defined |
| **Cross-RFC Alignment** | Explicit integration points with RFC-0002/0003/0004/0005/0006 |

---

## 3. Weaknesses

| Area | Weakness |
|------|----------|
| **Capability Token Delegation** | No cryptographic proof of delegation chain; parent can delegate capabilities it doesn't hold; no delegation depth limit |
| **SPIFFE Trust Domain Isolation** | Single SPIRE server implied; no per-tenant trust domain separation for enterprise customers |
| **Audit Hash Chain Verification** | Merkle tree hourly root published to "transparency log" but no verification mechanism or log specified |
| **Capability Token Revocation** | Redis blocklist with TTL = token TTL; no immediate propagation guarantee across PDP cache |
| **Session Risk Signals** | "Impossible travel" and "geo-velocity" mentioned but no algorithm or threshold defined |
| **NATS Subject Authorization** | Policy incomplete — cuts off mid-rule for audit stream subscribe |
| **Policy Testing** | Unit/integration tests mentioned but no property-based testing or fuzzing for Rego/Cedar |
| **Key Ceremony** | Root CA rotation "manual ceremony" but no quorum, witnessing, or HSM procedure documented |
| **Agent Capability Constraints** | `network_egress` allowlist in token but no enforcement point documented (sidecar? PDP?) |
| **Cross-RFC Contract Tests** | No explicit contract test definitions for RFC-0002/0003/0004/0005/0006 integration points |

---

## 4. Missing Components

| # | Component | Required By | Impact |
|---|-----------|-------------|--------|
| 1 | **Capability Delegation Chain Verification** | §11 | Unbounded privilege escalation via delegation |
| 2 | **Per-Tenant SPIRE Trust Domains** | §9, §19 | Enterprise tenant isolation gap |
| 3 | **Audit Transparency Log Implementation** | §16.3 | Tamper evidence incomplete |
| 3 | **Capability Token Cache Invalidation Protocol** | §11.3, §8.5 | Stale authZ decisions after revocation |
| 5 | **Session Risk Scoring Algorithm** | §20.3 | Risk-based step-up unimplementable |
| 6 | **NATS Audit Stream Subscribe Policy** | §22.3 | Incomplete policy (cuts off) |
| 7 | **Property-Based Policy Testing** | §17 | Rego/Cedar correctness unvalidated |
| 8 | **Root CA Rotation Procedure** | §13.3 | Operational risk for PKI |
| 9 | **Network Egress Enforcement Point** | §11.1 | `network_egress` constraint unenforced |
| 10 | **Cross-RFC Contract Test Suite** | §29.5 | Integration failures at runtime |
| 11 | **Delegation Depth Limit** | §11.2 | Unbounded delegation chains |
| 12 | **Capability Token Propagation to PDP Cache** | §8.5, §17.2 | Stale decisions after token revoke |

---

## 5. Architectural Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| **SEC-001** | **Capability Token Privilege Escalation** — Agent delegates capabilities it doesn't possess; no chain verification | High | Critical | Add delegation chain in token; verify each link at PDP |
| **SEC-002** | **Tenant SPIFFE Trust Domain Collision** — Shared SPIRE = shared root = cross-tenant mTLS possible | Medium | Critical | Per-tenant SPIRE or separate trust domains per enterprise |
| **SEC-003** | **Audit Log Tampering Undetected** — Merkle root to "transparency log" but no verification job | Medium | High | Implement daily verification; alert on mismatch |
| **SEC-004** | **Stale Authorization After Token Revoke** — PDP cache TTL 30s; Redis blocklist not pushed to PDP | High | High | Push-based invalidation via NATS; reduce cache TTL |
| **SEC-005** | **Unbounded Delegation Depth** — Agent A → B → C → ... with no depth limit | Medium | High | Max depth = 3; enforce in token and PDP |
| **SEC-006** | **Network Egress Constraint Bypass** — `network_egress` in token but no enforcement | Medium | High | Implement at sidecar/PDP; deny by default |
| **SEC-007** | **Session Risk Scoring Undefined** — "Impossible travel" no algorithm/threshold | Medium | Medium | Define geo-velocity formula; configurable thresholds |
| **SEC-008** | **Capability Token Cache Invalidation Gap** — OPA cache 30s; no push invalidation on revoke | High | High | NATS event `v1.hermes.capability.revoked` → PDP cache purge |
| **SEC-009** | **Incomplete NATS Audit Subscribe Policy** — Policy cuts off mid-rule | Low | Medium | Complete the policy |
| **SEC-010** | **No Property-Based Policy Testing** — Rego/Cedar bugs reach production | Medium | High | Add quickcheck-style testing for all policies |

---

## 6. Recommendations

### 6.1 Structural Changes (Do Before Approval)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 1 | **Add Capability Delegation Chain to PASETO Token** — Include `delegation_chain` array with each link signed by delegator; PDP verifies full chain | Critical | Medium |
| 2 | **Implement Per-Tenant SPIRE Trust Domains** — Separate SPIRE server or trust domain per enterprise tenant; shared for community | Critical | High |
| 3 | **Build Audit Transparency Log Verifier** — Daily job reads Merkle roots, verifies chain, alerts on mismatch; publish roots to immutable store | Critical | Medium |
| 4 | **Add Push-Based Cache Invalidation** — NATS event `v1.hermes.capability.revoked` + `v1.hermes.token.revoked` → PDP purges decision cache | Critical | Low |
| 5 | **Enforce Delegation Depth Limit** — Max 3 hops; encode in token `max_delegation_depth`; PDP rejects deeper | Critical | Low |
| 6 | **Complete NATS Audit Subscribe Policy** — Finish the cut-off rule | Critical | Trivial |

### 6.2 Design Improvements (Post-Approval, Pre-Implementation)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 7 | **Define Session Risk Scoring Algorithm** — Geo-velocity formula: `distance_km / hours_since_last_activity > threshold`; configurable per tenant | High | Low |
| 8 | **Implement Property-Based Policy Testing** — QuickCheck-style generators for Rego/Cedar; run in CI | High | Medium |
| 9 | **Document Root CA Rotation Ceremony** — Quorum (3 of 5), HSM witness, video recording, key splitting | High | Low |
| 10 | **Implement Network Egress Enforcement** — Sidecar proxy (Envoy) reads `network_egress` from capability token; deny by default | High | Medium |
| 11 | **Add Capability Token Propagation to PDP** — Include full token in authZ context; PDP evaluates constraints locally | Medium | Low |
| 12 | **Add Cross-RFC Contract Tests** — Pact contracts for Gateway↔Security, Memory↔Security, Knowledge↔Security | Medium | Medium |

---

## 7. Required Changes Before Approval

### Critical (Must Fix — Blockers)

| ID | Change | Section |
|----|--------|---------|
| **C-01** | Add capability delegation chain verification (delegation chain to PASETO v4 capability token (`delegation_chain` claim); PDP must verify each link | §11 |
| **C-02** | Implement per-tenant SPIRE trust domains (or separate SPIRE servers) for enterprise isolation | §9, §19 |
| **C-03** | Implement audit transparency log verifier with daily Merkle root verification + alerting | §16.3 |
| **C-04** | Add push-based PDP cache invalidation via NATS events for token/capability revocation | §8.5, §17.2 |
| **C-05** | Enforce maximum delegation depth (3) in capability token and PDP | §11.2 |

### High (Must Fix — Major Gaps)

| ID | Change | Section |
|----|--------|---------|
| **H-01** | Complete NATS audit stream subscribe policy (currently truncated) | §22.3 |
| **H-02** | Define session risk scoring algorithm (geo-velocity formula + thresholds) | §20.3 |
| **H-03** | Implement network egress enforcement point for `network_egress` capability constraint | §11.1 |
| **H-04** | Add property-based testing framework for all Cedar/Rego policies | §17 |
| **H-05** | Document Root CA rotation ceremony (quorum, HSM, witnessing, key splitting) | §13.3 |
| **H-06** | Define cross-RFC contract tests for Security↔Gateway, Security↔Memory, Security↔Knowledge | §29.5 |
| **H-07** | Document capability token cache invalidation propagation to PDP decision cache | §17.2 |

---

## 8. Approval Decision

### **APPROVED WITH CHANGES**

**Conditions for Full Approval:**

1. **All 5 Critical changes (C-01 to C-05) implemented** in RFC-0007 v1.1
2. **All 7 High-priority changes (H-01 to H-07) documented** as follow-up ADRs with owners and timelines
3. **Cross-RFC contract tests signed off** with RFC-0002, RFC-0003, RFC-0004, RFC-0005, RFC-0006 owners
4. **Security review** of capability token delegation chain and SPIFFE trust domain isolation by Principal Enterprise Security Architect
5. **Compliance review** of audit transparency log implementation by Compliance Officer

---

> **RFC-0007 is approved as the architectural foundation for Hermes Security and implementation planning may begin once the Critical conditions above are met.**

*Principal Enterprise Security Architect*  
*2026-07-24*