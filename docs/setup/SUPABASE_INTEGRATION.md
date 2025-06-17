# Supabase Video Integration

## Overview
The ImmerseSection component now fetches meditation videos directly from Supabase storage instead of using local files.

## Setup
- **Supabase URL**: `https://jehmrevswtimvaqgcwas.supabase.co`
- **Storage Bucket**: `videos` (public bucket)
- **Video Files**: 
  - `lake.mp4` → "LAKE"
  - `forest.mp4` → "FOREST" 
  - `zen.mp4` → "ZEN GARDEN"
  - `campfire.mp4` → "CAMPFIRE"

## Architecture
- `src/lib/supabase.ts` - Supabase client configuration
- `src/services/videoService.ts` - Video loading service
- `src/components/sections/ImmerseSection.tsx` - Main component that uses videos

## How it works
1. The VideoService directly generates public URLs for known video files
2. No database table required - videos are accessed directly from storage
3. Loading states and error handling included
4. Maintains all existing transition animations

## Public URLs
Videos are accessible at:
```
https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/object/public/videos/{filename}
```

## Benefits
- ✅ No local storage needed
- ✅ CDN delivery for better performance
- ✅ Easy to add/remove videos via Supabase dashboard
- ✅ Automatic public URL generation
- ✅ No database setup required
