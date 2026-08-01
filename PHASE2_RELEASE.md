# Hermes Platform — Phase 2 Release Notes

**Version:** v1.0-phase2
**Date:** 2026-08-02
**Scope:** Organization Workspace — full organization management surface on the Phase 1 UI Foundation.

---

## Overview

Phase 2 implements the complete Hermes Organization Workspace: 11 interconnected pages covering
members, teams, roles & permissions, workspaces, projects, environments, licenses, quotas,
activity, and settings. Everything reuses the Phase 1 application shell, sidebar, top navigation,
theme engine, Hermes Design System, shared components, and Zustand state management. No Phase 1
feature was replaced or redesigned; the only Phase 1 modifications are the routing/navigation
extensions required to reach the new workspace.

---

## Features Completed

### Organization Store
- New Zustand store (`organizationStore.ts`) with full mock domain: 12 members, 6 teams, 5 roles
  (Owner/Admin/Engineer/Analyst/Guest), 21 permissions across 7 resource groups, 6 workspaces,
  8 projects, 10 environments, 5 licenses, 8 quotas, 15 activity events, and org settings.
- Selectors: `memberById`, `teamById`, `roleById`, `membersByTeam`, `teamMemberCount`,
  `projectsByTeam`, `environmentsByProject`, `usagePct`, `utilization`.
- Actions: `inviteMember` (logs activity), `removeMember`, `toggleMemberStatus`,
  `updateSettings`, `logActivity`, `resetOrg`. Phase 1 stores (`UIStore`, `authStore`,
  `workspaceStore`) are untouched.

### Pages (11)
| Page | Highlights |
|---|---|
| Overview | Org identity card, 8 KPI stat cards, quota charts, recent activity, quick actions |
| Members | Searchable/filterable table, role & team badges, status pills, suspend/remove, invite modal |
| Teams | Team cards + team structure tree with leads and member chips |
| Roles & Permissions | Role coverage cards + full role × permission matrix |
| Workspaces | Workspace card grid with plan/region/status |
| Projects | Health badges, progress bars, budget burn, deadlines |
| Environments | Type/region/health cards with live URLs |
| Licenses | Seat-usage meters, expiry, annual cost |
| Quotas | Recharts bar chart (usage vs limit), utilization donut, per-resource meters |
| Activity | Type-filterable audit trail with outcome stats |
| Settings | Profile form, security toggles + session slider, notification toggles, danger zone, config summary |

### Shared Components Added
`OrgCard`, `StatCard`, `MemberTable`, `TeamTree`, `RoleMatrix`, `PermissionMatrix`,
`WorkspaceCards`, `ProjectCards`, `EnvironmentCards`, `LicenseCards`, `QuotaCharts`,
`ActivityTimeline`, `SettingsForms` (`OrgProfileForm` / `SecurityForm` / `NotificationsForm`),
plus `OrganizationLayout` with sub-navigation tabs.

### Routes Added
`/org` (index → Overview), `/org/overview`, `/org/members`, `/org/teams`, `/org/roles`,
`/org/workspaces`, `/org/projects`, `/org/environments`, `/org/licenses`, `/org/quotas`,
`/org/activity`, `/org/settings` — nested under `<Route path="/org" element={<OrganizationLayout />}>`.
`PAGE_META['/org']` (roman XVII · Organization Workspace) drives the shell page header.
Machine Control (`/mission`) and all other Phase 1 routes are unchanged.

### Tooling
- Added `typecheck` (`tsc -b`) and `test` (`vitest run`) npm scripts.
- Vitest 4 + jsdom dev toolchain; `vitest.config.ts` + `vitest.setup.ts`.
- 12 tests: 9 store logic tests (node) + 3 component smoke renders (jsdom).

---

## Files Created

34 files:
- `src/stores/organizationStore.ts` + `organizationStore.test.ts`
- `src/components/organization/` — 13 shared components + `index.ts` barrel + `OrgCard.test.tsx`
- `src/pages/organization/` — `OrganizationLayout` + 11 pages + `index.ts` barrel
- `vitest.config.ts`, `vitest.setup.ts`
- `PHASE2_CHANGELOG.md`, `PHASE2_RELEASE.md`

## Files Modified

5 files:
- `src/lib/demo-data.ts` — `NavLink.group` gains `'org'`; Organization sidebar entry
- `src/components/Sidebar.tsx` — "Organization" section (extension, no redesign)
- `src/App.tsx` — PAGE_META XVII + nested `/org/*` routes
- `package.json` — typecheck/test scripts + vitest/jsdom devDependencies
- `pnpm-lock.yaml` — dependency lock update

---

## Verification Summary

| Gate | Command | Result |
|---|---|---|
| Install | `pnpm install` | ✅ |
| TypeScript | `pnpm typecheck` (`tsc -b`) | ✅ exit 0 |
| Lint | `pnpm lint` (oxlint) | ✅ exit 0 — 0 errors |
| Build | `pnpm build` (`tsc -b && vite build`) | ✅ exit 0 |
| Tests | `pnpm test` (vitest run) | ✅ 12/12 passed |

Production bundle: `dist/index.html` 0.47 kB · CSS 20.68 kB · JS 1,748 kB (gzip 483 kB).

## Known Pre-existing Warnings (non-blocking)

- `src/lib/hooks/useLive.ts` — `react-hooks(exhaustive-deps)` — pre-existing Phase 1 file
  carrying an `eslint-disable-next-line` comment (honored by ESLint, not oxlint).
- `src/design-system/theme/index.tsx` — `react(only-export-components)` ×4 — configured as
  `warn`; the theme module intentionally exports helpers alongside `ThemeProvider`.

Phase 2 introduced zero new warnings and zero errors.

---

## Phase 3 Prerequisites

- [x] Phase 2 commit + tag `v1.0-phase2` pushed
- [x] All 5 verification gates green
- [ ] Approve Phase 2 release (stop — awaiting approval)
- [ ] Security Workspace implementation plan (next workspace in the architecture spec)
- [ ] API contract alignment: org store selectors/actions → real backend endpoints
- [ ] Route-based code splitting for the organization pages (bundle currently single-chunk)
- [ ] Playwright E2E coverage for the org flows (invite, role matrix, quota charts)
