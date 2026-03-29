import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/app/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        destination: "/app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
