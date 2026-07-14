import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel - DnovaGallery",
  description: "Admin panel for DnovaGallery",
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}