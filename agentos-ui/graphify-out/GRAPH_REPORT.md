# Graph Report - agentos-ui  (2026-06-24)

## Corpus Check
- 33 files · ~21,375 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 245 nodes · 394 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 29 edges
2. `compilerOptions` - 17 edges
3. `compilerOptions` - 15 edges
4. `Hologram()` - 13 edges
5. `formatNumber()` - 13 edges
6. `PanelHeader()` - 11 edges
7. `AGENTS` - 8 edges
8. `formatMs()` - 8 edges
9. `WORKFLOWS` - 6 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AgentCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/AgentCard.tsx → src/lib/utils.ts
- `AlertItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/AlertItem.tsx → src/lib/utils.ts
- `StatCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/StatCard.tsx → src/lib/utils.ts
- `ChatBubble()` --calls--> `cn()`  [EXTRACTED]
  src/pages/AgentWorkspace.tsx → src/lib/utils.ts
- `MemoryPanel()` --calls--> `cn()`  [EXTRACTED]
  src/pages/AgentWorkspace.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (18): AGENT_EVENTS, TASKS, WORKFLOWS, formatMs(), formatNumber(), Agents(), AgentsProps, FleetCard() (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (22): Header(), AGENTS, ALERTS, ANALYTICS_SERIES, GRAPH_EDGES, GRAPH_NODES, Agent, AgentEvent (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (8): AgentCard(), AgentCardProps, AlertItem(), AlertItemProps, config, colorMap, StatCard(), StatCardProps

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (22): Hologram(), PanelHeader(), PRIMARY, SECONDARY, Sidebar(), SidebarItem(), SidebarProps, LOGS (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (16): dependencies, clsx, framer-motion, lucide-react, react, react-dom, react-query, @reactflow/background (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (11): pad2(), AgentWorkspaceProps, CHAT_SEED, ChatBubble(), MEMORY_RECORDS, MemoryPanel(), Mini(), TabId (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 11 - "Community 11"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **95 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 3` to `Community 0`, `Community 8`, `Community 2`, `Community 1`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 7` to `Community 5`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Hologram()` connect `Community 3` to `Community 0`, `Community 8`, `Community 1`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.10826210826210826 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._