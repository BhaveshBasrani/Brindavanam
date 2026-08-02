import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Custom Domain (brindavanam.rendervoid.xyz) requires root-relative paths ('')
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
};

export default nextConfig;
