import { useRef, useEffect } from 'react'

// Simple Vector2 interface to replace Three.js Vector2
interface Vector2 {
  x: number
  y: number
}

export function useMouseTracking() {
  const mouse = useRef<Vector2>({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Exact same mouse tracking as reference code
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return mouse.current
}