import { useState, useEffect } from 'react'
import { TbNfc } from 'react-icons/tb'
import { Button } from '../ui'
import { useAnalytics } from '../../hooks/useAnalytics'
import styles from './NFCSection.module.css'

interface NFCSectionProps {
  isMobile?: boolean
}

export function NFCSection({ isMobile = false }: NFCSectionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(1) // Start with middle card active
  
  // Analytics tracking
  const { trackEvent, sectionRef } = useAnalytics({ 
    sectionName: 'nfc_section' 
  })

  const nfcCards = [
    {
      id: 1,
      image: "https://embrace-website-images-dst.s3.us-east-2.amazonaws.com/nfc-card-one.png",
      title: "Meditate with Aliens",
      artist: "Feel Beyond Limitations",
      description: "Immerse yourself in the calming sounds of gentle rainfall and distant thunder"
    },
    {
      id: 2,
      image: "https://embrace-website-images-dst.s3.us-east-2.amazonaws.com/nfc-card-two.png",
      title: "Facing Uncertainty",
      artist: "Open your heart to the unknown",
      description: "Deep forest ambience with birds chirping and rustling leaves"
    },
    {
      id: 3,
      image: "https://embrace-website-images-dst.s3.us-east-2.amazonaws.com/nfc-card-three.png",
      title: "Mindful Walking",
      artist: "Feel Each Step",
      description: "Rhythmic ocean waves meeting the shore for ultimate relaxation"
    }
  ]

  // Track ONLY manual card clicks
  const handleManualCardChange = (newIndex: number) => {
    setCurrentCardIndex(newIndex)
    trackEvent('nfc_card_click', {
      card_name: nfcCards[newIndex].title,
      card_index: newIndex,
      is_mobile: isMobile
    })
  }

  // Track CTA click
  const handleExploreClick = () => {
    trackEvent('cta_click', {
      button_text: 'Explore NFC Cards',
      button_location: 'nfc_section',
      destination: 'shopify_store',
      current_card: nfcCards[currentCardIndex].title
    })
  }

  // Auto-rotate cards every 5 seconds (NO TRACKING)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex(prev => (prev + 1) % nfcCards.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [nfcCards.length])

  const getCardPositionClass = (index: number) => {
    // Don't apply position classes on mobile - let CSS handle it
    if (isMobile) return ''
    
    if (index === 0) return styles.card0
    if (index === 1) return styles.card1
    if (index === 2) return styles.card2
    return ''
  }

  const getCardTransform = (index: number) => {
    // Only apply transforms for desktop
    if (isMobile) return undefined
    
    if (index === currentCardIndex) {
      return 'translate(-50%, -60%) translateZ(50px) scale(1.15)'
    } else if (index < currentCardIndex) {
      const offset = (index - currentCardIndex) * 80
      return `translate(-50%, -60%) translateX(${offset}px) translateZ(-100px) rotateY(15deg)`
    } else {
      const offset = (index - currentCardIndex) * 80
      return `translate(-50%, -60%) translateX(${offset}px) translateZ(-100px) rotateY(-15deg)`
    }
  }

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="nfc-soundscapes"
      aria-label="NFC Soundscapes Experience"
      className={styles.section}
    >
      {/* Background Elements - Subtle lavender accents */}
      <div className={styles.backgroundDots} />
      <div className={styles.backgroundBlurTop} />
      <div className={styles.backgroundBlurBottom} />

      <div className={styles.container}>
        {/* Main Card Container */}
        <div className={`${styles.mainCard} ${isMobile ? styles.mobile : ''}`}>
          {/* Left Side - Content */}
          <div className={`${styles.leftContent} ${isMobile ? styles.mobile : ''}`}>
            <h1 className={`${styles.heading} ${isMobile ? styles.mobile : ''}`}>
              Mindful Gifts for Beloved:
              <br />
              <span className={styles.headingAccent}>Gift Your Mindfulness!</span>
            </h1>
            
            <p className={`${styles.description} ${isMobile ? styles.mobile : ''}`}>
              We believe mindfulness can be shared with your loved ones! Each NFC Mindful Card is a physical gateway to a digital moment of peace. Simply tap your phone to the card, watch as a personalized scene launches, and experience mindfulness together — no searching, no setup.
            </p>

            <p className={`${styles.subDescription} ${isMobile ? styles.mobile : ''}`}>
              Want to explore?
            </p>

            {/* CTA Button */}
            <a 
              href="https://n66bxs-8y.myshopify.com/products/mindfulness-nfc-postcard-floating-in-space?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              onClick={handleExploreClick}
            >
              <Button 
                variant="cta" 
                size={isMobile ? "medium" : "large"}
                isMobile={isMobile}
              >
                Explore NFC Cards →
              </Button>
            </a>
          </div>

          {/* Right Side - NFC Card Showcase */}
          <div className={`${styles.rightContent} ${isMobile ? styles.mobile : ''}`}>
            {/* 3D Card Showcase */}
            <div className={`${styles.cardsContainer} ${isMobile ? styles.mobile : ''}`}>
              {nfcCards.map((card, index) => {
                // On mobile, only render the current card
                if (isMobile && index !== currentCardIndex) {
                  return null
                }

                return (
                  <div
                    key={card.id}
                    className={`${styles.cardWrapper} ${
                      getCardPositionClass(index)
                    } ${
                      index === currentCardIndex ? styles.active : ''
                    } ${isMobile ? styles.mobile : ''} ${
                      isMobile && index === currentCardIndex ? styles.card1 : ''
                    }`}
                    style={{
                      // Only apply inline styles for desktop
                      ...(isMobile ? {} : {
                        transform: getCardTransform(index),
                        opacity: index === currentCardIndex ? 1 : 0.7,
                        zIndex: index === currentCardIndex ? 5 : 1
                      })
                    }}
                    onClick={() => {
                      if (!isMobile && index !== currentCardIndex) {
                        handleManualCardChange(index)
                      }
                    }}
                  >
                    <img 
                      src={card.image}
                      alt={`NFC Soundscape Card - ${card.title}`}
                      className={`${styles.cardImage} ${isMobile ? styles.mobile : ''} ${
                        index === currentCardIndex ? styles.active : ''
                      }`}
                    />
                    
                    {index === currentCardIndex && (
                      <div className={styles.nfcIcon}>
                        <TbNfc />
                      </div>
                    )}

                    {/* Card Info Display */}
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>
                        {card.title}
                      </h3>
                      <p className={styles.cardArtist}>
                        {card.artist}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}