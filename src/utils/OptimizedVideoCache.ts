/**
 * Optimized Video Cache System
 * Uses LRU Cache + Priority Queue + Predictive Loading
 */

interface VideoMetadata {
  url: string
  blob?: Blob
  loadedAt: number
  accessCount: number
  lastAccessed: number
  preloadPriority: number
  loadingPromise?: Promise<Blob>
}

interface VideoAccessPattern {
  videoId: string
  accessTime: number
  viewDuration: number
}

export class OptimizedVideoCache {
  private static instance: OptimizedVideoCache
  private cache = new Map<string, VideoMetadata>()
  private maxCacheSize: number
  private accessPatterns: VideoAccessPattern[] = []
  private preloadQueue: PriorityQueue<string> // Priority queue for smart preloading
  private loadingStrategies: Map<string, LoadingStrategy>

  private constructor(maxCacheSize = 5) {
    this.maxCacheSize = maxCacheSize
    this.preloadQueue = new PriorityQueue((a, b) => 
      this.calculatePreloadPriority(b) - this.calculatePreloadPriority(a)
    )
    this.loadingStrategies = new Map()
    this.initializeLoadingStrategies()
  }

  static getInstance(maxCacheSize?: number): OptimizedVideoCache {
    if (!OptimizedVideoCache.instance) {
      OptimizedVideoCache.instance = new OptimizedVideoCache(maxCacheSize)
    }
    return OptimizedVideoCache.instance
  }

  private initializeLoadingStrategies() {
    this.loadingStrategies.set('eager', new EagerLoadingStrategy())
    this.loadingStrategies.set('lazy', new LazyLoadingStrategy())
    this.loadingStrategies.set('progressive', new ProgressiveLoadingStrategy())
  }

  async getVideo(videoId: string, url: string, strategy = 'progressive'): Promise<string> {
    const cached = this.cache.get(videoId)
    
    if (cached?.blob) {
      this.updateAccessPattern(videoId)
      return URL.createObjectURL(cached.blob)
    }

    // If already loading, wait for it
    if (cached?.loadingPromise) {
      const blob = await cached.loadingPromise
      return URL.createObjectURL(blob)
    }

    // Start loading with selected strategy
    const loadingStrategy = this.loadingStrategies.get(strategy) || this.loadingStrategies.get('progressive')!
    return await loadingStrategy.load(videoId, url, this)
  }

  async preloadVideo(videoId: string, url: string): Promise<void> {
    if (this.cache.has(videoId)) return

    const loadingPromise = this.loadVideoBlob(url)
    
    this.cache.set(videoId, {
      url,
      loadedAt: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      preloadPriority: this.calculatePreloadPriority(videoId),
      loadingPromise
    })

    try {
      const blob = await loadingPromise
      const metadata = this.cache.get(videoId)!
      metadata.blob = blob
      metadata.loadingPromise = undefined
      
      this.enforceMaxCacheSize()
    } catch (error) {
      console.warn(`Failed to preload video ${videoId}:`, error)
      this.cache.delete(videoId)
    }
  }

  private async loadVideoBlob(url: string): Promise<Blob> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load video: ${response.statusText}`)
    }
    return await response.blob()
  }

  private updateAccessPattern(videoId: string) {
    const metadata = this.cache.get(videoId)
    if (metadata) {
      metadata.accessCount++
      metadata.lastAccessed = Date.now()
    }

    // Store access pattern for ML-based prediction
    this.accessPatterns.push({
      videoId,
      accessTime: Date.now(),
      viewDuration: 0 // Will be updated when user switches
    })

    // Keep only recent patterns (last 100)
    if (this.accessPatterns.length > 100) {
      this.accessPatterns = this.accessPatterns.slice(-100)
    }
  }

  private calculatePreloadPriority(videoId: string): number {
    const metadata = this.cache.get(videoId)
    if (!metadata) return 0

    const accessFrequency = metadata.accessCount
    const recency = Date.now() - metadata.lastAccessed
    const sequentialProbability = this.calculateSequentialProbability(videoId)

    // Higher score = higher priority
    return accessFrequency * 2 + (1 / (recency + 1)) * 1000 + sequentialProbability * 3
  }

  private calculateSequentialProbability(videoId: string): number {
    // Simple ML: predict next video based on historical patterns
    const recentPatterns = this.accessPatterns.slice(-20)
    const transitions = new Map<string, number>()

    for (let i = 0; i < recentPatterns.length - 1; i++) {
      const current = recentPatterns[i].videoId
      const next = recentPatterns[i + 1].videoId
      const key = `${current}->${next}`
      transitions.set(key, (transitions.get(key) || 0) + 1)
    }

    const currentPatterns = Array.from(transitions.entries())
      .filter(([key]) => key.startsWith(videoId))
      .map(([_, count]) => count)

    return currentPatterns.length > 0 
      ? Math.max(...currentPatterns) / Math.max(1, recentPatterns.length)
      : 0
  }

  private enforceMaxCacheSize() {
    if (this.cache.size <= this.maxCacheSize) return

    // LRU eviction with priority consideration
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => {
        const priorityA = this.calculatePreloadPriority(a[0])
        const priorityB = this.calculatePreloadPriority(b[0])
        return priorityA - priorityB // Lower priority first
      })

    const toEvict = entries.slice(0, this.cache.size - this.maxCacheSize)
    
    for (const [videoId, metadata] of toEvict) {
      if (metadata.blob) {
        URL.revokeObjectURL(URL.createObjectURL(metadata.blob))
      }
      this.cache.delete(videoId)
    }
  }
  predictNextVideos(currentVideoId: string, count = 2): string[] {
    const predictions: Array<{ videoId: string; probability: number }> = []
    
    // Get all unique video IDs
    const allVideoIds = new Set(this.accessPatterns.map(p => p.videoId))
    
    for (const videoId of allVideoIds) {
      if (videoId !== currentVideoId) {
        predictions.push({
          videoId,
          probability: this.calculateSequentialProbability(videoId)
        })
      }
    }

    // Update preload queue with predictions
    predictions.forEach(pred => {
      this.preloadQueue.enqueue(pred.videoId)
    })

    return predictions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, count)
      .map(p => p.videoId)
  }

  clearCache() {
    for (const [_, metadata] of this.cache) {
      if (metadata.blob) {
        URL.revokeObjectURL(URL.createObjectURL(metadata.blob))
      }
    }
    this.cache.clear()
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      accessPatterns: this.accessPatterns.length,
      videos: Array.from(this.cache.keys())
    }
  }
}

// Priority Queue implementation
class PriorityQueue<T> {
  private items: T[] = []
  private compare: (a: T, b: T) => number

  constructor(compareFn: (a: T, b: T) => number) {
    this.compare = compareFn
  }

  enqueue(item: T) {
    this.items.push(item)
    this.bubbleUp(this.items.length - 1)
  }

  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined
    if (this.items.length === 1) return this.items.pop()

    const top = this.items[0]
    this.items[0] = this.items.pop()!
    this.bubbleDown(0)
    return top
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.compare(this.items[index], this.items[parentIndex]) <= 0) break
      
      this.swap(index, parentIndex)
      index = parentIndex
    }
  }

  private bubbleDown(index: number) {
    while (true) {
      const leftChild = 2 * index + 1
      const rightChild = 2 * index + 2
      let largest = index

      if (leftChild < this.items.length && 
          this.compare(this.items[leftChild], this.items[largest]) > 0) {
        largest = leftChild
      }

      if (rightChild < this.items.length && 
          this.compare(this.items[rightChild], this.items[largest]) > 0) {
        largest = rightChild
      }

      if (largest === index) break

      this.swap(index, largest)
      index = largest
    }
  }

  private swap(i: number, j: number) {
    [this.items[i], this.items[j]] = [this.items[j], this.items[i]]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

// Loading Strategy Pattern
abstract class LoadingStrategy {
  abstract load(videoId: string, url: string, cache: OptimizedVideoCache): Promise<string>
}

class EagerLoadingStrategy extends LoadingStrategy {
  async load(videoId: string, url: string, cache: OptimizedVideoCache): Promise<string> {
    await cache.preloadVideo(videoId, url)
    return cache.getVideo(videoId, url)
  }
}

class LazyLoadingStrategy extends LoadingStrategy {
  async load(_videoId: string, url: string): Promise<string> {
    // Just return the URL for lazy loading
    return url
  }
}

class ProgressiveLoadingStrategy extends LoadingStrategy {
  async load(videoId: string, url: string, cache: OptimizedVideoCache): Promise<string> {
    // Start loading but return URL immediately for progressive enhancement
    cache.preloadVideo(videoId, url).catch(console.warn)
    return url
  }
}
