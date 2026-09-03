"use client";

import { useState, useCallback } from "react";
import { Save, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveContactInfoLocaleContent } from "@/app/panel/actions";
import type {
  CmsContactInfoContent,
  CmsContactInfoLocale,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type ContactInfoEditorProps = {
  initialData?: CmsContactInfoContent;
};

const emptyLocale = (): CmsContactInfoLocale => ({
  title: "",
  subtitle: "",
  email: "",
  phone: "",
  location: "",
  emailTitle: "",
  emailSubtitle: "",
  phoneTitle: "",
  phoneSubtitle: "",
  locationTitle: "",
  locationSubtitle: "",
  socialLinks: [],
});

export default function ContactInfoEditor({
  initialData,
}: ContactInfoEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsContactInfoLocale>
  >(() => {
    const toForm = (
      l?: CmsContactInfoLocale
    ): CmsContactInfoLocale => {
      if (!l) return emptyLocale();
      return {
        title: l.title ?? "",
        subtitle: l.subtitle ?? "",
        email: l.email ?? "",
        phone: l.phone ?? "",
        location: l.location ?? "",
        emailTitle: l.emailTitle ?? "",
        emailSubtitle: l.emailSubtitle ?? "",
        phoneTitle: l.phoneTitle ?? "",
        phoneSubtitle: l.phoneSubtitle ?? "",
        locationTitle: l.locationTitle ?? "",
        locationSubtitle: l.locationSubtitle ?? "",
        socialLinks: l.socialLinks ?? [],
      };
    };
    return {
      en: toForm(initialData?.locales?.en),
      es: toForm(initialData?.locales?.es),
    };
  });
  const [initialSnapshot, setInitialSnapshot] = useState(() =>
    JSON.stringify(localeForms)
  );
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(localeForms) !== initialSnapshot;

  // ─── Locale-level handlers ───────────────────────────────

  const updateField = useCallback(
    <K extends keyof CmsContactInfoLocale>(
      field: K,
      value: CmsContactInfoLocale[K]
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

  // ─── Save ────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true);

    const current = localeForms[activeLocale];

    const data: CmsContactInfoLocale = {
      title: current.title,
      subtitle: current.subtitle,
      email: current.email,
      phone: current.phone,
      location: current.location,
      emailTitle: current.emailTitle,
      emailSubtitle: current.emailSubtitle,
      phoneTitle: current.phoneTitle,
      phoneSubtitle: current.phoneSubtitle,
      locationTitle: current.locationTitle,
      locationSubtitle: current.locationSubtitle,
      socialLinks: current.socialLinks ?? [],
    };

    const result = await saveContactInfoLocaleContent(activeLocale, data);

    if (result.error) {
      toast.error(
        `Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`
      );
    } else {
      const newForms = {
        ...localeForms,
        [activeLocale]: data,
      };
      setInitialSnapshot(JSON.stringify(newForms));
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} contact info saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Contact Page Titles & Card Labels
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize the localized titles and descriptive text for the contact page header and cards.
        </p>
      </div>

      {/* Global Data Notice */}
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-gray-700">
            <p className="font-medium text-gray-900">
              Centralized Contact Details & Social Networks
            </p>
            <p className="text-gray-600 mt-0.5">
              The actual phone number, email address, city, and social media links are now managed globally under{" "}
              <span className="font-semibold text-gray-900">Global → Contact & Socials</span> so you never have to duplicate them across languages.
            </p>
          </div>
        </div>
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

      {/* Section Header */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Section Header</h3>
        <div className="space-y-2">
          <Label htmlFor="contact-title" className="text-gray-700 font-medium">
            Main Title
          </Label>
          <Input
            id="contact-title"
            value={current.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., Get In Touch"
            className="max-w-xl"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="contact-subtitle"
            className="text-gray-700 font-medium"
          >
            Subtitle
          </Label>
          <Textarea
            id="contact-subtitle"
            value={current.subtitle ?? ""}
            onChange={(e) => updateField("subtitle", e.target.value)}
            placeholder="A short introductory paragraph."
            rows={2}
            className="max-w-xl"
          />
        </div>
      </div>

      {/* Informative Cards Labels */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Informative Cards Text & Descriptions
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Configure the titles and descriptive notes shown on each contact card for {LOCALE_NAMES[activeLocale]}.
          </p>
        </div>

        {/* 1. Email Card */}
        <div className="p-4 rounded-lg bg-gray-50/70 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
              1. Email Card
            </h4>
            <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
              Uses Global Email
            </span>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="card-email-title" className="text-xs text-gray-600">
                Card Title ({LOCALE_NAMES[activeLocale]})
              </Label>
              <Input
                id="card-email-title"
                value={current.emailTitle ?? ""}
                onChange={(e) => updateField("emailTitle", e.target.value)}
                placeholder="e.g., Email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-email-sub" className="text-xs text-gray-600">
                Card Subtitle / Description ({LOCALE_NAMES[activeLocale]})
              </Label>
              <Input
                id="card-email-sub"
                value={current.emailSubtitle ?? ""}
                onChange={(e) => updateField("emailSubtitle", e.target.value)}
                placeholder="e.g., Contact us by email, and we will respond shortly."
              />
            </div>
          </div>
        </div>

        {/* 2. Phone Card */}
        <div className="p-4 rounded-lg bg-gray-50/70 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
              2. Phone Card
            </h4>
            <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
              Uses Global Phone
            </span>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="card-phone-title" className="text-xs text-gray-600">
                Card Title ({LOCALE_NAMES[activeLocale]})
              </Label>
              <Input
                id="card-phone-title"
                value={current.phoneTitle ?? ""}
                onChange={(e) => updateField("phoneTitle", e.target.value)}
                placeholder="e.g., Phone"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-phone-sub" className="text-xs text-gray-600">
                Card Subtitle / Description ({LOCALE_NAMES[activeLocale]})
              </Label>
              <Input
                id="card-phone-sub"
                value={current.phoneSubtitle ?? ""}
                onChange={(e) => updateField("phoneSubtitle", e.target.value)}
                placeholder="e.g., Call us on weekdays after 6pm."
              />
            </div>
          </div>
        </div>

        {/* 3. Location Card */}
        <div className="p-4 rounded-lg bg-gray-50/70 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
              3. Location Card
            </h4>
            <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
              Uses Global Location
            </span>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="card-loc-title" className="text-xs text-gray-600">
                Card Title ({LOCALE_NAMES[activeLocale]})
              </Label>
              <Input
                id="card-loc-title"
                value={current.locationTitle ?? ""}
                onChange={(e) => updateField("locationTitle", e.target.value)}
                placeholder="e.g., Location"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-loc-sub" className="text-xs text-gray-600">
                Card Subtitle / Description ({LOCALE_NAMES[activeLocale]})
              </Label>
              <Input
                id="card-loc-sub"
                value={current.locationSubtitle ?? ""}
                onChange={(e) => updateField("locationSubtitle", e.target.value)}
                placeholder="e.g., Visit our studio by appointment."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
