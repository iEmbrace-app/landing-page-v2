// Simple test to verify R2 video loading
import { useRef, useEffect } from 'react'
import styles from './ImmerseSection.module.css'

export function ImmerseSectionTest() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const testVideoUrl = 'https://pub-98cf7829029d40cea96dea8c90412216.r2.dev/zen.mp4'

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      console.log('🎬 Test component mounted, attempting to play video...')
      
      // Handle autoplay restrictions
      const playVideo = async () => {
        try {
          await video.play()
          console.log('✅ Video playing successfully')
        } catch (error) {
          console.warn('⚠️ Autoplay blocked, video ready but needs user interaction:', error)
        }
      }

      if (video.readyState >= 2) {
        playVideo()
      } else {
        video.addEventListener('loadeddata', playVideo)
        return () => video.removeEventListener('loadeddata', playVideo)
      }
    }
  }, [])

  return (
    <section className={styles.immerseSection}>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.backgroundVideo}
          src={testVideoUrl}
          loop
          muted
          playsInline
          style={{ opacity: 1 }}
          onLoadStart={() => console.log('✅ R2 Test video loading started')}
          onLoadedMetadata={() => console.log('✅ R2 Test video metadata loaded')}
          onLoadedData={() => console.log('✅ R2 Test video data loaded')}
          onCanPlay={() => console.log('✅ R2 Test video can play')}
          onPlay={() => console.log('✅ R2 Test video playing')}
          onPause={() => console.log('⏸️ R2 Test video paused')}
          onError={(e) => {
            console.error('❌ R2 Test video error:', e)
            const video = e.target as HTMLVideoElement
            if (video.error) {
              console.error(`   Error code: ${video.error.code}, message: ${video.error.message}`)
            }
          }}
        />
        <div className={styles.videoFilter} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>R2 VIDEO TEST</h2>
          <p className={styles.subtitle}>
            Testing R2 video: zen.mp4
          </p>
          <button 
            onClick={() => {
              const video = videoRef.current
              if (video) {
                video.play().catch(console.error)
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            ▶️ Play Video
          </button>
        </div>
      </div>
    </section>
  )
}
