-- IMPORTANT: Run these SQL commands in your Supabase SQL Editor
-- This will allow the app to access videos in the private 'videos' bucket

-- Option 1: Create policies to allow anonymous read access to videos
-- This is recommended as it keeps the bucket private but allows reading

-- Create policy to allow anonymous users to read from videos bucket
CREATE POLICY "Allow anonymous read access to videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Create policy to allow authenticated users to read from videos bucket
CREATE POLICY "Allow authenticated read access to videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Alternative Option 2: Make the bucket completely public (less secure)
-- Uncomment the line below if you prefer this approach
-- UPDATE storage.buckets SET public = true WHERE id = 'videos';

-- Optional: Create a videos table for metadata management
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  description TEXT,
  duration INTEGER, -- in seconds
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for videos table
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to videos table
CREATE POLICY "Public can view videos" ON videos
  FOR SELECT USING (is_active = true);

-- Insert the known video files metadata
INSERT INTO videos (title, file_path, description, order_index) VALUES
('Campfire', 'campfire.mp4', 'Relaxing campfire sounds and visuals for meditation', 1),
('Forest', 'forest.mp4', 'Peaceful forest environment for mindfulness practice', 2),
('Lake', 'lake.mp4', 'Tranquil lake scenery for deep relaxation', 3),
('Zen Garden', 'zen.mp4', 'Serene zen garden for contemplative meditation', 4)
ON CONFLICT (file_path) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();
