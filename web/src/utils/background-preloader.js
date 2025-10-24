// background-preloader.js
// Web Workers für ultra-aggressives Background-Preloading

/**
 * Ultra-aggressives Background-Preloading mit Web Workers
 */
export class BackgroundPreloader {
  constructor() {
    this.worker = null
    this.isEnabled = typeof window !== 'undefined' && 'Worker' in window
    this.preloadedUrls = new Set()
    this.isInitialized = false
    
    if (this.isEnabled) {
      this.initializeWorker()
    }
  }

  /**
   * Initialisiert Web Worker für Background-Preloading
   */
  initializeWorker() {
    try {
      // Prüfe Web Worker-Unterstützung
      if (!('Worker' in window) || !('Blob' in window) || !('URL' in window)) {
        console.warn('Web Workers not supported, falling back to direct preloading')
        this.isEnabled = false
        return
      }
      
      // Erstelle Web Worker für Background-Preloading
      const workerCode = `
        // Web Worker für Background-Preloading
        const preloadedUrls = new Set();
        const maxConcurrent = 6; // Maximale gleichzeitige Requests
        let activeRequests = 0;
        const requestQueue = [];

        // Ultra-aggressives Preloading
        function aggressivePreload(url, options = {}) {
          return new Promise((resolve, reject) => {
            if (preloadedUrls.has(url)) {
              resolve({ url, cached: true });
              return;
            }

            if (activeRequests >= maxConcurrent) {
              requestQueue.push({ url, options, resolve, reject });
              return;
            }

            activeRequests++;
            preloadedUrls.add(url);

            // Fetch mit optimierten Headers
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s Timeout

            fetch(url, {
              method: 'HEAD', // Nur Header für Preloading
              mode: 'cors',
              credentials: 'omit',
              cache: 'force-cache',
              signal: controller.signal,
              headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=3600',
                'User-Agent': navigator.userAgent
              }
            })
            .then(response => {
              clearTimeout(timeoutId);
              activeRequests--;
              
              if (response.ok) {
                resolve({ 
                  url, 
                  status: response.status,
                  headers: Object.fromEntries(response.headers.entries()),
                  timestamp: Date.now()
                });
              } else {
                reject(new Error(\`HTTP \${response.status}\`));
              }
              
              // Verarbeite Queue
              processQueue();
            })
            .catch(error => {
              clearTimeout(timeoutId);
              activeRequests--;
              preloadedUrls.delete(url);
              reject(error);
              processQueue();
            });
          });
        }

        // Verarbeite Request-Queue
        function processQueue() {
          if (requestQueue.length > 0 && activeRequests < maxConcurrent) {
            const { url, options, resolve, reject } = requestQueue.shift();
            aggressivePreload(url, options).then(resolve).catch(reject);
          }
        }

        // Batch-Preloading
        function batchPreload(urls, options = {}) {
          return Promise.allSettled(
            urls.map(url => aggressivePreload(url, options))
          );
        }

        // Connection-Aware Preloading
        function connectionAwarePreload(urls, connectionType) {
          const maxConcurrent = connectionType === 'slow-2g' ? 2 : 
                               connectionType === '2g' ? 3 :
                               connectionType === '3g' ? 4 : 6;
          
          return batchPreload(urls, { maxConcurrent });
        }

        // Event-Handler
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'PRELOAD':
              aggressivePreload(data.url, data.options)
                .then(result => self.postMessage({ type: 'PRELOAD_SUCCESS', data: result }))
                .catch(error => self.postMessage({ type: 'PRELOAD_ERROR', data: { url: data.url, error: error.message } }));
              break;
              
            case 'BATCH_PRELOAD':
              batchPreload(data.urls, data.options)
                .then(results => self.postMessage({ type: 'BATCH_PRELOAD_SUCCESS', data: results }))
                .catch(error => self.postMessage({ type: 'BATCH_PRELOAD_ERROR', data: { error: error.message } }));
              break;
              
            case 'CONNECTION_AWARE_PRELOAD':
              connectionAwarePreload(data.urls, data.connectionType)
                .then(results => self.postMessage({ type: 'CONNECTION_AWARE_SUCCESS', data: results }))
                .catch(error => self.postMessage({ type: 'CONNECTION_AWARE_ERROR', data: { error: error.message } }));
              break;
              
            case 'GET_STATS':
              self.postMessage({ 
                type: 'STATS', 
                data: { 
                  preloadedCount: preloadedUrls.size,
                  activeRequests,
                  queueLength: requestQueue.length
                }
              });
              break;
          }
        };
      `
      
      const blob = new Blob([workerCode], { type: 'application/javascript' })
      this.worker = new Worker(URL.createObjectURL(blob))
      
      // Event-Handler für Worker
      this.worker.onmessage = this.handleWorkerMessage.bind(this)
      this.worker.onerror = this.handleWorkerError.bind(this)
      
      this.isInitialized = true
      console.log('Background Preloader Worker initialized')
    } catch (error) {
      console.warn('Failed to initialize Background Preloader Worker:', error)
    }
  }

  /**
   * Behandelt Worker-Nachrichten
   * @param {MessageEvent} event - Worker-Event
   */
  handleWorkerMessage(event) {
    const { type, data } = event.data
    
    switch (type) {
      case 'PRELOAD_SUCCESS':
        this.preloadedUrls.add(data.url)
        this.onPreloadSuccess(data)
        break
        
      case 'PRELOAD_ERROR':
        this.onPreloadError(data)
        break
        
      case 'BATCH_PRELOAD_SUCCESS':
        this.onBatchPreloadSuccess(data)
        break
        
      case 'STATS':
        this.onStatsUpdate(data)
        break
    }
  }

  /**
   * Behandelt Worker-Fehler
   * @param {ErrorEvent} error - Worker-Fehler
   */
  handleWorkerError(error) {
    console.warn('Background Preloader Worker error:', error)
  }

  /**
   * Preloaded URL im Background
   * @param {string} url - Die URL
   * @param {Object} options - Optionen
   */
  preload(url, options = {}) {
    if (!this.isInitialized || !this.worker) return
    
    this.worker.postMessage({
      type: 'PRELOAD',
      data: { url, options }
    })
  }

  /**
   * Batch-Preloading im Background
   * @param {Array} urls - Array von URLs
   * @param {Object} options - Optionen
   */
  batchPreload(urls, options = {}) {
    if (!this.isInitialized || !this.worker) return
    
    this.worker.postMessage({
      type: 'BATCH_PRELOAD',
      data: { urls, options }
    })
  }

  /**
   * Connection-Aware Preloading
   * @param {Array} urls - Array von URLs
   * @param {string} connectionType - Verbindungstyp
   */
  connectionAwarePreload(urls, connectionType) {
    if (!this.isInitialized || !this.worker) return
    
    this.worker.postMessage({
      type: 'CONNECTION_AWARE_PRELOAD',
      data: { urls, connectionType }
    })
  }

  /**
   * Ermittelt Verbindungstyp
   * @returns {string} - Verbindungstyp
   */
  getConnectionType() {
    if (!navigator.connection) return 'unknown'
    
    const connection = navigator.connection
    return connection.effectiveType || connection.type || 'unknown'
  }

  /**
   * Callback für erfolgreiches Preloading
   * @param {Object} data - Preload-Daten
   */
  onPreloadSuccess(data) {
    // Analytics-Tracking
    if (window.va) {
      window.va('track', 'background_preload_success', {
        url: data.url.substring(0, 50),
        status: data.status,
        cached: data.cached
      })
    }
  }

  /**
   * Callback für Preload-Fehler
   * @param {Object} data - Fehler-Daten
   */
  onPreloadError(data) {
    console.warn('Background preload failed:', data)
  }

  /**
   * Callback für Batch-Preload-Erfolg
   * @param {Array} results - Batch-Ergebnisse
   */
  onBatchPreloadSuccess(results) {
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    console.log(`Background batch preload: ${successful} successful, ${failed} failed`)
  }

  /**
   * Callback für Stats-Update
   * @param {Object} stats - Statistiken
   */
  onStatsUpdate(stats) {
    // Speichere Stats für Monitoring
    this.stats = stats
  }

  /**
   * Gibt aktuelle Statistiken zurück
   * @returns {Object} - Statistiken
   */
  getStats() {
    if (!this.worker) return { error: 'Worker not initialized' }
    
    this.worker.postMessage({ type: 'GET_STATS' })
    return this.stats || { preloadedCount: 0, activeRequests: 0, queueLength: 0 }
  }

  /**
   * Beendet den Worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      this.isInitialized = false
    }
  }
}

// Singleton-Instanz
export const backgroundPreloader = new BackgroundPreloader()

/**
 * Vue-Composable für Background-Preloading
 * @returns {Object} - Background-Preloading-Funktionen
 */
export function useBackgroundPreloading() {
  const preload = (url, options) => {
    backgroundPreloader.preload(url, options)
  }
  
  const batchPreload = (urls, options) => {
    backgroundPreloader.batchPreload(urls, options)
  }
  
  const connectionAwarePreload = (urls) => {
    const connectionType = backgroundPreloader.getConnectionType()
    backgroundPreloader.connectionAwarePreload(urls, connectionType)
  }
  
  const getStats = () => {
    return backgroundPreloader.getStats()
  }
  
  return {
    preload,
    batchPreload,
    connectionAwarePreload,
    getStats
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  // Initialisiere nach DOM-Content-Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Background Preloader initialized:', backgroundPreloader.getStats())
    })
  } else {
    console.log('Background Preloader initialized:', backgroundPreloader.getStats())
  }
}
