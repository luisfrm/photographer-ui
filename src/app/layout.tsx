import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Widgets from "@/components/common/Widgets";

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
  title: "Photographer Studio",
  description: "Photographer Studio",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon_apple.ico",
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
        className={`${montserrat.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <Widgets />
      </body>
    </html>
  );
}
