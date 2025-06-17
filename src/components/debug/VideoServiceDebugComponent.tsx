import { useEffect, useState } from 'react'
import { VideoService } from '../../services/videoService'
import { Video } from '../../services/r2Service'

export function VideoServiceDebugComponent() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔍 VideoServiceDebugComponent: Starting debug...')
    
    VideoService.fetchVideos()
      .then((loadedVideos) => {
        console.log('✅ VideoServiceDebugComponent: Videos loaded:', loadedVideos)
        setVideos(loadedVideos)
        setLoading(false)
      })
      .catch((err) => {
        console.error('❌ VideoServiceDebugComponent: Error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ padding: '20px', color: 'white' }}>Loading video service...</div>
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: '20px', color: 'white', background: 'rgba(0,0,0,0.8)' }}>
      <h3>Video Service Debug</h3>
      <p>Videos loaded: {videos.length}</p>
      
      {videos.map((video, index) => (
        <div key={video.id} style={{ margin: '10px 0', border: '1px solid white', padding: '10px' }}>
          <h4>{video.title}</h4>
          <p><strong>URL:</strong> {video.url}</p>
          <p><strong>Filename:</strong> {video.filename}</p>
          
          <video 
            src={video.url} 
            controls 
            muted 
            style={{ width: '300px', height: '200px' }}
            onError={(e) => console.error(`Video ${index} error:`, e)}
            onCanPlay={() => console.log(`Video ${index} can play`)}
          />
        </div>
      ))}
    </div>
  )
}
