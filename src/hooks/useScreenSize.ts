import { useState, useEffect } from 'react'
import { ScreenSizeHook } from '../types'

export const useScreenSize = (): ScreenSizeHook => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 767)
      setIsTablet(width > 767 && width <= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return { isMobile, isTablet }
}
