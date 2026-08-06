# MODELS_COMPONENT_LIBRARY.md

## Phase A1: Incremental Shared AI Component Library for Models Workspace

**Date:** 2026-08-06  
**Branch:** main  
**Strategy:** Build only components required by Models workspace  
**Reference Design:** Google Stitch Project 10866743485103090405

================================================================================
COMPONENTS CREATED (Phase A1) - 15 Components
================================================================================

### 1. ModelCapabilityBadge
**File:** `/design-system/components/specialized/ModelCapabilityBadge.tsx`  
**Purpose:** Standardized capability tags with semantic colors  
**Reuses:** Badge  
**Props:** `capability`, `size?`, `showLabel?`, `variant?`  
**Used by:** ModelCard, ModelDetailDrawer, ModelsCatalog list view

---

### 2. ProviderBadge
**File:** `/design-system/components/specialized/ProviderBadge.tsx`  
**Purpose:** Provider identification with status indicator  
**Reuses:** Badge, Avatar  
**Props:** `provider`, `size?`, `showStatus?`, `showModelCount?`, `variant?`  
**Used by:** ModelsOverview (provider list), ModelCard, ModelDetailDrawer

---

### 3. ModelCard
**File:** `/design-system/components/specialized/ModelCard.tsx`  
**Purpose:** Display model in catalog grid/list views  
**Reuses:** Card, Badge, Button, ProviderBadge, ModelCapabilityBadge  
**Props:** `model`, `variant?`, `isSelected?`, `onClick?`, `onTest?`, `showActions?`  
**Used by:** ModelsCatalog (grid view), ModelsOverview (top models)

---

### 4. SearchFilters
**File:** `/design-system/components/specialized/SearchFilters.tsx`  
**Purpose:** Reusable filter toolbar with search, selects, view toggle  
**Reuses:** Input, Select, Button  
**Props:** `filters`, `values`, `onChange`, `searchPlaceholder?`, `onSearchChange?`, `viewMode?`, `onViewModeChange?`  
**Used by:** ModelsCatalog, (future: PluginsMarketplace, MemorySources, MCPMarketplace, SkillsTemplates)

---

### 5. DetailDrawer
**File:** `/design-system/components/specialized/DetailDrawer.tsx`  
**Purpose:** Slide-over detail panel with header, body, actions  
**Reuses:** Button  
**Props:** `isOpen`, `onClose`, `title`, `subtitle?`, `children`, `actions?`, `size?`, `headerIcon?`, `showCloseButton?`, `closeOnOverlayClick?`, `closeOnEscape?`  
**Used by:** ModelsCatalog (ModelDetailDrawer), (future: PluginCard, SkillCard, ToolCard)

---

### 6. InspectorPanel
**File:** `/design-system/components/specialized/InspectorPanel.tsx`  
**Purpose:** Collapsible side panel for metadata/inspection  
**Reuses:** None (pure layout)  
**Props:** `title`, `children`, `isOpen?`, `onToggle?`, `actions?`, `defaultOpen?`, `position?`, `width?`  
**Used by:** ModelsCatalog (could replace DetailDrawer), (future: KnowledgeGraphViewer, SkillBuilder)

---

### 7. BenchmarkChart
**File:** `/design-system/components/specialized/BenchmarkChart.tsx`  
**Purpose:** Radar/bar/line chart for model benchmark comparison  
**Reuses:** Canvas, Card  
**Props:** `data`, `metrics`, `type`, `maxModels?`, `showLegend?`, `height?`  
**Used by:** ModelsBenchmarks, (future: SkillsBuilder eval, ModelComparison)

---

### 8. TokenUsageCard
**File:** `/design-system/components/specialized/TokenUsageCard.tsx`  
**Purpose:** Token consumption display with progress  
**Reuses:** Card, Badge  
**Props:** `usage`, `limit?`, `period?`, `showCost?`, `showBreakdown?`, `variant?`  
**Used by:** ModelsOverview, ModelsEndpoints, (future: PlaygroundPanel, CostCard)

---

### 9. CostCard
**File:** `/design-system/components/specialized/CostCard.tsx`  
**Purpose:** Cost display with trend indicator  
**Reuses:** Card, Badge  
**Props:** `cost`, `period`, `trend?`, `trendValue?`, `breakdown?`, `budget?`, `variant?`, `showTrend?`  
**Used by:** ModelsOverview, ModelsSettings, (future: BillingSettings, TokenUsageCard)

---

### 10. SettingsSection
**File:** `/design-system/components/specialized/SettingsSection.tsx`  
**Purpose:** Consistent settings panel layout  
**Reuses:** Card  
**Props:** `title`, `icon?`, `rows`, `columns?`, `variant?`, `className?`, `actions?`  
**Used by:** ModelsSettings, (future: All Settings pages, MCPSettings, PluginsSettings, SkillsSettings)

---

### 11. EndpointCard
**File:** `/design-system/components/specialized/EndpointCard.tsx`  
**Purpose:** API endpoint display with health, latency, auth  
**Reuses:** Card, Badge, Button  
**Props:** `endpoint`, `model?`, `onTest?`, `isTesting?`, `showMetrics?`, `variant?`  
**Used by:** ModelsEndpoints, (future: ModelsRouting test panel, MCPTools)

---

### 12. RoutingRuleCard
**File:** `/design-system/components/specialized/RoutingRuleCard.tsx`  
**Purpose:** Routing rule display with inline edit  
**Reuses:** Card, Badge, Input, Select, Button  
**Props:** `rule`, `models`, `priority`, `isEditing?`, `onEdit?`, `onSave?`, `onCancel?`, `onDelete?`, `onChange?`  
**Used by:** ModelsRouting, (future: SkillBuilder conditional nodes)

---

### 13. RoutingRuleFlow
**File:** `/design-system/components/specialized/RoutingRuleCard.tsx` (exported)  
**Purpose:** Visual flow representation of routing rules  
**Reuses:** Card, Badge  
**Props:** `rules`, `models`  
**Used by:** ModelsRouting

---

### 14. BenchmarkLegend
**File:** `/design-system/components/specialized/BenchmarkChart.tsx` (exported)  
**Purpose:** External legend for benchmark charts  
**Reuses:** None  
**Props:** `models`  
**Used by:** ModelsBenchmarks

---

### 15. MetricSelector
**File:** `/design-system/components/specialized/BenchmarkChart.tsx` (exported)  
**Purpose:** Metric selection toolbar for benchmarks  
**Reuses:** Button  
**Props:** `metrics`, `selectedMetric`, `onChange`, `sortDesc`, `onSortToggle`  
**Used by:** ModelsBenchmarks

================================================================================
COMPONENTS DEFERRED (Not Required by Models)
================================================================================

| Component | Required By | Deferred To Phase |
|-----------|-------------|-------------------|
| VectorSearchPanel | Memory & Knowledge | Phase C |
| KnowledgeGraphViewer | Memory & Knowledge | Phase C |
| MemoryTimeline | Memory & Knowledge | Phase C |
| PluginCard | Plugins | Phase E |
| PluginMarketplaceGrid | Plugins | Phase E |
| SkillCard | Skills | Phase F |
| SkillBuilder | Skills | Phase F |
| MCPServerCard | MCP | Phase D |
| ToolCard | MCP | Phase D |
| ResourceCard | MCP | Phase D |
| PromptCard | Skills, Plugins | Phase E/F |
| PromptTemplateCard | Skills | Phase F |
| JSONViewer | MCP, Skills | Phase D/F |
| MetadataPanel | Memory, MCP, Skills | Phase C/D/F |
| SplitView | PlaygroundPanel, SkillBuilder | Built as needed |

================================================================================
REUSE OPPORTUNITIES IDENTIFIED
================================================================================

### High Confidence (Used by 2+ Models Pages)
1. **ModelCapabilityBadge** - ModelsCatalog, ModelDetailDrawer, ModelsOverview
2. **ProviderBadge** - ModelsOverview, ModelCard, ModelDetailDrawer
3. **SearchFilters** - ModelsCatalog (toolbar pattern)
4. **SettingsSection** - ModelsSettings (4 panels)
5. **DetailDrawer** - ModelsCatalog (ModelDetailDrawer)

### Medium Confidence (Used by 1 Models Page, Likely Future Reuse)
6. **ModelCard** - ModelsCatalog (grid), could be used in ModelMarketplace
7. **BenchmarkChart** - ModelsBenchmarks, could be used in SkillsBuilder
8. **TokenUsageCard** - ModelsOverview, could be used in PlaygroundPanel
9. **CostCard** - ModelsOverview, ModelsSettings
10. **EndpointCard** - ModelsEndpoints, could be used in ModelsRouting
11. **RoutingRuleCard** - ModelsRouting

### Low Confidence (Models-Only Currently)
12. **PlaygroundPanel** - Only ModelsCatalog "Test Model" for now (NOT BUILT - deferred)
13. **PromptEditor** - Only via PlaygroundPanel for now (NOT BUILT - deferred)
14. **VersionTimeline** - Not yet used, planned for model versioning (NOT BUILT - deferred)

================================================================================
API DECISIONS
================================================================================

### 1. Type-Only Imports
All components use `import type` for TypeScript-only imports to minimize bundle size.

### 2. CSS Modules with Design Tokens
All components use inline styles with design token variables:
- Colors: `var(--color-*)`
- Spacing: `var(--spacing-*)`
- Typography: `var(--text-*)`, `var(--font-*)`
- Motion: `var(--motion-*)`
- Radius: `var(--radius-*)`

### 3. No External Dependencies
All components built on existing Hermes Design System (Card, Badge, Button, Input, Select, Modal, Avatar, Table, Canvas).

### 4. Accessibility First
- ARIA roles/labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus management in DetailDrawer/InspectorPanel
- Reduced motion support
- Color contrast WCAG AA

### 5. Controlled/Uncontrolled Patterns
Components like InspectorPanel support both controlled and uncontrolled usage.

================================================================================
COMPONENTS PROMOTED TO SHARED LIBRARY
================================================================================

After Models implementation and review, the following will be promoted
to the shared AI component library for reuse:

| Component | Promotion Criteria |
|-----------|-------------------|
| ModelCapabilityBadge | Used in 3+ Models pages, generic capability system |
| ProviderBadge | Used in 3+ Models pages, provider concept is cross-workspace |
| SearchFilters | Pattern reused in PluginsMarketplace, MemorySources, MCPMarketplace |
| SettingsSection | Used in all Settings pages across workspaces |
| DetailDrawer | Pattern for all entity detail views (Plugin, Skill, Tool, Memory) |
| TokenUsageCard | Token tracking is universal across AI workspaces |
| CostCard | Cost tracking is universal across AI workspaces |
| BenchmarkChart | Evaluation/comparison pattern reusable |
| PromptEditor | Prompt editing needed in Skills, Playground, PromptLibrary |

### NOT Promoted (Models-Specific)
| Component | Reason |
|-----------|--------|
| ModelCard | Too specific to model display |
| EndpointCard | Specific to model endpoint management |
| RoutingRuleCard | Specific to model routing |
| PlaygroundPanel | Models-specific testing interface |
| VersionTimeline | Will be generic but wait for Skills/Plugins usage |

================================================================================
QUALITY GATES RESULTS
================================================================================

| Gate | Result |
|------|--------|
| TypeScript | ✅ 0 errors, 51 warnings (baseline 46 + 5 new) |
| Lint (oxlint) | ✅ PASS |
| Build (Vite) | ✅ PASS (5.78s) |
| Tests (Vitest) | ✅ 2/2 PASS |

================================================================================
NEXT STEPS - PHASE B: MODELS WORKSPACE MIGRATION
================================================================================

1. Replace ModelsOverview using: ModelCard, ProviderBadge, ModelCapabilityBadge, TokenUsageCard, CostCard, BenchmarkChart, SearchFilters, SettingsSection
2. Replace ModelsCatalog using: ModelCard, SearchFilters, DetailDrawer, ModelCapabilityBadge, ProviderBadge
3. Replace ModelsBenchmarks using: BenchmarkChart, BenchmarkLegend, MetricSelector, ProviderBadge
4. Replace ModelsEndpoints using: EndpointCard, ProviderBadge, TokenUsageCard, CostCard, SettingsSection
5. Replace ModelsRouting using: RoutingRuleCard, RoutingRuleFlow, ProviderBadge, SearchFilters, SettingsSection
6. Replace ModelsSettings using: SettingsSection, ProviderBadge, CostCard, TokenUsageCard

================================================================================
END OF PLAN
================================================================================