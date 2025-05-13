/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 优化页面导航加载
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  }
};

module.exports = nextConfig;
