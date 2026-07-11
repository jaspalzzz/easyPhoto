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
  "compliance_share",
  // Acquisition / navigation funnel.
  "path_select",
  "search_use",
  "exam_select",
  "country_select",
  "related_tool_click",
]);

const ALLOWED_DEVICE = new Set(["desktop", "android", "ios"]);
// Bounded enums for the nav events — never trust the client, even our own.
const ALLOWED_PATH = new Set(["exam", "passport", "utilities"]);
const ALLOWED_SURFACE = new Set(["homepage", "tools", "exam", "blog"]);
const ALLOWED_RESULT = new Set(["selected", "no_result"]);
const ALLOWED_METHOD = new Set(["native", "download"]);

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

/** Keep one value only if it's in the allow-list; otherwise drop it. */
function pick(set: Set<string>, v: unknown): string {
  return set.has(String(v)) ? String(v) : "";
}

/** Bound a registry identifier to a safe slug — no free-form text can survive. */
function slug(v: unknown, max: number): string {
  return typeof v === "string"
    ? v
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, max)
    : "";
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
    // Same-origin only: drop cross-site POSTs (cheap abuse guard). The beacon is
    // always same-origin; requests with no Origin header (some clients) pass.
    const origin = request.headers.get("Origin");
    if (origin) {
      try {
        if (new URL(origin).host !== new URL(request.url).host) {
          return new Response(null, { status: 204 });
        }
      } catch {
        /* malformed Origin — ignore and continue */
      }
    }

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
    const cfCountry = str(request.cf?.country, 2);

    // format (download) and method (compliance_share) share a "variant" column.
    const variant = str(event.format, 12) || pick(ALLOWED_METHOD, event.method);

    // Navigation events have no `tool`. `navSubject` folds the single subject
    // of each nav event (path/surface/exam/selected-country/related-destination)
    // into one column so "what did they pick" is one query; validated per type.
    const navSubject =
      pick(ALLOWED_PATH, event.path) ||
      pick(ALLOWED_SURFACE, event.surface) ||
      slug(event.exam, 48) ||
      slug(event.country, 24) || // country_select subject, not the cf country
      slug(event.to, 48);

    env.ANALYTICS.writeDataPoint({
      // One index (used for adaptive sampling) — group by tool, or by event
      // name for navigation events that carry no tool.
      indexes: [str(event.tool, 48) || str(event.name, 16) || "unknown"],
      blobs: [
        str(event.name, 16), //  1: event name
        str(event.tool, 48), //  2: tool
        device, //               3: device class
        str(event.engine, 16), // 4: engine
        str(event.reason, 32), // 5: failure reason
        variant, //              6: download format / share method
        cfCountry, //            7: coarse country (edge, no identifier)
        navSubject, //           8: nav subject (path/surface/exam/country/dest)
        slug(event.from, 48), // 9: nav source (related_tool_click origin)
        pick(ALLOWED_RESULT, event.result), // 10: search_use outcome
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
