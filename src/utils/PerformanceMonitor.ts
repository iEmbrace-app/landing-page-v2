/**
 * Performance Monitoring Utility for Video Optimization
 * Tracks metrics and provides insights for optimization decisions
 */

interface PerformanceMetrics {
  videoLoadTime: number
  cacheHitRate: number
  memoryUsage: number
  networkRequests: number
  renderTime: number
  transitionTime: number
  userInteractionDelay: number
}

interface PerformanceThresholds {
  maxVideoLoadTime: number
  minCacheHitRate: number
  maxMemoryUsageMB: number
  maxRenderTime: number
  maxTransitionTime: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics[] = []
  private thresholds: PerformanceThresholds
  private observers: Array<(metrics: PerformanceMetrics) => void> = []

  private constructor() {
    this.thresholds = {
      maxVideoLoadTime: 3000, // 3 seconds
      minCacheHitRate: 0.8, // 80%
      maxMemoryUsageMB: 100, // 100MB
      maxRenderTime: 16.67, // 60fps = 16.67ms per frame
      maxTransitionTime: 1200 // 1.2 seconds
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startVideoLoadTimer(videoId: string): () => number {
    const startTime = performance.now()
    
    return () => {
      const loadTime = performance.now() - startTime
      this.recordMetric('videoLoadTime', loadTime)
      
      if (loadTime > this.thresholds.maxVideoLoadTime) {
        console.warn(`⚠️ Video ${videoId} took ${loadTime.toFixed(2)}ms to load (threshold: ${this.thresholds.maxVideoLoadTime}ms)`)
      } else {
        console.log(`✅ Video ${videoId} loaded in ${loadTime.toFixed(2)}ms`)
      }
      
      return loadTime
    }
  }

  measureRenderTime(renderFunction: () => void): number {
    const startTime = performance.now()
    renderFunction()
    const renderTime = performance.now() - startTime
    
    this.recordMetric('renderTime', renderTime)
    
    if (renderTime > this.thresholds.maxRenderTime) {
      console.warn(`⚠️ Slow render detected: ${renderTime.toFixed(2)}ms (target: ${this.thresholds.maxRenderTime}ms)`)
    }
    
    return renderTime
  }

  measureTransitionTime(transitionFunction: () => Promise<void>): Promise<number> {
    return new Promise(async (resolve) => {
      const startTime = performance.now()
      await transitionFunction()
      const transitionTime = performance.now() - startTime
      
      this.recordMetric('transitionTime', transitionTime)
      
      if (transitionTime > this.thresholds.maxTransitionTime) {
        console.warn(`⚠️ Slow transition: ${transitionTime.toFixed(2)}ms (target: ${this.thresholds.maxTransitionTime}ms)`)
      }
      
      resolve(transitionTime)
    })
  }

  recordCacheHit(_hit: boolean, totalRequests: number, hitCount: number) {
    const hitRate = hitCount / totalRequests
    this.recordMetric('cacheHitRate', hitRate)
    
    if (hitRate < this.thresholds.minCacheHitRate) {
      console.warn(`⚠️ Low cache hit rate: ${(hitRate * 100).toFixed(1)}% (target: ${(this.thresholds.minCacheHitRate * 100)}%)`)
    }
  }

  recordNetworkRequest() {
    this.recordMetric('networkRequests', 1)
  }

  measureMemoryUsage(): number {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      const usedMB = memInfo.usedJSHeapSize / 1024 / 1024
      
      this.recordMetric('memoryUsage', usedMB)
      
      if (usedMB > this.thresholds.maxMemoryUsageMB) {
        console.warn(`⚠️ High memory usage: ${usedMB.toFixed(2)}MB (threshold: ${this.thresholds.maxMemoryUsageMB}MB)`)
      }
      
      return usedMB
    }
    return 0
  }

  measureUserInteractionDelay(interactionFunction: () => void): number {
    const startTime = performance.now()
    
    // Schedule the function to run after current execution stack
    requestAnimationFrame(() => {
      interactionFunction()
      const delay = performance.now() - startTime
      this.recordMetric('userInteractionDelay', delay)
      
      if (delay > 100) { // 100ms is generally considered the threshold for "instant" response
        console.warn(`⚠️ User interaction delay: ${delay.toFixed(2)}ms`)
      }
    })
    
    return performance.now() - startTime
  }

  private recordMetric(key: keyof PerformanceMetrics, value: number) {
    const currentMetrics = this.getCurrentMetrics()
    currentMetrics[key] = value
    
    // Keep only last 50 metric snapshots
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-50)
    }
    
    this.notifyObservers(currentMetrics)
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const latest = this.metrics[this.metrics.length - 1]
    if (latest) {
      return { ...latest }
    }
    
    const newMetrics: PerformanceMetrics = {
      videoLoadTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      networkRequests: 0,
      renderTime: 0,
      transitionTime: 0,
      userInteractionDelay: 0
    }
    
    this.metrics.push(newMetrics)
    return newMetrics
  }

  subscribe(observer: (metrics: PerformanceMetrics) => void) {
    this.observers.push(observer)
  }

  unsubscribe(observer: (metrics: PerformanceMetrics) => void) {
    this.observers = this.observers.filter(obs => obs !== observer)
  }

  private notifyObservers(metrics: PerformanceMetrics) {
    this.observers.forEach(observer => observer(metrics))
  }

  getAverageMetrics(): PerformanceMetrics {
    if (this.metrics.length === 0) {
      return this.getCurrentMetrics()
    }

    const sums = this.metrics.reduce((acc, metrics) => {
      Object.keys(acc).forEach(key => {
        acc[key as keyof PerformanceMetrics] += metrics[key as keyof PerformanceMetrics]
      })
      return acc
    }, {
      videoLoadTime: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      networkRequests: 0,
      renderTime: 0,
      transitionTime: 0,
      userInteractionDelay: 0
    })

    const averages: PerformanceMetrics = {
      videoLoadTime: sums.videoLoadTime / this.metrics.length,
      cacheHitRate: sums.cacheHitRate / this.metrics.length,
      memoryUsage: sums.memoryUsage / this.metrics.length,
      networkRequests: sums.networkRequests / this.metrics.length,
      renderTime: sums.renderTime / this.metrics.length,
      transitionTime: sums.transitionTime / this.metrics.length,
      userInteractionDelay: sums.userInteractionDelay / this.metrics.length
    }

    return averages
  }

  generatePerformanceReport(): string {
    const averages = this.getAverageMetrics()
    const latest = this.metrics[this.metrics.length - 1] || averages

    return `
📊 PERFORMANCE REPORT
====================
Latest Metrics:
- Video Load Time: ${latest.videoLoadTime.toFixed(2)}ms
- Cache Hit Rate: ${(latest.cacheHitRate * 100).toFixed(1)}%
- Memory Usage: ${latest.memoryUsage.toFixed(2)}MB
- Network Requests: ${latest.networkRequests}
- Render Time: ${latest.renderTime.toFixed(2)}ms
- Transition Time: ${latest.transitionTime.toFixed(2)}ms
- User Interaction Delay: ${latest.userInteractionDelay.toFixed(2)}ms

Average Metrics (last ${this.metrics.length} snapshots):
- Avg Video Load Time: ${averages.videoLoadTime.toFixed(2)}ms
- Avg Cache Hit Rate: ${(averages.cacheHitRate * 100).toFixed(1)}%
- Avg Memory Usage: ${averages.memoryUsage.toFixed(2)}MB
- Avg Render Time: ${averages.renderTime.toFixed(2)}ms
- Avg Transition Time: ${averages.transitionTime.toFixed(2)}ms

Performance Status:
${this.getPerformanceStatus(latest)}
    `.trim()
  }

  private getPerformanceStatus(metrics: PerformanceMetrics): string {
    const issues: string[] = []
    
    if (metrics.videoLoadTime > this.thresholds.maxVideoLoadTime) {
      issues.push(`❌ Video loading too slow (${metrics.videoLoadTime.toFixed(2)}ms > ${this.thresholds.maxVideoLoadTime}ms)`)
    }
    
    if (metrics.cacheHitRate < this.thresholds.minCacheHitRate) {
      issues.push(`❌ Cache hit rate too low (${(metrics.cacheHitRate * 100).toFixed(1)}% < ${(this.thresholds.minCacheHitRate * 100)}%)`)
    }
    
    if (metrics.memoryUsage > this.thresholds.maxMemoryUsageMB) {
      issues.push(`❌ Memory usage too high (${metrics.memoryUsage.toFixed(2)}MB > ${this.thresholds.maxMemoryUsageMB}MB)`)
    }
    
    if (metrics.renderTime > this.thresholds.maxRenderTime) {
      issues.push(`❌ Render time too slow (${metrics.renderTime.toFixed(2)}ms > ${this.thresholds.maxRenderTime}ms)`)
    }
    
    if (metrics.transitionTime > this.thresholds.maxTransitionTime) {
      issues.push(`❌ Transition time too slow (${metrics.transitionTime.toFixed(2)}ms > ${this.thresholds.maxTransitionTime}ms)`)
    }

    if (issues.length === 0) {
      return "✅ All performance metrics within acceptable thresholds"
    }
    
    return issues.join('\n')
  }

  // Method to be called periodically to log performance summary
  logPerformanceSummary() {
    console.log(this.generatePerformanceReport())
  }

  // Clear metrics for fresh start
  clearMetrics() {
    this.metrics = []
  }
}
