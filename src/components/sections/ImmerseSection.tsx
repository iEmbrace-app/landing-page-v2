import { useEffect, useRef, useCallback, useState } from 'react'
import styles from './ImmerseSection.module.css'
import { VideoService } from '../../services/videoService'
import { Video } from '../../lib/supabase'

interface ImmerseSectionProps {
  isMobile?: boolean
}

export function ImmerseSection({ isMobile = false }: ImmerseSectionProps) {
  const autoSwitchIntervalRef = useRef<NodeJS.Timeout>()
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  
  const AUTO_SWITCH_INTERVAL = 8000 // 8 seconds
  
  // Simple state management
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)  
  // Initialize videos - simple fetch without complex manager
  useEffect(() => {
    const initializeVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load videos from service
        const videoData = await VideoService.fetchVideos()
        setVideos(videoData)
        
        // Initialize video refs array
        videoRefs.current = new Array(videoData.length).fill(null)
        
        console.log(`📹 Loaded ${videoData.length} videos`)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load videos'
        setError(errorMsg)
        console.error('Video loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeVideos()
  }, [])

  // Simple video ref registration
  const setVideoRef = useCallback((element: HTMLVideoElement | null, index: number) => {
    if (videoRefs.current) {
      videoRefs.current[index] = element
    }
  }, [])

  // Preload videos efficiently - only current and next
  useEffect(() => {
    if (!videos.length || loading) return

    const preloadVideos = () => {
      const currentVideo = videoRefs.current[currentIndex]
      const nextIndex = (currentIndex + 1) % videos.length
      const nextVideo = videoRefs.current[nextIndex]

      // Ensure current video is loaded and ready
      if (currentVideo && currentVideo.readyState < 3) {
        currentVideo.preload = 'auto'
        currentVideo.load()
      }

      // Preload next video
      if (nextVideo && nextVideo.readyState < 2) {
        nextVideo.preload = 'metadata'
        nextVideo.load()
      }

      // Unload distant videos to save memory
      videoRefs.current.forEach((video, index) => {
        if (video && index !== currentIndex && index !== nextIndex) {
          video.preload = 'none'
          // Don't fully unload to avoid re-download, just stop preloading
        }
      })
    }

    preloadVideos()
  }, [currentIndex, videos.length, loading])
  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning || videos.length === 0) return
    const nextIndex = (currentIndex + 1) % videos.length
    switchToVideo(nextIndex)
  }, [currentIndex, videos.length, isTransitioning])

  const goToPrev = useCallback(() => {
    if (isTransitioning || videos.length === 0) return
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length
    switchToVideo(prevIndex)
  }, [currentIndex, videos.length, isTransitioning])

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex || index >= videos.length) return
    switchToVideo(index)
  }, [currentIndex, videos.length, isTransitioning])

  // Simple video switching - no complex manager
  const switchToVideo = useCallback(async (newIndex: number) => {
    if (newIndex === currentIndex || isTransitioning) return

    setIsTransitioning(true)
    
    try {
      // Pause all videos first
      videoRefs.current.forEach(video => {
        if (video) video.pause()
      })

      // Play the new video
      const targetVideo = videoRefs.current[newIndex]
      if (targetVideo) {
        // Ensure it's loaded
        if (targetVideo.readyState < 3) {
          targetVideo.preload = 'auto'
          targetVideo.load()
        }
        
        // Play the video
        try {
          await targetVideo.play()
        } catch (playError) {
          console.warn('Video play error (possibly muted):', playError)
        }
      }
      
      // Update current index
      setCurrentIndex(newIndex)
      
      console.log(`🎬 Switched to video ${newIndex}: ${videos[newIndex]?.title}`)
      
      // End transition after a shorter delay for better responsiveness
      setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
      
    } catch (error) {
      console.warn('Error switching video:', error)
      setIsTransitioning(false)
    }
  }, [currentIndex, isTransitioning, videos])

  // Auto-switch videos with pause on user interaction
  useEffect(() => {
    const startAutoSwitch = () => {
      if (autoSwitchIntervalRef.current) {
        clearInterval(autoSwitchIntervalRef.current)
      }
      
      autoSwitchIntervalRef.current = setInterval(() => {
        if (!isTransitioning && videos.length > 0) {
          goToNext()
        }
      }, AUTO_SWITCH_INTERVAL)
    }

    if (videos.length > 0 && !loading) {
      startAutoSwitch()
    }

    return () => {
      if (autoSwitchIntervalRef.current) {
        clearInterval(autoSwitchIntervalRef.current)
      }
    }
  }, [videos.length, isTransitioning, loading, goToNext])

  // Pause auto-switch on user interaction
  const pauseAutoSwitch = useCallback(() => {
    if (autoSwitchIntervalRef.current) {
      clearInterval(autoSwitchIntervalRef.current)
    }
    
    // Resume after 10 seconds of inactivity
    setTimeout(() => {
      if (autoSwitchIntervalRef.current) {
        clearInterval(autoSwitchIntervalRef.current)
      }
      autoSwitchIntervalRef.current = setInterval(() => {
        if (!isTransitioning && videos.length > 0) {
          goToNext()
        }
      }, AUTO_SWITCH_INTERVAL)
    }, 10000)
  }, [isTransitioning, videos.length, goToNext])
  const nextVideo = useCallback(() => {
    pauseAutoSwitch()
    goToNext()
  }, [goToNext, pauseAutoSwitch])

  const prevVideo = useCallback(() => {
    pauseAutoSwitch()
    goToPrev()
  }, [goToPrev, pauseAutoSwitch])
  
  const goToVideo = useCallback((index: number) => {
    if (index === currentIndex) return
    pauseAutoSwitch()
    goToIndex(index)
  }, [currentIndex, goToIndex, pauseAutoSwitch])  // Debug: Add performance monitoring (throttled)
  const lastLogRef = useRef(0)
  useEffect(() => {
    if (videos.length > 0 && !loading) {
      const now = Date.now()
      // Only log every 10 seconds to prevent spam
      if (now - lastLogRef.current > 10000) {
        console.log('🎬 ImmerseSection: Video state:', {
          currentIndex,
          isTransitioning,
          totalVideos: videos.length,
          loadedVideos: videoRefs.current.filter(v => v && v.readyState >= 3).length
        })
        lastLogRef.current = now
      }
    }
  }, [videos.length, loading, currentIndex, isTransitioning])

  // Auto-play current video when videos load
  useEffect(() => {
    if (videos.length > 0 && !loading && !isTransitioning) {
      const currentVideo = videoRefs.current[currentIndex]
      if (currentVideo && currentVideo.paused) {
        currentVideo.play().catch(console.warn)
      }
    }
  }, [currentIndex, videos.length, loading, isTransitioning])

  return (
    <section 
      className={`${styles.immerseWrapper} ${isMobile ? styles.mobile : ''}`}
      aria-label="Immerse Yourself - Tranquil Environments"
    >
      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading meditation videos...</p>
        </div>
      )}      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorContainer}>
          <p>⚠️ {error}</p>
          <p>Videos are not available. Please check the browser console for setup instructions.</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '1rem' }}>
            The videos need to be uploaded to Supabase storage. Run "node scripts/uploadVideos.js" after placing video files in a "videos" folder.
          </p>
        </div>
      )}
        {/* Main Content - Only show when not loading */}
      {!loading && (
        <>          {/* Video Background Container */}
          <div className={styles.videoContainer}>
            {videos.map((video, index) => {
              let videoClasses = styles.backgroundVideo
              
              if (index === currentIndex) {
                videoClasses += ` ${styles.active}`
                if (isTransitioning) {
                  videoClasses += ` ${styles.entering} ${styles.transitioning}`
                }
              } else {
                videoClasses += ` ${styles.inactive}`
              }              return (
                <video
                  key={index}
                  ref={(el) => setVideoRef(el, index)}
                  className={videoClasses}
                  data-video-index={index}
                  src={video.url}
                  autoPlay={index === currentIndex}
                  loop
                  muted
                  playsInline
                  preload="none" // Start with no preloading, managed in useEffect
                  onError={(e) => {
                    console.warn(`Video ${video.filename} failed to load:`, e)
                  }}
                  onLoadedData={() => {
                    // Auto-play current video when loaded
                    if (index === currentIndex) {
                      const videoEl = videoRefs.current[index]
                      if (videoEl) {
                        videoEl.play().catch(console.warn)
                      }
                    }
                  }}
                />
              )
            })}
            
            {/* Video Filter Overlay for Better Text Readability */}
            <div className={styles.videoFilter} />
          </div>{/* Content */}
      <div className={styles.content}>
        {/* Video Title - Top positioned */}
        <div className={styles.videoTitleContainer}>
          <h3 className={styles.videoTitle}>{videos[currentIndex]?.title || 'Loading...'}</h3>
        </div>
        
        {/* Text Content - Centered */}
        <div className={styles.textContent}>
          <h2 className={styles.title}>IMMERSE YOURSELF</h2>
          <p className={styles.subtitle}>
            Experience tranquil environments designed to deepen your meditation practice
          </p>
          
          {/* Video Indicators - Centered with text */}
          <div className={styles.videoIndicators}>
            {videos.map((_, index) => (
              <button
                key={index}                    className={`${styles.indicator} ${
                      index === currentIndex ? styles.active : ''
                    }`}
                    onClick={() => goToVideo(index)}
                    aria-label={`Switch to video ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        </div>

        {/* Video Navigation - Arrows only */}
        <div className={styles.videoNavigation}>
          {/* Left Arrow */}
          <button 
            className={`${styles.navArrow} ${styles.leftArrow}`}
            onClick={prevVideo}
            aria-label="Previous video"
            disabled={isTransitioning}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Right Arrow */}
          <button 
            className={`${styles.navArrow} ${styles.rightArrow}`}
            onClick={nextVideo}
            aria-label="Next video"
            disabled={isTransitioning}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>        </div>
      </div>
        </>
      )}
    </section>
  )
}
