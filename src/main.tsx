import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Service Worker Registration for Performance Optimization
async function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('[SW] Service Worker registered successfully:', registration.scope)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, prompt user to refresh
              console.log('[SW] New service worker available - consider refreshing')
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
                '/src/utils/VideoManager.ts'
              ]
            }
          })
        }, 2000) // Cache after initial load
      }
      
    } catch (error) {
      console.warn('[SW] Service Worker registration failed:', error)
    }
  } else if (!import.meta.env.PROD) {
    console.log('[SW] Service Worker skipped in development mode')
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker after React app mounts
registerServiceWorker()
