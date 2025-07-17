import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui'
import styles from './ImmerseSection.module.css'
import { VideoService, Video } from '../../services/videoService'
import { CgTrees } from "react-icons/cg"
import { SlFire } from "react-icons/sl"
import { PiPlantFill } from "react-icons/pi"
import { BiWater } from "react-icons/bi"
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"

// Constants
const FIXED_VIDEO_DURATION = 10000 // ms
const ICONS = [PiPlantFill, CgTrees, BiWater, SlFire]

interface VideoPlayerProps {
  video: Video | null
  isActive: boolean
  isMuted: boolean
  onCanPlay?: () => void
}

// Separate video player component for better organization
const VideoPlayer = ({ video, isActive, isMuted, onCanPlay }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!video || !videoRef.current || !audioRef.current) return

    // Set sources
    videoRef.current.src = video.url
    audioRef.current.src = video.audioUrl
    audioRef.current.muted = isMuted

    // Handle playback when active
    if (isActive) {
      const playMedia = async () => {
        try {
          await videoRef.current?.play()
          if (!isMuted) {
            await audioRef.current?.play()
          }
        } catch (error) {
          console.warn('Playback failed:', error)
        }
      }
      playMedia()
    } else {
      videoRef.current.pause()
      audioRef.current.pause()
    }

    return () => {
      videoRef.current?.pause()
      audioRef.current?.pause()
    }
  }, [video, isActive, isMuted])

  return (
    <>
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        style={{ opacity: isActive ? 1 : 0 }}
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlay={onCanPlay}
      />
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      />
    </>
  )
}

export function ImmerseSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  
  const progressIntervalRef = useRef<number>()
  const autoSwitchTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Load videos
  useEffect(() => {
    VideoService.fetchVideos()
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0)
  }, [currentIndex])

  // Handle auto-switching and progress
  useEffect(() => {
    if (!videos.length || loading) return

    // Clear existing timers
    if (progressIntervalRef.current) {
      cancelAnimationFrame(progressIntervalRef.current)
    }
    if (autoSwitchTimeoutRef.current) {
      clearTimeout(autoSwitchTimeoutRef.current)
    }

    // Start progress animation
    const startTime = Date.now()
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / FIXED_VIDEO_DURATION) * 100, 100)
      setProgress(newProgress)
      
      if (newProgress < 100) {
        progressIntervalRef.current = requestAnimationFrame(updateProgress)
      }
    }
    updateProgress()

    // Set auto-switch timer
    autoSwitchTimeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, FIXED_VIDEO_DURATION)

    return () => {
      if (progressIntervalRef.current) {
        cancelAnimationFrame(progressIntervalRef.current)
      }
      if (autoSwitchTimeoutRef.current) {
        clearTimeout(autoSwitchTimeoutRef.current)
      }
    }
  }, [currentIndex, videos.length, loading])

  // Memoized values
  const currentVideo = useMemo(() => videos[currentIndex], [videos, currentIndex])
  const nextIndex = useMemo(() => (currentIndex + 1) % videos.length, [currentIndex, videos.length])
  const nextVideo = useMemo(() => videos[nextIndex], [videos, nextIndex])

  // Handlers
  const handleVideoSelect = useCallback((index: number) => {
    if (index === currentIndex) return
    setCurrentIndex(index)
  }, [currentIndex])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  // Loading state
  if (loading) {
    return (
      <section className={styles.immerseSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading meditation environments...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (!videos.length) {
    return (
      <section className={styles.immerseSection}>
        <div className={styles.errorContainer}>
          <p>No videos available</p>
        </div>
      </section>
    )
  }

  return (
    <motion.section 
      className={styles.immerseSection}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.videoContainer}>
        {/* Current video */}
        <VideoPlayer
          video={currentVideo}
          isActive={true}
          isMuted={isMuted}
        />
        
        {/* Preload next video */}
        <VideoPlayer
          video={nextVideo}
          isActive={false}
          isMuted={isMuted}
        />
        
        <div className={styles.videoFilter} />
      </div>

      <div className={styles.content}>
        {/* Audio Control */}
        <p className={styles.headphonesText}>use headphones for better experience</p>
        <Button 
          variant="ghost"
          size="medium"
          className={styles.audioToggle}
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          iconOnly={true}
          enableRipple={false}
          enableTextAnimation={false}
        >
          {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
        </Button>

        {/* Video Navigation */}
        <div className={styles.videoNavigationBoxes}>
          {videos.map((video, index) => {
            const Icon = ICONS[index % ICONS.length]
            const isActive = index === currentIndex
            
            return (
              <Button
                key={video.id || index}
                variant="ghost"
                size="large"
                className={`${styles.navigationBox} ${isActive ? styles.active : ''}`}
                onClick={() => handleVideoSelect(index)}
                aria-label={`Switch to ${video.title}`}
                style={{
                  '--progress': isActive ? `${progress * 3.6}deg` : '0deg'
                } as React.CSSProperties}
                enableRipple={false}
                enableTextAnimation={false}
              >
                <div className={styles.iconContainer}>
                  <Icon />
                </div>
                <div className={styles.buttonTitle}>
                  {video.title}
                </div>
              </Button>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}