// Check what files are in the Supabase storage bucket
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listBucketContents() {
  try {
    console.log('🪣 Checking storage buckets...')
    
    // First, list all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message)
      return
    }
    
    console.log('📦 Available buckets:')
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    // Check common bucket names for videos
    const bucketNames = [
      'meditation-videos',
      'videos',
      'media',
      'content',
      'assets'
    ]
    
    for (const bucketName of bucketNames) {
      console.log(`\n🔍 Checking bucket: ${bucketName}`)
      
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 50 })
      
      if (error) {
        console.log(`   ❌ Cannot access bucket: ${error.message}`)
        continue
      }
      
      console.log(`   ✅ Found ${files?.length || 0} files`)
      
      if (files && files.length > 0) {
        console.log('   📁 Files:')
        files.forEach(file => {
          const size = file.metadata?.size ? `${Math.round(file.metadata.size / 1024 / 1024 * 100) / 100} MB` : 'unknown size'
          console.log(`      - ${file.name} (${size})`)
        })
        
        // Test generating signed URLs for video files
        const videoFiles = files.filter(f => 
          f.name.endsWith('.mp4') || 
          f.name.endsWith('.webm') || 
          f.name.endsWith('.mov') ||
          f.name.endsWith('.avi')
        )
        
        if (videoFiles.length > 0) {
          console.log(`\n   🎬 Testing video file URLs:`)
          for (const videoFile of videoFiles.slice(0, 3)) { // Test first 3 videos
            try {
              const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(videoFile.name, 3600)
              
              if (signedUrlError) {
                console.log(`      ❌ ${videoFile.name}: ${signedUrlError.message}`)
              } else {
                console.log(`      ✅ ${videoFile.name}: URL generated`)
                console.log(`         ${signedUrlData.signedUrl.substring(0, 80)}...`)
                
                // Test URL accessibility
                try {
                  const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' })
                  if (response.ok) {
                    console.log(`         🌐 Accessible (${response.status}) - ${response.headers.get('content-type')}`)
                  } else {
                    console.log(`         ❌ Not accessible (${response.status})`)
                  }
                } catch (fetchError) {
                  console.log(`         ❌ Fetch error: ${fetchError.message}`)
                }
              }
            } catch (urlError) {
              console.log(`      ❌ ${videoFile.name}: ${urlError.message}`)
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Bucket check failed:', error.message)
  }
}

listBucketContents()
