import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Configure Cloudflare R2 client
const r2Client = new S3Client({
  credentials: {
    accessKeyId: process.env.VITE_R2_ACCESS_KEY_ID || '4605Db602558b16826eda63d23a1249e',
    secretAccessKey: process.env.VITE_R2_SECRET_ACCESS_KEY || 'a1e83559c71752cd3dd4d8846d1d545f9a59b1e33c756d1602a1cca5cc670e77',
  },
  region: 'auto',
  endpoint: process.env.VITE_R2_ENDPOINT || 'https://0e625ae2cb4c0b6007d1b8a2921c9b40.r2.cloudflarestorage.com',
  forcePathStyle: true,
})

const BUCKET_NAME = 'videos'

// Video files to upload (place these in a 'videos' folder in your project root)
const videoFiles = [
  { filename: 'zen.mp4', title: 'ZEN GARDEN' },
  { filename: 'forest.mp4', title: 'FOREST' },
  { filename: 'lake.mp4', title: 'LAKE' },
  { filename: 'campfire.mp4', title: 'CAMPFIRE' }
]

async function uploadVideos() {
  console.log('🎥 Starting video upload to Cloudflare R2...')
  
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
      
      // Upload to Cloudflare R2
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: video.filename,
        Body: fileBuffer,
        ContentType: 'video/mp4',
      })

      await r2Client.send(command)
      
      console.log(`✅ Successfully uploaded ${video.filename}`)
      
    } catch (error) {
      console.error(`❌ Error uploading ${video.filename}:`, error.message)
    }
  }

  // List uploaded files
  console.log('\n📋 Listing files in R2 bucket...')
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    })
    
    const response = await r2Client.send(listCommand)
    
    if (response.Contents && response.Contents.length > 0) {
      console.log('✅ Files in bucket:')
      response.Contents.forEach(file => {
        const sizeInMB = (file.Size / (1024 * 1024)).toFixed(2)
        console.log(`  - ${file.Key} (${sizeInMB} MB)`)
      })
    } else {
      console.log('📭 No files found in bucket')
    }
  } catch (error) {
    console.error('❌ Error listing files:', error.message)
  }

  console.log('\n🎉 Upload process completed!')
}

// Run the upload process
uploadVideos().catch(console.error)
