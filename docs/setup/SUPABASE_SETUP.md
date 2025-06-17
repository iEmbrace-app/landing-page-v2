# Supabase Setup Instructions

## Step 1: Create the Videos Table
1. Go to your Supabase dashboard: https://app.supabase.com/
2. Navigate to the SQL Editor
3. Run this SQL command to create the videos table:

```sql
-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  filename TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view videos" ON videos
  FOR SELECT USING (true);
```

## Step 2: Create Storage Bucket
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "meditation-videos"
3. Make it public
4. Set the following bucket settings:
   - Public: Yes
   - File size limit: 100MB (or appropriate for your videos)
   - Allowed MIME types: video/mp4

## Step 3: Upload Videos
After creating the table and bucket, run the upload script:

```bash
npm run upload-videos
```

Or manually upload the videos:
1. Go to Storage > meditation-videos
2. Upload each video file (lake.mp4, forest.mp4, zen.mp4, campfire.mp4)
3. Make sure they are publicly accessible
4. Copy the public URLs and insert records into the videos table

## Step 4: Insert Video Records
After uploading the files, insert the records:

```sql
INSERT INTO videos (title, filename, url) VALUES
('LAKE', 'lake.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/meditation-videos/lake.mp4'),
('FOREST', 'forest.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/meditation-videos/forest.mp4'),
('ZEN GARDEN', 'zen.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/meditation-videos/zen.mp4'),
('CAMPFIRE', 'campfire.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/meditation-videos/campfire.mp4');
```

## Step 5: Test the Integration
Start your development server and check the browser console for logs about loading videos from Supabase.

```bash
npm run dev
```

## Fallback Behavior
The app will automatically fallback to local videos if:
- The database is empty
- There's a connection error
- Supabase is not accessible

This ensures your app always works, even during setup or if there are issues with the database.
