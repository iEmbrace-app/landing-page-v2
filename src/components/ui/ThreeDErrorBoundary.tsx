import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary for 3D Components
 * Gracefully handles Three.js and WebGL errors to prevent app crashes
 */
class ThreeDErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }
  componentDidCatch(_error: Error, errorInfo: ErrorInfo) {
    // Log the error for monitoring    console.error(`3D Component Error in ${this.props.componentName || 'Unknown'}:`, _error)
    console.error('Error Info:', errorInfo)
    
    // TODO: Report to error tracking service in production
    // Example: Sentry, LogRocket, etc.
    // errorTracker.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default
      return this.props.fallback || (
        <div 
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            margin: '10px'
          }}
        >
          <p>⚠️ 3D visualization temporarily unavailable</p>
          <details style={{ marginTop: '10px', fontSize: '12px' }}>
            <summary>Technical Details</summary>
            <p style={{ margin: '5px 0' }}>
              Component: {this.props.componentName || 'Unknown'}
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace' }}>
              {this.state.error?.message}
            </p>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ThreeDErrorBoundary
