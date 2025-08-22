import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import './index.css'
import Privacy from './pages/Privacy'

// Service Worker Registration for Performance Optimization
async function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      // Service Worker registered successfully: ${registration.scope}
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, prompt user to refresh
              // New service worker available - consider refreshing
            }
          })
        }
      })      // Pre-cache critical assets after app loads
      if (registration.active) {
        setTimeout(() => {
          registration.active?.postMessage({
            type: 'CACHE_ASSETS',
            payload: {
              assets: [
                // No additional assets to cache
              ]
            }
          })
        }, 2000) // Cache after initial load
      }
      
    } catch (error) {
      console.warn('[SW] Service Worker registration failed:', error)
    }
  } else if (!import.meta.env.PROD) {
    // Service Worker skipped in development mode
  }
}

function Router() {
  const [hash, setHash] = useState<string>(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Treat hashes with "#/" as routed pages; otherwise render the landing sections app
  const routePath = hash.startsWith('#/') ? hash.slice(2) : ''
  const base = routePath.split(/[?#]/)[0]

  switch (base) {
    case 'privacy':
      return <Privacy />
    default:
      return <App />
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Register service worker after React app mounts
registerServiceWorker()
