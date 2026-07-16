import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getUploadPresignedUrl, generateFileKey } from "@/lib/r2/upload";

type UploadUrlRequest = {
  filename: string;
  contentType: string;
  category: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UploadUrlRequest = await request.json();
    const { filename, contentType, category } = body;

    if (!filename || !contentType || !category) {
      return NextResponse.json(
        { error: "Missing required fields: filename, contentType, category" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "File type not allowed. Allowed: JPEG, PNG, WebP, GIF, SVG" },
        { status: 400 }
      );
    }

    // Generate unique key
    const key = generateFileKey(category, filename);

    // Get presigned URL
    const { uploadUrl, publicUrl } = await getUploadPresignedUrl(key, {
      contentType,
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}