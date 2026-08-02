# Hermes Platform — Phase 5 Changelog

**Version:** v1.0-phase5
**Date:** 2026-08-02
**Scope:** Automation Workspace implementation on the Hermes UI Foundation (Phases 1–4).

---

## Overview

Phase 5 delivers the complete Automation Workspace: 15 pages covering workflows, workflow
builder, triggers, actions, executions, schedules, jobs, queues, templates, variables,
secrets, execution history, analytics, and settings — plus a unified overview. Built entirely
on the existing Hermes Design System, component library, application shell, router, and
Zustand architecture. UI only — no workflow execution engine, cron scheduler, background
workers, message brokers, backend APIs, or external infrastructure.

---

## Features Completed

### Automation Store (`automationStore.ts`)
New Zustand store with full mock data and selectors/actions for:
- **Workflows** (7): active, draft, paused, archived across deploy/data/ops/ai/integration/custom categories
- **Triggers** (7): schedule, webhook, event, file, manual, http with enable/disable
- **Actions** (10): HTTP, transform, shell, notify, conditional branch, database, delay, AI, code, API
- **Executions** (6): running, success, failed, cancelled with step-level detail
- **Schedules** (5): daily, hourly, weekly, monthly, cron with pause/resume
- **Jobs** (6): queued, running, completed, failed with retry/cancel
- **Queues** (6): default, deployments, notifications, ai-tasks, retry, data-pipeline with health
- **Templates** (6): database backup, CI/CD, incident response, ML retraining, user lifecycle, data enrichment
- **Variables** (6): environment-specific with sensitivity flags
- **Secrets** (6): vault references with rotation cadence and expiry
- **Analytics** (8): execution counts, success rate, duration, throughput KPIs

Selectors: workflowById, workflowsByStatus/Category, triggerById, actionById,
executionsByWorkflow/Status, scheduleById, jobById, jobsByStatus, variablesByEnv,
secretsByStatus, templatesByCategory, activeWorkflows, runningExecutions, failedExecutions24h.

Actions: setWorkflowStatus, toggleTrigger, toggleSchedule, updateVariable, rotateSecret,
updateSettings, cancelExecution, retryJob, cancelJob, resetAutomation.

### Shared Components (`src/components/automation/`)
14 reusable components:
- `WorkflowCards` — workflow cards with category dots, execution stats
- `WorkflowTable` — sortable workflow table with pause/resume/activate actions
- `TriggerCards` — trigger cards with type badges and enable/disable toggles
- `ActionCards` — action catalog cards with icons and usage counts
- `ExecutionTimeline` — execution list with step detail and cancel
- `ScheduleTable` — schedule table with frequency, cron, next run, pause/resume
- `JobMonitor` — job queue table with priority, attempts, retry/cancel
- `QueueMonitor` — queue cards with depth, throughput, lag, consumers
- `BuilderCanvas` — visual placeholder for workflow builder with drag blocks
- `TemplateCards` — template cards with ratings and tags
- `VariableEditor` — environment-filtered variable list with sensitivity flags
- `SecretCards` — secret reference cards with rotate action
- `AnalyticsPanels` — KPI grid (reuses Phase 4 KPICard)
- `AutomationSettingsForm` — execution limits, notifications, security toggles

### Pages (`src/pages/automation/`)
15 pages + layout:
- `AutomationLayout` — 15-tab sub-navigation with active states
- `AutomationOverview` — KPIs, execution timeline, queue monitor, workflow table
- `AutomationWorkflows` — workflow card grid
- `AutomationBuilder` — visual workflow builder canvas
- `AutomationTriggers` — trigger card grid
- `AutomationActions` — action catalog
- `AutomationExecutions` — live execution timeline
- `AutomationSchedules` — schedule table
- `AutomationJobs` — job monitor table
- `AutomationQueues` — queue health cards
- `AutomationTemplates` — template gallery
- `AutomationVariables` — variable editor
- `AutomationSecrets` — secret rotation cards
- `AutomationHistory` — execution history with stats
- `AutomationAnalytics` — operational KPI panels
- `AutomationSettingsPage` — settings + config summary + danger zone

### Routing
15 new routes under `/automation/*` with PAGE_META XX.
Machine Control, Organization, Security, Observability routes unchanged.

### Tooling
- Added automation store tests (12 tests)
- Added component smoke tests (3 tests)
- Total test suite: 62 tests passing across 8 files

---

## Files Created

```
agentos-ui/src/stores/automationStore.ts
agentos-ui/src/stores/automationStore.test.ts
agentos-ui/src/components/automation/index.ts
agentos-ui/src/components/automation/WorkflowCards.tsx
agentos-ui/src/components/automation/WorkflowTable.tsx
agentos-ui/src/components/automation/TriggerCards.tsx
agentos-ui/src/components/automation/ActionCards.tsx
agentos-ui/src/components/automation/ExecutionTimeline.tsx
agentos-ui/src/components/automation/ScheduleTable.tsx
agentos-ui/src/components/automation/JobMonitor.tsx
agentos-ui/src/components/automation/QueueMonitor.tsx
agentos-ui/src/components/automation/BuilderCanvas.tsx
agentos-ui/src/components/automation/TemplateCards.tsx
agentos-ui/src/components/automation/VariableEditor.tsx
agentos-ui/src/components/automation/SecretCards.tsx
agentos-ui/src/components/automation/AnalyticsPanels.tsx
agentos-ui/src/components/automation/SettingsForms.tsx
agentos-ui/src/components/automation/automationComponents.test.tsx
agentos-ui/src/pages/automation/index.ts
agentos-ui/src/pages/automation/AutomationLayout.tsx
agentos-ui/src/pages/automation/AutomationOverview.tsx
agentos-ui/src/pages/automation/AutomationWorkflows.tsx
agentos-ui/src/pages/automation/AutomationBuilder.tsx
agentos-ui/src/pages/automation/AutomationTriggers.tsx
agentos-ui/src/pages/automation/AutomationActions.tsx
agentos-ui/src/pages/automation/AutomationExecutions.tsx
agentos-ui/src/pages/automation/AutomationSchedules.tsx
agentos-ui/src/pages/automation/AutomationJobs.tsx
agentos-ui/src/pages/automation/AutomationQueues.tsx
agentos-ui/src/pages/automation/AutomationTemplates.tsx
agentos-ui/src/pages/automation/AutomationVariables.tsx
agentos-ui/src/pages/automation/AutomationSecrets.tsx
agentos-ui/src/pages/automation/AutomationHistory.tsx
agentos-ui/src/pages/automation/AutomationAnalytics.tsx
agentos-ui/src/pages/automation/AutomationSettings.tsx
PHASE5_CHANGELOG.md
PHASE5_RELEASE.md
```

## Files Modified

| Path | Change |
|---|---|
| `agentos-ui/src/lib/demo-data.ts` | NavLink group extended with `'automation'` |
| `agentos-ui/src/components/Sidebar.tsx` | Automation nav section added |
| `agentos-ui/src/App.tsx` | PAGE_META XX + nested `/automation/*` routes + imports |

---

## Verification Summary

| Gate | Command | Result |
|---|---|---|
| Install | `pnpm install` | ✅ exit 0 |
| TypeScript | `pnpm typecheck` (`tsc -b`) | ✅ exit 0 |
| Lint | `pnpm lint` (oxlint) | ✅ exit 0 — 0 errors |
| Build | `pnpm build` (`tsc -b && vite build`) | ✅ exit 0 |
| Tests | `pnpm test` (vitest run) | ✅ 8 files · 62/62 passed |

Production bundle: `dist/index.html` 0.47 kB · CSS 20.68 kB · JS 1,962 kB (gzip 519 kB).

## Known Pre-existing Warnings (unchanged, non-blocking)

- `src/lib/hooks/useLive.ts` — `react-hooks(exhaustive-deps)` (Phase 1 file).
- `src/design-system/theme/index.tsx` — `react(only-export-components)` ×4 (configured as `warn`).

Phase 5 introduced **zero new lint warnings or errors**.
