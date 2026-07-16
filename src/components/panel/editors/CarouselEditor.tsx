"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Save, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getR2KeyUrl } from "@/lib/r2/url";
import { saveCarouselContent } from "@/app/panel/actions";
import type { CmsImage } from "@/types/cms";

// Number of fallback images used by the carousel when no CMS images are set
const RECOMMENDED_IMAGE_COUNT = 6;

type CarouselEditorProps = {
  initialData?: CmsImage[];
};

/** A pending image (new upload, not yet saved) */
type PendingImage = {
  /** Local preview URL */
  previewUrl: string;
  /** File to upload */
  file: File;
  /** Auto-generated alt text */
  alt: string;
};

export default function CarouselEditor({ initialData = [] }: CarouselEditorProps) {
  // Existing saved images (R2 keys + alt)
  const [savedImages, setSavedImages] = useState<CmsImage[]>(initialData);
  // Pending new images (local preview, not uploaded yet)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  // Keys marked for deletion
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    // Auto-generate alt based on total position
    const index = savedImages.length + pendingImages.length + 1;

    setPendingImages((prev) => [
      ...prev,
      { previewUrl, file, alt: `Carousel image ${index}` },
    ]);

    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  }, [savedImages.length, pendingImages.length]);

  const handleRemoveSaved = useCallback((index: number) => {
    if (!window.confirm("Remove this image? The change will take effect when you Save.")) return;
    setSavedImages((prev) => {
      const removed = prev[index];
      if (removed?.src) {
        setRemovedKeys((keys) => [...keys, removed.src]);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleRemovePending = useCallback((index: number) => {
    if (!window.confirm("Remove this image?")) return;
    setPendingImages((prev) => {
      // Revoke the object URL to avoid memory leak
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const hasChanges = pendingImages.length > 0 || removedKeys.length > 0;

  const handleSave = async () => {
    setIsUploading(true);

    try {
      // Upload all pending images to R2
      const newImages: CmsImage[] = [];

      for (const pending of pendingImages) {
        // Get presigned URL
        const res = await fetch("/api/r2/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: pending.file.name,
            contentType: pending.file.type,
            category: "carousel",
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to get upload URL");
        }

        const { uploadUrl, key } = await res.json();

        // Upload to R2
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: pending.file,
          headers: { "Content-Type": pending.file.type },
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload file to R2");
        }

        newImages.push({ src: key, alt: pending.alt });

        // Revoke preview URL
        URL.revokeObjectURL(pending.previewUrl);
      }

      // Combine saved + new images
      const allImages = [...savedImages, ...newImages];

      // Save to DB + delete removed images from R2
      const result = await saveCarouselContent(allImages, removedKeys);

      if (result.error) {
        toast.error(`Failed to save: ${result.error}`);
      } else {
        setSavedImages(allImages);
        setPendingImages([]);
        setRemovedKeys([]);
        toast.success("Carousel saved!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }

    setIsUploading(false);
  };

  const totalImages = savedImages.length + pendingImages.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Infinite Carousel</h2>
          <p className="text-sm text-gray-500">
            Manage the images in the scrolling carousel
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            We recommend uploading at least{" "}
            <span className="font-medium text-gray-500">{RECOMMENDED_IMAGE_COUNT} images</span>{" "}
            for the best scrolling experience.{" "}
            {totalImages > 0 && (
              <span className={totalImages >= RECOMMENDED_IMAGE_COUNT ? "text-green-500" : "text-amber-500"}>
                {totalImages}/{RECOMMENDED_IMAGE_COUNT} uploaded
              </span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "Save"}
        </Button>
      </div>

      {/* Image Grid */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Saved images */}
          {savedImages.map((image, index) => (
            <div key={`saved-${index}`} style={{ aspectRatio: "4/3" }} className="relative group">
              <Image
                src={getR2KeyUrl(image.src)}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveSaved(index)}
                style={{ backgroundColor: '#ef4444', position: 'absolute', top: '6px', right: '6px' }}
                className="text-white rounded py-1 z-10 transition-opacity opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Pending images */}
          {pendingImages.map((image, index) => (
            <div key={`pending-${index}`} style={{ aspectRatio: "4/3" }} className="relative group">
              <Image
                src={image.previewUrl}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium">
                New
              </div>
              <button
                type="button"
                onClick={() => handleRemovePending(index)}
                style={{ backgroundColor: '#ef4444', position: 'absolute', top: '6px', right: '6px' }}
                className="text-white rounded p-0.5 z-10 transition-opacity opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Add button */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                inputRef.current?.click();
              }
            }}
            style={{ aspectRatio: "4/3" }}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="hidden"
            />
            <Plus className="h-8 w-8 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Add Image</span>
          </div>
        </div>
      </div>
    </div>
  );
}
