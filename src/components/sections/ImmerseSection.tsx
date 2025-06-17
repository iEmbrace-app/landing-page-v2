import { useEffect, useRef, useCallback, useState } from 'react'
import styles from './ImmerseSection.module.css'
import { VideoService } from '../../services/videoService'
import { Video } from '../../lib/supabase'
import { CgTrees } from "react-icons/cg"
import { SlFire } from "react-icons/sl"
import { PiPlantFill } from "react-icons/pi"
import { BiWater } from "react-icons/bi"

interface ImmerseSectionProps {
  isMobile?: boolean
}

export function ImmerseSection({ isMobile = false }: ImmerseSectionProps) {
  const autoSwitchIntervalRef = useRef<NodeJS.Timeout>()
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const progressRef = useRef<NodeJS.Timeout>()
  
  const AUTO_SWITCH_INTERVAL = 8000 // 8 seconds
  
  // Simple state management
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  // Simple video ref registration
  const setVideoRef = useCallback((element: HTMLVideoElement | null, index: number) => {
    if (videoRefs.current) {
      videoRefs.current[index] = element
    }
  }, [])

  // Initialize videos
  useEffect(() => {
    const initializeVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🎬 ImmerseSection: Starting video initialization...')
        
        const videoData = await VideoService.fetchVideos()
        console.log('🎬 ImmerseSection: VideoService returned:', videoData)
        
        setVideos(videoData)
        videoRefs.current = new Array(videoData.length).fill(null)
        
        console.log(`📹 ImmerseSection: Loaded ${videoData.length} videos successfully`)
        
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load videos'
        setError(errorMsg)
        console.error('🚨 ImmerseSection: Video loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeVideos()
  }, [])

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning || videos.length === 0) return
    const nextIndex = (currentIndex + 1) % videos.length
    switchToVideo(nextIndex)
  }, [currentIndex, videos.length, isTransitioning])

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex || index >= videos.length) return
    switchToVideo(index)
  }, [currentIndex, videos.length, isTransitioning])

  // Simple video switching
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
        if (targetVideo.readyState < 3) {
          targetVideo.preload = 'auto'
          targetVideo.load()
        }
        
        try {
          await targetVideo.play()
        } catch (playError) {
          console.warn('Video play error (possibly muted):', playError)
        }
      }
      
      setCurrentIndex(newIndex)
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 1200)
      
    } catch (error) {
      console.warn('Error switching video:', error)
      setIsTransitioning(false)
    }
  }, [currentIndex, isTransitioning])

  // Progress tracking
  const startProgressTimer = useCallback(() => {
    setProgress(0)
    
    if (progressRef.current) {
      clearInterval(progressRef.current)
    }
    
    const startTime = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min((elapsed / AUTO_SWITCH_INTERVAL) * 100, 100)
      setProgress(progressPercent)
      
      if (progressPercent >= 100) {
        clearInterval(progressRef.current!)
      }
    }, 50)
  }, [AUTO_SWITCH_INTERVAL])

  const stopProgressTimer = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current)
    }
    setProgress(0)
  }, [])

  // Auto-switch videos
  useEffect(() => {
    const startAutoSwitch = () => {
      if (autoSwitchIntervalRef.current) {
        clearInterval(autoSwitchIntervalRef.current)
      }
      
      startProgressTimer()
      
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
      stopProgressTimer()
    }
  }, [videos.length, isTransitioning, loading, goToNext, startProgressTimer, stopProgressTimer])

  // Pause auto-switch on user interaction
  const pauseAutoSwitch = useCallback(() => {
    if (autoSwitchIntervalRef.current) {
      clearInterval(autoSwitchIntervalRef.current)
    }
    
    stopProgressTimer()
    
    // Resume after 10 seconds of inactivity
    setTimeout(() => {
      if (autoSwitchIntervalRef.current) {
        clearInterval(autoSwitchIntervalRef.current)
      }
      
      startProgressTimer()
      
      autoSwitchIntervalRef.current = setInterval(() => {
        if (!isTransitioning && videos.length > 0) {
          goToNext()
        }
      }, AUTO_SWITCH_INTERVAL)
    }, 10000)
  }, [isTransitioning, videos.length, goToNext, stopProgressTimer, startProgressTimer])

  const goToVideo = useCallback((index: number) => {
    if (index === currentIndex) return
    pauseAutoSwitch()
    goToIndex(index)
  }, [currentIndex, goToIndex, pauseAutoSwitch])

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
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.errorContainer}>
          <p>⚠️ {error}</p>
          <p>Videos are not available. Please check the browser console for setup instructions.</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '1rem' }}>
            The videos need to be uploaded to Supabase storage. Run "node scripts/uploadVideos.js" after placing video files in a "videos" folder.
          </p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Video Background Container */}
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
              }

              return (
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
                  preload="none"
                  onError={(e) => {
                    console.error(`Video ${video.filename} failed to load:`, e)
                  }}
                  onLoadedData={() => {
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
            
            <div className={styles.videoFilter} />
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Video Title */}
            <div className={styles.videoTitleContainer}>
              <h3 className={styles.videoTitle}>{videos[currentIndex]?.title || 'Loading...'}</h3>
            </div>

            {/* Text Content */}
            <div className={styles.textContent}>
              <h2 className={styles.title}>IMMERSE YOURSELF</h2>
              <p className={styles.subtitle}>
                Experience tranquil environments designed to deepen your meditation practice
              </p>
            </div>
            
            {/* Video Navigation Boxes */}
            <div className={styles.videoNavigationBoxes}>
              {videos.map((video, index) => (
                <button
                  key={index}
                  className={`${styles.navigationBox} ${
                    index === currentIndex ? styles.active : ''
                  }`}
                  onClick={() => goToVideo(index)}
                  aria-label={`Switch to ${video.title}`}
                  disabled={isTransitioning}
                  style={index === currentIndex ? { '--progress': `${(progress / 100) * 360}deg` } as React.CSSProperties : undefined}
                >
                  <div className={styles.iconContainer}>
                    {video.title === 'Lake' && <BiWater size={24} />}
                    {video.title === 'Forest' && <CgTrees size={24} />}
                    {video.title === 'Zen Garden' && <PiPlantFill size={24} />}
                    {video.title === 'Campfire' && <SlFire size={24} />}
                  </div>
                  
                  <div className={styles.titleTooltip}>
                    {video.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
