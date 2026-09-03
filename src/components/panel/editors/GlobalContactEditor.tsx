"use client";

import { useState, useCallback } from "react";
import { Save, Loader2, Plus, X, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/common/PhoneInput";
import { toast } from "sonner";
import { saveGlobalContactAction } from "@/app/panel/actions";
import type { CmsGlobalContactContent, CmsSocialLink } from "@/types/cms";

type GlobalContactEditorProps = {
  initialData?: CmsGlobalContactContent;
};

const emptySocialLink = (): CmsSocialLink => ({ platform: "", url: "" });

export default function GlobalContactEditor({ initialData }: GlobalContactEditorProps) {
  const [formData, setFormData] = useState<CmsGlobalContactContent>(() => ({
    phone: initialData?.phone ?? "+1 555 000 0000",
    email: initialData?.email ?? "contact@dnovagallery.com",
    location: initialData?.location ?? "Utah, US",
    socialLinks: initialData?.socialLinks?.length
      ? initialData.socialLinks.map((s) => ({
          platform: s.platform ?? "",
          url: s.url ?? "",
        }))
      : [],
  }));

  const [initialSnapshot, setInitialSnapshot] = useState(() =>
    JSON.stringify(formData)
  );
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(formData) !== initialSnapshot;

  // ─── Field handlers ───────────────────────────────────────

  const updateField = useCallback(
    <K extends keyof CmsGlobalContactContent>(
      field: K,
      value: CmsGlobalContactContent[K]
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // ─── Social link handlers ────────────────────────────────

  const handleAddSocialLink = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, emptySocialLink()],
    }));
  }, []);

  const handleRemoveSocialLink = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }, []);

  const updateSocialLink = useCallback(
    (index: number, field: keyof CmsSocialLink, value: string) => {
      setFormData((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((s, i) =>
          i === index ? { ...s, [field]: value } : s
        ),
      }));
    },
    []
  );

  // ─── Save ────────────────────────────────────────────────

  const handleSave = async () => {
    setIsSaving(true);

    // Filter empty social links
    const cleanedSocials = formData.socialLinks.filter(
      (s) => s.platform.trim() || s.url.trim()
    );

    const payload: CmsGlobalContactContent = {
      ...formData,
      socialLinks: cleanedSocials,
    };

    const result = await saveGlobalContactAction(payload);

    if (result.error) {
      toast.error(`Failed to save global contact info: ${result.error}`);
    } else {
      setInitialSnapshot(JSON.stringify(payload));
      setFormData(payload);
      toast.success("Global contact info and social links saved!");
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Contact Channels & Social Media
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Global communication channels used across Widgets (WhatsApp & Instagram), Footer, and the Contact page.
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
          Save Changes
        </Button>
      </div>

      {/* Direct Contact Channels Card */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-5">
        <div className="flex items-center gap-2 text-gray-900 font-medium">
          <Phone className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Direct Communication</h3>
        </div>

        {/* Phone / WhatsApp */}
        <div className="space-y-2">
          <Label htmlFor="global-phone" className="text-gray-700 font-medium text-xs sm:text-sm">
            Phone Number / WhatsApp
          </Label>
          <p className="text-xs text-gray-500">
            Used for the WhatsApp floating widget, phone cards, and footer calling link. Select your country code.
          </p>
          <div className="max-w-md">
            <PhoneInput
              id="global-phone"
              value={formData.phone}
              onChange={(val) => updateField("phone", val)}
              placeholder="(555) 000-0000"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="global-email" className="text-gray-700 font-medium text-xs sm:text-sm flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            Email Address
          </Label>
          <p className="text-xs text-gray-500">
            Business email displayed on contact cards and footer link.
          </p>
          <Input
            id="global-email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="contact@dnovagallery.com"
            className="max-w-md"
          />
        </div>

        {/* Location / City */}
        <div className="space-y-2 pt-2">
          <Label htmlFor="global-location" className="text-gray-700 font-medium text-xs sm:text-sm flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            Studio Location / City
          </Label>
          <p className="text-xs text-gray-500">
            Physical area or city where your photography studio operates.
          </p>
          <Input
            id="global-location"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Utah, US"
            className="max-w-md"
          />
        </div>
      </div>

      {/* Social Media Links Card */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            <Share2 className="h-4 w-4 text-primary" />
            <div>
              <h3 className="text-sm font-semibold">
                Social Media Channels ({formData.socialLinks.length})
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Add your social profiles. The Instagram profile link is automatically consumed by the floating Instagram widget.
              </p>
            </div>
          </div>
        </div>

        {formData.socialLinks.length > 0 && (
          <div className="space-y-3 pt-2">
            {formData.socialLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 border border-gray-100 rounded-lg bg-gray-50/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <Input
                    value={link.platform}
                    onChange={(e) =>
                      updateSocialLink(index, "platform", e.target.value)
                    }
                    placeholder="Platform (e.g., Instagram, Facebook)"
                    className="bg-white"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(index, "url", e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                    className="bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(index)}
                  className="h-9 w-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shrink-0"
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
          className="w-full border border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all inline-flex items-center justify-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Social Profile
        </button>
      </div>
    </div>
  );
}
