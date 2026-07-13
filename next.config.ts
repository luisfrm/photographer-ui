import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración básica
  trailingSlash: false,
  // Next.js 16 requires explicit allowlist for local images with query strings
  // (used by Pricing.tsx for /placeholder.svg?height=...&width=...&text=...)
  images: {
    localPatterns: [
      {
        pathname: "/placeholder.svg",
        search: "?height=*&width=*&text=*",
      },
    ],
  },
};

export default nextConfig;
