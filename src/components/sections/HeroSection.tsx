import { memo, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'

// Memoized Meditation Player component - iPhone Mockup Design
const MeditationPlayer = memo(({ 
  className = '' 
}: { 
  className?: string 
}) => {
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathCount, setBreathCount] = useState(0)
  const playerRef = useRef<HTMLDivElement>(null)

  // Breathing counter
  useEffect(() => {
    if (isBreathing) {
      const interval = setInterval(() => {
        setBreathCount(prev => prev + 1)
      }, 8000) // One complete breath cycle
      return () => clearInterval(interval)
    } else {
      setBreathCount(0)
    }
  }, [isBreathing])

  const handleBreathToggle = () => {
    setIsBreathing(!isBreathing)
    
    // Trigger warp effect
    if (!isBreathing && playerRef.current) {
      const phoneScreen = playerRef.current.querySelector(`.${styles.phoneScreen}`)
      if (phoneScreen) {
        const startTime = Date.now()
        const duration = 1200
        
        const animateWarp = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing function
          const easeOutQuad = (t: number) => t * (2 - t)
          const easedProgress = easeOutQuad(progress)
          
          // Calculate deformation
          const deform = progress < 0.3 ? easedProgress : 1 - easedProgress;
          
          // Apply transformations to phone screen content
          (phoneScreen as HTMLElement).style.transform = `
            perspective(1000px)
            rotateX(${deform * -3}deg)
            translateZ(${deform * 30}px)
            scale(${1 + deform * 0.02})
          `
          
          if (progress < 1) {
            requestAnimationFrame(animateWarp)
          } else {
            (phoneScreen as HTMLElement).style.transform = ''
          }
        }
        
        requestAnimationFrame(animateWarp)
      }
    }
  }

  return (
    <motion.div 
      ref={playerRef}
      className={`${styles.iphoneMockup} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
    >
      {/* iPhone Frame */}
      <div className={styles.phoneFrame}>
        {/* Power Button */}
        <div className={styles.powerButton}></div>
        
        {/* Volume Buttons */}
        <div className={styles.volumeUp}></div>
        <div className={styles.volumeDown}></div>
        
        {/* Silent Switch */}
        <div className={styles.silentSwitch}></div>

        {/* Screen Container */}
        <div className={styles.screenContainer}>
          {/* Notch/Dynamic Island */}
          <div className={styles.dynamicIsland}></div>

          {/* Phone Screen */}
          <div className={styles.phoneScreen}>
            {/* Status Bar */}
            <div className={styles.statusBar}>
              <span className={styles.time}>9:41</span>
              <div className={styles.statusIcons}>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                  <rect x="1" y="4" width="3" height="7" rx="0.5" opacity="0.3"/>
                  <rect x="5.5" y="2.5" width="3" height="8.5" rx="0.5" opacity="0.5"/>
                  <rect x="10" y="1" width="3" height="10" rx="0.5" opacity="0.7"/>
                  <rect x="14.5" y="0" width="3" height="11" rx="0.5"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                  <path d="M1 4a4 4 0 014-4h6a4 4 0 014 4v4a4 4 0 01-4 4H5a4 4 0 01-4-4V4z" opacity="0.3"/>
                  <path d="M12 4.5v3a.5.5 0 001 0v-3a.5.5 0 00-1 0z"/>
                  <path d="M16 5v2a1 1 0 01-1 1h-.5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5H15a1 1 0 011 1z"/>
                </svg>
                <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
                  <rect x="1" y="3" width="21" height="7" rx="2.5" stroke="currentColor" fill="none" strokeWidth="1"/>
                  <path d="M23 5.5v2a.5.5 0 00.5.5h.5a1 1 0 001-1v-2a1 1 0 00-1-1h-.5a.5.5 0 00-.5.5z"/>
                  <rect x="2" y="4.5" width="18" height="4" rx="1.5" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* App Content */}
            <div className={styles.appContent}>
              {/* Header */}
              <div className={styles.appHeader}>
                <h2 className={styles.appTitle}>Mind Space</h2>
                <p className={styles.appTagline}>Find your inner calm</p>
              </div>

              {/* Breathing Visualization */}
              <div className={styles.breathingSection}>
                <div className={`${styles.breathingOrb} ${isBreathing ? styles.breathing : ''}`}>
                  <div className={styles.orbRing} data-ring="1"></div>
                  <div className={styles.orbRing} data-ring="2"></div>
                  <div className={styles.orbRing} data-ring="3"></div>
                  
                  <button 
                    className={styles.breathButton}
                    onClick={handleBreathToggle}
                    aria-label={isBreathing ? "Stop breathing exercise" : "Start breathing exercise"}
                  >
                    <span className={styles.breathText}>
                      {isBreathing ? 'BREATHE' : 'START'}
                    </span>
                  </button>
                </div>

                {/* Breath Counter */}
                {isBreathing && (
                  <motion.div 
                    className={styles.breathCounter}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className={styles.countNumber}>{breathCount}</span> <br />
                    <span className={styles.countLabel}>  Breaths </span>
                  </motion.div>
                )}
              </div>

              {/* Stats Section - Centered */}
              <div className={styles.statsSection}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>7</span>
                  <span className={styles.statLabel}>Day Streak</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>42</span>
                  <span className={styles.statLabel}>Total Sessions</span>
                </div>
              </div>
            </div>

            {/* Warp Overlay Effect */}
            <div className={`${styles.warpOverlay} ${isBreathing ? styles.active : ''}`}>
              <div className={styles.expandingCircle}></div>
              <div className={styles.gradientCircle} data-position="top-left"></div>
              <div className={styles.gradientCircle} data-position="bottom-right"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

MeditationPlayer.displayName = 'MeditationPlayer'

// Main component
export function HeroSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section 
      className={styles.heroWrapper}
      aria-label="Embraceland - Emotional Wellness Companion"
    >
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
        {/* Desktop Layout */}
        {!isMobile ? (
          <>
            {/* Left Side Text Content */}
            <div className={styles.heroTextContent}>
              {/* Title & Subtitle Group */}
              <motion.div 
                className={styles.titleGroup}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              >
                <h1 className={styles.rootTitle}>
                  Embraceland
                </h1>
                <p className={styles.rootSubtitle}>
                  Companion for Emotional Embracing
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.button 
                className={styles.ctaButton}
                aria-label="Start your wellness journey"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try for $0
              </motion.button>

              {/* Description */}
              <p className={styles.description}>
                The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
              </p>

              {/* App Store Buttons */}
              <div className={styles.appButtons}>
                <a 
                  href="https://apps.apple.com/app/embraceland" 
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

            {/* Right Side - Meditation Player */}
            <MeditationPlayer />
          </>
        ) : (
          <>
            {/* Mobile Layout - Reordered for better UX */}
            {/* Title & Subtitle Group */}
            <div className={styles.titleGroup}>
              <h1 className={styles.rootTitle}>
                Embraceland
              </h1>
              <p className={styles.rootSubtitle}>
                Companion for Emotional Embracing
              </p>
            </div>

            {/* Meditation Player */}
            <MeditationPlayer />

            {/* CTA Button */}
            <motion.button 
              className={styles.ctaButton}
              aria-label="Start your wellness journey"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try for $0
            </motion.button>

            {/* Description */}
            <p className={styles.description}>
              The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
            </p>

            {/* App Store Buttons */}
            <div className={styles.appButtons}>
              <a 
                href="https://apps.apple.com/app/embraceland" 
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