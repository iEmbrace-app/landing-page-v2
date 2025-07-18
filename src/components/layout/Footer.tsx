import { useState } from 'react'
import styles from './Footer.module.css'

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleEmailSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Footer Background Image - Matching hero section approach */}
      <div className={styles.footerImageSection}>
        <div className={styles.footerImageContainer}>
          <div className={styles.footerBackgroundImage} />
          <div className={styles.footerGradientOverlay} />
        </div>
      </div>
      
      {/* Soft gradient background overlay */}
      <div className={styles.gradientBackground} />
      
      {/* Aurora effects - matching hero section */}
      <div className={styles.footerAurora}>
        <div className={styles.auroraEffect} />
        <div className={styles.footerAuroraOverlay} />
      </div>

      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Services Section */}
          <div className={styles.servicesSection}>
            <h3 className={styles.sectionHeader}>SERVICES</h3>
            <ul className={styles.servicesList}>
              <li><a href="#guides" className={styles.serviceLink}>Meditation Guides</a></li>
              <li><a href="#sessions" className={styles.serviceLink}>Live Sessions</a></li>
              <li><a href="#programs" className={styles.serviceLink}>Programs</a></li>
              <li><a href="#community" className={styles.serviceLink}>Community</a></li>
              <li><a href="#resources" className={styles.serviceLink}>Resources</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className={styles.newsletterSection}>
            <h3 className={styles.sectionHeader}>SIGN UP TO OUR NEWSLETTER</h3>
            <div className={styles.newsletterForm}>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={styles.emailInput}
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  onClick={handleEmailSubmit}
                  className={styles.submitButton}
                  aria-label="Subscribe to newsletter"
                >
                  <svg className={styles.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              {isSubscribed && (
                <p className={styles.successMessage} role="status">
                  ✓ Subscribed successfully
                </p>
              )}
            </div>
            <div className={styles.instagramSection}>
              <span className={styles.instagramText}>Follow us on Instagram</span>
              <a 
                href="https://instagram.com/_iembrace_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.instagramLink}
                aria-label="Follow us on Instagram"
              >
                <svg className={styles.instagramIcon} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Sitemap Section */}
          <div className={styles.sitemapSection}>
            <h3 className={styles.sectionHeader}>SITEMAP</h3>
            <ul className={styles.sitemapList}>
              <li><a href="#home" className={styles.sitemapLink}>Home</a></li>
              <li><a href="#about" className={styles.sitemapLink}>About</a></li>
              <li><a href="#sessions" className={styles.sitemapLink}>Sessions</a></li>
              <li><a href="#blog" className={styles.sitemapLink}>Blog</a></li>
              <li><a href="#contact" className={styles.sitemapLink}>Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            {/* Logo */}
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <img 
                  src="https://embrace-website-images.s3.us-east-2.amazonaws.com/logo.png"
                  alt="Embraceland logo"
                  className={styles.logoImage}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={styles.logoText}>Embraceland</span>
              </div>
              <p className={styles.copyright}>iEMBRACE 2025. ALL RIGHTS RESERVED</p>
            </div>

            {/* Credits and Legal */}
            <div className={styles.bottomRight}>
              <div className={styles.support}>
                <span>DEV SUPPORT</span>
                <a href="#contact" className={styles.creditLink}>CONTACT US</a>
              </div>

              <nav className={styles.legalLinks} aria-label="Legal navigation">
                <a href="#privacy" className={styles.legalLink}>PRIVACY</a>
                <a href="#cookie" className={styles.legalLink}>COOKIE</a>
                <a href="#terms" className={styles.legalLink}>TERMS</a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 