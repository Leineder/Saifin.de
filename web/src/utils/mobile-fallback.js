// mobile-fallback.js
// Fallback-Strategien für ältere mobile Browser

/**
 * Mobile Fallback-Manager für bessere Kompatibilität
 */
export class MobileFallbackManager {
  constructor() {
    this.isEnabled = typeof window !== 'undefined'
    this.fallbackMode = false
    
    if (this.isEnabled) {
      this.detectFallbackMode()
      this.initializeFallbacks()
    }
  }

  /**
   * Erkennt ob Fallback-Modus aktiviert werden muss
   */
  detectFallbackMode() {
    const userAgent = navigator.userAgent.toLowerCase()
    
    // Ältere mobile Browser erkennen
    const oldMobileBrowsers = [
      'android 4.',
      'android 5.',
      'android 6.',
      'iphone os 9_',
      'iphone os 10_',
      'iphone os 11_',
      'iphone os 12_',
      'windows phone',
      'blackberry',
      'opera mini'
    ]
    
    const isOldMobile = oldMobileBrowsers.some(browser => userAgent.includes(browser))
    
    // Prüfe Browser-Feature-Unterstützung
    const missingFeatures = []
    
    if (!('IntersectionObserver' in window)) missingFeatures.push('IntersectionObserver')
    if (!('Worker' in window)) missingFeatures.push('WebWorker')
    if (!('requestIdleCallback' in window)) missingFeatures.push('requestIdleCallback')
    if (!('connection' in navigator)) missingFeatures.push('ConnectionAPI')
    if (!('localStorage' in window)) missingFeatures.push('localStorage')
    
    this.fallbackMode = isOldMobile || missingFeatures.length > 2
    
    if (this.fallbackMode) {
      console.log('Fallback mode activated for mobile compatibility')
      console.log('Missing features:', missingFeatures)
    }
  }

  /**
   * Initialisiert Fallback-Strategien
   */
  initializeFallbacks() {
    if (!this.fallbackMode) return
    
    // Fallback für IntersectionObserver
    this.setupIntersectionObserverFallback()
    
    // Fallback für Web Workers
    this.setupWebWorkerFallback()
    
    // Fallback für requestIdleCallback
    this.setupRequestIdleCallbackFallback()
    
    // Fallback für Connection API
    this.setupConnectionAPIFallback()
    
    // Fallback für localStorage
    this.setupLocalStorageFallback()
  }

  /**
   * Fallback für IntersectionObserver
   */
  setupIntersectionObserverFallback() {
    if ('IntersectionObserver' in window) return
    
    // Einfache Scroll-basierte Intersection-Erkennung
    window.IntersectionObserver = class FallbackIntersectionObserver {
      constructor(callback, options = {}) {
        this.callback = callback
        this.options = options
        this.observedElements = new Set()
        this.isObserving = false
        
        this.scrollHandler = this.handleScroll.bind(this)
      }
      
      observe(element) {
        this.observedElements.add(element)
        if (!this.isObserving) {
          window.addEventListener('scroll', this.scrollHandler, { passive: true })
          this.isObserving = true
        }
        this.checkIntersection(element)
      }
      
      unobserve(element) {
        this.observedElements.delete(element)
        if (this.observedElements.size === 0 && this.isObserving) {
          window.removeEventListener('scroll', this.scrollHandler)
          this.isObserving = false
        }
      }
      
      disconnect() {
        this.observedElements.clear()
        if (this.isObserving) {
          window.removeEventListener('scroll', this.scrollHandler)
          this.isObserving = false
        }
      }
      
      handleScroll() {
        this.observedElements.forEach(element => {
          this.checkIntersection(element)
        })
      }
      
      checkIntersection(element) {
        const rect = element.getBoundingClientRect()
        const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isIntersecting) {
          this.callback([{
            target: element,
            isIntersecting: true,
            intersectionRatio: 1
          }])
        }
      }
    }
  }

  /**
   * Fallback für Web Workers
   */
  setupWebWorkerFallback() {
    if ('Worker' in window) return
    
    // Einfacher Fallback ohne Web Worker
    window.Worker = class FallbackWorker {
      constructor(scriptURL) {
        this.scriptURL = scriptURL
        this.onmessage = null
        this.onerror = null
        this.isTerminated = false
      }
      
      postMessage(data) {
        if (this.isTerminated) return
        
        // Simuliere Worker-Verhalten
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage({ data: { type: 'FALLBACK', data } })
          }
        }, 10)
      }
      
      terminate() {
        this.isTerminated = true
      }
    }
  }

  /**
   * Fallback für requestIdleCallback
   */
  setupRequestIdleCallbackFallback() {
    if ('requestIdleCallback' in window) return
    
    window.requestIdleCallback = (callback, options = {}) => {
      const timeout = options.timeout || 5000
      return setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => 16
        })
      }, Math.min(timeout, 100))
    }
    
    window.cancelIdleCallback = (id) => {
      clearTimeout(id)
    }
  }

  /**
   * Fallback für Connection API
   */
  setupConnectionAPIFallback() {
    if ('connection' in navigator) return
    
    // Simuliere Connection API
    Object.defineProperty(navigator, 'connection', {
      value: {
        effectiveType: '4g',
        type: 'wifi',
        downlink: 10,
        rtt: 50,
        saveData: false,
        addEventListener: () => {}
      },
      writable: false
    })
  }

  /**
   * Fallback für localStorage
   */
  setupLocalStorageFallback() {
    if ('localStorage' in window) return
    
    // Einfacher In-Memory-Storage
    const memoryStorage = new Map()
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key) => memoryStorage.get(key) || null,
        setItem: (key, value) => memoryStorage.set(key, value),
        removeItem: (key) => memoryStorage.delete(key),
        clear: () => memoryStorage.clear(),
        length: memoryStorage.size,
        key: (index) => Array.from(memoryStorage.keys())[index] || null
      },
      writable: false
    })
  }

  /**
   * Gibt Fallback-Status zurück
   */
  getFallbackStatus() {
    return {
      isEnabled: this.isEnabled,
      fallbackMode: this.fallbackMode,
      userAgent: navigator.userAgent,
      features: {
        IntersectionObserver: 'IntersectionObserver' in window,
        WebWorker: 'Worker' in window,
        requestIdleCallback: 'requestIdleCallback' in window,
        ConnectionAPI: 'connection' in navigator,
        localStorage: 'localStorage' in window
      }
    }
  }
}

// Singleton-Instanz
export const mobileFallbackManager = new MobileFallbackManager()

/**
 * Vue-Composable für Mobile Fallbacks
 */
export function useMobileFallback() {
  const getStatus = () => {
    return mobileFallbackManager.getFallbackStatus()
  }
  
  const isFallbackMode = () => {
    return mobileFallbackManager.fallbackMode
  }
  
  return {
    getStatus,
    isFallbackMode
  }
}

// Auto-Initialize
if (typeof window !== 'undefined') {
  console.log('Mobile Fallback Manager initialized:', mobileFallbackManager.getFallbackStatus())
}
