import { useState, useCallback, useEffect } from 'react'
import styles from './ImmerseSection.module.css'

interface ImmerseSectionProps {
  isMobile?: boolean
}

export function ImmerseSection({ isMobile = false }: ImmerseSectionProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [previousVideoIndex, setPreviousVideoIndex] = useState(-1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  // Video sources with titles
  const videos = [
    { src: '/videos/lake.mp4', title: 'LAKE' },
    { src: '/videos/forest.mp4', title: 'FOREST' },
    { src: '/videos/zen.mp4', title: 'ZEN GARDEN' },
    { src: '/videos/campfire.mp4', title: 'CAMPFIRE' }
  ]
  const TRANSITION_DURATION = 1200
  const AUTO_SWITCH_INTERVAL = 8000 // 8 seconds

  const handleTransition = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === currentVideoIndex) return
    
    setPreviousVideoIndex(currentVideoIndex)
    setIsTransitioning(true)
    setCurrentVideoIndex(newIndex)
    
    setTimeout(() => {
      setIsTransitioning(false)
      setPreviousVideoIndex(-1)
    }, TRANSITION_DURATION)
  }, [isTransitioning, TRANSITION_DURATION, currentVideoIndex])

  // Auto-switch videos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentVideoIndex + 1) % videos.length
        handleTransition(newIndex)
      }
    }, AUTO_SWITCH_INTERVAL)

    return () => clearInterval(interval)
  }, [currentVideoIndex, isTransitioning, videos.length, handleTransition])

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
    >      {/* Video Background Container */}      <div className={styles.videoContainer}>
        {videos.map((video, index) => {
          let videoClasses = styles.backgroundVideo
          
          if (index === currentVideoIndex) {
            videoClasses += ` ${styles.active}`
            if (isTransitioning) {
              videoClasses += ` ${styles.entering} ${styles.transitioning}`
            }
          } else if (index === previousVideoIndex && isTransitioning) {
            // Previous video that's transitioning out
            videoClasses += ` ${styles.exiting} ${styles.transitioning}`
          } else {
            videoClasses += ` ${styles.inactive}`
          }
          
          return (
            <video
              key={index}
              className={videoClasses}
              data-video-index={index}
              src={video.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          )
        })}
        
        {/* Video Filter Overlay for Better Text Readability */}
        <div className={styles.videoFilter} />
      </div>      {/* Content */}
      <div className={styles.content}>
        {/* Video Title - Top positioned */}
        <div className={styles.videoTitleContainer}>
          <h3 className={styles.videoTitle}>{videos[currentVideoIndex].title}</h3>
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
          </button>
        </div>
      </div>
    </section>
  )
}
