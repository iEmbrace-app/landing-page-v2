-- Create videos table for metadata management
-- Run this SQL in your Supabase SQL Editor

-- Create videos table
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

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view videos" ON videos
  FOR SELECT USING (is_active = true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the known video files
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
