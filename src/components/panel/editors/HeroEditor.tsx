"use client";

import { useState } from "react";
import { Save, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ImageUpload from "@/components/panel/ImageUpload";
import { saveHeroContent, type HeroContent } from "@/app/panel/actions";

type HeroEditorProps = {
  initialData?: {
    title?: string;
    subtitle?: string;
    cta?: string;
    ctaUrl?: string;
    ctaNewTab?: boolean;
    backgroundImage1?: string;
    backgroundImage2?: string;
  };
};

export default function HeroEditor({ initialData }: HeroEditorProps) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    cta: initialData?.cta || "",
    ctaUrl: initialData?.ctaUrl || "/contact",
    ctaNewTab: initialData?.ctaNewTab ?? false,
    backgroundImage1: initialData?.backgroundImage1 || "",
    backgroundImage2: initialData?.backgroundImage2 || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const payload: HeroContent = {
      title: form.title,
      subtitle: form.subtitle,
      cta: form.cta,
      ctaUrl: form.ctaUrl,
      ctaNewTab: form.ctaNewTab,
      backgroundImage1: form.backgroundImage1,
      backgroundImage2: form.backgroundImage2,
    };

    const result = await saveHeroContent(payload);

    if (result.error) {
      toast.error(`Failed to save: ${result.error}`);
    } else {
      toast.success("Hero content saved successfully!");
      setHasChanges(false);
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
          <p className="text-sm text-gray-500">
            Edit the main hero section of your homepage
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/", "_blank")}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
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
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-6">
        {/* Background Images */}
        <div className="space-y-4">
          <Label className="text-gray-700">Background Images</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Image 1 (Left)</p>
              <ImageUpload
                value={form.backgroundImage1}
                onChange={(url) => handleChange("backgroundImage1", url)}
                category="hero"
                aspectRatio="video"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Image 2 (Right)</p>
              <ImageUpload
                value={form.backgroundImage2}
                onChange={(url) => handleChange("backgroundImage2", url)}
                category="hero"
                aspectRatio="video"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Upload two images that will be displayed side by side in the hero section
          </p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="hero-title" className="text-gray-700">
            Title
          </Label>
          <Input
            id="hero-title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter hero title"
            className="max-w-xl"
          />
          <p className="text-xs text-gray-500">
            The main heading displayed on the hero section
          </p>
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label htmlFor="hero-subtitle" className="text-gray-700">
            Subtitle
          </Label>
          <Textarea
            id="hero-subtitle"
            value={form.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Enter hero subtitle"
            rows={3}
            className="max-w-xl"
          />
          <p className="text-xs text-gray-500">
            Supports HTML tags like &lt;strong&gt;, &lt;em&gt;, &lt;br/&gt; for formatting
          </p>
        </div>

        {/* CTA Button Text */}
        <div className="space-y-2">
          <Label htmlFor="hero-cta" className="text-gray-700">
            Call to Action Button Text
          </Label>
          <Input
            id="hero-cta"
            value={form.cta}
            onChange={(e) => handleChange("cta", e.target.value)}
            placeholder="e.g., Book a session"
            className="max-w-xl"
          />
          <p className="text-xs text-gray-500">
            Text displayed on the main action button
          </p>
        </div>

        {/* CTA URL */}
        <div className="space-y-2">
          <Label htmlFor="hero-cta-url" className="text-gray-700">
            Call to Action URL
          </Label>
          <Input
            id="hero-cta-url"
            value={form.ctaUrl}
            onChange={(e) => handleChange("ctaUrl", e.target.value)}
            placeholder="e.g., /contact or https://example.com"
            className="max-w-xl"
          />
          <p className="text-xs text-gray-500">
            Where the button links to. Use relative paths (e.g., /contact) for internal pages
          </p>
        </div>

        {/* Open in new tab checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="hero-cta-new-tab"
            checked={form.ctaNewTab}
            onCheckedChange={(checked) => handleChange("ctaNewTab", checked === true)}
          />
          <Label htmlFor="hero-cta-new-tab" className="text-gray-700 cursor-pointer">
            Open link in a new tab
          </Label>
        </div>

        {/* Preview */}
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Preview
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
              {form.title || "Your Title Here"}
            </h1>
            <p
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: form.subtitle || "Your subtitle will appear here..."
              }}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" disabled>
                {form.cta || "Button Text"}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              URL: {form.ctaUrl || "/contact"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
