import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://jehmrevswtimvaqgcwas.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaG1yZXZzd3RpbXZhcWdjd2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzM5NDUsImV4cCI6MjA2NTcwOTk0NX0.h6pd_oiQggN646LxYBYcuJZgGRNbFhzrINDsaEOYPjc'
const supabase = createClient(supabaseUrl, supabaseKey)

// Video files to upload (place these in a 'videos' folder in your project root)
const videoFiles = [
  { filename: 'lake.mp4', title: 'LAKE' },
  { filename: 'forest.mp4', title: 'FOREST' },
  { filename: 'zen.mp4', title: 'ZEN GARDEN' },
  { filename: 'campfire.mp4', title: 'CAMPFIRE' }
]

async function uploadVideos() {
  console.log('🎥 Starting video upload to Supabase...')
    // Check if videos folder exists
  const videosDir = path.join(process.cwd(), 'public', 'videos')
  if (!fs.existsSync(videosDir)) {
    console.log('📁 Videos folder not found. Please create a "public/videos" folder in your project and place your video files there.')
    console.log('Expected files:')
    videoFiles.forEach(video => console.log(`  - ${video.filename}`))
    return
  }

  for (const video of videoFiles) {
    const filePath = path.join(videosDir, video.filename)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${video.filename}`)
      continue
    }

    console.log(`📤 Uploading ${video.filename}...`)
    
    try {
      // Read file
      const fileBuffer = fs.readFileSync(filePath)
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(video.filename, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true // Replace if exists
        })

      if (error) {
        console.error(`❌ Upload failed for ${video.filename}:`, error.message)
      } else {
        console.log(`✅ Successfully uploaded: ${video.filename}`)
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(video.filename)
        
        console.log(`   Public URL: ${publicUrl}`)
      }
    } catch (err) {
      console.error(`❌ Error uploading ${video.filename}:`, err.message)
    }
  }
  
  console.log('\n🎉 Upload process completed!')
  console.log('📋 Next steps:')
  console.log('1. Run the SQL script (scripts/setup.sql) in your Supabase dashboard')
  console.log('2. Test the videos by refreshing your application')
}

uploadVideos()
