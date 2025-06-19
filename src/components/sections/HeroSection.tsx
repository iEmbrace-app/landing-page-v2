import styles from './HeroSection.module.css'

interface HeroSectionProps {
  isMobile: boolean
}

export function HeroSection({ isMobile }: HeroSectionProps) {
  
  return (
    <section 
      className={`${styles.heroWrapper} ${isMobile ? styles.mobile : ''}`}
      aria-label="ROOT - Emotional Wellness Companion"
    >
      {/* Soft Purple Gradient Background */}
      <div className={styles.gradientBackground} />
      
      {/* Hero Content - Conditional Layout for Desktop vs Mobile */}
      <div className={`${styles.heroContent} ${isMobile ? styles.mobileContent : ''}`}>
        {!isMobile ? (
          <>
            {/* Desktop Layout - Left Side Text Content */}
            <div className={styles.heroTextContent}>
              {/* Title & Subtitle Group */}
              <div className={styles.titleGroup}>
                {/* ROOT Title */}
                <h1 className={styles.rootTitle}>
                  ROOT
                </h1>

                {/* Subtitle */}
                <p className={styles.rootSubtitle}>
                  Companion for Emotional Embracing
                </p>
              </div>

              {/* CTA Button */}
              <button 
                className={styles.ctaButton}
                aria-label="Start your wellness journey"
              >
                Buy Me :)
              </button>

              {/* Description */}
              <p className={styles.description}>
                The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
              </p>

              {/* App Store Buttons */}
              <div className={styles.appButtons}>
                <a 
                  href="#" 
                  className={styles.appButton}
                  aria-label="Download on the App Store"
                >
                  <div className={styles.appButtonContent}>
                    <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className={styles.appButtonText}>
                      <span className={styles.downloadText}>Download on the</span>
                      <span className={styles.storeText}>App Store</span>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className={styles.appButton}
                  aria-label="Get it on Google Play"
                >
                  <div className={styles.appButtonContent}>
                    <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
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

            {/* Desktop Layout - Right Side iPhone Meditation Player */}
            <div className={styles.meditationPlayer}>
              {/* Player Header */}
              <div className={styles.playerHeader}>
                <h2 className={styles.playerTitle}>Evening Calm</h2>
                <p className={styles.playerSubtitle}>Gentle Breathing & Relaxation</p>
                <p className={styles.sessionDuration}>12 minutes</p>
              </div>

              {/* Meditation Visual */}
              <div className={styles.meditationVisual}>
                <div className={styles.breathingCircle}>
                  {/* Layered Aura System - Multiple breathing layers */}
                  <div className={styles.auraLayer} data-layer="1"></div>
                  <div className={styles.auraLayer} data-layer="2"></div>
                  <div className={styles.auraLayer} data-layer="3"></div>
                  <div className={styles.auraLayer} data-layer="4"></div>
                  <div className={styles.auraLayer} data-layer="5"></div>
                    {/* Advanced Floating Particle System */}
                  <div className={styles.particleContainer}>
                    {Array.from({ length: 18 }, (_, i) => (
                      <div 
                        key={`particle-${i}`}
                        className={styles.floatingParticle}
                        style={{
                          '--delay': `${i * 0.618}s`, // Golden ratio spacing
                          '--x-offset': `${(i * 137.5) % 360}deg`, // Golden angle distribution
                          '--size': `${2 + (i % 4)}px`,
                          '--z-depth': `${(i % 5) * 20}px` // 3D depth layers
                        } as React.CSSProperties}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Sacred Geometry - Subtle mandala */}
                  <div className={styles.sacredGeometry}>
                    <div className={styles.mandalaRing} data-ring="outer"></div>
                    <div className={styles.mandalaRing} data-ring="middle"></div>
                    <div className={styles.mandalaRing} data-ring="inner"></div>
                  </div>
                  
                  {/* Central Focus Point */}
                  <div className={styles.centerPoint}>
                    <div className={styles.innerGlow}></div>
                    <div className={styles.pulsingCore}></div>
                  </div>
                  
                  {/* Ripple Effects */}
                  <div className={styles.rippleContainer}>
                    <div className={styles.ripple} style={{'--delay': '0s'} as React.CSSProperties}></div>
                    <div className={styles.ripple} style={{'--delay': '2s'} as React.CSSProperties}></div>
                    <div className={styles.ripple} style={{'--delay': '4s'} as React.CSSProperties}></div>
                  </div>
                  
                  {/* Aurora Color Flows */}
                  <div className={styles.auroraFlow}></div>
                  
                  {/* Gentle Sparkles */}
                  <div className={styles.sparkleContainer}>
                    {Array.from({ length: 6 }, (_, i) => (
                      <div 
                        key={`sparkle-${i}`}
                        className={styles.sparkle}
                        style={{
                          '--angle': `${i * 60}deg`,
                          '--delay': `${i * 1.5}s`
                        } as React.CSSProperties}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className={styles.playerControls}>
                <button className={styles.controlButton} aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 6v12l-5-6 5-6zm1 6l8.5-6v12L8 12z"/>
                  </svg>
                </button>
                
                <button className={`${styles.controlButton} ${styles.playButton}`} aria-label="Play">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                
                <button className={styles.controlButton} aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 18V6l5 6-5 6zm-1-6L7.5 6v12L16 12z"/>
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
                <div className={styles.timeDisplay}>
                  <span>4:15</span>
                  <span>12:00</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile Layout - Individual elements for custom ordering */}
            {/* Title & Subtitle Group - Order 1 on mobile */}
            <div className={`${styles.titleGroup} ${styles.mobileTitleGroup}`}>
              {/* ROOT Title */}
              <h1 className={`${styles.rootTitle} ${styles.mobile}`}>
                ROOT
              </h1>

              {/* Subtitle */}
              <p className={`${styles.rootSubtitle} ${styles.mobile}`}>
                Companion for Emotional Embracing
              </p>
            </div>

            {/* iPhone Meditation Player - Order 2 on mobile */}
            <div className={`${styles.meditationPlayer} ${styles.mobilePlayer}`}>
              {/* Player Header */}
              <div className={`${styles.playerHeader} ${styles.mobilePlayerHeader}`}>
                <h2 className={`${styles.playerTitle} ${styles.mobilePlayerTitle}`}>Evening Calm</h2>
                <p className={`${styles.playerSubtitle} ${styles.mobilePlayerSubtitle}`}>Gentle Breathing & Relaxation</p>
                <p className={`${styles.sessionDuration} ${styles.mobileSessionDuration}`}>12 minutes</p>
              </div>

              {/* Meditation Visual */}
              <div className={styles.meditationVisual}>
                <div className={styles.breathingCircle}>
                  {/* Layered Aura System - Multiple breathing layers */}
                  <div className={styles.auraLayer} data-layer="1"></div>
                  <div className={styles.auraLayer} data-layer="2"></div>
                  <div className={styles.auraLayer} data-layer="3"></div>
                  <div className={styles.auraLayer} data-layer="4"></div>
                  <div className={styles.auraLayer} data-layer="5"></div>
                    {/* Advanced Floating Particle System */}
                  <div className={styles.particleContainer}>
                    {Array.from({ length: 18 }, (_, i) => (
                      <div 
                        key={`particle-${i}`}
                        className={styles.floatingParticle}
                        style={{
                          '--delay': `${i * 0.618}s`, // Golden ratio spacing
                          '--x-offset': `${(i * 137.5) % 360}deg`, // Golden angle distribution
                          '--size': `${2 + (i % 4)}px`,
                          '--z-depth': `${(i % 5) * 20}px` // 3D depth layers
                        } as React.CSSProperties}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Sacred Geometry - Subtle mandala */}
                  <div className={styles.sacredGeometry}>
                    <div className={styles.mandalaRing} data-ring="outer"></div>
                    <div className={styles.mandalaRing} data-ring="middle"></div>
                    <div className={styles.mandalaRing} data-ring="inner"></div>
                  </div>
                  
                  {/* Central Focus Point */}
                  <div className={styles.centerPoint}>
                    <div className={styles.innerGlow}></div>
                    <div className={styles.pulsingCore}></div>
                  </div>
                  
                  {/* Ripple Effects */}
                  <div className={styles.rippleContainer}>
                    <div className={styles.ripple} style={{'--delay': '0s'} as React.CSSProperties}></div>
                    <div className={styles.ripple} style={{'--delay': '2s'} as React.CSSProperties}></div>
                    <div className={styles.ripple} style={{'--delay': '4s'} as React.CSSProperties}></div>
                  </div>
                  
                  {/* Aurora Color Flows */}
                  <div className={styles.auroraFlow}></div>
                  
                  {/* Gentle Sparkles */}
                  <div className={styles.sparkleContainer}>
                    {Array.from({ length: 6 }, (_, i) => (
                      <div 
                        key={`sparkle-${i}`}
                        className={styles.sparkle}
                        style={{
                          '--angle': `${i * 60}deg`,
                          '--delay': `${i * 1.5}s`
                        } as React.CSSProperties}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className={styles.playerControls}>
                <button className={styles.controlButton} aria-label="Previous">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 6v12l-5-6 5-6zm1 6l8.5-6v12L8 12z"/>
                  </svg>
                </button>
                
                <button className={`${styles.controlButton} ${styles.playButton}`} aria-label="Play">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                
                <button className={styles.controlButton} aria-label="Next">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 18V6l5 6-5 6zm-1-6L7.5 6v12L16 12z"/>
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
                <div className={styles.timeDisplay}>
                  <span>4:15</span>
                  <span>12:00</span>
                </div>
              </div>
            </div>

            {/* CTA Button - Order 3 on mobile */}
            <button 
              className={`${styles.ctaButton} ${styles.mobileCta}`}
              aria-label="Start your wellness journey"
            >
              Buy Me :)
            </button>

            {/* Description - Order 4 on mobile */}
            <p className={`${styles.description} ${styles.mobileDescription}`}>
              The Stone Elf offers a quiet space to welcome, understand, and grow with every feeling.
            </p>

            {/* App Store Buttons - Order 5 on mobile */}
            <div className={`${styles.appButtons} ${styles.mobileAppButtons}`}>
              <a 
                href="#" 
                className={styles.appButton}
                aria-label="Download on the App Store"
              >
                <div className={styles.appButtonContent}>
                  <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className={styles.appButtonText}>
                    <span className={styles.downloadText}>Download on the</span>
                    <span className={styles.storeText}>App Store</span>
                  </div>
                </div>
              </a>
              
              <a 
                href="#" 
                className={styles.appButton}
                aria-label="Get it on Google Play"
              >
                <div className={styles.appButtonContent}>
                  <svg className={styles.appIcon} viewBox="0 0 24 24" fill="currentColor">
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
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <svg viewBox="0 0 24 36" role="img" aria-label="Scroll down">
          <path d="M12 4 v20" />
          <polyline points="6 18 12 24 18 18" />
        </svg>
      </div>
    </section>
  )
}
