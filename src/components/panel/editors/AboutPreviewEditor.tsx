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
import { getR2KeyUrl } from "@/lib/r2/url";
import {
  saveAboutPreviewLocaleContent,
  saveAboutPreviewImage,
} from "@/app/panel/actions";
import type {
  CmsAboutPreviewContent,
  CmsAboutPreviewLocale,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type AboutPreviewEditorProps = {
  initialData?: CmsAboutPreviewContent;
};

type ImageUploadRef = {
  uploadToR2: () => Promise<string | null>;
  hasPendingFile: boolean;
};

export default function AboutPreviewEditor({
  initialData,
}: AboutPreviewEditorProps) {
  // ─── Image state ──────────────────────────────────────────
  const [savedImage, setSavedImage] = useState(initialData?.image || "");
  const oldImageRef = useRef<string | null>(null);
  const imgRef = useRef<ImageUploadRef | null>(null);
  const [hasImageChanges, setHasImageChanges] = useState(false);

  // ─── Locale state ─────────────────────────────────────────
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsAboutPreviewLocale>
  >({
    en: initialData?.locales?.en || {
      title: "",
      description: "",
      cta: "",
      ctaUrl: "",
      ctaNewTab: false,
    },
    es: initialData?.locales?.es || {
      title: "",
      description: "",
      cta: "",
      ctaUrl: "",
      ctaNewTab: false,
    },
  });
  const [hasLocaleChanges, setHasLocaleChanges] = useState(false);

  // ─── Loading states ───────────────────────────────────────
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isSavingLocale, setIsSavingLocale] = useState(false);

  // ─── Image upload callbacks ───────────────────────────────
  const handleImgReady = useCallback((upload: ImageUploadRef) => {
    imgRef.current = upload;
    setHasImageChanges(upload.hasPendingFile);
  }, []);

  // ─── Locale form handlers ─────────────────────────────────
  const handleLocaleChange = (
    field: keyof CmsAboutPreviewLocale,
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

  // ─── Save Image ───────────────────────────────────────────
  const handleSaveImage = async () => {
    setIsSavingImage(true);

    let newKey = savedImage;
    if (imgRef.current?.hasPendingFile) {
      const key = await imgRef.current.uploadToR2();
      if (key) newKey = key;
      else {
        toast.error("Failed to upload image");
        setIsSavingImage(false);
        return;
      }
    }

    const result = await saveAboutPreviewImage(
      newKey,
      oldImageRef.current || savedImage || undefined
    );

    if (result.error) {
      toast.error(`Failed to save image: ${result.error}`);
    } else {
      setSavedImage(newKey);
      oldImageRef.current = null;
      setHasImageChanges(false);
      toast.success("Image saved!");
    }

    setIsSavingImage(false);
  };

  // ─── Save Locale Content ──────────────────────────────────
  const handleSaveLocale = async () => {
    setIsSavingLocale(true);
    const result = await saveAboutPreviewLocaleContent(
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
        <h2 className="text-lg font-semibold text-gray-900">
          About Preview Section
        </h2>
        <p className="text-sm text-gray-500">
          Edit the about section shown on the homepage
        </p>
      </div>

      {/* ─── Shared Image ──────────────────────────────────── */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-700 font-medium">Image</Label>
            <p className="text-xs text-gray-500 mt-1">
              Shared across all languages
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveImage}
            disabled={!hasImageChanges || isSavingImage}
          >
            {isSavingImage ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSavingImage ? "Uploading..." : "Save Image"}
          </Button>
        </div>

        <ImageUpload
          value={savedImage}
          category="about"
          aspectRatio="square"
          onUploadReady={handleImgReady}
        />
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
                htmlFor={`about-title-${activeLocale}`}
                className="text-gray-700"
              >
                Title
              </Label>
              <Input
                id={`about-title-${activeLocale}`}
                value={currentLocale.title}
                onChange={(e) => handleLocaleChange("title", e.target.value)}
                placeholder="e.g., About me"
                className="max-w-xl"
              />
            </div>

            {/* Description (HTML) */}
            <div className="space-y-2">
              <Label
                htmlFor={`about-desc-${activeLocale}`}
                className="text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id={`about-desc-${activeLocale}`}
                value={currentLocale.description}
                onChange={(e) =>
                  handleLocaleChange("description", e.target.value)
                }
                placeholder="Enter description text"
                rows={5}
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
                htmlFor={`about-cta-${activeLocale}`}
                className="text-gray-700"
              >
                Button Text{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id={`about-cta-${activeLocale}`}
                value={currentLocale.cta}
                onChange={(e) => handleLocaleChange("cta", e.target.value)}
                placeholder="e.g., View My Work"
                className="max-w-xl"
              />
            </div>

            {/* CTA URL */}
            <div className="space-y-2">
              <Label
                htmlFor={`about-cta-url-${activeLocale}`}
                className="text-gray-700"
              >
                Button URL{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id={`about-cta-url-${activeLocale}`}
                value={currentLocale.ctaUrl}
                onChange={(e) =>
                  handleLocaleChange("ctaUrl", e.target.value)
                }
                placeholder="e.g., /en/gallery or https://example.com"
                className="max-w-xl"
              />
            </div>

            {/* Open in new tab */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`about-cta-new-tab-${activeLocale}`}
                checked={currentLocale.ctaNewTab}
                onCheckedChange={(checked) =>
                  handleLocaleChange("ctaNewTab", checked === true)
                }
              />
              <Label
                htmlFor={`about-cta-new-tab-${activeLocale}`}
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
          <div className="bg-white p-6 rounded-lg shadow-sm grid md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">
                {currentLocale.title || "Your Title Here"}
              </h3>
              <div
                className="text-gray-600 text-sm leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    currentLocale.description ||
                    "Your description will appear here...",
                }}
              />
              {currentLocale.cta && (
                <div className="flex items-center gap-2">
                  <Button size="sm" disabled>
                    {currentLocale.cta}
                  </Button>
                  <span className="text-xs text-gray-400">
                    {currentLocale.ctaUrl || "/"}
                    {currentLocale.ctaNewTab ? " (new tab)" : ""}
                  </span>
                </div>
              )}
            </div>
            {savedImage && (
              <div className="relative aspect-square w-full max-w-[280px] md:max-w-[320px] rounded-lg overflow-hidden mx-auto">
                <img
                  src={getR2KeyUrl(savedImage)}
                  alt="About preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
