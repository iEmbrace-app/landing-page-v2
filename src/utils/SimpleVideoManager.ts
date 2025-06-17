/**
 * Simple Video Manager - Optimized for 4 videos with smart preloading
 * No complex ML or caching - just efficient video management
 */

interface VideoState {
  url: string
  element?: HTMLVideoElement
  loaded: boolean
  loading: boolean
  error: boolean
}

export class SimpleVideoManager {  private static instance: SimpleVideoManager
  private videos = new Map<string, VideoState>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private currentVideoId: string | null = null
  private preloadPromises = new Map<string, Promise<void>>()

  private constructor() {}

  static getInstance(): SimpleVideoManager {
    if (!SimpleVideoManager.instance) {
      SimpleVideoManager.instance = new SimpleVideoManager()
    }
    return SimpleVideoManager.instance
  }

  // Register a video element with the manager
  registerVideo(id: string, url: string, element: HTMLVideoElement): void {
    this.videos.set(id, {
      url,
      element,
      loaded: false,
      loading: false,
      error: false
    })

    // Set up video element for optimal performance
    this.optimizeVideoElement(element)
  }

  private optimizeVideoElement(video: HTMLVideoElement): void {
    // Optimize video element settings
    video.preload = 'none' // Start with no preloading
    video.muted = true
    video.loop = true
    video.playsInline = true
    
    // Add performance optimizations
    video.style.willChange = 'opacity'
    video.style.transform = 'translateZ(0)' // Force GPU acceleration
    video.style.backfaceVisibility = 'hidden'
  }

  // Smart preloading: current video + next video only
  async preloadVideo(id: string): Promise<void> {
    const videoState = this.videos.get(id)
    if (!videoState || videoState.loaded || videoState.loading) {
      return
    }

    // Check if already preloading
    if (this.preloadPromises.has(id)) {
      return this.preloadPromises.get(id)!
    }

    const preloadPromise = this.performPreload(id, videoState)
    this.preloadPromises.set(id, preloadPromise)
    
    try {
      await preloadPromise
    } finally {
      this.preloadPromises.delete(id)
    }
  }

  private async performPreload(id: string, videoState: VideoState): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!videoState.element) {
        reject(new Error('No video element'))
        return
      }

      const video = videoState.element
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('Preload timeout'))
      }, 10000) // 10 second timeout

      const cleanup = () => {
        clearTimeout(timeout)
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onError)
      }

      const onCanPlay = () => {
        videoState.loaded = true
        videoState.loading = false
        cleanup()
        console.log(`✅ Video ${id} preloaded successfully`)
        resolve()
      }

      const onError = () => {
        videoState.error = true
        videoState.loading = false
        cleanup()
        console.warn(`❌ Video ${id} preload failed`)
        reject(new Error('Video load error'))
      }

      video.addEventListener('canplay', onCanPlay, { once: true })
      video.addEventListener('error', onError, { once: true })

      // Start preloading
      videoState.loading = true
      video.preload = 'auto'
      video.load()
    })
  }

  // Switch to a video efficiently
  async switchToVideo(id: string, videoIds: string[]): Promise<void> {
    this.currentVideoId = id
    
    // Ensure current video is preloaded
    await this.preloadVideo(id)
    
    // Preload next video in background
    const currentIndex = videoIds.indexOf(id)
    const nextIndex = (currentIndex + 1) % videoIds.length
    const nextVideoId = videoIds[nextIndex]
    
    // Preload next video without waiting
    this.preloadVideo(nextVideoId).catch(console.warn)

    // Unload videos that are 2+ positions away to save memory
    this.cleanupDistantVideos(videoIds, currentIndex)
  }

  private cleanupDistantVideos(videoIds: string[], currentIndex: number): void {
    videoIds.forEach((videoId, index) => {
      const distance = Math.min(
        Math.abs(index - currentIndex),
        videoIds.length - Math.abs(index - currentIndex)
      )
      
      // Unload videos that are more than 1 position away
      if (distance > 1) {
        this.unloadVideo(videoId)
      }
    })
  }

  private unloadVideo(id: string): void {
    const videoState = this.videos.get(id)
    if (!videoState || !videoState.element) return

    const video = videoState.element
    if (videoState.loaded) {
      video.preload = 'none'
      video.src = video.src // Trigger unload
      videoState.loaded = false
      console.log(`🗑️ Unloaded video ${id} to save memory`)
    }
  }

  // Get video state for debugging
  getVideoState(id: string): VideoState | undefined {
    return this.videos.get(id)
  }

  // Get current statistics
  getStats(): { loaded: number; loading: number; total: number } {
    let loaded = 0
    let loading = 0
    
    for (const state of this.videos.values()) {
      if (state.loaded) loaded++
      if (state.loading) loading++
    }

    return {
      loaded,
      loading,
      total: this.videos.size
    }
  }

  // Preload multiple videos in sequence (not parallel to avoid bandwidth issues)
  async preloadSequence(videoIds: string[]): Promise<void> {
    for (const id of videoIds) {
      try {
        await this.preloadVideo(id)
        // Small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.warn(`Failed to preload ${id}:`, error)
        // Continue with next video even if one fails
      }
    }
  }

  // Clear all video data
  clear(): void {
    this.videos.clear()
    this.preloadPromises.clear()
    this.currentVideoId = null
  }
}
