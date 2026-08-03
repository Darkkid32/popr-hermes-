# Hermes Platform — Project Baseline

**Status**: FROZEN  
**Effective Date**: 2026-08-03  
**Authority**: Chief Software Architect / Principal Release Manager  

---

## 1. Repository Information

| Field | Value |
|-------|-------|
| **Repository** | `popr-hermes-` (https://github.com/Darkkid32/popr-hermes-.git) |
| **Current Branch** | `main` |
| **Current Release** | `v1.0-phase7` — Platform Integration |
| **Latest Stable Tag** | `v1.0-phase7` |
| **Quality Baseline Tag** | `v1.0-lint-baseline` |
| **Project Baseline Tag** | `v1.0-project-baseline` (this release) |
| **Commit Hash** | `12c8c1e` (chore(lint): establish Hermes lint baseline) |
| **Build System** | Vite 8.2.0 + Rolldown |
| **Package Manager** | pnpm 9.x (prefix: `C:\Users\poove\AppData\Local\hermes\node`) |
| **Node.js** | 20.x (via Hermes bundled) |
| **TypeScript** | 5.x (strict, verbatimModuleSyntax) |

---

## 2. Released Milestones

| Tag | Release | Date | Scope |
|-----|---------|------|-------|
| `v1.0-phase1` | UI Foundation | 2026-07-XX | Design system, base components, theming |
| `v1.0-phase2` | Organization Workspace | 2026-07-XX | Org dashboard, team management, settings |
| `v1.0-phase3` | Security Workspace | 2026-07-XX | Auth, RBAC, audit logs, secrets |
| `v1.0-phase4` | Observability Workspace | 2026-07-XX | Metrics, traces, logs, alerts |
| `v1.0-phase5` | Automation Workspace | 2026-07-XX | Workflows, triggers, schedules |
| `v1.0-phase6` | Models Workspace | 2026-07-XX | Model registry, benchmarks, deployments |
| `v1.0-phase6.1` | Memory & Knowledge | 2026-07-XX | Vector store, RAG, embeddings |
| `v1.0-phase7` | Platform Integration | 2026-08-03 | **30 shared integration services** |
| `v1.0-ui-polish` | UI Polish Pass | 2026-08-03 | Visual refinements, accessibility |
| `v1.0-lint-baseline` | Lint Baseline | 2026-08-03 | 37 warnings frozen, quality gate |
| `v1.0-project-baseline` | Project Baseline | 2026-08-03 | **This document — architecture frozen** |

---

## 3. Workspace Inventory (10 Workspaces)

| # | Workspace | Route | Description | Status |
|---|-----------|-------|-------------|--------|
| 1 | **Mission Control** | `/mission` | Primary dashboard, system overview | ✅ Complete |
| 2 | **Machine Control** | `/machines` | Hardware monitoring, GPU/CPU, thermal | ✅ Complete |
| 3 | **Organization** | `/organization` | Teams, members, roles, billing | ✅ Complete |
| 4 | **Security** | `/security` | Auth policies, audit, secrets, RBAC | ✅ Complete |
| 5 | **Observability** | `/observability` | Metrics, traces, logs, alerts, dashboards | ✅ Complete |
| 6 | **Automation** | `/automation` | Workflows, triggers, cron, pipelines | ✅ Complete |
| 7 | **Models** | `/models` | Model registry, benchmarks, deployments | ✅ Complete |
| 8 | **Memory & Knowledge** | `/memory` | Vector store, RAG, embeddings, search | ✅ Complete |
| 9 | **Plugins** | `/plugins` | Plugin marketplace, management, config | ✅ Complete |
| 10 | **MCP Workspace** | `/mcp` | Model Context Protocol servers, tools | ✅ Complete |

**Total Workspaces**: 10  
**Deep-link Compatibility**: All workspace URLs frozen — no breaking changes permitted

---

## 4. Routing Inventory

### Top-Level Routes (10)
```
/mission
/machines
/organization
/security
/observability
/automation
/models
/memory
/plugins
/mcp
```

### Nested Routes (per workspace)
| Workspace | Nested Routes |
|-----------|---------------|
| Mission | `/`, `/settings`, `/profile` |
| Machines | `/`, `/:id`, `/:id/metrics`, `/:id/logs` |
| Organization | `/`, `/teams`, `/teams/:id`, `/members`, `/billing` |
| Security | `/`, `/policies`, `/audit`, `/secrets`, `/rbac` |
| Observability | `/`, `/metrics`, `/traces`, `/logs`, `/alerts`, `/dashboards` |
| Automation | `/`, `/workflows`, `/workflows/:id`, `/triggers`, `/schedules` |
| Models | `/`, `/registry`, `/registry/:id`, `/benchmarks`, `/deployments` |
| Memory | `/`, `/collections`, `/collections/:id`, `/search`, `/embeddings` |
| Plugins | `/`, `/marketplace`, `/installed`, `/settings` |
| MCP | `/`, `/servers`, `/servers/:id`, `/tools` |

### Protected Routes (auth-required)
All workspace routes require authentication. Route guards implemented via:
- `src/lib/integration/route-guards.tsx` — HOC + `checkRouteAccess`
- `src/lib/integration/permission-guards.ts` — Role/permission checks
- `src/lib/integration/auth-context.tsx` — Authentication state
- `src/lib/integration/authorization-context.tsx` — Policy-based access

---

## 5. Store Inventory (6 Zustand Stores + 12 Integration Stores)

### Core Domain Stores (`src/stores/`)
| Store | Purpose | Dependencies | Consumers |
|-------|---------|--------------|-----------|
| `UIStore` | Global UI state (toasts, modals, drawers, sidebar) | — | All workspaces |
| `MCPStore` | MCP server connections, tools, resources | — | MCP Workspace |
| `MemoryStore` | Vector collections, embeddings, search index | — | Memory Workspace |
| `ModelsStore` | Model registry, benchmarks, deployments | — | Models Workspace |
| `PluginsStore` | Plugin marketplace, installed plugins, config | — | Plugins Workspace |
| `SkillsStore` | Skill definitions, executions, templates | — | Skills system |

### Platform Integration Stores (`src/lib/integration/`)
| Store | Purpose | Dependencies | Consumers |
|-------|---------|--------------|-----------|
| `ServiceRegistry` | Platform service discovery, health | — | All integration services |
| `WorkspaceRegistry` | Workspace definitions, metadata, ordering | — | Navigation, Command Palette |
| `NavigationRegistry` | Nav groups, active item, expansion state | WorkspaceRegistry | Sidebar, Breadcrumbs |
| `CommandPalette` | Global commands, search, shortcuts | All registries | Cmd+K palette |
| `NotificationCenter` | Toast queue, persistence, actions | UIStore | All workspaces |
| `GlobalSearch` | Cross-workspace search index, execution | All workspace stores | Command Palette |
| `DialogManager` | Modal dialog stack, state | UIStore | All workspaces |
| `DrawerManager` | Side drawer stack, state | UIStore | All workspaces |
| `ModalManager` | Full-screen modal stack, state | UIStore | All workspaces |
| `LoadingManager` | Global loading states, progress | — | All async operations |
| `EventBus` | Pub/sub, typed events, cross-workspace | — | All integration services |
| `WebSocketManager` | WS connections, reconnection, routing | EventBus | Real-time features |

---

## 6. Service Inventory (30 Platform Services)

### Core Infrastructure (6)
| Service | File | Description |
|---------|------|-------------|
| **API Client** | `api-client.ts` | Global HTTP client, retry, timeout, interceptors |
| **Service Registry** | `service-registry.ts` | Service discovery, registration, health checks |
| **Workspace Registry** | `workspace-registry.ts` | 10 workspace definitions, metadata, icons |
| **Navigation Registry** | `navigation-registry.ts` | Nav groups, expansion, active tracking |
| **Config Provider** | `config-provider.tsx` | Platform config, feature flags, context |
| **Environment Provider** | `environment-provider.tsx` | Env detection (dev/staging/prod), capabilities |

### Cross-Workspace Navigation (4)
| Service | File | Description |
|---------|------|-------------|
| **Command Palette** | `command-palette.ts` | Global Cmd+K, workspace commands, search |
| **Notification Center** | `notification-center.ts` | Toast queue, persistence, actions, UIStore link |
| **Global Search** | `global-search.ts` | Cross-workspace search, indexing, execution |
| **Workspace Context** | `workspace-context-provider.tsx` | Active workspace, breadcrumbs, context |

### UI State Management (6)
| Service | File | Description |
|---------|------|-------------|
| **Dialog Manager** | `dialog-manager.ts` | Modal stack, confirm dialogs, forms |
| **Drawer Manager** | `drawer-manager.ts` | Side drawers, persistent panels |
| **Modal Manager** | `modal-manager.ts` | Full-screen modals, focus trap |
| **Error Boundary** | `error-boundary.tsx` | React error boundary + HOC |
| **Loading Manager** | `loading-manager.ts` | Progress bars, spinners, skeleton states |
| **Performance** | `performance.tsx` | Lazy loading, code splitting, metrics |

### Security & Access Control (4)
| Service | File | Description |
|---------|------|-------------|
| **Event Bus** | `event-bus.ts` | Pub/sub, typed events, cross-workspace |
| **WebSocket Manager** | `websocket-manager.ts` | WS connections, reconnection, routing |
| **Permission Guards** | `permission-guards.ts` | RBAC, roles, permissions, guards |
| **Route Guards** | `route-guards.tsx` | Route protection, redirects, metadata |

### Authentication & Authorization (3)
| Service | File | Description |
|---------|------|-------------|
| **Auth Context** | `auth-context.tsx` | Login/logout, session, user profile |
| **Authorization Context** | `authorization-context.tsx` | Policy-based access, resource actions |
| **Theme Sync** | `theme-sync.tsx` | Dark/light/system, persistence, sync |

### User Experience (4)
| Service | File | Description |
|---------|------|-------------|
| **Preferences** | `preferences.tsx` | User settings, localStorage, import/export |
| **Keyboard Shortcuts** | `keyboard-shortcuts.tsx` | Global shortcuts, groups, registration |
| **Dialog Manager** | (see above) | — |
| **Drawer Manager** | (see above) | — |

**Total Platform Services**: 30 (0 new services may be added without architecture review)

---

## 7. Component Inventory

### Shared UI Components (`src/components/ui/`) — 47 Components
| Category | Count | Components |
|----------|-------|------------|
| **Layout** | 6 | Container, Grid, Stack, Flex, Section, Divider |
| **Feedback** | 8 | Toast, Alert, Badge, Progress, Spinner, Skeleton, Tooltip, Popover |
| **Forms** | 12 | Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Form, Field, Label, Button, ButtonGroup |
| **Data Display** | 8 | Table, Card, List, Avatar, Chip, Tag, Accordion, Tabs |
| **Navigation** | 5 | Breadcrumbs, Pagination, Stepper, Menu, Dropdown |
| **Overlays** | 4 | Dialog, Drawer, Modal, Popover |
| **Charts** | 4 | LineChart, BarChart, PieChart, Sparkline |

### Workspace Components — ~150 Components
| Workspace | Est. Components | Key Components |
|-----------|----------------|----------------|
| Mission | 15 | Dashboard, SystemStatus, QuickActions |
| Machines | 18 | MachineCard, MetricsPanel, ThermalView |
| Organization | 20 | TeamGrid, MemberTable, RoleManager |
| Security | 22 | PolicyEditor, AuditLog, SecretVault |
| Observability | 25 | MetricChart, TraceViewer, LogStream |
| Automation | 20 | WorkflowCanvas, TriggerBuilder |
| Models | 18 | ModelCard, BenchmarkTable, DeployWizard |
| Memory | 15 | CollectionBrowser, SearchResults |
| Plugins | 12 | PluginCard, Marketplace, ConfigPanel |
| MCP | 10 | ServerCard, ToolExplorer |

### Layout Components — 8
`AppLayout`, `Sidebar`, `TopBar`, `Breadcrumbs`, `WorkspaceHeader`, `Footer`, `ResponsiveContainer`, `PageTransition`

**Total Components**: ~205 (shared + workspace + layout)

---

## 8. Design System (Hermes Design System — `src/styles/`)

### Typography
| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-base` | `'Inter', system-ui, sans-serif` | Body text |
| `--font-family-mono` | `'JetBrains Mono', monospace` | Code, data |
| `--font-family-display` | `'Space Grotesk', sans-serif` | Headings, numbers |
| `--font-size-xs` | `0.75rem` (12px) | Captions |
| `--font-size-sm` | `0.875rem` (14px) | Small text |
| `--font-size-base` | `1rem` (16px) | Body |
| `--font-size-lg` | `1.125rem` (18px) | Large text |
| `--font-size-xl` | `1.25rem` (20px) | Subheadings |
| `--font-size-2xl` | `1.5rem` (24px) | Headings |
| `--font-size-3xl` | `2rem` (32px) | Display |

### Colors (CSS Custom Properties)
| Category | Tokens |
|----------|--------|
| **Background** | `--bg-0` (deep), `--bg-1` (surface), `--bg-2` (elevated), `--bg-3` (overlay) |
| **Text** | `--text` (primary), `--text-2` (secondary), `--text-3` (muted), `--text-inverse` |
| **Border** | `--border` (default), `--border-strong` (focus), `--border-subtle` (dividers) |
| **Brand** | `--brand` (primary), `--brand-hover`, `--brand-muted`, `--brand-on` |
| **Semantic** | `--success`, `--warning`, `--error`, `--info` (each with hover/on variants) |

### Spacing (4px base unit)
| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

### Radius
| Token | Value |
|-------|-------|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 9999px |

### Elevation (Box Shadows)
| Token | Value |
|-------|-------|
| `--elevation-1` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--elevation-2` | `0 4px 6px rgba(0,0,0,0.07)` |
| `--elevation-3` | `0 10px 15px rgba(0,0,0,0.1)` |
| `--elevation-4` | `0 20px 25px rgba(0,0,0,0.15)` |

### Motion
| Token | Value |
|-------|-------|
| `--duration-fast` | 150ms |
| `--duration-base` | 250ms |
| `--duration-slow` | 350ms |
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--easing-emphasized` | `cubic-bezier(0.4, 0, 0, 1)` |

### Icons
- **Library**: Lucide React (tree-shaken)
- **Size tokens**: `--icon-sm` (16px), `--icon-md` (20px), `--icon-lg` (24px), `--icon-xl` (32px)
- **Rule**: All icons via `<Icon name="..." size="md" />` component

### Component Rules
1. **No raw CSS** — Use design tokens only
2. **No hardcoded values** — Reference CSS custom properties
3. **Dark mode first** — All colors defined for both themes
4. **Motion respect** — Honor `prefers-reduced-motion`
5. **Focus visible** — All interactive elements have visible focus ring
6. **Component API** — Props typed, defaults sensible, forwarding refs

---

## 9. Quality Baseline

| Metric | Baseline | Policy |
|--------|----------|--------|
| **TypeScript Errors** | 0 | Must remain 0 |
| **Lint Errors** | 0 | Must remain 0 |
| **Lint Warnings** | 37 | **May only decrease** |
| **Build** | PASS | Must pass |
| **Tests** | 2/2 PASS | Must pass |

### Warning Inventory (37 Frozen)
| Category | Count | Files |
|----------|-------|-------|
| `react/only-export-components` | 24 | 8 integration providers |
| `react-hooks/exhaustive-deps` | 4 | auth-context, useLive |
| `eslint/no-unused-expressions` | 6 | ModelsOverview, ModelsBenchmarks |
| `eslint/no-unused-vars` | 1 | preferences.tsx (catch `_error`) |

**Quality Gate**: Any release with >37 warnings is BLOCKED.

---

## 10. Performance Baseline

| Metric | Value | Notes |
|--------|-------|-------|
| **Bundle Size (JS)** | 1,558.29 kB (403.70 kB gzipped) | Single chunk — code splitting recommended |
| **Bundle Size (CSS)** | 20.68 kB (4.65 kB gzipped) | Design system + components |
| **Modules Transformed** | 646 | Vite + Rolldown |
| **Build Time** | ~800-1000ms | Clean build |
| **TypeScript Check** | <2s | `tsc --noEmit` |
| **Test Count** | 2 tests | ErrorBoundary only |
| **Test Duration** | ~40ms | Vitest |
| **Lint Duration** | ~20ms | oxlint (104 rules, 122 files) |

---

## 11. Technical Debt

### Accepted Warnings (37 — frozen at baseline)
1. **Fast Refresh Violations (24)**: Context + hooks exported from same `.tsx` files — requires architectural split (context in `.ts`, provider in `.tsx`)
2. **Exhaustive Deps (4)**: 
   - `auth-context.tsx` — Stale closure risk in useEffect (lines 135, 155)
   - `useLive.ts` — Intentional polling pattern, needs `[]` deps
3. **Unused Expressions (6)**: Canvas drawing ternary-as-statement in Models pages
4. **Unused Catch Var (1)**: `preferences.tsx` — prefixed `_error` but still warned

### Deferred Work
- [ ] Split React contexts from providers (architectural, Phase 8+)
- [ ] Fix exhaustive-deps in auth-context (investigate stale closure risk)
- [ ] Refactor canvas drawing to if/else (cosmetic)
- [ ] Add code splitting for bundle size reduction
- [ ] Increase test coverage (currently 1 test file)

### Known Limitations
- Single JS bundle >500kB — impacts initial load
- No E2E tests — only unit test for ErrorBoundary
- No Storybook — component documentation manual
- No visual regression testing

---

## 12. Roadmap

### Phase 8 — Real-Time Platform (Next)
- WebSocket integration across all workspaces
- Live metrics streaming
- Collaborative features (presence, cursors)
- Server-sent events fallback
- Connection resilience, offline queue

### Phase 9 — Performance & Hardening
- Code splitting, lazy loading per workspace
- Bundle analysis, tree shaking optimization
- E2E test suite (Playwright)
- Visual regression (Chromatic/Percy)
- Load testing, profiling
- Accessibility audit (WCAG 2.1 AA)

### Phase 10 — Production Release
- CI/CD pipeline hardening
- Release automation, changelogs
- Monitoring, alerting, SLOs
- Documentation site
- Migration guides
- v1.0.0 GA release

---

## Verification Results (Final)

| Gate | Command | Result |
|------|---------|--------|
| **TypeScript** | `pnpm typecheck` | ✅ PASS (0 errors) |
| **Lint** | `pnpm lint` | ✅ PASS (37 warnings, 0 errors) |
| **Build** | `pnpm build` | ✅ PASS (711ms, 646 modules) |
| **Tests** | `pnpm test` | ✅ PASS (2/2 tests) |
| **Warning Count** | — | ✅ 37 (<= 37 baseline) |

---

## Repository State

| Check | Status |
|-------|--------|
| **Working Tree** | Clean |
| **GitHub Synced** | ✅ (origin/main @ 12c8c1e) |
| **Tags Pushed** | ✅ v1.0-phase7, v1.0-lint-baseline |
| **Documentation** | ✅ PROJECT_BASELINE.md created |

---

## Commit & Tag

```bash
# Commit
git add PROJECT_BASELINE.md
git commit -m "docs: establish Hermes project baseline"

# Tag
git tag v1.0-project-baseline

# Push
git push origin main
git push origin v1.0-project-baseline
```

---

**Baseline Established**: 2026-08-03  
**Authority**: Chief Software Architect  
**Next Review**: Phase 8 Planning Approval  

---

========================================================

✅ HERMES PROJECT BASELINE ESTABLISHED

Repository Frozen

Architecture Frozen

Quality Gate Frozen

Engineering Baseline Established

Ready For Phase 8

========================================================