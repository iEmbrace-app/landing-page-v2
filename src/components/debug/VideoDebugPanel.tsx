import { useEffect, useState } from 'react'
import { VideoService, VideoServiceDebug } from '../../services/videoService'
import { Video } from '../../lib/supabase'

export function VideoDebugPanel() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  useEffect(() => {
    const debugVideoFlow = async () => {
      try {
        setLoading(true)
        addLog('🎬 Starting video debug...')
        
        // Test storage connection
        addLog('� Testing Supabase storage connection...')
        const storageConnected = await VideoService.testStorageConnection()
        addLog(`Storage Connection: ${storageConnected ? '✅ Connected' : '❌ Failed'}`)
        
        // List all files in bucket
        addLog('📁 Listing files in videos bucket...')
        const allFiles = await VideoServiceDebug.listAllFiles()
        addLog(`Found ${allFiles.length} files in bucket`)
        allFiles.forEach(file => {
          addLog(`  - ${file.name} (${file.id ? 'file' : 'folder'})`)
        })
        
        // Test access to known video files
        const knownFiles = ['campfire.mp4', 'forest.mp4', 'lake.mp4', 'zen.mp4']
        addLog('� Testing access to known video files...')
        
        for (const filename of knownFiles) {
          addLog(`Testing ${filename}...`)
          const result = await VideoServiceDebug.testVideoAccess(filename)
          if (result.success) {
            addLog(`  ✅ ${filename}: Accessible`)
            addLog(`     URL: ${result.url?.substring(0, 80)}...`)
          } else {
            addLog(`  ❌ ${filename}: ${result.error}`)
          }
        }
        
        // Test VideoService.fetchVideos()
        addLog('📡 Calling VideoService.fetchVideos()...')
        const videoData = await VideoService.fetchVideos()
        
        addLog(`✅ Got ${videoData.length} videos from VideoService`)
        setVideos(videoData)
        
        // Log each video
        videoData.forEach((video, index) => {
          addLog(`  ${index + 1}. ${video.title} - ${video.filename}`)
          addLog(`     URL: ${video.url.substring(0, 100)}...`)
        })
        
        // Test URL accessibility for fetched videos
        for (const video of videoData) {
          try {
            addLog(`🧪 Testing URL for ${video.filename}...`)
            const response = await fetch(video.url, { method: 'HEAD' })
            addLog(`  HTTP ${response.status}: ${response.statusText}`)
            addLog(`  Content-Type: ${response.headers.get('Content-Type')}`)
            addLog(`  Content-Length: ${response.headers.get('Content-Length')} bytes`)
          } catch (fetchError: any) {
            addLog(`  ❌ Fetch failed: ${fetchError?.message || fetchError}`)
          }
        }
        
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        addLog(`❌ Debug failed: ${errorMsg}`)
      } finally {
        setLoading(false)
      }
    }

    debugVideoFlow()
  }, [])

  const testVideoElement = async (video: Video) => {
    addLog(`🎥 Testing video element for ${video.filename}...`)
    
    const videoEl = document.createElement('video')
    videoEl.muted = true
    videoEl.playsInline = true
    videoEl.preload = 'metadata'
    
    videoEl.addEventListener('loadstart', () => addLog(`  ⏳ ${video.filename}: Load started`))
    videoEl.addEventListener('loadedmetadata', () => addLog(`  ✅ ${video.filename}: Metadata loaded`))
    videoEl.addEventListener('loadeddata', () => addLog(`  ✅ ${video.filename}: Data loaded`))
    videoEl.addEventListener('canplay', () => addLog(`  ✅ ${video.filename}: Can play`))
    videoEl.addEventListener('error', (e) => {
      const target = e.target as HTMLVideoElement
      addLog(`  ❌ ${video.filename}: Video error ${target.error?.code} - ${target.error?.message}`)
    })
    
    videoEl.src = video.url
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '500px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      overflow: 'auto',
      zIndex: 1000,
      border: '1px solid #333'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#58a6ff' }}>🔍 Video Debug Panel</h3>
      
      {loading && <div style={{ color: '#d29922' }}>⏳ Loading...</div>}
      
      {error && (
        <div style={{ color: '#f85149', marginBottom: '10px' }}>
          ❌ Error: {error}
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Videos Found: {videos.length}</strong>
      </div>
      
      {videos.map((video, index) => (
        <div key={index} style={{ 
          marginBottom: '8px', 
          padding: '8px', 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px'
        }}>
          <div style={{ color: '#56d364' }}>{video.title}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>{video.filename}</div>
          <button 
            onClick={() => testVideoElement(video)}
            style={{
              background: '#238636',
              color: 'white',
              border: 'none',
              padding: '2px 6px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '10px',
              marginTop: '4px'
            }}
          >
            Test Video
          </button>
        </div>
      ))}
      
      <div style={{ 
        marginTop: '10px', 
        maxHeight: '200px', 
        overflow: 'auto',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '8px',
        borderRadius: '4px'
      }}>
        <div style={{ color: '#58a6ff', marginBottom: '5px' }}>Debug Log:</div>
        {testResults.map((result, index) => (
          <div key={index} style={{ 
            fontSize: '10px', 
            lineHeight: '1.2',
            color: result.includes('❌') ? '#f85149' : 
                   result.includes('✅') ? '#56d364' : 
                   result.includes('⚠️') ? '#d29922' : '#c9d1d9'
          }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}
