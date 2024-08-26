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
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "uat.rigelsoft.com",
      },
      {
        protocol: "https",
        hostname: "sit.rigelsoft.com",
      },
      {
        protocol: "https",
        hostname: "services.lyfngo.com",
      },
      {
        protocol: "https",
        hostname: "lyfngo.com",
      },
      {
        protocol: "https",
        hostname: "d1cdqhtb2bf9h4.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
