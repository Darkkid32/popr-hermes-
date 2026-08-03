import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeRealtime, initializeOfflineQueue, initializeSyncManager, initializeNetworkDetector, initializeBackgroundRefresh } from './lib/integration'

// Initialize real-time systems
initializeRealtime()
initializeOfflineQueue()
initializeSyncManager()
initializeNetworkDetector()
initializeBackgroundRefresh()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
