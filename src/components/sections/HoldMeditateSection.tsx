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
        {/* Header Row - contains the header positioned on right */}
        <div className={styles.headerRow}>
          {/* Header Section - positioned on right side (columns 7-12) */}
          <div className={styles.headerSection}>
            <div className={`gradient-text-primary ${styles.mainTitle} ${isMobile ? styles.mainTitleMobile : styles.mainTitleDesktop}`}>
              Just hold it and let yourself feel
            </div>
            
            <div className={styles.description}>
              iEmbraceland provides soothing haptic feedback that helps you reconnect with calm, one vibration at a time
            </div>
          </div>
        </div>

        {/* Bottom Section - Three columns */}
        <div className={styles.bottomSection}>
          {/* Select Column */}
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
                alt="Select - Choose a scene interface"
                className={styles.phoneScreen}
                loading="eager"
              />
            </div>
          </div>

          {/* Immerse Column */}
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
                alt="Immerse - Guided breathing with haptic feedback"
                className={styles.phoneScreen}
                loading="eager"
              />
            </div>
          </div>

          {/* Journal Column */}
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
                alt="Journal - Post-session reflection and tracking"
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