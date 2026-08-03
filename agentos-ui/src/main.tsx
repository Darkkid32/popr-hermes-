import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize real-time systems after React renders
async function initializeRealtimeSystems() {
  try {
    const { initializeRealtime, initializeOfflineQueue, initializeSyncManager, initializeNetworkDetector, initializeBackgroundRefresh } = await import('./lib/integration')
    initializeRealtime()
    initializeOfflineQueue()
    initializeSyncManager()
    initializeNetworkDetector()
    initializeBackgroundRefresh()
  } catch (error) {
    console.warn('Realtime systems initialization failed:', error)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Defer initialization until after first paint
if (typeof requestIdleCallback !== 'undefined') {
  requestIdleCallback(initializeRealtimeSystems)
} else {
  setTimeout(initializeRealtimeSystems, 0)
}
