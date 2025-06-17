// Temporary test to verify video rendering with real video URLs
import { useRef, useCallback, useState } from 'react'
import styles from './ImmerseSection.module.css'

interface ImmerseSectionProps {
  isMobile?: boolean
}

// Test videos from public CDN for verification
const testVideos = [
  {
    id: 'test1',
    title: 'Test Lake',
    filename: 'lake.mp4',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'test2', 
    title: 'Test Forest',
    filename: 'forest.mp4',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
  }
]

export function ImmerseSectionTest({ isMobile = false }: ImmerseSectionProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const setVideoRef = useCallback((el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el
  }, [])

  return (
    <section 
      className={`${styles.immerseWrapper} ${isMobile ? styles.mobile : ''}`}
      aria-label="Immerse Yourself - Test Videos"
    >
      <div className={styles.videoContainer}>
        {testVideos.map((video, index) => {
          let videoClasses = styles.backgroundVideo
          
          if (index === currentIndex) {
            videoClasses += ` ${styles.active}`
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
              preload="auto"
              onError={(e) => {
                console.error(`🚨 Test video ${video.filename} failed to load:`, e)
                const target = e.target as HTMLVideoElement
                if (target?.error) {
                  console.error(`   Error code: ${target.error.code}, message: ${target.error.message}`)
                }
              }}
              onLoadedData={() => {
                console.log(`✅ Test video ${video.filename} data loaded`)
              }}
              onCanPlay={() => {
                console.log(`🎬 Test video ${video.filename} can play`)
              }}
              onPlay={() => {
                console.log(`▶️ Test video ${video.filename} started playing`)
              }}
            />
          )
        })}
        
        <div className={styles.videoFilter} />
      </div>

      <div className={styles.content}>
        <div className={styles.videoTitleContainer}>
          <h3 className={styles.videoTitle}>{testVideos[currentIndex]?.title || 'Test Video'}</h3>
        </div>
        
        <div className={styles.textContent}>
          <h2 className={styles.title}>TEST VIDEO RENDERING</h2>
          <p className={styles.subtitle}>
            Testing if video rendering works with actual video content
          </p>
          
          <div className={styles.videoIndicators}>
            {testVideos.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentIndex ? styles.active : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={() => setCurrentIndex((prev) => (prev - 1 + testVideos.length) % testVideos.length)}
          aria-label="Previous video"
        >
          &#8249;
        </button>
        
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={() => setCurrentIndex((prev) => (prev + 1) % testVideos.length)}
          aria-label="Next video"
        >
          &#8250;
        </button>
      </div>
    </section>
  )
}
