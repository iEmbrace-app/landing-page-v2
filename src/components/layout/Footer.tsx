import { useState } from 'react'
import styles from './Footer.module.css'

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Decorative border line */}
      <div className={styles.borderLine} />

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
            <form onSubmit={handleEmailSubmit} className={styles.newsletterForm}>
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
                  type="submit"
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
            </form>
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
              <p className={styles.copyright}>EMBRACELAND 2025. ALL RIGHTS RESERVED</p>
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