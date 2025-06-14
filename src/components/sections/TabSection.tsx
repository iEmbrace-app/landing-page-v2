import { useState, useEffect, useRef } from 'react'
import { TabKey, TabContentData } from '../../types'
import { TabButton } from '../ui/TabButton'
import mindfulnessIcon from '../../assets/icons/mindfulness 1.svg'
import rippleIcon from '../../assets/icons/ripple.svg'
import sineIcon from '../../assets/icons/sine.svg'
import styles from './TabSection.module.css'

interface TabSectionProps {
  isMobile: boolean
  tabContent: TabContentData
}

const TAB_CONFIG = [
  { key: 'anchor-focus' as TabKey, label: 'Anchor Focus' },
  { key: 'release-stress' as TabKey, label: 'Release Stress' },
  { key: 'enhance-sleep' as TabKey, label: 'Enhance Sleep' },
  { key: 'sync-mind-body' as TabKey, label: 'Sync Mind & Body' },
  { key: 'practice-stillness' as TabKey, label: 'Practice Stillness' }
]

export function TabSection({ isMobile, tabContent }: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('anchor-focus')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Reset expanded item when tab changes
  useEffect(() => {
    setExpandedItem(null)
  }, [activeTab])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleTabClick = (tabKey: TabKey) => {
    setActiveTab(tabKey)
    if (isMobile) {
      setIsDropdownOpen(false) // Close dropdown when tab is selected on mobile
    }
    // Remove the immediate setExpandedItem(null) since useEffect handles it
  }
  
  const toggleExpanded = (itemKey: string) => {
    setExpandedItem(prev => prev === itemKey ? null : itemKey)
  }
  const renderExpandableItem = (
    iconSrc: string,
    title: string,
    description: string,
    itemKey: string
  ) => {
    const isExpanded = expandedItem === itemKey
    
    return (
      <div key={itemKey} className={styles.expandableItemWrapper}>
        <div 
          onClick={() => toggleExpanded(itemKey)}
          className={styles.expandableItemHeader}
        >
          <img src={iconSrc} alt="" className={styles.expandableItemIcon} />
          <div className={`${styles.expandableItemTitle} ${isExpanded ? styles.expanded : ''}`}>
            {title}
          </div>
        </div>
        
        <div className={`${styles.expandableItemDescription} ${isExpanded ? styles.expanded : ''}`}>
          <div className={styles.expandableItemContent}>
            {description}
          </div>
        </div>
        
        <div className={styles.expandableItemSeparator}></div>
      </div>
    )
  }
    return (
    <div className={`${styles.section} ${isMobile ? styles.mobile : ''}`}>      
      {/* Header Section */}
      <div className={`${styles.headerSection} ${styles.headerSectionWithMargin} ${isMobile ? styles.mobile : ''}`}>            
        <div className={`gradient-text-primary ${styles.gradientTextPrimary} ${isMobile ? styles.mobile : ''}`}>
          Measure how deeply you're grounding
        </div>        
        <div className={`${styles.description} ${styles.descriptionWithMargin} ${isMobile ? styles.mobile : ''}`}>
          Root captures your emotional and sensory engagement in real time combining audio, haptics, and AI-curated calm to give you a single, personalized Mental Immersion Score.
        </div>
      </div>        {/* Tab and Content Section */}
      <div className={styles.tabContentWrapper}>          {/* Tab Buttons - Desktop horizontal layout, Mobile dropdown */}
        {isMobile ? (
          <div className={`${styles.dropdownWrapper} ${styles.mobile}`} ref={dropdownRef}>
            <button 
              className={`${styles.dropdownButton} ${isDropdownOpen ? styles.open : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className={styles.dropdownButtonText}>
                {TAB_CONFIG.find(tab => tab.key === activeTab)?.label}
              </span>
              <svg 
                className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.rotated : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                aria-hidden="true"
              >
                <path 
                  d="M4 6L8 10L12 6" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu} role="listbox">
                {TAB_CONFIG.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`${styles.dropdownOption} ${activeTab === key ? styles.active : ''}`}
                    onClick={() => handleTabClick(key)}
                    role="option"
                    aria-selected={activeTab === key}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={`${styles.tabButtonsWrapper}`}>
            {TAB_CONFIG.map(({ key, label }) => (
              <TabButton
                key={key}
                tabKey={key}
                label={label}
                isActive={activeTab === key}
                isMobile={isMobile}
                onClick={handleTabClick}
              />
            ))}
          </div>
        )}
        {/* Content section with 12-column grid */}
        <div className={`grid-container ${styles.gridContainer} ${isMobile ? '' : ''}`}>
          {/* Left content with expandable items - Columns 1-6 */}
          <div className={`col-12 md:col-6 ${styles.leftContentColumn} ${isMobile ? styles.mobile : ''}`}>
            {/* Dynamic expandable content */}
            {renderExpandableItem(
              mindfulnessIcon,
              (tabContent as any)[activeTab].features[0],
              "Let rhythmic sensations and guided breath redirect racing thoughts—helping your mind slow down and return to calm, one pulse at a time.",
              `${activeTab}-feature-1`
            )}

            {renderExpandableItem(
              rippleIcon,
              (tabContent as any)[activeTab].features[1],
              "Experience deeper states of mindfulness through synchronized breathing patterns and gentle haptic feedback that guide your nervous system into relaxation.",
              `${activeTab}-feature-2`
            )}

            {renderExpandableItem(
              sineIcon,
              (tabContent as any)[activeTab].description,
              "Advanced biometric sensors track your heart rate variability and breathing patterns to provide real-time feedback on your meditation depth and emotional state.",
              `${activeTab}-feature-3`
            )}
          </div>          
          {/* Right image placeholder - Columns 7-12 */}
          <div className={`col-12 md:col-6 ${styles.rightImageColumn} ${isMobile ? styles.mobile : ''}`}>
            [Image Placeholder 600x400]
          </div>
        </div>
      </div>
    </div>
  )
}
