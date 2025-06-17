import { supabase, Video, VIDEO_BUCKET } from '../lib/supabase'
import { OptimizedVideoCache } from '../utils/OptimizedVideoCache'
import { PerformanceMonitor } from '../utils/PerformanceMonitor'

// Known video files in the storage bucket
const knownVideoFiles = [
  { filename: 'lake.mp4', title: 'LAKE' },
  { filename: 'forest.mp4', title: 'FOREST' },
  { filename: 'zen.mp4', title: 'ZEN GARDEN' },
  { filename: 'campfire.mp4', title: 'CAMPFIRE' }
]

// Singleton pattern for video service with observer pattern for state management
class VideoServiceState {
  private static instance: VideoServiceState
  private observers: Array<(videos: Video[]) => void> = []
  private cachedVideos: Video[] | null = null
  private loadingPromise: Promise<Video[]> | null = null

  static getInstance(): VideoServiceState {
    if (!VideoServiceState.instance) {
      VideoServiceState.instance = new VideoServiceState()
    }
    return VideoServiceState.instance
  }

  subscribe(observer: (videos: Video[]) => void) {
    this.observers.push(observer)
    if (this.cachedVideos) {
      observer(this.cachedVideos)
    }
  }

  unsubscribe(observer: (videos: Video[]) => void) {
    this.observers = this.observers.filter(obs => obs !== observer)
  }

  private notify(videos: Video[]) {
    this.cachedVideos = videos
    this.observers.forEach(observer => observer(videos))
  }

  async getVideos(): Promise<Video[]> {
    if (this.cachedVideos) {
      return this.cachedVideos
    }

    if (this.loadingPromise) {
      return this.loadingPromise
    }

    this.loadingPromise = this.loadVideosFromSource()
    const videos = await this.loadingPromise
    this.notify(videos)
    this.loadingPromise = null
    return videos
  }
  private async loadVideosFromSource(): Promise<Video[]> {
    try {
      console.log('🎥 Loading videos with optimization patterns...')
      
      const perfMonitor = PerformanceMonitor.getInstance()
      const endTimer = perfMonitor.startVideoLoadTimer('batch')
      
      const videoCache = OptimizedVideoCache.getInstance(6) // Cache up to 6 videos
      const videos: Video[] = []
      
      // Parallel loading with Promise.allSettled for better performance
      const videoPromises = knownVideoFiles.map(async (video) => {
        try {
          // Create signed URL for private bucket
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from(VIDEO_BUCKET)
            .createSignedUrl(video.filename, 3600)
          
          let videoUrl: string
          
          if (urlError) {
            console.warn(`⚠️ Using local fallback for ${video.filename}:`, urlError.message)
            videoUrl = `/videos/${video.filename}`
          } else {
            videoUrl = signedUrlData.signedUrl
            console.log(`✅ Loaded ${video.filename} from Supabase`)
          }

          const optimizedVideo: Video = {
            id: video.filename,
            title: video.title,
            filename: video.filename,
            url: videoUrl
          }

          // Pre-cache first video immediately, others progressively
          if (video.filename === 'lake.mp4') {
            await videoCache.preloadVideo(video.filename, videoUrl)
          } else {
            // Progressive preloading for others
            videoCache.preloadVideo(video.filename, videoUrl).catch(console.warn)
          }

          return optimizedVideo
        } catch (err) {
          console.error(`❌ Error processing ${video.filename}:`, err)
          return {
            id: video.filename,
            title: video.title,
            filename: video.filename,
            url: `/videos/${video.filename}`
          }
        }
      })

      const results = await Promise.allSettled(videoPromises)
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          videos.push(result.value)
        } else {
          console.error(`Failed to load video ${knownVideoFiles[index].filename}:`, result.reason)
          // Add fallback
          videos.push({
            id: knownVideoFiles[index].filename,
            title: knownVideoFiles[index].title,
            filename: knownVideoFiles[index].filename,
            url: `/videos/${knownVideoFiles[index].filename}`
          })
        }
      })      
      console.log('🎬 Optimized videos loaded:', videos.length)
      console.log('📊 Cache stats:', videoCache.getCacheStats())
      
      // Record performance metrics
      endTimer() // Records the batch load time
      perfMonitor.measureMemoryUsage()
      perfMonitor.logPerformanceSummary()
      
      return videos
      
    } catch (error) {
      console.error('❌ Error in loadVideosFromSource:', error)
      // Complete fallback to local videos
      console.log('🔄 Falling back to local videos')
      return knownVideoFiles.map(video => ({
        id: video.filename,
        title: video.title,
        filename: video.filename,
        url: `/videos/${video.filename}`
      }))
    }
  }
}

export class VideoService {
  private static state = VideoServiceState.getInstance()

  static async fetchVideos(): Promise<Video[]> {
    return this.state.getVideos()
  }

  static subscribe(observer: (videos: Video[]) => void) {
    this.state.subscribe(observer)
  }

  static unsubscribe(observer: (videos: Video[]) => void) {
    this.state.unsubscribe(observer)
  }

  static async getOptimizedVideoUrl(videoId: string, originalUrl: string): Promise<string> {
    const cache = OptimizedVideoCache.getInstance()
    return cache.getVideo(videoId, originalUrl, 'progressive')
  }

  static predictNextVideos(currentVideoId: string): string[] {
    const cache = OptimizedVideoCache.getInstance()
    return cache.predictNextVideos(currentVideoId, 2)
  }

  static preloadNextVideos(currentVideoId: string, videos: Video[]): void {
    const cache = OptimizedVideoCache.getInstance()
    const predictions = cache.predictNextVideos(currentVideoId, 2)
    
    predictions.forEach(videoId => {
      const video = videos.find(v => v.id === videoId)
      if (video) {
        cache.preloadVideo(videoId, video.url).catch(console.warn)
      }
    })
  }

  static async getVideoByFilename(filename: string): Promise<Video | null> {
    try {
      const videoFile = knownVideoFiles.find(v => v.filename === filename)
      if (!videoFile) return null
      
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from(VIDEO_BUCKET)
        .createSignedUrl(filename, 3600)
      
      if (urlError) {
        console.error(`❌ Error creating signed URL for ${filename}:`, urlError.message)
        return null
      }
      
      return {
        id: filename,
        title: videoFile.title,
        filename: filename,
        url: signedUrlData.signedUrl
      }
    } catch (error) {
      console.error('❌ Error in getVideoByFilename:', error)
      return null
    }
  }
}
