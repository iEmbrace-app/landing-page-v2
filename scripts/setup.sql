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

-- Insert placeholder video records (update URLs after uploading files)
INSERT INTO videos (title, filename, url) VALUES
('LAKE', 'lake.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/videos/lake.mp4'),
('FOREST', 'forest.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/videos/forest.mp4'),
('ZEN GARDEN', 'zen.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/videos/zen.mp4'),
('CAMPFIRE', 'campfire.mp4', 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/videos/campfire.mp4')
ON CONFLICT (filename) DO NOTHING;
