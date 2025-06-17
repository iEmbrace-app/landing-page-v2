import { Suspense } from 'react'
import { Navigation } from './components/layout/Navigation'
import { HeroSection } from './components/sections/HeroSection'
import { useScreenSize } from './hooks/useScreenSize'
import { ParticleBackground } from './components/ui/ParticleBackground'
import { TabSection } from './components/LazyComponents'
import { tabContent } from './data/tabContent'
import './App.css'

// Minimal App to test components one by one
function App() {
  const { isMobile } = useScreenSize()
  
  return (
    <>
      {/* Ambient particle background */}
      <ParticleBackground particleCount={30} />
      
      <div style={{ 
        background: '#1a1a1a', 
        color: 'white', 
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <Navigation />
        <HeroSection isMobile={isMobile} />
          <Suspense fallback={<div style={{ padding: '20px', color: 'white' }}>Loading TabSection...</div>}>
          <TabSection tabContent={tabContent} isMobile={isMobile} />
        </Suspense>
        
        <div style={{ padding: '20px' }}>
          <h1>🧘 Meditation App - Testing TabSection...</h1>
          <p>Navigation + HeroSection + ParticleBackground + TabSection loaded!</p>
          
          <div style={{ marginTop: '20px' }}>
            <p>Environment Status:</p>
            <ul>
              <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</li>
              <li>Video Service: {import.meta.env.VITE_VIDEO_SERVICE || 'supabase'}</li>
              <li>Screen Size: {isMobile ? 'Mobile' : 'Desktop'}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
