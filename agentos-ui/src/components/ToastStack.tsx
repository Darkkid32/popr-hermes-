import { useUIStore } from '../stores/UIStore'

export function ToastStack() {
  const toasts = useUIStore((s) => s.toasts)
  const dismiss = useUIStore((s) => s.dismissToast)
  if (toasts.length === 0) return null
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={'toast ' + t.tone}>
          <div style={{ flex: 1 }}>
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.message}</div>
          </div>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" style={{ background: 'transparent', border: 'none', color: '#6b7494', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
        </div>
      ))}
    </div>
  )
}