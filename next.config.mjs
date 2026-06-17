/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/event_database',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: '/event_database', 
};

export default nextConfig;
