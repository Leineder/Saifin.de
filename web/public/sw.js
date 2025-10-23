// Service Worker für aggressives Caching
const CACHE_NAME = 'saifin-v1.0.0';
const STATIC_CACHE = 'saifin-static-v1.0.0';
const DYNAMIC_CACHE = 'saifin-dynamic-v1.0.0';

// Kritische Ressourcen die sofort gecacht werden sollen
const CRITICAL_RESOURCES = [
  '/',
  '/kreditkarten',
  '/broker',
  '/tagesgeld',
  '/fonts/inter/inter-400.woff2',
  '/fonts/inter/inter-600.woff2',
  '/fonts/inter/inter-700.woff2',
  '/fonts/cinzel/cinzel-800.woff2',
  '/images/landing-hero.webp',
  '/images/saifin_logo_vectorized_final.svg'
];

// Affiliate-Link-Domains für DNS-Prefetch-Caching
const AFFILIATE_DOMAINS = [
  'www.financeads.net',
  'financeads.net'
];

// Affiliate-Link-Cache-Strategien
const AFFILIATE_CACHE_STRATEGIES = {
  // Kurzes Caching für Affiliate-Links (5 Minuten)
  SHORT_CACHE: 5 * 60 * 1000, // 5 Minuten
  // Mittleres Caching für häufig verwendete Links (15 Minuten)
  MEDIUM_CACHE: 15 * 60 * 1000, // 15 Minuten
  // Langes Caching für statische Affiliate-Seiten (1 Stunde)
  LONG_CACHE: 60 * 60 * 1000 // 1 Stunde
};

// Install Event - Cache kritische Ressourcen
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('SW: Install complete');
        return self.skipWaiting();
      })
  );
});

// Activate Event - Cleanup alte Caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Activate complete');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Aggressive Caching-Strategie
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nur HTTPS und nicht Chrome-Extensions
  if (!request.url.startsWith('http') || url.protocol === 'chrome-extension:') {
    return;
  }

  // Spezielle Behandlung für Affiliate-Links
  if (isAffiliateLink(request)) {
    event.respondWith(handleAffiliateLink(request));
    return;
  }

  // Strategie: Cache First für statische Assets
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategie: Stale While Revalidate für HTML/API
  if (isHTMLRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Strategie: Network First für andere Requests
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => {
      // Network failed, return cached if available
      return cachedResponse || new Response('Offline', { status: 503 });
    });
    
    // Return cached immediately if available, otherwise wait for network
    return cachedResponse || await fetchPromise;
  } catch (error) {
    console.log('SW: Stale while revalidate failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network first failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Helper Functions
function isStaticAsset(request) {
  return request.url.includes('/assets/') ||
         request.url.includes('/images/') ||
         request.url.includes('/fonts/') ||
         request.url.includes('.css') ||
         request.url.includes('.js') ||
         request.url.includes('.woff2') ||
         request.url.includes('.webp') ||
         request.url.includes('.svg');
}

function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html') ||
         request.url.endsWith('/') ||
         request.url.includes('/kreditkarten') ||
         request.url.includes('/broker') ||
         request.url.includes('/tagesgeld');
}

// Affiliate-Link-Handling
function isAffiliateLink(request) {
  const url = new URL(request.url);
  return AFFILIATE_DOMAINS.some(domain => url.hostname.includes(domain));
}

async function handleAffiliateLink(request) {
  const url = new URL(request.url);
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Prüfe zuerst den Cache
  const cachedResponse = await cache.match(request);
  const now = Date.now();
  
  // Wenn gecachte Response vorhanden und noch nicht abgelaufen
  if (cachedResponse) {
    const cacheTime = cachedResponse.headers.get('sw-cache-time');
    if (cacheTime && (now - parseInt(cacheTime)) < AFFILIATE_CACHE_STRATEGIES.SHORT_CACHE) {
      console.log('SW: Serving cached affiliate link');
      return cachedResponse;
    }
  }
  
  // Für Affiliate-Links: Network First mit optimierter Performance
  try {
    // Erstelle optimierte Request mit besseren Headers
    const optimizedRequest = new Request(request.url, {
      method: request.method,
      headers: {
        ...request.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (compatible; SaifinBot/1.0)'
      },
      mode: 'cors',
      credentials: 'omit'
    });

    const networkResponse = await fetch(optimizedRequest);
    
    // Cache die Response mit Zeitstempel
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cache-time', now.toString());
      responseToCache.headers.set('Cache-Control', 'max-age=300'); // 5 Minuten
      cache.put(request, responseToCache);
      
      console.log('SW: Cached affiliate link response');
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Affiliate link failed, trying cache:', error);
    
    // Fallback: Versuche gecachte Version (auch wenn abgelaufen)
    if (cachedResponse) {
      console.log('SW: Serving stale cached affiliate link');
      return cachedResponse;
    }
    
    // Letzter Fallback: Redirect zur Hauptseite
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/'
      }
    });
  }
}
