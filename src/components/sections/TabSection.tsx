import { useState, useEffect, useRef } from 'react'
import { TabKey, TabContentData } from '../../types'
import { TabButton } from '../ui/TabButton'
import { Button } from '../ui'
import { useAnalytics } from '../../hooks/useAnalytics'
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

// Map each tab to its corresponding image
const TAB_IMAGES: Record<TabKey, string> = {
  'anchor-focus': 'https://embrace-website-images.s3.us-east-2.amazonaws.com/mindful.jpeg',
  'release-stress': 'https://embrace-website-images.s3.us-east-2.amazonaws.com/stress.jpeg',
  'enhance-sleep': 'https://embrace-website-images.s3.us-east-2.amazonaws.com/sleep.jpeg',
  'sync-mind-body': 'https://embrace-website-images.s3.us-east-2.amazonaws.com/sync.jpeg',
  'practice-stillness': 'https://embrace-website-images.s3.us-east-2.amazonaws.com/stillness.jpeg'
}

// Alt text descriptions for each tab image
const TAB_IMAGE_ALTS: Record<TabKey, string> = {
  'anchor-focus': 'Mindful meditation and wellness',
  'release-stress': 'Stress relief and relaxation techniques',
  'enhance-sleep': 'Sleep enhancement and restful meditation',
  'sync-mind-body': 'Mind-body synchronization and balance',
  'practice-stillness': 'Stillness practice and deep meditation'
}

export function TabSection({ isMobile, tabContent }: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('anchor-focus')
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const previousTabRef = useRef<TabKey>(activeTab)

  // Analytics tracking - sectionRef is the actual ref we'll use
  const { trackEvent, sectionRef } = useAnalytics({ 
    sectionName: 'features_section' 
  })

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
    // Track tab change
    trackEvent('feature_tab_click', {
      tab_name: TAB_CONFIG.find(t => t.key === tabKey)?.label,
      tab_key: tabKey,
      previous_tab: previousTabRef.current,
      previous_tab_name: TAB_CONFIG.find(t => t.key === previousTabRef.current)?.label,
      is_mobile: isMobile
    })

    previousTabRef.current = tabKey
    setActiveTab(tabKey)
    
    if (isMobile) {
      setIsDropdownOpen(false) // Close dropdown when tab is selected on mobile
    }
  }
  
  const toggleExpanded = (itemKey: string) => {
    const isExpanding = expandedItem !== itemKey
    const itemType = itemKey.includes('feature-1') ? 'feature_1' : 
                    itemKey.includes('feature-2') ? 'feature_2' : 'description'
    
    // Track feature item expansion/collapse
    trackEvent('feature_item_toggle', {
      item_key: itemKey,
      item_type: itemType,
      action: isExpanding ? 'expand' : 'collapse',
      active_tab: activeTab,
      active_tab_name: TAB_CONFIG.find(t => t.key === activeTab)?.label,
      is_mobile: isMobile
    })

    setExpandedItem(prev => prev === itemKey ? null : itemKey)
  }

  // Track dropdown interactions
  const handleDropdownToggle = () => {
    const newState = !isDropdownOpen
    trackEvent('feature_dropdown_toggle', {
      action: newState ? 'open' : 'close',
      current_tab: activeTab,
      is_mobile: isMobile
    })
    setIsDropdownOpen(newState)
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
    <div ref={sectionRef as React.RefObject<HTMLDivElement>} className={`${styles.section} ${isMobile ? styles.mobile : ''}`}>
      <div className={`${styles.sectionContent} ${isMobile ? styles.mobile : ''}`}>
        {/* Header Section */}
        <div className={`${styles.headerSection} ${isMobile ? styles.mobile : ''}`}>
          <div className={`gradient-text-primary ${styles.gradientTextPrimary} ${isMobile ? styles.mobile : ''}`}>
            Designed for Moments That Matter
          </div>        
          <div className={`${styles.description} ${styles.descriptionWithMargin} ${isMobile ? styles.mobile : ''}`}>
          Morning routines, midday resets, nighttime wind-downs, and everything between.
          </div>
        </div>
        
        {/* Tab Content Section */}
        <div className={`${styles.tabContentSection} ${isMobile ? styles.mobile : ''}`}>
          {/* Tab Buttons */}
          <div className={`${styles.tabButtonsContainer} ${isMobile ? styles.mobile : ''}`}>
            {isMobile ? (
              <div className={`${styles.dropdownWrapper} ${styles.mobile}`} ref={dropdownRef}>
                <Button 
                  variant="ghost"
                  size="medium"
                  className={`${styles.dropdownButton} ${isDropdownOpen ? styles.open : ''}`}
                  onClick={handleDropdownToggle}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  enableTextAnimation={false}
                  enableRipple={false}
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
                </Button>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu} role="listbox">
                    {TAB_CONFIG.map(({ key, label }) => (
                      <Button
                        variant="ghost"
                        size="small"
                        key={key}
                        className={`${styles.dropdownOption} ${activeTab === key ? styles.active : ''}`}
                        onClick={() => handleTabClick(key)}
                        role="option"
                        aria-selected={activeTab === key}
                        enableTextAnimation={false}
                        enableRipple={false}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
          
          {/* Content Grid */}
          <div className={`${styles.contentGrid} ${isMobile ? styles.mobile : ''}`}>
            {/* Left content with expandable items - Columns 1-6 */}
            <div className={`${styles.leftContentColumn} ${isMobile ? styles.mobile : ''}`}>
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
            {/* Right image - Columns 7-12 */}
            <div className={`${styles.rightImageColumn} ${isMobile ? styles.mobile : ''}`}>
              <img 
                src={TAB_IMAGES[activeTab]}
                alt={TAB_IMAGE_ALTS[activeTab]}
                className={styles.tabImage}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}