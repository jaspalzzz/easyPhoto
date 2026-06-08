/**
 * First-party analytics sink.
 * ---------------------------
 * Sends the strict, anonymous AnalyticsEvent to OUR OWN endpoint (a Cloudflare
 * Pages Function at /api/event) — same-origin, so no CSP change and no third
 * party. Fire-and-forget via sendBeacon (survives page unload); never blocks the
 * UI and never throws. No cookies, no IDs — exactly the events, nothing else.
 */
import type { AnalyticsEvent } from "./analytics";

const ENDPOINT = "/api/event";

export function beaconSink(event: AnalyticsEvent): void {
  try {
    const body = JSON.stringify(event);
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      navigator.sendBeacon(
        ENDPOINT,
        new Blob([body], { type: "application/json" })
      );
      return;
    }
    if (typeof fetch === "function") {
      void fetch(ENDPOINT, {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    /* analytics must never break a user flow */
  }
}
