import { useState } from 'react'

function DebugApp() {
  const [debugStep, setDebugStep] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const addError = (error: string) => {
    setErrors(prev => [...prev, error])
  }

  const steps = [
    'Basic React Component',
    'CSS Imports',
    'Supabase Import',
    'Video Service Import',
    'Navigation Component',
    'Hero Section',
    'Full App'
  ]

  const renderStep = () => {
    try {
      switch (debugStep) {
        case 0:
          return (
            <div>
              <h2>✅ Step 1: Basic React Component Working</h2>
              <p>React is working properly!</p>
            </div>
          )
        
        case 1:
          // Test CSS imports
          import('./index.css')
          import('./App.css')
          return (
            <div>
              <h2>✅ Step 2: CSS Imports Working</h2>
              <p>CSS files imported successfully!</p>
            </div>
          )
          case 2:
          // Test Supabase import
          import('./lib/supabase').then(() => {
            console.log('✅ Supabase imported successfully')
          }).catch(err => {
            addError(`Supabase import failed: ${err.message}`)
          })
          return (
            <div>
              <h2>🔄 Step 3: Testing Supabase Import</h2>
              <p>Check console for results...</p>
            </div>
          )
        
        case 3:
          // Test Video Service import
          import('./services/videoService').then(() => {
            console.log('✅ Video Service imported successfully')
          }).catch(err => {
            addError(`Video Service import failed: ${err.message}`)
          })
          return (
            <div>
              <h2>🔄 Step 4: Testing Video Service Import</h2>
              <p>Check console for results...</p>
            </div>
          )
        
        case 4:
          // Test Navigation component
          const { Navigation } = require('../components/layout/Navigation')
          return (
            <div>
              <h2>✅ Step 5: Navigation Component</h2>
              <Navigation />
            </div>
          )
        
        case 5:
          // Test Hero Section
          const { HeroSection } = require('../components/sections/HeroSection')
          return (
            <div>
              <h2>✅ Step 6: Hero Section</h2>
              <HeroSection />
            </div>
          )
        
        case 6:
          // Full app
          const App = require('../App').default
          return <App />
        
        default:
          return <div>Unknown step</div>
      }    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addError(`Step ${debugStep} failed: ${errorMessage}`)
      return (
        <div>
          <h2>❌ Step {debugStep + 1} Failed</h2>
          <p>Error: {errorMessage}</p>
        </div>
      )
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🔍 Meditation App Debug Process</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Progress: {debugStep + 1} / {steps.length}</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setDebugStep(index)}
              style={{
                padding: '8px 12px',
                backgroundColor: index === debugStep ? '#4CAF50' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {index + 1}. {step}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {renderStep()}
      </div>

      {errors.length > 0 && (
        <div style={{ 
          backgroundColor: '#ff4444', 
          padding: '15px', 
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>🚨 Errors Found:</h3>
          {errors.map((error, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              {index + 1}. {error}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Environment Info:</h3>
        <ul>
          <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not Set'}</li>
          <li>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}</li>
          <li>Video Service: {import.meta.env.VITE_VIDEO_SERVICE || 'supabase'}</li>
          <li>AWS Access Key: {import.meta.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not Set'}</li>
        </ul>
      </div>
    </div>
  )
}

export default DebugApp
