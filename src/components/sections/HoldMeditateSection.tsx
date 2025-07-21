import { useAnalytics } from '../../hooks/useAnalytics'
import styles from './HoldMeditateSection.module.css'

// Define the column data to reduce repetition
const columns = [
  {
    id: 'select',
    title: 'SELECT',
    description: 'Choose a scene to begin your session',
    image: 'https://embrace-website-images.s3.us-east-2.amazonaws.com/select.png',
    alt: 'Select - Choose a scene interface'
  },
  {
    id: 'immerse',
    title: 'IMMERSE',
    description: 'Feel the immersive view and haptics guide your breath',
    image: 'https://embrace-website-images.s3.us-east-2.amazonaws.com/immerse.png',
    alt: 'Immerse - Guided breathing with haptic feedback'
  },
  {
    id: 'journal',
    title: 'JOURNAL',
    description: 'Reflect and save your thoughts post-session',
    image: 'https://embrace-website-images.s3.us-east-2.amazonaws.com/journal.png',
    alt: 'Journal - Post-session reflection and tracking'
  }
]

interface HoldMeditateSectionProps {
  isMobile?: boolean;
}

export function HoldMeditateSection({ isMobile }: HoldMeditateSectionProps) {
  // Analytics tracking
  const { trackEvent, sectionRef } = useAnalytics({ 
    sectionName: 'hold_meditate_section' 
  })

  // Track column interactions
  const handleColumnInteraction = (columnId: string, columnTitle: string) => {
    trackEvent('feature_column_view', {
      column_id: columnId,
      column_title: columnTitle,
      section: 'hold_meditate',
      is_mobile: isMobile
    })
  }

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="hold-meditate-section"
      className={styles.section}
      aria-labelledby="hold-meditate-title"
    >
      <div className={styles.sectionContent}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          {/* Header Section - positioned on right side */}
          <header className={styles.headerSection}>
            <h2 id="hold-meditate-title" className={styles.mainTitle}>
              Just hold it and let yourself feel
            </h2>
            
            <p className={styles.description}>
              iEmbraceland provides soothing haptic feedback that helps you reconnect with calm, one vibration at a time
            </p>
          </header>
        </div>

        {/* Bottom Section - Three columns */}
        <div className={styles.bottomSection} role="list">
          {columns.map((column) => (
            <article 
              key={column.id} 
              className={styles.column}
              role="listitem"
              onClick={() => handleColumnInteraction(column.id, column.title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleColumnInteraction(column.id, column.title)
                }
              }}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <h3 className={styles.columnTitle}>
                {column.title}
              </h3>
              <p className={styles.columnDescription}>
                {column.description}
              </p>
              <div 
                className={styles.phoneFrame}
                role="img"
                aria-label={column.alt}
              >
                <img 
                  src={column.image} 
                  alt={column.alt}
                  className={styles.phoneScreen}
                  loading="lazy"
                  width="300"
                  height="600"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}