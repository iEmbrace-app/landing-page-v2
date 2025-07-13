import { useEffect } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
}

export const usePerformanceMonitor = (enabled = false) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    let frameCount = 0
    let lastTime = performance.now()
    let fps = 0

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        frameCount = 0
        lastTime = currentTime

        // Log performance metrics in development
        if (import.meta.env.DEV) {
          const metrics: PerformanceMetrics = {
            fps,
            renderTime: currentTime,
            memoryUsage: (performance as any).memory?.usedJSHeapSize
          }
          
          // Warn if performance is poor
          if (fps < 30) {
            console.warn('🐌 Poor FPS detected:', metrics)
          }
          
          // Log to console every 5 seconds
          if (Math.floor(currentTime / 5000) !== Math.floor(lastTime / 5000)) {
            console.log('📊 Performance metrics:', metrics)
          }
        }
      }
      
      requestAnimationFrame(measurePerformance)
    }

    requestAnimationFrame(measurePerformance)
  }, [enabled])
}

// Memory leak detector
export const useMemoryLeakDetector = (enabled = false) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const checkMemoryLeaks = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576)
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576)
        
        // Warn if memory usage is high
        if (usedMB > 100) {
          console.warn(`💾 High memory usage: ${usedMB}MB / ${totalMB}MB`)
        }
      }
    }

    const interval = setInterval(checkMemoryLeaks, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [enabled])
}
