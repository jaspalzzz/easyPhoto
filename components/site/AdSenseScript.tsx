"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { isAdSenseExcludedPath, isPrivateAdFreePath } from "@/lib/adExclusions";

export const ADSENSE_CLIENT = "ca-pub-8825078307302402";
const CMP_PUBLISHER = "pub-8825078307302402";

export function adsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
}

/**
 * A visitor who reaches a private page (ID documents, PDFs, legal pages) by an
 * in-site link keeps the previous page's document, so an ad script loaded
 * there would still be running. A fresh load drops it, which is what the
 * privacy policy promises for these pages. Hand-offs into private tools come
 * only from other private tools, which never load the script, so no handed-over
 * file is lost to the reload.
 */
function useFreshDocumentOnPrivatePages(pathname: string) {
  React.useEffect(() => {
    if (!isPrivateAdFreePath(pathname)) return;
    if (document.querySelector('script[src*="adsbygoogle.js"]')) window.location.reload();
  }, [pathname]);
}

export function AdSenseScript() {
  const pathname = usePathname() || "/";
  useFreshDocumentOnPrivatePages(pathname);

  if (!adsEnabled() || isAdSenseExcludedPath(pathname)) return null;

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
