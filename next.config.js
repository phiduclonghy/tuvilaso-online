/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lunar-javascript'],
  output: 'export',
  trailingSlash: true,
  // GitHub Pages chạy ở đường dẫn con (vd: user.github.io/ten-repo/)
  // → cần basePath. Locally (dev) NEXT_PUBLIC_BASE_PATH rỗng nên không ảnh hưởng.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
};

module.exports = nextConfig;
