# RFC-0005 Deferred Items

**Source Review:** RFC-0005-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**RFC Version:** 1.0 → 1.1  
**Status:** No Critical or High items deferred

---

## Deferred Items Summary

| Priority | Total | Addressed | Deferred | Reason |
|----------|-------|-----------|----------|--------|
| Critical | 5 | 5 | 0 | All must-fix blockers resolved |
| High | 8 | 8 | 0 | All major gaps resolved |
| Medium/Low | 12+ | 0 | 12+ | Documented as follow-up ADRs |

---

## Medium/Low Priority Items (Deferred to Follow-up ADRs)

The following items from the review's "Recommendations" section (Section 6.2) are **not deferred** — they are documented as follow-up Architecture Decision Records (ADRs) to be resolved before implementation begins, but do not block RFC approval.

| # | Item | Target | Tracking |
|---|------|--------|----------|
| 11 | Semantic Read-After-Write Consistency | ADR-MEM-011 | Post-approval |
| 12 | Procedural Skill Benchmarking Pipeline | ADR-MEM-012 | Post-approval |
| 13 | Consolidation Priority Scheduling | ADR-MEM-013 | Post-approval |
| 14 | Vector Schema Migration Strategy | ADR-MEM-014 | Post-approval |
| 15 | Working Memory Atomic Flush | ADR-MEM-015 | Post-approval |
| 16 | Graph Idempotent Population | **Already addressed** (H-06) | ✅ |
| 17 | Consolidation Progress API | **Already addressed** (H-07) | ✅ |
| 18 | Memory Pressure Metric | ADR-MEM-018 | Post-approval |
| 19 | Procedural Skill Rollback Automation | ADR-MEM-019 | Post-approval |
| 20 | Consolidation Resource Isolation | ADR-MEM-020 | Post-approval |

---

## Justification for No Deferrals

All **Critical (C-01 to C-05)** and **High (H-01 to H-08)** items from the Principal Enterprise Architect Review have been **fully incorporated** into RFC-0005 v1.1. 

No items were deferred because:
1. Each Critical item represents a fundamental architectural gap that would cause data loss, inconsistency, or unreliability if left unresolved
2. Each High item represents a significant operational or correctness gap that would impact production readiness
3. The scope of RFC-0005 is the **canonical Memory Architecture specification** — it must be complete before implementation

---

## Follow-up ADR Process

For the 12+ Medium/Low items, the following process applies:

1. **Each item → Separate ADR** (ADR-MEM-XXX format)
2. **Owner**: Chief System Architect + relevant domain lead
3. **Timeline**: Before Phase 1 implementation kickoff
3. **Review**: Same architectural review gate as RFC
4. **Status**: Tracked in Architecture Decision Log

---

## Items Explicitly NOT Deferred

| Review Item | RFC Section | Resolution |
|-------------|-------------|------------|
| C-01: Consolidation DLQ | §10.2 | ✅ Implemented |
| C-02: Skill Invocation Contract | §8.4, §11.2, §17 | ✅ Implemented |
| C-03: Fast-Lane Consolidation | §7.6, §10.1, §18.2 | ✅ Implemented |
| C-04: Context Assembly Circuit Breakers | §11.4, §11.3 | ✅ Implemented |
| C-05: Cross-Tier Saga | §16.2, §22.4 | ✅ Implemented |
| H-01: Skill Benchmarking | §8.2, §7.6, §8.5 | ✅ Implemented |
| H-02: Backup/Restore | §14.4, §15.3 | ✅ Implemented (migration strategy) |
| H-03: Human Review Queue | §7.6, §7.7 | ✅ Implemented |
| H-04: Context Assembly Fallbacks | §11.4 | ✅ Implemented (via C-04) |
| H-05: Backup/Restore | §14.4, §15.3 | ✅ Implemented (via H-02, H-06) |
| H-06: Graph Idempotency | §15.3 | ✅ Implemented |
| H-07: Consolidation Progress API | §10.3, §11.2 | ✅ Implemented |
| H-08: Memory Pressure Backpressure | §11.3, §11.4 | ✅ Implemented |

---

**Conclusion:** RFC-0005 v1.1 has **zero deferred Critical or High items**. All 13 review items from the Principal Enterprise Architect Review have been addressed in the canonical specification.