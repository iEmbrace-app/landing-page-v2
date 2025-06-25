import { useEffect, useRef, useCallback, useState } from 'react'
import styles from './ImmerseSection.module.css'
import { VideoService } from '../../services/videoService'
import { Video } from '../../services/videoService'
import { CgTrees } from "react-icons/cg"
import { SlFire } from "react-icons/sl"
import { PiPlantFill } from "react-icons/pi"
import { BiWater } from "react-icons/bi"
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"

interface ImmerseSectionProps {
  isMobile?: boolean
}

// Fixed duration for all videos (10 seconds)
const FIXED_VIDEO_DURATION = 10

export function ImmerseSection({ isMobile: _ }: ImmerseSectionProps) {
  // Simple state - no over-engineering
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeVideoRef, setActiveVideoRef] = useState<'video1' | 'video2'>('video1')
  const [isMuted, setIsMuted] = useState(true) // Start muted for better UX
  
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const audio1Ref = useRef<HTMLAudioElement>(null)
  const audio2Ref = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<number>()
  const autoSwitchRef = useRef<NodeJS.Timeout>()
  const timerStartRef = useRef<number>(0)
  
  // STABLE FUNCTIONS - No dependencies to prevent recreation
  const startProgressTracking = useCallback(() => {
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current)
    }
    
    // Reset timer start time
    timerStartRef.current = Date.now()
    
    const trackProgress = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - timerStartRef.current
      const progressPercent = Math.min((elapsed / (FIXED_VIDEO_DURATION * 1000)) * 100, 100)
      
      // Update CSS custom property for the active navigation box
      const activeNavBox = document.querySelector(`.${styles.navigationBox}.${styles.active}`) as HTMLElement
      if (activeNavBox) {
        const progressDegrees = (progressPercent / 100) * 360
        activeNavBox.style.setProperty('--progress', `${progressDegrees}deg`)
      }
      
      progressRef.current = requestAnimationFrame(trackProgress)
    }
    
    trackProgress()
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMutedState = !prev
      console.log(`Audio ${newMutedState ? 'muted' : 'unmuted'}`)
      
      // Update audio elements
      if (audio1Ref.current) {
        audio1Ref.current.muted = newMutedState
        console.log('Audio 1 muted state:', audio1Ref.current.muted, 'src:', audio1Ref.current.src)
        // Try to play if unmuting and this is the active video
        if (!newMutedState && audio1Ref.current.src && (video1Ref.current?.style.opacity === '1' || video1Ref.current?.style.opacity === '')) {
          audio1Ref.current.play().catch(console.warn)
        }
      }
      if (audio2Ref.current) {
        audio2Ref.current.muted = newMutedState
        console.log('Audio 2 muted state:', audio2Ref.current.muted, 'src:', audio2Ref.current.src)
        // Try to play if unmuting and this is the active video
        if (!newMutedState && audio2Ref.current.src && video2Ref.current?.style.opacity === '1') {
          audio2Ref.current.play().catch(console.warn)
        }
      }
      
      return newMutedState
    })
  }, []) // No dependencies to prevent timer resets// Load videos - simple and clean
  useEffect(() => {
    VideoService.fetchVideos()
      .then((loadedVideos) => {
        setVideos(loadedVideos)
        // Preload first video and audio immediately
        if (loadedVideos.length > 0) {
          const videoLink = document.createElement('link')
          videoLink.rel = 'preload'
          videoLink.href = loadedVideos[0].url
          videoLink.as = 'video'
          document.head.appendChild(videoLink)
          
          // Also preload first audio
          const audioLink = document.createElement('link')
          audioLink.rel = 'preload'
          audioLink.href = loadedVideos[0].audioUrl
          audioLink.as = 'audio'
          document.head.appendChild(audioLink)
          
          // Initialize first audio element
          setTimeout(() => {
            if (audio1Ref.current && loadedVideos[0].audioUrl) {
              audio1Ref.current.src = loadedVideos[0].audioUrl
              audio1Ref.current.muted = isMuted
              audio1Ref.current.load()
            }
          }, 100)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])  // Cross-fade video switching - no gradient background visible  // Cross-fade video switching - optimized for industry-standard smoothness
  const switchToVideo = useCallback((index: number) => {
    if (index === currentIndex || index < 0 || index >= videos.length || isTransitioning) return
    
    setIsTransitioning(true)
    
    // Reset timer for new video
    timerStartRef.current = Date.now()
    
    // Determine which video/audio elements to use for the new video
    const currentVideoRef = activeVideoRef === 'video1' ? video1Ref : video2Ref
    const nextVideoRef = activeVideoRef === 'video1' ? video2Ref : video1Ref
    const currentAudioRef = activeVideoRef === 'video1' ? audio1Ref : audio2Ref
    const nextAudioRef = activeVideoRef === 'video1' ? audio2Ref : audio1Ref
    const nextActiveRef = activeVideoRef === 'video1' ? 'video2' : 'video1'
    
    // Load the new video and audio in the background elements
    if (nextVideoRef.current && nextAudioRef.current) {
      // Set video source and prepare for smooth transition
      nextVideoRef.current.src = videos[index].url
      nextVideoRef.current.currentTime = 0 // Ensure video starts from beginning
      nextAudioRef.current.src = videos[index].audioUrl
      nextAudioRef.current.muted = isMuted
      nextAudioRef.current.currentTime = 0 // Sync audio to start
      
      // Use canplaythrough for better buffering before transition
      const handleCanPlayThrough = () => {
        if (nextVideoRef.current && nextAudioRef.current) {
          // Ensure both video and audio are ready to play smoothly
          Promise.all([
            nextVideoRef.current.play().catch(console.warn),
            nextAudioRef.current.play().catch(console.warn)
          ]).then(() => {
            // Smooth cross-fade using requestAnimationFrame for optimal timing
            requestAnimationFrame(() => {
              if (nextVideoRef.current) {
                nextVideoRef.current.style.opacity = '1'
              }
              if (currentVideoRef.current) {
                currentVideoRef.current.style.opacity = '0'
              }
              
              // Wait for CSS transition to complete before cleanup
              setTimeout(() => {
                setActiveVideoRef(nextActiveRef)
                setCurrentIndex(index)
                setIsTransitioning(false)
                
                // Reset progress for the new video
                const newActiveNavBox = document.querySelector(`.${styles.navigationBox}.${styles.active}`) as HTMLElement
                if (newActiveNavBox) {
                  newActiveNavBox.style.setProperty('--progress', '0deg')
                }
                
                // Clean up old video/audio after transition
                if (currentVideoRef.current && currentAudioRef.current) {
                  currentVideoRef.current.pause()
                  currentAudioRef.current.pause()
                  currentAudioRef.current.currentTime = 0
                  // Keep opacity at 0 but don't modify it during cleanup
                }
              }, 420) // Slightly longer than CSS transition (400ms) for safety
            })
          })
        }
        nextVideoRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough)
      }
      
      nextVideoRef.current.addEventListener('canplaythrough', handleCanPlayThrough)
      nextVideoRef.current.load()
      nextAudioRef.current.load()
    }
    
    // Aggressive preloading strategy for seamless transitions
    const preloadNext = (currentIdx: number) => {
      const nextIndex = (currentIdx + 1) % videos.length
      const prevIndex = (currentIdx - 1 + videos.length) % videos.length
      
      // Preload next and previous videos for instant switching
      const indicesToPreload = [nextIndex, prevIndex]
      indicesToPreload.forEach((idx: number) => {
        if (videos[idx]) {
          // Preload video
          const videoLink = document.createElement('link')
          videoLink.rel = 'preload'
          videoLink.href = videos[idx].url
          videoLink.as = 'video'
          videoLink.setAttribute('data-preload-index', idx.toString())
          
          // Remove existing preload for this index to avoid duplicates
          const existingVideoLink = document.querySelector(`link[data-preload-index="${idx}"]`)
          if (existingVideoLink) {
            existingVideoLink.remove()
          }
          document.head.appendChild(videoLink)
          
          // Preload audio
          const audioLink = document.createElement('link')
          audioLink.rel = 'preload'
          audioLink.href = videos[idx].audioUrl
          audioLink.as = 'audio'
          audioLink.setAttribute('data-preload-audio-index', idx.toString())
          
          // Remove existing audio preload for this index to avoid duplicates
          const existingAudioLink = document.querySelector(`link[data-preload-audio-index="${idx}"]`)
          if (existingAudioLink) {
            existingAudioLink.remove()
          }
          document.head.appendChild(audioLink)
        }
      })
    }
    
    preloadNext(index)
  }, [currentIndex, videos, isTransitioning, activeVideoRef, isMuted])

  // Navigation function for manual clicks
  const goToIndex = useCallback((index: number) => {
    switchToVideo(index)
  }, [switchToVideo])
  // SINGLE TIMER MANAGEMENT - Consolidating all timer logic here
  useEffect(() => {
    if (videos.length > 0 && !loading) {
      // Clear any existing timers first
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
      
      // Start progress tracking
      startProgressTracking()
      
      // Start auto-switch timer
      const switchInterval = FIXED_VIDEO_DURATION * 1000 // Use constant directly
      autoSwitchRef.current = setInterval(() => {
        // Direct switching logic to avoid dependency issues
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % videos.length
          
          // Use requestAnimationFrame to ensure smooth execution
          requestAnimationFrame(() => {
            // Trigger the actual video switch
            const switchFunction = () => {
              if (nextIndex === prevIndex || nextIndex < 0 || nextIndex >= videos.length) return
              
              // Manual inline switch logic
              setIsTransitioning(true)
              timerStartRef.current = Date.now() // Reset timer
              
              const currentVideoRef = activeVideoRef === 'video1' ? video1Ref : video2Ref
              const nextVideoRef = activeVideoRef === 'video1' ? video2Ref : video1Ref
              const currentAudioRef = activeVideoRef === 'video1' ? audio1Ref : audio2Ref
              const nextAudioRef = activeVideoRef === 'video1' ? audio2Ref : audio1Ref
              const nextActiveRef = activeVideoRef === 'video1' ? 'video2' : 'video1'
              
              if (nextVideoRef.current && nextAudioRef.current) {
                nextVideoRef.current.src = videos[nextIndex].url
                nextVideoRef.current.currentTime = 0
                nextAudioRef.current.src = videos[nextIndex].audioUrl
                nextAudioRef.current.muted = isMuted
                nextAudioRef.current.currentTime = 0
                
                const handleCanPlayThrough = () => {
                  if (nextVideoRef.current && nextAudioRef.current) {
                    Promise.all([
                      nextVideoRef.current.play().catch(console.warn),
                      nextAudioRef.current.play().catch(console.warn)
                    ]).then(() => {
                      requestAnimationFrame(() => {
                        if (nextVideoRef.current) nextVideoRef.current.style.opacity = '1'
                        if (currentVideoRef.current) currentVideoRef.current.style.opacity = '0'
                        
                        setTimeout(() => {
                          setActiveVideoRef(nextActiveRef)
                          setIsTransitioning(false)
                          
                          const newActiveNavBox = document.querySelector(`.${styles.navigationBox}.${styles.active}`) as HTMLElement
                          if (newActiveNavBox) {
                            newActiveNavBox.style.setProperty('--progress', '0deg')
                          }
                          
                          if (currentVideoRef.current && currentAudioRef.current) {
                            currentVideoRef.current.pause()
                            currentAudioRef.current.pause()
                            currentAudioRef.current.currentTime = 0
                          }
                        }, 420)
                      })
                    })
                  }
                  nextVideoRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough)
                }
                
                nextVideoRef.current.addEventListener('canplaythrough', handleCanPlayThrough)
                nextVideoRef.current.load()
                nextAudioRef.current.load()
              }
            }
            
            switchFunction()
          })
          
          return nextIndex
        })
      }, switchInterval)
    }

    return () => {
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [videos.length, loading, videos, activeVideoRef]) // Add necessary dependencies
  // Cleanup on unmount - prevent memory leaks
  useEffect(() => {
    return () => {
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current)
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
      
      // Clean up video and audio elements
      if (video1Ref.current) {
        video1Ref.current.pause()
        video1Ref.current.src = ''
        video1Ref.current.load()
      }
      if (video2Ref.current) {
        video2Ref.current.pause()
        video2Ref.current.src = ''
        video2Ref.current.load()
      }
      if (audio1Ref.current) {
        audio1Ref.current.pause()
        audio1Ref.current.src = ''
        audio1Ref.current.load()
      }
      if (audio2Ref.current) {
        audio2Ref.current.pause()
        audio2Ref.current.src = ''
        audio2Ref.current.load()
      }
      
      // Clean up preload links
      document.querySelectorAll('link[data-preload-index], link[data-preload-audio-index]').forEach(link => {
        link.remove()
      })
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
          preload="metadata"
          style={{ opacity: activeVideoRef === 'video1' ? 1 : 0 }}
          onCanPlay={() => {
            // Play as soon as basic playback is possible
            if (video1Ref.current && video1Ref.current.paused && activeVideoRef === 'video1') {
              video1Ref.current.play().catch(console.warn)
              // Also start audio if this is the active video and audio is loaded
              if (audio1Ref.current && audio1Ref.current.src) {
                console.log('Starting audio 1:', audio1Ref.current.src)
                audio1Ref.current.play().catch(console.warn)
              }
            }
          }}
          onPlay={() => {
            // Only start progress tracking on actual video switches, not audio state changes
            if (activeVideoRef === 'video1' && !progressRef.current) {
              startProgressTracking()
            }
            // Ensure audio plays with video
            if (audio1Ref.current && audio1Ref.current.paused && audio1Ref.current.src) {
              console.log('Video 1 playing, starting audio 1:', audio1Ref.current.src)
              audio1Ref.current.play().catch(console.warn)
            }
          }}
          onError={(e) => {
            console.error(`Video 1 ${videos[currentIndex]?.filename} failed to load:`, e)
          }}
        />

        <video
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
            // Only start progress tracking on actual video switches, not audio state changes
            if (activeVideoRef === 'video2' && !progressRef.current) {
              startProgressTracking()
            }
            // Ensure audio plays with video
            if (audio2Ref.current && audio2Ref.current.paused && audio2Ref.current.src) {
              console.log('Video 2 playing, starting audio 2:', audio2Ref.current.src)
              audio2Ref.current.play().catch(console.warn)
            }
          }}
          onError={(e) => {
            console.error(`Video 2 failed to load:`, e)
          }}
        />

        {/* Audio elements for ambient sound */}
        <audio
          ref={audio1Ref}
          src={videos[currentIndex]?.audioUrl}
          loop
          muted={isMuted}
          preload="metadata"
          onError={(e) => {
            console.error(`Audio 1 ${videos[currentIndex]?.filename} failed to load:`, e)
          }}
        />

        <audio
          ref={audio2Ref}
          loop
          muted={isMuted}
          preload="metadata"
          onError={(e) => {
            console.error(`Audio 2 failed to load:`, e)
          }}
        />
        
        <div className={styles.videoFilter} />
      </div>      {/* Content */}
      <div className={styles.content}>
        {/* Audio Control */}
        <button 
          className={styles.audioToggle}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
        </button>

        {/* Text Content */}
        <div className={styles.textContent}>
          <p className={styles.subtitle}>
            Immerse in environments designed for deeper meditation
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
