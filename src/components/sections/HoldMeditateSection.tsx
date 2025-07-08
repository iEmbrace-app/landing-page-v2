import styles from './HoldMeditateSection.module.css'

interface HoldMeditateSectionProps {
  isMobile: boolean
}

export function HoldMeditateSection({ isMobile }: HoldMeditateSectionProps) {
  return (
    <div 
      id="hold-meditate-section"
      className={styles.section}
    >
      <div className={styles.sectionContent}>
        {/* Header Section - positioned on right side (columns 7-12) */}
        <div className={styles.headerSection}>
          <div className={`gradient-text-primary ${styles.mainTitle} ${isMobile ? styles.mainTitleMobile : styles.mainTitleDesktop}`}>
            All you need to do is hold it and meditate
          </div>
          
          <div className={styles.description}>
            Root responds to your presence with dynamic sensory feedback designed to calm the nervous system. It creates a meditative space that adapts to your body — no screens, just pure immersion.
          </div>
        </div>

        {/* Bottom Section - Three columns */}
        <div className={styles.bottomSection}>
          {/* Hold Column */}
          <div className={styles.column}>
            <div className={styles.columnTitle}>
              SELECT
            </div>
            <div className={styles.columnDescription}>
            Choose a scene to begin your session
            </div>
            <div className={`${styles.phoneFrame} ${isMobile ? styles.phoneFrameMobile : styles.phoneFrameDesktop}`}>
              <img 
                src="https://embrace-website-images.s3.us-east-2.amazonaws.com/select.png" 
                alt="Hold - Touch activated lights"
                className={styles.phoneScreen}
                loading="eager"
              />
            </div>
          </div>

          {/* Breathe Column */}
          <div className={styles.column}>
            <div className={styles.columnTitle}>
              IMMERSE
            </div>
            <div className={styles.columnDescription}>
            Feel the immersive view and haptics guide your breath
            </div>
            <div className={`${styles.phoneFrame} ${isMobile ? styles.phoneFrameMobile : styles.phoneFrameDesktop}`}>
              <img 
                src="https://embrace-website-images.s3.us-east-2.amazonaws.com/immerse.png" 
                alt="Breathe - Emotional vibration patterns"
                className={styles.phoneScreen}
                loading="eager"
              />
            </div>
          </div>

          {/* Connect Column */}
          <div className={styles.column}>
            <div className={styles.columnTitle}>
              JOURNAL
            </div>
            <div className={styles.columnDescription}>
              Reflect and save your thoughts post-session
            </div>
            <div className={`${styles.phoneFrame} ${isMobile ? styles.phoneFrameMobile : styles.phoneFrameDesktop}`}>
              <img 
                src="https://embrace-website-images.s3.us-east-2.amazonaws.com/journal.png" 
                alt="Connect - iEmbrace app reflection and tracking"
                className={styles.phoneScreen}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}