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
      }
    ],
  }
};

export default nextConfig;
