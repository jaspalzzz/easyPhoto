"use client";

import * as React from "react";
import { isIsolatedPath } from "@/lib/adExclusions";
import { leavesClickToBrowser, type DocumentIsolation } from "@/lib/isolationBoundary";

/**
 * Lets the browser load a fresh document when a link crosses between an AI
 * page and any other page (see lib/isolationBoundary.ts for why). Mounted once
 * in the root layout, so its effect runs on the address the document was
 * loaded for.
 *
 * It listens on window in the capture phase, ahead of every other click
 * handler, and stops the click there. next/link never sees it, so it does not
 * turn the click into a client-side navigation, and the browser follows the
 * link itself.
 */
export function IsolationBoundary() {
  React.useEffect(() => {
    const doc: DocumentIsolation = {
      landedOnIsolatedPath: isIsolatedPath(window.location.pathname),
      isolated: window.crossOriginIsolated === true,
    };
    const onClick = (event: MouseEvent) => {
      if (leavesClickToBrowser(event, doc, window.location.href)) event.stopPropagation();
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
