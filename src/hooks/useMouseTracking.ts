import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function useMouseTracking() {
  const mouse = useRef(new THREE.Vector2())
  
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