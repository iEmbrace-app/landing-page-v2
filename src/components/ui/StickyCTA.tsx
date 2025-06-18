import { useState, useEffect } from 'react'
import styles from './StickyCTA.module.css'

interface StickyCTAProps {
  isVisible?: boolean
  onPurchase?: () => void
}

export function StickyCTA({ isVisible = true, onPurchase }: StickyCTAProps) {
  const [isHidden, setIsHidden] = useState(false)
  // Hide/show based on scroll position or user preference
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA when user scrolls past the hero section
      const heroHeight = window.innerHeight
      const scrollY = window.scrollY
      setIsHidden(scrollY < heroHeight * 0.3) // Reduced from 0.8 to 0.3 for earlier visibility
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    if (onPurchase) {
      onPurchase()
    } else {
      // Default behavior - scroll to top or handle purchase
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!isVisible || isHidden) return null

  return (
    <div 
      className={styles.stickyContainer}
      role="banner"
      aria-label="Purchase action"
    >
      <button 
        className={styles.ctaButton}
        onClick={handleClick}
        aria-label="Purchase ROOT - Emotional Wellness Companion"
      >
        <span className={styles.buttonText}>Get ROOT</span>
        <span className={styles.buttonSubtext}>Start your journey</span>
      </button>
    </div>
  )
}
