// This file won't be directly used but contains the service worker logic
// that should be incorporated into your existing service worker

// Cache API routes for offline use
const API_CACHE = 'diagnostic-center-api-cache-v1';
const STATIC_CACHE = 'diagnostic-center-static-cache-v1';

// API routes to cache
const API_ROUTES = [
  '/api/patients',
  '/api/memos',
  '/api/expenses',
  '/api/assets',
  '/api/expenseTypes',
];

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/patients',
  '/memos',
  '/expenses',
  '/assets',
  // Add other important routes
];

// Install event - cache essential files
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(API_CACHE)
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return (
              cacheName !== STATIC_CACHE &&
              cacheName !== API_CACHE
            );
          })
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url);
  
  // Handle API requests (use network first, then cache)
  if (API_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          caches.open(API_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Handle static assets (use cache first, then network)
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response to store in cache
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(error => {
          console.error('Fetch error:', error);
          // For navigation, return the offline page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
    })
  );
}); 