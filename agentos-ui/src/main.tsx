import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './design-system/theme/ThemeProvider'
import './design-system/theme/cssVariables.css'
import './design-system/theme/globalStyles.css'
import App from './App.tsx'

// Global error handler to display errors on screen
window.onerror = (msg, url, line, col, error) => {
  const el = document.getElementById('root')
  if (el) {
    el.innerHTML = `<div style="color:#ff4d6d;background:#0a0d1a;padding:24px;font-family:monospace;white-space:pre-wrap">
<b>JAVASCRIPT ERROR:</b>
${msg}
Line: ${line}:${col}
File: ${url}

${error?.stack || error?.message || 'No stack trace'}
</div>`
  }
  return false
}

window.addEventListener('unhandledrejection', (e) => {
  const el = document.getElementById('root')
  if (el) {
    el.innerHTML = `<div style="color:#ffb347;background:#0a0d1a;padding:24px;font-family:monospace;white-space:pre-wrap">
<b>UNHANDLED PROMISE REJECTION:</b>
${e.reason?.stack || e.reason?.message || String(e.reason)}
</div>`
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)