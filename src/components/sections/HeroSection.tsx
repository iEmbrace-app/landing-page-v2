import React, { memo } from 'react'
import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'

// Type for CSS custom properties
type CSSPropertiesWithVars = React.CSSProperties & {
  '--delay'?: string
  '--x-offset'?: string
  '--size'?: string
  '--z-depth'?: string
  '--angle'?: string
}

interface HeroSectionProps {
  isMobile: boolean
}

// Memoized components for better performance
const MeditationVisual = memo(({ isMobile }: { isMobile: boolean }) => {
  // Reduce particle count on mobile
  const PARTICLE_COUNT = isMobile ? 6 : 12
  const SPARKLE_COUNT = isMobile ? 3 : 6
  
  return (
    <div className={styles.meditationVisual} aria-label="Breathing visualization">
      <div className={styles.breathingCircle}>
        {/* Reduced aura layers for mobile */}
        <div className={styles.auraLayer} data-layer="1"></div>
        <div className={styles.auraLayer} data-layer="2"></div>
        {!isMobile && (
          <>
            <div className={styles.auraLayer} data-layer="3"></div>
            <div className={styles.auraLayer} data-layer="4"></div>
            <div className={styles.auraLayer} data-layer="5"></div>
          </>
        )}
        
        {/* Conditionally render complex animations */}
        {!isMobile && (
          <>
            {/* Floating Particles */}
            <div className={styles.particleContainer}>
              {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
                <div 
                  key={`particle-${i}`}
                  className={styles.floatingParticle}
                  style={{
                    '--delay': `${i * 0.618}s`,
                    '--x-offset': `${(i * 137.5) % 360}deg`,
                    '--size': `${2 + (i % 4)}px`,
                    '--z-depth': `${(i % 5) * 20}px`
                  } as CSSPropertiesWithVars}
                />
              ))}
            </div>
            
            {/* Sacred Geometry */}
            <div className={styles.sacredGeometry}>
              <div className={styles.mandalaRing} data-ring="outer"></div>
              <div className={styles.mandalaRing} data-ring="middle"></div>
              <div className={styles.mandalaRing} data-ring="inner"></div>
            </div>
            
            {/* Ripple Effects */}
            <div className={styles.rippleContainer}>
              <div className={styles.ripple} style={{'--delay': '0s'} as CSSPropertiesWithVars}></div>
              <div className={styles.ripple} style={{'--delay': '2s'} as CSSPropertiesWithVars}></div>
              <div className={styles.ripple} style={{'--delay': '4s'} as CSSPropertiesWithVars}></div>
            </div>
            
            {/* Aurora Flow */}
            <div className={styles.auroraFlow}></div>
            
            {/* Sparkles */}
            <div className={styles.sparkleContainer}>
              {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
                <div 
                  key={`sparkle-${i}`}
                  className={styles.sparkle}
                  style={{
                    '--angle': `${i * 60}deg`,
                    '--delay': `${i * 1.5}s`
                  } as CSSPropertiesWithVars}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Central Focus Point - Always visible */}
        <div className={styles.centerPoint}>
          <div className={styles.innerGlow}></div>
          <div className={styles.pulsingCore}></div>
        </div>
      </div>
    </div>
  )
})

MeditationVisual.displayName = 'MeditationVisual'

// Memoized Meditation Player component
const MeditationPlayer = memo(({ 
  isMobile, 
  className = '' 
}: { 
  isMobile: boolean
  className?: string 
}) => {
  return (
    <motion.div 
      className={`${styles.meditationPlayer} ${className}`}
      initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
    >
      {/* Player Header */}
      <div className={styles.playerHeader}>
        <h2 className={styles.playerTitle}>Evening Calm</h2>
        <p className={styles.playerSubtitle}>Gentle Breathing & Relaxation</p>
        <time className={styles.sessionDuration} dateTime="PT12M">
          12 minutes
        </time>
      </div>

      {/* Meditation Visual */}
      <MeditationVisual isMobile={isMobile} />

      {/* Player Controls */}
      <div className={styles.playerControls} role="group" aria-label="Media controls">
        <button className={styles.controlButton} aria-label="Previous track">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 6v12l-5-6 5-6zm1 6l8.5-6v12L8 12z"/>
          </svg>
        </button>
        
        <button className={`${styles.controlButton} ${styles.playButton}`} aria-label="Play">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        
        <button className={styles.controlButton} aria-label="Next track">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 18V6l5 6-5 6zm-1-6L7.5 6v12L16 12z"/>
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          role="progressbar" 
          aria-label="Playback progress"
          aria-valuenow={35}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.progressFill}></div>
        </div>
        <div className={styles.timeDisplay}>
          <span aria-label="Current time">4:15</span>
          <span aria-label="Total duration">12:00</span>
        </div>
      </div>
    </motion.div>
  )
})

MeditationPlayer.displayName = 'MeditationPlayer'

// Main component
export function HeroSection({ isMobile }: HeroSectionProps) {
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
            <MeditationPlayer isMobile={false} />
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
            <MeditationPlayer isMobile={true} />

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