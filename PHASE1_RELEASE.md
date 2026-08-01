# Hermes Platform — Phase 1 Release Notes

**Version:** v1.0-phase1
**Date:** 2026-08-01
**Scope:** UI Foundation — AgentOS design system, layout shell, feedback states, auth, and workspace stores.

---

## Overview

Phase 1 establishes the visual and structural foundation of the Hermes Platform. It delivers a
complete CSS-custom-property design system (dark/light theme engine), a reusable component library
(primitives + feedback states), the application layout shell (sidebar, top navigation, workspace
navigation), authentication scaffolding, and the state stores powering the "Machine Control" UI.

All work builds on the existing Vite + React 19 + TypeScript + Tailwind 4 + Zustand architecture —
no framework changes, no backend dependencies. The app type-checks, lints, and produces a
production bundle.

---

## Features Completed

### Design System
- **Theme engine** — `ThemeProvider` with `light` / `dark` / `system` modes, OKLCH color tokens,
  typography, spacing, radii, shadows, and z-index scales; `generateThemeCSS` /
  `injectThemeCSS` helpers; persists preference to `localStorage`.
- **Tokens** — brand/accent/surface/text/status color scales (`tokens/colors`), type scale
  (`tokens/typography`), spacing & elevation system (`tokens/spacing`).

### Component Library (primitives)
- `Button`, `Input`, `Badge`, `Avatar`, `Card`, `Modal`, `Dropdown`, `Tooltip`, `Tabs`,
  `Skeleton` — all themed via CSS variables, keyboard-accessible, forwardRef-based.

### Feedback States
- `Loading` family (Spinner, LoadingOverlay, Skeleton, LoadingState), `EmptyState`,
  `ErrorState`, `SuccessState` — with barrel exports via `components/feedback/index.ts`.

### Application Shell
- `Layout` — responsive shell with mobile sidebar overlay + skip-link.
- `TopNavigation` — page meta (location · date · page name), system-status pill, theme toggle,
  notifications, and user profile dropdown.
- `WorkspaceNavigation` — searchable workspace list, grid/list view toggle, status badges,
  create-workspace entry point (wired to `workspaceStore`).

### State & Auth
- `workspaceStore` — workspaces + templates with mock data, `setCurrentWorkspaceById`, async
  action signatures ready for API integration.
- `authStore` + `LoginForm` / `LoginPage` — mock authentication flow with show/hide password,
  validation error states, redirect support, `/login` route.
- `UIStore` — original API (`pushToast`/`dismissToast`/drawer) preserved and extended with
  sidebar, theme, and command-palette state.

---

## Files Added

| Path | Purpose |
|---|---|
| `agentos-ui/src/design-system/index.ts` | Design system barrel export |
| `agentos-ui/src/design-system/index.css` | Global CSS variables + base styles |
| `agentos-ui/src/design-system/theme/index.tsx` | ThemeProvider, theme engine, useTheme |
| `agentos-ui/src/design-system/tokens/colors.ts` | OKLCH color token scales |
| `agentos-ui/src/design-system/tokens/typography.ts` | Font family/size/weight/line-height tokens |
| `agentos-ui/src/design-system/tokens/spacing.ts` | Spacing, radii, shadows, z-index, breakpoints |
| `agentos-ui/src/components/index.ts` | Component barrel |
| `agentos-ui/src/components/ui/` | Button, Input, Badge, Avatar, Card, Modal, Dropdown, Tooltip, Tabs |
| `agentos-ui/src/components/feedback/` | Loading, EmptyState, ErrorState, SuccessState + barrel |
| `agentos-ui/src/components/layout/` | Layout, TopNavigation, WorkspaceNavigation + barrel |
| `agentos-ui/src/lib/auth/` | LoginForm |
| `agentos-ui/src/pages/LoginPage.tsx` | Login route page |
| `agentos-ui/src/stores/authStore.ts` | Auth state store |
| `agentos-ui/src/stores/workspaceStore.ts` | Workspace/template store with mock data |
| `agentos-ui/pnpm-lock.yaml` | Lockfile for reproducible installs |
| `PHASE1_CHANGELOG.md` | Phase 1 changelog |
| `PHASE1_VERIFICATION.md` | Verification guide + results |

---

## Files Modified

| Path | Change |
|---|---|
| `agentos-ui/package.json` | Added `@types/three` devDependency (required by `AgentMesh3D.tsx`) |
| `agentos-ui/src/App.tsx` | ThemeProvider wiring, `/login` route, import path fixes |
| `agentos-ui/src/lib/demo-data.ts` | Minor type alignment |
| `agentos-ui/src/stores/UIStore.ts` | Original API preserved; extended with sidebar/theme/command-palette state |

---

## Verification Summary

| Check | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ PASS — exit 0 (5 non-blocking warnings) |
| Build | `pnpm build` (`tsc -b && vite build`) | ✅ PASS — exit 0 |
| Bundle | `dist/` | ✅ index.html 0.47 kB · CSS 20.68 kB · JS 1,322 kB (gzip 367 kB) |

**Ad-hoc verification** (`hermes-verify-loading-*`): focused behavioral checks on the
`Loading.tsx` Phase 1 changes (size-prop wiring, portal target, no dead code) — all PASS,
plus artifact-freshness proof that `dist/` bundles the current source.

### Non-blocking lint warnings
- `src/lib/hooks/useLive.ts` — `react-hooks(exhaustive-deps)` — pre-existing file; carries an
  `eslint-disable-next-line` comment honored by ESLint but not oxlint.
- `src/design-system/theme/index.tsx` — `react(only-export-components)` ×4 — configured as
  `warn`; the theme module intentionally exports helpers alongside `ThemeProvider`.

---

## Known Limitations

1. **`pnpm typecheck` script absent** — TypeScript checking runs inside `pnpm build` via
   `tsc -b`; no standalone script exists.
2. **Mock backend** — `workspaceStore` / `authStore` use in-memory mock data; the Python
   `dashboard.py` is minimal. Real API/NestJS integration is Phase 2+.
3. **Mock auth** — `LoginForm` is a UI flow only; no token validation or session persistence
   against a real identity provider.
4. **React Query v3** — app uses legacy `react-query` v3; upgrade to `@tanstack/react-query` v5
   is a candidate for a later phase.
5. **Bundle size** — single 1.32 MB JS chunk (367 kB gzip); code-splitting via dynamic imports
   is deferred.
6. **No automated tests yet** — verification is lint + typecheck + production build; test
   coverage is planned for Phase 2.

---

## Phase 2 Prerequisites

- [x] Phase 1 commit + tag `v1.0-phase1` pushed
- [x] Lint and build gates green
- [ ] Approve Phase 1 release (stop — awaiting approval)
- [ ] Standalone `typecheck` script (`tsc -b` alias) for CI parity
- [ ] Test framework setup (Vitest) + core component tests
- [ ] API contract for workspace/template CRUD (backend service)
- [ ] Real authentication integration decision (mock → identity provider)
- [ ] Route-based code splitting for the agent workspace pages
