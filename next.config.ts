import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true,
    // viewTransition: true,
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
