/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — required for per-country SSG SEO pages and a fully
  // client-side, no-backend deployment (privacy guarantee).
  output: "export",
  images: {
    // next/image optimization needs a server; disable for static export.
    unoptimized: true,
  },
  // Trailing slashes make the static export host cleanly on most static hosts.
  trailingSlash: true,
};

export default nextConfig;
