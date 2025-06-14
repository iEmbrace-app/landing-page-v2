// React Hook for Accessibility Testing Integration
// Automatically runs accessibility audits in development mode

import { useEffect, useRef, useState } from 'react'
import { runAccessibilityAudit, logAccessibilityReport, AccessibilityReport } from '../utils/AccessibilityAuditor'

interface UseAccessibilityAuditOptions {
  enabled?: boolean
  autoRun?: boolean
  logToConsole?: boolean
  debounceMs?: number
  rootSelector?: string
}

interface AccessibilityAuditState {
  report: AccessibilityReport | null
  isRunning: boolean
  lastRun: Date | null
  runAudit: () => Promise<void>
  clearReport: () => void
}

/**
 * Hook for accessibility testing in development
 * Provides automatic and manual accessibility auditing
 */
export function useAccessibilityAudit(options: UseAccessibilityAuditOptions = {}): AccessibilityAuditState {
  const {
    enabled = import.meta.env.DEV, // Only in development by default
    autoRun = false,
    logToConsole = true,
    debounceMs = 1000,
    rootSelector = 'main'
  } = options
  
  const [report, setReport] = useState<AccessibilityReport | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)
  
  const debounceRef = useRef<number>()
  const lastDOMChangeRef = useRef<Date>(new Date())
  
  // Manual audit trigger
  const runAudit = async (): Promise<void> => {
    if (!enabled || isRunning) return
    
    setIsRunning(true)
    
    try {
      const rootElement = document.querySelector(rootSelector) as Element || document.body
      const auditReport = await runAccessibilityAudit(rootElement)
      
      setReport(auditReport)
      setLastRun(new Date())
      
      if (logToConsole) {
        logAccessibilityReport(auditReport)
      }
      
      // Also log summary for quick reference
      if (import.meta.env.DEV) {
        const { score, compliance, issues } = auditReport
        const criticalIssues = issues.filter(i => i.impact === 'critical').length
        const seriousIssues = issues.filter(i => i.impact === 'serious').length
        
        if (criticalIssues > 0 || seriousIssues > 0) {
          console.warn(
            `🎯 Accessibility: ${score}/100 (${compliance}) - ${criticalIssues} critical, ${seriousIssues} serious issues`
          )
        } else {
          console.info(
            `✅ Accessibility: ${score}/100 (${compliance}) - No critical issues found`
          )
        }
      }
      
    } catch (error) {
      console.error('Accessibility audit failed:', error)
    } finally {
      setIsRunning(false)
    }
  }
  
  // Clear report
  const clearReport = (): void => {
    setReport(null)
    setLastRun(null)
  }
  
  // Debounced audit runner
  const debouncedAudit = (): void => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      runAudit()
    }, debounceMs)
  }
  
  // Auto-run on DOM changes (if enabled)
  useEffect(() => {
    if (!enabled || !autoRun) return
    
    const observer = new MutationObserver((mutations) => {
      // Check if mutations are significant enough to warrant re-audit
      const significantChange = mutations.some(mutation => 
        mutation.type === 'childList' && 
        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) ||
        mutation.type === 'attributes' && 
        ['aria-label', 'aria-labelledby', 'aria-describedby', 'role', 'tabindex', 'alt'].includes(mutation.attributeName || '')
      )
      
      if (significantChange) {
        lastDOMChangeRef.current = new Date()
        debouncedAudit()
      }
    })
    
    const rootElement = document.querySelector(rootSelector) || document.body
    observer.observe(rootElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby', 'aria-describedby', 'role', 'tabindex', 'alt', 'class']
    })
    
    // Run initial audit
    setTimeout(debouncedAudit, 500)
    
    return () => {
      observer.disconnect()
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [enabled, autoRun, rootSelector, debounceMs])
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])
  
  return {
    report,
    isRunning,
    lastRun,
    runAudit,
    clearReport
  }
}

/**
 * Hook for live accessibility monitoring (displays floating widget)
 * Shows real-time accessibility status during development
 */
export function useAccessibilityMonitor(enabled: boolean = import.meta.env.DEV): void {
  // Only show widget in development by default
  const isProduction = !import.meta.env.DEV
  const [isWidgetVisible, setIsWidgetVisible] = useState(enabled && !isProduction)
  
  const { report, isRunning, runAudit } = useAccessibilityAudit({
    enabled,
    autoRun: true,
    logToConsole: false,
    debounceMs: 2000
  })
  
  // Listen for programmatic toggle events
  useEffect(() => {
    const handleWidgetToggle = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail && customEvent.detail.visible !== undefined) {
        setIsWidgetVisible(customEvent.detail.visible)
      } else {
        setIsWidgetVisible(prev => !prev)
      }
    }
    
    document.addEventListener('a11y-widget-toggle', handleWidgetToggle)
    
    return () => {
      document.removeEventListener('a11y-widget-toggle', handleWidgetToggle)
    }
  }, [])
  
  useEffect(() => {
    if (!enabled) return
    
    // Create or update floating accessibility widget
    let widget = document.getElementById('accessibility-monitor')
    let isMinimized = false
    
    // If widget should not be visible, cleanup and return
    if (!isWidgetVisible) {
      if (widget) {
        widget.remove()
      }
      return
    }
    
    if (!widget) {
      widget = document.createElement('div')
      widget.id = 'accessibility-monitor'
      widget.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 10px;
        font-family: system-ui, sans-serif;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 200px;
        cursor: default;
        transition: all 0.2s ease;
        opacity: 0.85;
      `
      
      document.body.appendChild(widget)
    }
    
    // Provide default values if report isn't available yet
    const displayReport = report || {
      score: 100,
      compliance: 'AA' as const,
      issues: [],
      passed: 0,
      failed: 0,
      warnings: 0
    }
    
    const { score, compliance, issues } = displayReport
    const criticalCount = issues.filter(i => i.impact === 'critical').length
    const seriousCount = issues.filter(i => i.impact === 'serious').length
    
    // Color coding based on score
    let color = '#28a745' // Green
    if (score < 60) color = '#dc3545' // Red
    else if (score < 80) color = '#ffc107' // Yellow
    else if (score < 90) color = '#fd7e14' // Orange
    
    widget.style.borderColor = color
    
    // Create widget content with proper controls
    widget.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
        <div style="display: flex; align-items: center;">
          <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 8px;"></div>
          <strong>A11y Score: ${score}/100</strong>
        </div>
        <div>
          <button id="a11y-minimize-btn" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 0 5px; margin-right: 2px;" aria-label="Minimize accessibility widget">_</button>
          <button id="a11y-close-btn" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 0 5px;" aria-label="Close accessibility widget">×</button>
        </div>
      </div>
      <div style="color: #666; margin-bottom: 5px;">
        Compliance: <strong>${compliance}</strong>
      </div>
      <div style="color: #666; font-size: 11px;">
        ${criticalCount} critical, ${seriousCount} serious
      </div>
      <button id="a11y-audit-btn" style="width: 100%; margin-top: 5px; padding: 4px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 11px;">
        ${isRunning ? 'Running audit...' : 'Run Accessibility Audit'}
      </button>
    `
    
    // Update widget based on minimized state
    if (isMinimized) {
      widget.style.transform = 'translateX(80%)'
      widget.style.opacity = '0.5'
    } else {
      widget.style.transform = 'translateX(0)'
      widget.style.opacity = '0.85'
    }
    
    // Handle audit button click
    const auditButton = document.getElementById('a11y-audit-btn')
    if (auditButton) {
      // Remove any existing listeners to prevent duplicates
      const newAuditButton = auditButton.cloneNode(true)
      auditButton.parentNode?.replaceChild(newAuditButton, auditButton)
      
      newAuditButton.addEventListener('click', (e) => {
        e.stopPropagation()
        runAudit()
      })
    }
    
    // Handle minimize button click
    const minimizeButton = document.getElementById('a11y-minimize-btn')
    if (minimizeButton) {
      // Remove any existing listeners to prevent duplicates
      const newMinimizeButton = minimizeButton.cloneNode(true)
      minimizeButton.parentNode?.replaceChild(newMinimizeButton, minimizeButton)
      
      newMinimizeButton.addEventListener('click', (e) => {
        e.stopPropagation()
        isMinimized = !isMinimized
        if (widget) {
          widget.style.transform = isMinimized ? 'translateX(80%)' : 'translateX(0)'
          widget.style.opacity = isMinimized ? '0.5' : '0.85'
        }
      })
    }
    
    // Handle close button click
    const closeButton = document.getElementById('a11y-close-btn')
    if (closeButton) {
      // Remove any existing listeners to prevent duplicates
      const newCloseButton = closeButton.cloneNode(true)
      closeButton.parentNode?.replaceChild(newCloseButton, closeButton)
      
      newCloseButton.addEventListener('click', (e) => {
        e.stopPropagation()
        setIsWidgetVisible(false)
      })
    }
    
    // Cleanup function
    const cleanup = () => {
      const existingWidget = document.getElementById('accessibility-monitor')
      if (existingWidget) {
        existingWidget.remove()
      }
    }
    
    return cleanup
  }, [enabled, isWidgetVisible, report, isRunning, runAudit])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const widget = document.getElementById('accessibility-monitor')
      if (widget) {
        widget.remove()
      }
    }
  }, [])
}

/**
 * Hook for keyboard navigation testing
 * Tracks and logs keyboard navigation patterns
 */
export function useKeyboardNavigationTracker(enabled: boolean = import.meta.env.DEV): void {
  useEffect(() => {
    if (!enabled) return
    
    let tabSequence: Element[] = []
    let isTracking = false
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (!isTracking) {
          isTracking = true
          tabSequence = []
          console.group('🎹 Keyboard Navigation Tracking Started')
        }
        
        setTimeout(() => {
          const activeElement = document.activeElement
          if (activeElement && activeElement !== document.body) {
            tabSequence.push(activeElement)
            
            // Log focus changes
            const elementInfo = `${activeElement.tagName.toLowerCase()}${activeElement.id ? '#' + activeElement.id : ''}${activeElement.className ? '.' + activeElement.className.split(' ').join('.') : ''}`
            console.log(`${tabSequence.length}. Focus: ${elementInfo}`)
            
            // Check for accessibility issues
            const tabIndex = activeElement.getAttribute('tabindex')
            const ariaLabel = activeElement.getAttribute('aria-label')
            const hasVisibleText = activeElement.textContent?.trim()
            
            if (tabIndex && parseInt(tabIndex) > 0) {
              console.warn('⚠️ Positive tabindex detected:', activeElement)
            }
            
            if (!hasVisibleText && !ariaLabel && activeElement.tagName === 'BUTTON') {
              console.warn('⚠️ Button without accessible text:', activeElement)
            }
            
            // Check focus visibility
            const styles = getComputedStyle(activeElement, ':focus')
            if (styles.outline === 'none' && !styles.boxShadow) {
              console.warn('⚠️ Element may not have visible focus indicator:', activeElement)
            }
          }
        }, 0)
      } else if (event.key === 'Escape' && isTracking) {
        // Stop tracking on Escape
        console.log(`🎹 Navigation completed. Total focus changes: ${tabSequence.length}`)
        console.groupEnd()
        isTracking = false
        tabSequence = []
      }
    }
    
    const handleFocusIn = (event: FocusEvent) => {
      if (isTracking && event.target instanceof Element) {
        // Additional focus tracking
        const isFocusable = event.target.matches('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (!isFocusable) {
          console.warn('⚠️ Focus on non-standard element:', event.target)
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)
    
    // Log initial instructions
    if (import.meta.env.DEV) {
      console.info('🎹 Keyboard Navigation Tracker: Press Tab to start tracking, Escape to stop')
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
      
      if (isTracking) {
        console.groupEnd()
      }
    }
  }, [enabled])
}

/**
 * Hook for screen reader testing simulation
 * Simulates screen reader announcements in console
 */
export function useScreenReaderSimulator(enabled: boolean = import.meta.env.DEV): void {
  useEffect(() => {
    if (!enabled) return
    
    // Track ARIA live regions
    const liveRegions = document.querySelectorAll('[aria-live]')
    const observers: MutationObserver[] = []
    
    liveRegions.forEach(region => {
      const politeness = region.getAttribute('aria-live') || 'polite'
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const text = (mutation.target as Element).textContent?.trim()
            if (text) {
              const urgency = politeness === 'assertive' ? '🔊 ASSERTIVE' : '🔇 POLITE'
              console.info(`📢 Screen Reader (${urgency}): "${text}"`)
            }
          }
        })
      })
      
      observer.observe(region, {
        childList: true,
        characterData: true,
        subtree: true
      })
      
      observers.push(observer)
    })
    
    // Track focus changes for screen reader context
    const handleFocusChange = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const element = event.target
        const ariaLabel = element.getAttribute('aria-label')
        const ariaLabelledBy = element.getAttribute('aria-labelledby')
        const text = element.textContent?.trim()
        const role = element.getAttribute('role') || element.tagName.toLowerCase()
        
        let announcement = ''
        
        if (ariaLabel) {
          announcement = ariaLabel
        } else if (ariaLabelledBy) {
          const labelElement = document.getElementById(ariaLabelledBy)
          announcement = labelElement?.textContent?.trim() || ''
        } else if (text) {
          announcement = text
        } else {
          announcement = `unlabeled ${role}`
        }
        
        if (announcement) {
          console.info(`👁️ Screen Reader Focus: "${announcement}" (${role})`)
        }
      }
    }
    
    document.addEventListener('focusin', handleFocusChange)
      return () => {
      observers.forEach(observer => observer.disconnect())
      document.removeEventListener('focusin', handleFocusChange)
    }
  }, [enabled])
}

export default {
  useAccessibilityAudit,
  useAccessibilityMonitor,
  useKeyboardNavigationTracker,
  useScreenReaderSimulator
}
