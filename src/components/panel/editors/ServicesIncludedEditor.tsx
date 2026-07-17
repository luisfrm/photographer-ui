"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Save, Loader2, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveServicesIncludedLocaleContent } from "@/app/panel/actions";
import {
  SERVICES_ICONS,
  SERVICES_ICON_NAMES,
  type ServicesIconName,
} from "@/lib/cms-icons";
import type {
  CmsServicesIncludedContent,
  CmsServicesIncludedLocale,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

const MAX_ITEMS = 3;

type ServicesIncludedEditorProps = {
  initialData?: CmsServicesIncludedContent;
};

type Item = {
  icon?: string;
  title: string;
  description: string;
};

const emptyItem = (): Item => ({ icon: "Camera", title: "", description: "" });

const emptyLocale = (): CmsServicesIncludedLocale => ({
  title: "",
  items: [],
});

export default function ServicesIncludedEditor({
  initialData,
}: ServicesIncludedEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsServicesIncludedLocale>
  >(() => {
    const toForm = (l?: CmsServicesIncludedLocale): CmsServicesIncludedLocale =>
      l
        ? {
            title: l.title,
            subtitle: l.subtitle,
            items: l.items.length
              ? l.items.map((i) => ({
                  icon: i.icon || "Camera",
                  title: i.title,
                  description: i.description,
                }))
              : [],
          }
        : emptyLocale();
    return {
      en: toForm(initialData?.locales?.en),
      es: toForm(initialData?.locales?.es),
    };
  });
  const initialRef = useRef(JSON.stringify(localeForms));
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(localeForms) !== initialRef.current;

  // ─── Item handlers (operate on active locale) ─────────────

  const handleAddItem = useCallback(() => {
    setLocaleForms((prev) => {
      const current = prev[activeLocale];
      if (current.items.length >= MAX_ITEMS) {
        toast.error(`Maximum ${MAX_ITEMS} items allowed`);
        return prev;
      }
      return {
        ...prev,
        [activeLocale]: {
          ...current,
          items: [...current.items, emptyItem()],
        },
      };
    });
  }, [activeLocale]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      if (!window.confirm("Remove this item?")) return;
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          items: prev[activeLocale].items.filter((_, i) => i !== index),
        },
      }));
    },
    [activeLocale]
  );

  const updateItem = useCallback(
    <K extends keyof Item>(index: number, field: K, value: Item[K]) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          items: prev[activeLocale].items.map((it, i) =>
            i === index ? { ...it, [field]: value } : it
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

    const cleaned: Item[] = current.items
      .filter((it) => it.title.trim() || it.description.trim())
      .map((it) => ({ ...it, icon: it.icon || "Camera" }));

    const data: CmsServicesIncludedLocale = {
      title: current.title,
      subtitle: current.subtitle || undefined,
      items: cleaned.map((it) => ({
        icon: it.icon,
        title: it.title,
        description: it.description,
      })),
    };

    const result = await saveServicesIncludedLocaleContent(activeLocale, data);

    if (result.error) {
      toast.error(`Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`);
    } else {
      const newForms = { ...localeForms, [activeLocale]: data };
      initialRef.current = JSON.stringify(newForms);
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} included saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">What&apos;s Included</h2>
        <p className="text-sm text-gray-500">
          Manage the 3 feature highlights on the services page
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Maximum {MAX_ITEMS} items.</p>
      </div>

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

      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="space-y-2">
          <Label htmlFor="included-title" className="text-gray-700 font-medium">
            Section Title
          </Label>
          <Input
            id="included-title"
            value={current.title}
            onChange={(e) =>
              setLocaleForms((prev) => ({
                ...prev,
                [activeLocale]: { ...prev[activeLocale], title: e.target.value },
              }))
            }
            placeholder="e.g., What's Included"
            className="max-w-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="included-subtitle" className="text-gray-700">
            Subtitle{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="included-subtitle"
            value={current.subtitle || ""}
            onChange={(e) =>
              setLocaleForms((prev) => ({
                ...prev,
                [activeLocale]: {
                  ...prev[activeLocale],
                  subtitle: e.target.value,
                },
              }))
            }
            placeholder="e.g., Everything you get with every session"
            className="max-w-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-gray-500">
          {current.items.length}/{MAX_ITEMS} items in {LOCALE_NAMES[activeLocale]}
        </p>
        {current.items.map((item, index) => (
          <ItemCard
            key={index}
            item={item}
            index={index}
            onChange={updateItem}
            onRemove={() => handleRemoveItem(index)}
          />
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          disabled={current.items.length >= MAX_ITEMS}
          className="w-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-8 w-8 text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">
            Add Item ({current.items.length}/{MAX_ITEMS})
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Item Card ─────────────────────────────────────────────

type ItemCardProps = {
  item: Item;
  index: number;
  onChange: <K extends keyof Item>(index: number, field: K, value: Item[K]) => void;
  onRemove: () => void;
};

function ItemCard({ item, index, onChange, onRemove }: ItemCardProps) {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4 min-h-[160px]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="h-7 w-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          aria-label="Remove item"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Icon</Label>
        <IconSelect
          value={item.icon}
          onChange={(value) => onChange(index, "icon", value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`included-title-${index}`} className="text-gray-700">
          Title
        </Label>
        <Input
          id={`included-title-${index}`}
          value={item.title}
          onChange={(e) => onChange(index, "title", e.target.value)}
          placeholder="e.g., Professional Equipment"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`included-desc-${index}`} className="text-gray-700">
          Description
        </Label>
        <Textarea
          id={`included-desc-${index}`}
          value={item.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          placeholder="e.g., High-end cameras, professional lighting..."
          rows={2}
        />
      </div>
    </div>
  );
}

// ─── Custom Icon Select ────────────────────────────────────

type IconSelectProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

function IconSelect({ value, onChange }: IconSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const safeValue = value ?? "Camera";
  const SelectedIcon = SERVICES_ICONS[safeValue as ServicesIconName] ?? SERVICES_ICONS.Camera;

  return (
    <div ref={ref} className="relative max-w-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:border-gray-400 transition-colors"
      >
          <span className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4 text-gray-700" />
            <span className="text-sm text-gray-900">{safeValue}</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
            {SERVICES_ICON_NAMES.map((name) => {
              const Icon = SERVICES_ICONS[name];
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    name === safeValue ? "bg-gray-50" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 text-gray-700" />
                  <span className="text-gray-900">{name}</span>
                </button>
              );
            })}
          </div>
        )}
    </div>
  );
}
