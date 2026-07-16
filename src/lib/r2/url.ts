/**
 * Client-safe R2 URL utilities.
 *
 * This file is intentionally separate from client.ts to avoid importing
 * @aws-sdk/client-s3 in client components. The getR2KeyUrl function only
 * uses NEXT_PUBLIC_ env vars and can be safely imported in "use client" files.
 */

/** Convert an R2 key to a full public URL (client-safe, uses NEXT_PUBLIC_R2_PUBLIC_URL).
 * Handles legacy full URLs by returning them as-is.
 */
export function getR2KeyUrl(key: string): string {
  if (!key) return "";
  if (key.startsWith("http")) return key; // legacy full URLs
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
  return `${publicUrl}/${key}`;
}
