/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/event_database',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/event_database', 
  assetPrefix: '/event_database', 
};

export default nextConfig;
