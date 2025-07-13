import { useState, useEffect, useCallback } from 'react'
import { ScreenSizeHook } from '../types'

export const useScreenSize = (): ScreenSizeHook => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth
    const newIsMobile = width <= 767
    const newIsTablet = width > 767 && width <= 1024
    
    // Only update if values actually changed
    setIsMobile(prevIsMobile => prevIsMobile !== newIsMobile ? newIsMobile : prevIsMobile)
    setIsTablet(prevIsTablet => prevIsTablet !== newIsTablet ? newIsTablet : prevIsTablet)
  }, [])

  useEffect(() => {
    checkScreenSize()
    
    // Throttle resize events for better performance
    let timeoutId: number | null = null
    const throttledResize = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(checkScreenSize, 150)
    }
    
    window.addEventListener('resize', throttledResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', throttledResize)
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [checkScreenSize])

  return { isMobile, isTablet }
}
