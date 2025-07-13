import { useState, useEffect } from 'react'
import { Button } from '../ui'
import styles from './Navigation.module.css'

export function Navigation() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'how-it-works']
      const scrollPosition = window.scrollY + 100 // Add offset for navbar height
      
      let newActiveSection = 'home' // Default to home
      
      // Check each section from bottom to top to find the current one
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section)
        if (element) {
          const elementTop = element.offsetTop
          
          // If we've scrolled past the start of this section, it's active
          if (scrollPosition >= elementTop) {
            newActiveSection = section
            break
          }
        }
      }
      
      // Debug logging (remove in production)

      
      // Only update if actually different
      setActiveSection(prev => prev !== newActiveSection ? newActiveSection : prev)
    }

    // Set initial active section and call handleScroll immediately
    handleScroll()

    // Use throttling for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, []) // Removed activeSection from dependency array to prevent unnecessary re-runs

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Immediately update active section for responsive feedback
      setActiveSection(sectionId)
    }
  }

  const isActive = (section: string) => activeSection === section

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  return (
    <>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className={styles.skipToMain}>
        Skip to main content
      </a>      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        <div className={styles.navContent}>          {/* Logo - Left */}
          <div className={styles.logoContainer}>
            <img 
              src="https://embrace-website-images.s3.us-east-2.amazonaws.com/logo.png"
              alt="Embraceland logo"
              className={styles.logoImage}
              loading="eager"
            />
            <a 
              href="#home" 
              className={styles.logo} 
              aria-label="iembraceland home"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('home')
              }}
            >
              Embraceland
            </a>
          </div>
          
          {/* Desktop Navigation - Center */}
          <ul className={styles.links} role="list">            <li>
              <a 
                href="#home" 
                className={`${styles.navLink} ${isActive('home') ? styles.active : ''}`}
                aria-current={isActive('home') ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('home')
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`${styles.navLink} ${isActive('about') ? styles.active : ''}`}
                aria-current={isActive('about') ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('about')
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className={`${styles.navLink} ${isActive('how-it-works') ? styles.active : ''}`}
                aria-current={isActive('how-it-works') ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('how-it-works')
                }}
              >
                How it works
              </a>
            </li>
          </ul>

          {/* CTA Button - Right */}
          <Button 
            variant="cta"
            size="medium"
            className={styles.ctaButton}
            aria-label="Purchase iEmbrace device"
            onClick={() => {
              // Add purchase logic here
            }}
          >
            Try for free
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="medium"
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            iconOnly
          >
            <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </div>
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <ul className={styles.mobileLinks} role="list">            <li>
              <a 
                href="#home" 
                className={`${styles.mobileNavLink} ${isActive('home') ? styles.active : ''}`}
                aria-current={isActive('home') ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('home')
                  closeMobileMenu()
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`${styles.mobileNavLink} ${isActive('about') ? styles.active : ''}`}
                aria-current={isActive('about') ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('about')
                  closeMobileMenu()
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className={`${styles.mobileNavLink} ${isActive('how-it-works') ? styles.active : ''}`}
                aria-current={isActive('how-it-works') ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('how-it-works')
                  closeMobileMenu()
                }}
              >
                How it works
              </a>
            </li>
            <li>
              <Button 
                variant="cta"
                size="large"
                className={styles.mobileCta}
                aria-label="Purchase iEmbrace device"
                onClick={() => {
                  closeMobileMenu()
                  // Add purchase logic here
                }}
                isMobile={true}
              >
                Buy iEmbrace
              </Button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className={styles.mobileMenuOverlay}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
      </nav>
    </>
  )
}
