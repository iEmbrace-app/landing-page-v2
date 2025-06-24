import styles from './HoldMeditateSection.module.css'

interface HoldMeditateSectionProps {
  isMobile: boolean
}

export function HoldMeditateSection({ isMobile }: HoldMeditateSectionProps) {
  return (
    <div 
      id="hold-meditate-section"
      className={`${styles.section} ${isMobile ? styles.sectionMobile : styles.sectionDesktop}`}
    >{/* Top Section - Header text positioned on right side (columns 7-12) */}
      <div className={`grid-container ${styles.topSection} ${isMobile ? styles.topSectionMobile : styles.topSectionDesktop}`}>
        {/* Empty left columns (1-6) on desktop */}
        <div className="hidden md:block col-6"></div>
        
        {/* Header content on right columns (7-12) or full width on mobile */}
        <div className={`col-12 md:col-6 ${styles.headerContent}`}>
          <div className={`gradient-text-primary ${styles.mainTitle} ${isMobile ? styles.mainTitleMobile : styles.mainTitleDesktop}`}>
            All you need to do is hold it and meditate
          </div>
          
          <div className={styles.description}>
            Root responds to your presence with dynamic sensory feedback designed to calm the nervous system. It creates a meditative space that adapts to your body — no screens, just pure immersion.
          </div>
        </div>
      </div>      {/* Bottom Section - Three columns using 12-column grid */}
      <div className={`grid-container ${styles.bottomSection}`}>
        {/* Hold Column - Columns 1-4 */}
        <div className={`col-12 md:col-4 ${styles.column}`}>
          <div className={styles.columnTitle}>
            HOLD
          </div>
          <div className={`${styles.circle} ${isMobile ? styles.circleMobile : styles.circleDesktop}`}></div>
          <div className={styles.columnDescription}>
            Lights activate as it senses your touch
          </div>
        </div>

        {/* Breathe Column - Columns 5-8 */}
        <div className={`col-12 md:col-4 ${styles.column}`}>
          <div className={styles.columnTitle}>
            BREATHE
          </div>
          <div className={`${styles.circle} ${isMobile ? styles.circleMobile : styles.circleDesktop}`}></div>
          <div className={styles.columnDescription}>
            Gently vibrates in patterns inspired by your emotions
          </div>
        </div>

        {/* Connect Column - Columns 9-12 */}
        <div className={`col-12 md:col-4 ${styles.column}`}>
          <div className={styles.columnTitle}>
            CONNECT
          </div>
          <div className={`${styles.circle} ${isMobile ? styles.circleMobile : styles.circleDesktop}`}></div>
          <div className={styles.columnDescription}>
            iEmbrace app helps to reflect, track, and grow with Root
          </div>
        </div>
      </div>
    </div>
  )
}
