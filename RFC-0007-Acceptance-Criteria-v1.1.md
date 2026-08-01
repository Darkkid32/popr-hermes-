# RFC-0007 v1.1 Acceptance Criteria

**Version:** 1.1  
**Date:** 2026-07-24  
**Status:** Ready for Review

---

## 29.1 Architecture Completeness

- [ ] All 5 security planes defined with components and technologies
- [ ] Identity model covers all entity types (user, agent, service, workload, client, anonymous)
- [ ] Authentication methods specified with protocols, token formats, lifetimes
- [ ] Hybrid authorization model (RBAC/ABAC/ReBAC) with Cedar + OPA
- [ ] SPIFFE/SPIRE mTLS architecture for all service-to-service communication
- [ ] Agent identity, spawning, and capability token delegation defined
- [ ] PASETO v4 capability token format with constraints, rate limiting, delegation chain, and depth limit

---

## 29.2 Technical Specifications

- [ ] gRPC service definitions for all security operations
- [ ] Protobuf schemas for identity, tokens, policies, secrets, audit events
- [ ] Vault integration: Transit, KV v2, PKI engines with key hierarchy
- [ ] Encryption standards matrix (at-rest, in-transit, field-level) with FIPS 140-2
- [ ] Crypto agility: algorithm rotation procedures for all components
- [ ] PII detection (Presidio) with redaction, encryption, tokenization, quarantine
- [ ] Data classification (L0-L4) with propagation rules and OPA enforcement
- [ ] Audit event model with hash chaining, Merkle trees, 7-year retention
- [ ] PDP architecture: Cedar + OPA with cache, hot reload, decision logging
- [ ] Zero Trust network segmentation with 4 zones and mTLS everywhere
- [ ] Multi-tenant isolation at 10 layers with cross-tenant policy
- [ ] Session model with risk-based controls, immediate revocation, and geo-velocity scoring
- [ ] API security: TLS 1.3, rate limiting tiers, validation, headers, CORS
- [ ] NATS security: mTLS, accounts, subject-level OPA policies (complete)
- [ ] Memory/Knowledge security integration with RFC-0005/0006

---

## 29.3 Critical Review Items Addressed (C-01 to C-05)

| ID | Requirement | Verification |
|----|-------------|--------------|
| **C-01** | Capability delegation chain verification in PASETO token + PDP validation | §11.1: `delegation_chain[]` with signatures; §11.2: `verify_delegation_chain()` OPA policy; §11.4: integrated in `validate()` |
| **C-02** | Per-tenant SPIRE trust domains for enterprise isolation | §9.2: Three-tier model (Enterprise/Community/System) with trust domain separation |
| **C-03** | Audit transparency log verifier with daily Merkle root verification + alerting | §16.3: Hourly Merkle roots → transparency log; daily 03:00 UTC verification job with PagerDuty/Slack alerts |
| **C-04** | Push-based PDP cache invalidation via NATS events for token/capability revocation | §8.7: NATS events `v1.hermes.capability.revoked` + `v1.hermes.token.revoked`; OPA cache purge policies |
| **C-05** | Maximum delegation depth limit (3) enforced in token + PDP | §11.1: `max_delegation_depth: 3`; §11.2: depth increment validation; §11.4: PDP rejects `delegation_depth > max` |

---

## 29.4 High-Priority Review Items Addressed (H-01 to H-07)

| ID | Requirement | Verification |
|----|-------------|--------------|
| **H-01** | Complete NATS audit stream subscribe policy | §22.3: `allow_subscribe` for audit streams when `account.has_role("Auditor")` |
| **H-02** | Session risk scoring algorithm (geo-velocity formula + thresholds) | §20.4: `velocity_kmh = distance_km / time_diff_hours`; `impossible_travel` at >800 km/h; risk levels (critical/high/medium/low); step-up for medium+ |
| **H-03** | Network egress enforcement point for `network_egress` capability constraint | §11.5: OPA `allow_egress()` reads constraint; Envoy sidecar enforces deny-by-default for agents |
| **H-04** | Property-based testing framework for all Cedar/Rego policies | §17.3: `tests/property/` directory; §17.5: Rust `proptest` for RBAC monotonicity, ABAC tenant isolation, delegation depth, ReBAC consistency |
| **H-05** | Root CA rotation ceremony documentation (quorum, HSM, witnessing, key splitting) | §13.4: 6-step ceremony with 3-of-5 Shamir, quorum assembly, HSM reconstruction, fingerprint verification, SPIRE distribution, video+signed log |
| **H-06** | Cross-RFC contract tests for Security↔Gateway, Security↔Memory, Security↔Knowledge | §29.4: Acceptance criteria item; Pact contract testing for gRPC APIs |
| **H-07** | Capability token cache invalidation propagation to PDP decision cache | §8.7: `cache.purge_decisions(identity_id)` in OPA invalidation policies; §17.2: PDP cache targeted |

---

## 29.5 Incident Response & Compliance

- [ ] SEV classification with response times and escalation
- [ ] Automated containment playbooks for top 5 threat scenarios
- [ ] Compliance frameworks: SOC2, GDPR, HIPAA, FedRAMP, ISO 27001
- [ ] Continuous control monitoring with OPA policies as controls
- [ ] Evidence automation; DSAR portal; breach notification workflow

---

## 29.6 Performance & Operations

- [ ] P99 latency targets for all security operations
- [ ] 99.99% availability; RTO < 5 min; RPO = 0 for audit
- [ ] Prometheus metrics per operation; OpenTelemetry traces
- [ ] Capacity planning formulas; DR procedures

---

## 29.7 Cross-RFC Alignment

- [ ] Aligns with RFC-0002 v1.1 (Security Service as Core module)
- [ ] Aligns with RFC-0003 v1.1 (Event Bus security, audit topics)
- [ ] Aligns with RFC-0004 v1.1 (Gateway authZ, session, capability tokens)
- [ ] Aligns with RFC-0005 v1.1 (Memory access control, PII, classification)
- [ ] Aligns with RFC-0006 v1.1 (Knowledge ACL, PII, credibility, RAG security)

---

## 29.8 Review Gates

- [ ] Chief System Architect sign-off
- [ ] Principal Enterprise Security Architect sign-off
- [ ] Platform Engineer review (capacity, scaling, DR)
- [ ] Compliance Officer review (SOC2, GDPR, HIPAA readiness)
- [ ] Agent Framework Lead review (capability tokens, agent identity)

---

## Verification Method

| Criteria Category | Verification Method |
|------------------|---------------------|
| Architecture Completeness | Document inspection |
| Technical Specifications | Schema validation; API contract review |
| Critical Review Items (C-01 to C-05) | Section-by-section traceability to RFC-0007 v1.1 |
| High-Priority Items (H-01 to H-07) | Section-by-section traceability to RFC-0007 v1.1 |
| Incident Response/Compliance | Document inspection |
| Performance/Operations | Metrics review |
| Cross-RFC Alignment | Cross-reference check with RFC-0002–0006 v1.1 |
| Review Gates | Sign-off collection |

---

## Sign-Off Requirements

| Role | Required | Criteria |
|------|----------|----------|
| Chief System Architect | Yes | All acceptance criteria met; architecture coherent |
| Principal Enterprise Security Architect | Yes | All C-01 to C-05 and H-01 to H-07 addressed |
| Platform Engineer | Yes | Performance targets achievable; DR viable |
| Compliance Officer | Yes | SOC2/GDPR/HIPAA/FedRAMP/ISO 27001 coverage |
| Agent Framework Lead | Yes | Capability token delegation and agent identity correct |

---

**All acceptance criteria traceable to RFC-0007 v1.1 sections. No items deferred.**