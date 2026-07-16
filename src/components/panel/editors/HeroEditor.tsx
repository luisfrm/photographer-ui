"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ImageUpload from "@/components/panel/ImageUpload";
import {
  saveHeroLocaleContent,
  saveHeroImages,
} from "@/app/panel/actions";
import type { CmsHeroContent, CmsHeroLocale, Locale } from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type HeroEditorProps = {
  initialData?: CmsHeroContent;
};

/** References to ImageUpload's upload controls */
type ImageUploadRef = {
  uploadToR2: () => Promise<string | null>;
  hasPendingFile: boolean;
};

export default function HeroEditor({ initialData }: HeroEditorProps) {
  // ─── Image state ──────────────────────────────────────────
  // Current saved R2 keys (from Supabase)
  const [savedKey1, setSavedKey1] = useState(
    initialData?.backgroundImage1 || ""
  );
  const [savedKey2, setSavedKey2] = useState(
    initialData?.backgroundImage2 || ""
  );
  // Old keys to delete after successful save
  const oldKey1Ref = useRef<string | null>(null);
  const oldKey2Ref = useRef<string | null>(null);
  // Refs to ImageUpload components for triggering upload
  const img1Ref = useRef<ImageUploadRef | null>(null);
  const img2Ref = useRef<ImageUploadRef | null>(null);
  // Track if any image has pending changes
  const [hasImageChanges, setHasImageChanges] = useState(false);

  // ─── Locale state ─────────────────────────────────────────
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsHeroLocale>
  >({
    en: initialData?.locales?.en || {
      title: "",
      subtitle: "",
      cta: "",
      ctaUrl: "/contact",
      ctaNewTab: false,
    },
    es: initialData?.locales?.es || {
      title: "",
      subtitle: "",
      cta: "",
      ctaUrl: "/contact",
      ctaNewTab: false,
    },
  });
  const [hasLocaleChanges, setHasLocaleChanges] = useState(false);

  // ─── Loading states ───────────────────────────────────────
  const [isSavingImages, setIsSavingImages] = useState(false);
  const [isSavingLocale, setIsSavingLocale] = useState(false);

  // ─── Image upload callbacks ───────────────────────────────
  const handleImg1Ready = useCallback((upload: ImageUploadRef) => {
    img1Ref.current = upload;
    setHasImageChanges(
      upload.hasPendingFile || img2Ref.current?.hasPendingFile || false
    );
  }, []);

  const handleImg2Ready = useCallback((upload: ImageUploadRef) => {
    img2Ref.current = upload;
    setHasImageChanges(
      img1Ref.current?.hasPendingFile || upload.hasPendingFile || false
    );
  }, []);

  // ─── Locale form handlers ─────────────────────────────────
  const handleLocaleChange = (
    field: keyof CmsHeroLocale,
    value: string | boolean
  ) => {
    setLocaleForms((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        [field]: value,
      },
    }));
    setHasLocaleChanges(true);
  };

  // ─── Save Images: upload to R2 → update DB → delete old ───
  const handleSaveImages = async () => {
    setIsSavingImages(true);

    let newKey1 = savedKey1;
    let newKey2 = savedKey2;

    // Upload image 1 if pending
    if (img1Ref.current?.hasPendingFile) {
      const key = await img1Ref.current.uploadToR2();
      if (key) newKey1 = key;
      else {
        toast.error("Failed to upload image 1");
        setIsSavingImages(false);
        return;
      }
    }

    // Upload image 2 if pending
    if (img2Ref.current?.hasPendingFile) {
      const key = await img2Ref.current.uploadToR2();
      if (key) newKey2 = key;
      else {
        toast.error("Failed to upload image 2");
        setIsSavingImages(false);
        return;
      }
    }

    // Save new keys to DB + delete old images from R2
    const result = await saveHeroImages(
      newKey1,
      newKey2,
      oldKey1Ref.current || savedKey1 || undefined,
      oldKey2Ref.current || savedKey2 || undefined
    );

    if (result.error) {
      toast.error(`Failed to save images: ${result.error}`);
    } else {
      setSavedKey1(newKey1);
      setSavedKey2(newKey2);
      oldKey1Ref.current = null;
      oldKey2Ref.current = null;
      setHasImageChanges(false);
      toast.success("Images saved successfully!");
    }

    setIsSavingImages(false);
  };

  // ─── Save Content: save only the active locale text ────────
  const handleSaveLocale = async () => {
    setIsSavingLocale(true);
    const result = await saveHeroLocaleContent(
      activeLocale,
      localeForms[activeLocale]
    );

    if (result.error) {
      toast.error(
        `Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`
      );
    } else {
      toast.success(`${LOCALE_NAMES[activeLocale]} content saved!`);
      setHasLocaleChanges(false);
    }

    setIsSavingLocale(false);
  };

  const currentLocale = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
        <p className="text-sm text-gray-500">
          Edit the main hero section of your homepage
        </p>
      </div>

      {/* ─── Shared Background Images ─────────────────────── */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-700 font-medium">
              Background Images
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Shared across all languages — uploads when you save
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveImages}
            disabled={!hasImageChanges || isSavingImages}
          >
            {isSavingImages ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSavingImages ? "Uploading..." : "Save Images"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">
              Image 1 (Left)
            </p>
            <ImageUpload
              value={savedKey1}
              category="hero"
              aspectRatio="video"
              onUploadReady={handleImg1Ready}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">
              Image 2 (Right)
            </p>
            <ImageUpload
              value={savedKey2}
              category="hero"
              aspectRatio="video"
              onUploadReady={handleImg2Ready}
            />
          </div>
        </div>
      </div>

      {/* ─── Locale Content ───────────────────────────────── */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <Tabs
          value={activeLocale}
          onValueChange={(v) => setActiveLocale(v as Locale)}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              {LOCALES.map((locale) => (
                <TabsTrigger key={locale} value={locale}>
                  {LOCALE_NAMES[locale]}
                </TabsTrigger>
              ))}
            </TabsList>

            <Button
              size="sm"
              onClick={handleSaveLocale}
              disabled={!hasLocaleChanges || isSavingLocale}
            >
              {isSavingLocale ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save {LOCALE_NAMES[activeLocale]}
            </Button>
          </div>

          {/* Locale fields */}
          <div className="mt-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor={`hero-title-${activeLocale}`}
                className="text-gray-700"
              >
                Title
              </Label>
              <Input
                id={`hero-title-${activeLocale}`}
                value={currentLocale.title}
                onChange={(e) => handleLocaleChange("title", e.target.value)}
                placeholder="Enter hero title"
                className="max-w-xl"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label
                htmlFor={`hero-subtitle-${activeLocale}`}
                className="text-gray-700"
              >
                Subtitle
              </Label>
              <Textarea
                id={`hero-subtitle-${activeLocale}`}
                value={currentLocale.subtitle}
                onChange={(e) =>
                  handleLocaleChange("subtitle", e.target.value)
                }
                placeholder="Enter hero subtitle"
                rows={3}
                className="max-w-xl"
              />
              <p className="text-xs text-gray-500">
                Supports HTML tags like &lt;strong&gt;, &lt;em&gt;,
                &lt;br/&gt;
              </p>
            </div>

            {/* CTA Button Text */}
            <div className="space-y-2">
              <Label
                htmlFor={`hero-cta-${activeLocale}`}
                className="text-gray-700"
              >
                Call to Action Button Text
              </Label>
              <Input
                id={`hero-cta-${activeLocale}`}
                value={currentLocale.cta}
                onChange={(e) => handleLocaleChange("cta", e.target.value)}
                placeholder="e.g., Book a session"
                className="max-w-xl"
              />
            </div>

            {/* CTA URL */}
            <div className="space-y-2">
              <Label
                htmlFor={`hero-cta-url-${activeLocale}`}
                className="text-gray-700"
              >
                Call to Action URL
              </Label>
              <Input
                id={`hero-cta-url-${activeLocale}`}
                value={currentLocale.ctaUrl}
                onChange={(e) =>
                  handleLocaleChange("ctaUrl", e.target.value)
                }
                placeholder="e.g., /contact or https://example.com"
                className="max-w-xl"
              />
            </div>

            {/* Open in new tab */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`hero-cta-new-tab-${activeLocale}`}
                checked={currentLocale.ctaNewTab}
                onCheckedChange={(checked) =>
                  handleLocaleChange("ctaNewTab", checked === true)
                }
              />
              <Label
                htmlFor={`hero-cta-new-tab-${activeLocale}`}
                className="text-gray-700 cursor-pointer"
              >
                Open link in a new tab
              </Label>
            </div>
          </div>
        </Tabs>
      </div>

      {/* ─── Preview ──────────────────────────────────────── */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
          Preview ({LOCALE_NAMES[activeLocale]})
        </p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              {currentLocale.title || "Your Title Here"}
            </h1>
            <p
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html:
                  currentLocale.subtitle ||
                  "Your subtitle will appear here...",
              }}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" disabled>
                {currentLocale.cta || "Button Text"}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              URL: {currentLocale.ctaUrl || "/contact"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
