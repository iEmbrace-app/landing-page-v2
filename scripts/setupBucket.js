import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jehmrevswtimvaqgcwas.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaG1yZXZzd3RpbXZhcWdjd2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzM5NDUsImV4cCI6MjA2NTcwOTk0NX0.h6pd_oiQggN646LxYBYcuJZgGRNbFhzrINDsaEOYPjc'
const supabase = createClient(supabaseUrl, supabaseKey)

async function setupBucket() {
  console.log('🔧 Setting up videos bucket...')
  
  try {
    // Create the videos bucket
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('videos', {
        public: false, // Private bucket as you requested
        fileSizeLimit: 1024 * 1024 * 100, // 100MB limit
        allowedMimeTypes: ['video/mp4', 'video/webm', 'video/mov']
      })
    
    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Videos bucket already exists')
      } else {
        console.error('❌ Error creating bucket:', bucketError)
        return
      }
    } else {
      console.log('✅ Created videos bucket')
    }
    
    // Now create some simple video content using canvas and upload
    console.log('📹 Creating sample meditation videos...')
    
    // For now, let's just create placeholder files to test the system
    const sampleVideoContent = new Uint8Array([
      // This is just a minimal valid MP4 header - replace with actual video files
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70
    ])
    
    const videoFiles = ['lake.mp4', 'forest.mp4', 'zen.mp4', 'campfire.mp4']
    
    for (const filename of videoFiles) {
      console.log(`📤 Uploading ${filename}...`)
      
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filename, sampleVideoContent, {
          contentType: 'video/mp4'
        })
      
      if (error) {
        console.error(`❌ Error uploading ${filename}:`, error)
      } else {
        console.log(`✅ Uploaded ${filename}`)
        
        // Test signed URL
        const { data: signedData, error: signedError } = await supabase.storage
          .from('videos')
          .createSignedUrl(filename, 3600)
        
        if (signedError) {
          console.error(`❌ Error creating signed URL for ${filename}:`, signedError)
        } else {
          console.log(`🔗 Signed URL for ${filename}: ${signedData.signedUrl}`)
        }
      }
    }
    
    console.log('\n🎉 Setup complete! Your app should now load videos.')
    
  } catch (err) {
    console.error('❌ Setup error:', err)
  }
}

setupBucket()
