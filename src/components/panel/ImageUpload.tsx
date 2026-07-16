"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import { getR2KeyUrl } from "@/lib/r2/url";
import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  /** Existing image R2 key (from Supabase) */
  value?: string;
  /** Called when the user wants to remove the image */
  onRemove?: () => void;
  category: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  /** Expose upload state to parent — called whenever controls change */
  onUploadReady?: (upload: {
    uploadToR2: () => Promise<string | null>;
    hasPendingFile: boolean;
    isUploading: boolean;
  }) => void;
};

export default function ImageUpload({
  value,
  onRemove,
  category,
  className,
  aspectRatio = "video",
  onUploadReady,
}: ImageUploadProps) {
  const {
    previewUrl,
    hasPendingFile,
    isUploading,
    error,
    selectFile,
    uploadToR2,
    reset,
  } = useImageUpload();

  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef(category);
  useEffect(() => {
    categoryRef.current = category;
  });

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
  };

  // Expose upload controls to parent whenever they change
  useEffect(() => {
    if (onUploadReady) {
      onUploadReady({
        uploadToR2: () => uploadToR2(categoryRef.current),
        hasPendingFile,
        isUploading,
      });
    }
  }, [onUploadReady, uploadToR2, hasPendingFile, isUploading]);

  const handleFile = useCallback(
    (file: File) => {
      selectFile(file);
    },
    [selectFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    reset();
    onRemove?.();
  };

  // Show preview: local object URL if new, or constructed URL from key
  const displayUrl = previewUrl || getR2KeyUrl(value || "");
  const hasChanges = hasPendingFile;

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className={cn("relative group", aspectClasses[aspectRatio])}>
          <Image
            src={displayUrl}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg"
          />
          {/* Pending indicator */}
          {hasChanges && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Not saved
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleClick}
              disabled={isUploading}
            >
              Replace
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            aspectClasses[aspectRatio],
            "flex flex-col items-center justify-center",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WebP up to 10MB
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
