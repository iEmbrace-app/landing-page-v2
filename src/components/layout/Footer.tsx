import { useState } from 'react'
import styles from './Footer.module.css'

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Simulate email subscription
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerMain}>
          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span className={styles.logoText}>ROOT</span>
            </div>
            <p className={styles.tagline}>
              Find your center through mindful meditation
            </p>
          </div>

          {/* Join the Community Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Join the Community</h3>
            <ul className={styles.linkList}>
              <li><a href="#discord" className={styles.link}>Discord Server</a></li>
              <li><a href="#reddit" className={styles.link}>Reddit Community</a></li>
              <li><a href="#facebook" className={styles.link}>Facebook Group</a></li>
              <li><a href="#instagram" className={styles.link}>Instagram</a></li>
              <li><a href="#youtube" className={styles.link}>YouTube Channel</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact</h3>
            <ul className={styles.linkList}>
              <li><a href="mailto:hello@root-meditate.com" className={styles.link}>hello@root-meditate.com</a></li>
              <li><a href="#support" className={styles.link}>Support Center</a></li>
              <li><a href="#feedback" className={styles.link}>Send Feedback</a></li>
              <li><a href="#press" className={styles.link}>Press Inquiries</a></li>
              <li><a href="#partnerships" className={styles.link}>Partnerships</a></li>
            </ul>
          </div>

          {/* Learn Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Learn</h3>
            <ul className={styles.linkList}>
              <li><a href="#guides" className={styles.link}>Meditation Guides</a></li>
              <li><a href="#blog" className={styles.link}>Blog</a></li>
              <li><a href="#tutorials" className={styles.link}>Video Tutorials</a></li>
              <li><a href="#research" className={styles.link}>Research</a></li>
              <li><a href="#faq" className={styles.link}>FAQ</a></li>
            </ul>
          </div>

          {/* Email Signup Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Stay Updated</h3>
            <p className={styles.signupDescription}>
              Get meditation tips and updates delivered to your inbox
            </p>
            <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
              <div className={styles.emailInputWrapper}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={styles.emailInput}
                  required
                  aria-label="Email address for newsletter signup"
                />
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <p className={styles.successMessage} role="status">
                  ✨ Thanks for subscribing! Check your email for confirmation.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            <p className={styles.copyright}>
              © 2024 ROOT Meditation. All rights reserved.
            </p>
          </div>
          <div className={styles.bottomRight}>
            <nav className={styles.legalNav} aria-label="Legal navigation">
              <a href="#privacy" className={styles.legalLink}>Privacy Policy</a>
              <a href="#terms" className={styles.legalLink}>Terms of Service</a>
              <a href="#cookies" className={styles.legalLink}>Cookie Policy</a>
              <a href="#accessibility" className={styles.legalLink}>Accessibility</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
