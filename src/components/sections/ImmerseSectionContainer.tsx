import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { ComponentLoadingFallback } from '../LazyComponents'

interface ImmerseSectionContainerProps {
  isMobile?: boolean
}

// Properly type the lazy component
const LazyImmerseSection = lazy(() => 
  import('./ImmerseSection').then(module => ({ 
    default: module.ImmerseSection 
  }))
) as React.LazyExoticComponent<React.ComponentType<{ isMobile?: boolean }>>

export function ImmerseSectionContainer({ isMobile }: ImmerseSectionContainerProps) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent re-running if already loaded
    if (hasLoadedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasLoadedRef.current) {
          setShouldLoad(true)
          hasLoadedRef.current = true
          observer.disconnect() // Stop observing once loaded
        }
      },
      { 
        // Preload slightly before visible
        rootMargin: '100px 0px',
        threshold: 0
      }
    )

    const currentRef = containerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        minHeight: '120vh', // Match the ImmerseSection height
        position: 'relative'
      }}
    >
      {shouldLoad ? (
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazyImmerseSection isMobile={isMobile} />
        </Suspense>
      ) : (
        // Placeholder with matching height and theme
        <div style={{ 
          height: '120vh',
          width: '100%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4facfe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease-in-out infinite',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Optional subtle loading indicator */}
          <div style={{ 
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              textAlign: 'center',
              maxWidth: '500px',
              padding: '2rem'
            }}>
              <h2 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 300,
                fontFamily: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif"
              }}>
                Immerse Yourself
              </h2>
              <p style={{ 
                margin: '0', 
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: 300,
                opacity: 0.9,
                fontFamily: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif"
              }}>
                Tranquil environments await
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}