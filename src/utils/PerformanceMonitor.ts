/**
 * Performance monitoring utility for tracking app performance metrics
 * Provides FPS tracking, memory usage, and performance insights
 */
export class PerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private fpsHistory: number[] = []
  private maxHistoryLength = 60 // Track last 60 FPS samples

  // Memory tracking (when available)
  private memoryInfo = {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  }

  // Performance thresholds
  private readonly LOW_FPS_THRESHOLD = 45
  private readonly HIGH_FPS_THRESHOLD = 55
  private readonly MEMORY_WARNING_THRESHOLD = 0.8 // 80% of heap limit

  update(): void {
    this.frameCount++
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTime

    if (deltaTime >= 1000) { // Update every second
      this.fps = (this.frameCount * 1000) / deltaTime
      this.fpsHistory.push(this.fps)
      
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift()
      }

      this.frameCount = 0
      this.lastTime = currentTime

      // Update memory info if available
      this.updateMemoryInfo()
    }
  }

  private updateMemoryInfo(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.memoryInfo = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
    }
  }

  getFPS(): number {
    return Math.round(this.fps)
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return this.fps
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.fpsHistory.length)
  }

  getMinFPS(): number {
    if (this.fpsHistory.length === 0) return this.fps
    return Math.round(Math.min(...this.fpsHistory))
  }

  getMaxFPS(): number {
    if (this.fpsHistory.length === 0) return this.fps
    return Math.round(Math.max(...this.fpsHistory))
  }

  getPerformanceLevel(): 'low' | 'medium' | 'high' {
    const avgFPS = this.getAverageFPS()
    if (avgFPS < this.LOW_FPS_THRESHOLD) return 'low'
    if (avgFPS > this.HIGH_FPS_THRESHOLD) return 'high'
    return 'medium'
  }

  getMemoryUsage(): {
    used: number // MB
    total: number // MB
    limit: number // MB
    percentage: number // 0-1
    isWarning: boolean
  } {
    const bytesToMB = (bytes: number) => Math.round(bytes / 1024 / 1024)
    
    const used = bytesToMB(this.memoryInfo.usedJSHeapSize)
    const total = bytesToMB(this.memoryInfo.totalJSHeapSize)
    const limit = bytesToMB(this.memoryInfo.jsHeapSizeLimit)
    
    const percentage = limit > 0 ? used / limit : 0
    const isWarning = percentage > this.MEMORY_WARNING_THRESHOLD

    return { used, total, limit, percentage, isWarning }
  }

  getStabilityScore(): number {
    if (this.fpsHistory.length < 10) return 1 // Not enough data

    const avg = this.getAverageFPS()
    const variance = this.fpsHistory.reduce((sum, fps) => {
      return sum + Math.pow(fps - avg, 2)
    }, 0) / this.fpsHistory.length

    const standardDeviation = Math.sqrt(variance)
    
    // Stability score: lower deviation = higher stability
    // Score from 0 (very unstable) to 1 (very stable)
    const maxAcceptableDeviation = 10
    return Math.max(0, 1 - (standardDeviation / maxAcceptableDeviation))
  }

  getRecommendations(): string[] {
    const recommendations: string[] = []
    const perfLevel = this.getPerformanceLevel()
    const memory = this.getMemoryUsage()
    const stability = this.getStabilityScore()

    if (perfLevel === 'low') {
      recommendations.push('Consider reducing particle count or 3D quality settings')
      recommendations.push('Check for memory leaks or excessive object creation')
    }

    if (memory.isWarning) {
      recommendations.push('Memory usage is high - consider enabling object pooling')
      recommendations.push('Clear unused cached geometries or textures')
    }

    if (stability < 0.7) {
      recommendations.push('Frame rate is unstable - check for blocking operations')
      recommendations.push('Consider using animation scheduler frame budgeting')
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is optimal!')
    }

    return recommendations
  }
  getFullReport(): {
    fps: { current: number; average: number; min: number; max: number }
    memory: { used: number; total: number; limit: number }
    performance: {
      level: 'low' | 'medium' | 'high'
      stability: number
    }
    recommendations: string[]
  } {
    return {
      fps: {
        current: this.getFPS(),
        average: this.getAverageFPS(),
        min: this.getMinFPS(),
        max: this.getMaxFPS()
      },
      memory: this.getMemoryUsage(),
      performance: {
        level: this.getPerformanceLevel(),
        stability: this.getStabilityScore()
      },
      recommendations: this.getRecommendations()
    }
  }

  reset(): void {
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 60
    this.fpsHistory = []
  }
}

// Global performance monitor instance
export const globalPerformanceMonitor = new PerformanceMonitor()
