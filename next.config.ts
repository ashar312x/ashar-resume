import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: cPanel has no Node process, Apache serves the `out/` folder.
  output: "export",
  // No basePath: public_html/ahsuniqbal is the document root of ahsuniqbal.com,
  // so the site is served from `/`. The primarydomain.com/ahsuniqbal alias is
  // 301'd to the canonical host in .htaccess instead of being supported here.
  // `/foo` -> `/foo/index.html`, so Apache resolves routes without rewrites.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
