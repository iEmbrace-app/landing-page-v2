// Cloudflare R2 Configuration
// This file replaces the previous supabase.ts configuration

export interface Video {
  id: string
  title: string
  filename: string
  url: string
}

// Environment variables for R2
export const R2_CONFIG = {
  endpoint: import.meta.env.VITE_R2_ENDPOINT || 'https://0e625ae2cb4c0b6007d1b8a2921c9b40.r2.cloudflarestorage.com',
  accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '4605Db602558b16826eda63d23a1249e',
  secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || 'a1e83559c71752cd3dd4d8846d1d545f9a59b1e33c756d1602a1cca5cc670e77',
  bucket: import.meta.env.VITE_R2_BUCKET || 'videos',
  region: 'auto' // Cloudflare R2 uses 'auto' region
}

// Validate configuration
if (!R2_CONFIG.endpoint || !R2_CONFIG.accessKeyId || !R2_CONFIG.secretAccessKey) {
  console.error('Missing Cloudflare R2 environment variables. Please check your .env file.')
  console.error('Required variables: VITE_R2_ENDPOINT, VITE_R2_ACCESS_KEY_ID, VITE_R2_SECRET_ACCESS_KEY')
}

// Video bucket name (kept for backward compatibility)
export const VIDEO_BUCKET = R2_CONFIG.bucket
