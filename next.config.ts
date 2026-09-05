import type { NextConfig } from "next";
import path from "path";

const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/juejing" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isPages ? "export" : "standalone",
  trailingSlash: isPages,
  images: { unoptimized: true },
  basePath,
  assetPrefix: isPages ? "/juejing/" : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
