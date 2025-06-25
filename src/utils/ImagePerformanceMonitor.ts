// Performance monitoring utilities for image loading

interface ImageMetrics {
  imageKey: string
  loadTime: number
  cacheHit: boolean
  size?: {
    naturalWidth: number
    naturalHeight: number
  }
}

class ImagePerformanceMonitor {
  private static instance: ImagePerformanceMonitor
  private metrics: Map<string, ImageMetrics> = new Map()
  private loadStartTimes: Map<string, number> = new Map()

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor()
    }
    return ImagePerformanceMonitor.instance
  }

  startTracking(imageKey: string): void {
    this.loadStartTimes.set(imageKey, performance.now())
  }

  endTracking(imageKey: string, element: HTMLImageElement, cacheHit: boolean = false): void {
    const startTime = this.loadStartTimes.get(imageKey)
    if (!startTime) return

    const loadTime = performance.now() - startTime
    
    const metrics: ImageMetrics = {
      imageKey,
      loadTime,
      cacheHit,
      size: {
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight
      }
    }

    this.metrics.set(imageKey, metrics)
    this.loadStartTimes.delete(imageKey)

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🖼️ Image loaded: ${imageKey}`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        cacheHit,
        size: `${element.naturalWidth}x${element.naturalHeight}`,
        element
      })
    }

    // Warn if load time is too high
    if (loadTime > 2000 && !cacheHit) {
      console.warn(`⚠️ Slow image load: ${imageKey} took ${loadTime.toFixed(2)}ms`)
    }
  }

  getMetrics(): Map<string, ImageMetrics> {
    return new Map(this.metrics)
  }

  getAverageLoadTime(): number {
    const times = Array.from(this.metrics.values()).map(m => m.loadTime)
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }

  getCacheHitRate(): number {
    const values = Array.from(this.metrics.values())
    if (values.length === 0) return 0
    
    const cacheHits = values.filter(m => m.cacheHit).length
    return (cacheHits / values.length) * 100
  }

  logSummary(): void {
    if (this.metrics.size === 0) {
      console.log('📊 No image metrics available')
      return
    }

    console.log('📊 Image Loading Performance Summary:')
    console.log(`  - Total images tracked: ${this.metrics.size}`)
    console.log(`  - Average load time: ${this.getAverageLoadTime().toFixed(2)}ms`)
    console.log(`  - Cache hit rate: ${this.getCacheHitRate().toFixed(1)}%`)
    
    // Show individual metrics
    this.metrics.forEach((metrics, key) => {
      console.log(`  - ${key}: ${metrics.loadTime.toFixed(2)}ms ${metrics.cacheHit ? '(cached)' : ''}`)
    })
  }
}

export const imagePerformanceMonitor = ImagePerformanceMonitor.getInstance()

// Auto-log summary after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      imagePerformanceMonitor.logSummary()
    }, 1000)
  })
}
