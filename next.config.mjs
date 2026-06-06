/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build cache directory. `npm run dev` uses the default ".next"; set
  // NEXT_DIST_DIR (e.g. ".next-verify") for one-off production builds so they
  // never overwrite the chunks a running dev server is serving.
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
