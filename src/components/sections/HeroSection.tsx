import { motion } from 'framer-motion'
import { Button } from '../ui'
import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks/usePerformanceMonitor'
import styles from './HeroSection.module.css'

// Main component
export function HeroSection({ isMobile }: { isMobile: boolean }) {
  // Performance monitoring in development
  usePerformanceMonitor(import.meta.env.DEV)
  useMemoryLeakDetector(import.meta.env.DEV)

  return (
    <section 
      className={styles.heroWrapper}
      aria-label="Embraceland - Emotional Wellness Companion"
    >
      {/* Background Image with Gradient Overlay */}
      <div className={styles.backgroundImageContainer} aria-hidden="true">
        <div className={styles.backgroundImage} />
        <div className={styles.gradientOverlay} />
      </div>
      
      {/* Soft Purple Gradient Background */}
      <div className={styles.gradientBackground} aria-hidden="true" />
      
      {/* Aurora Background Effect - Only on desktop for performance */}
      {!isMobile && (
        <div className={styles.auroraBackground} aria-hidden="true">
          <div className={styles.auroraEffect}>
            <div className={styles.auroraOverlay} />
          </div>
        </div>
      )}
      
      {/* Hero Content */}
      <motion.div 
        className={styles.heroContent}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        {/* Desktop Layout - Centered Content */}
        {!isMobile ? (
          <>
            {/* Centered Content Container */}
            <div className={styles.centeredContent}>
              {/* Main Title */}
              <h1 className={styles.mainTitle}>
                Companion for Emotional Embracing
              </h1>
              {/* Subtitle */}
              <p className={styles.mainSubtitle}>
                The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
              </p>
              {/* CTA Button */}
              <Button 
                variant="cta"
                size="large"
                aria-label="Start your wellness journey"
                enableMotion={true}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore a Meditation
              </Button>
              {/* App Store Buttons - bottom right column */}
              <div className={styles.appButtonsColumn}>
                <a 
                  href="https://apps.apple.com/us/app/iembraceland/id6740446690" 
                  className={styles.appButton}
                  aria-label="Download on the App Store"
                  rel="noopener noreferrer"
                >
                  <div className={styles.appButtonContent}>
                    <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className={styles.appButtonText}>
                      <span className={styles.downloadText}>Download on the</span>
                      <span className={styles.storeText}>App Store</span>
                    </div>
                  </div>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.embraceland" 
                  className={styles.appButton}
                  aria-label="Get it on Google Play"
                  rel="noopener noreferrer"
                >
                  <div className={styles.appButtonContent}>
                    <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className={styles.appButtonText}>
                      <span className={styles.downloadText}>GET IT ON</span>
                      <span className={styles.storeText}>Google Play</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile Layout - Centered Content */}
            <div className={styles.centeredContent}>
              {/* Main Title */}
              <h1 className={styles.mainTitle}>
                Companion for Emotional Embracing
              </h1>
              {/* Subtitle */}
              <p className={styles.mainSubtitle}>
                The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
              </p>
              {/* CTA Button */}
              <Button 
                variant="cta"
                size="large"
                aria-label="Start your wellness journey"
                enableMotion={true}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore a Meditation
              </Button>
              {/* App Store Buttons - bottom right column */}
              <div className={styles.appButtonsColumn}>
                <a 
                  href="https://apps.apple.com/us/app/iembraceland/id6740446690" 
                  className={styles.appButton}
                  aria-label="Download on the App Store"
                  rel="noopener noreferrer"
                >
                  <div className={styles.appButtonContent}>
                    <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className={styles.appButtonText}>
                      <span className={styles.downloadText}>Download on the</span>
                      <span className={styles.storeText}>App Store</span>
                    </div>
                  </div>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.embraceland" 
                  className={styles.appButton}
                  aria-label="Get it on Google Play"
                  rel="noopener noreferrer"
                >
                  <div className={styles.appButtonContent}>
                    <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className={styles.appButtonText}>
                      <span className={styles.downloadText}>GET IT ON</span>
                      <span className={styles.storeText}>Google Play</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Scroll Indicator - Desktop only */}
      {!isMobile && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <svg viewBox="0 0 24 36" role="img" aria-label="Scroll down">
            <path d="M12 4 v20" stroke="currentColor" strokeWidth="2" fill="none" />
            <polyline points="6 18 12 24 18 18" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}
    </section>
  )
}

export default HeroSection