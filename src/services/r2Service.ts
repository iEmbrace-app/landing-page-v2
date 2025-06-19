import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure Cloudflare R2 client
const r2Client = new S3Client({
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '549942c61d1d4035883345ae137d7166',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || 'e73563bcf0ae7a7de66a902ea33be963ae8734291ea98ec42ec9f128b1b17c34',
  },
  region: 'auto', // Cloudflare R2 uses 'auto' region
  endpoint: 'https://0e625ae2cb4c0b6007d1b8a2921c9b40.r2.cloudflarestorage.com',
  forcePathStyle: true,
});

// The bucket name for your videos
const BUCKET_NAME = 'videos';

export interface Video {
  id: string;
  title: string;
  filename: string;
  url: string;
}

export interface R2Video {
  key: string;
  title: string;
  size: number;
  lastModified: Date;
  url?: string;
}

/**
 * Create a signed URL for accessing a video file from Cloudflare R2
 */
export async function createSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error(`Error creating signed URL for ${filePath}:`, error);
    throw error;
  }
}

/**
 * List all videos in the R2 bucket
 */
export async function listVideos(): Promise<R2Video[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: '', // List all objects
    });

    const data = await r2Client.send(command);
    
    if (!data.Contents) {
      return [];
    }

    return data.Contents
      .filter(obj => obj.Key && obj.Key.endsWith('.mp4'))
      .map(obj => ({
        key: obj.Key!,
        title: obj.Key!.replace('.mp4', '').replace(/[-_]/g, ' '),
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
      }));
  } catch (error) {
    console.error('Error listing videos from R2:', error);
    return [];
  }
}

/**
 * Get a video with signed URL
 */
export async function getVideoWithSignedUrl(filePath: string): Promise<Video | null> {
  try {
    const signedUrl = await createSignedUrl(filePath);
    
    return {
      id: filePath,
      title: filePath.replace('.mp4', '').replace(/[-_]/g, ' '),
      filename: filePath,
      url: signedUrl
    };
  } catch (error) {
    console.error(`Error getting video ${filePath}:`, error);
    return null;
  }
}

/**
 * Get public URL for a video using the R2.dev public domain
 */
export function getPublicUrl(filePath: string): string {
  return `https://pub-98cf7829029d40cea96dea8c90412216.r2.dev/${filePath}`;
}

export { r2Client };
