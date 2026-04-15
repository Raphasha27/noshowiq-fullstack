import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    // @ts-expect-error Next.js 15+ property not typed correctly
    appIsrStatus: false,
  },
};

export default nextConfig;
