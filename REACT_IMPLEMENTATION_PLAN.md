# Hermes AI OS - React Implementation Plan

**Source**: Google Stitch Project `projects/10866743485103090405`  
**Design System**: Hermes AI OS  
**Version**: 1.0  
**Status**: Approved - Single Source of Truth

---

## Implementation Strategy

**Core Principle**: Replace presentation layer only. Preserve all architecture, routing, stores, business logic, backend, and MCP integrations.

### Tech Stack Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Styling** | CSS Variables + CSS Modules | Design tokens as CSS custom properties, component-scoped styles |
| **Component Base** | Radix UI Primitives | Accessible by default, unstyled, composable |
| **Animation** | Framer Motion | Declarative, performant, layout animations |
| **Charts** | Recharts | React-native, dark theme support, responsive |
| **Graphs** | React Flow (workflows), Cytoscape (topology), Sigma.js (knowledge) | Best-in-class for each use case |
| **Tables** | TanStack Table v8 | Headless, virtualization, sorting, filtering |
| **Forms** | React Hook Form + Zod | Performant, type-safe validation |
| **State** | Zustand (existing) + React Query | Keep existing, add server state |
| **Routing** | React Router v6 (existing) | Keep existing |
| **Build** | Vite (existing) | Keep existing |

---

## File Structure

### New Files to Create

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── colors.ts           # Color token objects + CSS var generation
│   │   ├── typography.ts       # Typography tokens
│   │   ├── spacing.ts          # Spacing tokens
│   │   ├── shadows.ts          # Shadow/elevation tokens
│   │   ├── motion.ts           # Motion tokens
│   │   ├── borderRadius.ts     # Border radius tokens
│   │   ├── breakpoints.ts      # Breakpoint tokens
│   │   ├── zIndex.ts           # Z-index tokens
│   │   ├── icons.ts            # Icon tokens
│   │   ├── components/         # Component-specific tokens
│   │   │   ├── button.ts
│   │   │   ├── input.ts
│   │   │   ├── table.ts
│   │   │   ├── modal.ts
│   │   │   └── index.ts
│   │   └── index.ts            # Export all tokens + CSS var generator
│   │
│   ├── theme/
│   │   ├── ThemeProvider.tsx   # CSS variable injection + context
│   │   ├── cssVariables.css    # Generated CSS custom properties
│   │   ├── globalStyles.css    # Reset, base, utilities
│   │   └── reducedMotion.css   # prefers-reduced-motion styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   ├── WorkspaceSwitcher.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── NotificationCenter.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/
│   │   │   ├── Tabs.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Stepper.tsx
│   │   │   ├── TreeView.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── data-display/
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Chart.tsx
│   │   │   ├── Graph.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── DataGrid.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── feedback/
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Popover.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── overlay/
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── ContextMenu.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── specialized/
│   │   │   ├── WorkflowCanvas.tsx
│   │   │   ├── KnowledgeGraph.tsx
│   │   │   ├── ServiceTopology.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   ├── SkillCard.tsx
│   │   │   ├── PluginCard.tsx
│   │   │   ├── ModelCard.tsx
│   │   │   ├── MCPServerCard.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts            # Export all components
│   │
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useKeyboardShortcut.ts
│   │   ├── useTheme.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useFocusTrap.ts
│   │   ├── useClickOutside.ts
│   │   └── index.ts
│   │
│   └── utils/
│       ├── cn.ts               # classNames utility
│       ├── format.ts           # Formatting utilities
│       ├── color.ts            # Color utilities
│       └── index.ts
│
├── workspaces/
│   ├── machine-control/
│   │   ├── MissionControlDashboard.tsx
│   │   ├── FleetManager.tsx
│   │   ├── SystemDashboard.tsx
│   │   ├── components/
│   │   │   ├── AgentMetricCard.tsx
│   │   │   ├── AgentActivityFeed.tsx
│   │   │   ├── QuickActionsPanel.tsx
│   │   │   ├── ResourceCharts.tsx
│   │   │   └── AlertsPanel.tsx
│   │   └── index.ts
│   │
│   ├── organization/
│   │   ├── OrganizationOverview.tsx
│   │   ├── TeamsRBAC.tsx
│   │   ├── AuditLogs.tsx
│   │   ├── components/
│   │   │   ├── TeamTree.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── RoleBuilder.tsx
│   │   │   └── SSOConfig.tsx
│   │   └── index.ts
│   │
│   ├── security/
│   │   ├── SecurityPosture.tsx
│   │   ├── ThreatDetection.tsx
│   │   ├── VulnerabilityManagement.tsx
│   │   ├── ComplianceCenter.tsx
│   │   ├── components/
│   │   │   ├── RiskGauge.tsx
│   │   │   ├── ThreatMap.tsx
│   │   │   ├── VulnerabilityTable.tsx
│   │   │   └── ComplianceMatrix.tsx
│   │   └── index.ts
│   │
│   ├── observability/
│   │   ├── TelemetryOverview.tsx
│   │   ├── ServiceTopology.tsx
│   │   ├── MetricsExplorer.tsx
│   │   ├── LogAggregation.tsx
│   │   ├── DistributedTracing.tsx
│   │   ├── AlertRules.tsx
│   │   ├── DashboardBuilder.tsx
│   │   ├── DataStreams.tsx
│   │   ├── components/
│   │   │   ├── REDMetrics.tsx
│   │   │   ├── TopologyGraph.tsx
│   │   │   ├── PromQLBuilder.tsx
│   │   │   ├── FlameGraph.tsx
│   │   │   ├── LiveTail.tsx
│   │   │   ├── AlertRuleBuilder.tsx
│   │   │   └── DashboardCanvas.tsx
│   │   └── index.ts
│   │
│   ├── automation/
│   │   ├── AutomationHub.tsx
│   │   ├── VisualWorkflowBuilder.tsx
│   │   ├── ExecutionHistory.tsx
│   │   ├── components/
│   │   │   ├── WorkflowCanvas.tsx
│   │   │   ├── NodeLibrary.tsx
│   │   │   ├── NodeProperties.tsx
│   │   │   ├── ExecutionTimeline.tsx
│   │   │   └── TemplateGrid.tsx
│   │   └── index.ts
│   │
│   ├── models/
│   │   ├── ModelCatalog.tsx
│   │   ├── ModelBenchmarks.tsx
│   │   ├── RoutingRules.tsx
│   │   ├── EndpointHealth.tsx
│   │   ├── components/
│   │   │   ├── ModelCard.tsx
│   │   │   ├── BenchmarkChart.tsx
│   │   │   ├── RoutingRuleBuilder.tsx
│   │   │   └── EndpointStatus.tsx
│   │   └── index.ts
│   │
│   ├── memory/
│   │   ├── KnowledgeGraph.tsx
│   │   ├── VectorSearch.tsx
│   │   ├── NotesEditor.tsx
│   │   ├── OmiTimeline.tsx
│   │   ├── VaultBrowser.tsx
│   │   ├── components/
│   │   │   ├── GraphExplorer.tsx
│   │   │   ├── SemanticSearch.tsx
│   │   │   ├── MarkdownEditor.tsx
│   │   │   └── VaultTree.tsx
│   │   └── index.ts
│   │
│   ├── plugins/
│   │   ├── PluginMarketplace.tsx
│   │   ├── InstalledPlugins.tsx
│   │   ├── PluginDevelopment.tsx
│   │   ├── components/
│   │   │   ├── PluginCard.tsx
│   │   │   ├── PluginDetail.tsx
│   │   │   └── PluginConfig.tsx
│   │   └── index.ts
│   │
│   ├── skills/
│   │   ├── SkillMarketplace.tsx
│   │   ├── SkillBuilder.tsx
│   │   ├── SkillTemplates.tsx
│   │   ├── components/
│   │   │   ├── SkillCard.tsx
│   │   │   ├── SkillCanvas.tsx
│   │   │   └── TemplateGrid.tsx
│   │   └── index.ts
│   │
│   ├── mcp/
│   │   ├── MCPServerRegistry.tsx
│   │   ├── ToolsExplorer.tsx
│   │   ├── ResourcesBrowser.tsx
│   │   ├── PromptsLibrary.tsx
│   │   ├── components/
│   │   │   ├── ServerCard.tsx
│   │   │   ├── ToolSchema.tsx
│   │   │   └── ResourceTemplate.tsx
│   │   └── index.ts
│   │
│   └── settings/
│       ├── SettingsLayout.tsx
│       ├── GeneralSettings.tsx
│       ├── AppearanceSettings.tsx
│       ├── IntegrationsSettings.tsx
│       ├── PrivacySettings.tsx
│       ├── PerformanceSettings.tsx
│       ├── AdvancedSettings.tsx
│       └── index.ts
│
├── shared/
│   ├── layout/
│   │   ├── AppShell.tsx          # NEW - replaces current layout
│   │   ├── Sidebar.tsx           # NEW - replaces current Sidebar
│   │   ├── TopNav.tsx            # NEW - replaces current TopNav
│   │   ├── WorkspaceSwitcher.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── NotificationCenter.tsx
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── DataTable.tsx         # Enhanced Table with all features
│   │   ├── MetricCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── AgentCard.tsx
│   │   ├── WorkflowCanvas.tsx
│   │   ├── KnowledgeGraph.tsx
│   │   ├── ServiceTopology.tsx
│   │   └── index.ts
│   │
│   └── hooks/
│       ├── useWorkspace.ts
│       ├── useNavigation.ts
│       └── index.ts
│
└── pages/                        # UPDATED - replace content only
    ├── MissionControl.tsx        # Full replace
    ├── Organization.tsx          # Full replace
    ├── Security.tsx              # Full replace
    ├── Observability.tsx         # Full replace
    ├── Automation.tsx            # Full replace
    ├── Models.tsx                # Full replace
    ├── Memory.tsx                # Full replace
    ├── Plugins.tsx               # Full replace
    ├── Skills.tsx                # Full replace
    ├── MCP.tsx                   # Full replace
    ├── Settings.tsx              # Full replace
    ├── Login.tsx                 # Full replace
    ├── SSO.tsx                   # Full replace
    ├── MFA.tsx                   # Full replace
    └── NotFound.tsx              # NEW
```

### Files to Modify

```
src/
├── App.tsx                       # Wrap with ThemeProvider + AppShell
├── main.tsx                      # Add ThemeProvider, global styles
├── routes.tsx                    # Update route structure
├── styles/
│   ├── globals.css               # REPLACE with design-system/globalStyles.css
│   └── variables.css             # NEW - generated from tokens
├── components/
│   ├── Sidebar.tsx               # REPLACE with design-system/components/layout/Sidebar
│   ├── TopNav.tsx                # REPLACE with design-system/components/layout/TopNav
│   └── ...                       # All presentation components replaced
└── types/
    └── design-system.ts          # NEW - TypeScript types for tokens
```

### Files to PRESERVE (DO NOT TOUCH)

```
src/
├── stores/                       # All Zustand stores
├── lib/
│   ├── integration/              # All business logic
│   ├── hooks/                    # Business logic hooks
│   └── api/                      # API clients
├── routes/                       # Route definitions (update paths only)
├── types/                        # Domain types (extend only)
├── utils/                        # Utility functions
├── workers/                      # Web workers
├── constants/                    # Domain constants
└── config/                       # App configuration
```

---

## Phase-by-Phase Implementation

### Phase 1: Foundation (Week 1-2)

#### Week 1: Design System Core
| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Extract tokens from Stitch → TypeScript objects | `design-system/tokens/*.ts` |
| 2 | Generate CSS variables from tokens | `design-system/theme/cssVariables.css` |
| 3 | Create ThemeProvider + global styles | `design-system/theme/ThemeProvider.tsx` |
| 4 | Build core primitives (Button, Input, Card, Badge) | `design-system/components/forms/*`, `data-display/Card.tsx` |
| 5 | Build layout primitives (Modal, Drawer, Toast, Tooltip) | `design-system/components/feedback/*` |

#### Week 2: Layout + Navigation
| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Build AppShell, Sidebar, TopNav | `design-system/components/layout/*` |
| 2 | Build WorkspaceSwitcher, CommandPalette, NotificationCenter | `design-system/components/layout/*` |
| 3 | Build navigation components (Tabs, Breadcrumbs, TreeView) | `design-system/components/navigation/*` |
| 4 | Integrate with existing routing + stores | Updated `App.tsx`, `routes.tsx` |
| 5 | Storybook setup + visual regression baseline | Storybook with all components |

**Phase 1 Exit Criteria**:
- [ ] All design tokens available as CSS variables + TS objects
- [ ] 20+ core components in Storybook
- [ ] AppShell renders with sidebar + top nav
- [ ] Workspace switching works
- [ ] Command Palette (⌘⇧P) functional
- [ ] Notification Center (⌘⇧N) functional
- [ ] Visual regression tests passing

---

### Phase 2: P0 Workspaces (Week 3-4)

#### Week 3: Mission Control + Organization + Settings
| Day | Workspace | Screens | Components |
|-----|-----------|---------|------------|
| 1-2 | Mission Control | Dashboard, Fleet Manager, System Dashboard | MetricCard, AgentCard, ActivityFeed, ResourceCharts |
| 3-4 | Organization | Overview, Users/RBAC, Audit Logs | TeamTree, UserTable, RoleBuilder, SSOConfig |
| 5 | Settings | 6 tabs | All form components, AppearanceSettings |

**Integration Points**:
- Mission Control: `useAgentStore`, `useSystemStore`
- Organization: `useOrgStore`, `useRBACStore`
- Settings: `useSettingsStore`, `useThemeStore`

#### Week 4: Security + Models
| Day | Workspace | Screens | Components |
|-----|-----------|---------|------------|
| 1-2 | Security | Posture, Threats, Vulns, Compliance | RiskGauge, ThreatMap, VulnTable, ComplianceMatrix |
| 3-4 | Models | Catalog, Benchmarks, Routing, Endpoints | ModelCard, BenchmarkChart, RoutingBuilder, EndpointStatus |
| 5 | Cross-workspace polish | | |

**Integration Points**:
- Security: `useSecurityStore`, `useThreatStore`
- Models: `useModelStore`, `useRoutingStore`

**Phase 2 Exit Criteria**:
- [ ] 5 workspaces fully functional
- [ ] All data connected to existing stores
- [ ] Responsive behavior verified
- [ ] Accessibility audit passed

---

### Phase 3: P1 Workspaces (Week 5-6)

#### Week 5: Observability + Automation
| Day | Workspace | Screens | Key Components |
|-----|-----------|---------|----------------|
| 1-2 | Observability | Telemetry, Topology, Metrics, Logs, Tracing, Alerts, Dashboards, Streams | REDMetrics, TopologyGraph, PromQLBuilder, FlameGraph, LiveTail, AlertBuilder, DashboardCanvas |
| 3-4 | Automation | Hub, Builder, History | WorkflowCanvas, NodeLibrary, NodeProperties, ExecutionTimeline |

**Integration Points**:
- Observability: `useTelemetryStore`, `useTopologyStore`, `useLogsStore`
- Automation: `useWorkflowStore`, `useExecutionStore`

#### Week 6: Memory + Plugins + Skills + MCP
| Day | Workspace | Screens | Key Components |
|-----|-----------|---------|----------------|
| 1 | Memory | Graph, Search, Notes, Omi, Vault | GraphExplorer, SemanticSearch, MarkdownEditor, VaultTree |
| 2 | Plugins | Marketplace, Installed, Development | PluginCard, PluginDetail, PluginConfig |
| 3 | Skills | Marketplace, Builder, Templates | SkillCard, SkillCanvas, TemplateGrid |
| 4 | MCP | Registry, Tools, Resources, Prompts | ServerCard, ToolSchema, ResourceTemplate |
| 5 | Auth | Login, SSO, MFA, Sessions | All form components |

**Integration Points**:
- Memory: `useMemoryStore`, `useGraphStore`, `useNotesStore`
- Plugins: `usePluginStore`
- Skills: `useSkillStore`
- MCP: `useMCPStore`

**Phase 3 Exit Criteria**:
- [ ] All 12 workspaces functional
- [ ] All specialized components working (Graph, Canvas, Topology)
- [ ] Data flow verified end-to-end
- [ ] Performance budgets met

---

### Phase 4: Polish & Responsive (Week 7)

| Day | Task |
|-----|------|
| 1 | Mobile Mission Control (complete) |
| 2 | Tablet Organization (complete) |
| 3 | Remaining responsive variants (P0 screens) |
| 4 | Accessibility audit (WCAG AA) |
| 5 | Animation polish + performance optimization |

**Phase 4 Exit Criteria**:
- [ ] All 28 screens have desktop + tablet + mobile variants
- [ ] WCAG AA compliance verified
- [ ] Lighthouse scores: Perf ≥ 90, Acc ≥ 95, Best Practices ≥ 90
- [ ] Bundle size within budget
- [ ] Visual regression tests passing for all screens at all breakpoints

---

## Component Mapping: Stitch → React

### Mission Control Dashboard
| Stitch Element | React Component | Props |
|----------------|-----------------|-------|
| Executive Hero | `MetricCard` (variant="hero") | title, value, status, trend |
| Metrics Grid | `MetricCard` × 6 | variant="metric", sparkline, threshold |
| Live Activity Feed | `ActivityFeed` | items, onItemClick |
| Quick Actions | `ActionGrid` | actions, onAction |
| Recent Alerts | `AlertList` | alerts, onAlertClick |
| Resource Charts | `Chart` × 2 | type="line"/"bar", data |

### Organization Overview
| Stitch Element | React Component |
|----------------|-----------------|
| Org Header | `OrgHeader` |
| Team Topology | `TeamTree` (TreeView) |
| Active Personnel | `UserTable` (DataTable) |
| SSO Quick Links | `ActionGrid` |

### Service Topology Map
| Stitch Element | React Component |
|----------------|-----------------|
| Graph Canvas | `TopologyGraph` (Cytoscape) |
| Node | `TopologyNode` |
| Edge | `TopologyEdge` |
| Detail Panel | `Drawer` + `ServiceDetail` |

### Visual Workflow Builder
| Stitch Element | React Component |
|----------------|-----------------|
| Canvas | `WorkflowCanvas` (React Flow) |
| Node Library | `NodeLibrary` (Sidebar) |
| Properties Panel | `NodeProperties` (Drawer) |
| Toolbar | `WorkflowToolbar` |

### Knowledge Graph
| Stitch Element | React Component |
|----------------|-----------------|
| Graph Canvas | `KnowledgeGraph` (Sigma.js) |
| Node Explorer | `NodeExplorer` (Sidebar) |
| Entity Detail | `EntityDetail` (Drawer) |

---

## Store Integration Patterns

### Existing Store → New Component
```typescript
// BEFORE: Component directly uses store
const MissionControl = () => {
  const agents = useAgentStore(s => s.agents);
  const system = useSystemStore(s => s.metrics);
  // ...
};

// AFTER: Component uses hooks that abstract store
const MissionControl = () => {
  const { agents, isLoading } = useAgents();        // Hook encapsulates store
  const { metrics } = useSystemMetrics();           // Hook encapsulates store
  const { deployAgent } = useAgentActions();        // Hook encapsulates actions
  // ...
};
```

### Hook Pattern
```typescript
// src/workspaces/machine-control/hooks/useAgents.ts
export function useAgents() {
  const agents = useAgentStore(selectAgents);
  const isLoading = useAgentStore(selectIsLoading);
  const error = useAgentStore(selectError);
  
  return { agents, isLoading, error };
}

export function useAgentActions() {
  const deployAgent = useAgentStore(s => s.deployAgent);
  const terminateAgent = useAgentStore(s => s.terminateAgent);
  const restartAgent = useAgentStore(s => s.restartAgent);
  
  return { deployAgent, terminateAgent, restartAgent };
}
```

---

## Quality Gates

### Per Component
- [ ] TypeScript strict mode (no `any`)
- [ ] Unit tests (≥ 80% coverage)
- [ ] Storybook stories (all variants, states, sizes)
- [ ] Visual regression test
- [ ] Accessibility test (axe-core)
- [ ] Performance budget (render < 16ms)

### Per Workspace
- [ ] All screens render without errors
- [ ] Data flows from stores correctly
- [ ] User flows complete (E2E tests)
- [ ] Responsive at 4 breakpoints
- [ ] Keyboard navigation works
- [ ] Screen reader tested

### Per Release
- [ ] TypeScript: 0 errors
- [ ] Lint: ≤ 37 warnings (baseline)
- [ ] Build: Success
- [ ] Tests: All pass
- [ ] Visual regression: 0 diffs
- [ ] Bundle size: < 500KB gzipped (initial)
- [ ] Lighthouse: Perf ≥ 90, Acc ≥ 95

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| React Flow/Cytoscape/Sigma.js integration complexity | Prototype in Phase 1, spike if needed |
| Design token drift from Stitch | Single source: generate tokens from Stitch JSON |
| Store integration breaking changes | Hook abstraction layer, test each workspace |
| Responsive variants scope creep | Only P0/P1 screens in v1, backlog rest |
| Bundle size growth | Code splitting per workspace, lazy load graphs |
| Animation performance | `will-change`, `layout` prop, reduced motion |

---

## Rollout Plan

### Feature Flags
```typescript
// config/featureFlags.ts
export const featureFlags = {
  newDesignSystem: true,
  newMissionControl: true,
  newOrganization: true,
  newSecurity: false,      // Phase 2
  newObservability: false, // Phase 2
  newModels: false,        // Phase 2
  newAutomation: false,    // Phase 3
  newMemory: false,        // Phase 3
  newPlugins: false,       // Phase 3
  newSkills: false,        // Phase 3
  newMCP: false,           // Phase 3
  newSettings: true,       // Phase 1
  responsiveLayouts: false, // Phase 4
};
```

### Deployment Strategy
1. **Feature branches** per workspace
2. **Staging** → Full integration test
3. **Canary** → 10% users, monitor errors
4. **Gradual rollout** → 25%, 50%, 100%
5. **Rollback** → Feature flag off

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Visual Fidelity** | 100% match Stitch | Visual regression |
| **Performance** | TTI < 3s, 60fps animations | Lighthouse, Web Vitals |
| **Accessibility** | WCAG AA, 0 axe violations | axe-core, manual audit |
| **Bundle Size** | < 500KB initial, < 2MB total | Webpack Bundle Analyzer |
| **Developer Experience** | < 1hr to add new screen | Team survey |
| **User Satisfaction** | ≥ 4.5/5 | Post-release survey |

---

## Timeline Summary

| Phase | Weeks | Workspaces | Key Deliverables |
|-------|-------|------------|------------------|
| 1: Foundation | 1-2 | - | Design system, 20+ components, AppShell |
| 2: P0 Workspaces | 3-4 | 5 (MC, Org, Settings, Security, Models) | 5 workspaces complete |
| 3: P1 Workspaces | 5-6 | 7 (Obs, Auto, Memory, Plugins, Skills, MCP, Auth) | All 12 workspaces |
| 4: Polish | 7 | - | Responsive, a11y, performance |

**Total**: 7 weeks (35 working days)

---

## Team Allocation

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| Lead Frontend | 1 | 1 | 1 | 1 |
| Senior Frontend | 2 | 2 | 2 | 1 |
| Frontend Engineer | 2 | 3 | 3 | 2 |
| Designer (Design System) | 1 | 0.5 | 0.5 | 1 |
| QA/Accessibility | 0.5 | 1 | 1 | 1 |
| **Total** | **6.5** | **7.5** | **7.5** | **6** |

---

## Next Steps

1. **Approve** this implementation plan
2. **Export** design tokens from Stitch (JSON)
3. **Kickoff** Phase 1 with team
4. **Daily standups** + weekly phase reviews
5. **Demo** at end of each phase