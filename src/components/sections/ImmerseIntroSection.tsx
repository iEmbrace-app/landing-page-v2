import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ImmerseIntroSection.module.css'

interface ImmerseIntroSectionProps {
  className?: string
}

export function ImmerseIntroSection({ 
  className = '' 
}: ImmerseIntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className={`${styles.immerseIntroSection} ${className}`}
      aria-labelledby="immerse-intro-heading"
    >
      <motion.div 
        className={styles.content}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}
      >
        <h2 
          id="immerse-intro-heading"
          className={`${styles.title} ${!prefersReducedMotion && isInView ? styles.animateGradient : ''}`}
        >
          Discover Tranquil Sanctuaries for Your Inner Journey
        </h2>
        <p className={styles.subtitle}>
          Step into immersive environments where serenity meets mindfulness
        </p>
      </motion.div>
    </section>
  )
}

export default ImmerseIntroSection