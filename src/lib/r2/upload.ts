import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, getR2PublicUrl } from "./client";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!BUCKET_NAME) {
  throw new Error("Missing R2_BUCKET_NAME environment variable");
}

type PresignedUrlOptions = {
  expiresIn?: number; // seconds, default 1 hour
  contentType?: string;
};

/**
 * Generate a presigned URL for uploading a file to R2
 * Use this on the server-side to generate URLs for client uploads
 */
export async function getUploadPresignedUrl(
  key: string,
  options: PresignedUrlOptions = {}
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const { expiresIn = 3600, contentType } = options;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const publicUrl = getR2PublicUrl(key);

  return { uploadUrl, publicUrl };
}

/**
 * Generate a unique key for uploading files
 * Format: category/timestamp-randomstring.ext
 */
export function generateFileKey(
  category: string,
  filename: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = filename.split(".").pop() || "jpg";
  const cleanFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();

  return `${category}/${timestamp}-${random}-${cleanFilename}`;
}

/**
 * Get the public URL for a file
 */
export function getFileUrl(key: string): string {
  return getR2PublicUrl(key);
}