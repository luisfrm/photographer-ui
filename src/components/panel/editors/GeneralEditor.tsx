"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ImageUpload from "@/components/panel/ImageUpload";
import {
  saveGeneralLocaleContent,
  saveGeneralLogo,
} from "@/app/panel/actions";
import type {
  CmsGeneralContent,
  CmsGeneralLocale,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type GeneralEditorProps = {
  initialData?: CmsGeneralContent;
};

const emptyLocale = (): CmsGeneralLocale => ({
  title: "",
  slogan: "",
});

export default function GeneralEditor({ initialData }: GeneralEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [logoKey, setLogoKey] = useState<string>(initialData?.logoKey ?? "");
  const [logoKeyInitial, setLogoKeyInitial] = useState<string>(
    initialData?.logoKey ?? ""
  );
  const [hasPendingLogo, setHasPendingLogo] = useState(false);
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsGeneralLocale>
  >(() => ({
    en: initialData?.locales?.en
      ? {
          title: initialData.locales.en.title,
          slogan: initialData.locales.en.slogan,
        }
      : emptyLocale(),
    es: initialData?.locales?.es
      ? {
          title: initialData.locales.es.title,
          slogan: initialData.locales.es.slogan,
        }
      : emptyLocale(),
  }));
  const initialRef = useRef(JSON.stringify(localeForms));
  const [isSavingLocale, setIsSavingLocale] = useState(false);
  const [isSavingLogo, setIsSavingLogo] = useState(false);

  const hasLocaleChanges = JSON.stringify(localeForms) !== initialRef.current;
  // Logo "has changes" if the saved key differs OR there's a new file waiting
  // to be uploaded. The local preview state lives inside `useImageUpload`, so
  // we mirror `hasPendingFile` via the ImageUpload's onUploadReady callback.
  const hasLogoChanges = logoKey !== logoKeyInitial || hasPendingLogo;

  // ─── Locale-level handlers ───────────────────────────────

  const updateField = useCallback(
    <K extends keyof CmsGeneralLocale>(
      field: K,
      value: CmsGeneralLocale[K]
    ) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          [field]: value,
        },
      }));
    },
    [activeLocale]
  );

  // ─── ImageUpload ref (exposes upload controls) ───────────

  const imageUploadRef = useRef<{
    uploadToR2: () => Promise<string | null>;
    hasPendingFile: boolean;
    isUploading: boolean;
  } | null>(null);

  const handleImageUploadReady = useCallback(
    (upload: {
      uploadToR2: () => Promise<string | null>;
      hasPendingFile: boolean;
      isUploading: boolean;
    }) => {
      imageUploadRef.current = upload;
      setHasPendingLogo(upload.hasPendingFile);
    },
    []
  );

  // ─── Save locale text ────────────────────────────────────

  const handleSaveLocale = async () => {
    setIsSavingLocale(true);
    const result = await saveGeneralLocaleContent(
      activeLocale,
      localeForms[activeLocale]
    );

    if (result.error) {
      toast.error(
        `Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`
      );
    } else {
      initialRef.current = JSON.stringify(localeForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} general saved!`);
    }

    setIsSavingLocale(false);
  };

  // ─── Save logo ───────────────────────────────────────────

  const handleSaveLogo = async () => {
    if (!imageUploadRef.current) return;

    setIsSavingLogo(true);
    let newKey = logoKey;

    if (imageUploadRef.current.hasPendingFile) {
      const uploaded = await imageUploadRef.current.uploadToR2();
      if (!uploaded) {
        toast.error("Failed to upload logo to R2");
        setIsSavingLogo(false);
        return;
      }
      newKey = uploaded;
    }

    const result = await saveGeneralLogo(newKey);

    if (result.error) {
      toast.error(`Failed to save logo: ${result.error}`);
    } else {
      setLogoKey(newKey);
      setLogoKeyInitial(newKey);
      setHasPendingLogo(false);
      toast.success("Logo saved!");
    }

    setIsSavingLogo(false);
  };

  const handleRemoveLogo = () => {
    setLogoKey("");
    setHasPendingLogo(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">General</h2>
        <p className="text-sm text-gray-500">
          Brand identity shared across the site: title, slogan, and logo.
        </p>
      </div>

      {/* Locale Tabs + Save */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <Tabs
          value={activeLocale}
          onValueChange={(v) => setActiveLocale(v as Locale)}
        >
          <TabsList>
            {LOCALES.map((locale) => (
              <TabsTrigger key={locale} value={locale}>
                {LOCALE_NAMES[locale]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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

      {/* Title + Slogan */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="space-y-2">
          <Label htmlFor="general-title" className="text-gray-700 font-medium">
            Title (Brand Name)
          </Label>
          <Input
            id="general-title"
            value={current.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., Darianny Salas"
            className="max-w-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="general-slogan" className="text-gray-700 font-medium">
            Slogan
          </Label>
          <Textarea
            id="general-slogan"
            value={current.slogan}
            onChange={(e) => updateField("slogan", e.target.value)}
            placeholder="e.g., Capturing moments, creating memories."
            rows={2}
            className="max-w-xl"
          />
        </div>
      </div>

      {/* Logo (shared, outside locale tabs) */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Logo</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Shared across all locales. Used in the header and footer.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleSaveLogo}
            disabled={!hasLogoChanges || isSavingLogo}
          >
            {isSavingLogo ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Logo
          </Button>
        </div>
        <div className="max-w-xs">
          <ImageUpload
            value={logoKey}
            onRemove={handleRemoveLogo}
            category="general"
            aspectRatio="square"
            onUploadReady={handleImageUploadReady}
          />
        </div>
      </div>
    </div>
  );
}
