/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.untappd.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 