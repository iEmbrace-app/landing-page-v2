-- Storage bucket setup for videos

-- Create the videos bucket if it doesn't exist (public bucket)
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create policy to allow public read access to videos bucket
CREATE POLICY IF NOT EXISTS "Public can view videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'videos');

-- Create policy to allow uploads to videos bucket (for admin/authenticated users)
CREATE POLICY IF NOT EXISTS "Allow uploads to videos bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'videos');

-- Create policy to allow updates to videos bucket (for admin/authenticated users)
CREATE POLICY IF NOT EXISTS "Allow updates to videos bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'videos');

-- Create policy to allow deletes from videos bucket (for admin/authenticated users)
CREATE POLICY IF NOT EXISTS "Allow deletes from videos bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'videos');
