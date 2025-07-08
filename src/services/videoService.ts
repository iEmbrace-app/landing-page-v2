// Direct AWS S3 video URLs - all videos now hosted on AWS S3
const videoUrls = {
  'zen.mp4': 'https://iembrace-website-videos.s3.us-east-2.amazonaws.com/zen.mp4',
  'forest.mp4': 'https://iembrace-website-videos.s3.us-east-2.amazonaws.com/forest.mp4',
  'lake.mp4': 'https://iembrace-website-videos.s3.us-east-2.amazonaws.com/lake.mp4',
  'campfire.mp4': 'https://iembrace-website-videos.s3.us-east-2.amazonaws.com/campfire.mp4'
}

// Direct AWS S3 audio URLs
const audioUrls = {
  'zen.mp4': 'https://embrace-website-audio.s3.us-east-2.amazonaws.com/zengarden.mp3',
  'forest.mp4': 'https://embrace-website-audio.s3.us-east-2.amazonaws.com/forest.mp3',
  'lake.mp4': 'https://embrace-website-audio.s3.us-east-2.amazonaws.com/lake.mp3',
  'campfire.mp4': 'https://embrace-website-audio.s3.us-east-2.amazonaws.com/campfire.mp3'
}

// Video interface
export interface Video {
  id: string
  title: string
  filename: string
  url: string
  audioUrl: string
}

// Known video files - Order: zen, forest, lake, campfire
const knownVideoFiles = [
  { file_path: 'zen.mp4', title: 'Garden', order_index: 1 },
  { file_path: 'forest.mp4', title: 'Forest', order_index: 2 },
  { file_path: 'lake.mp4', title: 'Lake', order_index: 3 },
  { file_path: 'campfire.mp4', title: 'Campfire', order_index: 4 }
]

// Simplified video service class
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
      // Loading videos from AWS S3...
      
      const videos: Video[] = []

      // Create video objects using direct AWS S3 URLs
      for (const video of knownVideoFiles) {
        const videoUrl = videoUrls[video.file_path as keyof typeof videoUrls]
        const audioUrl = audioUrls[video.file_path as keyof typeof audioUrls]
        if (videoUrl && audioUrl) {
          // Using AWS S3 URLs for ${video.file_path}

          const videoObject: Video = {
            id: video.file_path,
            title: video.title,
            filename: video.file_path,
            url: videoUrl,
            audioUrl: audioUrl
          }

          videos.push(videoObject)
        } else {
          console.warn(`⚠️ No URLs found for ${video.file_path}`)
        }
      }

      // Sort by order index to maintain zen, forest, lake, campfire order
      videos.sort((a, b) => {
        const aIndex = knownVideoFiles.find(f => f.file_path === a.filename)?.order_index || 999
        const bIndex = knownVideoFiles.find(f => f.file_path === b.filename)?.order_index || 999
        return aIndex - bIndex
      })

      // Successfully loaded ${videos.length} videos from AWS S3
      return videos
    } catch (error) {
      console.error('❌ Error loading videos:', error)
      return []
    }
  }
}

// Singleton instance
const videoServiceState = VideoServiceState.getInstance()

// Main VideoService class - simplified for AWS S3 direct URLs
export class VideoService {
  static async fetchVideos(): Promise<Video[]> {
    // Using AWS S3 video service...
    return videoServiceState.getVideos()
  }

  static subscribe(observer: (videos: Video[]) => void) {
    videoServiceState.subscribe(observer)
  }

  static unsubscribe(observer: (videos: Video[]) => void) {
    videoServiceState.unsubscribe(observer)
  }

  static async getVideoByFilename(filename: string): Promise<Video | null> {
    try {
      const videos = await videoServiceState.getVideos()
      return videos.find(video => video.filename === filename) || null
    } catch (error) {
      console.error(`❌ Error getting video by filename ${filename}:`, error)
      return null
    }
  }

  // Get direct AWS S3 URL for a video file
  static getVideoUrl(filename: string): string {
    return videoUrls[filename as keyof typeof videoUrls] || ''
  }

  // Get direct AWS S3 URL for an audio file
  static getAudioUrl(filename: string): string {
    return audioUrls[filename as keyof typeof audioUrls] || ''
  }
}
