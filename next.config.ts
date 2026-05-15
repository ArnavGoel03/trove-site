import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Tree-shake motion + lucide icon imports so we don't ship the
  // whole icon set or the full motion library to the client.
  experimental: {
    optimizePackageImports: ["motion", "lucide-react"],
  },
};

export default nextConfig;
