// src/App.tsx
import { Suspense, useEffect } from 'react'
import { Navigation } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { TabSection, HoldMeditateSection, ComponentLoadingFallback } from './components/LazyComponents'
import { ParticleBackground } from './components/ui/ParticleBackground'
import { useScreenSize } from './hooks/useScreenSize'
import { 
  useAccessibilityMonitor, 
  useKeyboardNavigationTracker, 
  useScreenReaderSimulator 
} from './hooks/useAccessibilityAudit'
import { tabContent } from './data/tabContent'
import './App.css'

function App() {
  const { isMobile } = useScreenSize()
  
  // Accessibility testing hooks (development only)
  useAccessibilityMonitor(import.meta.env.DEV)
  useKeyboardNavigationTracker(import.meta.env.DEV)
  useScreenReaderSimulator(import.meta.env.DEV)  // Initialize comprehensive testing suite in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🧪 Wellness App Testing Suite initialized')
      console.log('Use window.runTests() to manually run the full test suite')
        // Initialize testing suite globally for manual testing
      import('./utils/TestSuite').then(({ testSuite }) => {
        (window as any).runTests = () => testSuite.runFullSuite()
      })
    }
  }, [])
  return (
    <>
      {/* Ambient particle background */}
      <ParticleBackground particleCount={30} />
      
      {/* Skip link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
        style={{
          position: 'absolute',
          top: '-40px',
          left: '6px',
          background: 'var(--colors-primary-800)',
          color: 'white',
          padding: '8px',
          textDecoration: 'none',
          borderRadius: '0 0 4px 4px',
          zIndex: 1000,
          transition: 'top 0.2s ease'
        }}
        onFocus={(e) => e.currentTarget.style.top = '0'}
        onBlur={(e) => e.currentTarget.style.top = '-40px'}
      >
        Skip to main content
      </a>
      
      <Navigation />      <main id="main-content" role="main" tabIndex={-1}>
        <section id="home" aria-label="Home">
          <HeroSection isMobile={isMobile} />
        </section>
        
        {/* Lazy load non-critical sections */}
        <section id="about" aria-label="About - Meditation techniques">
          <Suspense fallback={<ComponentLoadingFallback />}>
            <TabSection isMobile={isMobile} tabContent={tabContent} />
          </Suspense>
        </section>
          <section id="how-it-works" aria-label="How it works - Hold and meditate practice">
          <Suspense fallback={<ComponentLoadingFallback />}>
            <HoldMeditateSection isMobile={isMobile} />
          </Suspense>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default App