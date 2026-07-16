"use client";

import { useState } from "react";

type UploadState = {
  isUploading: boolean;
  progress: number;
  error: string | null;
};

type UploadResult = {
  publicUrl: string;
  key: string;
};

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const upload = async (
    file: File,
    category: string
  ): Promise<UploadResult | null> => {
    setState({ isUploading: true, progress: 0, error: null });

    try {
      // 1. Get presigned URL from API
      const res = await fetch("/api/r2/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get upload URL");
      }

      const { uploadUrl, publicUrl, key } = await res.json();

      setState((prev) => ({ ...prev, progress: 50 }));

      // 2. Upload directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to R2");
      }

      setState({ isUploading: false, progress: 100, error: null });

      return { publicUrl, key };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setState({ isUploading: false, progress: 0, error: message });
      return null;
    }
  };

  const reset = () => {
    setState({ isUploading: false, progress: 0, error: null });
  };

  return { ...state, upload, reset };
}