"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENT = "ca-pub-8825078307302402";
const EXCLUDED_PATHS = [
  "/privacy/",
  "/terms/",
  "/disclaimer/",
  "/contact/",
  "/about/",
];
const EXCLUDED_PREFIXES = [
  "/tools/",
  "/embed/",
];

function normalizePath(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function AdSenseScript() {
  const pathname = normalizePath(usePathname() || "/");
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const excluded =
    EXCLUDED_PATHS.includes(pathname) ||
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
