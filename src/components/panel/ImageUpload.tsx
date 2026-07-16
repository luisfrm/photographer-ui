"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
  category: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
};

export default function ImageUpload({
  value,
  onChange,
  category,
  className,
  aspectRatio = "video",
}: ImageUploadProps) {
  const { isUploading, progress, error, upload, reset } = useImageUpload();
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const result = await upload(file, category);
      if (result) {
        onChange(result.publicUrl);
      }
    },
    [upload, category, onChange]
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
    onChange("");
    reset();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {value ? (
        <div className={cn("relative group", aspectClasses[aspectRatio])}>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg"
          />
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
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading... {progress}%</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP up to 10MB
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}