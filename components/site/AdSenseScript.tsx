"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
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
];
// `/[maker]/` (e.g. /malaysia-visa-photo-maker/) is a dynamic route that also
// embeds PhotoTool directly — build the exclusion set from the same registry
// the route itself uses, so a newly added maker page is excluded automatically.
const EXCLUDED_EXACT = new Set(MAKER_PAGES.map((m) => `/${m.slug}/`));

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
