/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "java-files.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    env: {
      NEXT_PUBLIC_API_PROFILE: process.env.NEXT_PUBLIC_API_PROFILE,
      NEXT_PUBLIC_HEADER_ACCESS: process.env.NEXT_PUBLIC_HEADER_ACCESS,
      NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  },
};

export default nextConfig;
