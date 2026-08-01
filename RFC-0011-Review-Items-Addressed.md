# RFC-0011 Review Item Traceability Matrix

**Date:** 2026-07-25
**RFC:** RFC-0011 v1.1 — Hermes Automation Platform Architecture
**Reviews:** Architecture Governance Review + Executive Strategic Review

---

## Architecture Review Findings

| ID | Severity | Description | Resolution | Section | AC |
|----|----------|-------------|------------|---------|-----|
| C-01 | Critical | COMPOSITE trigger enum has no message definition | Added `CompositeTrigger` message + `CompositeLogic` enum + `composite = 5` field | 8.1 | AC-047 |
| C-02 | Critical | CEL sandbox not specified (RFC-0009 precedent) | Added Section 9.3 CEL Sandbox with limits, allowlist, violation behavior | 9.3 | AC-048, AC-049 |
| H-01 | High | Action deduplication mechanism missing | Added `dedup_key` to Action, `dedup_ttl` to RateLimit | 8.1 | AC-050 |
| H-02 | High | ChainAction message and max chain depth missing | Added `ChainAction` message + `ChainFailureMode` enum + `chain = 7` field | 8.1 | AC-051 |
| H-03 | High | Missed fire recovery procedure not specified | Added `CatchUpMode` enum + `catch_up_mode`/`max_catch_up` to ScheduleSpec + recovery procedure | 6.2, 8.2 | AC-052 |
| H-04 | High | Model training data isolation not specified | Added training data isolation subsection (PromQL filter, S3 prefix, registry isolation, DEK) | 6.3 | AC-053 |
| H-05 | High | Cross-RFC contract testing not specified | Added Section 31.2a with 6 Pact contract test boundaries | 31.2a | AC-054 |
| M-01 | Medium | Rule version history not immutable | Added `version` to Rule, `version_filter` to GetRuleHistoryRequest | 8.1 | AC-055 |
| M-02 | Medium | EVENT_RELATIVE schedule has no message | Added `EventRelativeSchedule` message + `event_relative = 11` to ScheduleSpec | 8.2 | AC-056 |
| M-03 | Medium | NATS consumer configuration incomplete | Added Section 20.1a with full consumer config | 20.1a | AC-057 |
| M-04 | Medium | Remediation idempotency not in protobuf | Added `idempotency_key` to RemediationAction and ExecuteActionRequest | 8.4 | AC-058 |
| L-01 | Low | Timezone database not specified | Specified IANA tzdata, quarterly updates | 6.2 | AC-059 |
| L-02 | Low | Retraining triggers not specified | Added retraining triggers (precision < 70%, recall < 50%, manual, quarterly) | 6.3 | AC-069 |
| E-01 | Enhancement | ChatOps integration for approvals | Already in Future Extensions (Section 35) | 35 | — |
| E-02 | Enhancement | Predictive auto-scaling | Already in Future Extensions (Section 35) | 35 | — |

---

## Executive Review Findings

| ID | Description | Resolution | Section | AC |
|----|-------------|------------|---------|-----|
| EXEC-01 | Automation Kill Switch | Added `KillSwitchService` protobuf API (Activate, Deactivate, GetState); platform-wide; executive approval to re-enable | 8.5 | AC-060, AC-061, AC-062 |
| EXEC-02 | Automation Governance Council | Added Section 25.5 with 4-member council, charter, monthly cadence | 25.5 | AC-063 |
| EXEC-03 | Cost Guardrails | Added Section 14.3a with per-tenant caps, 80% alert, 100% auto-pause | 14.3a | AC-064 |
| EXEC-04 | Phased Rollout | Added Section 22.0a with 4 phases, Governance Council gates, dry-run default, ML data prerequisite | 22.0a | AC-065, AC-066, AC-067 |
| EXEC-05 | Automation Playbooks | Added to Future Extensions (5 playbooks) | 35 | AC-068 |

---

## Summary

| Category | Total | Resolved | New ACs |
|----------|-------|----------|---------|
| Critical | 2 | 2 | 3 |
| High | 5 | 5 | 5 |
| Medium | 4 | 4 | 4 |
| Low | 2 | 2 | 2 |
| Enhancement | 2 | 2 (already present) | 0 |
| Executive | 5 | 5 | 9 |
| **Total** | **20** | **20** | **23** |