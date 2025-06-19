/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow embedding in iframes for Wix integration
  async headers() {
    return [
      {
        source: '/display/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *.wix.com *.wixsite.com;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 