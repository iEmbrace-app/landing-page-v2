import { useRef } from 'react'
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion'
import styles from './ImmerseIntroSection.module.css'

interface ImmerseIntroSectionProps {
  className?: string
}

const animationVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

export function ImmerseIntroSection({ 
  className = '' 
}: ImmerseIntroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { 
    once: true, 
    margin: '-10%' // More responsive margin
  })
  const prefersReducedMotion = useReducedMotion() // Framer Motion's built-in hook

  return (
    <section 
      ref={sectionRef}
      className={`${styles.immerseIntroSection} ${className}`.trim()}
      aria-labelledby="immerse-intro-heading"
    >
      <motion.div 
        className={styles.content}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate={isInView ? "visible" : "hidden"}
        variants={animationVariants}
      >
        <h2 
          id="immerse-intro-heading"
          className={`${styles.title} ${(!prefersReducedMotion && isInView) ? styles.animateGradient : ''}`}
        >
          Discover Tranquility for Your Inner Journey
        </h2>
        <p className={styles.subtitle}>
          Step into immersive environments with guided journeys designed to calm your mind, nurture emotions, and help you reconnect with yourself.
        </p>
      </motion.div>
    </section>
  )
}

export default ImmerseIntroSection