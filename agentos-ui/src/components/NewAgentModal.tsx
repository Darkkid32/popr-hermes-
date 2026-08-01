import { useState } from 'react'
import { useUIStore } from '../stores/UIStore'

const RUNTIMES = [
  { id: 'ollama', label: 'Ollama', sub: 'Local · qwen3 / llama3 / mistral', color: '#7c6cf5', defaultModel: 'qwen3:14b' },
  { id: 'openrouter', label: 'OpenRouter', sub: 'Cloud · Claude / GPT / Gemini', color: '#00e5ff', defaultModel: 'anthropic/claude-3.5-sonnet' },
  { id: 'anthropic', label: 'Anthropic', sub: 'Cloud · Claude Opus / Sonnet', color: '#ff4d6d', defaultModel: 'claude-3-opus' },
  { id: 'openai', label: 'OpenAI', sub: 'Cloud · GPT-4o / o1', color: '#22d97a', defaultModel: 'gpt-4o' },
]

export function NewAgentModal() {
  const open = useUIStore((s) => s.newAgentOpen)
  const setOpen = useUIStore((s) => s.setNewAgentOpen)
  const pushToast = useUIStore((s) => s.pushToast)
  const [step, setStep] = useState<'runtime' | 'name'>('runtime')
  const [runtime, setRuntime] = useState<typeof RUNTIMES[number] | null>(null)
  const [name, setName] = useState('')
  const [model, setModel] = useState('')

  if (!open) return null

  const reset = () => { setStep('runtime'); setRuntime(null); setName(''); setModel('') }

  const close = () => { setOpen(false); reset() }

  const handleNext = () => {
    if (step === 'runtime' && runtime) {
      setModel(runtime.defaultModel)
      setName(runtime.label + ' Lane')
      setStep('name')
    } else if (step === 'name' && name.trim()) {
      pushToast({ title: 'Agent added', message: `${name} (${runtime?.label}) connected · ${model}`, tone: 'success' })
      close()
    }
  }

  return (
    <div className="modal-overlay" onClick={close} role="dialog" aria-modal="true" aria-label="Add new agent">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{step === 'runtime' ? 'Connect a runtime' : `Configure ${runtime?.label} lane`}</h2>
        <p>{step === 'runtime'
          ? 'Pick the inference backend that will power this agent. The lane will appear in the sidebar as soon as the runtime responds.'
          : 'Give the lane a name and confirm the model. Defaults are safe; you can change them later in Settings.'}
        </p>

        {step === 'runtime' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {RUNTIMES.map((r) => (
              <button
                key={r.id}
                className="panel-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', border: runtime?.id === r.id ? `2px solid ${r.color}` : '1px solid rgba(255,255,255,0.06)', background: runtime?.id === r.id ? '#1a1f38' : '#141830' }}
                onClick={() => setRuntime(r)}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: r.color + '22', border: `1px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: r.color, fontFamily: 'Space Grotesk, sans-serif' }}>{r.label[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#9ba4c0' }}>{r.sub}</div>
                </div>
                {runtime?.id === r.id && <span className="badge badge-pink">selected</span>}
              </button>
            ))}
          </div>
        )}

        {step === 'name' && (
          <>
            <label className="field-label">Lane name</label>
            <input
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Trading Assistant"
              autoFocus
            />
            <label className="field-label" style={{ marginTop: 14 }}>Model</label>
            <input
              className="field-input mono"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={runtime?.defaultModel}
            />
            <div style={{ fontSize: 11, color: '#6b7494', marginTop: 8 }} className="mono">
              Backend: {runtime?.label} · default model: {runtime?.defaultModel}
            </div>
          </>
        )}

        <div className="modal-row">
          <button className="btn-secondary" onClick={close}>Cancel</button>
          <button className="btn-primary" onClick={handleNext} disabled={step === 'runtime' ? !runtime : !name.trim()}>
            {step === 'runtime' ? 'Next →' : 'Connect agent'}
          </button>
        </div>
      </div>
    </div>
  )
}