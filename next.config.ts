import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: 'image.tmdb.org' }],
    qualities: [100, 25, 50, 70, 75, 95]
  },
};

export default nextConfig;
