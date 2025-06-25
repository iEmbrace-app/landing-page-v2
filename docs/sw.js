// Service Worker for Wellness Meditation App
// Caches 3D assets and critical resources for improved performance

const CACHE_NAME = 'wellness-meditation-v1'
const STATIC_CACHE_NAME = 'wellness-static-v1'
const DYNAMIC_CACHE_NAME = 'wellness-dynamic-v1'

// Critical resources to cache immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/App.css',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap',
  // Icons and images
  '/src/assets/icons/ripple.svg',
  '/src/assets/icons/mindfulness 1.svg',
  '/src/assets/icons/sine.svg'
]

// 3D assets that benefit from caching
const THREE_JS_ASSETS = [
  // Three.js core files will be cached dynamically
  // Textures and geometry data will be cached as they're requested
]

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching critical assets')
        return cache.addAll(CRITICAL_ASSETS.filter(url => !url.startsWith('http')))
      }),
      // Pre-cache fonts separately to handle CORS
      caches.open(STATIC_CACHE_NAME).then(async (cache) => {
        const fontUrls = CRITICAL_ASSETS.filter(url => url.includes('fonts.googleapis.com'))
        for (const url of fontUrls) {
          try {
            const response = await fetch(url, { mode: 'cors' })
            if (response.ok) {
              await cache.put(url, response)
            }
          } catch (error) {
            console.warn('[SW] Failed to cache font:', url, error)
          }
        }
      })
    ]).then(() => {
      console.log('[SW] Service worker installed successfully')
      // Skip waiting to activate immediately
      return self.skipWaiting()
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('wellness-') && 
              !cacheName.includes('v1')
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Service worker activated successfully')
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Handle different types of resources with appropriate strategies
  if (shouldCacheResource(url)) {
    event.respondWith(handleCachedResource(request))
  }
})

// Determine if a resource should be cached
function shouldCacheResource(url) {
  // Skip Chrome extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return false
  }
  
  // Skip external APIs that change frequently
  if (url.hostname !== location.hostname && !isTrustedExternalResource(url)) {
    return false
  }
  
  return true
}

// Check if external resource is trusted and should be cached
function isTrustedExternalResource(url) {
  const trustedDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'unpkg.com',
    'cdn.jsdelivr.net'
  ]
  
  return trustedDomains.some(domain => url.hostname.includes(domain))
}

// Handle cached resources with appropriate strategy
async function handleCachedResource(request) {
  const url = new URL(request.url)
  
  // Strategy 1: Cache First (for static assets)
  if (isStaticAsset(url)) {
    return cacheFirst(request, STATIC_CACHE_NAME)
  }
  
  // Strategy 2: Stale While Revalidate (for 3D assets and chunks)
  if (isThreeJSAsset(url) || isAppChunk(url)) {
    return staleWhileRevalidate(request, DYNAMIC_CACHE_NAME)
  }
  
  // Strategy 3: Network First (for HTML and API calls)
  if (isHTMLResource(url)) {
    return networkFirst(request, DYNAMIC_CACHE_NAME)
  }
  
  // Default: Network only
  return fetch(request)
}

// Check if resource is a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.svg', '.png', '.jpg', '.jpeg', '.webp']
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.includes('/assets/') ||
         url.hostname.includes('fonts.g')
}

// Check if resource is Three.js related
function isThreeJSAsset(url) {
  return url.pathname.includes('three') ||
         url.pathname.includes('fiber') ||
         url.pathname.includes('drei') ||
         url.pathname.includes('three-components') ||
         url.pathname.includes('utils')
}

// Check if resource is an app chunk
function isAppChunk(url) {
  return url.pathname.includes('/assets/') && url.pathname.endsWith('.js')
}

// Check if resource is HTML
function isHTMLResource(url) {
  return url.pathname.endsWith('.html') || 
         url.pathname === '/' ||
         !url.pathname.includes('.')
}

// Cache First Strategy - for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Optionally update cache in background for static assets
      if (shouldUpdateInBackground(request)) {
        updateCacheInBackground(request, cache)
      }
      return cachedResponse
    }
    
    // Not in cache, fetch and cache
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
    
  } catch (error) {
    console.warn('[SW] Cache first failed:', error)
    return fetch(request)
  }
}

// Stale While Revalidate Strategy - for 3D assets
async function staleWhileRevalidate(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    // Always fetch in background to update cache
    const networkPromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    }).catch(() => {
      // Network failed, that's ok for this strategy
    })
    
    // Return cached version immediately if available
    if (cachedResponse) {
      // Don't await the network update
      networkPromise
      return cachedResponse
    }
    
    // No cached version, wait for network
    return await networkPromise || new Response('Network error', { status: 408 })
    
  } catch (error) {
    console.warn('[SW] Stale while revalidate failed:', error)
    return fetch(request)
  }
}

// Network First Strategy - for HTML and dynamic content
async function networkFirst(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request, { 
      headers: { 'Cache-Control': 'no-cache' } 
    })
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
    
  } catch (error) {
    // Network failed, try cache
    console.warn('[SW] Network first failed, trying cache:', error.message)
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page or error
    return new Response('Offline - please check your connection', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Check if static asset should be updated in background
function shouldUpdateInBackground(request) {
  const url = new URL(request.url)
  // Update fonts and icons occasionally
  return url.pathname.includes('font') || url.pathname.includes('icon')
}

// Update cache in background without blocking response
function updateCacheInBackground(request, cache) {
  fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
  }).catch(() => {
    // Background update failed, that's ok
  })
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
      
    case 'CACHE_ASSETS':
      cacheSpecificAssets(payload.assets).then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
  }
})

// Clear all caches (for debugging)
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  return Promise.all(
    cacheNames
      .filter(name => name.startsWith('wellness-'))
      .map(name => caches.delete(name))
  )
}

// Cache specific assets on demand
async function cacheSpecificAssets(assets) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME)
  return Promise.all(
    assets.map(async (asset) => {
      try {
        const response = await fetch(asset)
        if (response.ok) {
          await cache.put(asset, response)
        }
      } catch (error) {
        console.warn('[SW] Failed to cache asset:', asset, error)
      }
    })
  )
}
