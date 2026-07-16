"use client";

import { useState, useCallback } from "react";

type PreviewState = {
  /** Local object URL for preview (never sent to R2) */
  previewUrl: string | null;
  /** The actual File object, waiting to be uploaded */
  pendingFile: File | null;
  /** True while the file is being uploaded to R2 */
  isUploading: boolean;
  /** Upload progress 0-100 */
  progress: number;
  /** Error message */
  error: string | null;
  /** The R2 object key after upload completes (e.g. "hero/1784183664742-hr90kp-photo_1.webp") */
  uploadedKey: string | null;
};

/**
 * Hook that manages image preview (local) and upload (R2) as two separate steps.
 *
 * 1. `selectFile(file)` → creates local preview, stores File for later upload
 * 2. `uploadToR2(category)` → uploads stored File to R2, returns the R2 key
 * 3. `reset()` → clears everything
 */
export function useImageUpload() {
  const [state, setState] = useState<PreviewState>({
    previewUrl: null,
    pendingFile: null,
    isUploading: false,
    progress: 0,
    error: null,
    uploadedKey: null,
  });

  /** Step 1: Select a file for preview (no upload) */
  const selectFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setState((prev) => ({
        ...prev,
        error: "Only image files are allowed",
      }));
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setState((prev) => ({
        ...prev,
        error: "File size must be under 10MB",
      }));
      return;
    }

    // Revoke previous preview URL to avoid memory leaks
    setState((prev) => {
      if (prev.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return {
        previewUrl: URL.createObjectURL(file),
        pendingFile: file,
        isUploading: false,
        progress: 0,
        error: null,
        uploadedKey: null,
      };
    });
  }, []);

  /** Step 2: Upload the pending file to R2 (called on Save Images) */
  const uploadToR2 = useCallback(
    async (category: string): Promise<string | null> => {
      if (!state.pendingFile) {
        setState((prev) => ({
          ...prev,
          error: "No file selected",
        }));
        return null;
      }

      const file = state.pendingFile;

      setState((prev) => ({
        ...prev,
        isUploading: true,
        progress: 0,
        error: null,
      }));

      try {
        // 1. Get presigned URL from API (returns { uploadUrl, key })
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

        const { uploadUrl, key } = await res.json();

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

        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 100,
          uploadedKey: key,
        }));

        return key;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: message,
        }));
        return null;
      }
    },
    [state.pendingFile]
  );

  // Intentionally empty deps: reset only uses setState updater and revokeObjectURL
  // which are stable references and don't need to be in the dependency array.
  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return {
        previewUrl: null,
        pendingFile: null,
        isUploading: false,
        progress: 0,
        error: null,
        uploadedKey: null,
      };
    });
  }, []);

  /** Clear error only */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    /** True if there's a file waiting to be uploaded */
    hasPendingFile: state.pendingFile !== null,
    selectFile,
    uploadToR2,
    reset,
    clearError,
  };
}
