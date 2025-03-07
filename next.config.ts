import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "usxu4ra582.ufs.sh",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
