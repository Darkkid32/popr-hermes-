import { NavLink as RouterLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../lib/demo-data'
import { useUIStore } from '../stores/UIStore'

const STATUS_COLOR: Record<string, string> = {
  green: '#22d97a',
  amber: '#ffb347',
  red: '#ff4d6d',
  gray: '#4a5170',
}

export function Sidebar() {
  const location = useLocation()
  const setNewAgentOpen = useUIStore((s) => s.setNewAgentOpen)

  const path = location.pathname === '/' ? '/mission' : location.pathname
  const selfLinks = NAV_LINKS.filter((l) => l.group === 'self')
  const agentLinks = NAV_LINKS.filter((l) => l.group === 'agent')

  const routeFor = (id: string) => {
    if (id === 'fleet') return '/hermes'
    if (id === 'claude') return '/claude'
    if (id === 'opencode') return '/opencode'
    if (id === 'openclaw') return '/openclaw'
    if (id === 'gemini') return '/gemini'
    if (id === 'models') return '/models'
    if (id === 'plugins') return '/plugins'
    if (id === 'skills') return '/skills'
    if (id === 'mcp') return '/mcp'
    return '/' + id
  }

  return (
    <nav className="sidebar" aria-label="Primary navigation">
      <div className="sb-brand">
        <div className="sb-logo" aria-hidden="true">L</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sb-name">Agentic OS</div>
          <div className="sb-ver">v11 · Live</div>
        </div>
      </div>

      {selfLinks.length > 0 && (
        <>
          <div className="sb-section">Self</div>
          <div className="sb-nav">
            {selfLinks.map((link) => (
              <RouterLink
                key={link.id}
                to={routeFor(link.id)}
                className={'nav-item ' + (path.startsWith(routeFor(link.id)) ? 'active' : '')}
                aria-current={path.startsWith(routeFor(link.id)) ? 'page' : undefined}
              >
                <span className="ico" aria-hidden="true">{link.icon || '·'}</span>
                <span>{link.label}</span>
              </RouterLink>
            ))}
          </div>
        </>
      )}

      {agentLinks.length > 0 && (
        <>
          <div className="sb-section">Agents</div>
          <div className="sb-nav">
            {agentLinks.map((link) => (
              <RouterLink
                key={link.id}
                to={routeFor(link.id)}
                className={'nav-item ' + (path.startsWith(routeFor(link.id)) ? 'active' : '')}
                aria-current={path.startsWith(routeFor(link.id)) ? 'page' : undefined}
              >
                <span className="ico" aria-hidden="true">{link.icon || '·'}</span>
                <span>{link.label}</span>
                <span className="nav-status" style={{ background: STATUS_COLOR[link.status || 'gray'] }} aria-label={`Status: ${link.status || 'unknown'}`} />
              </RouterLink>
            ))}
            <button className="sb-add" onClick={() => setNewAgentOpen(true)} aria-label="Add new agent">
              <span className="plus" aria-hidden="true">+</span>
              <span>New agent</span>
            </button>
          </div>
        </>
      )}

      <div className="sb-user">
        <div className="sb-avatar">AO</div>
        <div>
          <div className="sb-uname">Alex Operator</div>
          <div className="sb-urole">System conductor</div>
        </div>
      </div>
    </nav>
  )
}