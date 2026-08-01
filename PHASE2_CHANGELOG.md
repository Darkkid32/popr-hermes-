# Hermes Platform — Phase 2 Changelog

**Version:** v1.0-phase2
**Date:** 2026-08-02
**Scope:** Organization Workspace implementation on the Phase 1 UI Foundation.

---

## Overview

Phase 2 delivers the complete Organization Workspace: 11 pages covering the full
organization surface — members, teams, roles & permissions, workspaces, projects,
environments, licenses, quotas, activity, and settings — built entirely on the
Phase 1 Hermes Design System, existing component library, application shell, and
Zustand state management. No Phase 1 files were modified except where required to
extend navigation and routing.

## Features Completed

- **Organization store** (`organizationStore.ts`) — new Zustand store (Phase 1 stores untouched):
  members, teams, roles, permission catalog, workspaces, projects, environments, licenses,
  quotas, activity timeline, and settings; selectors (team membership, project/env lookups,
  quota utilization) and actions (invite/remove/toggle member, update settings, log activity,
  reset demo data).
- **Organization Layout** — sub-navigation tabs across all 11 sections with active states,
  mounted under a single `/org` route with nested children.
- **Members** — searchable, filterable member table with role/team badges, status pills,
  suspend/reactivate/remove actions, and an invite-member modal (name, email, role picker,
  team multi-select).
- **Teams** — team summary cards plus a full team structure view with leads and member chips.
- **Roles & Permissions** — role cards with permission-coverage meters and member counts,
  plus a complete role × permission matrix (7 resource groups, 21 permissions, 5 roles).
- **Workspaces** — workspace card grid with plan/region badges and member/project counts.
- **Projects** — project portfolio with health badges, progress bars, budget utilization,
  and deadline tracking.
- **Environments** — environment cards with type/region badges, health dots, and live URLs.
- **Licenses** — license cards with seat-usage progress and expiry/cost metadata.
- **Quotas** — Recharts-based resource-vs-limit bar chart, overall utilization donut, and
  per-resource usage bars with ≥80% capacity alerts.
- **Activity** — filterable audit trail (type filters, outcome stats, timeline rendering).
- **Settings** — organization profile form (persists via store), security toggles (MFA, SSO,
  password policy, session-timeout slider), notification toggles, danger-zone reset, and a
  live configuration summary.
- **Tooling** — added `typecheck` (`tsc -b`) and `test` (`vitest run`) scripts; Vitest +
  jsdom dev toolchain with 12 passing tests (store logic + component smoke renders).

## Routes Added

| Route | Page |
|---|---|
| `/org` · `/org/overview` | Organization Overview |
| `/org/members` | Members |
| `/org/teams` | Teams |
| `/org/roles` | Roles & Permissions |
| `/org/workspaces` | Workspaces |
| `/org/projects` | Projects |
| `/org/environments` | Environments |
| `/org/licenses` | Licenses |
| `/org/quotas` | Quotas |
| `/org/activity` | Activity |
| `/org/settings` | Settings |

All routes are nested under `<Route path="/org" element={<OrganizationLayout />}>`.
`PAGE_META['/org']` (XVII · Organization Workspace) supplies the shell page header;
Machine Control and all Phase 1 routes are unchanged.

## Components Added

### Shared components (`src/components/organization/`)
- `OrgCard` · `StatCard` — organization identity + KPI stat cards
- `MemberTable` — searchable member directory
- `TeamTree` — team structure with leads and member chips
- `RoleMatrix` — role cards with permission coverage
- `PermissionMatrix` — role × permission access grid
- `WorkspaceCards` — workspace card grid
- `ProjectCards` — project portfolio cards
- `EnvironmentCards` — environment cards
- `LicenseCards` — license seat-usage cards
- `QuotaCharts` — Recharts usage/limit bar chart + utilization donut
- `ActivityTimeline` — timeline with type icons and outcome badges
- `SettingsForms` — `OrgProfileForm`, `SecurityForm`, `NotificationsForm`, `ToggleRow`

### Pages (`src/pages/organization/`)
- `OrganizationLayout` + 11 pages (Overview, Members, Teams, Roles, Workspaces, Projects,
  Environments, Licenses, Quotas, Activity, Settings) + barrel `index.ts`

## Files Created

```
agentos-ui/src/stores/organizationStore.ts
agentos-ui/src/stores/organizationStore.test.ts
agentos-ui/src/components/organization/index.ts
agentos-ui/src/components/organization/OrgCard.tsx
agentos-ui/src/components/organization/OrgCard.test.tsx
agentos-ui/src/components/organization/MemberTable.tsx
agentos-ui/src/components/organization/TeamTree.tsx
agentos-ui/src/components/organization/RoleMatrix.tsx
agentos-ui/src/components/organization/PermissionMatrix.tsx
agentos-ui/src/components/organization/WorkspaceCards.tsx
agentos-ui/src/components/organization/ProjectCards.tsx
agentos-ui/src/components/organization/EnvironmentCards.tsx
agentos-ui/src/components/organization/LicenseCards.tsx
agentos-ui/src/components/organization/QuotaCharts.tsx
agentos-ui/src/components/organization/ActivityTimeline.tsx
agentos-ui/src/components/organization/SettingsForms.tsx
agentos-ui/src/pages/organization/index.ts
agentos-ui/src/pages/organization/OrganizationLayout.tsx
agentos-ui/src/pages/organization/OrganizationOverview.tsx
agentos-ui/src/pages/organization/OrganizationMembers.tsx
agentos-ui/src/pages/organization/OrganizationTeams.tsx
agentos-ui/src/pages/organization/OrganizationRoles.tsx
agentos-ui/src/pages/organization/OrganizationWorkspaces.tsx
agentos-ui/src/pages/organization/OrganizationProjects.tsx
agentos-ui/src/pages/organization/OrganizationEnvironments.tsx
agentos-ui/src/pages/organization/OrganizationLicenses.tsx
agentos-ui/src/pages/organization/OrganizationQuotas.tsx
agentos-ui/src/pages/organization/OrganizationActivity.tsx
agentos-ui/src/pages/organization/OrganizationSettings.tsx
agentos-ui/vitest.config.ts
agentos-ui/vitest.setup.ts
PHASE2_CHANGELOG.md
PHASE2_RELEASE.md
```

## Files Modified

| Path | Change |
|---|---|
| `agentos-ui/package.json` | Added `typecheck` / `test` scripts; `vitest`, `jsdom` devDependencies |
| `agentos-ui/pnpm-lock.yaml` | Lockfile update for vitest/jsdom |
| `agentos-ui/src/lib/demo-data.ts` | `NavLink.group` extended with `'org'`; Organization nav entry added |
| `agentos-ui/src/components/Sidebar.tsx` | New "Organization" nav section (extension only — no redesign) |
| `agentos-ui/src/App.tsx` | `PAGE_META['/org']` (XVII) + nested `/org/*` routes + page imports |

## Verification Summary

| Gate | Command | Result |
|---|---|---|
| Install | `pnpm install` | ✅ exit 0 |
| TypeScript | `pnpm typecheck` (`tsc -b`) | ✅ exit 0 |
| Lint | `pnpm lint` (oxlint) | ✅ exit 0 — 0 errors |
| Build | `pnpm build` (`tsc -b && vite build`) | ✅ exit 0 |
| Tests | `pnpm test` (vitest run) | ✅ 2 files · 12/12 passed |

## Known Pre-existing Warnings (unchanged, non-blocking)

- `src/lib/hooks/useLive.ts` — `react-hooks(exhaustive-deps)` (pre-existing Phase 1 file).
- `src/design-system/theme/index.tsx` — `react(only-export-components)` ×4 (configured as
  `warn`; intentional helper exports alongside `ThemeProvider`).

Phase 2 introduced **zero new lint warnings or errors**.
