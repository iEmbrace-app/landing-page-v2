# Video Setup Instructions

## Current Issue
The videos are not playing because they haven't been uploaded to Supabase storage yet.

## Quick Fix Steps

### Step 1: Get Video Files
You need 4 MP4 video files:
- `lake.mp4` - Peaceful lake scene
- `forest.mp4` - Forest/nature scene  
- `zen.mp4` - Zen garden or peaceful scene
- `campfire.mp4` - Campfire scene

### Step 2: Prepare for Upload
1. Create a `videos` folder in your project root:
   ```
   landing-page-v2/
   ├── videos/           ← Create this folder
   │   ├── lake.mp4      ← Place your video files here
   │   ├── forest.mp4
   │   ├── zen.mp4
   │   └── campfire.mp4
   ├── src/
   ├── scripts/
   └── ...
   ```

### Step 3: Upload Videos
Run the upload script:
```bash
npm run upload-videos
```

### Step 4: Setup Database (Optional)
1. Go to your Supabase dashboard: https://app.supabase.com/
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of `scripts/setup.sql`
5. Run the query

## Alternative: Use Placeholder Videos

If you don't have the actual video files yet, you can use any MP4 videos as placeholders. Just rename them to match the expected filenames (lake.mp4, forest.mp4, etc.).

## Testing

After uploading, you can test the setup:
```bash
npm run test-videos
```

This will show if your videos are properly uploaded and accessible.

## Current Status

✅ Supabase connection working  
✅ Storage bucket exists  
❌ Video files not uploaded  
❌ Database table not created (optional)  

Once you upload the videos, the app will automatically start playing them!
