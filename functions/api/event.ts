/**
 * Cloudflare Pages Function — privacy-safe analytics collector.
 * ------------------------------------------------------------
 * Receives anonymous tool-usage events (same-origin POST from the browser) and
 * writes aggregate data points to a Cloudflare Analytics Engine dataset.
 *
 * Privacy guarantees:
 *  - Accepts ONLY the strict allow-listed event shape — no document data, no PII,
 *    no file names, no image bytes (those never leave the device anyway).
 *  - Sets NO cookies and stores NO IP address. Coarse country (from Cloudflare's
 *    edge) is the only location signal and is not tied to any identifier.
 *  - If the Analytics Engine binding isn't configured yet, it silently accepts
 *    and drops the event (returns 204) so deploys never fail.
 *
 * One-time setup (Cloudflare dashboard):
 *   Pages project → Settings → Functions → Analytics Engine bindings → Add:
 *     Variable name: ANALYTICS     Dataset: easyphoto_events
 *
 * NOTE: This file is a Cloudflare Pages Function, compiled by Cloudflare's
 * build (not by Next.js / the repo tsc, which excludes the functions/ dir).
 */

const ALLOWED_EVENTS = new Set([
  "tool_view",
  "tool_start",
  "tool_success",
  "tool_failure",
  "download",
]);

const ALLOWED_DEVICE = new Set(["desktop", "android", "ios"]);

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

function ms(v: unknown): number {
  return typeof v === "number" && isFinite(v) && v >= 0
    ? Math.min(Math.round(v), 600000)
    : 0;
}

// Loosely typed: Cloudflare injects the real context/env at runtime.
export const onRequestPost = async (context: {
  request: Request & { cf?: { country?: string } };
  env: { ANALYTICS?: { writeDataPoint: (p: unknown) => void } };
}): Promise<Response> => {
  const { request, env } = context;
  try {
    const event = (await request.json()) as Record<string, unknown>;

    // Allow-list the event name; anything else is dropped.
    if (!event || !ALLOWED_EVENTS.has(String(event.name))) {
      return new Response(null, { status: 204 });
    }
    // Binding not configured yet → accept-and-drop so deploys never 500.
    if (!env?.ANALYTICS) return new Response(null, { status: 204 });

    const device = ALLOWED_DEVICE.has(String(event.device))
      ? String(event.device)
      : "";
    const country = str(request.cf?.country, 2);

    env.ANALYTICS.writeDataPoint({
      // One index (used for adaptive sampling) — group by tool.
      indexes: [str(event.tool, 48) || "unknown"],
      blobs: [
        str(event.name, 16), // 1: event name
        str(event.tool, 48), // 2: tool
        device, //              3: device class
        str(event.engine, 16), // 4: engine
        str(event.reason, 32), // 5: failure reason
        str(event.format, 12), // 6: download format
        country, //             7: coarse country
      ],
      doubles: [
        ms(event.ms), // 1: processing time (ms)
        1, //            2: count
      ],
    });
  } catch {
    /* never error the beacon */
  }
  return new Response(null, { status: 204 });
};
