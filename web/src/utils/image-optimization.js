// image-optimization.js
// Mobile-spezifische Bild-Optimierungen für Kreditkarten

/**
 * Mobile Bild-Optimierungen für Kreditkarten
 */
export class MobileImageOptimizer {
  constructor() {
    this.isMobile = this.detectMobile()
    this.isEnabled = typeof window !== 'undefined'
    this.imageCache = new Map()
    
    if (this.isEnabled) {
      this.initializeImageOptimizations()
    }
  }

  /**
   * Erkennt mobile Geräte
   * @returns {boolean} - True wenn mobile
   */
  detectMobile() {
    if (typeof window === 'undefined') return false
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           ('ontouchstart' in window)
  }

  /**
   * Initialisiert Bild-Optimierungen
   */
  initializeImageOptimizations() {
    // Lazy Loading optimieren
    this.optimizeLazyLoading()
    
    // Bild-Caching optimieren
    this.optimizeImageCaching()
    
    // Mobile-spezifische Bild-Größen
    this.optimizeImageSizes()
    
    // Preloading für kritische Bilder
    this.preloadCriticalImages()
  }

  /**
   * Optimiert Lazy Loading für mobile Geräte
   */
  optimizeLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, using fallback lazy loading')
      this.fallbackLazyLoading()
      return
    }
    
    // Mobile-optimierte Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          this.loadImage(img)
          imageObserver.unobserve(img)
        }
      })
    }, {
      // Mobile-optimierte Thresholds
      rootMargin: this.isMobile ? '50px' : '100px',
      threshold: this.isMobile ? 0.1 : 0.2
    })
    
    // Beobachte alle Kreditkarten-Bilder
    document.querySelectorAll('.card-image').forEach(img => {
      imageObserver.observe(img)
    })
  }

  /**
   * Fallback Lazy Loading für ältere Browser
   */
  fallbackLazyLoading() {
    // Einfaches Scroll-basiertes Lazy Loading
    const loadVisibleImages = () => {
      const images = document.querySelectorAll('.card-image[data-src]')
      images.forEach(img => {
        const rect = img.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.loadImage(img)
        }
      })
    }
    
    // Initial load
    loadVisibleImages()
    
    // Load on scroll
    window.addEventListener('scroll', loadVisibleImages, { passive: true })
  }

  /**
   * Lädt Bild mit Optimierungen
   * @param {HTMLImageElement} img - Das Bild-Element
   */
  loadImage(img) {
    if (img.dataset.src) {
      // Mobile-spezifische Bild-URL
      const optimizedSrc = this.getOptimizedImageUrl(img.dataset.src)
      
      // Preload mit optimierter URL
      const preloadImg = new Image()
      preloadImg.onload = () => {
        img.src = optimizedSrc
        img.classList.add('loaded')
        this.imageCache.set(img.dataset.src, optimizedSrc)
      }
      preloadImg.onerror = () => {
        // Fallback auf Original
        img.src = img.dataset.src
      }
      preloadImg.src = optimizedSrc
    }
  }

  /**
   * Gibt optimierte Bild-URL für mobile Geräte zurück
   * @param {string} originalSrc - Originale Bild-URL
   * @returns {string} - Optimierte Bild-URL
   */
  getOptimizedImageUrl(originalSrc) {
    if (this.isMobile) {
      try {
        // Mobile-spezifische Optimierungen
        const url = new URL(originalSrc, window.location.origin)
        
        // WebP-Format für mobile Geräte
        if (this.supportsWebP()) {
          url.searchParams.set('format', 'webp')
        }
        
        // Mobile-optimierte Größe
        url.searchParams.set('w', '280') // Optimale Breite für mobile
        url.searchParams.set('h', '176') // Optimale Höhe für mobile
        url.searchParams.set('q', '85') // Qualität für mobile
        
        return url.toString()
      } catch (error) {
        console.warn('URL construction failed, using original src:', error)
        return originalSrc
      }
    }
    
    return originalSrc
  }

  /**
   * Prüft WebP-Unterstützung
   * @returns {boolean} - True wenn WebP unterstützt wird
   */
  supportsWebP() {
    if (typeof window === 'undefined') return false
    
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    } catch (error) {
      console.warn('WebP detection failed:', error)
      return false
    }
  }

  /**
   * Optimiert Bild-Caching
   */
  optimizeImageCaching() {
    // Service Worker für Bild-Caching
    if ('serviceWorker' in navigator) {
      this.setupImageCaching()
    }
  }

  /**
   * Setup für Bild-Caching
   */
  setupImageCaching() {
    // Cache-Strategien für Bilder
    const cacheStrategies = {
      // Kreditkarten-Bilder: Aggressives Caching
      creditCardImages: {
        cacheName: 'credit-card-images-v1',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
        maxEntries: 50
      },
      
      // Mobile-optimierte Bilder: Längeres Caching
      mobileImages: {
        cacheName: 'mobile-images-v1',
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 Tage
        maxEntries: 100
      }
    }
    
    // Speichere Cache-Strategien (mit Fallback)
    try {
      localStorage.setItem('imageCacheStrategies', JSON.stringify(cacheStrategies))
    } catch (error) {
      console.warn('localStorage not available:', error)
    }
  }

  /**
   * Optimiert Bild-Größen für mobile Geräte
   */
  optimizeImageSizes() {
    if (!this.isMobile) return
    
    // Mobile-spezifische CSS für Bilder
    const style = document.createElement('style')
    style.textContent = `
      /* Mobile Bild-Optimierungen */
      @media (max-width: 768px) {
        .card-image {
          max-width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
          object-position: center !important;
        }
        
        .card-image-container {
          max-width: 280px !important;
          margin: 0 auto !important;
          aspect-ratio: 1.586 / 1 !important;
        }
        
        /* Volle Opacity für klare Farben */
        .card-image {
          opacity: 1 !important;
        }
        
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Preloaded kritische Bilder
   */
  preloadCriticalImages() {
    if (!this.isMobile) return
    
    // Preloaded Top 3 Kreditkarten-Bilder
    setTimeout(() => {
      this.preloadTopCardImages()
    }, 2000)
  }

  /**
   * Preloaded Top-Kreditkarten-Bilder
   */
  async preloadTopCardImages() {
    try {
      const { offers } = await import('../data/offers.js')
      
      // Top 3 Kreditkarten-Bilder
      const topOffers = offers.slice(0, 3)
      
      topOffers.forEach(offer => {
        if (offer.image) {
          this.preloadImage(offer.image)
        }
      })
      
      console.log('Top card images preloaded for mobile')
    } catch (error) {
      console.warn('Failed to preload top card images:', error)
    }
  }

  /**
   * Preloaded ein einzelnes Bild
   * @param {string} src - Bild-URL
   */
  preloadImage(src) {
    const optimizedSrc = this.getOptimizedImageUrl(src)
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = optimizedSrc
    link.fetchPriority = 'high'
    
    document.head.appendChild(link)
    
    // Entferne nach 30 Sekunden
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }, 30000)
  }

  /**
   * Optimiert Bild-Performance
   * @param {string} src - Bild-URL
   * @returns {string} - Optimierte Bild-URL
   */
  optimizeImagePerformance(src) {
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src)
    }
    
    const optimizedSrc = this.getOptimizedImageUrl(src)
    this.imageCache.set(src, optimizedSrc)
    
    return optimizedSrc
  }

  /**
   * Gibt Mobile-Status zurück
   * @returns {boolean} - True wenn mobile
   */
  isMobileDevice() {
    return this.isMobile
  }

  /**
   * Gibt Bild-Cache-Statistiken zurück
   * @returns {Object} - Cache-Statistiken
   */
  getImageCacheStats() {
    return {
      isMobile: this.isMobile,
      cacheSize: this.imageCache.size,
      cachedImages: Array.from(this.imageCache.keys()),
      supportsWebP: this.supportsWebP()
    }
  }
}

// Singleton-Instanz
export const mobileImageOptimizer = new MobileImageOptimizer()

/**
 * Vue-Composable für mobile Bild-Optimierungen
 * @returns {Object} - Bild-Optimierungs-Funktionen
 */
export function useMobileImageOptimization() {
  const isMobile = () => {
    return mobileImageOptimizer.isMobileDevice()
  }
  
  const getCacheStats = () => {
    return mobileImageOptimizer.getImageCacheStats()
  }
  
  const optimizeImage = (src) => {
    return mobileImageOptimizer.optimizeImagePerformance(src)
  }
  
  const preloadImage = (src) => {
    mobileImageOptimizer.preloadImage(src)
  }
  
  return {
    isMobile,
    getCacheStats,
    optimizeImage,
    preloadImage
  }
}

// Auto-Initialize wenn in Browser-Umgebung
if (typeof window !== 'undefined') {
  // Initialisiere nach DOM-Content-Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Mobile Image Optimizer initialized:', mobileImageOptimizer.getImageCacheStats())
    })
  } else {
    console.log('Mobile Image Optimizer initialized:', mobileImageOptimizer.getImageCacheStats())
  }
}
