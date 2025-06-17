// Simple test with colored backgrounds to verify video container rendering
import { useState } from 'react'
import styles from './ImmerseSection.module.css'

interface ImmerseSectionProps {
  isMobile?: boolean
}

// Test with colored backgrounds instead of videos
const testBackgrounds = [
  {
    id: 'test1',
    title: 'Campfire Test',
    color: '#ff6b35', // Orange for campfire
  },
  {
    id: 'test2', 
    title: 'Forest Test',
    color: '#2d5016', // Green for forest
  },
  {
    id: 'test3',
    title: 'Lake Test', 
    color: '#1e3a8a', // Blue for lake
  },
  {
    id: 'test4',
    title: 'Zen Test',
    color: '#6b7280', // Gray for zen
  }
]

export function ImmerseSectionTest({ isMobile = false }: ImmerseSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section 
      className={`${styles.immerseWrapper} ${isMobile ? styles.mobile : ''}`}
      aria-label="Immerse Yourself - Test Backgrounds"
    >
      {/* Test with colored divs instead of videos */}
      <div className={styles.videoContainer}>
        {testBackgrounds.map((bg, index) => {
          let bgClasses = styles.backgroundVideo
          
          if (index === currentIndex) {
            bgClasses += ` ${styles.active}`
          } else {
            bgClasses += ` ${styles.inactive}`
          }

          return (
            <div
              key={index}
              className={bgClasses}
              style={{
                backgroundColor: bg.color,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              data-bg-index={index}
            />
          )
        })}
        
        <div className={styles.videoFilter} />
      </div>

      <div className={styles.content}>
        <div className={styles.videoTitleContainer}>
          <h3 className={styles.videoTitle}>{testBackgrounds[currentIndex]?.title || 'Test Background'}</h3>
        </div>
        
        <div className={styles.textContent}>
          <h2 className={styles.title}>IMMERSE YOURSELF</h2>
          <p className={styles.subtitle}>
            Testing background rendering - videos should appear here
          </p>
          
          <div className={styles.videoIndicators}>
            {testBackgrounds.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentIndex ? styles.active : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to background ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={() => setCurrentIndex((prev) => (prev - 1 + testBackgrounds.length) % testBackgrounds.length)}
          aria-label="Previous background"
        >
          &#8249;
        </button>
        
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={() => setCurrentIndex((prev) => (prev + 1) % testBackgrounds.length)}
          aria-label="Next background"
        >
          &#8250;
        </button>
      </div>
    </section>
  )
}
