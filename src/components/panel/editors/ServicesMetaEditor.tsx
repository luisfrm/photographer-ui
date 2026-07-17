"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveServicesMetaLocaleContent } from "@/app/panel/actions";
import type { CmsServicesMetaContent, CmsServicesMetaLocale, Locale } from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type ServicesMetaEditorProps = {
  initialData?: CmsServicesMetaContent;
};

export default function ServicesMetaEditor({ initialData }: ServicesMetaEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<Record<Locale, CmsServicesMetaLocale>>({
    en: initialData?.locales?.en || { title: "", description: "" },
    es: initialData?.locales?.es || { title: "", description: "" },
  });
  const initialRef = useRef(JSON.stringify(localeForms));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (field: keyof CmsServicesMetaLocale, value: string) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          [field]: value,
        },
      }));
      setHasChanges(true);
    },
    [activeLocale]
  );

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveServicesMetaLocaleContent(
      activeLocale,
      localeForms[activeLocale]
    );

    if (result.error) {
      toast.error(`Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`);
    } else {
      toast.success(`${LOCALE_NAMES[activeLocale]} content saved!`);
      initialRef.current = JSON.stringify(localeForms);
      setHasChanges(false);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Services Page Meta</h2>
        <p className="text-sm text-gray-500">
          Edit the hero section and SEO metadata for the /services page
        </p>
      </div>

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
            <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save {LOCALE_NAMES[activeLocale]}
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`meta-title-${activeLocale}`} className="text-gray-700">
                Hero Title
              </Label>
              <Input
                id={`meta-title-${activeLocale}`}
                value={current.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Services"
                className="max-w-xl"
              />
              <p className="text-xs text-gray-500">Main H1 of the services page</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`meta-desc-${activeLocale}`} className="text-gray-700">
                Hero Description
              </Label>
              <Textarea
                id={`meta-desc-${activeLocale}`}
                value={current.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g., Professional photography services..."
                rows={3}
                className="max-w-xl"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                SEO Metadata (optional)
              </p>

              <div className="space-y-2">
                <Label
                  htmlFor={`meta-meta-title-${activeLocale}`}
                  className="text-gray-700"
                >
                  Meta Title{" "}
                  <span className="text-gray-400 font-normal">(browser tab)</span>
                </Label>
                <Input
                  id={`meta-meta-title-${activeLocale}`}
                  value={current.metaTitle ?? ""}
                  onChange={(e) => handleChange("metaTitle", e.target.value)}
                  placeholder="Falls back to Hero Title if empty"
                  className="max-w-xl"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`meta-meta-desc-${activeLocale}`}
                  className="text-gray-700"
                >
                  Meta Description{" "}
                  <span className="text-gray-400 font-normal">(search engines)</span>
                </Label>
                <Textarea
                  id={`meta-meta-desc-${activeLocale}`}
                  value={current.metaDescription ?? ""}
                  onChange={(e) => handleChange("metaDescription", e.target.value)}
                  placeholder="Falls back to Hero Description if empty"
                  rows={2}
                  className="max-w-xl"
                />
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
