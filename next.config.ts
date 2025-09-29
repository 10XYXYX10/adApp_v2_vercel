import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // '1mb', '4mb', '5mb' などの文字列、または数値 (bytes) でも指定可能
      bodySizeLimit: '5mb',
    }
  },
  images: {
    //絶対pathで表示できる
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-7414a177cb1243efaa1f1d269e3df215.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false, // StrictMode無効化. 開発環境でuseEffect2回走るの防止.
};

export default nextConfig;
