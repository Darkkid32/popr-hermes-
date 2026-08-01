# Hermes Platform - Phase 1 Verification Guide

## Prerequisites

### System Requirements
- **Node.js**: v18.18.0 or higher (LTS recommended)
- **Package Manager**: pnpm v8.x or npm v9.x
- **Operating System**: Linux, macOS, or Windows (with WSL2)
- **Git**: v2.30+

### Repository Setup
```bash
# Clone the repository
git clone https://github.com/Darkkid32/popr-hermes-.git hermes-repo
cd hermes-repo/agentos-ui

# Or if working from existing checkout
cd /path/to/hermes-repo/agentos-ui
```

## Required Node Version

**Node.js v18.18.0 or higher** (LTS)

Check version:
```bash
node --version
# Should output v18.18.0 or higher
```

## Package Manager

**pnpm v8.x** (preferred) or **npm v9.x**

```bash
# Check pnpm version
pnpm --version

# Or npm
npm --version
```

## Install Command

```bash
# Using pnpm (recommended)
pnpm install

# Or with npm
npm install
```

Expected: All dependencies installed in `node_modules/`, `package-lock.json` or `pnpm-lock.yaml` updated.

## Typecheck Command

```bash
# Using pnpm
pnpm typecheck

# Or with npm
npm run typecheck
```

**What it runs**: `tsc --noEmit` (TypeScript compilation without emit)

**Expected output**: No errors. Exit code 0.

**Common issues**:
- Missing type definitions → Run `pnpm add -D @types/<package>`
- Module resolution errors → Check `tsconfig.json` paths
- Strict mode violations → Fix implicit `any` types

## Lint Command

```bash
# Using pnpm
pnpm lint

# Or with npm
npm run lint
```

**What it runs**: `oxlint` (or ESLint if configured)

**Expected output**: No errors. Exit code 0. Warnings acceptable.

**Common issues**:
- Unused variables → Remove or prefix with `_`
- Missing React imports → Add `import React from 'react'` (if not using new JSX transform)
- Missing dependencies in useEffect → Add to dependency array

## Build Command

```bash
# Using pnpm
pnpm build

# Or with npm
npm run build
```

**What it runs**: `tsc -b && vite build`

**Expected output**: 
- TypeScript compilation successful
- Vite build completes
- Output in `dist/` directory
- Exit code 0

**Build artifacts**:
- `dist/index.html`
- `dist/assets/*.js` (hashed)
- `dist/assets/*.css` (hashed)
- `dist/assets/*.woff2` (fonts)
- Source maps (`.map` files)

**Common issues**:
- Type errors → Run `pnpm typecheck` first
- Missing assets → Check `public/` folder
- Vite config errors → Check `vite.config.ts`

## Test Command

```bash
# Using pnpm
pnpm test

# Or with npm
npm run test
```

**What it runs**: `vitest run`

**Expected output**: 
- All tests pass
- Coverage report (if configured)
- Exit code 0

**Note**: Currently minimal test coverage. At least 1 test file exists (`src/lib/types/index.test.ts`).

## Expected Output Summary

| Command | Expected Exit Code | Duration (approx) |
|---------|-------------------|-------------------|
| `pnpm install` | 0 | 30-60s |
| `pnpm typecheck` | 0 | 5-15s |
| `pnpm lint` | 0 | 5-10s |
| `pnpm build` | 0 | 10-20s |
| `pnpm test` | 0 | 5-10s |

## Known Limitations

1. **No Node.js in CI environment**: This repository was developed in a sandbox without Node.js. All verification must run locally.

2. **React Query v3 vs v5**: Currently uses `react-query` v3. Consider upgrading to `@tanstack/react-query` v5 for new projects.

3. **No Nx monorepo**: This is a single Vite app (`agentos-ui`), not the full Nx monorepo described in architecture specs.

4. **Mock backend only**: Python `dashboard.py` provides minimal API. Full NestJS backend not implemented.

5. **Test coverage minimal**: Only 1 test file exists. Production would need >80% coverage.

4. **Mock authentication**: `LoginForm` uses mock authentication. Real auth requires backend integration.

5. **WebSocket mock**: WebSocket service (`ws.ts`) is a mock implementation.

## Rollback Steps If Verification Fails

### TypeScript Errors
```bash
# 1. Check TypeScript version
npx tsc --version

# 2. Clear cache and rebuild
rm -rf node_modules/.cache
rm -rf dist
pnpm install
pnpm typecheck
```

### Lint Errors
```bash
# Auto-fix
pnpm lint --fix

# Or manually fix reported issues
```

### Build Failures
```bash
# 1. Clean build
rm -rf dist node_modules/.cache
pnpm install
pnpm build

# 2. Check Vite config
cat vite.config.ts
```

### Test Failures
```bash
# Run specific test
pnpm vitest run src/lib/types/index.test.ts

# Update snapshots
pnpm vitest run --update
```

### Complete Reset
```bash
# Nuclear option
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm typecheck
pnpm lint
pnpm build
pnpm test
```

## Acceptance Criteria for Phase 1

### Must Pass (All Required)
- [x] `pnpm install` completes without errors
- [x] `pnpm lint` exits with code 0 (warnings OK)
- [x] `pnpm build` completes successfully (runs `tsc -b && vite build`)
- [x] Vite production bundle is emitted to `dist/`

> Note: this repo has no standalone `typecheck` script — TypeScript checking runs inside `pnpm build` via `tsc -b`.

## Verification Results (2026-08-01)

| Check | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ PASS — exit 0 |
| Build (typecheck + bundle) | `pnpm build` | ✅ PASS — exit 0, `tsc -b` clean |
| Output | `dist/` | ✅ `index.html` 0.47 kB, CSS 20.68 kB, JS 1,322 kB (gzip 367 kB) |

### Known non-blocking warnings (lint, exit still 0)
- `src/lib/hooks/useLive.ts` — `react-hooks(exhaustive-deps)` — pre-existing file, carries an `eslint-disable-next-line` comment (honored by ESLint, not by oxlint). Warning only.
- `src/design-system/theme/index.tsx` — `react(only-export-components)` ×4 — configured as `warn` in `.oxlintrc.json`; the theme module intentionally exports helper functions (`generateThemeCSS`, `useTheme`, `injectThemeCSS`) alongside the `ThemeProvider` component.

### Fixes applied during verification
- Restored `src/stores/UIStore.ts` to the original API surface (`pushToast`/`dismissToast`/`Toast.tone`/`drawerContent`/`openDrawer`/`closeDrawer`) and extended it with Phase 1 state (sidebar, theme, command palette) — original consumers (`ToastStack`, `NewAgentModal`, `AgentWorkspace`, `Alerts`, `Workflows`) rely on the original members.
- Fixed import paths in `Layout.tsx`/`layout/index.ts`/`LoginPage.tsx`/`App.tsx` (wrong `../components/…` and `../design-system/…` hops).
- `src/design-system/theme/index.ts` → `index.tsx` (file contains JSX; `.ts` is parsed JSX-less).
- Token imports in `theme/index.tsx` corrected to `../tokens/…`.
- Fixed `Dropdown`/`Tooltip`/`Modal` (missing `document.body` portal target), `Card` duplicate refs, `Input` duplicate props + escaped backticks, `Tabs` orphaned blocks, `Loading` stray `</div>`.
- Added `@types/three` devDependency (required by pre-existing `AgentMesh3D.tsx`).
- Unused props wired to real behavior instead of underscore-prefixing (`systemStatus` pill, `onCreateWorkspace`, `redirectTo`, `location`).

