/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
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
    // 確保 API URL 在編譯時有默認值
    const apiBaseUrl = 'https://echomind-api.roy422roy.workers.dev';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`
      },
      {
        source: '/upload',
        destination: `${apiBaseUrl}/api/upload`
      }
    ];
  }
};

module.exports = nextConfig; 