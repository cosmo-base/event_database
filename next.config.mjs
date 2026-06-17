/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/member_only', 
  assetPrefix: '/member_only', 
};

export default nextConfig;
