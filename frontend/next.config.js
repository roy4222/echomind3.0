/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/:path*'
      },
      {
        source: '/upload',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL + '/upload'
      }
    ];
  }
};

module.exports = nextConfig; 