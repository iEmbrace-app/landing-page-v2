import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './NFCPlayerSection.module.css'
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md"
import { TbNfc } from "react-icons/tb"

interface NFCPlayerSectionProps {
  isMobile?: boolean
}

export function NFCPlayerSection({ isMobile }: NFCPlayerSectionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(false)
  
  const nfcCards = [
    {
      id: 1,
      image: "https://embrace-website-images.s3.us-east-2.amazonaws.com/nfc-card-one.png",
      title: "Gentle Rain & Thunder",
      artist: "Peaceful Nature Collection",
      description: "Immerse yourself in the calming sounds of gentle rainfall and distant thunder"
    },
    {
      id: 2,
      image: "https://embrace-website-images.s3.us-east-2.amazonaws.com/nfc-card-two.png",
      title: "Forest Meditation",
      artist: "Woodland Serenity Series",
      description: "Deep forest ambience with birds chirping and rustling leaves"
    },
    {
      id: 3,
      image: "https://embrace-website-images.s3.us-east-2.amazonaws.com/nfc-card-three.png",
      title: "Ocean Waves",
      artist: "Coastal Mindfulness",
      description: "Rhythmic ocean waves meeting the shore for ultimate relaxation"
    }
  ]

  const nextCard = () => {
    setImageLoading(true)
    setCurrentCardIndex(prev => (prev + 1) % nfcCards.length)
  }

  const prevCard = () => {
    setImageLoading(true)
    setCurrentCardIndex(prev => (prev - 1 + nfcCards.length) % nfcCards.length)
  }

  return (
    <section className={`${styles.nfcPlayerSection} ${isMobile ? styles.mobile : styles.desktop}`}>
      
      <div className={styles.sectionContainer}>
        <div className={styles.contentGrid}>
          {/* Image Area */}
          <motion.div 
            className={styles.imageArea}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className={styles.imageContainer}>
              {imageLoading && <div className={styles.imagePlaceholder}>Loading...</div>}
              <motion.img 
                key={currentCardIndex}
                src={nfcCards[currentCardIndex].image}
                alt={`NFC Soundscape Card - ${nfcCards[currentCardIndex].title}`}
                className={styles.mainImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              
              {/* NFC Badge */}
              <div className={styles.nfcIndicator}>
                <TbNfc />
              </div>
              
              {/* Audio Status */}
              <div className={styles.audioStatus}>
                Ready to Play
              </div>
              
              {/* Navigation Arrows */}
              <button 
                className={`${styles.navArrow} ${styles.prevArrow}`}
                onClick={prevCard}
                aria-label="Previous card"
              >
                <MdArrowBackIos />
              </button>
              <button 
                className={`${styles.navArrow} ${styles.nextArrow}`}
                onClick={nextCard}
                aria-label="Next card"
              >
                <MdArrowForwardIos />
              </button>
              
              {/* Card Indicators */}
              <div className={styles.cardIndicators}>
                {nfcCards.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${index === currentCardIndex ? styles.active : ''}`}
                    onClick={() => {
                      setCurrentCardIndex(index)
                    }}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className={styles.contentArea}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className={styles.contentHeader}>
              <h2 className={`gradient-text-primary ${styles.mainTitle}`}>
                Experience Tranquil Soundscapes
              </h2>
              <p className={styles.description}>
                {nfcCards[currentCardIndex].description}. Simply tap your phone to instantly access calming audio experiences designed to reduce stress and enhance well-being.
              </p>
            </div>

            {/* Track Display */}
            <motion.div 
              className={styles.trackDisplay}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Current Track */}
              <div className={styles.playInstruction}>
                <TbNfc />
                Tap your phone to the NFC card to play
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              className={styles.ctaSection}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className={styles.ctaMessage}>
                Begin your journey to inner peace with instant access to calming soundscapes
              </p>
              <div className={styles.ctaButtons}>
                <button className={`${styles.ctaBtn} ${styles.ctaPrimary}`}>
                  Order Your Card
                </button>
                <button className={`${styles.ctaBtn} ${styles.ctaSecondary}`}>
                  Listen to Sample
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
