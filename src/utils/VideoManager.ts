/**
 * VideoManager - Ultra-lightweight video management with smart algorithms
 * Uses Observer, Strategy, and Factory patterns for optimal performance
 */

// Lightweight observer interface
interface VideoObserver {
  onVideoChange?(index: number): void
  onVideoLoaded?(index: number): void
  onVideoError?(index: number, error: Error): void
}

// Minimalist video configuration
interface VideoConfig {
  src: string
  poster: string
  alt: string
  priority: number
}

// Smart loading strategy based on device capabilities
class LoadingStrategy {
  private readonly isLowEnd: boolean
  private readonly hasSlowNetwork: boolean

  constructor() {
    // Detect device capabilities once
    this.isLowEnd = this.detectLowEndDevice()
    this.hasSlowNetwork = this.detectSlowNetwork()
  }

  shouldPreload(index: number, current: number, loaded: Set<number>): boolean {
    if (loaded.has(index)) return false
    
    const distance = Math.abs(index - current)
    const maxDistance = this.isLowEnd || this.hasSlowNetwork ? 1 : 2
    
    return distance <= maxDistance
  }

  getPriority(index: number, current: number): number {
    return Math.max(1, 5 - Math.abs(index - current))
  }

  getDelay(index: number, current: number): number {
    const baseDelay = Math.abs(index - current) * 800
    return this.hasSlowNetwork ? baseDelay * 1.5 : baseDelay
  }

  private detectLowEndDevice(): boolean {
    return 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4
  }

  private detectSlowNetwork(): boolean {
    if (!('connection' in navigator)) return false
    const conn = (navigator as any).connection
    return conn?.effectiveType?.includes('2g') || conn?.effectiveType?.includes('3g')
  }
}

// Lightweight LRU cache for video elements
class VideoCache {
  private cache = new Map<string, HTMLVideoElement>()
  private readonly maxSize: number

  constructor(maxSize = 4) {
    this.maxSize = maxSize
  }

  get(key: string): HTMLVideoElement | null {
    const video = this.cache.get(key)
    if (video) {
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, video)
      return video
    }
    return null
  }

  set(key: string, video: HTMLVideoElement): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used
      const firstEntry = this.cache.entries().next().value
      if (firstEntry) {
        const [firstKey, oldVideo] = firstEntry
        this.cache.delete(firstKey)
        this.cleanupVideo(oldVideo)
      }
    }
    
    this.cache.set(key, video)
  }

  private cleanupVideo(video: HTMLVideoElement): void {
    video.pause()
    video.removeAttribute('src')
    video.load()
  }

  clear(): void {
    this.cache.forEach(video => this.cleanupVideo(video))
    this.cache.clear()
  }
}

// Main video manager with smart resource management
export class VideoManager {
  private observers: VideoObserver[] = []
  private cache = new VideoCache()
  private strategy = new LoadingStrategy()
  private loadingQueue = new Set<number>()
  
  private currentIndex = 0
  private loadedVideos = new Set<number>([0])
  private videoElements = new Map<number, HTMLVideoElement>()

  constructor(private configs: VideoConfig[]) {}

  // Observer pattern implementation
  subscribe(observer: VideoObserver): () => void {
    this.observers.push(observer)
    return () => {
      const index = this.observers.indexOf(observer)
      if (index > -1) this.observers.splice(index, 1)
    }
  }

  private notify<T extends keyof VideoObserver>(
    method: T,
    ...args: Parameters<Required<VideoObserver>[T]>
  ): void {
    this.observers.forEach(observer => {
      try {
        const fn = observer[method]
        if (fn) {
          (fn as Function)(...args)
        }
      } catch (e) {
        console.warn('Observer notification failed:', e)
      }
    })
  }

  // Smart video creation with caching
  createVideo(index: number): HTMLVideoElement {
    const config = this.configs[index]
    const cacheKey = `video-${index}`
    
    let video = this.cache.get(cacheKey)
    if (!video) {
      video = this.createVideoElement(config, index)
      this.cache.set(cacheKey, video)
    }
    
    this.videoElements.set(index, video)
    return video
  }

  private createVideoElement(config: VideoConfig, index: number): HTMLVideoElement {
    const video = document.createElement('video')
    
    // Optimal video settings
    Object.assign(video, {
      muted: true,
      loop: true,
      playsInline: true,
      preload: 'none',
      poster: config.poster,
      'aria-label': config.alt
    })

    // Event listeners for state management
    video.addEventListener('loadeddata', () => {
      this.loadedVideos.add(index)
      this.loadingQueue.delete(index)
      this.notify('onVideoLoaded', index)
    }, { once: true })

    video.addEventListener('error', () => {
      this.loadingQueue.delete(index)
      this.notify('onVideoError', index, new Error('Video load failed'))
    }, { once: true })

    return video
  }

  // Smart preloading based on strategy
  preloadVideo(index: number): void {
    if (this.loadingQueue.has(index) || this.loadedVideos.has(index)) return
    
    if (!this.strategy.shouldPreload(index, this.currentIndex, this.loadedVideos)) return

    this.loadingQueue.add(index)
    
    setTimeout(() => {
      const video = this.createVideo(index)
      video.src = this.configs[index].src
      video.load()
    }, this.strategy.getDelay(index, this.currentIndex))
  }

  // Optimized video switching
  switchTo(index: number): void {
    if (index === this.currentIndex || index >= this.configs.length) return

    this.currentIndex = index
    this.notify('onVideoChange', index)

    // Smart preloading of next videos
    this.schedulePreloads()
  }

  private schedulePreloads(): void {
    // Use requestIdleCallback for non-blocking preloads
    const schedule = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 })
      } else {
        setTimeout(callback, 100)
      }
    }

    schedule(() => {
      const next = (this.currentIndex + 1) % this.configs.length
      const nextNext = (this.currentIndex + 2) % this.configs.length
      
      this.preloadVideo(next)
      this.preloadVideo(nextNext)
    })
  }

  // Getters for component state
  getCurrentIndex(): number { return this.currentIndex }
  getLoadedVideos(): Set<number> { return new Set(this.loadedVideos) }
  getVideoElement(index: number): HTMLVideoElement | undefined {
    return this.videoElements.get(index)
  }

  // Cleanup resources
  cleanup(): void {
    this.cache.clear()
    this.videoElements.clear()
    this.loadingQueue.clear()
    this.observers.length = 0
  }
}
