# AI_PLATFORM_IMPLEMENTATION_PLAN.md

## Hermes AI Platform Migration Program
### Phase A: Shared AI Component Library Design & Approval

**Date:** 2026-08-06  
**Branch:** main (c1c684c)  
**Stitch Project:** 10866743485103090405  
**Design System:** Hermes AI OS

================================================================================
EXECUTIVE SUMMARY
================================================================================

This plan defines the shared AI component library to be built before migrating
the remaining 6 AI platform workspaces (Models, Memory & Knowledge, MCP,
Plugins, Skills, Settings). The library will ensure visual consistency with the
5 completed workspaces (Machine Control, Organization, Security, Observability,
Automation) and eliminate duplication.

**Current State:**
- 5 workspaces IMPLEMENTED ✅
- 6 workspaces NOT STARTED (legacy implementations exist but don't use Design System)
- 0 shared AI components exist

**Target State:**
- Shared AI component library (Phase A)
- 6 workspaces migrated using shared components (Phases B-G)

================================================================================
EXISTING AI WORKSPACE ANALYSIS
================================================================================

### Models (7 pages)
- Models.tsx (main entry with tab navigation)
- ModelsOverview.tsx (Canvas charts, provider list, model types, top models)
- ModelsCatalog.tsx (model browsing, filtering, detail view)
- ModelsRouting.tsx (routing rules, priority matrix)
- ModelsEndpoints.tsx (endpoint management, health, latency)
- ModelsBenchmarks.tsx (radar charts, comparison tables)
- ModelsSettings.tsx (provider config, API keys, rate limits)

**Key Patterns:** Provider cards, Model cards, Canvas charts, Benchmark radar,
Routing tables, Endpoint health badges, Playground integration

### Memory & Knowledge (7 pages)
- Memory.tsx (main entry)
- MemoryOverview.tsx (graph visualization, stats)
- MemorySources.tsx (source management, sync status)
- MemoryGraph.tsx (force-directed graph, node/edge detail)
- MemoryNotes.tsx (note CRUD, search, tags)
- MemoryOmi.tsx (OMI integration, device sync)
- MemorySettings.tsx (retention, embedding config)

**Key Patterns:** Graph visualization, Source cards, Note cards, Sync status,
Tag chips, Vector search, Timeline view

### MCP (6 pages)
- MCP.tsx (main entry)
- MCPMarketplace.tsx (server browsing, categories, install)
- MCPServers.tsx (server management, health, logs)
- MCPTools.tsx (tool explorer, invocation, schemas)
- MCPOverview.tsx (connected servers, tool count)
- MCPSettings.tsx (transport config, auth, timeouts)

**Key Patterns:** Server cards, Tool cards, Schema viewers, Transport badges,
Health indicators, Install modals

### Plugins (6 pages)
- Plugins.tsx (main entry)
- PluginsOverview.tsx (installed plugins, status)
- PluginsMarketplace.tsx (browse, categories, install)
- PluginsInstalled.tsx (management, updates, config)
- PluginsPermissions.tsx (permission matrix, scopes)
- PluginsSettings.tsx (repository config, auto-update)

**Key Patterns:** Plugin cards, Marketplace grid, Permission matrix,
Version badges, Dependency trees, Config forms

### Skills (6 pages)
- Skills.tsx (main entry)
- SkillsOverview.tsx (installed skills, categories)
- SkillsTemplates.tsx (template gallery, variables)
- SkillsInstalled.tsx (management, versions, triggers)
- SkillsBuilder.tsx (visual builder, node editor)
- SkillsSettings.tsx (runtime config, sandbox)

**Key Patterns:** Skill cards, Builder canvas, Template cards, Trigger chips,
Version timeline, Sandbox config

### Settings (8 pages mixed)
- Settings.tsx (main entry)
- Integrations.tsx, Tools.tsx, Logs.tsx, Analytics.tsx
- Graphify.tsx, Workflows.tsx, Alerts.tsx

**Key Patterns:** Settings sections, Property grids, Inspector panels,
Integration cards, Feature flags

================================================================================
SHARED AI COMPONENT LIBRARY
================================================================================

## Tier 1: Core Display Components (Build First)

### 1. ModelCard
**Purpose:** Display model metadata in catalog/list views
**Props:**
- `model: Model` - { id, name, provider, type, status, tags, contextWindow, pricing }
- `variant: 'default' | 'compact' | 'detailed'`
- `onSelect?: (model) => void`
- `showActions?: boolean`
**Reuses:** Card, Badge, Button, Avatar (provider icon)
**Used by:** ModelsCatalog, ModelsOverview, ModelMarketplace (future)

### 2. ModelCapabilityBadge
**Purpose:** Standardized capability tags (chat, embedding, multimodal, etc.)
**Props:**
- `capability: 'chat' | 'embedding' | 'completion' | 'multimodal' | 'reasoning' | 'vision' | 'audio' | 'function-calling'`
- `size: 'sm' | 'md'`
**Reuses:** Badge (with semantic color mapping)
**Used by:** ModelCard, ModelDetail, Benchmark comparison

### 3. ProviderBadge
**Purpose:** Provider identification with status
**Props:**
- `provider: Provider` - { id, name, icon, status, modelCount }
- `showStatus?: boolean`
- `size: 'sm' | 'md' | 'lg'`
**Reuses:** Badge, Avatar (icon)
**Used by:** ModelsOverview, ProviderList, ModelCard, MCPMarketplace

### 4. EndpointCard
**Purpose:** API endpoint display with health
**Props:**
- `endpoint: Endpoint` - { id, name, url, provider, status, latency, uptime, region }
- `onTest?: () => void`
- `showMetrics?: boolean`
**Reuses:** Card, Badge (status), Button, ProgressBar (latency)
**Used by:** ModelsEndpoints, ModelsRouting, MCPTools

### 5. PlaygroundPanel
**Purpose:** Interactive model testing panel
**Props:**
- `model?: Model`
- `onComplete: (prompt, response) => void`
- `defaultParams?: CompletionParams`
- `readOnly?: boolean`
**Reuses:** Card, Input (textarea), Select (params), Button, CodeBlockViewer
**Used by:** ModelsCatalog (detail), ModelsOverview, Playground page (future)

### 6. PromptEditor
**Purpose:** Advanced prompt editing with variables
**Props:**
- `value: string`
- `onChange: (value) => void`
- `variables?: PromptVariable[]`
- `template?: PromptTemplate`
- `mode: 'chat' | 'completion'`
**Reuses:** Input (textarea), Badge (variables), Button, SplitView
**Used by:** PromptTemplates, SkillsBuilder, PlaygroundPanel

### 7. PromptTemplateCard
**Purpose:** Reusable prompt template display
**Props:**
- `template: PromptTemplate` - { id, name, description, category, variables, prompt }
- `onUse?: () => void`
- `onEdit?: () => void`
**Reuses:** Card, Badge (category), Button, PromptEditor (preview)
**Used by:** SkillsTemplates, PromptLibrary (future), PlaygroundPanel

## Tier 2: Data Visualization Components

### 8. VectorSearchPanel
**Purpose:** Semantic search interface for memory/knowledge
**Props:**
- `onSearch: (query, filters) => results`
- `sources?: DataSource[]`
- `defaultFilters?: SearchFilters`
**Reuses:** Input, Select, Badge, Card, Table, ProgressBar
**Used by:** MemorySources, MemoryNotes, KnowledgeGraphViewer

### 9. KnowledgeGraphViewer
**Purpose:** Force-directed graph for entities/relationships
**Props:**
- `nodes: GraphNode[]`
- `edges: GraphEdge[]`
- `onNodeSelect: (node) => void`
- `layout?: 'force' | 'hierarchical' | 'circular'`
**Reuses:** Canvas (custom), Tooltip, Badge, InspectorPanel
**Used by:** MemoryGraph, MemoryOverview, DependencyViewer

### 10. MemoryTimeline
**Purpose:** Chronological memory/note display
**Props:**
- `items: TimelineItem[]`
- `groupBy?: 'day' | 'week' | 'month'`
- `onItemClick: (item) => void`
**Reuses:** Card, Badge, Avatar, RelativeTime
**Used by:** MemoryNotes, MemoryOverview, ActivityFeed

### 11. BenchmarkChart
**Purpose:** Radar/bar charts for model comparison
**Props:**
- `data: BenchmarkData[]`
- `metrics: string[]`
- `type: 'radar' | 'bar' | 'line'`
- `normalize?: boolean`
**Reuses:** Canvas, Tooltip, Legend, ColorTokens
**Used by:** ModelsBenchmarks, ModelComparison, SkillsBuilder (eval)

### 12. VersionTimeline
**Purpose:** Version history with changelog
**Props:**
- `versions: Version[]`
- `currentVersion: string`
- `onRollback?: (version) => void`
**Reuses:** Card, Badge, Button, Badge, Accordion
**Used by:** SkillsInstalled, PluginsInstalled, ModelVersions

## Tier 3: Marketplace & Grid Components

### 13. PluginCard
**Purpose:** Plugin display in marketplace/installed views
**Props:**
- `plugin: Plugin` - { id, name, description, author, version, category, rating, installs }
- `variant: 'marketplace' | 'installed' | 'compact'`
- `onInstall?: () => void`
- `onConfigure?: () => void`
**Reuses:** Card, Badge (category), Button, Avatar (author), RatingStars
**Used by:** PluginsMarketplace, PluginsInstalled, PluginsOverview

### 14. PluginMarketplaceGrid
**Purpose:** Responsive grid with filters
**Props:**
- `plugins: Plugin[]`
- `categories: Category[]`
- `onFilterChange: (filters) => void`
- `viewMode: 'grid' | 'list'`
**Reuses:** PluginCard, SearchFilters, Select, Badge, Pagination
**Used by:** PluginsMarketplace, SkillsTemplates, MCPMarketplace

### 15. SkillCard
**Purpose:** Skill display with trigger info
**Props:**
- `skill: Skill` - { id, name, description, category, triggers, version, author }
- `variant: 'gallery' | 'installed' | 'builder'`
- `onRun?: () => void`
- `onEdit?: () => void`
**Reuses:** Card, Badge (category, trigger), Button, Avatar
**Used by:** SkillsOverview, SkillsTemplates, SkillsInstalled

### 16. SkillBuilder
**Purpose:** Visual node-based skill construction
**Props:**
- `skill?: Skill`
- `onSave: (skill) => void`
- `availableNodes: NodeDefinition[]`
**Reuses:** Canvas (React Flow), NodePalette, PropertyGrid, InspectorPanel
**Used by:** SkillsBuilder, SkillTemplates (edit)

### 17. MCPServerCard
**Purpose:** MCP server display with tool count
**Props:**
- `server: MCPServer` - { id, name, description, transport, status, tools, resources }
- `onConnect?: () => void`
- `onConfigure?: () => void`
**Reuses:** Card, Badge (transport, status), Button, ToolCard (preview)
**Used by:** MCPMarketplace, MCPServers, MCPOverview

### 18. ToolCard
**Purpose:** Individual tool display with schema
**Props:**
- `tool: Tool` - { name, description, inputSchema, outputSchema, annotations }
- `onInvoke?: (params) => void`
- `showSchema?: boolean`
**Reuses:** Card, Badge, Button, CodeBlockViewer, JSONViewer
**Used by:** MCPTools, MCPServerCard (preview), SkillBuilder (nodes)

### 19. ResourceCard
**Purpose:** MCP resource display
**Props:**
- `resource: Resource` - { uri, name, description, mimeType }
- `onRead?: () => void`
**Reuses:** Card, Badge (mimeType), Button, CodeBlockViewer
**Used by:** MCPTools, MCPServerCard

### 20. PromptCard
**Purpose:** Stored prompt display
**Props:**
- `prompt: StoredPrompt` - { id, name, content, tags, model, createdAt }
- `onUse?: () => void`
- `onEdit?: () => void`
**Reuses:** Card, Badge (tags), Button, PromptEditor (preview)
**Used by:** PromptLibrary, PlaygroundPanel, SkillsTemplates

## Tier 4: Layout & Inspector Components

### 21. SettingsSection
**Purpose:** Consistent settings page sections
**Props:**
- `title: string`
- `description?: string`
- `icon?: ReactNode`
- `children: ReactNode`
- `actions?: ReactNode`
**Reuses:** Card, SectionLabel, Divider
**Used by:** All Settings pages, ModelsSettings, MCPSettings, PluginsSettings, SkillsSettings

### 22. PropertyGrid
**Purpose:** Key-value configuration display/edit
**Props:**
- `properties: Property[]` - { key, label, type, value, description, required, options }
- `onChange: (key, value) => void`
- `layout: 'grid' | 'list'`
**Reuses:** Input, Select, Switch, Badge, Tooltip, Card
**Used by:** ModelsSettings, MCPSettings, PluginsSettings, SkillsSettings, SkillBuilder

### 23. InspectorPanel
**Purpose:** Side-panel detail view
**Props:**
- `title: string`
- `children: ReactNode`
- `actions?: ReactNode`
- `defaultOpen?: boolean`
**Reuses:** Card, SplitView, Button, Icon
**Used by:** KnowledgeGraphViewer, SkillBuilder, ModelDetail, ToolCard (schema)

### 24. SplitView
**Purpose:** Resizable two-pane layout
**Props:**
- `left: ReactNode`
- `right: ReactNode`
- `defaultSplit?: number`
- `minSize?: number`
**Reuses:** CSS Grid/Flex, ResizeObserver
**Used by:** PlaygroundPanel, PromptEditor, SkillBuilder, InspectorPanel

### 24. DetailDrawer
**Purpose:** Slide-over detail panel
**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title: string`
- `children: ReactNode`
- `size: 'sm' | 'md' | 'lg' | 'full'`
**Reuses:** Modal, Animation, FocusTrap
**Used by:** ModelCard (detail), PluginCard (detail), ToolCard (schema)

### 25. CodeBlockViewer
**Purpose:** Syntax-highlighted code display
**Props:**
- `code: string`
- `language: string`
- `readOnly?: boolean`
- `showLineNumbers?: boolean`
- `highlightLines?: number[]`
**Reuses:** Prism/Shiki (or custom), Button (copy), Tooltip
**Used by:** ToolCard (schema), PromptEditor, SkillBuilder, JSONViewer

### 26. JSONViewer
**Purpose:** Collapsible JSON tree viewer
**Props:**
- `data: any`
- `maxDepth?: number`
- `onSelect?: (path) => void`
**Reuses:** CodeBlockViewer, Badge (type), Icon, RecursiveComponent
**Used by:** ToolCard (schema/response), InspectorPanel, AuditLogs, MCPTools

### 27. MetadataPanel
**Purpose:** Standardized metadata display
**Props:**
- `metadata: Record<string, any>`
- `sections?: MetadataSection[]`
- `editable?: boolean`
**Reuses:** PropertyGrid, Badge, Avatar, RelativeTime
**Used by:** ModelCard, PluginCard, SkillCard, MCPServerCard, MemoryNotes

### 28. TokenUsageCard
**Purpose:** Token consumption display
**Props:**
- `usage: TokenUsage` - { prompt, completion, total, cost }
- `limit?: number`
- `period?: string`
**Reuses:** Card, Badge, ProgressBar, CostCard
**Used by:** ModelsOverview, ModelsEndpoints, PlaygroundPanel, BenchmarkChart

### 29. CostCard
**Purpose:** Cost display with trend
**Props:**
- `cost: number`
- `period: string`
- `trend?: 'up' | 'down' | 'stable'`
- `breakdown?: CostBreakdown[]`
**Reuses:** Card, Badge, ProgressBar, Tooltip
**Used by:** ModelsOverview, ModelsEndpoints, TokenUsageCard, BillingSettings

### 30. SearchFilters
**Purpose:** Reusable filter toolbar
**Props:**
- `filters: FilterConfig[]`
- `values: Record<string, any>`
- `onChange: (values) => void`
- `layout: 'horizontal' | 'vertical' | 'drawer'`
**Reuses:** Input, Select, DateRange, Badge, Button, Accordion
**Used by:** ModelsCatalog, PluginsMarketplace, MemorySources, MCPMarketplace, SkillsTemplates

================================================================================
WORKSPACE DEPENDENCY MATRIX
================================================================================

| Workspace | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-----------|--------|--------|--------|--------|
| Models | ModelCard, ModelCapabilityBadge, ProviderBadge, EndpointCard, PlaygroundPanel, PromptEditor, PromptTemplateCard | BenchmarkChart, VersionTimeline | - | SettingsSection, PropertyGrid, SplitView, DetailDrawer, CodeBlockViewer, TokenUsageCard, CostCard, SearchFilters |
| Memory & Knowledge | - | VectorSearchPanel, KnowledgeGraphViewer, MemoryTimeline | - | SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, CodeBlockViewer, JSONViewer, MetadataPanel, SearchFilters |
| MCP | ProviderBadge, EndpointCard | - | MCPServerCard, ToolCard, ResourceCard, PromptCard | SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, CodeBlockViewer, JSONViewer, SearchFilters |
| Plugins | - | - | PluginCard, PluginMarketplaceGrid | SettingsSection, PropertyGrid, DetailDrawer, SearchFilters |
| Skills | PromptEditor, PromptTemplateCard | - | SkillCard, SkillBuilder | SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, CodeBlockViewer, SearchFilters |
| Settings | - | - | - | SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, SearchFilters |

================================================================================
COMPONENT REUSE MATRIX
================================================================================

| Component | Models | Memory | MCP | Plugins | Skills | Settings | **Total Uses** |
|-----------|--------|--------|-----|---------|--------|----------|----------------|
| SettingsSection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **6** |
| PropertyGrid | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **6** |
| SplitView | ✅ | ✅ | ✅ | | ✅ | ✅ | **5** |
| DetailDrawer | ✅ | ✅ | ✅ | ✅ | ✅ | | **5** |
| CodeBlockViewer | ✅ | ✅ | ✅ | | ✅ | | **4** |
| SearchFilters | ✅ | ✅ | ✅ | ✅ | | | **4** |
| InspectorPanel | ✅ | ✅ | ✅ | | ✅ | | **4** |
| Card (base) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **6** |
| Badge (base) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **6** |
| Button (base) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **6** |
| ModelCard | ✅ | | | | | | **1** |
| ModelCapabilityBadge | ✅ | | | | | | **1** |
| ProviderBadge | ✅ | | ✅ | | | | **2** |
| EndpointCard | ✅ | | ✅ | | | | **2** |
| PlaygroundPanel | ✅ | | | | | | **1** |
| PromptEditor | ✅ | | | | ✅ | | **2** |
| PromptTemplateCard | ✅ | | | | ✅ | | **2** |
| VectorSearchPanel | | ✅ | | | | | **1** |
| KnowledgeGraphViewer | | ✅ | | | | | **1** |
| MemoryTimeline | | ✅ | | | | | **1** |
| BenchmarkChart | ✅ | | | | ✅ | | **2** |
| VersionTimeline | ✅ | | | | ✅ | | **2** |
| PluginCard | | | | ✅ | | | **1** |
| PluginMarketplaceGrid | | | | ✅ | | | **1** |
| SkillCard | | | | | ✅ | | **1** |
| SkillBuilder | | | | | ✅ | | **1** |
| MCPServerCard | | | ✅ | | | | **1** |
| ToolCard | | | ✅ | | | | **1** |
| ResourceCard | | | ✅ | | | | **1** |
| PromptCard | ✅ | | | | ✅ | | **2** |
| JSONViewer | ✅ | ✅ | ✅ | | | | **3** |
| MetadataPanel | ✅ | ✅ | ✅ | ✅ | ✅ | | **5** |
| TokenUsageCard | ✅ | | ✅ | | | | **2** |
| CostCard | ✅ | | | | | ✅ | **2** |

================================================================================
IMPLEMENTATION ORDER
================================================================================

## Phase A: Shared AI Component Library (4 weeks)

### Week 1: Tier 1 Core Display (7 components)
1. ModelCard + ModelCapabilityBadge + ProviderBadge
2. EndpointCard + PlaygroundPanel
3. PromptEditor + PromptTemplateCard

**Deliverable:** Storybook stories, TypeScript types, unit tests

### Week 2: Tier 2 Data Viz + Tier 3 Marketplace (7 components)
4. VectorSearchPanel + KnowledgeGraphViewer + MemoryTimeline
5. BenchmarkChart + VersionTimeline
6. PluginCard + PluginMarketplaceGrid

### Week 3: Tier 3 continued + Tier 4 Layout (10 components)
7. SkillCard + SkillBuilder
8. MCPServerCard + ToolCard + ResourceCard + PromptCard
9. SettingsSection + PropertyGrid + InspectorPanel + SplitView
10. DetailDrawer + CodeBlockViewer + JSONViewer + MetadataPanel

### Week 4: Tier 4 remaining + Integration (6 components)
11. TokenUsageCard + CostCard + SearchFilters
12. Cross-workspace integration testing
13. Documentation, migration guides

**Exit Criteria:**
- All 30 components have Storybook stories
- TypeScript strict mode passes
- Unit test coverage > 80%
- Visual regression tests against Stitch designs
- Bundle size impact < 50KB gzipped

## Phase B: Models Migration (2 weeks)
- Replace ModelsOverview, ModelsCatalog, ModelsRouting, ModelsEndpoints, ModelsBenchmarks, ModelsSettings
- Use: ModelCard, ProviderBadge, EndpointCard, PlaygroundPanel, BenchmarkChart, VersionTimeline, PlaygroundPanel, PromptEditor, SettingsSection, PropertyGrid, SplitView, DetailDrawer, CodeBlockViewer, TokenUsageCard, CostCard, SearchFilters

## Phase C: Memory & Knowledge (2 weeks)
- Replace MemoryOverview, MemorySources, MemoryGraph, MemoryNotes, MemoryOmi, MemorySettings
- Use: VectorSearchPanel, KnowledgeGraphViewer, MemoryTimeline, SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, CodeBlockViewer, JSONViewer, MetadataPanel, SearchFilters

## Phase D: MCP (1.5 weeks)
- Replace MCPMarketplace, MCPServers, MCPTools, MCPOverview, MCPSettings
- Use: ProviderBadge, EndpointCard, MCPServerCard, ToolCard, ResourceCard, PromptCard, SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, CodeBlockViewer, JSONViewer, SearchFilters

## Phase E: Plugins (1.5 weeks)
- Replace PluginsMarketplace, PluginsInstalled, PluginsOverview, PluginsPermissions, PluginsSettings
- Use: PluginCard, PluginMarketplaceGrid, SettingsSection, PropertyGrid, DetailDrawer, SearchFilters

## Phase F: Skills (1.5 weeks)
- Replace SkillsTemplates, SkillsInstalled, SkillsOverview, SkillsBuilder, SkillsSettings
- Use: PromptEditor, PromptTemplateCard, SkillCard, SkillBuilder, BenchmarkChart, VersionTimeline, SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, CodeBlockViewer, SearchFilters

## Phase G: Settings (1 week)
- Replace Settings pages (Integrations, Tools, Logs, Analytics, Graphify, Workflows, Alerts)
- Use: SettingsSection, PropertyGrid, InspectorPanel, SplitView, DetailDrawer, SearchFilters

**Total Program Duration:** ~12 weeks

================================================================================
ESTIMATED MIGRATION EFFORT
================================================================================

| Phase | Components to Build | Pages to Migrate | Est. Effort |
|-------|---------------------|------------------|-------------|
| A: Shared Library | 30 components | 0 | 4 weeks |
| B: Models | 0 (reuse) | 7 | 2 weeks |
| C: Memory & Knowledge | 0 (reuse) | 7 | 2 weeks |
| D: MCP | 0 (reuse) | 6 | 1.5 weeks |
| E: Plugins | 0 (reuse) | 6 | 1.5 weeks |
| F: Skills | 0 (reuse) | 6 | 1.5 weeks |
| G: Settings | 0 (reuse) | 8 | 1 week |
| **Total** | **30 new components** | **40 pages** | **12 weeks** |

**Lines of Code Estimate:**
- Shared library: ~8,000 lines
- Migrations: ~15,000 lines (replacing ~25,000 legacy lines)
- Net reduction: ~10,000 lines through reuse

================================================================================
RISKS & MITIGATIONS
================================================================================

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Component API churn during Phase A | High | High | Freeze API after Week 2; use feature flags for breaking changes |
| Visual inconsistency with Stitch | Medium | High | Daily visual regression; dedicated design review at Week 2 & 4 |
| Bundle size increase | Low | Medium | Tree-shaking; lazy load heavy components (SkillBuilder, KnowledgeGraphViewer) |
| SkillBuilder complexity | High | High | Build incrementally; use React Flow as foundation; defer advanced features |
| KnowledgeGraphViewer performance | Medium | High | Virtualize nodes; Web Workers for layout; max 500 nodes |
| PromptEditor variable interpolation | Medium | Medium | Use established library (Handlebars/Jinja); comprehensive tests |
| Cross-workspace type sharing | Medium | Medium | Central `ai-platform-types` package; strict exports |
| Migration timeline slippage | Medium | High | Fixed Phase A deadline; parallel migration after Phase A complete |
| Design token gaps | Low | Medium | Audit tokens in Week 1; extend before component build |
| Accessibility regressions | Low | High | axe-core in CI; manual testing per workspace |

================================================================================
APPROVAL CHECKLIST
================================================================================

Before Phase A begins, the following must be approved:

- [ ] Component API specifications (this document)
- [ ] Visual design tokens match Stitch Project 10866743485103090405
- [ ] Storybook setup configured
- [ ] Visual regression testing pipeline ready
- [ ] Bundle size budget allocated
- [ ] Accessibility testing protocol defined
- [ ] Migration branch strategy agreed
- [ ] Rollback plan per workspace

================================================================================
NEXT STEPS
================================================================================

1. **Immediate:** Review and approve this plan
2. **Day 1:** Set up `packages/ai-components` monorepo package
3. **Day 1:** Configure Storybook + Chromatic
4. **Day 1:** Define TypeScript interfaces in `ai-platform-types`
5. **Week 1:** Build Tier 1 components (ModelCard, ProviderBadge, etc.)
5. **Week 2:** Design review + Tier 2/3
6. **Week 4:** Phase A complete → Phase B kickoff

================================================================================
END OF PLAN
================================================================================