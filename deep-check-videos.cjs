// Deep check of the videos bucket
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function deepCheckVideoBucket() {
  try {
    console.log('🎬 Deep checking videos bucket...')
    
    // Try different ways to list files in the videos bucket
    const methods = [
      { name: 'Root level', path: '', limit: 100 },
      { name: 'All files (no limit)', path: '', limit: 1000 },
      { name: 'Recursive search', path: '', search: '' },
    ]
    
    for (const method of methods) {
      console.log(`\n🔍 Method: ${method.name}`)
      
      try {
        const options = { limit: method.limit }
        if (method.search !== undefined) {
          options.search = method.search
        }
        
        const { data: files, error } = await supabase.storage
          .from('videos')
          .list(method.path, options)
        
        if (error) {
          console.log(`   ❌ Error: ${error.message}`)
          continue
        }
        
        console.log(`   ✅ Found ${files?.length || 0} items`)
        
        if (files && files.length > 0) {
          console.log('   📁 Items found:')
          files.forEach((file, index) => {
            const type = file.id ? 'file' : 'folder'
            const size = file.metadata?.size ? 
              `${Math.round(file.metadata.size / 1024 / 1024 * 100) / 100} MB` : 
              'unknown size'
            console.log(`      ${index + 1}. ${file.name} (${type}) - ${size}`)
            
            // If it's a folder, let's check inside it
            if (!file.id && file.name) {
              console.log(`         📂 Checking folder: ${file.name}`)
            }
          })
          
          // If we found folders, check inside them
          const folders = files.filter(f => !f.id && f.name)
          for (const folder of folders.slice(0, 3)) { // Check first 3 folders
            console.log(`\n   📂 Checking inside folder: ${folder.name}`)
            try {
              const { data: folderFiles, error: folderError } = await supabase.storage
                .from('videos')
                .list(folder.name, { limit: 50 })
              
              if (folderError) {
                console.log(`      ❌ Folder error: ${folderError.message}`)
              } else {
                console.log(`      ✅ Found ${folderFiles?.length || 0} items in folder`)
                if (folderFiles && folderFiles.length > 0) {
                  folderFiles.forEach(file => {
                    const size = file.metadata?.size ? 
                      `${Math.round(file.metadata.size / 1024 / 1024 * 100) / 100} MB` : 
                      'unknown size'
                    console.log(`         - ${file.name} (${size})`)
                  })
                }
              }
            } catch (folderErr) {
              console.log(`      ❌ Folder check failed: ${folderErr.message}`)
            }
          }
          
          // Test generating URLs for video files
          const videoFiles = files.filter(f => 
            f.id && (
              f.name.endsWith('.mp4') || 
              f.name.endsWith('.webm') || 
              f.name.endsWith('.mov') ||
              f.name.endsWith('.avi')
            )
          )
          
          if (videoFiles.length > 0) {
            console.log(`\n   🎬 Testing video file access:`)
            for (const videoFile of videoFiles.slice(0, 2)) {
              console.log(`      🎯 Testing: ${videoFile.name}`)
              
              // Try both signed and public URLs
              try {
                // Test signed URL
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                  .from('videos')
                  .createSignedUrl(videoFile.name, 3600)
                
                if (signedUrlError) {
                  console.log(`         ❌ Signed URL error: ${signedUrlError.message}`)
                } else {
                  console.log(`         ✅ Signed URL: ${signedUrlData.signedUrl.substring(0, 80)}...`)
                  
                  // Test accessibility
                  try {
                    const response = await fetch(signedUrlData.signedUrl, { method: 'HEAD' })
                    console.log(`         🌐 Status: ${response.status} - ${response.headers.get('content-type')}`)
                  } catch (fetchError) {
                    console.log(`         ❌ Fetch error: ${fetchError.message}`)
                  }
                }
                
                // Test public URL
                const { data: publicUrlData } = supabase.storage
                  .from('videos')
                  .getPublicUrl(videoFile.name)
                
                if (publicUrlData?.publicUrl) {
                  console.log(`         📝 Public URL: ${publicUrlData.publicUrl.substring(0, 80)}...`)
                  
                  try {
                    const response = await fetch(publicUrlData.publicUrl, { method: 'HEAD' })
                    console.log(`         🌐 Public Status: ${response.status}`)
                  } catch (fetchError) {
                    console.log(`         ❌ Public fetch error: ${fetchError.message}`)
                  }
                }
                
              } catch (urlError) {
                console.log(`         ❌ URL test failed: ${urlError.message}`)
              }
            }
          }
          
          break // We found files, no need to try other methods
        }
      } catch (methodError) {
        console.log(`   ❌ Method failed: ${methodError.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Deep check failed:', error.message)
  }
}

deepCheckVideoBucket()
