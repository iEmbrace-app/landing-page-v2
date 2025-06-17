-- Storage policies for videos bucket
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Allow public read access to videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', false)
ON CONFLICT (id) DO UPDATE SET
  public = false;

-- 2. Create policy to allow public read access to video files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- 3. Create policy to allow authenticated users to read videos
CREATE POLICY "Authenticated can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- 4. Allow anonymous access to videos (if needed)
CREATE POLICY "Allow anonymous access to videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos' AND auth.role() = 'anon');

-- Alternative: If you want to make the bucket completely public:
-- UPDATE storage.buckets SET public = true WHERE id = 'videos';
