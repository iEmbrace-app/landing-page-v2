# Migration from Supabase to Cloudflare R2

## Overview
This document outlines the migration from Supabase storage to Cloudflare R2 for video file storage.

## Configuration Changes

### Environment Variables
Replace your Supabase environment variables with the following Cloudflare R2 variables:

```env
# Cloudflare R2 Configuration
VITE_R2_ENDPOINT=https://0e625ae2cb4c0b6007d1b8a2921c9b40.r2.cloudflarestorage.com
VITE_R2_ACCESS_KEY_ID=4605Db602558b16826eda63d23a1249e
VITE_R2_SECRET_ACCESS_KEY=a1e83559c71752cd3dd4d8846d1d545f9a59b1e33c756d1602a1cca5cc670e77
VITE_R2_BUCKET=videos
```

### Removed Dependencies
- The `@supabase/supabase-js` dependency is no longer required for video storage
- Existing AWS S3 SDK dependencies are reused for R2 compatibility

## Updated Files

### Core Services
1. **`src/services/r2Service.ts`** - New service for Cloudflare R2 operations
2. **`src/services/videoService.ts`** - Updated to use R2 instead of Supabase
3. **`src/services/s3Service.ts`** - Updated configuration for R2 endpoints
4. **`src/lib/r2Client.ts`** - New configuration file replacing supabase.ts

### Scripts
1. **`scripts/uploadVideosR2.js`** - New upload script for R2
2. **`scripts/testR2Integration.js`** - Test script for R2 connectivity
3. **`package.json`** - Updated scripts for R2 operations

## Migration Steps

### 1. Environment Setup
Create or update your `.env` file with the R2 configuration above.

### 2. Upload Videos to R2
Use the new upload script to transfer your videos:
```bash
npm run upload-videos
```

### 3. Test Integration
Verify R2 connectivity:
```bash
npm run test-r2
```

### 4. Update Application
The application will automatically use R2 once the environment variables are set.

## Key Changes

### Video Loading
- Videos are now loaded from Cloudflare R2 using signed URLs
- Fallback mechanism uses public R2 URLs if signed URL generation fails
- Local fallback remains for development

### Performance
- Cloudflare R2 provides global edge caching
- Reduced latency with Eastern North America (ENAM) region
- Compatible with existing video optimization and caching systems

### Security
- Uses signed URLs with 1-hour expiration
- Access controlled via R2 credentials
- Public fallback URLs available if needed

## Troubleshooting

### Common Issues
1. **Access Denied**: Verify R2 credentials are correct
2. **CORS Issues**: Ensure R2 bucket has proper CORS configuration
3. **Video Not Loading**: Check signed URL generation and expiration

### Debug Commands
```bash
# Test R2 connectivity
npm run test-r2

# Upload videos to R2
npm run upload-videos

# Check application logs for R2 errors
npm run dev
```

## Rollback Plan
If issues occur, you can temporarily revert to Supabase by:
1. Restoring Supabase environment variables
2. Using the legacy upload script: `npm run upload-videos-legacy`
3. The application includes fallback mechanisms for both services

## Benefits of Migration
- **Cost Efficiency**: R2 offers competitive pricing
- **Performance**: Global CDN with edge caching
- **Reliability**: Cloudflare's robust infrastructure
- **Compatibility**: S3-compatible API for easy migration
