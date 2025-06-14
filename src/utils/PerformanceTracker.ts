// Performance Measurement Utilities
// Comprehensive performance monitoring and verification

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null           // Largest Contentful Paint
  fid: number | null           // First Input Delay
  cls: number | null           // Cumulative Layout Shift
  
  // Additional Metrics
  fcp: number | null           // First Contentful Paint
  ttfb: number | null          // Time to First Byte
  loadTime: number             // Total load time
  domContentLoaded: number     // DOM ready time
  
  // Memory & Bundle
  memoryUsage: number          // JS heap size
  bundleSize: number           // Total bundle size
  
  // Service Worker
  swCacheHitRate: number       // Cache hit percentage
  swResponseTime: number       // Average SW response time
  
  // 3D Performance
  renderTime: number           // Three.js render time
  geometryCount: number        // Number of geometries
  drawCalls: number            // Render draw calls
  
  // Timestamp
  timestamp: number
}

export interface PerformanceReport {
  metrics: PerformanceMetrics
  score: number                // Overall performance score (0-100)
  recommendations: string[]
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

export class PerformanceTracker {
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []
  private lcpValue: number | null = null
  private fidValue: number | null = null
  private clsValue: number | null = null
  
  constructor() {
    this.initializeObservers()
    this.startMonitoring()
  }
  
  private initializeObservers(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.lcpValue = lastEntry.startTime
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
        this.observers.push(lcpObserver)
      } catch (e) {
        console.warn('LCP observer not supported:', e)
      }
        // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if ('processingStart' in entry) {
              this.fidValue = (entry as any).processingStart - entry.startTime
            }
          })
        })
        fidObserver.observe({ type: 'first-input', buffered: true })
        this.observers.push(fidObserver)
      } catch (e) {
        console.warn('FID observer not supported:', e)
      }
        // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsScore = 0
          list.getEntries().forEach((entry) => {
            if ('hadRecentInput' in entry && 'value' in entry) {
              const layoutShiftEntry = entry as any
              if (!layoutShiftEntry.hadRecentInput) {
                clsScore += layoutShiftEntry.value
              }
            }
          })
          this.clsValue = clsScore
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })
        this.observers.push(clsObserver)
      } catch (e) {
        console.warn('CLS observer not supported:', e)
      }
    }
  }
  
  private startMonitoring(): void {
    // Monitor every 30 seconds in development
    if (import.meta.env.DEV) {
      setInterval(() => {
        this.collectMetrics().then(metrics => {
          this.metrics.push(metrics)
          // Keep only last 20 measurements
          if (this.metrics.length > 20) {
            this.metrics = this.metrics.slice(-20)
          }
        })
      }, 30000)
    }
  }
  
  async collectMetrics(): Promise<PerformanceMetrics> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paintEntries = performance.getEntriesByType('paint')
    
    // Core Web Vitals
    const lcp = this.lcpValue
    const fid = this.fidValue
    const cls = this.clsValue
    
    // First Contentful Paint
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    const fcp = fcpEntry ? fcpEntry.startTime : null
    
    // Time to First Byte
    const ttfb = navigation ? navigation.responseStart - navigation.requestStart : null
      // Load times
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
    const domContentLoaded = navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0
    
    // Memory usage
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
    
    // Bundle size (approximate)
    const bundleSize = await this.estimateBundleSize()
    
    // Service Worker metrics
    const { swCacheHitRate, swResponseTime } = await this.measureServiceWorkerPerformance()
    
    // 3D Performance metrics
    const { renderTime, geometryCount, drawCalls } = this.measure3DPerformance()
    
    return {
      lcp,
      fid,
      cls,
      fcp,
      ttfb,
      loadTime,
      domContentLoaded,
      memoryUsage,
      bundleSize,
      swCacheHitRate,
      swResponseTime,
      renderTime,
      geometryCount,
      drawCalls,
      timestamp: Date.now()
    }
  }
  
  private async estimateBundleSize(): Promise<number> {
    try {
      const entries = performance.getEntriesByType('resource')
      let totalSize = 0
      
      entries.forEach(entry => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          totalSize += (entry as any).transferSize || 0
        }
      })
      
      return totalSize
    } catch {
      return 0
    }
  }
  
  private async measureServiceWorkerPerformance(): Promise<{ swCacheHitRate: number; swResponseTime: number }> {
    try {
      const resourceEntries = performance.getEntriesByType('resource')
      let cacheHits = 0
      let totalRequests = 0
      let totalResponseTime = 0
      
      resourceEntries.forEach(entry => {
        // Check if response came from Service Worker cache
        const transferSize = (entry as any).transferSize
        if (transferSize === 0 && entry.duration > 0) {
          cacheHits++
        }
        totalRequests++
        totalResponseTime += entry.duration
      })
      
      const swCacheHitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0
      const swResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0
      
      return { swCacheHitRate, swResponseTime }
    } catch {
      return { swCacheHitRate: 0, swResponseTime: 0 }
    }
  }
  
  private measure3DPerformance(): { renderTime: number; geometryCount: number; drawCalls: number } {
    try {
      // Access global Three.js performance metrics if available
      const threePerf = (window as any).__THREE_PERFORMANCE__
      if (threePerf) {
        return {
          renderTime: threePerf.renderTime || 0,
          geometryCount: threePerf.geometryCount || 0,
          drawCalls: threePerf.drawCalls || 0
        }
      }
    } catch {
      // Fallback measurement
    }
    
    return { renderTime: 0, geometryCount: 0, drawCalls: 0 }
  }
  
  generateReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        metrics: {} as PerformanceMetrics,
        score: 0,
        recommendations: ['No metrics collected yet'],
        grade: 'F'
      }
    }
    
    const latestMetrics = this.metrics[this.metrics.length - 1]
    const score = this.calculatePerformanceScore(latestMetrics)
    const recommendations = this.generateRecommendations(latestMetrics)
    const grade = this.calculateGrade(score)
    
    return {
      metrics: latestMetrics,
      score,
      recommendations,
      grade
    }
  }
  
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100
    
    // Core Web Vitals scoring
    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 25
      else if (metrics.lcp > 2500) score -= 15
      else if (metrics.lcp > 1500) score -= 5
    }
    
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 20
      else if (metrics.fid > 100) score -= 10
      else if (metrics.fid > 50) score -= 5
    }
    
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 20
      else if (metrics.cls > 0.1) score -= 10
      else if (metrics.cls > 0.05) score -= 5
    }
    
    // Load time scoring
    if (metrics.loadTime > 5000) score -= 15
    else if (metrics.loadTime > 3000) score -= 10
    else if (metrics.loadTime > 1000) score -= 5
    
    // Memory usage scoring
    const memoryMB = metrics.memoryUsage / 1024 / 1024
    if (memoryMB > 100) score -= 15
    else if (memoryMB > 50) score -= 10
    else if (memoryMB > 25) score -= 5
    
    // Service Worker cache hit rate bonus
    if (metrics.swCacheHitRate > 80) score += 5
    else if (metrics.swCacheHitRate > 60) score += 3
    
    return Math.max(0, Math.min(100, score))
  }
  
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = []
    
    // Core Web Vitals recommendations
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint: Consider image optimization, preloading critical resources')
    }
    
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Reduce First Input Delay: Consider code splitting, reducing JavaScript execution time')
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Minimize Cumulative Layout Shift: Set explicit dimensions for images and containers')
    }
    
    // Load time recommendations
    if (metrics.loadTime > 3000) {
      recommendations.push('Improve load time: Consider further bundle optimization, compression')
    }
    
    // Memory recommendations
    const memoryMB = metrics.memoryUsage / 1024 / 1024
    if (memoryMB > 50) {
      recommendations.push('Optimize memory usage: Review for memory leaks, implement object pooling')
    }
    
    // Service Worker recommendations
    if (metrics.swCacheHitRate < 60) {
      recommendations.push('Improve Service Worker cache strategy: Review caching policies for better hit rates')
    }
    
    // 3D Performance recommendations
    if (metrics.renderTime > 16) { // Target 60fps = 16.67ms per frame
      recommendations.push('Optimize 3D rendering: Consider LOD, frustum culling, or reducing geometry complexity')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! Continue monitoring for regressions.')
    }
    
    return recommendations
  }
  
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }
  
  logPerformanceReport(): void {
    const report = this.generateReport()
    
    console.group('🚀 Performance Report')
    console.log(`Overall Score: ${report.score}/100 (Grade: ${report.grade})`)
    
    if (report.metrics.lcp) console.log(`LCP: ${report.metrics.lcp.toFixed(2)}ms`)
    if (report.metrics.fid) console.log(`FID: ${report.metrics.fid.toFixed(2)}ms`)
    if (report.metrics.cls) console.log(`CLS: ${report.metrics.cls.toFixed(3)}`)
    if (report.metrics.fcp) console.log(`FCP: ${report.metrics.fcp.toFixed(2)}ms`)
    
    console.log(`Load Time: ${report.metrics.loadTime.toFixed(2)}ms`)
    console.log(`Memory Usage: ${(report.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`)
    console.log(`SW Cache Hit Rate: ${report.metrics.swCacheHitRate.toFixed(1)}%`)
    
    if (report.recommendations.length > 0) {
      console.group('📋 Recommendations:')
      report.recommendations.forEach(rec => console.log(`• ${rec}`))
      console.groupEnd()
    }
    
    console.groupEnd()
  }
  
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Global performance tracker instance
export const performanceTracker = new PerformanceTracker()

// Export for manual testing
if (import.meta.env.DEV) {
  (window as any).performanceTracker = performanceTracker
  
  // Log initial report after 5 seconds
  setTimeout(() => {
    performanceTracker.logPerformanceReport()
  }, 5000)
}
