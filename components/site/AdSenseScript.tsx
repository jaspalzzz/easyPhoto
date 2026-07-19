"use client";

import { usePathname } from "next/navigation";
import { isAdSenseExcludedPath } from "@/lib/adExclusions";

const ADSENSE_CLIENT = "ca-pub-8825078307302402";
const CMP_PUBLISHER = "pub-8825078307302402";

export function AdSenseScript() {
  const pathname = usePathname() || "/";
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  if (!enabled || isAdSenseExcludedPath(pathname)) return null;

  return (
    <>
      {/* React 19 hoists these eligible-route-only hints into the document head. */}
      <link
        rel="preconnect"
        href="https://pagead2.googlesyndication.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />

      {/* Keep the CMP first in exported source so Google's consent handshake is
          available before the asynchronous AdSense tag initializes. */}
      <script
        async
        src={`https://fundingchoicesmessages.google.com/i/${CMP_PUBLISHER}?ers=1`}
      />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
