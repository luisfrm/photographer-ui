"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveContactSchedulingLocaleContent } from "@/app/panel/actions";
import type {
  CmsContactSchedulingContent,
  CmsContactSchedulingLocale,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

interface ContactSchedulingEditorProps {
  initialData?: CmsContactSchedulingContent;
}

const emptyLocale = (): CmsContactSchedulingLocale => ({
  title: "",
  subtitle: "",
  badgeText: "",
  ctaButtonText: "",
  note: "",
});

export default function ContactSchedulingEditor({
  initialData,
}: Readonly<ContactSchedulingEditorProps>) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsContactSchedulingLocale>
  >(() => {
    const toForm = (
      l?: CmsContactSchedulingLocale
    ): CmsContactSchedulingLocale => {
      if (!l) return emptyLocale();
      return {
        title: l.title ?? "",
        subtitle: l.subtitle ?? "",
        badgeText: l.badgeText ?? "",
        ctaButtonText: l.ctaButtonText ?? "",
        note: l.note ?? "",
      };
    };
    return {
      en: toForm(initialData?.locales?.en),
      es: toForm(initialData?.locales?.es),
    };
  });
  const initialRef = useRef(JSON.stringify(localeForms));
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(localeForms) !== initialRef.current;

  const updateField = useCallback(
    <K extends keyof CmsContactSchedulingLocale>(
      field: K,
      value: CmsContactSchedulingLocale[K]
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

  const handleSave = async () => {
    setIsSaving(true);
    const current = localeForms[activeLocale];

    const result = await saveContactSchedulingLocaleContent(
      activeLocale,
      current
    );

    if (result.error) {
      toast.error(
        `Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`
      );
    } else {
      const newForms = {
        ...localeForms,
        [activeLocale]: current,
      };
      initialRef.current = JSON.stringify(newForms);
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} scheduling settings saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Studio Hours & Scheduling Card
        </h2>
        <p className="text-sm text-gray-500">
          Configure title, badge text, and call-to-action button for the studio
          hours card shown on the home page.
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
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save {LOCALE_NAMES[activeLocale]}
        </Button>
      </div>

      {/* Card Info */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scheduling-title" className="text-gray-700 font-medium">
            Card Title
          </Label>
          <Input
            id="scheduling-title"
            value={current.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., Studio Hours"
            className="max-w-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduling-subtitle" className="text-gray-700 font-medium">
            Subtitle / Description
          </Label>
          <Textarea
            id="scheduling-subtitle"
            value={current.subtitle ?? ""}
            onChange={(e) => updateField("subtitle", e.target.value)}
            placeholder="e.g., Available sessions for portraits, events, and commercial projects."
            rows={2}
            className="max-w-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="scheduling-badge" className="text-gray-700">
              Availability Badge Text
            </Label>
            <Input
              id="scheduling-badge"
              value={current.badgeText ?? ""}
              onChange={(e) => updateField("badgeText", e.target.value)}
              placeholder="e.g., Open for bookings"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduling-cta" className="text-gray-700">
              CTA Button Label
            </Label>
            <Input
              id="scheduling-cta"
              value={current.ctaButtonText ?? ""}
              onChange={(e) => updateField("ctaButtonText", e.target.value)}
              placeholder="e.g., Book a Session"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="scheduling-note" className="text-gray-700">
            Footer Note (Optional)
          </Label>
          <Input
            id="scheduling-note"
            value={current.note ?? ""}
            onChange={(e) => updateField("note", e.target.value)}
            placeholder="e.g., Real-time calendar with instant booking confirmation."
            className="max-w-xl"
          />
        </div>
      </div>
    </div>
  );
}
