import { useEffect, useRef, useCallback, useState } from 'react'
import styles from './ImmerseSection.module.css'
import { VideoService } from '../../services/videoService'
import { Video } from '../../services/r2Service'
import { CgTrees } from "react-icons/cg"
import { SlFire } from "react-icons/sl"
import { PiPlantFill } from "react-icons/pi"
import { BiWater } from "react-icons/bi"

interface ImmerseSectionProps {
  isMobile?: boolean
}

// Video duration mapping (in seconds) - Order: zen, forest, lake, campfire
const VIDEO_DURATIONS: Record<string, number> = {
  'zen.mp4': 11,
  'forest.mp4': 14,
  'lake.mp4': 12,
  'campfire.mp4': 14
}

export function ImmerseSection({ isMobile: _ }: ImmerseSectionProps) {
  // Simple state - no over-engineering
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeVideoRef, setActiveVideoRef] = useState<'video1' | 'video2'>('video1')
    const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<number>()
  const autoSwitchRef = useRef<NodeJS.Timeout>()
  
  // Get the duration of the current video for auto-switch timing
  const getCurrentVideoDuration = useCallback(() => {
    if (videos[currentIndex]) {
      return (VIDEO_DURATIONS[videos[currentIndex].filename] || 14) * 1000 // Convert to milliseconds
    }
    return 14000 // Default 14 seconds
  }, [videos, currentIndex])  // Load videos - simple and clean
  useEffect(() => {
    VideoService.fetchVideos()
      .then((loadedVideos) => {
        setVideos(loadedVideos)
        // Preload first video immediately
        if (loadedVideos.length > 0) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = loadedVideos[0].url
          link.as = 'video'
          document.head.appendChild(link)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])  // Cross-fade video switching - no gradient background visible
  const switchToVideo = useCallback((index: number) => {
    if (index === currentIndex || index < 0 || index >= videos.length || isTransitioning) return
    
    setIsTransitioning(true)
    
    // Determine which video element to use for the new video
    const currentVideoRef = activeVideoRef === 'video1' ? video1Ref : video2Ref
    const nextVideoRef = activeVideoRef === 'video1' ? video2Ref : video1Ref
    const nextActiveRef = activeVideoRef === 'video1' ? 'video2' : 'video1'
    
    // Load the new video in the background video element
    if (nextVideoRef.current) {
      nextVideoRef.current.src = videos[index].url
      nextVideoRef.current.load()
      
      // Wait for the video to be ready, then cross-fade
      const handleCanPlay = () => {
        if (nextVideoRef.current) {
          nextVideoRef.current.play().catch(console.warn)
          
          // Start the cross-fade
          nextVideoRef.current.style.opacity = '1'
          if (currentVideoRef.current) {
            currentVideoRef.current.style.opacity = '0'
          }
          
          // Switch the active reference and update state smoothly after a brief delay
          setTimeout(() => {
            setActiveVideoRef(nextActiveRef)
            
            // Update current index with a slight delay for smooth transition
            setTimeout(() => {
              setCurrentIndex(index)
              setIsTransitioning(false)
              
              // Reset progress for the new video
              const newActiveNavBox = document.querySelector(`.${styles.navigationBox}.${styles.active}`) as HTMLElement
              if (newActiveNavBox) {
                newActiveNavBox.style.setProperty('--progress', '0deg')
              }
              
              // Hide the old video completely
              if (currentVideoRef.current) {
                currentVideoRef.current.style.opacity = '0'
                currentVideoRef.current.pause()
              }
            }, 100) // Small delay for smooth button transition
          }, 400) // Slightly earlier than video transition completion
        }
        nextVideoRef.current?.removeEventListener('canplay', handleCanPlay)
      }
      
      nextVideoRef.current.addEventListener('canplay', handleCanPlay)
    }
    
    // Preload next video for faster switching
    const nextIndex = (index + 1) % videos.length
    if (videos[nextIndex]) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = videos[nextIndex].url
      link.as = 'video'
      // Remove any existing preload link for this video
      const existingLink = document.querySelector(`link[href="${videos[nextIndex].url}"]`)
      if (!existingLink) {
        document.head.appendChild(link)
      }
    }
  }, [currentIndex, videos, isTransitioning, activeVideoRef])

  // Navigation functions
  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % videos.length
    switchToVideo(nextIndex)
  }, [currentIndex, videos.length, switchToVideo])

  const goToIndex = useCallback((index: number) => {
    switchToVideo(index)
  }, [switchToVideo])  // Progress tracking based on actual video playback
  const updateVideoProgress = useCallback(() => {
    const currentVideo = activeVideoRef === 'video1' ? video1Ref.current : video2Ref.current
    
    if (currentVideo && videos[currentIndex]) {
      const currentTime = currentVideo.currentTime
      // Try to get actual video duration first, fallback to our mapping
      const actualDuration = currentVideo.duration && !isNaN(currentVideo.duration) ? currentVideo.duration : null
      const videoDuration = actualDuration || VIDEO_DURATIONS[videos[currentIndex].filename] || 14
      const progressPercent = Math.min((currentTime / videoDuration) * 100, 100)
      
      // Update CSS custom property for the active navigation box
      const activeNavBox = document.querySelector(`.${styles.navigationBox}.${styles.active}`) as HTMLElement
      if (activeNavBox) {
        const progressDegrees = (progressPercent / 100) * 360
        activeNavBox.style.setProperty('--progress', `${progressDegrees}deg`)
      }
    }
  }, [activeVideoRef, videos, currentIndex])

  // Start progress tracking when video plays
  const startProgressTracking = useCallback(() => {
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current)
    }
    
    const trackProgress = () => {
      updateVideoProgress()
      progressRef.current = requestAnimationFrame(trackProgress)
    }
    
    trackProgress()  }, [updateVideoProgress])
  // Auto-switch videos
  useEffect(() => {
    if (videos.length > 0 && !loading) {
      // Clear existing timers
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
      
      // Start progress tracking
      startProgressTracking()
      
      // Start auto-switch timer with dynamic duration
      const switchInterval = getCurrentVideoDuration()
      autoSwitchRef.current = setInterval(() => {
        goToNext()
      }, switchInterval)
    }

    return () => {
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [videos.length, loading, goToNext, startProgressTracking, getCurrentVideoDuration])
  // Restart timers when manually switching
  useEffect(() => {
    if (videos.length > 0) {
      startProgressTracking()
      
      // Restart auto-switch timer with correct duration for new video
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      const switchInterval = getCurrentVideoDuration()
      autoSwitchRef.current = setInterval(() => {
        goToNext()
      }, switchInterval)
    }
  }, [currentIndex, startProgressTracking, videos.length, getCurrentVideoDuration, goToNext])
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [])  // Icon mapping - Order: zen, forest, lake, campfire  
  const getIcon = (index: number) => {
    const icons = [<PiPlantFill />, <CgTrees />, <BiWater />, <SlFire />]
    return icons[index % icons.length]
  }

  if (loading) {
    return (
      <section className={styles.immerseSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading meditation environments...</p>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return (
      <section className={styles.immerseSection}>
        <div className={styles.errorContainer}>
          <p>No videos available</p>
        </div>
      </section>
    )
  }  return (
    <section className={styles.immerseSection}>
      <div className={styles.videoContainer}>
        {/* Two video elements for seamless cross-fading */}        <video
          ref={video1Ref}
          className={styles.backgroundVideo}
          src={videos[currentIndex]?.url}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"          style={{ opacity: activeVideoRef === 'video1' ? 1 : 0 }}
          onCanPlay={() => {
            // Play as soon as basic playback is possible
            if (video1Ref.current && video1Ref.current.paused && activeVideoRef === 'video1') {
              video1Ref.current.play().catch(console.warn)
            }
          }}
          onPlay={() => {
            // Start progress tracking when video plays
            if (activeVideoRef === 'video1') {
              startProgressTracking()
            }
          }}          onError={(e) => {
            console.error(`Video 1 ${videos[currentIndex]?.filename} failed to load:`, e)
          }}
        />        <video
          ref={video2Ref}
          className={styles.backgroundVideo}
          loop
          muted
          playsInline
          preload="metadata"
          style={{ opacity: activeVideoRef === 'video2' ? 1 : 0 }}
          onCanPlay={() => {
            // This will be handled by the switchToVideo function
          }}
          onPlay={() => {
            // Start progress tracking when video plays
            if (activeVideoRef === 'video2') {
              startProgressTracking()
            }
          }}          onError={(e) => {
            console.error(`Video 2 failed to load:`, e)
          }}
        />
        
        <div className={styles.videoFilter} />
      </div>      {/* Content */}
      <div className={styles.content}>
        {/* Text Content */}
        <div className={styles.textContent}>
          <h2 className={styles.title}>IMMERSE YOURSELF</h2>
          <p className={styles.subtitle}>
            Experience tranquil environments designed to deepen your meditation practice
          </p>
        </div>{/* Video Navigation Boxes - Simple and clean */}
        <div className={styles.videoNavigationBoxes}>
          {videos.map((video, index) => (
            <button
              key={index}
              className={`${styles.navigationBox} ${
                index === currentIndex ? styles.active : ''
              }`}
              onClick={() => goToIndex(index)}
              aria-label={`Switch to ${video.title}`}
            >
              <div className={styles.iconContainer}>
                {getIcon(index)}
              </div>
              <div className={styles.buttonTitle}>
                {video.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
