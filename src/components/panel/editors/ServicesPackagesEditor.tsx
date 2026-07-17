"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2, Plus, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveServicesPackagesLocaleContent } from "@/app/panel/actions";
import type {
  CmsServicesPackagesContent,
  CmsServicesPackagesLocale,
  CmsServicePackage,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

const MAX_PACKAGES = 3;
const MAX_FEATURES = 10;

type ServicesPackagesEditorProps = {
  initialData?: CmsServicesPackagesContent;
};

const emptyPackage = (): CmsServicePackage => ({
  name: "",
  price: "",
  description: "",
  features: [""],
  popular: false,
});

const emptyLocale = (): CmsServicesPackagesLocale => ({
  title: "",
  packages: [],
});

export default function ServicesPackagesEditor({
  initialData,
}: ServicesPackagesEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsServicesPackagesLocale>
  >(() => ({
    en: initialData?.locales?.en
      ? {
          title: initialData.locales.en.title,
          packages: initialData.locales.en.packages.length
            ? initialData.locales.en.packages.map((p) => ({
                name: p.name,
                price: p.price,
                description: p.description,
                features: p.features.length ? p.features : [""],
                popular: p.popular ?? false,
              }))
            : [],
        }
      : emptyLocale(),
    es: initialData?.locales?.es
      ? {
          title: initialData.locales.es.title,
          packages: initialData.locales.es.packages.length
            ? initialData.locales.es.packages.map((p) => ({
                name: p.name,
                price: p.price,
                description: p.description,
                features: p.features.length ? p.features : [""],
                popular: p.popular ?? false,
              }))
            : [],
        }
      : emptyLocale(),
  }));
  const initialRef = useRef(JSON.stringify(localeForms));
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(localeForms) !== initialRef.current;

  // ─── Locale-level handlers ───────────────────────────────

  const handleLocaleChange = useCallback(
    (field: keyof CmsServicesPackagesLocale, value: CmsServicesPackagesLocale[keyof CmsServicesPackagesLocale]) => {
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

  // ─── Package-level handlers ──────────────────────────────

  const handleAddPackage = useCallback(() => {
    setLocaleForms((prev) => {
      const current = prev[activeLocale];
      if (current.packages.length >= MAX_PACKAGES) {
        toast.error(`Maximum ${MAX_PACKAGES} packages allowed`);
        return prev;
      }
      return {
        ...prev,
        [activeLocale]: {
          ...current,
          packages: [...current.packages, emptyPackage()],
        },
      };
    });
  }, [activeLocale]);

  const handleRemovePackage = useCallback(
    (index: number) => {
      if (!window.confirm("Remove this package?")) return;
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          packages: prev[activeLocale].packages.filter((_, i) => i !== index),
        },
      }));
    },
    [activeLocale]
  );

  const updatePackage = useCallback(
    <K extends keyof CmsServicePackage>(
      index: number,
      field: K,
      value: CmsServicePackage[K]
    ) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          packages: prev[activeLocale].packages.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
          ),
        },
      }));
    },
    [activeLocale]
  );

  // ─── Feature-level handlers ──────────────────────────────

  const handleAddFeature = useCallback(
    (packageIndex: number) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          packages: prev[activeLocale].packages.map((p, i) => {
            if (i !== packageIndex) return p;
            if (p.features.length >= MAX_FEATURES) {
              toast.error(`Maximum ${MAX_FEATURES} features per package`);
              return p;
            }
            return { ...p, features: [...p.features, ""] };
          }),
        },
      }));
    },
    [activeLocale]
  );

  const handleRemoveFeature = useCallback(
    (packageIndex: number, featureIndex: number) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          packages: prev[activeLocale].packages.map((p, i) =>
            i === packageIndex
              ? { ...p, features: p.features.filter((_, j) => j !== featureIndex) }
              : p
          ),
        },
      }));
    },
    [activeLocale]
  );

  const updateFeature = useCallback(
    (packageIndex: number, featureIndex: number, value: string) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          packages: prev[activeLocale].packages.map((p, i) =>
            i === packageIndex
              ? {
                  ...p,
                  features: p.features.map((f, j) =>
                    j === featureIndex ? value : f
                  ),
                }
              : p
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

    // Clean packages: strip empty features and fully empty packages
    const cleaned: CmsServicePackage[] = current.packages
      .filter((p) => p.name.trim() || p.price.trim() || p.description.trim())
      .map((p) => ({
        ...p,
        features: p.features.filter((f) => f.trim()),
      }));

    const data: CmsServicesPackagesLocale = {
      title: current.title,
      packages: cleaned,
    };

    const result = await saveServicesPackagesLocaleContent(activeLocale, data);

    if (result.error) {
      toast.error(`Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`);
    } else {
      // Update state with cleaned data
      const newForms = {
        ...localeForms,
        [activeLocale]: data,
      };
      initialRef.current = JSON.stringify(newForms);
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} packages saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Services Packages</h2>
        <p className="text-sm text-gray-500">
          Manage the pricing packages shown on the services page and home
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Maximum {MAX_PACKAGES} packages, {MAX_FEATURES} features each.
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
        <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save {LOCALE_NAMES[activeLocale]}
        </Button>
      </div>

      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-2">
        <Label htmlFor="packages-title" className="text-gray-700 font-medium">
          Section Title
        </Label>
        <Input
          id="packages-title"
          value={current.title}
          onChange={(e) => handleLocaleChange("title", e.target.value)}
          placeholder="e.g., Our Packages"
          className="max-w-xl"
        />
      </div>

      <div className="space-y-4">
        <p className="text-xs text-gray-500">
          {current.packages.length}/{MAX_PACKAGES} packages in {LOCALE_NAMES[activeLocale]}
        </p>
        {current.packages.map((pkg, index) => (
          <PackageCard
            key={index}
            package={pkg}
            index={index}
            onChange={updatePackage}
            onRemove={() => handleRemovePackage(index)}
            onAddFeature={() => handleAddFeature(index)}
            onRemoveFeature={(fi) => handleRemoveFeature(index, fi)}
            onUpdateFeature={(fi, value) => updateFeature(index, fi, value)}
          />
        ))}

        <button
          type="button"
          onClick={handleAddPackage}
          disabled={current.packages.length >= MAX_PACKAGES}
          className="w-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-8 w-8 text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">
            Add Package ({current.packages.length}/{MAX_PACKAGES})
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Package Card Sub-Component ─────────────────────────────

type PackageCardProps = {
  package: CmsServicePackage;
  index: number;
  onChange: <K extends keyof CmsServicePackage>(
    index: number,
    field: K,
    value: CmsServicePackage[K]
  ) => void;
  onRemove: () => void;
  onAddFeature: () => void;
  onRemoveFeature: (featureIndex: number) => void;
  onUpdateFeature: (featureIndex: number, value: string) => void;
};

function PackageCard({
  package: pkg,
  index,
  onChange,
  onRemove,
  onAddFeature,
  onRemoveFeature,
  onUpdateFeature,
}: PackageCardProps) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4 min-h-[200px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Package {index + 1}
          </span>
          {pkg.popular && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">
              <Star className="h-3 w-3 fill-current" />
              Most Popular
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="h-7 w-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          aria-label="Remove package"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`pkg-name-${index}`} className="text-gray-700">
            Name
          </Label>
          <Input
            id={`pkg-name-${index}`}
            value={pkg.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            placeholder="e.g., Premium Package"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`pkg-price-${index}`} className="text-gray-700">
            Price
          </Label>
          <Input
            id={`pkg-price-${index}`}
            value={pkg.price}
            onChange={(e) => onChange(index, "price", e.target.value)}
            placeholder="e.g., $100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`pkg-desc-${index}`} className="text-gray-700">
          Description
        </Label>
        <Textarea
          id={`pkg-desc-${index}`}
          value={pkg.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          placeholder="e.g., 10 edited photos"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-3">
        <Checkbox
          id={`pkg-popular-${index}`}
          checked={pkg.popular}
          onCheckedChange={(checked) =>
            onChange(index, "popular", checked === true)
          }
        />
        <Label
          htmlFor={`pkg-popular-${index}`}
          className="text-gray-700 cursor-pointer"
        >
          Mark as Most Popular (highlights this package on the public site)
        </Label>
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700 font-medium">
            Features ({pkg.features.length}/{MAX_FEATURES})
          </Label>
        </div>
        <div className="space-y-2">
          {pkg.features.map((feature, fi) => (
            <div key={fi} className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => onUpdateFeature(fi, e.target.value)}
                placeholder={`Feature ${fi + 1}`}
              />
              <button
                type="button"
                onClick={() => onRemoveFeature(fi)}
                className="h-9 w-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex-shrink-0"
                aria-label="Remove feature"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddFeature}
            disabled={pkg.features.length >= MAX_FEATURES}
            className="w-full border border-dashed border-gray-300 rounded py-2 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Feature
          </button>
        </div>
      </div>
    </div>
  );
}
