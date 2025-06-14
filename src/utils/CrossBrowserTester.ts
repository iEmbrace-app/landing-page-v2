// Cross-Browser Testing Configuration
// Ensures optimizations work across all target browsers

export interface BrowserTestResult {
  browser: string
  version: string
  passed: boolean
  errors: string[]
  performanceMetrics: {
    loadTime: number
    renderTime: number
    memoryUsage: number
    bundleSize: number
  }
  features: {
    serviceWorker: boolean
    webGL: boolean
    cssCustomProperties: boolean
    backdropFilter: boolean
    intersectionObserver: boolean
  }
}

export class CrossBrowserTester {
  private testResults: BrowserTestResult[] = []
  
  constructor() {
    this.detectBrowser()
  }
  
  private detectBrowser(): string {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return 'Chrome'
    } else if (userAgent.includes('firefox')) {
      return 'Firefox'
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return 'Safari'
    } else if (userAgent.includes('edg')) {
      return 'Edge'
    } else {
      return 'Unknown'
    }
  }
    async runBrowserTests(): Promise<BrowserTestResult> {
    const browser = this.detectBrowser()
    const errors: string[] = []
    
    console.group(`🔍 Cross-Browser Test: ${browser}`)
    
    try {
      // Test 1: Service Worker Support
      const serviceWorkerSupported = await this.testServiceWorker()
      
      // Test 2: WebGL Support
      const webGLSupported = this.testWebGL()
      
      // Test 3: CSS Custom Properties
      const cssCustomPropsSupported = this.testCSSCustomProperties()
      
      // Test 4: Backdrop Filter Support
      const backdropFilterSupported = this.testBackdropFilter()
      
      // Test 5: Intersection Observer
      const intersectionObserverSupported = this.testIntersectionObserver()
      
      // Test 6: Performance APIs
      const performanceMetrics = await this.measurePerformance()
      
      const result: BrowserTestResult = {
        browser,
        version: this.getBrowserVersion(),
        passed: errors.length === 0,
        errors,
        performanceMetrics,
        features: {
          serviceWorker: serviceWorkerSupported,
          webGL: webGLSupported,
          cssCustomProperties: cssCustomPropsSupported,
          backdropFilter: backdropFilterSupported,
          intersectionObserver: intersectionObserverSupported
        }
      }
      
      this.logTestResults(result)
      this.testResults.push(result)
      
      return result
      
    } catch (error) {
      errors.push(`Test execution failed: ${error}`)
      console.error('Browser test failed:', error)
      
      return {
        browser,
        version: 'unknown',
        passed: false,
        errors,
        performanceMetrics: {
          loadTime: 0,
          renderTime: 0,
          memoryUsage: 0,
          bundleSize: 0
        },
        features: {
          serviceWorker: false,
          webGL: false,
          cssCustomProperties: false,
          backdropFilter: false,
          intersectionObserver: false
        }
      }
    } finally {
      console.groupEnd()
    }
  }
  
  private async testServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      return registration instanceof ServiceWorkerRegistration
    } catch {
      return false
    }
  }
  
  private testWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return gl instanceof WebGLRenderingContext
    } catch {
      return false
    }
  }
  
  private testCSSCustomProperties(): boolean {
    try {
      return window.CSS && CSS.supports('color', 'var(--test)')
    } catch {
      return false
    }
  }
  
  private testBackdropFilter(): boolean {
    try {
      return CSS.supports('backdrop-filter', 'blur(10px)')
    } catch {
      return false
    }
  }
  
  private testIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window
  }
  
  private async measurePerformance(): Promise<BrowserTestResult['performanceMetrics']> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    return {
      loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
      renderTime: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      bundleSize: await this.calculateBundleSize()
    }
  }
  
  private async calculateBundleSize(): Promise<number> {
    try {
      const response = await fetch('/dist/assets/index.js')
      const text = await response.text()
      return text.length
    } catch {
      return 0
    }
  }
  
  private getBrowserVersion(): string {
    const userAgent = navigator.userAgent
    const browser = this.detectBrowser()
    
    const versionRegex: Record<string, RegExp> = {
      Chrome: /Chrome\/(\d+\.\d+)/,
      Firefox: /Firefox\/(\d+\.\d+)/,
      Safari: /Version\/(\d+\.\d+)/,
      Edge: /Edg\/(\d+\.\d+)/
    }
    
    const regex = versionRegex[browser]
    if (regex) {
      const match = userAgent.match(regex)
      return match ? match[1] : 'unknown'
    }
    
    return 'unknown'
  }
  
  private logTestResults(result: BrowserTestResult): void {
    console.log(`✅ Browser: ${result.browser} ${result.version}`)
    console.log(`📊 Performance:`)
    console.log(`  Load Time: ${result.performanceMetrics.loadTime.toFixed(2)}ms`)
    console.log(`  Render Time: ${result.performanceMetrics.renderTime.toFixed(2)}ms`)
    console.log(`  Memory Usage: ${(result.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`)
    
    console.log(`🔧 Feature Support:`)
    Object.entries(result.features).forEach(([feature, supported]) => {
      const icon = supported ? '✅' : '❌'
      console.log(`  ${icon} ${feature}: ${supported}`)
    })
    
    if (result.errors.length > 0) {
      console.log(`❌ Errors:`)
      result.errors.forEach(error => console.log(`  - ${error}`))
    }
  }
  
  getCompatibilityReport(): string {
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(r => r.passed).length
    const compatibilityScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0
    
    const featureSupport = this.analyzeFeatureSupport()
    
    return `
# Cross-Browser Compatibility Report

## Overall Compatibility: ${compatibilityScore.toFixed(1)}%
- Tests Passed: ${passedTests}/${totalTests}

## Feature Support Analysis
${Object.entries(featureSupport).map(([feature, support]) => 
  `- **${feature}**: ${support.percentage.toFixed(1)}% (${support.supported}/${support.total} browsers)`
).join('\n')}

## Browser Test Results
${this.testResults.map(result => `
### ${result.browser} ${result.version}
- **Status**: ${result.passed ? '✅ Passed' : '❌ Failed'}
- **Load Time**: ${result.performanceMetrics.loadTime.toFixed(2)}ms
- **Memory Usage**: ${(result.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
${result.errors.length > 0 ? `- **Errors**: ${result.errors.join(', ')}` : ''}
`).join('')}

## Recommendations
${this.generateRecommendations()}
    `.trim()
  }
  
  private analyzeFeatureSupport() {
    const features = ['serviceWorker', 'webGL', 'cssCustomProperties', 'backdropFilter', 'intersectionObserver'] as const
    const analysis: Record<string, { supported: number; total: number; percentage: number }> = {}
    
    features.forEach(feature => {
      const total = this.testResults.length
      const supported = this.testResults.filter(r => r.features[feature]).length
      
      analysis[feature] = {
        supported,
        total,
        percentage: total > 0 ? (supported / total) * 100 : 0
      }
    })
    
    return analysis
  }
  
  private generateRecommendations(): string {
    const recommendations: string[] = []
    const featureSupport = this.analyzeFeatureSupport()
    
    if (featureSupport.serviceWorker.percentage < 100) {
      recommendations.push('- Consider providing fallbacks for browsers without Service Worker support')
    }
    
    if (featureSupport.webGL.percentage < 100) {
      recommendations.push('- Implement canvas 2D fallback for 3D components')
    }
    
    if (featureSupport.backdropFilter.percentage < 100) {
      recommendations.push('- Add fallback styles for backdrop-filter property')
    }
    
    if (featureSupport.intersectionObserver.percentage < 100) {
      recommendations.push('- Include IntersectionObserver polyfill for older browsers')
    }
    
    const avgLoadTime = this.testResults.reduce((sum, r) => sum + r.performanceMetrics.loadTime, 0) / this.testResults.length
    if (avgLoadTime > 1000) {
      recommendations.push('- Consider further bundle optimization to improve load times')
    }
    
    return recommendations.length > 0 ? recommendations.join('\n') : '- All tests passed! No immediate recommendations.'
  }
}

// Global instance for easy access
export const crossBrowserTester = new CrossBrowserTester()

// Auto-run tests in development
if (import.meta.env.DEV) {
  crossBrowserTester.runBrowserTests().then(result => {
    if (!result.passed) {
      console.warn('Some cross-browser tests failed. Check the console for details.')
    }
  })
}
