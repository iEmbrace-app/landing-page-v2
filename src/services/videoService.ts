import { supabase, Video } from '../lib/supabase'
import { OptimizedVideoCache } from '../utils/OptimizedVideoCache'
import { PerformanceMonitor } from '../utils/PerformanceMonitor'

const VIDEO_BUCKET = 'videos'

// Known video files in the private storage bucket - Order: zen, forest, lake, campfire
const knownVideoFiles = [
  { file_path: 'zen.mp4', title: 'Garden', order_index: 1 },
  { file_path: 'forest.mp4', title: 'Forest', order_index: 2 },
  { file_path: 'lake.mp4', title: 'Lake', order_index: 3 },
  { file_path: 'campfire.mp4', title: 'Campfire', order_index: 4 }
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
            .createSignedUrl(video.file_path, 3600)
          
          let videoUrl: string
          
          if (urlError) {
            console.warn(`⚠️ Using local fallback for ${video.file_path}:`, urlError.message)
            videoUrl = `/videos/${video.file_path}`
          } else {
            videoUrl = signedUrlData.signedUrl
            console.log(`✅ Loaded ${video.file_path} from Supabase`)
          }

          const optimizedVideo: Video = {
            id: video.file_path,
            title: video.title,
            filename: video.file_path,
            url: videoUrl
          }          // Pre-cache first video immediately, others progressively
          if (video.file_path === 'zen.mp4') {
            await videoCache.preloadVideo(video.file_path, videoUrl)
          } else {
            // Progressive preloading for others
            videoCache.preloadVideo(video.file_path, videoUrl).catch(console.warn)
          }

          return optimizedVideo
        } catch (err) {
          console.error(`❌ Error processing ${video.file_path}:`, err)
          return {
            id: video.file_path,
            title: video.title,
            filename: video.file_path,
            url: `/videos/${video.file_path}`
          }
        }
      })

      const results = await Promise.allSettled(videoPromises)
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          videos.push(result.value)
        } else {
          console.error(`Failed to load video ${knownVideoFiles[index].file_path}:`, result.reason)
          // Add fallback
          videos.push({
            id: knownVideoFiles[index].file_path,
            title: knownVideoFiles[index].title,
            filename: knownVideoFiles[index].file_path,
            url: `/videos/${knownVideoFiles[index].file_path}`
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
        id: video.file_path,
        title: video.title,
        filename: video.file_path,
        url: `/videos/${video.file_path}`
      }))
    }
  }
}

export class VideoService {
  private static state = VideoServiceState.getInstance()
  static async fetchVideos(): Promise<Video[]> {
    // Always use Supabase video service for the private bucket
    console.log('🎥 Using Supabase video service...')
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
  }  static async getVideoByFilename(filename: string): Promise<Video | null> {
    try {
      const videoFile = knownVideoFiles.find(v => v.file_path === filename)
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
      return null    }
  }

  // Method to test Supabase storage connectivity
  static async testStorageConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.listBuckets()
      if (error) {
        console.error('❌ Storage connection test failed:', error)
        return false
      }
      return data.some(bucket => bucket.name === VIDEO_BUCKET)
    } catch (error) {
      console.error('❌ Storage connection test failed:', error)
      return false    }
  }
}

// Debug helper functions
export const VideoServiceDebug = {
  async testVideoAccess(filename: string): Promise<{ success: boolean, url?: string, error?: string }> {
    try {
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from(VIDEO_BUCKET)
        .createSignedUrl(filename, 3600)
      
      if (urlError) {
        return { success: false, error: urlError.message }
      }
      
      // Test if URL is accessible
      try {
        const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' })
        return { 
          success: response.ok, 
          url: signedUrlData.signedUrl,
          error: response.ok ? undefined : `HTTP ${response.status}`
        }      } catch (fetchError) {
        return { success: false, url: signedUrlData.signedUrl, error: String(fetchError) }
      }
      
    } catch (error) {
      return { success: false, error: String(error) }
    }
  },

  async listAllFiles(): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage
        .from(VIDEO_BUCKET)
        .list('', { limit: 100 })
      
      if (error) {
        console.error('❌ Error listing files:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('❌ Error listing files:', error)
      return []
    }
  }
}
