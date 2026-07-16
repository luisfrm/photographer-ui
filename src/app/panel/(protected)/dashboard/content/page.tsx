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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeroEditor from "@/components/panel/editors/HeroEditor";
import { getHeroContent } from "@/app/panel/actions";
import type { CmsHeroContent } from "@/types/cms";

type ContentSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  subsections: { id: string; name: string }[];
};

const contentSections: ContentSection[] = [
  {
    id: "home",
    title: "Home",
    icon: <FileText className="h-5 w-5" />,
    description: "Manage homepage sections",
    subsections: [
      { id: "hero", name: "Hero" },
      { id: "carousel", name: "Infinite Carousel" },
      { id: "about-preview", name: "About Preview" },
      { id: "gallery", name: "Gallery" },
      { id: "pricing", name: "Pricing (from Services)" },
      { id: "contact-preview", name: "Contact Preview" },
    ],
  },
  {
    id: "services",
    title: "Services",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Manage packages and services (single source of truth)",
    subsections: [
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
      { id: "form", name: "Form Configuration" },
      { id: "scheduling", name: "Scheduling" },
    ],
  },
];

function renderEditor(
  sectionId: string,
  subsectionId: string,
  heroData: CmsHeroContent | null
) {
  // Home > Hero
  if (sectionId === "home" && subsectionId === "hero") {
    return <HeroEditor initialData={heroData ?? undefined} />;
  }

  // Placeholder for other editors
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

export default function ContentPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("home");
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<CmsHeroContent | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const heroLoadedRef = useRef(false);

  // Load hero data when Hero editor is selected
  useEffect(() => {
    if (
      selectedSectionId === "home" &&
      selectedSubsection === "hero" &&
      !heroLoadedRef.current
    ) {
      heroLoadedRef.current = true;
      setIsLoadingContent(true);
      getHeroContent().then((data) => {
        setHeroData(data);
        setIsLoadingContent(false);
      });
    }
  }, [selectedSectionId, selectedSubsection]);

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
  };

  // Find the selected section and subsection names for display
  const selectedSection = contentSections.find((s) => s.id === selectedSectionId);
  const selectedSubsectionData = selectedSection?.subsections.find(
    (s) => s.id === selectedSubsection
  );

  // Editor View - when a subsection is selected
  if (selectedSubsection && selectedSection && selectedSubsectionData) {
    return (
      <div className="max-w-4xl">
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
          {isLoadingContent ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 text-primary animate-spin mr-3" />
              <span className="text-sm text-gray-500">Loading content...</span>
            </div>
          ) : (
            renderEditor(selectedSectionId!, selectedSubsection, heroData)
          )}
        </div>
      </div>
    );
  }

  // List View - section selection
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Content</h1>
        <p className="text-gray-500 mt-2">
          Manage your website content. Click on a section to expand and edit.
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
              The Services section is the single source of truth for all packages.
              Packages shown on the Home page are automatically synced from here.
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-2">
        {contentSections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 text-left transition-colors duration-200",
                expandedSection === section.id
                  ? "bg-primary/5 border-b border-gray-200"
                  : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    expandedSection === section.id
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
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-200",
                  expandedSection === section.id && "rotate-90"
                )}
              />
            </button>

            {/* Subsections */}
            {expandedSection === section.id && (
              <div className="p-2">
                {section.subsections.map((subsection) => (
                  <button
                    key={subsection.id}
                    type="button"
                    onClick={() =>
                      handleSubsectionClick(section.id, subsection.id)
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{subsection.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
