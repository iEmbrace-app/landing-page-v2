/**
 * useVideoBackground - Ultra-lightweight hook for video management
 * Implements smart algorithms with minimal overhead
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { VideoManager } from '../utils/VideoManager'

interface VideoConfig {
  src: string
  poster: string
  alt: string
  priority: number
  duration?: number // Custom duration for each video
}

interface UseVideoBackgroundOptions {
  autoAdvance?: boolean
  isMobile?: boolean
}

export function useVideoBackground(
  configs: VideoConfig[], 
  options: UseVideoBackgroundOptions = {}
) {
  const { autoAdvance = true, isMobile = false } = options
  
  // Memoized video manager to prevent recreations
  const videoManager = useMemo(() => new VideoManager(configs), [configs])
  
  // Minimal state management
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0]))
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Refs for cleanup and debouncing
  const timerRef = useRef<number>()
  const lastSwitchRef = useRef(0)
  const isVisibleRef = useRef(true)

  // Subscribe to video manager events
  useEffect(() => {
    const unsubscribe = videoManager.subscribe({
      onVideoChange: (index) => {
        setCurrentIndex(index)
      },
      onVideoLoaded: (index) => {
        setLoadedVideos(prev => new Set([...prev, index]))
      },
      onVideoError: (index, error) => {
        console.warn(`Video ${index} load error:`, error)
      }
    })

    return () => {
      unsubscribe()
      videoManager.cleanup()
    }  }, [videoManager])
  // Effect to handle video switching and playing
  useEffect(() => {
    const allVideos = document.querySelectorAll('.heroVideo') as NodeListOf<HTMLVideoElement>
    
    // Pause all videos and reset their positions
    allVideos.forEach((video, index) => {
      video.pause()
      if (index === currentIndex) {
        video.classList.add('active')
        video.classList.remove('inactive')
      } else {
        video.classList.remove('active')
        video.classList.add('inactive')
      }
    })
    
    // Play the current active video after a short delay
    const timer = setTimeout(() => {
      const activeVideo = allVideos[currentIndex]
      if (activeVideo) {
        activeVideo.currentTime = 0
        const playPromise = activeVideo.play()
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Video play failed:', error)
            // Fallback: try to play without resetting currentTime
            activeVideo.play().catch(err => console.log('Second play attempt failed:', err))
          })
        }
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [currentIndex])

  // Optimized video switching with debouncing
  const switchToVideo = useCallback((index: number) => {
    const now = Date.now()
    if (now - lastSwitchRef.current < 300) return // Debounce
    
    lastSwitchRef.current = now
    
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true)
      videoManager.switchTo(index)
      
      // Use RAF for smooth transition timing
      requestAnimationFrame(() => {
        setTimeout(() => setIsTransitioning(false), 300)
      })
    }
  }, [currentIndex, isTransitioning, videoManager])
  // Smart auto-advance with configurable timing like Nike
  useEffect(() => {
    if (!autoAdvance || !isVisibleRef.current) return

    // Use custom duration from video config or default
    const currentVideo = configs[currentIndex]
    const duration = currentVideo?.duration || 8000 // Default 8 seconds
    
    timerRef.current = window.setTimeout(() => {
      const nextIndex = (currentIndex + 1) % configs.length
      switchToVideo(nextIndex)
    }, duration)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [currentIndex, autoAdvance, configs, switchToVideo])

  // Visibility optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
      if (document.hidden && timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Create video element with smart caching
  const createVideoElement = useCallback((index: number) => {
    return videoManager.createVideo(index)
  }, [videoManager])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  // Effect to handle video switching and playing
  useEffect(() => {
    // Pause all videos first
    const allVideos = document.querySelectorAll('.heroVideo') as NodeListOf<HTMLVideoElement>
    allVideos.forEach(video => {
      video.pause()
    })
    
    // Play the current active video
    setTimeout(() => {
      const activeVideo = document.querySelector('.heroVideo.active') as HTMLVideoElement
      if (activeVideo) {
        activeVideo.currentTime = 0
        activeVideo.play().catch(console.error)
      }
    }, 100)
  }, [currentIndex])

  return {
    currentIndex,
    loadedVideos,
    isTransitioning,
    switchToVideo,
    createVideoElement,
    // Expose only necessary video manager methods
    shouldPreload: (index: number) => !loadedVideos.has(index) && Math.abs(index - currentIndex) <= (isMobile ? 1 : 2)
  }
}
