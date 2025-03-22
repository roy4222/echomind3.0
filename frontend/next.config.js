import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // 這個配置會使應用程式產生靜態檔案
  // 注意：這會禁用 API 路由，但我們已經添加了備用回應機制
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_R2_ENDPOINT || '',
        pathname: '/**',
      }
    ],
  },
  // 環境變數配置
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.workers.dev',
  }
};

export default nextConfig;
