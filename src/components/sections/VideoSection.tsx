/**
 * VideoSection - Dedicated video background section
 * Moved from HeroSection for better separation of concerns
 */

import { useRef, useEffect, useState } from 'react'
import { useVideoBackground } from '../../hooks/useVideoBackground'
import styles from './VideoSection.module.css'

// Video configurations
const videoConfigs = [
  {
    src: '/videos/cloud.mp4',
    poster: '/images/posters/cloud.jpg', 
    alt: 'Peaceful cloud formations and sky meditation',
    priority: 1,
    duration: 8000
  },
  {
    src: '/videos/field.mp4',
    poster: '/images/posters/field.jpg',
    alt: 'Serene natural field landscape',
    priority: 2,
    duration: 8000
  }
]

interface VideoSectionProps {
  isMobile: boolean
}

export function VideoSection({ isMobile }: VideoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [videosNotFound, setVideosNotFound] = useState(false)
  
  const {
    currentIndex,
    loadedVideos,
    isTransitioning,
    switchToVideo,
    createVideoElement,
    shouldPreload
  } = useVideoBackground(videoConfigs, {
    autoAdvance: true,
    isMobile
  })

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoConfigs.forEach((_, index) => {
            if (shouldPreload(index)) {
              createVideoElement(index)
            }
          })
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [shouldPreload, createVideoElement])

  return (
    <section 
      ref={containerRef}
      className={`${styles.videoWrapper} ${isMobile ? styles.mobile : ''}`}
      aria-label="Immersive meditation experience"
    >
      {/* Video Background */}
      <div className={styles.videoContainer}>
        {videoConfigs.map((config, index) => {
          const isActive = index === currentIndex
          
          return (
            <video
              key={config.src}
              className={`heroVideo ${isActive ? 'active' : 'inactive'} ${isTransitioning ? 'transitioning' : ''}`}
              autoPlay={false}
              muted
              loop
              playsInline
              poster={config.poster}
              preload="auto"
              onLoadedData={() => {
                console.log(`Video ${config.src} loaded successfully`)
                setVideosNotFound(false)
              }}
              onError={() => {
                console.log(`Video ${config.src} not found - using gradient background`)
                setVideosNotFound(true)
              }}
              aria-label={config.alt}
              data-video-index={index}
            >
              <source src={config.src} type="video/mp4" />
            </video>
          )
        })}

        {/* Fallback gradient */}
        <div 
          className={styles.gradientBackground}
          style={{
            opacity: videosNotFound || loadedVideos.size === 0 ? 1 : 0
          }}
        />

        {/* Video overlay */}
        <div className={styles.videoOverlay} />
      </div>

      {/* Video Content */}
      <div className={styles.videoContent}>
        <h2 className={styles.videoTitle}>
          Immerse Yourself
        </h2>
        
        <p className={styles.videoDescription}>
          Experience tranquil environments designed to deepen your meditation practice
        </p>

        {/* Video Indicators */}
        {loadedVideos.size > 0 && !videosNotFound && (
          <div className={styles.videoIndicators}>
            {videoConfigs.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => switchToVideo(index)}
                disabled={isTransitioning}
                aria-label={`Switch to video ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
