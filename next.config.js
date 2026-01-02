/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // Set to false to catch type errors
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
