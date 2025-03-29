import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  swcMinify: true,
  images: {
    unoptimized: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
