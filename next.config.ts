import type { NextConfig } from "next";

// For custom domain deployments (e.g. brindavanam.rendervoid.xyz), basePath MUST be empty string ('').
// Only use a custom subpath if explicitly passed via environment variables (e.g., NEXT_PUBLIC_BASE_PATH).
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH ?? '';
const basePath = rawBasePath.endsWith('/') && rawBasePath !== '/' ? rawBasePath.slice(0, -1) : (rawBasePath === '/' ? '' : rawBasePath);

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  allowedDevOrigins: [
    '192.168.88.4',
  ],
};

export default nextConfig;


