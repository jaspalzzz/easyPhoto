/**
 * Canonical site configuration.
 * -----------------------------
 * Set your real domain here (or via NEXT_PUBLIC_SITE_URL at build time). It
 * drives metadataBase, OpenGraph/canonical URLs, the sitemap, and robots.txt.
 * Until a real domain is set, OG/canonical links won't resolve — this is the
 * one value to change before going live.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://easyphoto.in"
).replace(/\/$/, "");

export const SITE_NAME = "easyPhoto";

/**
 * Search-engine ownership verification.
 * -------------------------------------
 * After the site is live, paste the codes from Google Search Console and Bing
 * Webmaster Tools into these env vars (e.g. in `.env.production` or your host's
 * dashboard) and rebuild. Empty by default so nothing renders until set —
 * verifying ownership then becomes a one-line change, no code edit.
 *   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...   (GSC "HTML tag" method)
 *   NEXT_PUBLIC_BING_SITE_VERIFICATION=...     (Bing "msvalidate.01" content)
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || "";
export const BING_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() || "";
