"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { CONVERT_SLUGS } from "@/lib/convertPairs";
import { HINGLISH_SLUGS } from "@/lib/hinglishPages";
import { MAKER_PAGES } from "@/lib/makerPages";

const ADSENSE_CLIENT = "ca-pub-8825078307302402";
const EXCLUDED_PATHS = [
  "/privacy/",
  "/terms/",
  "/disclaimer/",
  "/contact/",
  "/about/",
  // These render the live upload/result tool (PhotoTool) directly on a
  // root-level route, outside /tools/ — ads next to a private file-upload
  // and download flow are an AdSense accidental-click/policy risk, so they
  // get the same exclusion as /tools/* even though the URL prefix differs.
  "/baby-passport-photo/",
  "/ssc-photo-with-name-date/",
];
const EXCLUDED_PREFIXES = [
  "/tools/",
  "/embed/",
  "/exam-resizer/",
];
// Registry-backed landing pages render a live tool outside /tools/. Build their
// exclusions from the same registries as the routes so new pages are covered
// automatically instead of relying on a second hardcoded slug list.
const EXCLUDED_EXACT = new Set([
  ...MAKER_PAGES.map((m) => `/${m.slug}/`),
  ...HINGLISH_SLUGS.map((slug) => `/${slug}/`),
  ...CONVERT_SLUGS.map((slug) => `/convert/${slug}/`),
]);

function normalizePath(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function AdSenseScript() {
  const pathname = normalizePath(usePathname() || "/");
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const excluded =
    EXCLUDED_PATHS.includes(pathname) ||
    EXCLUDED_EXACT.has(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!enabled || excluded) return null;

  return (
    <Script
      id="adsbygoogle-init"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
