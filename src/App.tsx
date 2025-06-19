import { Suspense } from 'react'
import { Navigation } from './components/layout/Navigation'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { ImmerseSectionContainer } from './components/sections/ImmerseSectionContainer'
import { TabSection, HoldMeditateSection, ComponentLoadingFallback } from './components/LazyComponents'
// import { ParticleBackground } from './components/ui/ParticleBackground' // Removed for cleaner design
import { useScreenSize } from './hooks/useScreenSize'
import { tabContent } from './data/tabContent'
import './App.css'

function App() {
  const { isMobile } = useScreenSize()
  return (
    <>
      {/* Removed ParticleBackground for cleaner, more meditative design */}
      
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
        Skip to main content      </a>
        <Navigation />
        <main id="main-content" role="main" tabIndex={-1} style={{ 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Hero Section */}
        <section id="home" aria-label="Home">
          <HeroSection isMobile={isMobile} />
        </section>
          {/* Immerse Section */}
        <section id="immerse" aria-label="Immerse yourself in tranquil environments">
          <ImmerseSectionContainer isMobile={isMobile} />
        </section>
        
        {/* About Section */}
        <section id="about" aria-label="About - Meditation techniques">
          <Suspense fallback={<ComponentLoadingFallback />}>
            <TabSection isMobile={isMobile} tabContent={tabContent} />
          </Suspense>
        </section>
        
        {/* How It Works Section */}
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