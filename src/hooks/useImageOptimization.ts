import { useState, useEffect } from 'react'

interface UseImageOptimizationOptions {
  src: string
  fallback?: string
  lazy?: boolean
}

export const useImageOptimization = ({ 
  src, 
  fallback, 
  lazy = true 
}: UseImageOptimizationOptions) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(lazy ? undefined : src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!lazy || imageSrc) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    
    img.onerror = () => {
      if (fallback) {
        setImageSrc(fallback)
      }
      setHasError(true)
      setIsLoading(false)
    }

    // Use intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    // Create a dummy element to observe
    const dummyElement = document.createElement('div')
    document.body.appendChild(dummyElement)
    observer.observe(dummyElement)

    return () => {
      observer.disconnect()
      document.body.removeChild(dummyElement)
    }
  }, [src, fallback, lazy, imageSrc])

  return { imageSrc, isLoading, hasError }
}
