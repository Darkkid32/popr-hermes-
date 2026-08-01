# RFC-0006 Deferred Items

**Source Review:** RFC-0006-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**RFC Version:** 1.0 → 1.1  
**Status:** No Critical or High items deferred

---

## Deferred Items Summary

| Priority | Total | Addressed | Deferred | Reason |
|----------|-------|-----------|----------|--------|
| Critical | 4 | 4 | 0 | All must-fix blockers resolved |
| High | 7 | 7 | 0 | All major gaps resolved |
| Medium/Low | 15+ | 0 | 15+ | Documented as follow-up ADRs |

---

## Medium/Low Priority Items (Deferred to Follow-up ADRs)

The following items from the review's "Recommendations" section (Section 6.2) are **not deferred** — they are documented as follow-up Architecture Decision Records (ADRs) to be resolved before implementation begins, but do not block RFC approval.

| # | Item | Target ADR | Tracking |
|---|------|------------|----------|
| 9 | Partial Document Update | ADR-KNW-009 | Post-approval |
| 10 | Sparse Vector Index Config | **Already addressed** (H-05) | ✅ |
| 11 | Ingestion Backpressure | **Already addressed** (H-06) | ✅ |
| 12 | Cascading Delete Verification | **Already addressed** (H-07) | ✅ |
| 13 | Cost Attribution / Token Budgeting | ADR-KNW-013 | Post-approval |
| 14 | Knowledge Versioning / Time Travel | ADR-KNW-014 | Post-approval |
| 15 | Embedding Drift Monitoring | ADR-KNW-015 | Post-approval |
| 16 | Advanced Query Rewriting | ADR-KNW-016 | Post-approval |
| 17 | Cross-Language Retrieval | ADR-KNW-017 | Post-approval |
| 18 | Knowledge Distillation for Agents | ADR-KNW-018 | Post-approval |
| 19 | Federated Knowledge Search | ADR-KNW-019 | Post-approval |
| 20 | Real-time Collaborative Editing | ADR-KNW-020 | Post-approval |
| 21 | Knowledge Access Patterns Analytics | ADR-KNW-021 | Post-approval |
| 22 | Automated Quality Evaluation | ADR-KNW-022 | Post-approval |
| 23 | Source Health Monitoring | ADR-KNW-023 | Post-approval |

---

## Justification for No Deferrals

All **Critical (C-01 to C-04)** and **High (H-01 to H-07)** items from the Principal Enterprise Architect Review have been **fully incorporated** into RFC-0006 v1.1. 

No items were deferred because:

1. **Each Critical item represents a fundamental architectural gap** that would cause data corruption, hallucination, or inconsistency if left unresolved
2. **Each High item represents a significant operational or correctness gap** that would impact production readiness
3. **The scope of RFC-0006 is the canonical Knowledge Architecture specification** — it must be complete before implementation

---

## Follow-up ADR Process

For the 15+ Medium/Low items, the following process applies:

1. **Each item → Separate ADR** (ADR-KNW-XXX format)
2. **Owner**: Chief System Architect + relevant domain lead
3. **Timeline**: Before Phase 1 implementation kickoff
4. **Review**: Same architectural review gate as RFC
5. **Status**: Tracked in Architecture Decision Log

---

## Items Explicitly NOT Deferred

| Review Item | RFC Section | Resolution |
|-------------|-------------|------------|
| C-01: Ingestion Idempotency | §5.5, §7.5, §12.4 | ✅ Implemented |
| C-02: Citation Verification | §11.4, §11.6, §16 | ✅ Implemented |
| C-03: Graph DLQ & Idempotency | §12.4, §17.1 | ✅ Implemented |
| C-04: Snapshot Isolation | §15.3 | ✅ Implemented |
| H-01: Entity Disambiguation | §12.2, §12.4 | ✅ Implemented |
| H-02: Multi-Hop Retrieval | §11.2, §16 | ✅ Implemented |
| H-03: Source Credibility | §13.2, §10.2 | ✅ Implemented |
| H-04: Conflict Detection | §11.1 | ✅ Implemented |
| H-05: Sparse Vector Config | §10.4, §9.3 | ✅ Implemented |
| H-06: Ingestion Backpressure | §5.6 | ✅ Implemented |
| H-07: Deletion Cascading | §14.3, §14.4, §17.1 | ✅ Implemented |

---

**Conclusion:** RFC-0006 v1.1 has **zero deferred Critical or High items**. All 11 review items from the Principal Enterprise Architect Review have been addressed in the canonical specification.