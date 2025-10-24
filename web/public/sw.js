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

// RADIKALE AFFILIATE-LINK-DOMAINS für aggressives Caching
const AFFILIATE_DOMAINS = [
  'www.financeads.net',
  'financeads.net',
  'www.hanseaticbank.de',
  'www.tfbank.de',
  'www.netkredit24.de',
  'www.santander.de',
  'www.consorsfinanz.de',
  'www.1822direkt.de',
  'www.extrakarte.de',
  'www.captrader.de',
  'www.smartbroker.de',
  'www.fidelity.de',
  'www.brokerpoint.de',
  'www.finanzen.net',
  'www.fonds-super-markt.de',
  'www.quirion.de',
  'www.etoro.com',
  'www.pbb-direkt.de',
  'www.distingo.de',
  'www.raisin.com',
  'www.jt-direktbank.de',
  'www.comdirect.de'
];

// RADIKALE AFFILIATE-LINK-CACHE-STRATEGIEN für maximale Geschwindigkeit
const AFFILIATE_CACHE_STRATEGIES = {
  // Aggressives Caching für Affiliate-Links (30 Minuten)
  AGGRESSIVE_CACHE: 30 * 60 * 1000, // 30 Minuten
  // Mittleres Caching für häufig verwendete Links (1 Stunde)
  MEDIUM_CACHE: 60 * 60 * 1000, // 1 Stunde
  // Langes Caching für statische Affiliate-Seiten (4 Stunden)
  LONG_CACHE: 4 * 60 * 60 * 1000, // 4 Stunden
  // Ultra-langes Caching für kritische Links (24 Stunden)
  ULTRA_CACHE: 24 * 60 * 60 * 1000, // 24 Stunden
  // MOBILE-SPEZIFISCHE CACHE-STRATEGIEN
  MOBILE_AGGRESSIVE_CACHE: 60 * 60 * 1000, // 1 Stunde für mobile
  MOBILE_ULTRA_CACHE: 48 * 60 * 60 * 1000 // 48 Stunden für mobile
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

// ULTRA-AGGRESSIVE FETCH EVENT mit Background-Sync
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nur HTTPS und nicht Chrome-Extensions
  if (!request.url.startsWith('http') || url.protocol === 'chrome-extension:') {
    return;
  }

  // ULTRA-AGGRESSIVE Behandlung für Affiliate-Links
  if (isAffiliateLink(request)) {
    event.respondWith(handleUltraAggressiveAffiliateLink(request));
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

async function handleUltraAggressiveAffiliateLink(request) {
  const url = new URL(request.url);
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Prüfe zuerst den Cache
  const cachedResponse = await cache.match(request);
  const now = Date.now();
  
  // ULTRA-AGGRESSIVE Cache-Check mit längerer Lebensdauer
  if (cachedResponse) {
    const cacheTime = cachedResponse.headers.get('sw-cache-time');
    if (cacheTime && (now - parseInt(cacheTime)) < AFFILIATE_CACHE_STRATEGIES.MOBILE_AGGRESSIVE_CACHE) {
      console.log('SW: Serving cached affiliate link (ULTRA-AGGRESSIVE)');
      return cachedResponse;
    }
  }
  
  // ULTRA-AGGRESSIVE Network First mit maximaler Performance
  try {
    // ULTRA-OPTIMIERTE Request mit maximalen Headers
    const optimizedRequest = new Request(request.url, {
      method: request.method,
      headers: {
        ...request.headers,
        'Cache-Control': 'max-age=3600',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (compatible; SaifinBot/1.0)'
      },
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow'
    });

    // ULTRA-AGGRESSIVE Network Request mit Timeout
    const networkResponse = await Promise.race([
      fetch(optimizedRequest),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]);
    
    // ULTRA-AGGRESSIVE Caching mit längerer Lebensdauer
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cache-time', now.toString());
      responseToCache.headers.set('sw-cache-duration', '3600'); // 1 Stunde
      responseToCache.headers.set('Cache-Control', 'max-age=3600'); // 1 Stunde
      cache.put(request, responseToCache);
      
      // Background-Sync für weitere Optimierungen
      self.registration.sync.register('affiliate-link-sync').catch(() => {});
      
      console.log('SW: Cached affiliate link response (ULTRA-AGGRESSIVE)');
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Affiliate link failed, trying cache (ULTRA-AGGRESSIVE):', error);
    
    // ULTRA-AGGRESSIVE Fallback-Strategien
    if (cachedResponse) {
      console.log('SW: Serving stale cached affiliate link (ULTRA-AGGRESSIVE)');
      return cachedResponse;
    }
    
    // Versuche alternative URL
    const alternativeResponse = await tryAlternativeUrl(request);
    if (alternativeResponse) {
      return alternativeResponse;
    }
    
    // Letzter Fallback: Optimierte Offline-Seite
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Saifin</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>Offline</h1>
          <p>Die Seite ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.</p>
          <script>
            // Auto-Retry nach 5 Sekunden
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          </script>
        </body>
      </html>
    `, { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Versuche alternative URL
async function tryAlternativeUrl(request) {
  try {
    const url = new URL(request.url);
    
    // Versuche HTTP statt HTTPS oder umgekehrt
    if (url.protocol === 'https:') {
      url.protocol = 'http:';
    } else {
      url.protocol = 'https:';
    }
    
    const alternativeRequest = new Request(url.toString(), {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit'
    });
    
    const response = await fetch(alternativeRequest);
    if (response.ok) {
      return response;
    }
  } catch (error) {
    // Ignoriere Fehler
  }
  
  return null;
}
