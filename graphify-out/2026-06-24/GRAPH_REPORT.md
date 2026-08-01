# Graph Report - .hermes  (2026-06-23)

## Corpus Check
- 9 files · ~4,312 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 72 nodes · 86 edges · 14 communities (10 shown, 4 thin omitted)
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

## God Nodes (most connected - your core abstractions)
1. `utc_now()` - 9 edges
2. `DashboardHandler` - 7 edges
3. `Scribe` - 7 edges
4. `Cashflow` - 6 edges
5. `Dev` - 6 edges
6. `Orchestrator` - 6 edges
7. `Reach` - 6 edges
8. `Scout` - 6 edges
9. `db_connect()` - 5 edges
10. `run_agent_prompt()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `create_board_task()` --calls--> `utc_now()`  [EXTRACTED]
  dashboard.py → dashboard.py  _Bridges community 8 → community 6_
- `run_agent_prompt()` --calls--> `utc_now()`  [EXTRACTED]
  dashboard.py → dashboard.py  _Bridges community 8 → community 9_

## Import Cycles
- None detected.

## Communities (14 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.25
Nodes (7): Backend Tools Available, Content Types, Identity, Output Format, Paths, Responsibilities, Scribe

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (6): Backend Tools Available, Cashflow, Identity, Income Log, Paths, Responsibilities

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (6): Backend Tools Available, Dev, Development Workflow, Identity, Paths, Responsibilities

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (6): Backend Tools Available, Identity, Orchestrator, Paths, Prompt Patterns, Responsibilities

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (6): Backend Tools Available, Distribution Pipeline, Identity, Paths, Reach, Responsibilities

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (6): Backend Tools Available, Identity, Output Format, Paths, Responsibilities, Scout

### Community 6 - "Community 6"
Cohesion: 0.60
Nodes (5): create_board_task(), db_connect(), get_agent_logs(), get_board_tasks(), update_board_task()

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (4): graphify_build(), main(), Build a knowledge graph from a target path., utc_now()

### Community 9 - "Community 9"
Cohesion: 0.50
Nodes (4): log_agent_task(), Log a task via the PowerShell helper., Send a prompt to the selected backend tool and return the result., run_agent_prompt()

## Knowledge Gaps
- **31 isolated node(s):** `Identity`, `Paths`, `Responsibilities`, `Income Log`, `Backend Tools Available` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DashboardHandler` connect `Community 7` to `Community 8`, `Community 10`, `Community 6`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `utc_now()` connect `Community 8` to `Community 9`, `Community 10`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `run_agent_prompt()` connect `Community 9` to `Community 8`, `Community 10`, `Community 6`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `Helper for log-task-local.ps1: reads JSON config from argv[1], inserts row.`, `Log a task via the PowerShell helper.`, `Send a prompt to the selected backend tool and return the result.` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._