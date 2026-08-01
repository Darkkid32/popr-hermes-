# Hermes Platform — Phase 3 Release Notes

**Version:** v1.0-phase3
**Date:** 2026-08-02
**Scope:** Security Workspace — complete security management surface on the Hermes UI Foundation.

---

## Overview

Phase 3 implements the complete Hermes Security Workspace: 12 pages covering users & access,
roles & permissions, API keys, secrets, certificates, security policies, active sessions,
audit log, threat monitor, compliance, and security settings — plus a unified overview.
Everything reuses the Phase 1–2 foundation: application shell, sidebar, top navigation,
theme engine, Hermes Design System, shared components, existing router, and Zustand stores.
Per spec, this is **UI only** — no external identity providers, backend authentication,
encryption services, or infrastructure implementation.

---

## Pages Implemented (12)

| Route | Page | Highlights |
|---|---|---|
| `/security` | Overview | KPI cards, MFA/policy/cert/secret risk stats, live audit, threat feed |
| `/security/users` | Users & Access | Searchable roster, MFA coverage, role/department columns |
| `/security/roles` | Roles & Permissions | Role cards + full role × permission matrix |
| `/security/api-keys` | API Keys | Masked keys, scopes, rotate/revoke actions |
| `/security/secrets` | Secrets | Rotation cadence cards, rotate-now; values never shown |
| `/security/certificates` | Certificates | TLS table, days-left coloring, issuer/key type |
| `/security/policies` | Security Policies | Policy builder with enforced/recommended/disabled controls |
| `/security/sessions` | Active Sessions | Device/location/IP monitor, current flag, revoke |
| `/security/audit` | Audit Log | Severity-filterable immutable event table |
| `/security/threats` | Threat Monitor | Severity-ranked detections with resolve action |
| `/security/compliance` | Compliance | SOC 2 / ISO 27001 / GDPR / PCI DSS scorecards |
| `/security/settings` | Security Settings | MFA, password, sessions, allowlist, auto-block, retention, danger zone |

## Components Added

- `SecurityOverviewCards` (reuses Phase 2 `StatCard`), `UserAccessTable`, `SecurityRoleMatrix`,
  `SecurityPermissionMatrix`, `ApiKeyTable`, `SecretCards`, `CertificateTable`, `PolicyBuilder`,
  `SessionMonitor`, `AuditLogTable`, `ThreatFeed`, `ComplianceDashboard`, `SecuritySettingsForm`.
- `SecurityLayout` — 12-tab sub-navigation with active states.

## Stores Added

- `securityStore.ts` — users (9), roles (5, 18 permissions across 6 groups), API keys (6),
  secrets (6), certificates (5), policies (6), sessions (6), audit (10), threats (5),
  compliance (4), settings; selectors + 8 mutation actions + reset.

## Routes Added

`/security` · `/security/users` · `/security/roles` · `/security/api-keys` · `/security/secrets` ·
`/security/certificates` · `/security/policies` · `/security/sessions` · `/security/audit` ·
`/security/threats` · `/security/compliance` · `/security/settings`
— all nested under `<Route path="/security" element={<SecurityLayout />}>`.
`PAGE_META['/security']` (roman XVIII) drives the shell header. Machine Control and
Organization routes unchanged.

## Files Created

33 files: `securityStore.ts` (+ test), 13 shared components (+ component test), `SecurityLayout`
+ 12 pages + barrel, `PHASE3_CHANGELOG.md`, `PHASE3_RELEASE.md`.

## Files Modified

3 files: `src/lib/demo-data.ts` (security nav group), `src/components/Sidebar.tsx`
(Security section — extension only), `src/App.tsx` (PAGE_META XVIII + nested routes).

## Verification Summary

| Gate | Command | Result |
|---|---|---|
| Install | `pnpm install` | ✅ |
| TypeScript | `pnpm typecheck` (`tsc -b`) | ✅ exit 0 |
| Lint | `pnpm lint` (oxlint) | ✅ exit 0 — 0 errors |
| Build | `pnpm build` (`tsc -b && vite build`) | ✅ exit 0 |
| Tests | `pnpm test` (vitest run) | ✅ 4 files · 27/27 passed |

Production bundle: `dist/index.html` 0.47 kB · CSS 20.68 kB · JS 1,821 kB (gzip 494 kB).

## Known Issues

- One TS error caught during verification (`SecurityRole.isSystem` optionality) — fixed in-place.
- All security data is mock/in-memory (UI only per spec). No backend, IdP, or engine wiring.
- Pre-existing lint warnings unchanged: `useLive.ts` exhaustive-deps + `theme/index.tsx`
  only-export-components ×4 (both configured as `warn`). Phase 3 added zero new warnings.

---

## Phase 4 Prerequisites

- [x] Phase 3 commit + tag `v1.0-phase3` pushed
- [x] All 5 verification gates green
- [ ] Approve Phase 3 release (stop — awaiting approval)
- [ ] Observability / Automation workspace (per architecture spec sequencing)
- [ ] Playwright E2E coverage for security flows
- [ ] Route-based code splitting across workspaces
