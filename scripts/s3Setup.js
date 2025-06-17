import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AWS S3 Configuration with your credentials
const s3 = new AWS.S3({
  accessKeyId: '7eedddc9af481fd24aaaa560ab53f8db',
  secretAccessKey: '2d5c8b93c5abc04c96286022603aba191793698e8bafc29ce09ff6146fe5aa8e',
  region: 'us-east-1',
  endpoint: 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/s3',
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const BUCKET_NAME = 'videos';

async function testS3Connection() {
  console.log('🔧 Testing S3 connection...');
  
  try {
    // Test bucket access
    await s3.headBucket({ Bucket: BUCKET_NAME }).promise();
    console.log('✅ S3 bucket is accessible');
    
    // List existing objects
    const listResult = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
    console.log(`📁 Found ${listResult.Contents?.length || 0} objects in bucket`);
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log('📋 Existing objects:');
      listResult.Contents.forEach(obj => {
        console.log(`  - ${obj.Key} (${obj.Size} bytes, modified: ${obj.LastModified})`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ S3 connection test failed:', error);
    return false;
  }
}

async function createSampleVideo(filename) {
  console.log(`🎬 Creating sample video: ${filename}`);
  
  // Create a minimal MP4 file with proper headers
  const mp4Header = Buffer.from([
    // ftyp box
    0x00, 0x00, 0x00, 0x20, // box size
    0x66, 0x74, 0x79, 0x70, // 'ftyp'
    0x69, 0x73, 0x6f, 0x6d, // major brand 'isom'
    0x00, 0x00, 0x02, 0x00, // minor version
    0x69, 0x73, 0x6f, 0x6d, // compatible brands
    0x69, 0x73, 0x6f, 0x32,
    0x61, 0x76, 0x63, 0x31,
    0x6d, 0x70, 0x34, 0x31,
    
    // mdat box (empty data)
    0x00, 0x00, 0x00, 0x08, // box size
    0x6d, 0x64, 0x61, 0x74  // 'mdat'
  ]);
  
  return mp4Header;
}

async function uploadSampleVideos() {
  console.log('📤 Uploading sample videos...');
  
  const videoFiles = [
    { name: 'lake.mp4', title: 'Lake Meditation' },
    { name: 'forest.mp4', title: 'Forest Sounds' },
    { name: 'zen.mp4', title: 'Zen Garden' },
    { name: 'campfire.mp4', title: 'Campfire Ambience' }
  ];
  
  for (const video of videoFiles) {
    try {
      console.log(`⬆️ Uploading ${video.name}...`);
      
      const videoBuffer = await createSampleVideo(video.name);
      
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: video.name,
        Body: videoBuffer,
        ContentType: 'video/mp4',
        Metadata: {
          title: video.title,
          uploadedAt: new Date().toISOString()
        }
      };
      
      const result = await s3.upload(uploadParams).promise();
      console.log(`✅ Uploaded ${video.name} to ${result.Location}`);
      
      // Generate a signed URL to test access
      const signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: BUCKET_NAME,
        Key: video.name,
        Expires: 3600 // 1 hour
      });
      
      console.log(`🔗 Signed URL for ${video.name}:`);
      console.log(`   ${signedUrl.substring(0, 100)}...`);
      
    } catch (error) {
      console.error(`❌ Error uploading ${video.name}:`, error);
    }
  }
}

async function listVideos() {
  console.log('📋 Listing all videos in bucket...');
  
  try {
    const result = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
    
    if (!result.Contents || result.Contents.length === 0) {
      console.log('📂 No videos found in bucket');
      return;
    }
    
    console.log(`📁 Found ${result.Contents.length} videos:`);
    result.Contents.forEach((obj, index) => {
      console.log(`${index + 1}. ${obj.Key}`);
      console.log(`   Size: ${obj.Size} bytes`);
      console.log(`   Modified: ${obj.LastModified}`);
      console.log(`   ETag: ${obj.ETag}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error listing videos:', error);
  }
}

async function main() {
  console.log('🚀 Starting S3 Video Setup with Your Credentials');
  console.log('================================================');
  
  // Test connection
  const isConnected = await testS3Connection();
  if (!isConnected) {
    console.log('❌ Cannot proceed without S3 connection');
    return;
  }
  
  console.log('');
  
  // List existing videos
  await listVideos();
  
  console.log('');
  
  // Upload sample videos
  await uploadSampleVideos();
  
  console.log('');
  
  // List videos again to confirm uploads
  await listVideos();
  
  console.log('🎉 S3 setup complete!');
  console.log('Your meditation app should now be able to access videos from S3.');
}

main().catch(console.error);
