import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // Use http for localhost
        hostname: "localhost", // Allow images from localhost
        pathname: "/uploads/**", // Restrict to a specific folder if needed
      },
      {
        protocol: "https",
        hostname: "*", // Allow all domains over HTTPS
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
