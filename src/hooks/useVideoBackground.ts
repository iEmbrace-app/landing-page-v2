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
      },      onVideoError: (index, error) => {
        if (import.meta.env.DEV) {
          console.warn(`Video ${index} load error:`, error)
        }
      }
    })

    return () => {
      unsubscribe()
      videoManager.cleanup()
    }
  }, [videoManager])

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

  // Smart auto-advance with visibility optimization
  useEffect(() => {
    if (!autoAdvance || !isVisibleRef.current) return

    // Variable intervals for better UX
    const intervals = [8000, 6000, 10000]
    const currentInterval = intervals[currentIndex % intervals.length]

    timerRef.current = window.setTimeout(() => {
      const nextIndex = (currentIndex + 1) % configs.length
      switchToVideo(nextIndex)
    }, currentInterval)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [currentIndex, autoAdvance, configs.length, switchToVideo])

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
