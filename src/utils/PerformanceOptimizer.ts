// Performance monitoring and optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private preloadedAssets = new Set<string>()
  
  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  /**
   * Preload critical resources with appropriate priority
   */
  preloadResource(href: string, as: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    if (this.preloadedAssets.has(href)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    
    // Set fetch priority if supported
    if ('fetchPriority' in link) {
      (link as any).fetchPriority = priority
    }
    
    // Add crossorigin for cross-origin resources
    if (href.includes('://') && !href.includes(window.location.origin)) {
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
    this.preloadedAssets.add(href)
  }

  /**
   * Prefetch resources that might be needed later
   */
  prefetchResource(href: string): void {
    if (this.preloadedAssets.has(href)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    
    document.head.appendChild(link)
    this.preloadedAssets.add(href)
  }

  /**
   * Get current page performance metrics
   */
  getPerformanceMetrics(): Record<string, number> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return {}

    return {
      // Core Web Vitals approximations
      firstContentfulPaint: this.getFirstContentfulPaint(),
      largestContentfulPaint: this.getLargestContentfulPaint(),
      
      // Loading metrics
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      
      // Network metrics
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpConnect: navigation.connectEnd - navigation.connectStart,
      
      // Resource timing
      totalPageSize: this.getTotalPageSize(),
      resourceCount: performance.getEntriesByType('resource').length
    }
  }

  private getFirstContentfulPaint(): number {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0]
    return fcpEntry ? fcpEntry.startTime : 0
  }

  private getLargestContentfulPaint(): number {
    // This would need to be implemented with PerformanceObserver in a real app
    return 0
  }

  private getTotalPageSize(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0)
    }, 0)
  }

  /**
   * Implement adaptive loading based on connection quality
   */
  shouldLoadHeavyAssets(): boolean {
    // Check connection quality
    const connection = (navigator as any).connection
    if (connection) {
      // Don't load heavy assets on slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return false
      }
      
      // Consider data saver mode
      if (connection.saveData) {
        return false
      }
    }
    
    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory
    if (deviceMemory && deviceMemory < 4) {
      return false // Low memory devices
    }
    
    return true
  }

  /**
   * Log performance metrics for monitoring
   */
  logPerformanceMetrics(): void {
    const metrics = this.getPerformanceMetrics()
    console.group('🚀 Performance Metrics')
    Object.entries(metrics).forEach(([key, value]) => {
      const formattedValue = typeof value === 'number' ? `${value.toFixed(2)}ms` : value
      console.log(`${key}: ${formattedValue}`)
    })
    console.groupEnd()
  }
}
