"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  User,
  Briefcase,
  Mail,
  ChevronRight,
  Settings,
  Palette,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import HeroEditor from "@/components/panel/editors/HeroEditor";
import CarouselEditor from "@/components/panel/editors/CarouselEditor";
import AboutEditor from "@/components/panel/editors/AboutEditor";
import GalleryEditor from "@/components/panel/editors/GalleryEditor";
import ServicesMetaEditor from "@/components/panel/editors/ServicesMetaEditor";
import ServicesPackagesEditor from "@/components/panel/editors/ServicesPackagesEditor";
import ServicesIncludedEditor from "@/components/panel/editors/ServicesIncludedEditor";
import ServicesProcessEditor from "@/components/panel/editors/ServicesProcessEditor";
import ServicesFaqEditor from "@/components/panel/editors/ServicesFaqEditor";
import ContactInfoEditor from "@/components/panel/editors/ContactInfoEditor";
import GeneralEditor from "@/components/panel/editors/GeneralEditor";
import {
  getHeroContent,
  getCarouselContent,
  getAboutContent,
  getGalleryContent,
  getServicesMeta,
  getServicesPackages,
  getServicesIncluded,
  getServicesProcess,
  getServicesFaq,
  getContactInfo,
  getGeneral,
} from "@/app/panel/actions";
import type { CmsImage, CmsSectionKey } from "@/types/cms";

// ─── Section registry ──────────────────────────────────────

type ContentSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  subsections: { id: string; name: string }[];
};

const contentSections: ContentSection[] = [
  {
    id: "global",
    title: "Global",
    icon: <Globe className="h-5 w-5" />,
    description: "Brand identity shared across the site",
    subsections: [{ id: "general", name: "General" }],
  },
  {
    id: "home",
    title: "Home",
    icon: <FileText className="h-5 w-5" />,
    description: "Manage homepage sections",
    subsections: [
      { id: "hero", name: "Hero" },
      { id: "carousel", name: "Infinite Carousel" },
      { id: "about", name: "About" },
      { id: "gallery", name: "Gallery" },
    ],
  },
  {
    id: "services",
    title: "Services",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Manage packages and services (single source of truth)",
    subsections: [
      { id: "meta", name: "Page Meta" },
      { id: "packages", name: "Packages" },
      { id: "included", name: "What's Included" },
      { id: "process", name: "Our Process" },
      { id: "faq", name: "FAQ" },
    ],
  },
  {
    id: "about",
    title: "About",
    icon: <User className="h-5 w-5" />,
    description: "Manage about page content",
    subsections: [
      { id: "hero", name: "Hero" },
      { id: "story", name: "My Story" },
      { id: "approach", name: "My Approach" },
      { id: "testimonials", name: "Testimonials" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    icon: <Mail className="h-5 w-5" />,
    description: "Manage contact page and form",
    subsections: [
      { id: "info", name: "Contact Info" },
      { id: "scheduling", name: "Scheduling" },
    ],
  },
];

/**
 * Map of fully-qualified section keys (e.g. "home.hero", "services.packages")
 * to their data loader. Adding a new section = add one entry here + one
 * case in `renderEditor` below.
 */
const loaders: Record<string, () => Promise<unknown>> = {
  "global.general": getGeneral,
  "home.hero": getHeroContent,
  "home.carousel": getCarouselContent,
  "home.about": getAboutContent,
  "home.gallery": getGalleryContent,
  "services.meta": getServicesMeta,
  "services.packages": getServicesPackages,
  "services.included": getServicesIncluded,
  "services.process": getServicesProcess,
  "services.faq": getServicesFaq,
  "contact.info": getContactInfo,
};

type DataMap = Record<string, unknown>;
const EMPTY_DATA: DataMap = {};

/**
 * Maps each section key to a skeleton variant for its initial load.
 * Editors are grouped into 3 visual categories so we don't need 9
 * separate skeleton definitions.
 */
type SkeletonVariant = "locale" | "locale-image" | "grid";
const SKELETON_VARIANTS: Record<string, SkeletonVariant> = {
  "global.general": "locale-image",
  "home.hero": "locale-image",
  "home.about": "locale-image",
  "home.carousel": "grid",
  "home.gallery": "grid",
  "services.meta": "locale",
  "services.packages": "locale",
  "services.included": "locale",
  "services.process": "locale",
  "services.faq": "locale",
  "contact.info": "locale",
};

// ─── Editor dispatch ───────────────────────────────────────

function renderEditor(key: string, data: unknown) {
  // Global
  if (key === "global.general")
    return <GeneralEditor initialData={data as never} />;

  // Home
  if (key === "home.hero") return <HeroEditor initialData={data as never} />;
  if (key === "home.carousel")
    return (
      <CarouselEditor
        initialData={(data as { images?: CmsImage[] } | undefined)?.images}
      />
    );
  if (key === "home.about") return <AboutEditor initialData={data as never} />;
  if (key === "home.gallery")
    return <GalleryEditor initialData={data as never} />;

  // Services
  if (key === "services.meta")
    return <ServicesMetaEditor initialData={data as never} />;
  if (key === "services.packages")
    return <ServicesPackagesEditor initialData={data as never} />;
  if (key === "services.included")
    return <ServicesIncludedEditor initialData={data as never} />;
  if (key === "services.process")
    return <ServicesProcessEditor initialData={data as never} />;
  if (key === "services.faq")
    return <ServicesFaqEditor initialData={data as never} />;

  // Contact
  if (key === "contact.info")
    return <ContactInfoEditor initialData={data as never} />;

  // Placeholder for unimplemented editors
  const [sectionId, subsectionId] = key.split(".");
  const sectionName = contentSections.find((s) => s.id === sectionId)?.title;
  const subsectionName = contentSections
    .find((s) => s.id === sectionId)
    ?.subsections.find((s) => s.id === subsectionId)?.name;

  return (
    <div className="text-center py-16">
      <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
        <Palette className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        {subsectionName} Editor
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        The editor for {sectionName} → {subsectionName} will be implemented next.
      </p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────

export default function ContentPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("home");
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Single data map keyed by full section key (e.g. "home.hero")
  const [data, setData] = useState<DataMap>(EMPTY_DATA);
  // Tracks which keys have already been loaded
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Build the active key
  const activeKey =
    selectedSectionId && selectedSubsection
      ? `${selectedSectionId}.${selectedSubsection}`
      : null;

  // Load data on selection
  useEffect(() => {
    if (!activeKey) return;
    if (loaded[activeKey]) return;

    const loader = loaders[activeKey];
    if (!loader) return;

    setLoaded((p) => ({ ...p, [activeKey]: true }));
    setIsLoadingContent(true);
    loader()
      .then((result) => {
        setData((p) => ({ ...p, [activeKey]: result }));
      })
      .finally(() => setIsLoadingContent(false));
  }, [activeKey, loaded]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleSubsectionClick = (sectionId: string, subsectionId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedSubsection(subsectionId);
  };

  const handleBack = () => {
    setSelectedSubsection(null);
    setSelectedSectionId(null);
    // Reset all loaded flags so re-entering any editor fetches fresh data
    setLoaded({});
  };

  // Find the selected section and subsection names for display
  const selectedSection = contentSections.find((s) => s.id === selectedSectionId);
  const selectedSubsectionData = selectedSection?.subsections.find(
    (s) => s.id === selectedSubsection
  );

  // Use viewKey to trigger the entrance animation when switching between
  // List View and Editor View. React unmounts and remounts the wrapper
  // when the key changes, replaying the `animate-in` keyframes.
  const viewKey = activeKey ?? "list";
  const showEditor =
    activeKey && selectedSection && selectedSubsectionData;

  return (
    <div
      key={viewKey}
      className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {showEditor ? (
        <>
          {/* Back button and breadcrumb */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Content
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{selectedSection.title}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">
                {selectedSubsectionData.name}
              </span>
            </div>
          </div>

          {/* Editor */}
          <div className="p-6 border border-gray-200 rounded-lg bg-white">
            {isLoadingContent ||
            (!data[activeKey] && loaders[activeKey]) ? (
              <EditorSkeleton
                variant={SKELETON_VARIANTS[activeKey] ?? "locale"}
              />
            ) : (
              renderEditor(activeKey, data[activeKey])
            )}
          </div>
        </>
      ) : (
        <>
          {/* List View */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Content
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your website content. Click on a section to expand and
              edit.
            </p>
          </div>

          {/* Info banner about Services */}
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Packages are managed in Services
                </p>
                <p className="text-sm text-gray-600">
                  The Services section is the single source of truth for all
                  packages. Packages shown on the Home page are automatically
                  synced from here.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-2">
            {contentSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isExpanded={expandedSection === section.id}
                onToggle={() => toggleSection(section.id)}
                onSubsectionClick={handleSubsectionClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Section Card (with animated expand/collapse) ─────────

function SectionCard({
  section,
  isExpanded,
  onToggle,
  onSubsectionClick,
}: {
  section: (typeof contentSections)[number];
  isExpanded: boolean;
  onToggle: () => void;
  onSubsectionClick: (sectionId: string, subsectionId: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 text-left transition-colors duration-300",
          isExpanded
            ? "bg-primary/5 border-b border-gray-200"
            : "hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              isExpanded
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-gray-600"
            )}
          >
            {section.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.description}</p>
          </div>
        </div>
        <ChevronRight
          data-state={isExpanded ? "open" : "closed"}
          className="h-5 w-5 text-gray-400 transition-transform duration-300 data-[state=open]:rotate-90"
        />
      </button>

      {/* Subsections — grid-rows trick para slide animado bidireccional */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden min-h-0">
          <div className="p-2">
            {section.subsections.map((subsection) => (
              <button
                key={subsection.id}
                type="button"
                onClick={() => onSubsectionClick(section.id, subsection.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Palette className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{subsection.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Editor Skeleton ──────────────────────────────────────

/**
 * Skeleton placeholder shown while an editor's initial data is loading
 * from Supabase. Three variants match the visual shape of the editor
 * categories: locale (text + tabs), locale-image (adds image upload),
 * grid (image grid like Gallery/Carousel).
 */
function EditorSkeleton({
  variant,
}: {
  variant: "locale" | "locale-image" | "grid";
}) {
  if (variant === "locale-image") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        {/* Image upload area */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        </div>
        {/* Locale tabs + fields */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full max-w-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full max-w-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full max-w-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full max-w-xl" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
        {/* Grid of images */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: locale variant (text fields + tabs, no image)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-3 w-56" />
      </div>
      {/* Tabs row + Save button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-9 w-32" />
      </div>
      {/* First field card */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full max-w-xl" />
      </div>
      {/* Locale fields card (title, description, cta, etc.) */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full max-w-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full max-w-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full max-w-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full max-w-xl" />
        </div>
      </div>
    </div>
  );
}
