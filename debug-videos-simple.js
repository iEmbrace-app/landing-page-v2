// Simple Node.js script to test video URLs directly with Supabase
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🎥 Simple Video URL Debug Test')
console.log('🚀 Starting video debug...')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials')
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabaseConnection() {
  try {
    console.log('\n🔌 Testing Supabase connection...')
    const { data, error } = await supabase.from('videos').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      return false
    }
    
    console.log('✅ Supabase connected successfully')
    console.log('📊 Video count:', data)
    return true
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message)
    return false
  }
}

async function fetchAndTestVideos() {
  try {
    console.log('\n🎬 Fetching videos from database...')
    
    // Fetch videos from database
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('❌ Error fetching videos:', error.message)
      return
    }
    
    console.log(`✅ Found ${videos?.length || 0} videos in database`)
    
    if (!videos || videos.length === 0) {
      console.log('📝 No videos found in database')
      return
    }
    
    // Test each video
    for (const video of videos) {
      console.log(`\n🎯 Testing video: ${video.title}`)
      console.log(`   ID: ${video.id}`)
      console.log(`   File Path: ${video.file_path}`)
      
      // Test signed URL generation
      try {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('meditation-videos')
          .createSignedUrl(video.file_path, 3600) // 1 hour expiry
        
        if (signedUrlError) {
          console.error(`   ❌ Signed URL error:`, signedUrlError.message)
          continue
        }
        
        if (!signedUrlData?.signedUrl) {
          console.error(`   ❌ No signed URL returned`)
          continue
        }
        
        console.log(`   ✅ Signed URL generated: ${signedUrlData.signedUrl.substring(0, 100)}...`)
        
        // Test if URL is accessible
        try {
          console.log(`   🌐 Testing URL accessibility...`)
          const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' })
          
          if (response.ok) {
            console.log(`   ✅ URL accessible (${response.status})`)
            console.log(`   📁 Content-Type: ${response.headers.get('content-type') || 'Unknown'}`)
            console.log(`   📏 Content-Length: ${response.headers.get('content-length') || 'Unknown'}`)
          } else {
            console.error(`   ❌ URL not accessible: ${response.status} ${response.statusText}`)
          }
        } catch (fetchError) {
          console.error(`   ❌ URL fetch error:`, fetchError.message)
        }
        
      } catch (urlError) {
        console.error(`   ❌ URL generation failed:`, urlError.message)
      }
    }
    
  } catch (error) {
    console.error('❌ Video fetch failed:', error.message)
  }
}

async function testStorageBucket() {
  try {
    console.log('\n🪣 Testing storage bucket access...')
    
    const { data: files, error } = await supabase.storage
      .from('meditation-videos')
      .list('', { limit: 10 })
    
    if (error) {
      console.error('❌ Bucket access error:', error.message)
      return
    }
    
    console.log(`✅ Bucket accessible, found ${files?.length || 0} files`)
    
    if (files && files.length > 0) {
      console.log('📁 Files in bucket:')
      files.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size || 'unknown size'})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Storage test failed:', error.message)
  }
}

// Run all tests
async function runDebug() {
  const connectionOk = await testSupabaseConnection()
  
  if (connectionOk) {
    await testStorageBucket()
    await fetchAndTestVideos()
  }
  
  console.log('\n🎉 Video debug complete!')
}

runDebug().catch(console.error)
