function SimpleApp() {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Meditation App Debug</h1>
      <p>If you can see this, React is working!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Check</h2>
        <ul>
          <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not Set'}</li>
          <li>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}</li>
          <li>Video Service: {import.meta.env.VITE_VIDEO_SERVICE || 'supabase'}</li>
        </ul>
      </div>
    </div>
  )
}

export default SimpleApp
