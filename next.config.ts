import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true, 
  serverExternalPackages: ['powershell-utils'], 
  experimental: {
    optimizePackageImports: ["recharts"],
  },
};

export default nextConfig;