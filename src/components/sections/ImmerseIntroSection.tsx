import styles from './ImmerseIntroSection.module.css'

interface ImmerseIntroSectionProps {
  isMobile?: boolean
}

export function ImmerseIntroSection({ isMobile }: ImmerseIntroSectionProps) {
  return (
    <section className={`${styles.immerseIntroSection} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Discover Tranquil Sanctuaries for Your Inner Journey
        </h2>
        <p className={styles.subtitle}>
          Step into immersive environments where serenity meets mindfulness
        </p>
      </div>
    </section>
  )
}
