"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isAdSenseExcludedPath } from "@/lib/adExclusions";

const ADSENSE_CLIENT = "ca-pub-8825078307302402";

export function AdSenseScript() {
  const pathname = usePathname() || "/";
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  if (!enabled || isAdSenseExcludedPath(pathname)) return null;

  return (
    <Script
      id="adsbygoogle-init"
      strategy="lazyOnload"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
