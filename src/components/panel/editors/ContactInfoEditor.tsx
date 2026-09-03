"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2, Plus, X } from "lucide-react";
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

type SocialLink = { platform: string; url: string };

const emptySocialLink = (): SocialLink => ({ platform: "", url: "" });

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
        socialLinks: l.socialLinks?.length
          ? l.socialLinks.map((s) => ({
              platform: s.platform ?? "",
              url: s.url ?? "",
            }))
          : [],
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

  // ─── Social link handlers ────────────────────────────────

  const handleAddSocialLink = useCallback(() => {
    setLocaleForms((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        socialLinks: [
          ...(prev[activeLocale].socialLinks ?? []),
          emptySocialLink(),
        ],
      },
    }));
  }, [activeLocale]);

  const handleRemoveSocialLink = useCallback(
    (index: number) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          socialLinks: (prev[activeLocale].socialLinks ?? []).filter(
            (_, i) => i !== index
          ),
        },
      }));
    },
    [activeLocale]
  );

  const updateSocialLink = useCallback(
    (index: number, field: keyof SocialLink, value: string) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          socialLinks: (prev[activeLocale].socialLinks ?? []).map((s, i) =>
            i === index ? { ...s, [field]: value } : s
          ),
        },
      }));
    },
    [activeLocale]
  );

  // ─── Save ────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true);

    const current = localeForms[activeLocale];

    // Strip empty social links (both fields empty) before saving
    const cleanedSocials: SocialLink[] = (current.socialLinks ?? []).filter(
      (s) => s.platform.trim() || s.url.trim()
    );

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
      socialLinks: cleanedSocials,
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
      initialRef.current = JSON.stringify(newForms);
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} contact info saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];
  const socialLinks = current.socialLinks ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Contact Info & Cards</h2>
        <p className="text-sm text-gray-500">
          Header titles and informative cards (Email, Phone, Location) shown on
          the home page and contact section.
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

      {/* Informative Cards */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Informative Cards (Right Column)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Configure the title, descriptive subtitle, and value for each contact card.
          </p>
        </div>

        {/* 1. Email Card */}
        <div className="p-4 rounded-lg bg-gray-50/70 border border-gray-200 space-y-3">
          <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
            1. Email Card
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="card-email-title" className="text-xs text-gray-600">
                Card Title
              </Label>
              <Input
                id="card-email-title"
                value={current.emailTitle ?? ""}
                onChange={(e) => updateField("emailTitle", e.target.value)}
                placeholder="e.g., Email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact-email" className="text-xs text-gray-600">
                Email Address
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={current.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="hello@example.com"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="card-email-sub" className="text-xs text-gray-600">
              Card Subtitle / Description
            </Label>
            <Input
              id="card-email-sub"
              value={current.emailSubtitle ?? ""}
              onChange={(e) => updateField("emailSubtitle", e.target.value)}
              placeholder="e.g., Contact us by email, and we will respond shortly."
            />
          </div>
        </div>

        {/* 2. Phone Card */}
        <div className="p-4 rounded-lg bg-gray-50/70 border border-gray-200 space-y-3">
          <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
            2. Phone Card
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="card-phone-title" className="text-xs text-gray-600">
                Card Title
              </Label>
              <Input
                id="card-phone-title"
                value={current.phoneTitle ?? ""}
                onChange={(e) => updateField("phoneTitle", e.target.value)}
                placeholder="e.g., Phone"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact-phone" className="text-xs text-gray-600">
                Phone Number
              </Label>
              <Input
                id="contact-phone"
                value={current.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="card-phone-sub" className="text-xs text-gray-600">
              Card Subtitle / Description
            </Label>
            <Input
              id="card-phone-sub"
              value={current.phoneSubtitle ?? ""}
              onChange={(e) => updateField("phoneSubtitle", e.target.value)}
              placeholder="e.g., Call us on weekdays after 6pm."
            />
          </div>
        </div>

        {/* 3. Location Card */}
        <div className="p-4 rounded-lg bg-gray-50/70 border border-gray-200 space-y-3">
          <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
            3. Location Card
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="card-loc-title" className="text-xs text-gray-600">
                Card Title
              </Label>
              <Input
                id="card-loc-title"
                value={current.locationTitle ?? ""}
                onChange={(e) => updateField("locationTitle", e.target.value)}
                placeholder="e.g., Location"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact-location" className="text-xs text-gray-600">
                Location / City
              </Label>
              <Input
                id="contact-location"
                value={current.location ?? ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g., Utah, US"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="card-loc-sub" className="text-xs text-gray-600">
              Card Subtitle / Description
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

      {/* Social links */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            Social links ({socialLinks.length})
          </h3>
        </div>

        {socialLinks.length > 0 && (
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 border border-gray-100 rounded-md"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <Input
                    value={link.platform}
                    onChange={(e) =>
                      updateSocialLink(index, "platform", e.target.value)
                    }
                    placeholder="Platform (e.g., Instagram)"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="h-9 w-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex-shrink-0"
                  aria-label="Remove social link"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddSocialLink}
          className="w-full border border-dashed border-gray-300 rounded py-2 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Social Link
        </button>
      </div>
    </div>
  );
}
