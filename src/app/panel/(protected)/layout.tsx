import PanelSidebar from "@/components/panel/PanelSidebar";
import PanelBottomBar from "@/components/panel/PanelBottomBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PanelSidebar />
      <PanelBottomBar />
      
      {/* Main content area with sidebar offset on desktop */}
      <main className="lg:ml-64 pb-16 lg:pb-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}