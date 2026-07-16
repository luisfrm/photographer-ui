import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración básica
  trailingSlash: false,
  // Next.js 16 requires explicit allowlist for images
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        // Cloudflare R2 public URLs (custom domain)
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        // Cloudflare R2 direct bucket URLs
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
