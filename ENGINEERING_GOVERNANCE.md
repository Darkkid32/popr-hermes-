# ENGINEERING_GOVERNANCE.md

## Hermes Engineering Governance Policy

**Version:** 2.0  
**Effective Date:** 2026-08-05  
**Authority:** Release Manager, Principal QA Engineer, Engineering Governance Lead  
**Status:** FROZEN — Requires governance approval to modify

---

## 1. Quality Policy

### 1.1 Mandatory Quality Gates

Every release candidate MUST pass ALL gates before merge, tag, or release:

| Gate | Command | Pass Criteria |
|------|---------|---------------|
| **TypeScript** | `pnpm typecheck` | 0 errors |
| **Build** | `pnpm build` | Success (exit code 0) |
| **Tests** | `pnpm test` | 0 failures |
| **Lint** | `pnpm lint` | ≤ Approved Baseline warnings |

### 1.2 Verification Checklist

Before ANY merge to `main`:
- [ ] `pnpm typecheck` → 0 errors
- [ ] `pnpm build` → PASS
- [ ] `pnpm test` → PASS
- [ ] `pnpm lint` → Warnings ≤ 46
- [ ] All routes return 200 OK on preview

---

## 2. Release Policy

### 2.1 Release Flow

```
Development → Quality Gates → Governance Review → Tag → Release
```

### 2.2 Tagging Requirements

| Tag Type | Requirements |
|----------|--------------|
| **Patch (vX.Y.Z+1)** | Quality gates pass, no baseline change |
| **Minor (vX.Y+1.0)** | Quality gates pass, baseline ≤ current |
| **Major (vX+1.0.0)** | Quality gates pass, governance approval |

### 2.3 Blocked Releases

A release is **BLOCKED** if:
- TypeScript errors > 0
- Build fails
- Tests fail
- Lint warnings > 46 (Approved Baseline)
- Any quality gate skipped

---

## 3. Lint Baseline Policy

### 3.1 Current Approved Baseline

```
APPROVED_BASELINE = 46 warnings
ESTABLISHED = 2026-08-05
COMMIT = 477f368 (v1.0.1)
```

### 3.2 Baseline Evolution Rules

| Scenario | Action |
|----------|--------|
| Warnings decrease (45, 44, 43...) | **Automatic** — New lower number becomes baseline immediately |
| Warnings increase (47+) | **BLOCKED** — Release rejected, must fix or request exception |
| Warnings stay same (46) | **Allowed** — No action needed |

### 3.3 Baseline Increase Exception Process

A baseline increase is ONLY permitted when **ALL** conditions are met:

1. **Architectural Change** — Documented structural change (e.g., new design system, major refactor)
2. **Full Classification** — Every new warning categorized (A/B/C/D/E per LINT_BASELINE_V2.md)
3. **Written Justification** — Rationale document explaining why warnings are acceptable
4. **Explicit Approval** — Governance lead signs off
5. **Documentation Updated** — `LINT_BASELINE.md` incremented and committed

**No exceptions without all 5 conditions.**

---

## 4. Warning Classification Framework

All warnings MUST be classified using the standard categories:

| Category | Code | Description | Action |
|----------|------|-------------|--------|
| **Pre-existing** | A | Existed before change | Defer / Fix later |
| **Design System** | B | Introduced by architectural change | Accept (with justification) |
| **Fix Later** | C | Should be fixed in future sprint | Track in backlog |
| **False Positive** | D | Rule mismatch, not a real issue | Suppress with comment |
| **Never Allowed** | E | Critical — security, perf, correctness | Block release |

### 4.1 Classification Requirements

- Every warning in CI output must have a category
- Classification documented in `LINT_BASELINE.md`
- Reviewed during governance approval

---

## 5. Exception Policy

### 5.1 Emergency Hotfix Exception

For production-critical hotfixes ONLY:

| Condition | Process |
|-----------|---------|
| Production incident | Release Manager may approve one-time baseline exceedance |
| Duration | Exception expires in 72 hours |
| Follow-up | Must fix and restore baseline within sprint |
| Documentation | Record in `HOTFIX_EXCEPTIONS.md` |

### 5.2 Experimental Feature Exception

For feature branches behind flags:

| Condition | Process |
|-----------|---------|
| Behind feature flag | Warnings allowed in feature branch |
| Before merge to main | Must meet baseline or have approved exception |
| No production impact | Feature flag OFF in production |

### 5.3 Exception Denial

Exceptions are **DENIED** for:
- Routine feature work
- Technical debt accumulation
- "We'll fix it later" without tracking
- Missing classification

---

## 6. Future Governance Rules

### 6.1 Mandatory Automation

| Rule | Implementation |
|------|----------------|
| Lint in CI | `pnpm lint` runs on every PR |
| Typecheck in CI | `pnpm typecheck` runs on every PR |
| Build in CI | `pnpm build` runs on every PR |
| Tests in CI | `pnpm test` runs on every PR |
| Baseline check | CI fails if warnings > 46 |

### 6.2 Quality Metrics Tracking

Track and report monthly:

| Metric | Target |
|--------|--------|
| TypeScript errors | 0 |
| Build success rate | 100% |
| Test pass rate | 100% |
| Lint warnings | ≤ 46 (trending down) |
| Mean time to fix warnings | < 1 sprint |

### 6.3 Governance Review Cadence

| Review | Frequency | Participants |
|--------|-----------|--------------|
| Baseline audit | Quarterly | Release Manager, QA Lead, Tech Lead |
| Warning trend analysis | Monthly | QA Lead |
| Exception review | Per incident | Release Manager |
| Policy update | Semi-annual | All governance leads |

---

## 7. Compliance & Enforcement

### 7.1 Non-Compliance Consequences

| Violation | Consequence |
|-----------|-------------|
| Merge without gates | Revert + mandatory review |
| Baseline increase without approval | Revert + governance review |
| Exception abuse | Exception privileges revoked |
| Repeated violations | Release privileges suspended |

### 7.2 Reporting

- CI dashboard shows baseline compliance
- Weekly quality report to engineering leads
- Monthly governance summary to leadership

---

## 8. Document Control

### 8.1 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-01 | — | Initial baseline (37 warnings) |
| 2.0 | 2026-08-05 | Governance Lead | Design System re-baseline (46 warnings) |

### 8.2 Related Documents

- `LINT_BASELINE_V2.md` — Detailed warning classification
- `LINT_BASELINE.md` — Current approved baseline (this version)
- `HOTFIX_EXCEPTIONS.md` — Emergency exception log
- `QUALITY_GATES.md` — CI/CD gate configuration

### 8.3 Amendment Process

This policy may only be amended by:
1. Proposal from Governance Lead
2. Review by Release Manager + QA Lead
3. Written approval from all three
4. Version increment + commit

---

## 9. Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Release Manager | | ✅ Approved | 2026-08-05 |
| Principal QA Engineer | | ✅ Approved | 2026-08-05 |
| Engineering Governance Lead | | ✅ Approved | 2026-08-05 |

---

## Appendix A: Quick Reference Card

```
HERMES QUALITY GATE — QUICK REFERENCE
═══════════════════════════════════════
TYPECHECK    : 0 errors        (HARD BLOCK)
BUILD        : PASS            (HARD BLOCK)
TESTS        : 0 failures      (HARD BLOCK)
LINT         : ≤ 46 warnings   (HARD BLOCK if > 46)

BASELINE     : 46 (frozen)
TREND        : Down only
EXCEPTIONS   : Governance only

RELEASE READY = ALL GREEN
═══════════════════════════════════════
```

---

## Appendix B: Classification Decision Tree

```
NEW WARNING DETECTED
        │
        ▼
Is it a real issue (security/perf/correctness)?
        │
        ├─ YES → Category E → BLOCK RELEASE
        │
        ▼
Was it introduced by an architectural change?
        │
        ├─ YES → Category B → Document + Governance Approval
        │
        ▼
Did it exist before?
        │
        ├─ YES → Category A → Defer / Fix Later
        │
        ▼
Is it a false positive?
        │
        ├─ YES → Category D → Suppress with comment
        │
        ▼
Should be fixed eventually?
        │
        └─ YES → Category C → Track in backlog
```

---

**END OF ENGINEERING_GOVERNANCE.md**

This policy is FROZEN. Changes require governance approval.