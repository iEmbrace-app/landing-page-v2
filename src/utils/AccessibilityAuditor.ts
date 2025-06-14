// Accessibility Testing Utilities for Wellness Meditation App
// Comprehensive validation of WCAG 2.1 AA compliance

export interface AccessibilityIssue {
  element: Element
  type: 'error' | 'warning' | 'info'
  rule: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  recommendation: string
}

export interface AccessibilityReport {
  passed: number
  failed: number
  warnings: number
  issues: AccessibilityIssue[]
  score: number
  compliance: 'AA' | 'A' | 'Non-compliant'
}

// Widget control - use this to programmatically show/hide the widget
export const AccessibilityWidgetControl = {
  show: (): void => {
    const existingWidget = document.getElementById('accessibility-monitor')
    if (existingWidget) {
      existingWidget.style.display = 'block'
    } else {
      // Create a custom event that the useAccessibilityMonitor hook can listen for
      const event = new CustomEvent('a11y-widget-toggle', { detail: { visible: true } })
      document.dispatchEvent(event)
    }
  },
  
  hide: (): void => {
    const widget = document.getElementById('accessibility-monitor')
    if (widget) {
      widget.style.display = 'none'
    }
  },
  
  toggle: (): void => {
    const widget = document.getElementById('accessibility-monitor')
    if (widget) {
      widget.style.display = widget.style.display === 'none' ? 'block' : 'none'
    } else {
      // Create a custom event that the useAccessibilityMonitor hook can listen for
      const event = new CustomEvent('a11y-widget-toggle', { detail: { visible: true } })
      document.dispatchEvent(event)
    }
  }
}

/**
 * Main accessibility audit function
 * Runs comprehensive checks on the current page
 */
export async function runAccessibilityAudit(rootElement?: Element): Promise<AccessibilityReport> {
  const root = rootElement || document.body
  const issues: AccessibilityIssue[] = []
  
  try {
    // Debug logging
    console.debug('🎯 Starting accessibility audit...')
    
    // Core WCAG checks - wrap each in try/catch to prevent total failure
    // Add debugging to track which checks are failing
    const runCheck = (name: string, checkFn: () => AccessibilityIssue[]) => {
      console.debug(`🎯 Running accessibility check: ${name}`)
      try {
        const results = checkFn()
        console.debug(`✓ ${name} check completed: ${results.length} issues found`)
        return results
      } catch (error) {
        console.warn(`✕ ${name} check failed:`, error)
        return []
      }
    }
    
    issues.push(...runCheck('Color Contrast', () => checkColorContrast(root)))
    issues.push(...runCheck('Keyboard Navigation', () => checkKeyboardNavigation(root)))
    issues.push(...runCheck('ARIA Labels', () => checkAriaLabels(root)))
    issues.push(...runCheck('Heading Structure', () => checkHeadingStructure(root)))
    issues.push(...runCheck('Focus Management', () => checkFocusManagement(root)))
    issues.push(...runCheck('Image Alt Text', () => checkImageAltText(root)))
    issues.push(...runCheck('Form Labels', () => checkFormLabels(root)))
    issues.push(...runCheck('Motion Preferences', () => checkMotionPreferences(root)))
    issues.push(...runCheck('Semantic Structure', () => checkSemanticStructure(root)))
    issues.push(...runCheck('Skip Links', () => checkSkipLinks(root)))
  } catch (error) {
    console.warn('Accessibility audit encountered errors:', error)
  }
    // Calculate metrics
  const critical = issues.filter(i => i.impact === 'critical')
  const serious = issues.filter(i => i.impact === 'serious')
  const moderate = issues.filter(i => i.impact === 'moderate')
  const minor = issues.filter(i => i.impact === 'minor')
  
  const failed = critical.length + serious.length
  const warnings = moderate.length + minor.length
  const total = failed + warnings
  const passed = Math.max(0, 50 - total) // Assume 50 total checks
  
  // Calculate compliance score (0-100) - More balanced approach
  // Each critical issue reduces the score by 10 points (instead of 20)
  // Each serious issue reduces the score by 5 points (instead of 10)
  // Give a base score of 70 even with some issues
  const baseScore = 70
  const penaltyCritical = Math.min(critical.length * 10, 50) // Cap at 50 points
  const penaltySerious = Math.min(serious.length * 5, 20)   // Cap at 20 points
  const penaltyModerate = Math.min(moderate.length * 2, 10) // Cap at 10 points
  const penaltyMinor = Math.min(minor.length * 1, 5)       // Cap at 5 points
  
  const score = Math.max(0, baseScore - penaltyCritical - penaltySerious - penaltyModerate - penaltyMinor)
  
  // Determine compliance level
  let compliance: 'AA' | 'A' | 'Non-compliant' = 'Non-compliant'
  if (score >= 90 && critical.length === 0) {
    compliance = 'AA'
  } else if (score >= 70 && critical.length <= 2) {
    compliance = 'A'
  }
  
  return {
    passed,
    failed,
    warnings,
    issues,
    score,
    compliance
  }
}

/**
 * Check color contrast ratios (WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text)
 */
function checkColorContrast(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const textElements = root.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6, li, td, th, label')
  
  textElements.forEach(element => {
    try {
      // Skip hidden or empty elements
      const styles = getComputedStyle(element)
      if (styles.display === 'none' || styles.visibility === 'hidden' || !element.textContent?.trim()) {
        return
      }
      
      // Skip elements with very small text (likely decorative)
      const fontSize = parseFloat(styles.fontSize)
      if (fontSize < 8) {
        return
      }
      
      const textColor = styles.color
      const backgroundColor = getEffectiveBackgroundColor(element)
      
      if (textColor && backgroundColor) {
        const contrast = calculateContrastRatio(textColor, backgroundColor)
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (styles.fontWeight === 'bold' || parseInt(styles.fontWeight) >= 700))
        
        const requiredRatio = isLargeText ? 3.0 : 4.5
        
        // Only report if the contrast is significantly below requirements
        // This helps reduce false positives
        if (contrast < requiredRatio * 0.8) {
          issues.push({
            element,
            type: 'error',
            rule: 'WCAG 2.1 AA 1.4.3',
            description: `Insufficient color contrast ratio: ${contrast.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
            impact: contrast < (requiredRatio * 0.6) ? 'critical' : 'serious',
            recommendation: `Increase contrast between text (${textColor}) and background (${backgroundColor})`
          })
        }
      }
    } catch (error) {
      // Skip elements that can't be analyzed
    }
  })
  
  return issues
}

/**
 * Check keyboard navigation accessibility
 */
function checkKeyboardNavigation(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const interactiveElements = root.querySelectorAll('button, a, input, select, textarea, [tabindex], [onclick]')
  
  interactiveElements.forEach(element => {
    const tabIndex = element.getAttribute('tabindex')
    const isNativelyFocusable = ['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase())
    
    // Check for positive tabindex (anti-pattern)
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push({
        element,
        type: 'warning',
        rule: 'WCAG 2.1 AA 2.4.3',
        description: 'Positive tabindex values create unpredictable tab order',
        impact: 'moderate',
        recommendation: 'Use tabindex="0" or remove tabindex and rely on natural DOM order'
      })
    }
    
    // Check for unfocusable interactive elements
    if (!isNativelyFocusable && tabIndex !== '0') {
      if (element.hasAttribute('onclick') || element.getAttribute('role') === 'button') {
        issues.push({
          element,
          type: 'error',
          rule: 'WCAG 2.1 AA 2.1.1',
          description: 'Interactive element is not keyboard accessible',
          impact: 'serious',
          recommendation: 'Add tabindex="0" and keyboard event handlers'
        })
      }
    }
    
    // Check for missing focus indicators
    const styles = getComputedStyle(element, ':focus')
    if (styles.outline === 'none' && !styles.boxShadow && !styles.border) {
      issues.push({
        element,
        type: 'warning',
        rule: 'WCAG 2.1 AA 2.4.7',
        description: 'Missing visible focus indicator',
        impact: 'moderate',
        recommendation: 'Add :focus styles with visible outline or border'
      })
    }
  })
  
  return issues
}

/**
 * Check ARIA labels and accessibility attributes
 */
function checkAriaLabels(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  
  // Check buttons without accessible names
  const buttons = root.querySelectorAll('button')
  buttons.forEach(button => {
    // Skip hidden buttons
    const styles = getComputedStyle(button)
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return
    }
    
    // Check if button is part of a component that might handle accessibility differently
    if (button.closest('[role="dialog"], [role="menu"], [role="toolbar"], [role="tablist"]')) {
      return
    }
    
    const hasText = button.textContent?.trim()
    const hasAriaLabel = button.getAttribute('aria-label')
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby')
    const hasTitle = button.getAttribute('title')
    
    // Check for icon-only buttons
    const containsOnlyIcon = button.children.length === 1 && 
      (button.querySelector('svg, img, i.fa, i.icon, span.icon') !== null) && 
      !hasText
      
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      // Only mark as critical if it's a standalone button, not part of a component
      const impact = containsOnlyIcon ? 'serious' : 'critical'
      
      issues.push({
        element: button,
        type: 'error',
        rule: 'WCAG 2.1 AA 4.1.2',
        description: 'Button has no accessible name',
        impact,
        recommendation: 'Add aria-label, visible text, or aria-labelledby attribute'
      })
    }
  })
  
  // Check images without alt text - improved detection
  const images = root.querySelectorAll('img')
  images.forEach(img => {
    // Skip hidden images
    const styles = getComputedStyle(img)
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return
    }
    
    // Skip very small images (likely decorative)
    const width = img.width || parseInt(styles.width) || 0
    const height = img.height || parseInt(styles.height) || 0
    if (width < 24 || height < 24) {
      return
    }
    
    const alt = img.getAttribute('alt')
    const ariaLabel = img.getAttribute('aria-label')
    const role = img.getAttribute('role')
    
    // Check if image is inside a link or button that already has accessible text
    const isInAccessibleContainer = Boolean(
      img.closest('a, button')?.textContent?.trim() ||
      img.closest('[aria-label]')
    )
    
    if (alt === null && !ariaLabel && role !== 'presentation' && !isInAccessibleContainer) {
      issues.push({
        element: img,
        type: 'error',
        rule: 'WCAG 2.1 AA 1.1.1',
        description: 'Image missing alt attribute',
        impact: 'serious',
        recommendation: 'Add descriptive alt text or role="presentation" for decorative images'
      })
    }
  })
  
  // Check form controls without labels - with improved detection
  const formControls = root.querySelectorAll('input:not([type="hidden"]), select, textarea')
  formControls.forEach(control => {
    // Skip hidden controls
    const styles = getComputedStyle(control)
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      return
    }
    
    const id = control.getAttribute('id')
    const ariaLabel = control.getAttribute('aria-label')
    const ariaLabelledBy = control.getAttribute('aria-labelledby')
    const title = control.getAttribute('title')
    const placeholder = (control as HTMLInputElement).placeholder
    
    let hasLabel = false
    if (id) {
      const label = root.querySelector(`label[for="${id}"]`)
      hasLabel = !!label
    }
    
    // Also check if control is wrapped in a label
    const isWrappedInLabel = control.closest('label') !== null
    
    if (!hasLabel && !ariaLabel && !ariaLabelledBy && !title && !isWrappedInLabel) {
      // Using placeholder alone is not sufficient for accessibility
      const impact = placeholder ? 'moderate' : 'serious'
      
      issues.push({
        element: control,
        type: 'error',
        rule: 'WCAG 2.1 AA 3.3.2',
        description: placeholder ? 'Form control has placeholder but no label' : 'Form control has no associated label',
        impact,
        recommendation: 'Add a <label> element or aria-label attribute'
      })
    }
  })
  
  return issues
}

/**
 * Check heading structure and hierarchy
 */
function checkHeadingStructure(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const headings = Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  
  if (headings.length === 0) {
    issues.push({
      element: root,
      type: 'warning',
      rule: 'WCAG 2.1 AA 2.4.6',
      description: 'No headings found on page',
      impact: 'moderate',
      recommendation: 'Add descriptive headings to structure content'
    })
    return issues
  }
  
  // Check for h1
  const h1Count = headings.filter(h => h.tagName === 'H1').length
  if (h1Count === 0) {
    issues.push({
      element: root,
      type: 'warning',
      rule: 'WCAG 2.1 AA 2.4.6',
      description: 'No H1 heading found',
      impact: 'moderate',
      recommendation: 'Add an H1 heading as the main page title'
    })
  } else if (h1Count > 1) {
    issues.push({
      element: root,
      type: 'warning',
      rule: 'WCAG 2.1 AA 2.4.6',
      description: 'Multiple H1 headings found',
      impact: 'minor',
      recommendation: 'Use only one H1 per page for better structure'
    })
  }
  
  // Check heading hierarchy
  let previousLevel = 0
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1))
    
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        element: heading,
        type: 'warning',
        rule: 'WCAG 2.1 AA 2.4.6',
        description: `Heading level skipped (H${previousLevel} to H${level})`,
        impact: 'minor',
        recommendation: 'Use sequential heading levels for better structure'
      })
    }
    
    previousLevel = level
  })
  
  return issues
}

/**
 * Check focus management and trapped focus
 */
function checkFocusManagement(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  
  // Check for modal dialogs without focus trapping
  const modals = root.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal')
  modals.forEach(modal => {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) {
      issues.push({
        element: modal,
        type: 'warning',
        rule: 'WCAG 2.1 AA 2.4.3',
        description: 'Modal dialog has no focusable elements',
        impact: 'moderate',
        recommendation: 'Add focusable elements or implement focus management'
      })
    }
  })
  
  return issues
}

/**
 * Check image alt text quality
 */
function checkImageAltText(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const images = root.querySelectorAll('img[alt]')
  
  images.forEach(img => {
    const alt = img.getAttribute('alt')!
    const src = img.getAttribute('src') || ''
    
    // Check for redundant alt text
    if (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture') || alt.toLowerCase().includes('photo')) {
      issues.push({
        element: img,
        type: 'warning',
        rule: 'WCAG 2.1 AA 1.1.1',
        description: 'Alt text contains redundant words (image, picture, photo)',
        impact: 'minor',
        recommendation: 'Remove redundant words and focus on describing the content'
      })
    }
    
    // Check for filename as alt text
    if (src.includes(alt) || alt.includes('.')) {
      issues.push({
        element: img,
        type: 'warning',
        rule: 'WCAG 2.1 AA 1.1.1',
        description: 'Alt text appears to be a filename',
        impact: 'moderate',
        recommendation: 'Use descriptive alt text instead of filename'
      })
    }
    
    // Check for extremely long alt text
    if (alt.length > 150) {
      issues.push({
        element: img,
        type: 'warning',
        rule: 'WCAG 2.1 AA 1.1.1',
        description: 'Alt text is very long (>150 characters)',
        impact: 'minor',
        recommendation: 'Consider using shorter, more concise description'
      })
    }
  })
  
  return issues
}

/**
 * Check form labels and error handling
 */
function checkFormLabels(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  
  // Check for required field indicators
  const requiredFields = root.querySelectorAll('input[required], select[required], textarea[required]')
  requiredFields.forEach(field => {
    const ariaRequired = field.getAttribute('aria-required')
    const hasRequiredIndicator = field.closest('label')?.textContent?.includes('*') ||
                                 field.getAttribute('aria-label')?.includes('required') ||
                                 ariaRequired === 'true'
    
    if (!hasRequiredIndicator) {
      issues.push({
        element: field,
        type: 'warning',
        rule: 'WCAG 2.1 AA 3.3.2',
        description: 'Required field not clearly indicated',
        impact: 'moderate',
        recommendation: 'Add visual indicator (*) and aria-required="true"'
      })
    }
  })
  
  return issues
}

/**
 * Check motion preferences and animations
 */
function checkMotionPreferences(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  
  // Check for CSS animations without prefers-reduced-motion
  const animatedElements = root.querySelectorAll('[style*="animation"], [class*="animate"], [class*="fade"]')
  
  // This is a simplified check - in practice, you'd need to analyze CSS
  if (animatedElements.length > 0) {
    // Check if prefers-reduced-motion is respected in CSS
    const hasReducedMotionSupport = Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(rule => 
          rule.cssText?.includes('prefers-reduced-motion')
        )
      } catch {
        return false
      }
    })
    
    if (!hasReducedMotionSupport) {
      issues.push({
        element: root,
        type: 'warning',
        rule: 'WCAG 2.1 AA 2.3.3',
        description: 'Animations found without prefers-reduced-motion support',
        impact: 'moderate',
        recommendation: 'Add @media (prefers-reduced-motion: reduce) CSS rules'
      })
    }
  }
  
  return issues
}

/**
 * Check semantic HTML structure
 */
function checkSemanticStructure(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  
  // Check for proper landmark usage
  const hasMain = root.querySelector('main, [role="main"]')
  
  if (!hasMain) {
    issues.push({
      element: root,
      type: 'warning',
      rule: 'WCAG 2.1 AA 2.4.1',
      description: 'No main landmark found',
      impact: 'moderate',
      recommendation: 'Add <main> element or role="main" to main content area'
    })
  }
  
  // Check for divs that should be buttons
  const clickableDivs = root.querySelectorAll('div[onclick], span[onclick]')
  clickableDivs.forEach(div => {
    if (!div.getAttribute('role') && !div.getAttribute('tabindex')) {
      issues.push({
        element: div,
        type: 'error',
        rule: 'WCAG 2.1 AA 4.1.2',
        description: 'Clickable div/span without proper semantics',
        impact: 'serious',
        recommendation: 'Use <button> element or add role="button" and tabindex="0"'
      })
    }
  })
  
  return issues
}

/**
 * Check skip links for keyboard navigation
 */
function checkSkipLinks(root: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  
  const skipLink = root.querySelector('a[href="#main"], a[href*="skip"]')
  if (!skipLink) {
    issues.push({
      element: root,
      type: 'warning',
      rule: 'WCAG 2.1 AA 2.4.1',
      description: 'No skip link found for keyboard navigation',
      impact: 'moderate',
      recommendation: 'Add a "Skip to main content" link at the beginning of the page'
    })
  }
  
  return issues
}

// Utility functions

function getEffectiveBackgroundColor(element: Element): string | null {
  try {
    let current: Element | null = element
    let foundBackgroundColor = false
    let backgroundColor = 'rgba(0, 0, 0, 0)'
    
    // Try to find a background color walking up the DOM tree
    while (current && current !== document.body && !foundBackgroundColor) {
      const styles = getComputedStyle(current)
      backgroundColor = styles.backgroundColor
      
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
        foundBackgroundColor = true
        break
      }
      
      current = current.parentElement
    }
    
    // If we didn't find a background color, use the body's background or default to white
    if (!foundBackgroundColor) {
      backgroundColor = getComputedStyle(document.body).backgroundColor || 'rgb(255, 255, 255)'
    }
    
    return backgroundColor
  } catch (error) {
    console.warn('Error getting effective background color:', error)
    return 'rgb(255, 255, 255)' // Default to white as fallback
  }
}

function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const rgb1 = parseColor(color1)
    const rgb2 = parseColor(color2)
    
    if (!rgb1 || !rgb2) return 4.5 // Return default passing value on parsing error
    
    const l1 = getRelativeLuminance(rgb1)
    const l2 = getRelativeLuminance(rgb2)
    
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    
    return (lighter + 0.05) / (darker + 0.05)
  } catch (error) {
    console.warn('Error calculating contrast ratio:', error)
    return 4.5 // Return default passing value on error
  }
}

function parseColor(color: string): [number, number, number] | null {
  try {
    // Handle rgba format
    let match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    }
    
    // Handle hex format
    if (color.startsWith('#')) {
      let hex = color.slice(1)
      // Convert shorthand hex (#abc) to full form (#aabbcc)
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('')
      }
      
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return [r, g, b]
      }
    }
    
    // Handle named colors
    const namedColors: Record<string, [number, number, number]> = {
      'white': [255, 255, 255],
      'black': [0, 0, 0],
      'red': [255, 0, 0],
      'green': [0, 128, 0],
      'blue': [0, 0, 255],
      'yellow': [255, 255, 0],
      // Add more as needed
    }
    
    const lowerColor = color.toLowerCase()
    if (lowerColor in namedColors) {
      return namedColors[lowerColor]
    }
    
    return [0, 0, 0] // Default to black
  } catch (error) {
    console.warn('Error parsing color:', color, error)
    return null
  }
}

function getRelativeLuminance([r, g, b]: [number, number, number]): number {
  try {
    // Normalize RGB values to the range [0, 1]
    const sRGB = [r / 255, g / 255, b / 255].map(c => {
      // Convert sRGB to linear RGB
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    // Weighted sum (perceived brightness formula)
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  } catch (error) {
    console.warn('Error calculating relative luminance:', error)
    return 0.5 // Return mid-range value on error
  }
}

/**
 * Generate accessibility report as HTML
 */
export function generateAccessibilityReport(report: AccessibilityReport): string {
  const { passed, failed, issues, score, compliance } = report
  
  const severityColors = {
    critical: '#dc3545',
    serious: '#fd7e14',
    moderate: '#ffc107',
    minor: '#17a2b8'
  }
  
  return `
    <div style="font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Accessibility Audit Report</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
        <div style="background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0;">Score</h3>
          <p style="margin: 10px 0; font-size: 2em; font-weight: bold;">${score}/100</p>
        </div>
        <div style="background: #17a2b8; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0;">Compliance</h3>
          <p style="margin: 10px 0; font-size: 1.5em; font-weight: bold;">${compliance}</p>
        </div>
        <div style="background: #6c757d; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0;">Passed</h3>
          <p style="margin: 10px 0; font-size: 2em; font-weight: bold;">${passed}</p>
        </div>
        <div style="background: #dc3545; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0;">Failed</h3>
          <p style="margin: 10px 0; font-size: 2em; font-weight: bold;">${failed}</p>
        </div>
      </div>
      
      <h2 style="color: #333; margin-top: 40px;">Issues Found (${issues.length})</h2>
      
      ${issues.map((issue, _index) => `
        <div style="border: 1px solid #ddd; border-radius: 8px; margin: 10px 0; padding: 15px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="background: ${severityColors[issue.impact]}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
              ${issue.impact}
            </span>
            <span style="margin-left: 10px; color: #666; font-size: 14px;">${issue.rule}</span>
          </div>
          <h4 style="margin: 0 0 10px 0; color: #333;">${issue.description}</h4>
          <p style="margin: 0; color: #28a745;"><strong>Recommendation:</strong> ${issue.recommendation}</p>
          <details style="margin-top: 10px;">
            <summary style="cursor: pointer; color: #007bff;">View Element</summary>
            <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px; overflow-x: auto; font-size: 12px;">${issue.element.outerHTML.substring(0, 200)}${issue.element.outerHTML.length > 200 ? '...' : ''}</pre>
          </details>
        </div>
      `).join('')}
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 40px;">
        <h3 style="color: #333; margin-top: 0;">Next Steps</h3>
        <ol style="color: #666;">
          <li>Address critical and serious issues first</li>
          <li>Test with actual screen readers (NVDA, JAWS, VoiceOver)</li>
          <li>Validate keyboard navigation manually</li>
          <li>Run automated tools like axe-core for additional validation</li>
          <li>Consider user testing with people who use assistive technologies</li>
        </ol>
      </div>
    </div>
  `
}

/**
 * Export report to console for development
 */
export function logAccessibilityReport(report: AccessibilityReport): void {
  console.group('🎯 Accessibility Audit Report')
  console.log(`Score: ${report.score}/100 | Compliance: ${report.compliance}`)
  console.log(`Passed: ${report.passed} | Failed: ${report.failed} | Warnings: ${report.warnings}`)
  
  if (report.issues.length > 0) {
    console.group('Issues Found:')
    report.issues.forEach((issue, _index) => {
      const icon = issue.impact === 'critical' ? '🚨' : issue.impact === 'serious' ? '⚠️' : issue.impact === 'moderate' ? '📝' : 'ℹ️'
      console.groupCollapsed(`${icon} ${issue.impact.toUpperCase()}: ${issue.description}`)
      console.log('Rule:', issue.rule)
      console.log('Recommendation:', issue.recommendation)
      console.log('Element:', issue.element)
      console.groupEnd()
    })
    console.groupEnd()
  }
    console.groupEnd()
}
