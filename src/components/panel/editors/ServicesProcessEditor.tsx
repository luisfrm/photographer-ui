"use client";

import { useState, useRef, useCallback } from "react";
import { Save, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { saveServicesProcessLocaleContent } from "@/app/panel/actions";
import type {
  CmsServicesProcessContent,
  CmsServicesProcessLocale,
  Locale,
} from "@/types/cms";
import { LOCALES, LOCALE_NAMES } from "@/types/cms";

type ServicesProcessEditorProps = {
  initialData?: CmsServicesProcessContent;
};

type Step = {
  title: string;
  description: string;
  number?: number;
};

const emptyStep = (): Step => ({ title: "", description: "" });

const emptyLocale = (): CmsServicesProcessLocale => ({
  title: "",
  steps: [],
});

export default function ServicesProcessEditor({
  initialData,
}: ServicesProcessEditorProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [localeForms, setLocaleForms] = useState<
    Record<Locale, CmsServicesProcessLocale>
  >(() => {
    const toForm = (l?: CmsServicesProcessLocale): CmsServicesProcessLocale =>
      l
        ? {
            title: l.title,
            subtitle: l.subtitle,
            steps: l.steps.length
              ? l.steps.map((s) => ({ title: s.title, description: s.description, number: s.number }))
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

  const handleAddStep = useCallback(() => {
    setLocaleForms((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        steps: [...prev[activeLocale].steps, emptyStep()],
      },
    }));
  }, [activeLocale]);

  const handleRemoveStep = useCallback(
    (index: number) => {
      if (!window.confirm("Remove this step?")) return;
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          steps: prev[activeLocale].steps.filter((_, i) => i !== index),
        },
      }));
    },
    [activeLocale]
  );

  const updateStep = useCallback(
    <K extends keyof Step>(index: number, field: K, value: Step[K]) => {
      setLocaleForms((prev) => ({
        ...prev,
        [activeLocale]: {
          ...prev[activeLocale],
          steps: prev[activeLocale].steps.map((s, i) =>
            i === index ? { ...s, [field]: value } : s
          ),
        },
      }));
    },
    [activeLocale]
  );

  const updateStepField = useCallback(
    (index: number, field: "title" | "description", value: string) => {
      updateStep(index, field, value);
    },
    [updateStep]
  );

  const handleSave = async () => {
    setIsSaving(true);

    const current = localeForms[activeLocale];

    const cleanedSteps: Step[] = current.steps
      .filter((s) => s.title.trim() || s.description.trim())
      .map((s) => ({ title: s.title, description: s.description }));

    // Number is auto-derived from index
    const data: CmsServicesProcessLocale = {
      title: current.title,
      subtitle: current.subtitle || undefined,
      steps: cleanedSteps.map((s, i) => ({ number: i + 1, ...s })),
    };

    const result = await saveServicesProcessLocaleContent(activeLocale, data);

    if (result.error) {
      toast.error(`Failed to save ${LOCALE_NAMES[activeLocale]}: ${result.error}`);
    } else {
      const newForms = { ...localeForms, [activeLocale]: data };
      initialRef.current = JSON.stringify(newForms);
      setLocaleForms(newForms);
      toast.success(`${LOCALE_NAMES[activeLocale]} process saved!`);
    }

    setIsSaving(false);
  };

  const current = localeForms[activeLocale];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Our Process</h2>
        <p className="text-sm text-gray-500">
          Manage the step-by-step process shown on the services page
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Step numbers are assigned automatically.{" "}
          <span className="text-green-500">
            {current.steps.length} {current.steps.length === 1 ? "step" : "steps"} in {LOCALE_NAMES[activeLocale]}
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
          <Label htmlFor="process-title" className="text-gray-700 font-medium">
            Section Title
          </Label>
          <Input
            id="process-title"
            value={current.title}
            onChange={(e) =>
              setLocaleForms((prev) => ({
                ...prev,
                [activeLocale]: { ...prev[activeLocale], title: e.target.value },
              }))
            }
            placeholder="e.g., Our Process"
            className="max-w-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="process-subtitle" className="text-gray-700">
            Subtitle{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="process-subtitle"
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
            placeholder="e.g., From first contact to final delivery"
            className="max-w-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        {current.steps.map((step, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 rounded-lg bg-white space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  Step {index + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStep(index)}
                className="h-7 w-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                aria-label="Remove step"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`step-title-${index}`} className="text-gray-700">
                Title
              </Label>
              <Input
                id={`step-title-${index}`}
                value={step.title}
                onChange={(e) => updateStep(index, "title", e.target.value)}
                placeholder="e.g., Consultation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`step-desc-${index}`} className="text-gray-700">
                Description
              </Label>
              <Textarea
                id={`step-desc-${index}`}
                value={step.description}
                onChange={(e) => updateStep(index, "description", e.target.value)}
                placeholder="e.g., We discuss your vision..."
                rows={2}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddStep}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-8 w-8 text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">Add Step</span>
        </button>
      </div>
    </div>
  );
}
