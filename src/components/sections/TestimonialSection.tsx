import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './TestimonialSection.module.css'

// Types
interface Testimonial {
  id: string
  quote: string
  author: {
    name: string
  }
  accentColor: string
}

interface TestimonialSectionProps {
  isMobile?: boolean
}

// Constants
const CAROUSEL_SETTINGS = {
  AUTO_PLAY_INTERVAL: 6000,
  PAUSE_DURATION: 10000,
  DEFAULT_ACTIVE_INDEX: 3,
  CARDS_PER_VIEW: 5
}

// Testimonial data
const testimonials: Testimonial[] = [
  {
    id: 'sarah',
    quote: "This application is saving my life. The body scan brought awareness to tension I didn't realize I was holding.",
    author: {
      name: 'Social Worker'
    },
    accentColor: 'from-violet-600 to-purple-600'
  },
  {
    id: 'david',
    quote: "I felt transported to each place. The vivid narration and perfectly-timed vibrations kept me completely immersed in the moment.",
    author: {
      name: 'Harvard iLab Security Guard'
    },
    accentColor: 'from-orange-500 to-amber-500'
  },
  {
    id: 'emma',
    quote: "After just 2 minutes, I felt noticeably more relaxed. The forest soundscape created an instant sense of calm.",
    author: {
      name: 'Hardware Engineer'
    },
    accentColor: 'from-slate-600 to-zinc-700'
  },
  {
    id: 'michael',
    quote: "Fantastic experience! The balance of background sounds with clear guidance creates the perfect meditation environment.",
    author: {
      name: 'Harvard PhD Students'
    },
    accentColor: 'from-gray-900 to-black'
  },
  {
    id: 'jessica',
    quote: "Amazing how quickly this brings awareness to physical tension. It's become an essential part of my daily practice.",
    author: {
      name: 'Neuroscientist, Harvard University'
    },
    accentColor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'alex',
    quote: "This app transformed how I experience mindfulness. The immersive elements and guided sessions are truly life-changing.",
    author: {
      name: 'Anonymous user'
    },
    accentColor: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'maria',
    quote: "The perfect integration of sensory elements. Vibrations, sounds, and visuals work together to create deep meditative states.",
    author: {
      name: 'Anonymous user'
    },
    accentColor: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'robert',
    quote: "Incredible for stress relief. The forest meditation and body scan sessions have revolutionized my approach to wellness.",
    author: {
      name: 'Stressed professional'
    },
    accentColor: 'from-purple-600 to-pink-600'
  }
]

export function TestimonialSection({ isMobile }: TestimonialSectionProps) {
  const [activeIndex, setActiveIndex] = useState(CAROUSEL_SETTINGS.DEFAULT_ACTIVE_INDEX)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  // Intersection Observer for performance optimization
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  // Auto-play functionality - only when visible
  useEffect(() => {
    if (!isPaused && isVisible) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }, CAROUSEL_SETTINGS.AUTO_PLAY_INTERVAL)
      
      return () => clearInterval(interval)
    }
  }, [isPaused, isVisible])
  
  // Optimized card click handler
  const handleCardClick = useCallback((index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index)
      setIsPaused(true)
      setTimeout(() => setIsPaused(false), CAROUSEL_SETTINGS.PAUSE_DURATION)
    }
  }, [activeIndex])

  // Calculate 3D card positioning and styling
  const getCardStyle = (index: number) => {
    const distance = Math.abs(index - activeIndex)
    const baseTransition = 'transition-all duration-1000 ease-out'
    
    if (distance === 0) {
      // Active card - center position
      return {
        transform: 'translateX(0) scale(1) translateZ(0)',
        opacity: 1,
        zIndex: 30,
        filter: 'blur(0px) brightness(1)',
        className: baseTransition
      }
    } else if (distance === 1) {
      // Adjacent cards
      const direction = index < activeIndex ? -1 : 1
      return {
        transform: `translateX(${direction * (isMobile ? 320 : 380)}px) scale(${isMobile ? 0.85 : 0.92}) translateZ(-80px)`,
        opacity: 0.3,
        zIndex: 20,
        filter: 'blur(0.8px) brightness(0.97)',
        className: baseTransition
      }
    } else if (distance === 2) {
      // Second tier cards
      const direction = index < activeIndex ? -1 : 1
      return {
        transform: `translateX(${direction * (isMobile ? 480 : 560)}px) scale(${isMobile ? 0.75 : 0.86}) translateZ(-150px)`,
        opacity: 0.08,
        zIndex: 10,
        filter: 'blur(2px) brightness(0.95)',
        className: baseTransition
      }
    } else {
      // Hidden cards
      const direction = index < activeIndex ? -1 : 1
      return {
        transform: `translateX(${direction * (isMobile ? 600 : 700)}px) scale(${isMobile ? 0.7 : 0.8}) translateZ(-200px)`,
        opacity: 0,
        zIndex: 0,
        filter: 'blur(4px) brightness(0.9)',
        className: baseTransition
      }
    }
  }

  return (
    <section ref={sectionRef} className={styles.testimonialSection} aria-label="Customer testimonials">
      {/* Skip link for accessibility */}
      <a href="#testimonial-content" className={styles.skipLink}>
        Skip to testimonials content
      </a>
      
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header} id="testimonial-content">
          <p className={styles.subtitle} role="text">Trusted by wellness professionals</p>
          <h2 className={styles.title}>What our users are saying</h2>
          <p className={styles.description} role="text">
            Discover how mindfulness transforms lives through our immersive experience
          </p>
        </header>

        {/* 3D Carousel Container */}
        <div 
          className={styles.carouselContainer}
          style={{ perspective: '2000px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={styles.carouselInner}>
            {testimonials.map((testimonial, index) => {
              const cardStyle = getCardStyle(index)
              const isActive = index === activeIndex
              
              return (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  cardStyle={cardStyle}
                  isActive={isActive}
                  isMobile={isMobile}
                  onClick={() => handleCardClick(index)}
                  cardIndex={index}
                />
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <NavigationSection
          activeIndex={activeIndex}
          totalCount={testimonials.length}
          onDotClick={handleCardClick}
        />
      </div>
    </section>
  )
}

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial
  cardStyle: any
  isActive: boolean
  isMobile?: boolean
  onClick: () => void
  cardIndex: number
}

function TestimonialCard({ testimonial, cardStyle, isActive, isMobile, onClick, cardIndex }: TestimonialCardProps) {
  return (
    <article
      className={`${styles.card} ${cardStyle.className}`}
      style={{
        transform: cardStyle.transform,
        opacity: cardStyle.opacity,
        zIndex: cardStyle.zIndex,
        filter: cardStyle.filter,
        width: isMobile ? '300px' : '720px'
      }}
      role="tabpanel"
      id={`testimonial-${cardIndex}`}
      aria-label={`Testimonial ${cardIndex + 1}`}
    >
      <div 
        className={`${styles.cardContent} ${
          isActive ? styles.cardActive : styles.cardInactive
        }`}
        onClick={onClick}
        tabIndex={isActive ? 0 : -1}
        role="button"
        aria-pressed={isActive}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
      >
        {/* Premium gradient accent */}
        <div className={`${styles.cardAccent} bg-gradient-to-r ${testimonial.accentColor}`} aria-hidden="true" />
        
        <div className={styles.cardBody}>
          {/* Quote */}
          <blockquote className={styles.quote}>
            "{testimonial.quote}"
          </blockquote>

          {/* Author section */}
          <div className={styles.authorSection}>
            <p className={styles.authorName}>— {testimonial.author.name}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

// Navigation Section Component
interface NavigationSectionProps {
  activeIndex: number
  totalCount: number
  onDotClick: (index: number) => void
}

function NavigationSection({ 
  activeIndex, 
  totalCount,
  onDotClick 
}: NavigationSectionProps) {
  return (
    <nav className={styles.navigation} role="tablist" aria-label="Testimonial navigation">
      {/* Dot navigation */}
      <div className={styles.dotNavigation}>
        {Array.from({ length: totalCount }).map((_, index) => {
          const isActive = index === activeIndex
          
          return (
            <button
              key={index}
              onClick={() => onDotClick(index)}
              className={`${styles.dot} ${
                isActive ? styles.dotActive : styles.dotInactive
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`testimonial-${index}`}
              aria-label={`Go to testimonial ${index + 1}`}
              tabIndex={isActive ? 0 : -1}
            >
            </button>
          )
        })}
      </div>
    </nav>
  )
}