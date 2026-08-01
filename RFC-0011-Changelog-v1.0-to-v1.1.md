# RFC-0011 Changelog v1.0 → v1.1

**Date:** 2026-07-25
**Author:** Hermes Team
**Review:** Architecture Governance Review (Score: 90/100) + Executive Strategic Review
**Status:** All mandatory findings incorporated

---

## Summary

RFC-0011 v1.1 incorporates all 7 Architecture Review conditions (2 Critical + 5 High), all 5 Executive Review conditions, plus 4 Medium, 2 Low, and 1 Enhancement finding. Total of 23 new Acceptance Criteria added (AC-047 through AC-069).

---

## Architecture Review Findings (C-01 through H-05)

### C-01: COMPOSITE Trigger Message Definition
**Finding:** `COMPOSITE = 4` enum value had no corresponding message field.
**Resolution:** Added `CompositeTrigger` message with `repeated Trigger triggers`, `CompositeLogic logic` (AND/OR), `google.protobuf.Duration window`, and `bool cancel_on_partial`. Added `CompositeTrigger composite = 5` field to `Trigger` message. Added `CompositeLogic` enum.
**Sections Updated:** 8.1 (Trigger message)
**New AC:** AC-047

### C-02: CEL Expression Sandbox
**Finding:** No CEL sandbox specification (unlike RFC-0009 v1.1 Section 15.5).
**Resolution:** Added Section 9.3 "CEL Sandbox" with instruction limit (10,000), wall time (50ms), memory (1MB), allowlisted functions, forbidden operations, violation behavior, and rule validation requirement.
**Sections Updated:** 9.3 (new)
**New ACs:** AC-048, AC-049

### H-01: Action Deduplication Mechanism
**Finding:** Risk acknowledged but no deduplication mechanism specified.
**Resolution:** Added `string dedup_key` to `Action` message. Added `google.protobuf.Duration dedup_ttl` to `RateLimit` message (default: 300s). When dedup_key is set, Rule Engine tracks key for TTL; duplicate dispatches skipped and logged as `RATE_LIMITED`.
**Sections Updated:** 8.1 (Action, RateLimit messages)
**New AC:** AC-050

### H-02: ChainAction Message and Max Chain Depth
**Finding:** `CHAIN = 5` enum value had no message; no max depth parameter.
**Resolution:** Added `ChainAction` message with `repeated Action actions`, `int32 max_depth` (default: 3, max: 5), and `ChainFailureMode` enum (ABORT, CONTINUE). Added `ChainAction chain = 7` to `Action` message.
**Sections Updated:** 8.1 (Action message, ChainAction message)
**New AC:** AC-051

### H-03: Missed Fire Recovery Procedure
**Finding:** No explicit missed fire recovery procedure for Scheduler.
**Resolution:** Added `CatchUpMode` enum (EXECUTE_LATEST, EXECUTE_ALL, SKIP), `CatchUpMode catch_up_mode` and `int32 max_catch_up` to `ScheduleSpec`. Added "Missed Fire Recovery" subsection to Section 6.2 with recovery procedure and 1-hour catch-up window.
**Sections Updated:** 6.2 (Scheduler), 8.2 (ScheduleSpec message)
**New AC:** AC-052

### H-04: Model Training Data Isolation
**Finding:** No specification for per-tenant training data isolation.
**Resolution:** Added "Model Training Data Isolation" subsection to Section 6.3 specifying PromQL tenant_id filter, per-tenant S3 prefix, model registry tenant isolation, 1 GB training data limit, per-tenant feedback data, and per-tenant DEK encryption.
**Sections Updated:** 6.3 (Anomaly Detection Engine)
**New AC:** AC-053

### H-05: Cross-RFC Contract Testing
**Finding:** No cross-RFC contract testing in testing strategy.
**Resolution:** Added Section 31.2a "Cross-RFC Contract Testing" with Pact contract tests for 6 integration boundaries (RFC-0003, RFC-0007, RFC-0008, RFC-0010, RFC-0004, RFC-0009). CI gate requirement and contract versioning.
**Sections Updated:** 31.2a (new)
**New AC:** AC-054

---

## Medium Findings (M-01 through M-04)

### M-01: Rule Version History
**Resolution:** Added `int32 version = 11` to `Rule` message, incremented on each `UpdateRule`. Added `int32 version_filter = 6` to `GetRuleHistoryRequest`.
**New AC:** AC-055

### M-02: EVENT_RELATIVE Schedule Message
**Resolution:** Added `EventRelativeSchedule` message with `event_subject`, `delay`, `cancel_if_new_event`. Added `event_relative = 11` field to `ScheduleSpec`.
**New AC:** AC-056

### M-03: NATS Consumer Configuration
**Resolution:** Added Section 20.1a "NATS Consumer Configuration" specifying pull type, explicit ack, max deliver 3, max ack pending 1000, ack wait 30s, consumer group naming.
**New AC:** AC-057

### M-04: Remediation Idempotency
**Resolution:** Added `string idempotency_key = 5` to `RemediationAction` and `string idempotency_key = 7` to `ExecuteActionRequest`. Remediation Engine tracks keys for 24h; duplicates return original result.
**New AC:** AC-058

---

## Low Findings (L-01, L-02)

### L-01: Timezone Database
**Resolution:** Specified IANA tzdata as timezone database, updated quarterly during maintenance windows.
**New AC:** AC-059

### L-02: Retraining Triggers
**Resolution:** Added "Model Retraining Triggers" subsection to Section 6.3 specifying: precision < 70% over 24h, recall < 50% over 24h, manual trigger, quarterly scheduled. Fallback to previous model on retraining failure.
**New AC:** AC-069

---

## Executive Review Findings

### Kill Switch Architecture (Executive)
**Resolution:** Added Section 8.5 "Automation Kill Switch API" with `KillSwitchService` protobuf (Activate, Deactivate, GetState). Platform-wide scope; executive approval required to re-enable; Merkle audit; CRITICAL notification on activation.
**New ACs:** AC-060, AC-061, AC-062

### Automation Governance Council (Executive)
**Resolution:** Added Section 25.5 "Automation Governance Council" with 4-member council (Platform Eng, SRE, Security, Tenant Rep), monthly cadence, charter covering rule approval, audit review, remediation policy, kill switch review, phased rollout progression.
**New AC:** AC-063

### Cost Guardrails (Executive)
**Resolution:** Added Section 14.3a "Automation Cost Guardrails" with per-tenant caps (rule fires, remediations, anomaly evaluations, training, token usage, infrastructure cost). Alert at 80%, auto-pause at 100%, monthly cost report.
**New AC:** AC-064

### Phased Rollout (Executive)
**Resolution:** Added Section 22.0a "Phased Rollout Strategy" with 4 phases (Rules+Schedules, Remediation, Static Anomaly, ML Models). Governance Council approval required between phases. Dry-run default for 7 days. ML requires 30 days historical data.
**New ACs:** AC-065, AC-066, AC-067

### Automation Playbooks (Executive)
**Resolution:** Added "Automation Playbooks" to Future Extensions (Section 35): 5 playbooks (auto-restart, daily briefing, DLQ replay, SLO scaling, cost spike detection).
**New AC:** AC-068

---

## Statistics

| Metric | v1.0 | v1.1 | Delta |
|--------|------|------|-------|
| Characters | 71,336 | 85,928 | +14,592 |
| Lines | 1,987 | ~2,400 | ~+413 |
| Protobuf Blocks | 4 | 5 | +1 (Kill Switch) |
| Acceptance Criteria | 46 | 69 | +23 |
| Sections | 35 | 35 | 0 |
| Mermaid Diagrams | 4 | 4 | 0 |

---

## Verification

- ✅ All 7 Architecture Review conditions resolved
- ✅ All 5 Executive Review conditions incorporated
- ✅ All 4 Medium findings addressed
- ✅ All 2 Low findings addressed
- ✅ 23 new Acceptance Criteria added (AC-047 through AC-069)
- ✅ Version updated to 1.1
- ✅ Cross-RFC alignment maintained (RFC-0003, 0004, 0007, 0008, 0009, 0010)
- ✅ All existing content preserved
- ✅ Implementation-ready