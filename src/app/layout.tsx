import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { getBaseUrl } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "DnovaGallery | Portrait & Event Photography in Utah",
    template: "%s | DnovaGallery",
  },
  description:
    "Capture timeless, natural portraits and intimate events in Utah with Darianny Salas. Guided posing, magazine-quality editing, and fast turnaround.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon_apple.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    type: "website",
    siteName: "DnovaGallery",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${geistMono.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        {children}
        <Toaster richColors position="top-center" />
        <Script
          src="https://assets.onedollarstats.com/stonks.js"
          strategy="afterInteractive"
          defer
        />
      </body>
    </html>
  );
}
