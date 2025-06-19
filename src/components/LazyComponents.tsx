import { lazy } from 'react'

// Lazy-loaded components for better performance
export const TabSection = lazy(() => import('./sections/TabSection').then(module => ({ default: module.TabSection })))
export const HoldMeditateSection = lazy(() => import('./sections/HoldMeditateSection').then(module => ({ default: module.HoldMeditateSection })))
export const ImmerseSection = lazy(() => import('./sections/ImmerseSection').then(module => ({ default: module.ImmerseSection })))

// Loading fallback component
export function ComponentLoadingFallback() {
  return (
    <div className="component-loading">
      <div className="loading-spinner" />      <span>Loading meditation experience...</span>
    </div>
  )
}

/**
 * Minimal loading spinner for 3D components
 */
export function ThreeDLoadingFallback() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      color: '#003b5e',
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '0.8rem',
      opacity: 0.6,
      textAlign: 'center'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid rgba(0, 59, 94, 0.2)',
        borderTop: '2px solid #003b5e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 8px'
      }} />
      Initializing 3D...
    </div>
  )
}
