// Comprehensive Testing Suite
// Automated accessibility and performance testing integration

import { runAccessibilityAudit, AccessibilityReport } from './AccessibilityAuditor'
import { crossBrowserTester, BrowserTestResult } from './CrossBrowserTester'
import { performanceTracker, PerformanceReport } from './PerformanceTracker'

export interface TestSuiteResult {
  accessibility: AccessibilityReport
  performance: PerformanceReport
  crossBrowser: BrowserTestResult
  overall: {
    score: number
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    passed: boolean
  }
  timestamp: number
}

export interface TestSuiteConfig {
  accessibility: {
    enabled: boolean
    rootSelector?: string
    logToConsole?: boolean
  }
  performance: {
    enabled: boolean
    waitTime?: number
  }
  crossBrowser: {
    enabled: boolean
  }
  autoRun: {
    enabled: boolean
    interval?: number
  }
}

export class TestSuite {
  private config: TestSuiteConfig
  private results: TestSuiteResult[] = []
  private autoRunInterval?: number
  
  constructor(config: Partial<TestSuiteConfig> = {}) {
    this.config = {
      accessibility: {
        enabled: true,
        logToConsole: import.meta.env.DEV,
        ...config.accessibility
      },
      performance: {
        enabled: true,
        waitTime: 3000,
        ...config.performance
      },
      crossBrowser: {
        enabled: true,
        ...config.crossBrowser
      },
      autoRun: {
        enabled: import.meta.env.DEV,
        interval: 60000, // 1 minute in dev
        ...config.autoRun
      }
    }
    
    this.initialize()
  }
  
  private initialize(): void {
    // Auto-run tests in development
    if (this.config.autoRun.enabled) {
      this.startAutoRun()
    }
    
    // Expose to window for manual testing
    if (import.meta.env.DEV) {
      (window as any).testSuite = this
    }
  }
  
  async runFullSuite(): Promise<TestSuiteResult> {
    console.group('🧪 Running Full Test Suite')
    
    try {
      // Run tests in parallel where possible
      const testPromises: Promise<any>[] = []
      
      // Accessibility test
      if (this.config.accessibility.enabled) {
        testPromises.push(this.runAccessibilityTest())
      }
      
      // Cross-browser test
      if (this.config.crossBrowser.enabled) {
        testPromises.push(this.runCrossBrowserTest())
      }
      
      // Performance test (run after a delay to ensure page is loaded)
      let performancePromise: Promise<PerformanceReport>
      if (this.config.performance.enabled) {
        performancePromise = this.runPerformanceTest()
        testPromises.push(performancePromise)
      }
      
      // Wait for all tests to complete
      const [accessibilityResult, crossBrowserResult, performanceResult] = await Promise.all([
        testPromises[0] || this.getDefaultAccessibilityResult(),
        testPromises[1] || this.getDefaultCrossBrowserResult(),
        testPromises[2] || this.getDefaultPerformanceResult()
      ])
      
      // Calculate overall score
      const overall = this.calculateOverallScore({
        accessibility: accessibilityResult,
        performance: performanceResult,
        crossBrowser: crossBrowserResult
      })
      
      const result: TestSuiteResult = {
        accessibility: accessibilityResult,
        performance: performanceResult,
        crossBrowser: crossBrowserResult,
        overall,
        timestamp: Date.now()
      }
      
      this.results.push(result)
      this.logTestSuiteResults(result)
      
      return result
      
    } catch (error) {
      console.error('Test suite execution failed:', error)
      throw error
    } finally {
      console.groupEnd()
    }
  }
  
  private async runAccessibilityTest(): Promise<AccessibilityReport> {
    try {
      const rootElement = this.config.accessibility.rootSelector 
        ? document.querySelector(this.config.accessibility.rootSelector) || document.body
        : document.body
      
      return await runAccessibilityAudit(rootElement)
    } catch (error) {
      console.error('Accessibility test failed:', error)
      return this.getDefaultAccessibilityResult()
    }
  }
  
  private async runCrossBrowserTest(): Promise<BrowserTestResult> {
    try {
      return await crossBrowserTester.runBrowserTests()
    } catch (error) {
      console.error('Cross-browser test failed:', error)
      return this.getDefaultCrossBrowserResult()
    }
  }
  
  private async runPerformanceTest(): Promise<PerformanceReport> {
    try {
      // Wait for page to be fully loaded
      if (this.config.performance.waitTime) {
        await new Promise(resolve => setTimeout(resolve, this.config.performance.waitTime))
      }
      
      return performanceTracker.generateReport()
    } catch (error) {
      console.error('Performance test failed:', error)
      return this.getDefaultPerformanceResult()
    }
  }
  
  private calculateOverallScore(results: {
    accessibility: AccessibilityReport
    performance: PerformanceReport
    crossBrowser: BrowserTestResult
  }): { score: number; grade: 'A' | 'B' | 'C' | 'D' | 'F'; passed: boolean } {
    // Weighted scoring
    const accessibilityWeight = 0.4  // 40%
    const performanceWeight = 0.4    // 40%
    const crossBrowserWeight = 0.2   // 20%
    
    const accessibilityScore = results.accessibility.score || 0
    const performanceScore = results.performance.score || 0
    const crossBrowserScore = results.crossBrowser.passed ? 100 : 0
    
    const weightedScore = 
      (accessibilityScore * accessibilityWeight) +
      (performanceScore * performanceWeight) +
      (crossBrowserScore * crossBrowserWeight)
    
    const score = Math.round(weightedScore)
    const grade = this.calculateGrade(score)
    const passed = score >= 70 && results.crossBrowser.passed
    
    return { score, grade, passed }
  }
  
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }
  
  private getDefaultAccessibilityResult(): AccessibilityReport {
    return {
      passed: 0,
      failed: 1,
      warnings: 0,
      issues: [{
        element: document.body,
        type: 'error',
        rule: 'Test Failed',
        description: 'Accessibility test could not be completed',
        impact: 'critical',
        recommendation: 'Check console for errors'
      }],
      score: 0,
      compliance: 'Non-compliant'
    }
  }
  
  private getDefaultCrossBrowserResult(): BrowserTestResult {
    return {
      browser: 'Unknown',
      version: 'unknown',
      passed: false,
      errors: ['Cross-browser test failed'],
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
  }
  
  private getDefaultPerformanceResult(): PerformanceReport {
    return {
      metrics: {} as any,
      score: 0,
      recommendations: ['Performance test failed'],
      grade: 'F'
    }
  }
  
  private logTestSuiteResults(result: TestSuiteResult): void {
    console.group(`📊 Test Suite Results - Grade: ${result.overall.grade} (${result.overall.score}/100)`)
    
    // Accessibility Results
    console.group('🎯 Accessibility')
    console.log(`Score: ${result.accessibility.score}/100`)
    console.log(`Compliance: ${result.accessibility.compliance}`)
    console.log(`Issues: ${result.accessibility.issues.length}`)
    console.groupEnd()
    
    // Performance Results
    console.group('🚀 Performance')
    console.log(`Score: ${result.performance.score}/100`)
    console.log(`Grade: ${result.performance.grade}`)
    if (result.performance.metrics.lcp) {
      console.log(`LCP: ${result.performance.metrics.lcp.toFixed(2)}ms`)
    }
    console.groupEnd()
    
    // Cross-Browser Results
    console.group('🌐 Cross-Browser')
    console.log(`Browser: ${result.crossBrowser.browser}`)
    console.log(`Status: ${result.crossBrowser.passed ? 'Passed' : 'Failed'}`)
    console.log(`Errors: ${result.crossBrowser.errors.length}`)
    console.groupEnd()
    
    // Overall Status
    const statusIcon = result.overall.passed ? '✅' : '❌'
    console.log(`${statusIcon} Overall Status: ${result.overall.passed ? 'PASSED' : 'FAILED'}`)
    
    console.groupEnd()
  }
  
  private startAutoRun(): void {
    if (this.autoRunInterval) {
      clearInterval(this.autoRunInterval)
    }
    
    // Run initial test after 10 seconds
    setTimeout(() => {
      this.runFullSuite()
    }, 10000)
    
    // Then run periodically
    this.autoRunInterval = window.setInterval(() => {
      this.runFullSuite()
    }, this.config.autoRun.interval)
  }
  
  stopAutoRun(): void {
    if (this.autoRunInterval) {
      clearInterval(this.autoRunInterval)
      this.autoRunInterval = undefined
    }
  }
  
  getHistory(): TestSuiteResult[] {
    return [...this.results]
  }
  
  getLatestResult(): TestSuiteResult | null {
    return this.results.length > 0 ? this.results[this.results.length - 1] : null
  }
  
  generateDetailedReport(): string {
    const latest = this.getLatestResult()
    if (!latest) {
      return '# Test Suite Report\n\nNo test results available.'
    }
    
    return `
# Wellness Meditation App - Test Suite Report

**Generated**: ${new Date(latest.timestamp).toLocaleString()}
**Overall Grade**: ${latest.overall.grade} (${latest.overall.score}/100)
**Status**: ${latest.overall.passed ? '✅ PASSED' : '❌ FAILED'}

## Summary

| Test Type | Score | Status |
|-----------|-------|--------|
| Accessibility | ${latest.accessibility.score}/100 | ${latest.accessibility.compliance} |
| Performance | ${latest.performance.score}/100 | Grade ${latest.performance.grade} |
| Cross-Browser | ${latest.crossBrowser.passed ? '100' : '0'}/100 | ${latest.crossBrowser.passed ? 'Passed' : 'Failed'} |

## Accessibility Results

- **Compliance Level**: ${latest.accessibility.compliance}
- **Issues Found**: ${latest.accessibility.issues.length}
- **Critical Issues**: ${latest.accessibility.issues.filter(i => i.impact === 'critical').length}

### Top Issues
${latest.accessibility.issues.slice(0, 5).map(issue => 
  `- **${issue.impact.toUpperCase()}**: ${issue.description}`
).join('\n')}

## Performance Results

- **Core Web Vitals**:
  ${latest.performance.metrics.lcp ? `- LCP: ${latest.performance.metrics.lcp.toFixed(2)}ms` : ''}
  ${latest.performance.metrics.fid ? `- FID: ${latest.performance.metrics.fid.toFixed(2)}ms` : ''}
  ${latest.performance.metrics.cls ? `- CLS: ${latest.performance.metrics.cls.toFixed(3)}` : ''}

### Recommendations
${latest.performance.recommendations.map(rec => `- ${rec}`).join('\n')}

## Cross-Browser Compatibility

- **Browser**: ${latest.crossBrowser.browser} ${latest.crossBrowser.version}
- **Feature Support**:
  - Service Worker: ${latest.crossBrowser.features.serviceWorker ? '✅' : '❌'}
  - WebGL: ${latest.crossBrowser.features.webGL ? '✅' : '❌'}
  - CSS Custom Properties: ${latest.crossBrowser.features.cssCustomProperties ? '✅' : '❌'}
  - Backdrop Filter: ${latest.crossBrowser.features.backdropFilter ? '✅' : '❌'}
  - Intersection Observer: ${latest.crossBrowser.features.intersectionObserver ? '✅' : '❌'}

${latest.crossBrowser.errors.length > 0 ? `### Errors\n${latest.crossBrowser.errors.map(error => `- ${error}`).join('\n')}` : ''}

---

*Report generated by Wellness Meditation App Test Suite*
    `.trim()
  }
  
  cleanup(): void {
    this.stopAutoRun()
    performanceTracker.cleanup()
  }
}

// Global test suite instance
export const testSuite = new TestSuite()

// Export for easy access in development
if (import.meta.env.DEV) {
  (window as any).runTests = () => testSuite.runFullSuite()
}
