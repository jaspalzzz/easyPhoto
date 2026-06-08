"use client";

import { setAnalyticsSink } from "@/lib/analytics";
import { beaconSink } from "@/lib/analyticsBeacon";

/**
 * Wires the first-party analytics sink. We register it at MODULE LOAD (not in a
 * useEffect) so it's set during hydration bootstrap — before child components'
 * effects run — otherwise an early tool_view could fire before the sink exists
 * and be dropped. Guarded to the browser; track() still enforces DNT/opt-out.
 */
if (typeof window !== "undefined") {
  setAnalyticsSink(beaconSink);
}

export function AnalyticsBeacon() {
  return null;
}
