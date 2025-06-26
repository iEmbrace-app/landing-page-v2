import { useState, useEffect, useRef } from 'react'
import { ComponentLoadingFallback } from '../LazyComponents'

interface ImmerseSectionContainerProps {
  isMobile?: boolean
}

// Lazy load the ImmerseSection only when it's about to be visible
const LazyImmerseSection = () => import('./ImmerseSection').then(module => ({ default: module.ImmerseSection }))

export function ImmerseSectionContainer({ isMobile }: ImmerseSectionContainerProps) {
  const [Component, setComponent] = useState<React.ComponentType<{ isMobile?: boolean }> | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
            
            // Load the component when it's about to become visible
            LazyImmerseSection().then((module) => {
              setComponent(() => module.default)
            })
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
  }, [isVisible])

  return (
    <div ref={containerRef} style={{ minHeight: '100vh' }}>
      {Component ? (
        <Component isMobile={isMobile} />
      ) : isVisible ? (
        <ComponentLoadingFallback />
      ) : (
        // Placeholder while not visible with explicit dimensions
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
