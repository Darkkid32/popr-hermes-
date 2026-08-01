# RFC-0011 Acceptance Criteria v1.1

**Status:** Approved
**Version:** 1.1
**Date:** 2026-07-25
**Total Criteria:** 69 (46 original + 23 new)

---

## Original Acceptance Criteria (AC-001 through AC-046)

### Rule Engine (AC-001 to AC-010)
- AC-001: Rule triggers within 100ms of event publication to NATS
- AC-002: CEL condition evaluates within 50ms
- AC-003: Action dispatched within 1s of condition passing
- AC-004: Rate limit enforced (max_fires_per_hour)
- AC-005: Circuit breaker opens after error_threshold consecutive failures
- AC-006: Circuit breaker auto-closes after open_duration
- AC-007: Dry-run mode evaluates trigger and condition but does not dispatch action
- AC-008: Rule history queryable by time range with trace_id
- AC-009: Rule validation rejects invalid CEL expressions
- AC-010: Rule update is atomic; execution history preserved

### Scheduler (AC-011 to AC-018)
- AC-011: Cron schedule fires within 5s of planned time
- AC-012: Interval schedule fires within 1s of planned time
- AC-013: Distributed lock prevents duplicate fire across replicas
- AC-014: Skipped fire logged with reason
- AC-015: Retry policy executes on workflow failure
- AC-016: On-failure action dispatched after max retries
- AC-017: Schedule pause/resume takes effect immediately
- AC-018: TriggerNow fires immediately bypassing schedule

### Anomaly Detection (AC-019 to AC-025)
- AC-019: Static threshold detects value outside bounds
- AC-020: Statistical baseline trains on 30 days of data
- AC-021: Anomaly detected within 10s of metric evaluation
- AC-022: Anomaly event published to NATS with trace_id
- AC-023: Feedback adjusts model sensitivity
- AC-024: Precision and recall metrics available
- AC-025: Model fallback to static threshold on training failure

### Remediation Engine (AC-026 to AC-032)
- AC-026: Pre-built actions execute within 30s
- AC-027: Approval gate blocks destructive actions until approved
- AC-028: Approval timeout triggers configured behavior (auto-reject/escalate)
- AC-029: Circuit breaker blocks remediation after error threshold
- AC-030: Escalation to human on-call on max retries exceeded
- AC-031: Remediation history queryable with full context
- AC-032: Dry-run mode logs intended action without execution

### Security and Multi-Tenant (AC-033 to AC-038)
- AC-033: All telemetry encrypted in transit (mTLS)
- AC-034: All audit events in Merkle transparency log
- AC-035: Tenant A rules not triggered by Tenant B events
- AC-036: Per-tenant resource quotas enforced
- AC-037: Destructive actions require approval with MFA
- AC-038: All decisions traceable via trace_id

### Observability (AC-039 to AC-043)
- AC-039: Automation metrics appear in Thanos within 10s
- AC-040: Automation logs appear in Loki within 15s
- AC-041: Automation traces appear in Tempo within 20s
- AC-042: Self-monitoring alerts fire within 1m of threshold breach
- AC-043: Rule execution traceable end-to-end (event to action)

### Upgrade and Migration (AC-044 to AC-046)
- AC-044: Component upgrade zero-downtime (drain policy)
- AC-045: Rule schema upgrade backward compatible
- AC-046: Model upgrade with shadow evaluation and rollback

---

## New Acceptance Criteria — Architecture Review (AC-047 to AC-059)

### v1.1 Architecture Review Findings
- AC-047: CompositeTrigger message supports AND/OR logic with temporal window (C-01)
- AC-048: CEL condition evaluation limited to 10,000 instructions, 50ms wall time, 1MB memory (C-02)
- AC-049: CEL sandbox rejects forbidden functions (file I/O, network, time, random, reflection) (C-02)
- AC-050: Action with dedup_key is not dispatched more than once within dedup_ttl (H-01)
- AC-051: ChainAction max_depth enforced (default: 3, max: 5); exceeds returns CHAIN_DEPTH_EXCEEDED (H-02)
- AC-052: Missed fire recovered per CatchUpMode within 1 hour (H-03)
- AC-053: Model training data isolated per tenant; no cross-tenant data leakage (H-04)
- AC-054: Cross-RFC contract tests pass for all integration boundaries (H-05)
- AC-055: Rule version incremented on UpdateRule; history filterable by version (M-01)
- AC-056: EVENT_RELATIVE schedule fires after event + delay (M-02)
- AC-057: NATS consumer uses pull type, explicit ack, max deliver 3 (M-03)
- AC-058: RemediationAction with idempotency_key returns original result on duplicate (24h TTL) (M-04)
- AC-059: IANA tzdata used for timezone conversion; updated quarterly (L-01)

---

## New Acceptance Criteria — Executive Review (AC-060 to AC-069)

### v1.1 Executive Review Findings
- AC-060: Kill switch activates and pauses ALL automation across ALL tenants within 5s (EXEC-01)
- AC-061: Kill switch deactivation requires executive_approval=true (EXEC-01)
- AC-062: Kill switch activation logged to Merkle transparency log (EXEC-01)
- AC-063: Automation Governance Council charter documented with monthly cadence (EXEC-02)
- AC-064: Per-tenant cost caps enforced; alert at 80%; auto-pause at 100% (EXEC-03)
- AC-065: Phased rollout gates require Governance Council approval to progress (EXEC-04)
- AC-066: All new rules start in dry-run mode for first 7 days (EXEC-04)
- AC-067: ML models require 30 days historical data before training (EXEC-04)
- AC-068: Automation Playbooks published (5 playbooks) (EXEC-05)
- AC-069: Model retraining triggered when precision < 70% or recall < 50% over 24h (L-02)

---

## Traceability Matrix

| Review Finding | AC | Category |
|---------------|-----|----------|
| C-01 | AC-047 | Architecture |
| C-02 | AC-048, AC-049 | Architecture |
| H-01 | AC-050 | Architecture |
| H-02 | AC-051 | Architecture |
| H-03 | AC-052 | Architecture |
| H-04 | AC-053 | Architecture |
| H-05 | AC-054 | Architecture |
| M-01 | AC-055 | Architecture |
| M-02 | AC-056 | Architecture |
| M-03 | AC-057 | Architecture |
| M-04 | AC-058 | Architecture |
| L-01 | AC-059 | Architecture |
| L-02 | AC-069 | Architecture |
| EXEC-01 | AC-060, AC-061, AC-062 | Executive |
| EXEC-02 | AC-063 | Executive |
| EXEC-03 | AC-064 | Executive |
| EXEC-04 | AC-065, AC-066, AC-067 | Executive |
| EXEC-05 | AC-068 | Executive |