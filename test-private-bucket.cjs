// Test private bucket access with proper authentication
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need this for private buckets

console.log('🔐 Testing private bucket access...')
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('Anon Key:', supabaseAnonKey ? 'Set' : 'Missing') 
console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing')

// Try with anon key first
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

// Try with service key if available
const supabaseService = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }) : null

async function testPrivateBucketAccess() {
  const videoFiles = ['campfire.mp4', 'forest.mp4', 'lake.mp4', 'zen.mp4']
  
  console.log('\n🎬 Testing access to known video files...')
  
  // Test with anon key
  console.log('\n👤 Testing with anonymous key:')
  for (const filename of videoFiles) {
    console.log(`\n🎯 Testing: ${filename}`)
    
    try {
      // Test signed URL with anon key
      const { data: signedUrlData, error: signedUrlError } = await supabaseAnon.storage
        .from('videos')
        .createSignedUrl(filename, 3600)
      
      if (signedUrlError) {
        console.log(`   ❌ Signed URL (anon): ${signedUrlError.message}`)
      } else {
        console.log(`   ✅ Signed URL (anon): Generated successfully`)
        console.log(`      ${signedUrlData.signedUrl.substring(0, 80)}...`)
        
        // Test URL accessibility
        try {
          const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' })
          if (response.ok) {
            console.log(`      🌐 Accessible: ${response.status} - ${response.headers.get('content-type')}`)
            console.log(`      📏 Size: ${response.headers.get('content-length')} bytes`)
          } else {
            console.log(`      ❌ Not accessible: ${response.status} ${response.statusText}`)
          }
        } catch (fetchError) {
          console.log(`      ❌ Fetch error: ${fetchError.message}`)
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}`)
    }
  }
  
  // Test with service key if available
  if (supabaseService) {
    console.log('\n🔧 Testing with service role key:')
    for (const filename of videoFiles.slice(0, 2)) { // Test first 2 files
      console.log(`\n🎯 Testing: ${filename}`)
      
      try {
        // Test signed URL with service key
        const { data: signedUrlData, error: signedUrlError } = await supabaseService.storage
          .from('videos')
          .createSignedUrl(filename, 3600)
        
        if (signedUrlError) {
          console.log(`   ❌ Signed URL (service): ${signedUrlError.message}`)
        } else {
          console.log(`   ✅ Signed URL (service): Generated successfully`)
          
          // Test URL accessibility
          try {
            const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' })
            if (response.ok) {
              console.log(`      🌐 Accessible: ${response.status} - ${response.headers.get('content-type')}`)
            } else {
              console.log(`      ❌ Not accessible: ${response.status}`)
            }
          } catch (fetchError) {
            console.log(`      ❌ Fetch error: ${fetchError.message}`)
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Test failed: ${error.message}`)
      }
    }
  }
}

testPrivateBucketAccess().catch(console.error)
