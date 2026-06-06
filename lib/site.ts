/**
 * Canonical site configuration.
 * -----------------------------
 * Set your real domain here (or via NEXT_PUBLIC_SITE_URL at build time). It
 * drives metadataBase, OpenGraph/canonical URLs, the sitemap, and robots.txt.
 * Until a real domain is set, OG/canonical links won't resolve — this is the
 * one value to change before going live.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://passportphoto.app"
).replace(/\/$/, "");

export const SITE_NAME = "PassportPhoto";
