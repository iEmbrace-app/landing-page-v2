import { VideoService } from '../src/services/videoService.js';

async function testS3Integration() {
  console.log('🧪 Testing S3 Integration...');
  console.log('================================');
  
  try {
    // Test S3 connection
    console.log('1. Testing S3 connection...');
    const isConnected = await VideoService.testS3Connection();
    console.log(`   Connection status: ${isConnected ? '✅ Connected' : '❌ Failed'}`);
    
    if (!isConnected) {
      console.log('   Falling back to regular video service...');
    }
    
    console.log('');
    
    // Test fetching videos from S3
    console.log('2. Fetching videos from S3...');
    const s3Videos = await VideoService.fetchVideosFromS3();
    console.log(`   Found ${s3Videos.length} videos from S3`);
    
    s3Videos.forEach((video, index) => {
      console.log(`   ${index + 1}. ${video.title} (${video.filename})`);
      console.log(`      URL: ${video.url.substring(0, 80)}...`);
    });
    
    console.log('');
    
    // Test regular video service for comparison
    console.log('3. Fetching videos from regular service...');
    const regularVideos = await VideoService.fetchVideos();
    console.log(`   Found ${regularVideos.length} videos from regular service`);
    
    regularVideos.forEach((video, index) => {
      console.log(`   ${index + 1}. ${video.title} (${video.filename})`);
    });
    
    console.log('');
    console.log('🎉 S3 integration test complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testS3Integration();
