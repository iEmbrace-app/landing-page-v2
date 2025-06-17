import { useState, useCallback } from 'react'
import styles from './ImmerseSection.module.css'

interface ImmerseSectionProps {
  isMobile?: boolean
}

export function ImmerseSection({ isMobile = false }: ImmerseSectionProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Video sources
  const videos = [
    '/videos/field.mp4',
    '/videos/cloud.mp4'
  ]

  const TRANSITION_DURATION = 1200

  const handleTransition = useCallback((newIndex: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentVideoIndex(newIndex)
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION)
  }, [isTransitioning])

  const nextVideo = useCallback(() => {
    const newIndex = (currentVideoIndex + 1) % videos.length
    handleTransition(newIndex)
  }, [currentVideoIndex, videos.length, handleTransition])

  const prevVideo = useCallback(() => {
    const newIndex = (currentVideoIndex - 1 + videos.length) % videos.length
    handleTransition(newIndex)
  }, [currentVideoIndex, videos.length, handleTransition])

  const goToVideo = useCallback((index: number) => {
    if (index === currentVideoIndex) return
    handleTransition(index)
  }, [currentVideoIndex, handleTransition])

  return (
    <section 
      className={`${styles.immerseWrapper} ${isMobile ? styles.mobile : ''}`}
      aria-label="Immerse Yourself - Tranquil Environments"
    >
      {/* Video Background Container */}
      <div className={styles.videoContainer}>
        {videos.map((videoSrc, index) => (
          <video
            key={index}
            className={`${styles.backgroundVideo} ${
              index === currentVideoIndex ? styles.active : styles.inactive
            } ${isTransitioning ? styles.transitioning : ''}`}
            data-video-index={index}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        ))}
        
        {/* Video Filter Overlay for Better Text Readability */}
        <div className={styles.videoFilter} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h2 className={styles.title}>IMMERSE YOURSELF</h2>
        <p className={styles.subtitle}>
          Experience tranquil environments designed to deepen your meditation practice
        </p>

        {/* Video Navigation */}
        <div className={styles.videoNavigation}>
          {/* Left Arrow */}
          <button 
            className={`${styles.navArrow} ${styles.leftArrow}`}
            onClick={prevVideo}
            aria-label="Previous video"
            disabled={isTransitioning}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Video Indicators */}
          <div className={styles.videoIndicators}>
            {videos.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentVideoIndex ? styles.active : ''
                }`}
                onClick={() => goToVideo(index)}
                aria-label={`Switch to video ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            className={`${styles.navArrow} ${styles.rightArrow}`}
            onClick={nextVideo}
            aria-label="Next video"
            disabled={isTransitioning}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
