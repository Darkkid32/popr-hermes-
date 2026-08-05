import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { NewAgentModal } from './components/NewAgentModal'
import { ToastStack } from './components/ToastStack'
import { ReconnectBanner } from './components/realtime/ReconnectBanner'
import { ConnectionIndicator } from './components/realtime/ConnectionIndicator'
import { Suspense, lazy } from 'react'

// Workspace lazy loading - code splitting
const LazyMissionControl = lazy(() => import('./pages/MissionControl').then(m => ({ default: m.MissionControl })))
const LazyAgentWorkspace = lazy(() => import('./pages/AgentWorkspace').then(m => ({ default: m.AgentWorkspaceRoute })))
const LazyGoals = lazy(() => import('./pages/Goals').then(m => ({ default: m.Goals })))
const LazyMemory = lazy(() => import('./pages/Memory').then(m => ({ default: m.Memory })))
const LazyWorkflows = lazy(() => import('./pages/Workflows').then(m => ({ default: m.Workflows })))
const LazyGraphify = lazy(() => import('./pages/Graphify').then(m => ({ default: m.Graphify })))
const LazyAlerts = lazy(() => import('./pages/Alerts').then(m => ({ default: m.Alerts })))
const LazyAnalytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const LazyLogs = lazy(() => import('./pages/Logs').then(m => ({ default: m.Logs })))
const LazyIntegrations = lazy(() => import('./pages/Integrations').then(m => ({ default: m.Integrations })))
const LazyTools = lazy(() => import('./pages/Tools').then(m => ({ default: m.Tools })))
const LazySettings = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })))
const LazyModels = lazy(() => import('./pages/Models').then(m => ({ default: m.Models })))
const LazyPlugins = lazy(() => import('./pages/Plugins').then(m => ({ default: m.Plugins })))
const LazySkills = lazy(() => import('./pages/Skills').then(m => ({ default: m.Skills })))
const LazyMCP = lazy(() => import('./pages/MCP').then(m => ({ default: m.MCP })))
const LazyOrganization = lazy(() => import('./pages/Organization').then(m => ({ default: m.Organization })))
const LazySecurity = lazy(() => import('./pages/Security').then(m => ({ default: m.Security })))
const LazyObservability = lazy(() => import('./pages/Observability').then(m => ({ default: m.Observability })))
const LazyAutomation = lazy(() => import('./pages/Automation').then(m => ({ default: m.Automation })))

const SuspenseFallback = () => (
  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>Loading...</div>
)

interface PageMeta {
  roman: string
  eyebrow: string
  title: string
  sub: string
  kind: 'self' | 'agent' | 'meta'
}

const PAGE_META: Record<string, PageMeta> = {
  '/mission': { roman: 'I', eyebrow: 'Self · Mission Control', title: 'Mission Control', sub: 'Live telemetry from the agent fleet. Everything below is a projection of a single graph.', kind: 'self' },
  '/goals': { roman: 'II', eyebrow: 'Self · Goals', title: 'Goals', sub: 'Quarterly objectives. Auto-tracked from your vault, agent runtimes, and operator workflows.', kind: 'self' },
  '/memory': { roman: 'III', eyebrow: 'Self · Memory', title: 'Memory', sub: 'Your second brain. Vault, notes, Omi captures, and the live knowledge graph that connects them all.', kind: 'self' },
  '/hermes': { roman: 'IV', eyebrow: 'Agent · Hermes', title: 'Hermes', sub: 'Local-first agent. Sessions, skills, kanban, memory, and a chat line you can drive from anywhere.', kind: 'agent' },
  '/claude': { roman: 'V', eyebrow: 'Agent · Claude', title: 'Claude Code', sub: 'Deep engineering agent. Code reviews, architecture, refactors, and long-horizon analysis.', kind: 'agent' },
  '/opencode': { roman: 'VI', eyebrow: 'Agent · OpenCode', title: 'OpenCode', sub: 'Fast implementation lane. TypeScript, Vite, file edits, commits, and diffs.', kind: 'agent' },
  '/openclaw': { roman: 'VII', eyebrow: 'Agent · OpenClaw', title: 'OpenClaw', sub: 'Cloud execution surface. Connectors, automations, scheduled jobs, and runtime actions.', kind: 'agent' },
  '/gemini': { roman: 'VIII', eyebrow: 'Agent · Gemini', title: 'Gemini', sub: 'Google model runtime. Lightweight chat and reasoning surface, no live source connected.', kind: 'agent' },
  '/workflows': { roman: 'IX', eyebrow: 'Workflow Ops', title: 'Workflow Ops', sub: 'Compose, trace, and monitor multi-agent workflow runs.', kind: 'self' },
  '/graphify': { roman: 'X', eyebrow: 'Graphify', title: 'Graphify neural network', sub: 'Visual brain — all nodes, edges, communities, and memory writes.', kind: 'self' },
  '/alerts': { roman: 'XI', eyebrow: 'Alert Command', title: 'Alert Command', sub: 'Live incidents, ownership, escalation paths, resolution history, and trends.', kind: 'self' },
  '/analytics': { roman: 'XII', eyebrow: 'Analytics', title: 'Operational telemetry', sub: 'Performance, efficiency, memory, goals, cost, collaboration, and graph expansion.', kind: 'self' },
  '/logs': { roman: 'XIII', eyebrow: 'Logs', title: 'Runtime signal stream', sub: 'Live agent events, system signals, and tool calls across all four agents.', kind: 'self' },
  '/integrations': { roman: 'XIV', eyebrow: 'Integrations', title: 'Connected surfaces', sub: 'Chats, runtimes, and external surfaces wired into AgentOS.', kind: 'self' },
  '/tools': { roman: 'XV', eyebrow: 'Tools', title: 'Runtime capabilities', sub: 'Installed engines, bridges, and operator-facing capabilities powering each agent.', kind: 'self' },
  '/settings': { roman: 'XVI', eyebrow: 'Settings', title: 'System settings', sub: 'Configure AgentOS runtime, model, and operator preferences.', kind: 'self' },
  '/models': { roman: 'XVII', eyebrow: 'Models', title: 'Model Catalog', sub: 'Local and cloud LLMs, routing rules, endpoints, and benchmarks.', kind: 'self' },
  '/plugins': { roman: 'XVIII', eyebrow: 'Plugins', title: 'Plugin System', sub: 'Installed plugins, marketplace, permissions, and sandbox configuration.', kind: 'self' },
  '/skills': { roman: 'XIX', eyebrow: 'Skills', title: 'Skill Engine', sub: 'Installed skills, templates, builder, and execution runtime.', kind: 'self' },
  '/mcp': { roman: 'XX', eyebrow: 'MCP', title: 'MCP Workspace', sub: 'Model Context Protocol servers, tools, resources, and marketplace.', kind: 'self' },
  '/organization': { roman: 'XXI', eyebrow: 'Self · Organization', title: 'Organization', sub: 'Manage organization structure, teams, RBAC, workspaces, projects, and compliance.', kind: 'self' },
  '/security': { roman: 'XXII', eyebrow: 'Self · Security', title: 'Security', sub: 'Threat detection, vulnerability management, compliance, audit logs, and access control.', kind: 'self' },
  '/observability': { roman: 'XXIII', eyebrow: 'Self · Observability', title: 'Observability', sub: 'Metrics, logs, traces, dashboards, alerts, and service topology.', kind: 'self' },
  '/automation': { roman: 'XXIV', eyebrow: 'Self · Automation', title: 'Automation', sub: 'Visual workflow builder, triggers, actions, schedules, and execution monitoring.', kind: 'self' },
}

function matchMeta(pathname: string): PageMeta {
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  for (const key of Object.keys(PAGE_META)) {
    if (pathname.startsWith(key + '/')) return PAGE_META[key]
  }
  return PAGE_META['/mission']
}

function AppShell() {
  const location = useLocation()
  const meta = matchMeta(location.pathname)
  const date = formatDate()

  const pageName = location.pathname === '/' ? 'Mission Control' : meta.eyebrow

  return (
    <div className="app">
      <ReconnectBanner />
      <a href="#main" className="skip-link">Skip to main content</a>
      <Sidebar />
      <div className="main">
        <header className="header">
          <div className="header-left">
            <span>LOCAL · BANGKOK</span>
            <span className="sep">·</span>
            <span>{date}</span>
            <span className="sep">·</span>
            <span className="page-name">{pageName}</span>
          </div>
          <div className="row">
            <ConnectionIndicator showLatency showQuality size="sm" />
            <button className="sys-pill" aria-label="System status">
              <span className="rainbow-dot" />
              <span>All Systems</span>
            </button>
          </div>
        </header>
        <div className="content">
                  <div className={'page active'} id="main">
            <div className="page-header">
              <div className="page-eyebrow">
                <span className="roman">{meta.roman}.</span>
                <span className="sep">·</span>
                <span>{meta.eyebrow}</span>
              </div>
              <div className="page-title">{meta.title}</div>
              <div className="page-sub">{meta.sub}</div>
            </div>
            <Routes>
              <Route path="/" element={<Suspense fallback={<SuspenseFallback />}> <LazyMissionControl /> </Suspense>} />
              <Route path="/mission" element={<Suspense fallback={<SuspenseFallback />}> <LazyMissionControl /> </Suspense>} />
              <Route path="/goals" element={<Suspense fallback={<SuspenseFallback />}> <LazyGoals /> </Suspense>} />
              <Route path="/memory" element={<Suspense fallback={<SuspenseFallback />}> <LazyMemory /> </Suspense>} />
              <Route path="/memory/:noteId" element={<Suspense fallback={<SuspenseFallback />}> <LazyMemory /> </Suspense>} />
              <Route path="/workflows" element={<Suspense fallback={<SuspenseFallback />}> <LazyWorkflows /> </Suspense>} />
              <Route path="/workflows/:id" element={<Suspense fallback={<SuspenseFallback />}> <LazyWorkflows /> </Suspense>} />
              <Route path="/workflows/new" element={<Suspense fallback={<SuspenseFallback />}> <LazyWorkflows /> </Suspense>} />
              <Route path="/graphify" element={<Suspense fallback={<SuspenseFallback />}> <LazyGraphify /> </Suspense>} />
              <Route path="/alerts" element={<Suspense fallback={<SuspenseFallback />}> <LazyAlerts /> </Suspense>} />
              <Route path="/alerts/:id" element={<Suspense fallback={<SuspenseFallback />}> <LazyAlerts /> </Suspense>} />
              <Route path="/analytics" element={<Suspense fallback={<SuspenseFallback />}> <LazyAnalytics /> </Suspense>} />
              <Route path="/logs" element={<Suspense fallback={<SuspenseFallback />}> <LazyLogs /> </Suspense>} />
              <Route path="/integrations" element={<Suspense fallback={<SuspenseFallback />}> <LazyIntegrations /> </Suspense>} />
              <Route path="/tools" element={<Suspense fallback={<SuspenseFallback />}> <LazyTools /> </Suspense>} />
              <Route path="/settings" element={<Suspense fallback={<SuspenseFallback />}> <LazySettings /> </Suspense>} />
              <Route path="/models" element={<Suspense fallback={<SuspenseFallback />}> <LazyModels /> </Suspense>} />
              <Route path="/models/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyModels /> </Suspense>} />
              <Route path="/plugins" element={<Suspense fallback={<SuspenseFallback />}> <LazyPlugins /> </Suspense>} />
              <Route path="/plugins/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyPlugins /> </Suspense>} />
              <Route path="/skills" element={<Suspense fallback={<SuspenseFallback />}> <LazySkills /> </Suspense>} />
              <Route path="/skills/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazySkills /> </Suspense>} />
              <Route path="/mcp" element={<Suspense fallback={<SuspenseFallback />}> <LazyMCP /> </Suspense>} />
              <Route path="/mcp/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyMCP /> </Suspense>} />
              <Route path="/organization" element={<Suspense fallback={<SuspenseFallback />}> <LazyOrganization /> </Suspense>} />
              <Route path="/organization/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyOrganization /> </Suspense>} />
              <Route path="/security" element={<Suspense fallback={<SuspenseFallback />}> <LazySecurity /> </Suspense>} />
              <Route path="/security/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazySecurity /> </Suspense>} />
              <Route path="/observability" element={<Suspense fallback={<SuspenseFallback />}> <LazyObservability /> </Suspense>} />
              <Route path="/observability/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyObservability /> </Suspense>} />
              <Route path="/automation" element={<Suspense fallback={<SuspenseFallback />}> <LazyAutomation /> </Suspense>} />
              <Route path="/automation/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyAutomation /> </Suspense>} />
              <Route path="/hermes" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="hermes" /> </Suspense>} />
              <Route path="/hermes/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="hermes" /> </Suspense>} />
              <Route path="/claude" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="claude" /> </Suspense>} />
              <Route path="/claude/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="claude" /> </Suspense>} />
              <Route path="/opencode" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="opencode" /> </Suspense>} />
              <Route path="/opencode/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="opencode" /> </Suspense>} />
              <Route path="/openclaw" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="openclaw" /> </Suspense>} />
              <Route path="/openclaw/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="openclaw" /> </Suspense>} />
              <Route path="/gemini" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="gemini" /> </Suspense>} />
              <Route path="/gemini/:tab" element={<Suspense fallback={<SuspenseFallback />}> <LazyAgentWorkspace agentId="gemini" /> </Suspense>} />
              <Route path="*" element={<Suspense fallback={<SuspenseFallback />}> <LazyMissionControl /> </Suspense>} />
            </Routes>
          </div>
        </div>
      </div>
      <NewAgentModal />
      <ToastStack />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function formatDate() {
  const d = new Date()
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`
}