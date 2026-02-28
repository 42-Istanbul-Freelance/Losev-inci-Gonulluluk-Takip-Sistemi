/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "newpageapi.losev.org.tr",
      },
    ],
  },
};

module.exports = nextConfig;
