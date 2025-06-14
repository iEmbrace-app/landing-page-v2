import { TabContent } from '../../types'
import styles from './TabContentDisplay.module.css'

interface TabContentDisplayProps {
  content: TabContent
  isMobile: boolean
}

export function TabContentDisplay({ content, isMobile }: TabContentDisplayProps) {
  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : styles.desktop}`}>
      <div className={`${styles.leftColumn} ${isMobile ? styles.mobile : styles.desktop}`}>
        {/* Main title */}
        <div className={styles.title}>
          {content.title}
        </div>
        
        {/* Icon placeholders */}
        <div className={styles.iconSmall} />
        <div className={styles.iconMedium} />
        <div className={styles.separator}></div>        
        {/* First feature */}
        <div className={styles.stepItem}>
          <div className={styles.stepIcon} />
          <div className={styles.stepText}>
            {content.features[0]}
          </div>
        </div>
        
        <div className={styles.separator}></div>
        
        {/* Main highlighted feature with description */}
        <div className={styles.stepContainer}>          <div className={`${styles.stepItem} ${styles.highlighted}`}>
            <div className={styles.stepIcon} />
            <div className={`${styles.stepText} ${styles.stepTextBold}`}>
              {content.features[1]}
            </div>
          </div>
          <div className={`${styles.stepText} ${styles.stepTextMuted}`}>
            {content.description}
          </div>
        </div>      </div>      <div className={`${styles.rightColumn} ${isMobile ? styles.mobile : styles.desktop}`}>
        [Image Placeholder 600x400]
      </div>
    </div>
  )
}
