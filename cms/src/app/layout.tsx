import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/common/Sidebar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Photographer CMS",
  description: "Static CMS UI (no functionality)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <div className="min-h-dvh grid grid-rows-[auto_1fr]">
          {/* Header minimal */}
          <header className="border-b bg-background h-12 flex items-center px-4 text-sm text-muted-foreground">
            Photographer CMS
          </header>
          <div className="grid grid-cols-[256px_1fr]">
            <Sidebar />
            <main className="p-2 sm:p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
