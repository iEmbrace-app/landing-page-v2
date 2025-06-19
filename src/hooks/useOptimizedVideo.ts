import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Video } from '../services/r2Service'
import { VideoService } from '../services/videoService'
import { OptimizedVideoCache } from '../utils/OptimizedVideoCache'

interface UseOptimizedVideoOptions {
  autoPreload?: boolean
  preloadCount?: number
  usePredictiveLoading?: boolean
  onVideoChange?: (videoId: string) => void
}

interface VideoState {
  videos: Video[]
  currentIndex: number
  loading: boolean
  error: string | null
  isTransitioning: boolean
  loadedVideos: Set<string>
}

export function useOptimizedVideo(options: UseOptimizedVideoOptions = {}) {
  const {
    autoPreload = true,
    preloadCount = 2,
    usePredictiveLoading = true,
    onVideoChange
  } = options

  const [state, setState] = useState<VideoState>({
    videos: [],
    currentIndex: 0,
    loading: true,
    error: null,
    isTransitioning: false,
    loadedVideos: new Set()
  })

  const transitionTimeoutRef = useRef<NodeJS.Timeout>()
  const intersectionObserverRef = useRef<IntersectionObserver>()
  const videoCache = useMemo(() => OptimizedVideoCache.getInstance(), [])

  // Memoized video URLs for current and adjacent videos
  const optimizedVideoUrls = useMemo(() => {
    const urls = new Map<string, string>()
    state.videos.forEach(video => {
      urls.set(video.id, video.url)
    })
    return urls
  }, [state.videos])

  // Load videos with observer pattern
  useEffect(() => {
    let mounted = true

    const videoObserver = (videos: Video[]) => {
      if (!mounted) return
      
      setState(prev => ({
        ...prev,
        videos,
        loading: false,
        error: null
      }))

      // Preload current and next videos
      if (autoPreload && videos.length > 0) {
        const currentVideo = videos[0]
        videoCache.preloadVideo(currentVideo.id, currentVideo.url).catch(console.warn)
        
        if (videos.length > 1) {
          videoCache.preloadVideo(videos[1].id, videos[1].url).catch(console.warn)
        }
      }
    }

    const loadVideos = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        VideoService.subscribe(videoObserver)
        await VideoService.fetchVideos()
      } catch (error) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load videos'
          }))
        }
      }
    }

    loadVideos()

    return () => {
      mounted = false
      VideoService.unsubscribe(videoObserver)
    }
  }, [autoPreload, videoCache])

  // Smart preloading based on current video
  useEffect(() => {
    if (!state.videos.length || !autoPreload) return

    const currentVideo = state.videos[state.currentIndex]
    if (!currentVideo) return

    // Preload adjacent videos
    const preloadIndices = []
    
    // Next videos
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = (state.currentIndex + i) % state.videos.length
      preloadIndices.push(nextIndex)
    }
    
    // Previous videos
    for (let i = 1; i <= Math.min(preloadCount, 2); i++) {
      const prevIndex = (state.currentIndex - i + state.videos.length) % state.videos.length
      preloadIndices.push(prevIndex)
    }

    // Predictive loading based on user behavior
    if (usePredictiveLoading) {
      const predictions = VideoService.predictNextVideos(currentVideo.id)
      predictions.forEach(videoId => {
        const videoIndex = state.videos.findIndex(v => v.id === videoId)
        if (videoIndex !== -1) {
          preloadIndices.push(videoIndex)
        }
      })
    }

    // Remove duplicates and current index
    const uniqueIndices = [...new Set(preloadIndices)].filter(idx => idx !== state.currentIndex)

    // Preload videos
    uniqueIndices.forEach(index => {
      const video = state.videos[index]
      if (video && !state.loadedVideos.has(video.id)) {
        videoCache.preloadVideo(video.id, video.url)
          .then(() => {
            setState(prev => ({
              ...prev,
              loadedVideos: new Set([...prev.loadedVideos, video.id])
            }))
          })
          .catch(console.warn)
      }
    })    // Trigger predictive preloading
    VideoService.preloadNextVideos(currentVideo.id, state.videos)
  }, [state.currentIndex, state.videos.length, autoPreload, preloadCount, usePredictiveLoading]) // Removed state.loadedVideos dependency
  // Optimized transition handler with debouncing
  const handleTransition = useCallback((newIndex: number) => {
    if (state.isTransitioning || newIndex === state.currentIndex || newIndex >= state.videos.length) {
      return
    }

    // Clear existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    // Update both index and transition state in single setState call
    setState(prev => ({ 
      ...prev, 
      isTransitioning: true,
      currentIndex: newIndex
    }))

    // Call video change callback
    const newVideo = state.videos[newIndex]
    if (newVideo && onVideoChange) {
      onVideoChange(newVideo.id)
    }

    // End transition after animation
    transitionTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }))
    }, 1200)
  }, [state.isTransitioning, state.currentIndex, state.videos, onVideoChange])

  // Navigation methods with bounds checking
  const goToNext = useCallback(() => {
    const nextIndex = (state.currentIndex + 1) % state.videos.length
    handleTransition(nextIndex)
  }, [state.currentIndex, state.videos.length, handleTransition])

  const goToPrev = useCallback(() => {
    const prevIndex = (state.currentIndex - 1 + state.videos.length) % state.videos.length
    handleTransition(prevIndex)
  }, [state.currentIndex, state.videos.length, handleTransition])

  const goToIndex = useCallback((index: number) => {
    handleTransition(index)
  }, [handleTransition])

  // Get optimized video URL
  const getOptimizedUrl = useCallback(async (videoId: string): Promise<string> => {
    const originalUrl = optimizedVideoUrls.get(videoId)
    if (!originalUrl) return ''

    try {
      return await VideoService.getOptimizedVideoUrl(videoId, originalUrl)
    } catch {
      return originalUrl // Fallback to original
    }
  }, [optimizedVideoUrls])

  // Intersection Observer for lazy loading when video comes into view
  const setVideoRef = useCallback((element: HTMLVideoElement | null, videoId: string) => {
    if (!element) return

    if (!intersectionObserverRef.current) {
      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const video = entry.target as HTMLVideoElement
              const id = video.dataset.videoId
              if (id && !state.loadedVideos.has(id)) {
                // Trigger preloading when video comes into view
                const videoData = state.videos.find(v => v.id === id)
                if (videoData) {
                  videoCache.preloadVideo(id, videoData.url).catch(console.warn)
                }
              }
            }
          })
        },
        { threshold: 0.1, rootMargin: '50px' }
      )
    }

    element.dataset.videoId = videoId
    intersectionObserverRef.current.observe(element)

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.unobserve(element)
      }
    }
  }, [state.videos, state.loadedVideos, videoCache])

  // Cleanup
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [])

  // Performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      cacheStats: videoCache.getCacheStats(),
      loadedVideos: state.loadedVideos.size,
      totalVideos: state.videos.length,
      currentVideo: state.videos[state.currentIndex]?.id || null
    }
  }, [videoCache, state.loadedVideos.size, state.videos, state.currentIndex])

  return {
    // State
    videos: state.videos,
    currentIndex: state.currentIndex,
    currentVideo: state.videos[state.currentIndex] || null,
    loading: state.loading,
    error: state.error,
    isTransitioning: state.isTransitioning,
    
    // Navigation
    goToNext,
    goToPrev,
    goToIndex,
    
    // Optimization
    getOptimizedUrl,
    setVideoRef,
    getPerformanceMetrics,
    
    // Utils
    isVideoLoaded: (videoId: string) => state.loadedVideos.has(videoId)
  }
}
