import { useState } from 'react'

export function SkillsBuilder() {
  const [skill, setSkill] = useState({
    name: '',
    description: '',
    version: '1.0.0',
    author: 'Hermes User',
    category: 'automation' as const,
    license: 'MIT',
    triggers: [] as any[],
    actions: [] as any[],
    permissions: [] as string[],
    dependencies: {} as Record<string, string>,
    configSchema: {} as Record<string, any>,
  })

  const [activeStep, setActiveStep] = useState(0)
  const steps = ['Basic Info', 'Triggers', 'Actions', 'Permissions', 'Review']

  const handleNext = () => setActiveStep((s) => Math.min(s + 1, steps.length - 1))
  const handlePrev = () => setActiveStep((s) => Math.max(s - 1, 0))

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="field-label">Skill Name</label>
              <input className="field-input" placeholder="my-awesome-skill" value={skill.name} onChange={(e) => setSkill({ ...skill, name: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Description</label>
              <textarea className="field-textarea" placeholder="What does this skill do?" value={skill.description} onChange={(e) => setSkill({ ...skill, description: e.target.value })} />
            </div>
            <div className="grid2">
              <div>
                <label className="field-label">Version</label>
                <input className="field-input" value={skill.version} onChange={(e) => setSkill({ ...skill, version: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Author</label>
                <input className="field-input" value={skill.author} onChange={(e) => setSkill({ ...skill, author: e.target.value })} />
              </div>
            </div>
            <div className="grid2">
              <div>
                <label className="field-label">Category</label>
                <select className="field-input" value={skill.category} onChange={(e) => setSkill({ ...skill, category: e.target.value as any })}>
                  <option value="automation">Automation</option>
                  <option value="coding">Coding</option>
                  <option value="analysis">Analysis</option>
                  <option value="communication">Communication</option>
                  <option value="data">Data</option>
                  <option value="utility">Utility</option>
                </select>
              </div>
              <div>
                <label className="field-label">License</label>
                <input className="field-input" value={skill.license} onChange={(e) => setSkill({ ...skill, license: e.target.value })} />
              </div>
            </div>
          </div>
        )
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-label"><span className="ico">⚡</span> TRIGGERS</div>
            <div style={{ fontSize: 11, color: '#6b7494' }}>Define how this skill gets invoked</div>
            {skill.triggers.map((trigger, i) => (
              <div key={i} className="panel-sm" style={{ marginBottom: 12 }}>
                <div className="grid2" style={{ marginBottom: 8 }}>
                  <select className="field-input" value={trigger.type} onChange={(e) => { const t = [...skill.triggers]; t[i] = { ...t[i], type: e.target.value }; setSkill({ ...skill, triggers: t }) }}>
                    <option value="schedule">Schedule (cron)</option>
                    <option value="event">Event</option>
                    <option value="webhook">Webhook</option>
                    <option value="manual">Manual</option>
                    <option value="condition">Condition</option>
                  </select>
                  <input className="field-input" placeholder="Config (JSON)" value={JSON.stringify(trigger.config)} onChange={(e) => { const t = [...skill.triggers]; t[i] = { ...t[i], config: JSON.parse(e.target.value) }; setSkill({ ...skill, triggers: t }) }} />
                </div>
                <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={() => { const t = skill.triggers.filter((_, j) => j !== i); setSkill({ ...skill, triggers: t }) }}>Remove</button>
              </div>
            ))}
            <button className="btn-secondary" style={{ justifyContent: 'center', gap: 8 }} onClick={() => setSkill({ ...skill, triggers: [...skill.triggers, { type: 'manual', config: {} }] })}>
              <span style={{ fontSize: 14 }}>+</span> Add Trigger
            </button>
          </div>
        )
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-label"><span className="ico">⚡</span> ACTIONS</div>
            <div style={{ fontSize: 11, color: '#6b7494' }}>Define what this skill can do</div>
            {skill.actions.map((action, i) => (
              <div key={i} className="panel-sm" style={{ marginBottom: 12 }}>
                <div className="grid2" style={{ marginBottom: 8 }}>
                  <input className="field-input" placeholder="Action name" value={action.name} onChange={(e) => { const a = [...skill.actions]; a[i] = { ...a[i], name: e.target.value }; setSkill({ ...skill, actions: a }) }} />
                  <input className="field-input" placeholder="Returns type" value={action.returns} onChange={(e) => { const a = [...skill.actions]; a[i] = { ...a[i], returns: e.target.value }; setSkill({ ...skill, actions: a }) }} />
                </div>
                <input className="field-input" placeholder="Description" value={action.description} onChange={(e) => { const a = [...skill.actions]; a[i] = { ...a[i], description: e.target.value }; setSkill({ ...skill, actions: a }) }} />
                <div>
                  <label className="field-label">Parameters (JSON Schema)</label>
                  <textarea className="field-textarea" value={JSON.stringify(action.params, null, 2)} onChange={(e) => { const a = [...skill.actions]; a[i] = { ...a[i], params: JSON.parse(e.target.value) }; setSkill({ ...skill, actions: a }) }} style={{ minHeight: 80 }} />
                </div>
                <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px', color: '#ff4d6d', borderColor: '#ff4d6d' }} onClick={() => { const a = skill.actions.filter((_, j) => j !== i); setSkill({ ...skill, actions: a }) }}>Remove</button>
              </div>
            ))}
            <button className="btn-secondary" style={{ justifyContent: 'center', gap: 8 }} onClick={() => setSkill({ ...skill, actions: [...skill.actions, { name: '', description: '', params: {}, returns: 'void' }] })}>
              <span style={{ fontSize: 14 }}>+</span> Add Action
            </button>
          </div>
        )
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-label"><span className="ico">⚠</span> PERMISSIONS</div>
            <div style={{ fontSize: 11, color: '#6b7494' }}>Declare required permissions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['filesystem.read', 'filesystem.write', 'filesystem.full', 'git.read', 'git.full', 'network.localhost', 'network.outbound', 'process.exec', 'gpu.access', 'secrets.read', 'schedule.manage', 'webhook.receive', 'vscode.api', 'terminal.access'].map((perm) => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 10px', background: '#141830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                  <input type="checkbox" checked={skill.permissions.includes(perm)} onChange={(e) => setSkill({ ...skill, permissions: e.target.checked ? [...skill.permissions, perm] : skill.permissions.filter((p) => p !== perm) })} />
                  <span style={{ fontSize: 11, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{perm}</span>
                </label>
              ))}
            </div>
            <div className="section-label"><span className="ico">⊕</span> DEPENDENCIES</div>
            <div style={{ fontSize: 11, color: '#6b7494' }}>NPM dependencies (package@version)</div>
            <textarea className="field-textarea" placeholder='{ "hermes-core": "^1.0.0", "typescript": "^5.0.0" }' value={JSON.stringify(skill.dependencies, null, 2)} onChange={(e) => setSkill({ ...skill, dependencies: JSON.parse(e.target.value) })} style={{ minHeight: 80 }} />
          </div>
        )
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="section-label"><span className="ico">✓</span> REVIEW & GENERATE</div>
            <div className="panel-sm">
              <div className="row"><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Name</span><span style={{ fontWeight: 500, color: '#e8eaf6' }}>{skill.name}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Description</span><span style={{ color: '#9ba4c0' }}>{skill.description}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Version</span><span className="mono">{skill.version}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Category</span><span className={'badge badge-' + (skill.category === 'automation' ? 'amber' : skill.category === 'coding' ? 'red' : 'purple')}>{skill.category}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Triggers</span><span className="mono">{skill.triggers.length}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Actions</span><span className="mono">{skill.actions.length}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Permissions</span><span className="mono">{skill.permissions.length}</span></div>
              <div className="row" style={{ marginTop: 4 }}><span style={{ fontSize: 12, color: '#6b7494', minWidth: 100 }}>Dependencies</span><span className="mono">{Object.keys(skill.dependencies).length}</span></div>
            </div>
            <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 16, fontSize: 10, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace', maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify({
                name: skill.name,
                version: skill.version,
                description: skill.description,
                author: skill.author,
                license: skill.license,
                category: skill.category,
                permissions: skill.permissions,
                dependencies: skill.dependencies,
                entryPoint: 'dist/index.js',
                configSchema: skill.configSchema,
                triggers: skill.triggers,
                actions: skill.actions,
              }, null, 2)}
            </div>
            <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => { /* download */ }}>Download Manifest</button>
              <button className="btn-primary">Create Skill</button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> builder ready</span>
        <span className="badge badge-cyan"><span className="mono">step {activeStep + 1} of {steps.length}</span></span>
        <span className="badge badge-purple"><span className="mono">{skill.triggers.length} triggers · {skill.actions.length} actions</span></span>
        <span className="badge badge-gray"><span className="mono">{skill.permissions.length} permissions</span></span>
      </div>

      <div className="panel" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {steps.map((step, i) => (
            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
              <div className={'badge ' + (i === activeStep ? 'badge-purple' : i < activeStep ? 'badge-green' : 'badge-gray')} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
                {i < activeStep ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, color: i <= activeStep ? '#e8eaf6' : '#6b7494', textAlign: 'center', fontWeight: i === activeStep ? 600 : 400 }}>{step}</span>
              {i < steps.length - 1 && <div style={{ position: 'absolute', top: 14, left: '50%', right: '-50%', height: 2, background: i < activeStep ? '#22d97a' : 'rgba(255,255,255,0.06)', zIndex: -1 }} />}
            </div>
          ))}
        </div>

        {renderStep()}

        <div className="row" style={{ marginTop: 24, gap: 8, justifyContent: 'space-between' }}>
          <button className="btn-secondary" onClick={handlePrev} disabled={activeStep === 0}>← Back</button>
          <div className="spacer" />
          <button className="btn-primary" onClick={handleNext} disabled={activeStep === steps.length - 1}>
            {activeStep === steps.length - 1 ? 'Create Skill' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}