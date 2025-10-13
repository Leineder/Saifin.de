// Performance monitoring and Core Web Vitals
export function initPerformanceMonitoring() {
  // Measure Core Web Vitals
  if ('web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }

  // Custom performance marks
  performance.mark('app-start');
  
  // Measure resource loading times
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            firstByte: entry.responseStart - entry.requestStart
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
  }
}

// Image loading optimization
export function optimizeImageLoading() {
  // Add loading="lazy" to all images that don't have it
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // Add decoding="async" to all images
  const allImages = document.querySelectorAll('img:not([decoding])');
  allImages.forEach(img => {
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
}

// Preload critical resources
export function preloadCriticalResources() {
  // Preload next likely pages
  const criticalPages = ['/kreditkarten', '/broker', '/tagesgeld'];
  
  criticalPages.forEach(page => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    document.head.appendChild(link);
  });
}
