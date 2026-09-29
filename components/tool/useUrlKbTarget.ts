"use client";

import * as React from "react";
import { parseKbTarget } from "@/lib/kbTargets";

/**
 * The `?target=<kb>` preset from the page URL, read once after mount.
 *
 * The retired exact-KB landing pages 301 to `?target=` URLs (see
 * public/_redirects), and site search / kbPath() link to them, so ignoring the
 * parameter showed a "20 KB" visitor a 200 KB default. Read post-mount from
 * `window.location` rather than `useSearchParams()`, which would force a
 * Suspense/CSR bailout on these statically exported pages.
 *
 * Returns null until mounted, when disabled, or when the value is invalid.
 */
export function useUrlKbTarget(enabled: boolean, min: number, max: number): number | null {
  const [target, setTarget] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!enabled) return;
    setTarget(parseKbTarget(window.location.search, min, max));
  }, [enabled, min, max]);
  return target;
}
