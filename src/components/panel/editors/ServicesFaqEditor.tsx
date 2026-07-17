"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveServicesFaqLocaleContent } from "@/app/panel/actions";
import type {
  CmsServicesFaqContent,
  CmsServicesFaqLocale,
  CmsFaqItem,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type ServicesFaqEditorProps = {
  initialData?: CmsServicesFaqContent;
};

const emptyItem = (): CmsFaqItem => ({ question: "", answer: "" });

const emptyLocale = (): CmsServicesFaqLocale => ({
  title: "",
  items: [],
});

export default function ServicesFaqEditor({ initialData }: ServicesFaqEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsServicesFaqLocale>
  >(() => {
    const toForm = (l?: CmsServicesFaqLocale): CmsServicesFaqLocale =>
      l
        ? {
            title: l.title,
            subtitle: l.subtitle,
            items: l.items.length
              ? l.items.map((i) => ({ question: i.question, answer: i.answer }))
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

  const handleAddItem = useCallback(() => {
    setLocaleForms((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        items: [...prev[activeLocale].items, emptyItem()],
      },
    }));
  }, [activeLocale]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      if (!window.confirm("Remove this question?")) return;
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
    <K extends keyof CmsFaqItem>(
      index: number,
      field: K,
      value: CmsFaqItem[K]
    ) => {
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

  const handleSave = async () => {
    setIsSaving(true);

    const current = localeForms[activeLocale];

    const cleaned: CmsFaqItem[] = current.items
      .filter((it) => it.question.trim() || it.answer.trim())
      .map((it) => ({ question: it.question, answer: it.answer }));

    const data: CmsServicesFaqLocale = {
      title: current.title,
      subtitle: current.subtitle || undefined,
      items: cleaned,
    };

    const result = await saveServicesFaqLocaleContent(activeLocale, data);

    if (result.error) {
      toast.error(`Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`);
    } else {
      const newForms = { ...localeForms, [activeLocale]: data };
      initialRef.current = JSON.stringify(newForms);
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} FAQ saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
        <p className="text-sm text-gray-500">
          Manage the frequently asked questions on the services page
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="text-green-500">
            {current.items.length} {current.items.length === 1 ? "question" : "questions"} in {LOCALE_NAMES[activeLocale]}
          </span>
        </p>
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
          <Label htmlFor="faq-title" className="text-gray-700 font-medium">
            Section Title
          </Label>
          <Input
            id="faq-title"
            value={current.title}
            onChange={(e) =>
              setLocaleForms((prev) => ({
                ...prev,
                [activeLocale]: { ...prev[activeLocale], title: e.target.value },
              }))
            }
            placeholder="e.g., Frequently Asked Questions"
            className="max-w-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faq-subtitle" className="text-gray-700">
            Subtitle{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="faq-subtitle"
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
            placeholder="e.g., Common questions about our services"
            className="max-w-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        {current.items.map((item, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 rounded-lg bg-white space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Question {index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="h-7 w-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                aria-label="Remove question"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`faq-q-${index}`} className="text-gray-700">
                Question
              </Label>
              <Input
                id={`faq-q-${index}`}
                value={item.question}
                onChange={(e) => updateItem(index, "question", e.target.value)}
                placeholder="e.g., How far in advance should I book?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`faq-a-${index}`} className="text-gray-700">
                Answer
              </Label>
              <Textarea
                id={`faq-a-${index}`}
                value={item.answer}
                onChange={(e) => updateItem(index, "answer", e.target.value)}
                placeholder="e.g., We recommend booking at least 2-3 weeks in advance..."
                rows={3}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-8 w-8 text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">Add Question</span>
        </button>
      </div>
    </div>
  );
}
