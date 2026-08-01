# Hermes Platform — Phase 3 Changelog

**Version:** v1.0-phase3
**Date:** 2026-08-02
**Scope:** Security Workspace implementation on the Hermes UI Foundation (Phases 1–2).

---

## Overview

Phase 3 delivers the complete Security Workspace: 12 pages covering the full security
surface — overview, users & access, roles & permissions, API keys, secrets, certificates,
security policies, active sessions, audit log, threat monitor, compliance, and security
settings. Everything extends the existing Hermes Design System, component library,
application shell, router, and Zustand architecture. UI only: no identity providers,
no backend auth, no encryption services, no external infra (per spec).

## Features Completed

- **Security store** (`securityStore.ts`) — new Zustand store (Phase 1/2 stores untouched):
  users, security roles, 18-permission security catalog, API keys, secrets, certificates,
  policies, sessions, audit entries, threats, compliance frameworks, and security settings;
  selectors (user/role lookup, sessions-by-user, active threats, open sessions, keys expiring)
  and actions (revoke session, revoke/rotate key, rotate secret, resolve threat, update policy
  status, update settings, log audit, reset demo data).
- **Security Layout** — 12-tab sub-navigation with active states, nested under `/security`.
- **Security Overview** — KPI cards (users, keys, sessions, threats), MFA/policy/certificate/
  secret risk stats, live audit table, and active threat feed.
- **Users & Access** — searchable roster with role/department/MFA/status columns and MFA coverage.
- **Roles & Permissions** — role cards with permission-coverage meters + full role × permission
  matrix (6 resource groups, 18 permissions, 5 security roles).
- **API Keys** — masked-key table with scopes, expiry, rotate/revoke actions, status counts.
- **Secrets** — managed-reference cards with rotation cadence and rotate-now action; values never shown.
- **Certificates** — TLS table with issuer, key type, days-left coloring, expiry status.
- **Security Policies** — policy builder with enforced/recommended/disabled radio controls and
  control chips.
- **Active Sessions** — session monitor with device/location/IP, current-session flag, revoke action.
- **Audit Log** — severity-filterable immutable event table.
- **Threat Monitor** — severity-ranked threat feed with source/target metadata and resolve action.
- **Compliance** — framework dashboard (SOC 2, ISO 27001, GDPR, PCI DSS) with scores and control counts.
- **Security Settings** — MFA/password toggles, session-timeout slider, IP allowlist, auto-block
  threats, alert email, audit retention, danger-zone reset, live configuration summary.

## Routes Added

| Route | Page |
|---|---|
| `/security` | Security Overview |
| `/security/users` | Users & Access |
| `/security/roles` | Roles & Permissions |
| `/security/api-keys` | API Keys |
| `/security/secrets` | Secrets |
| `/security/certificates` | Certificates |
| `/security/policies` | Security Policies |
| `/security/sessions` | Active Sessions |
| `/security/audit` | Audit Log |
| `/security/threats` | Threat Monitor |
| `/security/compliance` | Compliance |
| `/security/settings` | Security Settings |

All routes are nested under `<Route path="/security" element={<SecurityLayout />}>`.
`PAGE_META['/security']` (XVIII · Security Workspace) drives the shell page header.
Machine Control and Organization routes are unchanged.

## Components Added

### Shared components (`src/components/security/`)
- `SecurityOverviewCards` — KPI stat cards (reuses `StatCard` from Phase 2 org components)
- `UserAccessTable` — searchable user roster
- `SecurityRoleMatrix` — security role cards
- `SecurityPermissionMatrix` — role × permission access grid
- `ApiKeyTable` — scoped key table with rotate/revoke
- `SecretCards` — secret rotation cards
- `CertificateTable` — TLS certificate table
- `PolicyBuilder` — policy status builder
- `SessionMonitor` — live session table
- `AuditLogTable` — severity-filterable audit table
- `ThreatFeed` — severity-ranked threat cards
- `ComplianceDashboard` — framework scorecards
- `SecuritySettingsForm` — settings forms with toggles

### Pages (`src/pages/security/`)
- `SecurityLayout` + 12 pages + barrel `index.ts`

## Files Created

```
agentos-ui/src/stores/securityStore.ts
agentos-ui/src/stores/securityStore.test.ts
agentos-ui/src/components/security/index.ts
agentos-ui/src/components/security/SecurityOverviewCards.tsx
agentos-ui/src/components/security/UserAccessTable.tsx
agentos-ui/src/components/security/SecurityRoleMatrix.tsx
agentos-ui/src/components/security/SecurityPermissionMatrix.tsx
agentos-ui/src/components/security/ApiKeyTable.tsx
agentos-ui/src/components/security/SecretCards.tsx
agentos-ui/src/components/security/CertificateTable.tsx
agentos-ui/src/components/security/PolicyBuilder.tsx
agentos-ui/src/components/security/SessionMonitor.tsx
agentos-ui/src/components/security/AuditLogTable.tsx
agentos-ui/src/components/security/ThreatFeed.tsx
agentos-ui/src/components/security/ComplianceDashboard.tsx
agentos-ui/src/components/security/SecuritySettingsForms.tsx
agentos-ui/src/components/security/securityComponents.test.tsx
agentos-ui/src/pages/security/index.ts
agentos-ui/src/pages/security/SecurityLayout.tsx
agentos-ui/src/pages/security/SecurityOverview.tsx
agentos-ui/src/pages/security/SecurityUsers.tsx
agentos-ui/src/pages/security/SecurityRoles.tsx
agentos-ui/src/pages/security/SecurityApiKeys.tsx
agentos-ui/src/pages/security/SecuritySecrets.tsx
agentos-ui/src/pages/security/SecurityCertificates.tsx
agentos-ui/src/pages/security/SecurityPolicies.tsx
agentos-ui/src/pages/security/SecuritySessions.tsx
agentos-ui/src/pages/security/SecurityAudit.tsx
agentos-ui/src/pages/security/SecurityThreats.tsx
agentos-ui/src/pages/security/SecurityCompliance.tsx
agentos-ui/src/pages/security/SecuritySettings.tsx
PHASE3_CHANGELOG.md
PHASE3_RELEASE.md
```

## Files Modified

| Path | Change |
|---|---|
| `agentos-ui/src/lib/demo-data.ts` | `NavLink.group` extended with `'security'`; Security nav entry added |
| `agentos-ui/src/components/Sidebar.tsx` | New "Security" nav section (extension only — no redesign) |
| `agentos-ui/src/App.tsx` | `PAGE_META['/security']` (XVIII) + nested `/security/*` routes + imports |

## Verification Summary

| Gate | Command | Result |
|---|---|---|
| Install | `pnpm install` | ✅ exit 0 |
| TypeScript | `pnpm typecheck` (`tsc -b`) | ✅ exit 0 |
| Lint | `pnpm lint` (oxlint) | ✅ exit 0 — 0 errors |
| Build | `pnpm build` (`tsc -b && vite build`) | ✅ exit 0 |
| Tests | `pnpm test` (vitest run) | ✅ 4 files · 27/27 passed |

Production bundle: `dist/index.html` 0.47 kB · CSS 20.68 kB · JS 1,821 kB (gzip 494 kB).

## Known Pre-existing Warnings (unchanged, non-blocking)

- `src/lib/hooks/useLive.ts` — `react-hooks(exhaustive-deps)` (pre-existing Phase 1 file).
- `src/design-system/theme/index.tsx` — `react(only-export-components)` ×4 (configured as `warn`).

Phase 3 introduced **zero new lint warnings or errors**.

## Known Issues

- One TypeScript error caught during verification (`SecurityRole.isSystem` required vs optional)
  was fixed in-place before release; no runtime impact.
- Security data is mock in-memory (UI only, per spec — no backend integration).

## Phase 4 Prerequisites

- [x] Phase 3 commit + tag `v1.0-phase3` pushed
- [x] All 5 verification gates green
- [ ] Approve Phase 3 release (stop — awaiting approval)
- [ ] Next workspace implementation (Observability / Automation per architecture spec)
- [ ] Playwright E2E coverage for security flows (key rotation, session revoke, policy builder)
- [ ] Route-based code splitting across all workspaces (bundle currently single-chunk)
