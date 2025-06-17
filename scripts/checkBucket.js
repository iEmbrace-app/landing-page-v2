import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jehmrevswtimvaqgcwas.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaG1yZXZzd3RpbXZhcWdjd2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzM5NDUsImV4cCI6MjA2NTcwOTk0NX0.h6pd_oiQggN646LxYBYcuJZgGRNbFhzrINDsaEOYPjc'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPrivateBucket() {
  console.log('🔍 Checking private videos bucket...')
  
  try {
    // List all files in the bucket
    const { data: files, error } = await supabase.storage
      .from('videos')
      .list()
    
    if (error) {
      console.error('❌ Error listing files:', error)
      return
    }
    
    console.log('📁 Files in bucket:', files)
    
    if (files && files.length > 0) {
      console.log('\n🎬 Testing signed URLs for each file:')
      
      for (const file of files) {
        console.log(`\n📹 Testing ${file.name}...`)
        
        // Create signed URL
        const { data: signedData, error: signedError } = await supabase.storage
          .from('videos')
          .createSignedUrl(file.name, 60) // 1 minute for testing
        
        if (signedError) {
          console.error(`❌ Error creating signed URL for ${file.name}:`, signedError)
        } else {
          console.log(`✅ Signed URL: ${signedData.signedUrl}`)
        }
      }
    } else {
      console.log('❌ No files found in bucket')
    }
    
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

checkPrivateBucket()
