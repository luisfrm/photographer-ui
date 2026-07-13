import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración básica
  trailingSlash: false,
  // Next.js 16 requires explicit allowlist for local images
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
