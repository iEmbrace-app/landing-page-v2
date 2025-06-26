import { useState, useEffect } from 'react'
import { HiArrowRight } from 'react-icons/hi2'
import styles from './TestimonialSection.module.css'

// Types
interface Testimonial {
  id: string
  company: string
  quote: string
  author: {
    name: string
    role: string
    avatar: string
  }
  accentColor: string
  logoColor: string
}

interface TestimonialSectionProps {
  isMobile?: boolean
}

// Constants
const CAROUSEL_SETTINGS = {
  AUTO_PLAY_INTERVAL: 6000,
  PAUSE_DURATION: 10000,
  DEFAULT_ACTIVE_INDEX: 3, // Start with Dr. Michael Park
  CARDS_PER_VIEW: 5
}

// Testimonial data
const testimonials: Testimonial[] = [
  {
    id: 'sarah',
    company: 'Mindful Corp',
    quote: "This meditation app transformed our workplace wellness program. Employee stress levels decreased by 40% and productivity soared. The guided breathing exercises are phenomenal.",
    author: {
      name: 'Sarah Mitchell',
      role: 'Wellness Director',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=e9d5ff&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-violet-600 to-purple-600',
    logoColor: 'text-violet-600'
  },
  {
    id: 'david',
    company: 'Zen Studios',
    quote: "I've tried countless meditation apps, but this one truly understands mindfulness. The ASMR elements and nature sounds create the perfect atmosphere for deep meditation sessions.",
    author: {
      name: 'David Chen',
      role: 'Meditation Instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david&backgroundColor=fed7aa&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-orange-500 to-amber-500',
    logoColor: 'text-orange-600'
  },
  {
    id: 'emma',
    company: 'Wellness First',
    quote: "The hold and meditate feature is revolutionary. My anxiety has significantly reduced, and I sleep better than I have in years. This app is a game-changer for mental health.",
    author: {
      name: 'Emma Rodriguez',
      role: 'Therapist & Life Coach',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma&backgroundColor=e0e7ff&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-slate-600 to-zinc-700',
    logoColor: 'text-slate-700'
  },
  {
    id: 'michael',
    company: 'Balance Health',
    quote: "As a healthcare professional, I recommend this app to all my patients. The science-backed breathing techniques and calming environments deliver real therapeutic benefits.",
    author: {
      name: 'Dr. Michael Park',
      role: 'Clinical Psychologist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael&backgroundColor=f3f4f6&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-gray-900 to-black',
    logoColor: 'text-black'
  },
  {
    id: 'jessica',
    company: 'Inner Peace Co',
    quote: "The immersive video backgrounds transport me to tranquil places instantly. Combined with the ambient sounds, it's like having a personal retreat center in my pocket.",
    author: {
      name: 'Jessica Kumar',
      role: 'Mindfulness Coach',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica&backgroundColor=dbeafe&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-blue-600 to-indigo-600',
    logoColor: 'text-blue-600'
  },
  {
    id: 'alex',
    company: 'Calm Collective',
    quote: "This app helped me establish a consistent meditation practice. The gentle guidance and beautiful visuals make mindfulness accessible to everyone, regardless of experience level.",
    author: {
      name: 'Alex Thompson',
      role: 'Corporate Trainer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=c7d2fe&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-indigo-600 to-purple-600',
    logoColor: 'text-indigo-600'
  },
  {
    id: 'maria',
    company: 'Serenity Labs',
    quote: "The integration of technology and mindfulness is seamless. My clients love the app's intuitive design and the profound sense of calm it brings to their daily routines.",
    author: {
      name: 'Maria Santos',
      role: 'UX Researcher',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria&backgroundColor=a7f3d0&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-emerald-600 to-teal-600',
    logoColor: 'text-emerald-600'
  },
  {
    id: 'robert',
    company: 'Mindspace',
    quote: "After years of high-stress work, this app taught me how to find moments of peace throughout my day. The breathing exercises are scientifically sound and incredibly effective.",
    author: {
      name: 'Robert Lee',
      role: 'Executive & Entrepreneur',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert&backgroundColor=fde68a&mouth=smile&eyebrows=default&eyes=happy'
    },
    accentColor: 'from-purple-600 to-pink-600',
    logoColor: 'text-purple-600'
  }
]

// Company navigation logos
const CompanyLogos: Record<string, (props: { isActive?: boolean; color?: string }) => JSX.Element> = {
  sarah: ({ color = 'text-gray-400' }) => (
    <span className={`${color} font-medium tracking-[0.08em] text-[13px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      Mindful Corp
    </span>
  ),
  david: ({ color = 'text-gray-400' }) => (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[3px]">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-1 h-1 rounded-full ${color === 'text-gray-400' ? 'bg-gray-400' : 'bg-orange-500'} transition-all duration-500`}
          />
        ))}
      </div>
      <span className={`${color} font-medium text-[13px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        Zen Studios
      </span>
    </div>
  ),
  emma: ({ color = 'text-gray-400' }) => (
    <span className={`${color} font-light text-[13px] tracking-wide transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      Wellness First
    </span>
  ),
  michael: ({ color = 'text-gray-400' }) => (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-full ${color === 'text-gray-400' ? 'bg-gray-400' : 'bg-gray-900'} transition-all duration-500`} />
      <span className={`${color} font-medium text-[13px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        Balance Health
      </span>
    </div>
  ),
  jessica: ({ color = 'text-gray-400' }) => (
    <div className="flex items-center gap-1">
      <span className={`${color === 'text-gray-400' ? 'text-gray-400' : 'text-blue-600'} font-bold text-[15px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        ○
      </span>
      <span className={`${color} font-medium text-[13px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        Inner Peace Co
      </span>
    </div>
  ),
  alex: ({ color = 'text-gray-400' }) => (
    <span className={`${color} font-medium tracking-[0.08em] text-[13px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      Calm Collective
    </span>
  ),
  maria: ({ color = 'text-gray-400' }) => (
    <span className={`${color} font-medium text-[13px] transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      Serenity Labs
    </span>
  ),
  robert: ({ color = 'text-gray-400' }) => (
    <span className={`${color} font-medium text-[13px] tracking-wide transition-all duration-500`} style={{ fontFamily: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      Mindspace
    </span>
  )
}

// Card logos with elegant styling
const CardLogo = ({ company }: { company: string }) => {
  const logos: Record<string, JSX.Element> = {
    sarah: (
      <span className="text-[28px] font-semibold tracking-[0.02em] text-gray-900">
        MINDFUL CORP
      </span>
    ),
    david: (
      <div className="flex items-center gap-2.5">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full" 
            />
          ))}
        </div>
        <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
          Zen Studios
        </span>
      </div>
    ),
    emma: (
      <span className="text-[28px] font-light text-gray-900 tracking-wide">
        Wellness First
      </span>
    ),
    michael: (
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full" />
        <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
          Balance Health
        </span>
      </div>
    ),
    jessica: (
      <div className="flex items-center gap-2">
        <span className="text-[32px] font-bold text-blue-600">○</span>
        <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
          Inner Peace Co
        </span>
      </div>
    ),
    alex: (
      <span className="text-[28px] font-semibold tracking-[0.04em] text-gray-900">
        CALM COLLECTIVE
      </span>
    ),
    maria: (
      <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
        Serenity Labs
      </span>
    ),
    robert: (
      <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
        Mindspace
      </span>
    )
  }
  
  return logos[company.toLowerCase()] || (
    <span className="text-[28px] font-semibold text-gray-900">
      {company}
    </span>
  )
}

export function TestimonialSection({ isMobile }: TestimonialSectionProps) {
  const [activeIndex, setActiveIndex] = useState(CAROUSEL_SETTINGS.DEFAULT_ACTIVE_INDEX)
  const [isPaused, setIsPaused] = useState(false)
  
  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }, CAROUSEL_SETTINGS.AUTO_PLAY_INTERVAL)
      
      return () => clearInterval(interval)
    }
  }, [isPaused])
  
  // Get visible companies for navigation - always center the active company
  const getVisibleCompanies = () => {
    const allCompanies = testimonials.map(t => t.id)
    const totalCompanies = allCompanies.length
    const cardsPerView = CAROUSEL_SETTINGS.CARDS_PER_VIEW
    const centerOffset = Math.floor(cardsPerView / 2) // This will be 2 for 5 cards
    
    // Calculate start position to center the active company
    let start = activeIndex - centerOffset
    let end = start + cardsPerView
    
    // Handle edge cases - if we're at the beginning or end
    if (start < 0) {
      start = 0
      end = Math.min(cardsPerView, totalCompanies)
    } else if (end > totalCompanies) {
      end = totalCompanies
      start = Math.max(0, end - cardsPerView)
    }
    
    return allCompanies.slice(start, end)
  }

  const visibleCompanies = getVisibleCompanies()

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

  // Handle card interaction
  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index)
      setIsPaused(true)
      setTimeout(() => setIsPaused(false), CAROUSEL_SETTINGS.PAUSE_DURATION)
    }
  }

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <p className={styles.subtitle}>Trusted by wellness professionals</p>
          <h2 className={styles.title}>What our users are saying</h2>
          <p className={styles.description}>
            Discover how mindfulness transforms lives through our immersive meditation experience
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
                />
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <NavigationSection
          testimonials={testimonials}
          activeIndex={activeIndex}
          visibleCompanies={visibleCompanies}
          isMobile={isMobile}
          onCardClick={handleCardClick}
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
}

function TestimonialCard({ testimonial, cardStyle, isActive, isMobile, onClick }: TestimonialCardProps) {
  return (
    <div
      className={`${styles.card} ${cardStyle.className}`}
      style={{
        transform: cardStyle.transform,
        opacity: cardStyle.opacity,
        zIndex: cardStyle.zIndex,
        filter: cardStyle.filter,
        width: isMobile ? '300px' : '720px'
      }}
    >
      <div 
        className={`${styles.cardContent} ${
          isActive ? styles.cardActive : styles.cardInactive
        }`}
        onClick={onClick}
      >
        {/* Premium gradient accent */}
        <div className={`${styles.cardAccent} bg-gradient-to-r ${testimonial.accentColor}`} />
        
        <div className={styles.cardBody}>
          {/* Company Logo */}
          <div className={styles.logoContainer}>
            <CardLogo company={testimonial.id} />
          </div>

          {/* Quote */}
          <p className={styles.quote}>
            "{testimonial.quote}"
          </p>

          {/* Author section */}
          <div className={styles.authorSection}>
            <div className={styles.authorInfo}>
              <div className={styles.avatarContainer}>
                <img 
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  className={styles.avatar}
                />
                <div className={styles.avatarRing} />
              </div>
              <div className={styles.authorDetails}>
                <p className={styles.authorName}>{testimonial.author.name}</p>
                <p className={styles.authorRole}>{testimonial.author.role}</p>
              </div>
            </div>
            
            {isActive && (
              <button className={styles.readMoreBtn}>
                Read more
                <HiArrowRight className={styles.readMoreIcon} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Navigation Section Component
interface NavigationSectionProps {
  testimonials: Testimonial[]
  activeIndex: number
  visibleCompanies: string[]
  isMobile?: boolean
  onCardClick: (index: number) => void
}

function NavigationSection({ 
  testimonials, 
  activeIndex, 
  visibleCompanies, 
  isMobile, 
  onCardClick 
}: NavigationSectionProps) {
  return (
    <div className={styles.navigation}>
      {/* Progress indicators */}
      <div className={styles.progressIndicators}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => onCardClick(index)}
            className={`${styles.progressDot} ${
              index === activeIndex ? styles.progressDotActive : styles.progressDotInactive
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {!isMobile && (
        <>
          {/* Company logos */}
          <div className={styles.companyLogos}>
            {/* Left fade overlay */}
            <div className={styles.fadeOverlayLeft}></div>
            {/* Right fade overlay */}
            <div className={styles.fadeOverlayRight}></div>
            
            {visibleCompanies.map((company) => {
              const companyIndex = testimonials.findIndex(t => t.id === company)
              const isActive = companyIndex === activeIndex
              const testimonial = testimonials[companyIndex]
              
              return (
                <button
                  key={company}
                  onClick={() => onCardClick(companyIndex)}
                  className={`${styles.companyLogo} ${
                    isActive ? styles.companyLogoActive : styles.companyLogoInactive
                  }`}
                  aria-label={`View ${testimonial.company} testimonial`}
                >
                  {CompanyLogos[company]({ 
                    isActive, 
                    color: isActive ? testimonial.logoColor : 'text-gray-400' 
                  })}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
