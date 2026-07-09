import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile exists in ~/dev; pin the workspace root to this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
