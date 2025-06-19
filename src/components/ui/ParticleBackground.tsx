import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  particleCount?: number
}

export function ParticleBackground({ particleCount = 50 }: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particles: HTMLDivElement[] = []

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: radial-gradient(circle, rgba(211, 189, 242, ${Math.random() * 0.6 + 0.2}), transparent);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 15}s;
        animation-duration: ${Math.random() * 10 + 10}s;
        animation-name: float-particle;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        pointer-events: none;
      `
      
      container.appendChild(particle)
      particles.push(particle)
    }

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
    }
  }, [particleCount])
  return (
    <div 
      ref={containerRef}
      className="particle-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -10,
        overflow: 'hidden',
        /* Add a subtle gradient base that matches the hero section */
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f8ff 25%, #f0ebff 50%, #e6dcff 75%, #ddd0ff 100%)',
        opacity: 0.3 /* Make it subtle so it doesn't interfere with content */
      }}
    />
  )
}
