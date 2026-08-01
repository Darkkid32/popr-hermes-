# RFC-0003 Changelog: v1.0 → v1.1

**Date:** 2026-07-24  
**Author:** Chief System Architect  
**Based On:** Principal Enterprise Architect Review (RFC-0003-Architectural-Review.md)

---

## Summary

| Metric | v1.0 | v1.1 | Change |
|--------|------|------|--------|
| **Sections** | 25 | 26 | +1 (Deferred Items) |
| **Lines** | ~1,240 | ~1,500 | +21% |
| **Consumer Groups** | 15 | 18 | +3 (partitioned State Manager) |
| **Event Schemas** | 5 domain + envelope | 6 domain + envelope + large_payload | +2 |
| **Diagrams** | 4 | 5 | +1 (Rebalance sequence) |
| **Acceptance Criteria** | 9 categories, 40 checkboxes | 10 categories, 55+ checkboxes | +15 |

---

## Critical Changes (C-01 to C-05) — ALL ADDRESSED

| ID | Change | Sections Modified |
|----|--------|-------------------|
| **C-01** | **Schema Compatibility Matrix** | §6.5 (new), §6.4 (enforcement), §23.2 (CI gate) |
| **C-02** | **Per-Tenant Quotas via NATS Accounts** | §3.4 (new), §4.1 (enforcement), §17.1 (retention), §19.1 (tenant_id labels) |
| **C-03** | **Large Payload Protocol** | §7.2 (new), §3.3 (stream subjects), §8.1/8.4 (lifecycle), §15.2 (idempotency), §23.5 (acceptance) |
| **C-04** | **Log Compaction for State Subjects** | §3.2 (topology), §3.3 (stream config), §7.4 (new), §23.1 (acceptance) |
| **C-05** | **State Manager Partitioned Writers** | §10.1 (4 consumer groups), §10.3 (lifecycle), §17.3 (new), §22.1 (diagram) |

---

## High-Priority Changes (H-01 to H-06) — ALL ADDRESSED

| ID | Change | Sections Modified |
|----|--------|-------------------|
| **H-01** | **Consumer Group Rebalance Protocol** | §10.4 (new), §10.2 (sharded), §22.5 (sequence diagram) |
| **H-02** | **Capacity Planning Calculator** | §17.4 (new) |
| **H-03** | **Schema Migration Runbooks** | §6.6 (examples), §23.10 (acceptance) |
| **H-04** | **Cross-Module Contract Tests** | §9.3 (consumer groups), §23.6 (Pact/Schemathesis CI), §23.10 (CI gate) |
| **H-05** | **Per-Domain Event TTL** | §17.1 (table), §3.3 (stream config), §23.1 (acceptance) |
| **H-06** | **Backpressure Propagation** | §8.4 (acknowledge phase), §9.1/9.2 (pub/sub responsibilities), §3.3 (topic), §22.4 (diagram) |

---

## Medium-Priority Improvements (Also Addressed)

| Item | Section | Description |
|------|---------|-------------|
| Correlation ID tenant prefix | §16.1 | `{tenant_id}:{uuid_v7}` format |
| DLQ circuit breaker | §11.5 | Prevents poison pill cascade (EVT-006) |
| Per-consumer alert baselines | §19.2 | 7 consumer groups with custom thresholds |
| Field-level PII encryption | §20.3 | Mandatory for `user_id`, `email`, `pii.*` via Vault |
| DR validation procedure | §18.5 | Quarterly failover test plan |
| Replay storm protection | §13.4 | Rate limiting, dedicated consumers |

---

## Architectural Risks Mitigated (EVT-001 to EVT-010)

| Risk | Mitigation in v1.1 |
|------|-------------------|
| **EVT-001**: Schema breaking change in prod | Schema Compatibility Matrix (§6.5) + CI enforcement |
| **EVT-002**: Tenant noisy neighbor | NATS per-tenant accounts with quotas (§3.4) |
| **EVT-003**: Event loss during rebalance | Rebalance protocol: pause → drain → reassign → resume (§10.4) |
| **EVT-004**: Large payload OOM/latency | Chunking protocol + object store (§7.2) |
| **EVT-005**: State Manager write bottleneck | 4 partitioned writers with dedicated PG pools (§17.3) |
| **EVT-006**: DLQ poison pill cascade | DLQ circuit breaker (§11.5) |
| **EVT-007**: Cross-region split-brain | Supercluster quorum documented (§18.1) |
| **EVT-008**: PII leakage | Field-level encryption mandatory (§20.3) |
| **EVT-009**: Replay storm | Rate limiting, dedicated consumers (§13.4) |
| **EVT-010**: Correlation ID collision | Tenant-prefixed UUID v7 (§16.1) |

---

## New/Updated Sections in v1.1

| Section | Status | Description |
|---------|--------|-------------|
| §3.4 | **NEW** | Per-Tenant Account Configuration |
| §6.5 | **NEW** | Schema Compatibility Matrix |
| §6.6 | **NEW** | Schema Migration Runbooks |
| §7.2 | **NEW** | Large Payload Protocol |
| §7.4 | **NEW** | Log Compaction Subjects |
| §8.4 | **UPDATED** | Acknowledge Phase (backpressure signal) |
| §9.1/9.2 | **UPDATED** | Pub/Sub responsibilities (backpressure) |
| §10.1 | **UPDATED** | 18 consumer groups (4 State Manager) |
| §10.4 | **NEW** | Consumer Group Rebalance Protocol |
| §11.5 | **NEW** | DLQ Circuit Breaker |
| §13.4 | **NEW** | Replay Storm Protection |
| §16.1 | **UPDATED** | Correlation ID tenant prefix |
| §17.1 | **UPDATED** | Per-domain TTL table (14 domains) |
| §17.3 | **NEW** | Dual-Write Pattern (partitioned writers) |
| §17.4 | **NEW** | Capacity Planning Calculator |
| §18.5 | **NEW** | DR Validation Procedure |
| §19.2 | **NEW** | Per-Consumer Alert Baselines |
| §20.3 | **UPDATED** | Field-level PII encryption mandatory |
| §22.1 | **UPDATED** | Event Bus Topology (4 State Manager consumers) |
| §22.4 | **UPDATED** | Multi-Region (backpressure topic local) |
| §22.5 | **NEW** | Consumer Group Rebalance sequence diagram |
| §23 | **UPDATED** | 10 categories, 55+ checkboxes |
| §24 | **NEW** | Deferred Items |

---

## Updated Diagrams

| Diagram | v1.0 | v1.1 |
|---------|------|------|
| Event Bus Topology | 15 consumers | 18 consumers (partitioned State Manager) |
| Event Flow Sequence | Basic | Updated topic versions (v1.) |
| DLQ Flow | Basic | With circuit breaker |
| Multi-Region | Basic | Backpressure topic marked local |
| **Consumer Group Rebalance** | — | **NEW** (sequence diagram) |

---

## Updated Acceptance Criteria

| Category | v1.0 Checkboxes | v1.1 Checkboxes | Key Additions |
|----------|-----------------|-----------------|---------------|
| Core Event Bus | 5 | 7 | Log compaction, large payload topic |
| Event Contracts | 4 | 5 | Schema Compatibility Matrix CI |
| Ownership & Contracts | 3 | 3 | — |
| Consumer Groups | 5 | 6 | Rebalance protocol |
| Resilience | 5 | 7 | DLQ circuit breaker, large payload, idempotency |
| Observability | 4 | 5 | Per-consumer alert baselines |
| Security | 3 | 3 | Field-level PII encryption |
| Multi-Region | 4 | 5 | DR validation procedure |
| Performance | 4 | 4 | — |
| **Operational** | — | **5** | **NEW: Capacity calculator, schema runbooks, contract tests** |

---

## Files Modified

| File | Description |
|------|-------------|
| `RFC-0003-Hermes-Event-Bus-Messaging-Architecture.md` | **Canonical v1.1** (complete revised RFC) |
| `RFC-0003-Architectural-Review.md` | Principal Enterprise Architect Review (source) |
| `RFC-0003-Review-Items-Addressed.md` | Detailed mapping of all 11 items |
| `RFC-0003-Deferred-Items.md` | Justified deferrals (0 critical/high) |
| `RFC-0003-Changelog-v1.0-to-v1.1.md` | This document |

---

## Approval Status

> **RFC-0003 v1.1 is APPROVED WITH CHANGES conditions met.**
>
> All 5 Critical (C-01..C-05) and 6 High (H-01..H-06) changes incorporated.
> Ready for implementation.
>
> *Chief System Architect*  
> *2026-07-24*