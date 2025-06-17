import { S3Client, ListObjectsV2Command, HeadBucketCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

// Configure AWS SDK v3 with Supabase S3-compatible storage
const s3Client = new S3Client({
  credentials: {
    accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID || '7eedddc9af481fd24aaaa560ab53f8db',
    secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY || '2d5c8b93c5abc04c96286022603aba191793698e8bafc29ce09ff6146fe5aa8e',
  },
  region: import.meta.env.AWS_REGION || 'us-east-1',
  endpoint: import.meta.env.AWS_S3_ENDPOINT || 'https://jehmrevswtimvaqgcwas.supabase.co/storage/v1/s3',
  forcePathStyle: true, // Required for Supabase S3-compatible storage
});

const BUCKET_NAME = import.meta.env.VITE_VIDEO_BUCKET || 'videos';

export interface S3Video {
  key: string;
  title: string;
  size: number;
  lastModified: Date;
  url?: string;
}

/**
 * List all videos in the S3 bucket
 */
export async function listVideos(): Promise<S3Video[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: '', // List all objects
    });

    const data = await s3Client.send(command);
    
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
    console.error('Error listing videos from S3:', error);
    throw error;
  }
}

/**
 * Generate a signed URL for a video
 */
export async function getSignedUrl(videoKey: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: videoKey,
    });

    const signedUrl = await awsGetSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed URL for ${videoKey}:`, error);
    throw error;
  }
}

/**
 * Upload a video file to S3
 */
export async function uploadVideo(file: File, key?: string): Promise<string> {
  try {
    const videoKey = key || `${Date.now()}-${file.name}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: videoKey,
      Body: file,
      ContentType: file.type,
    });

    await s3Client.send(command);
    return videoKey;
  } catch (error) {
    console.error('Error uploading video to S3:', error);
    throw error;
  }
}

/**
 * Delete a video from S3
 */
export async function deleteVideo(videoKey: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: videoKey,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error(`Error deleting video ${videoKey} from S3:`, error);
    throw error;
  }
}

/**
 * Check if the S3 bucket is accessible
 */
export async function checkBucketAccess(): Promise<boolean> {
  try {
    const command = new HeadBucketCommand({ Bucket: BUCKET_NAME });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error accessing S3 bucket:', error);
    return false;
  }
}

export { s3Client, BUCKET_NAME };
