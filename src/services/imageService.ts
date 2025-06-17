import { supabase } from '../lib/supabase'

const IMAGES_BUCKET = 'images'

/**
 * Get a signed URL for an image from Supabase storage
 * @param imagePath - The path to the image in the bucket
 * @returns Promise<string> - The signed URL or fallback local path
 */
export async function getImageUrl(imagePath: string): Promise<string> {
  try {
    // Create signed URL for private bucket
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .createSignedUrl(imagePath, 3600) // 1 hour expiry
    
    if (urlError) {
      console.warn(`⚠️ Using local fallback for ${imagePath}:`, urlError.message)
      return `/images/${imagePath}`
    } else {
      console.log(`✅ Loaded ${imagePath} from Supabase`)
      return signedUrlData.signedUrl
    }
  } catch (error) {
    console.error(`❌ Error loading image ${imagePath}:`, error)
    return `/images/${imagePath}` // Fallback to local path
  }
}

/**
 * Get logo URL specifically
 * @returns Promise<string> - The logo URL
 */
export async function getLogoUrl(): Promise<string> {
  return getImageUrl('logo_no_back.png')
}
