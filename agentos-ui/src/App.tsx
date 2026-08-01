import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { NewAgentModal } from './components/NewAgentModal'
import { ToastStack } from './components/ToastStack'
import { MissionControl } from './pages/MissionControl'
import { AgentWorkspaceRoute } from './pages/AgentWorkspace'
import { Goals } from './pages/Goals'
import { Memory } from './pages/Memory'
import { Workflows } from './pages/Workflows'
import { Graphify } from './pages/Graphify'
import { Alerts } from './pages/Alerts'
import { Analytics } from './pages/Analytics'
import { Logs } from './pages/Logs'
import { Integrations } from './pages/Integrations'
import { Tools } from './pages/Tools'
import { SettingsPage } from './pages/Settings'

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
            <button className="sys-pill" aria-label="System status">
              <span className="rainbow-dot" />
              <span>All Systems</span>
            </button>
          </div>
        </header>
        <div className="content">
          <div key={location.pathname} className={'page active'} id="main">
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
              <Route path="/" element={<MissionControl />} />
              <Route path="/mission" element={<MissionControl />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/memory/:noteId" element={<Memory />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/workflows/:id" element={<Workflows />} />
              <Route path="/workflows/new" element={<Workflows />} />
              <Route path="/graphify" element={<Graphify />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/:id" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/hermes" element={<AgentWorkspaceRoute agentId="hermes" />} />
              <Route path="/hermes/:tab" element={<AgentWorkspaceRoute agentId="hermes" />} />
              <Route path="/claude" element={<AgentWorkspaceRoute agentId="claude" />} />
              <Route path="/claude/:tab" element={<AgentWorkspaceRoute agentId="claude" />} />
              <Route path="/opencode" element={<AgentWorkspaceRoute agentId="opencode" />} />
              <Route path="/opencode/:tab" element={<AgentWorkspaceRoute agentId="opencode" />} />
              <Route path="/openclaw" element={<AgentWorkspaceRoute agentId="openclaw" />} />
              <Route path="/openclaw/:tab" element={<AgentWorkspaceRoute agentId="openclaw" />} />
              <Route path="/gemini" element={<AgentWorkspaceRoute agentId="gemini" />} />
              <Route path="/gemini/:tab" element={<AgentWorkspaceRoute agentId="gemini" />} />
              <Route path="*" element={<MissionControl />} />
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