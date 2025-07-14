import { Suspense, useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { FloatingNav } from './components/layout/FloatingNav'
import { HeroSection } from './components/sections/HeroSection'
import { ImmerseIntroSection } from './components/sections/ImmerseIntroSection'
import { ImmerseSectionContainer } from './components/sections/ImmerseSectionContainer'
import { NFCSection } from './components/sections/NFCSection'
import { TabSection, HoldMeditateSection, TestimonialSection, ComponentLoadingFallback } from './components/LazyComponents'
import { ScrollProgressIndicator } from './components/ui/ScrollProgressIndicator'
import { useScreenSize } from './hooks/useScreenSize'

import { tabContent } from './data/tabContent'
import './App.css'

function App() {
  const { isMobile } = useScreenSize()

  // Set browser tab title
  useEffect(() => {
    document.title = "Calming Place - The Pause you Deserve";
  }, []);

  // Navigation items for the floating navbar
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "About",
      link: "#about",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: "How It Works",
      link: "#how-it-works",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      name: "Testimonials",
      link: "#testimonials",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  // Your logo component
  const logo = (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
        <span className="text-white font-thin text-sm">M</span>
      </div>
      <span className="text-purple-900 font-thin text-lg tracking-wide">Meditate</span>
    </div>
  );

  return (
    <>
      {/* Floating Navbar */}
      <FloatingNav navItems={navItems} logo={logo} />
      
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />
      
      <main id="main-content" role="main" tabIndex={-1} style={{ 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Hero Section */}
        <section id="home" aria-label="Home">
          <HeroSection isMobile={isMobile} />
        </section>
        
        {/* Immerse Introduction Section */}
        <section aria-label="Immerse yourself introduction">
          <ImmerseIntroSection />
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
        
        {/* Testimonials Section */}
        <section id="testimonials" aria-label="Customer testimonials and reviews">
          <Suspense fallback={<ComponentLoadingFallback />}>
            <TestimonialSection isMobile={isMobile} />
          </Suspense>
        </section>

        {/* NFC Soundscapes Section */}
        <section id="nfc" aria-label="NFC Soundscapes Experience">
          <NFCSection isMobile={isMobile} />
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default App