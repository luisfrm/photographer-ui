"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Save, Loader2, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getR2KeyUrl } from "@/lib/r2/url";
import { saveGalleryContent } from "@/app/panel/actions";
import type { CmsImage } from "@/types/cms";

// ─── Slot Configuration ──────────────────────────────────────

/** Fixed slot definitions — order matches the public gallery layout */
type SlotConfig = {
  label: string;
  aspectRatio: string; // CSS aspect-ratio value
  recommendedRatio: string; // Human-readable label
  colSpan: string;
  rowSpan: string;
};

const SLOTS: SlotConfig[] = [
  {
    label: "A",
    aspectRatio: "3/2",
    recommendedRatio: "3:2",
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    label: "B",
    aspectRatio: "3/2",
    recommendedRatio: "3:2",
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
  },
  {
    label: "C",
    aspectRatio: "3/4",
    recommendedRatio: "3:4",
    colSpan: "col-span-2",
    rowSpan: "row-span-2",
  },
  {
    label: "D",
    aspectRatio: "16/5",
    recommendedRatio: "16:5",
    colSpan: "col-span-4",
    rowSpan: "row-span-1",
  },
];

const REQUIRED_SLOT_COUNT = SLOTS.length; // 4

// ─── Types ───────────────────────────────────────────────────

type PendingImage = {
  previewUrl: string;
  file: File;
  alt: string;
};

type GalleryEditorProps = {
  initialData?: {
    title?: string;
    images?: CmsImage[];
  };
};

// ─── Component ───────────────────────────────────────────────

export default function GalleryEditor({ initialData }: GalleryEditorProps) {
  // Section title
  const [title, setTitle] = useState(initialData?.title || "Some Shots");
  const initialTitleRef = useRef(title);
  // Saved images per slot (null = empty slot)
  const [savedImages, setSavedImages] = useState<(CmsImage | null)[]>(() =>
    SLOTS.map((_, i) => initialData?.images?.[i] ?? null)
  );
  // Pending uploads per slot
  const [pendingImages, setPendingImages] = useState<(PendingImage | null)[]>(
    () => SLOTS.map(() => null)
  );
  // R2 keys marked for deletion on save
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  // Per-slot file input refs
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    SLOTS.map(() => null)
  );

  // ─── Per-slot handlers ─────────────────────────────────────

  const handleAddImage = useCallback(
    (slotIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setPendingImages((prev) => {
        // Revoke previous pending preview if any
        const previous = prev[slotIndex];
        if (previous) URL.revokeObjectURL(previous.previewUrl);
        const next = [...prev];
        next[slotIndex] = {
          previewUrl,
          file,
          alt: `Gallery image ${SLOTS[slotIndex].label}`,
        };
        return next;
      });

      // Reset input so same file can be selected again
      if (inputRefs.current[slotIndex]) {
        inputRefs.current[slotIndex]!.value = "";
      }
    },
    []
  );

  const handleReplace = useCallback((slotIndex: number) => {
    // Mark current saved image for removal
    setSavedImages((prev) => {
      const current = prev[slotIndex];
      if (current?.src) {
        setRemovedKeys((keys) =>
          keys.includes(current.src) ? keys : [...keys, current.src]
        );
      }
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    // Open file input
    inputRefs.current[slotIndex]?.click();
  }, []);

  const handleRemove = useCallback((slotIndex: number) => {
    if (!window.confirm("Remove this image?")) return;

    setSavedImages((prev) => {
      const current = prev[slotIndex];
      if (current?.src) {
        setRemovedKeys((keys) =>
          keys.includes(current.src) ? keys : [...keys, current.src]
        );
      }
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const handleRemovePending = useCallback((slotIndex: number) => {
    setPendingImages((prev) => {
      const current = prev[slotIndex];
      if (current) URL.revokeObjectURL(current.previewUrl);
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  // ─── Save ──────────────────────────────────────────────────

  const hasChanges =
    pendingImages.some((p) => p !== null) ||
    removedKeys.length > 0 ||
    title !== initialTitleRef.current;

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Upload all pending images to R2
      const newKeys: string[] = new Array(SLOTS.length).fill("");

      for (let i = 0; i < SLOTS.length; i++) {
        const pending = pendingImages[i];
        if (!pending) continue;

        const res = await fetch("/api/r2/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: pending.file.name,
            contentType: pending.file.type,
            category: "gallery",
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to get upload URL");
        }

        const { uploadUrl, key } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: pending.file,
          headers: { "Content-Type": pending.file.type },
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload file to R2");
        }

        newKeys[i] = key;
        URL.revokeObjectURL(pending.previewUrl);
      }

      // Build final images array: for each slot, use pending (new key) if present, else saved
      const finalImages: CmsImage[] = SLOTS.map((slot, i) => {
        if (newKeys[i]) {
          return { src: newKeys[i], alt: `Gallery image ${slot.label}` };
        }
        return savedImages[i] ?? { src: "", alt: `Gallery image ${slot.label}` };
      });

      const result = await saveGalleryContent(title, finalImages, removedKeys);

      if (result.error) {
        toast.error(`Failed to save: ${result.error}`);
      } else {
        initialTitleRef.current = title;
        setSavedImages(finalImages.map((img) => (img.src ? img : null)));
        setPendingImages(SLOTS.map(() => null));
        setRemovedKeys([]);
        toast.success("Gallery saved!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }

    setIsSaving(false);
  };

  // ─── Derived state ─────────────────────────────────────────

  const totalImages = savedImages.filter(Boolean).length;
  const isComplete = totalImages === REQUIRED_SLOT_COUNT;

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Gallery Section</h2>
          <p className="text-sm text-gray-500">
            Manage the images shown in the homepage gallery
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            All {REQUIRED_SLOT_COUNT} images are required to render the section.{" "}
            <span
              className={
                isComplete ? "text-green-500" : "text-amber-500"
              }
            >
              {totalImages}/{REQUIRED_SLOT_COUNT} uploaded
            </span>
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Uploading..." : "Save"}
        </Button>
      </div>

      {/* Title */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-2">
        <Label
          htmlFor="gallery-title"
          className="text-gray-700 font-medium"
        >
          Section Title
        </Label>
        <Input
          id="gallery-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Some Shots"
          className="max-w-xl"
        />
        <p className="text-xs text-gray-500">
          The heading displayed above the gallery grid
        </p>
      </div>

      {/* Grid matching public layout */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Layout preview
        </p>
        <div className="grid grid-cols-6 grid-rows-2 gap-4 h-[600px]">
          {SLOTS.map((slot, index) => {
            const saved = savedImages[index];
            const pending = pendingImages[index];
            const displaySrc = pending?.previewUrl || (saved ? getR2KeyUrl(saved.src) : "");

            return (
              <div
                key={slot.label}
                className={`${slot.colSpan} ${slot.rowSpan} relative group`}
              >
                {/* Hidden file input for this slot */}
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage(index)}
                  className="hidden"
                />

                {saved || pending ? (
                  // ─── Filled slot ───────────────────────────
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
                    {displaySrc ? (
                      <Image
                        src={displaySrc}
                        alt={pending?.alt || saved?.alt || `Slot ${slot.label}`}
                        fill
                        className="object-cover"
                      />
                    ) : null}

                    {/* Pending badge */}
                    {pending && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium z-20">
                        New
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      {/* Replace button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReplace(index)}
                        disabled={isSaving}
                        className="bg-white hover:bg-gray-100"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Replace
                      </Button>

                      {/* Remove button (X) — square, red bg, white text */}
                      {pending ? (
                        <button
                          type="button"
                          onClick={() => handleRemovePending(index)}
                          disabled={isSaving}
                          aria-label="Remove pending image"
                          className="h-8 w-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemove(index)}
                          disabled={isSaving}
                          aria-label="Remove image"
                          className="h-8 w-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // ─── Empty slot ─────────────────────────────
                  <button
                    type="button"
                    onClick={() => inputRefs.current[index]?.click()}
                    disabled={isSaving}
                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="text-center space-y-1">
                      <Plus className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-xs font-medium text-gray-600">
                        Slot {slot.label}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Recommended {slot.recommendedRatio}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            );
          })}

          {/* Empty bottom-middle cell — matches current public layout */}
          <div className="col-span-2 row-span-1" />
        </div>
      </div>
    </div>
  );
}
