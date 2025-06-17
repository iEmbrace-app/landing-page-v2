// Simple console debug script to test video URLs directly
console.log('🎥 Video URL Debug Test');

// Test video URLs from the browser's perspective
async function testVideoUrls() {
    try {
        // Import the video service
        const { VideoService } = await import('./src/services/videoService.ts');
        
        console.log('📡 Fetching videos from VideoService...');
        const videos = await VideoService.fetchVideos();
        
        console.log(`✅ Got ${videos.length} videos:`, videos);
        
        // Test each video URL
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            console.log(`\n🧪 Testing video ${i + 1}: ${video.title}`);
            console.log(`📁 Filename: ${video.filename}`);
            console.log(`🔗 URL: ${video.url}`);
            
            // Create a test video element
            const testVideo = document.createElement('video');
            testVideo.muted = true;
            testVideo.playsInline = true;
            testVideo.preload = 'metadata';
            
            // Listen for events
            testVideo.addEventListener('loadstart', () => {
                console.log(`  ⏳ ${video.title}: Load started`);
            });
            
            testVideo.addEventListener('loadedmetadata', () => {
                console.log(`  ✅ ${video.title}: Metadata loaded (${testVideo.videoWidth}x${testVideo.videoHeight})`);
            });
            
            testVideo.addEventListener('loadeddata', () => {
                console.log(`  ✅ ${video.title}: Data loaded, duration: ${testVideo.duration}s`);
            });
            
            testVideo.addEventListener('canplay', () => {
                console.log(`  ✅ ${video.title}: Can play`);
            });
            
            testVideo.addEventListener('error', (e) => {
                console.error(`  ❌ ${video.title}: Error loading video`, e.target.error);
                if (e.target.error) {
                    console.error(`    Error code: ${e.target.error.code}`);
                    console.error(`    Error message: ${e.target.error.message}`);
                }
            });
            
            // Test the URL with a fetch request first
            try {
                console.log(`  🌐 Testing URL accessibility...`);
                const response = await fetch(video.url, { method: 'HEAD' });
                console.log(`  📊 Response status: ${response.status} ${response.statusText}`);
                console.log(`  📊 Content-Type: ${response.headers.get('Content-Type')}`);
                console.log(`  📊 Content-Length: ${response.headers.get('Content-Length')}`);
                
                if (response.ok) {
                    console.log(`  ✅ URL is accessible`);
                    // Now try to load the video
                    testVideo.src = video.url;
                } else {
                    console.error(`  ❌ URL not accessible: ${response.status}`);
                }
            } catch (fetchError) {
                console.error(`  ❌ URL fetch failed:`, fetchError);
            }
            
            // Wait a bit between tests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
    } catch (error) {
        console.error('❌ Video URL test failed:', error);
    }
}

// Test Supabase connection directly
async function testSupabaseConnection() {
    try {
        console.log('\n🔌 Testing Supabase connection...');
        const { supabase } = await import('./src/lib/supabase.ts');
        
        // Test storage access
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        if (bucketError) {
            console.error('❌ Bucket list error:', bucketError);
        } else {
            console.log('✅ Buckets:', buckets.map(b => b.name));
        }
        
        // Test videos bucket specifically
        const { data: files, error: filesError } = await supabase.storage
            .from('videos')
            .list();
            
        if (filesError) {
            console.error('❌ Videos bucket error:', filesError);
        } else {
            console.log('✅ Videos in bucket:', files.map(f => `${f.name} (${f.metadata?.size} bytes)`));
        }
        
        // Test signed URL generation
        const testFile = 'lake.mp4';
        const { data: signedData, error: signedError } = await supabase.storage
            .from('videos')
            .createSignedUrl(testFile, 3600);
            
        if (signedError) {
            console.error(`❌ Signed URL error for ${testFile}:`, signedError);
        } else {
            console.log(`✅ Signed URL for ${testFile}:`, signedData.signedUrl);
        }
        
    } catch (error) {
        console.error('❌ Supabase test failed:', error);
    }
}

// Run the tests
console.log('🚀 Starting comprehensive video debug...');
testSupabaseConnection().then(() => {
    return testVideoUrls();
}).then(() => {
    console.log('🎉 Video debug complete! Check the logs above.');
});
