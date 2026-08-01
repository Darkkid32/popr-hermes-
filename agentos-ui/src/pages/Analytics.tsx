import { AGENTS, WORKFLOWS } from '../lib/demo-data'

export function Analytics() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> live telemetry</span>
        <span className="badge badge-cyan"><span className="mono">today · {new Date().toISOString().slice(0, 10)}</span></span>
        <span className="badge badge-purple"><span className="mono">weighted across {AGENTS.length} agents</span></span>
        <span className="badge badge-gray"><span className="mono">perf score 95%</span></span>
      </div>

      <div className="grid6" style={{ marginBottom: 16 }}>
        <Stat label="TOKEN USAGE" value="631.3K" sub="today" />
        <Stat label="COST" value="$21.18" sub="agent + cloud" />
        <Stat label="WORKFLOW EFF." value="82%" sub="weighted avg" color="#22d97a" />
        <Stat label="GOAL COMPLETION" value="69%" sub="fleet avg" color="#00e5ff" />
        <Stat label="MEMORY GROWTH" value="2.0K" sub="records" />
        <Stat label="GRAPH GROWTH" value="21" sub="29 edges" color="#7c6cf5" />
        <Stat label="COLLAB EDGES" value="8" sub="handoffs" />
        <Stat label="PERF SCORE" value="95%" sub="fleet" color="#22d97a" />
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="section-label"><span className="ico">∿</span> AGENT PERFORMANCE MATRIX</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AGENTS.map((agent) => (
              <div key={agent.id}>
                <div className="row" style={{ marginBottom: 6 }}>
                  <div className="agent-circle" style={{ background: agent.hex, color: agent.color === 'amber' ? '#1a1000' : '#fff', borderColor: agent.hex, width: 24, height: 24, fontSize: 10 }}>{agent.initial}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{agent.name}</span>
                  <span style={{ fontSize: 11, color: '#6b7494' }} className="mono">{tokenFromAgent(agent.id)}</span>
                  <div className="spacer" />
                  <span style={{ fontSize: 11, color: '#9ba4c0' }} className="mono">${costFromAgent(agent.id)}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: agent.goalPct + '%', background: agent.hex }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

          <div className="section-label"><span className="ico">⇄</span> COLLABORATION PRESSURE</div>
          <div className="grid2">
            {AGENTS.slice(0, 2).map((agent) => (
              <div key={agent.id}>
                <div style={{ color: '#e8eaf6', fontWeight: 500, marginBottom: 6, fontSize: 12 }}>{agent.name} <span className="badge badge-gray">{countLinks(agent.id)} links</span></div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {AGENTS.filter((a) => a.id !== agent.id).map((peer) => (
                    <span key={peer.id} className={`badge badge-${peer.color}`} style={{ fontSize: 10 }}>{peer.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-label"><span className="ico">⌘</span> WORKFLOW METRICS</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {WORKFLOWS.map((wf) => (
              <div key={wf.id} className="table-row">
                <div style={{ flex: 1, fontSize: 13, color: '#e8eaf6' }}>{wf.name}</div>
                <span style={{ fontSize: 11, color: '#6b7494' }} className="mono">{wf.runs} runs · {wf.failures} fail</span>
                <span className={'badge badge-' + (wf.efficiency >= 80 ? 'green' : 'amber')} style={{ fontSize: 10 }}>{wf.efficiency}%</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

          <div className="section-label"><span className="ico">◈</span> GOAL COMPLETION</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {AGENTS.map((agent) => (
              <div key={agent.id} className="row">
                <div className="agent-circle" style={{ background: agent.hex, color: agent.color === 'amber' ? '#1a1000' : '#fff', borderColor: agent.hex, width: 24, height: 24, fontSize: 10 }}>{agent.initial}</div>
                <span style={{ fontSize: 12.5, color: '#e8eaf6', flex: 1 }}>{agent.name}</span>
                <div className="progress-bar" style={{ width: 100 }}>
                  <div className="progress-fill" style={{ width: agent.goalPct + '%', background: agent.hex }} />
                </div>
                <span style={{ fontSize: 11, color: agent.goalTone === 'green' ? '#22d97a' : agent.goalTone === 'amber' ? '#ffb347' : '#ff4d6d', minWidth: 32, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{agent.goalPct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="panel-sm">
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ fontSize: 18, color: color ?? '#e8eaf6' }}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  )
}

function tokenFromAgent(id: string): string {
  const map: Record<string, string> = { hermes: '184.2K', claude: '241.8K', opencode: '128.9K', openclaw: '76.4K' }
  return map[id] + ' tok'
}

function costFromAgent(id: string): string {
  const map: Record<string, string> = { hermes: '3.72', claude: '11.42', opencode: '1.88', openclaw: '4.16' }
  return map[id]
}

function countLinks(id: string): number {
  const map: Record<string, number> = { hermes: 3, claude: 2, opencode: 2, openclaw: 1 }
  return map[id]
}