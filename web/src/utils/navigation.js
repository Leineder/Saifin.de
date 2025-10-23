// Navigation utilities for better error handling and performance

export const safeNavigate = (router, path, options = {}) => {
  try {
    return router.push(path, options)
  } catch (error) {
    console.error('Navigation error:', error)
    // Fallback to home page
    return router.push('/')
  }
}

export const safeReplace = (router, path, options = {}) => {
  try {
    return router.replace(path, options)
  } catch (error) {
    console.error('Navigation replace error:', error)
    // Fallback to home page
    return router.replace('/')
  }
}

// Preload route components for better performance
export const preloadRoute = async (routeName) => {
  try {
    switch (routeName) {
      case 'cards':
        return import('../views/Cards.vue')
      case 'brokers':
        return import('../views/Brokers.vue')
      case 'savings':
        return import('../views/Savings.vue')
      case 'guide':
        return import('../views/Guide.vue')
      case 'card-detail':
        return import('../views/CardDetail.vue')
      case 'broker-detail':
        return import('../views/BrokerDetail.vue')
      case 'savings-detail':
        return import('../views/SavingsDetail.vue')
      case 'guide-detail':
        return import('../views/GuideDetail.vue')
      default:
        return null
    }
  } catch (error) {
    console.warn('Failed to preload route:', routeName, error)
    return null
  }
}

// Check if a route exists and is accessible
export const isRouteAccessible = (router, path) => {
  try {
    const resolved = router.resolve(path)
    return resolved.matched.length > 0
  } catch (error) {
    console.warn('Route accessibility check failed:', path, error)
    return false
  }
}

// Retry navigation with exponential backoff
export const retryNavigation = async (router, path, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await router.push(path)
      return true
    } catch (error) {
      console.warn(`Navigation retry ${i + 1}/${maxRetries} failed:`, error)
      if (i === maxRetries - 1) {
        // Final fallback
        window.location.href = path
        return false
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 100))
    }
  }
  return false
}
