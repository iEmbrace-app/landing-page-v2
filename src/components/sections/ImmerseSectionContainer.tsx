import { useState, useEffect, useRef } from 'react'
import { ComponentLoadingFallback } from '../LazyComponents'
import { PerformanceOptimizer } from '../../utils/PerformanceOptimizer'

interface ImmerseSectionContainerProps {
  isMobile?: boolean
}

// Lazy load the ImmerseSection only when it's about to be visible
const LazyImmerseSection = () => import('./ImmerseSection').then(module => ({ default: module.ImmerseSection }))

export function ImmerseSectionContainer({ isMobile }: ImmerseSectionContainerProps) {
  const [Component, setComponent] = useState<React.ComponentType<{ isMobile?: boolean }> | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldLoadHeavyAssets, setShouldLoadHeavyAssets] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const optimizer = PerformanceOptimizer.getInstance()

  useEffect(() => {
    // Check if we should load heavy assets based on connection/device
    setShouldLoadHeavyAssets(optimizer.shouldLoadHeavyAssets())
  }, [optimizer])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            
            if (shouldLoadHeavyAssets) {
              // Preload critical assets before loading component
              optimizer.preloadResource('/src/services/r2Service.ts', 'script', 'high')
              optimizer.preloadResource('/src/utils/VideoManager.ts', 'script', 'medium')
              
              // Load the component when it's about to become visible
              LazyImmerseSection().then((module) => {
                setComponent(() => module.default)
              })
            } else {
              // Load a lightweight version for slow connections
              setComponent(() => LightweightImmerseSection)
            }
          }
        })
      },
      { 
        // Load when the element is 50% visible or 200px before it becomes visible
        rootMargin: '200px 0px',
        threshold: 0.1
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [isVisible, shouldLoadHeavyAssets, optimizer])

  return (
    <div ref={containerRef} style={{ minHeight: '100vh' }}>
      {Component ? (
        <Component isMobile={isMobile} />
      ) : isVisible ? (
        <ComponentLoadingFallback />
      ) : (        // Placeholder while not visible with explicit dimensions
        <div style={{ 
          height: '100vh', 
          width: '100%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #a8e6cf, #dda0dd)',
          color: '#003b5e',
          minHeight: '600px', // Prevent shifts on small screens
          position: 'relative'
        }}>
          <div style={{ 
            textAlign: 'center',
            maxWidth: '500px',
            padding: '2rem'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>Immerse Yourself</h2>
            <p style={{ margin: '0', fontSize: '1.1rem' }}>Scroll down to explore tranquil environments</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Lightweight fallback component for slow connections
function LightweightImmerseSection({ isMobile }: { isMobile?: boolean }) {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #a8e6cf, #dda0dd)',
      color: '#003b5e',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h2>🌿 Immerse in Tranquility</h2>
        <p>Experience calming environments designed for mindfulness</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Optimized experience for your connection
        </p>
        {!isMobile && (
          <button 
            style={{
              background: '#003b5e',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
            onClick={() => window.location.reload()}
          >
            Load Full Experience
          </button>
        )}
      </div>
    </div>
  )
}
