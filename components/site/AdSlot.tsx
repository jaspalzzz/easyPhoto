"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { isAdSenseExcludedPath } from "@/lib/adExclusions";
import { ADSENSE_CLIENT, adsEnabled } from "./AdSenseScript";

/**
 * One labelled AdSense unit. It renders nothing until ads are switched on
 * (NEXT_PUBLIC_ADSENSE_ENABLED=true) AND the owner has created the ad unit in
 * AdSense and set its id in Cloudflare (NEXT_PUBLIC_ADSENSE_SLOT_TOOL /
 * _ARTICLE / _EXAM), so nothing changes in the page until then. Auto ads, when
 * switched on in AdSense, fill other permitted spots without code.
 *
 * Placement rules (AdSense policy and the privacy policy): below the tool and
 * its result, never inside the upload, preview or download area, and never on
 * a page in lib/adExclusions.ts.
 */
type Placement = "tool" | "article" | "exam";

// Read each id with a literal process.env access so Next inlines it at build.
const SLOT_IDS: Record<Placement, string | undefined> = {
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL,
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE,
  exam: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXAM,
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({ placement }: { placement: Placement }) {
  const pathname = usePathname() || "/";
  const slotId = SLOT_IDS[placement];
  const show = adsEnabled() && !!slotId && !isAdSenseExcludedPath(pathname);
  const insRef = React.useRef<HTMLModElement>(null);

  React.useEffect(() => {
    const ins = insRef.current;
    if (!show || !ins) return;
    const request = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // An ad that fails to fill is not an error for the visitor; log it.
        console.warn("[ads] could not request an ad", err);
      }
    };
    // AdSense refuses a unit with no width ("No slot size for
    // availableWidth=0"), e.g. in a hidden tab or a collapsed section, so wait
    // until the slot is laid out before asking for an ad.
    if (ins.offsetWidth > 0) {
      request();
      return;
    }
    const observer = new ResizeObserver(() => {
      if (ins.offsetWidth > 0) {
        observer.disconnect();
        request();
      }
    });
    observer.observe(ins);
    return () => observer.disconnect();
  }, [show, pathname]);

  if (!show) return null;
  return (
    // Collapses (label included) when Google has no ad to show.
    <aside aria-label="Advertisement" className="my-8 has-[ins[data-ad-status=unfilled]]:hidden">
      <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Advertisement</p>
      <ins
        ref={insRef}
        key={pathname}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(process.env.NEXT_PUBLIC_ADSENSE_TEST === "true" ? { "data-adtest": "on" } : {})}
      />
    </aside>
  );
}
