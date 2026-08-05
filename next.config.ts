import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH;

// If GITHUB_REPOSITORY is present (e.g. "BhaveshBasrani/Brindavanam"), extract repo name "/Brindavanam"
const githubRepoPath = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '/Brindavanam';

const basePath = rawBasePath !== undefined 
  ? rawBasePath 
  : (isProd ? githubRepoPath : '');

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
};

export default nextConfig;

