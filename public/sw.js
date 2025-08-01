/* eslint-disable no-console */
// Pool Maintenance System - Service Worker
// Provides offline capability for field technicians
// Console logging is essential for service worker debugging

const CACHE_VERSION = 'pool-maintenance-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // We'll create this fallback page
];

// Dynamic assets patterns to cache
const CACHE_PATTERNS = [
  /\.(js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
  /\/assets\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (shouldCacheStaticAsset(request)) {
    // Cache-first strategy for static assets
    event.respondWith(cacheFirstStrategy(request));
  } else if (isPageRequest(request)) {
    // Network-first strategy for pages
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Default network-first for API calls and data
    event.respondWith(networkFirstStrategy(request));
  }
});

// Cache-first strategy: check cache first, fallback to network
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    // Not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Cached new asset:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache-first failed for:', request.url, error);
    // Return cached version if available, otherwise fail gracefully
    return caches.match(request) || new Response('Offline - Asset not available');
  }
}

// Network-first strategy: try network first, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Update cache with fresh content
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Updated cache from network:', request.url);
    }
    
    return networkResponse;
  } catch {
    console.log('[SW] Network failed for:', request.url, 'trying cache...');
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving stale content from cache:', request.url);
      return cachedResponse;
    }

    // No cache available, return offline page for navigation requests
    if (isPageRequest(request)) {
      return caches.match('/offline.html') || 
             new Response('Offline - Please check your connection');
    }
    
    // For other requests, return a generic offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This request requires an internet connection' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Helper functions
function shouldCacheStaticAsset(request) {
  const url = new URL(request.url);
  return CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isPageRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'pool-data-sync') {
    event.waitUntil(syncPoolData());
  }
});

// Sync offline data when connection is restored
async function syncPoolData() {
  try {
    console.log('[SW] Syncing offline pool data...');
    
    // Get offline data from IndexedDB (will be implemented with offline queue)
    const offlineData = await getOfflineData();
    
    if (offlineData.length === 0) {
      console.log('[SW] No offline data to sync');
      return;
    }

    // Sync each offline item
    for (const item of offlineData) {
      try {
        await syncSingleItem(item);
        await removeOfflineItem(item.id);
        console.log('[SW] Synced offline item:', item.id);
      } catch (error) {
        console.error('[SW] Failed to sync item:', item.id, error);
      }
    }
    
    // Notify all clients about successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        syncedItems: offlineData.length
      });
    });
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for offline data management
// These will be implemented when we add the offline queue
async function getOfflineData() {
  // TODO: Implement IndexedDB access for offline data
  return [];
}

async function syncSingleItem(item) {
  // TODO: Implement API sync for individual items
  console.log('Syncing item:', item);
}

async function removeOfflineItem(id) {
  // TODO: Implement removal from IndexedDB
  console.log('Removing offline item:', id);
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Received message:', event.data);
  
  const { type } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Clear all caches (useful for debugging)
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] All caches cleared');
}