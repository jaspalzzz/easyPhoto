/**
 * Privacy-safe analytics.
 * -----------------------
 * Records ANONYMOUS tool-usage events ONLY — which tool ran, on what device
 * class, how long it took, and whether it succeeded. It NEVER receives document
 * content, file names, image data, or any PII. The product promise ("your photos,
 * signatures and documents never leave your device") is preserved: these are
 * aggregate usage counters, not document data.
 *
 * Design:
 *  - Events are a strict union of enums/numbers — there's no free-form field a
 *    caller could accidentally leak data through.
 *  - A pluggable SINK decides where events go. With no sink set (the default),
 *    nothing is sent anywhere and no network/CSP change is needed. Wire a sink
 *    (Cloudflare Web Analytics, a Pages Function, Plausible, …) once chosen.
 *  - Respects Do-Not-Track and an explicit opt-out. Never throws.
 */

/** Coarse device class — no fingerprinting, just routing/diagnostics buckets. */
export type DeviceClass = "desktop" | "android" | "ios";

/** Which on-device engine handled a job (for success/failure diagnostics). */
export type EngineLabel =
  | "isnet"
  | "webgpu-fp16"
  | "wasm-fp32"
  | "wasm-q8"
  | "none";

/** The strict, allow-listed event shapes. Add new variants here deliberately. */
export type AnalyticsEvent =
  | { name: "tool_view"; tool: string }
  | { name: "tool_start"; tool: string; device?: DeviceClass }
  | {
      name: "tool_success";
      tool: string;
      device?: DeviceClass;
      engine?: EngineLabel;
      ms?: number;
    }
  | {
      name: "tool_failure";
      tool: string;
      device?: DeviceClass;
      engine?: EngineLabel;
      /** Short, non-PII reason code only (e.g. "oom", "no-face", "decode"). */
      reason?: string;
    }
  | { name: "download"; tool: string; format?: string }
  | { name: "compliance_share"; tool: string; method: "native" | "download" };

export type AnalyticsSink = (event: AnalyticsEvent) => void;

let sink: AnalyticsSink | null = null;
let optedOut = false;

/** Wire the destination for events (call once at app init). null disables. */
export function setAnalyticsSink(next: AnalyticsSink | null): void {
  sink = next;
}

/** Explicit opt-out (e.g. from a privacy toggle). */
export function setAnalyticsOptOut(value: boolean): void {
  optedOut = value;
}

function collectionAllowed(): boolean {
  if (optedOut) return false;
  if (typeof navigator !== "undefined") {
    // Honour Do-Not-Track.
    const dnt =
      navigator.doNotTrack ||
      (window as unknown as { doNotTrack?: string }).doNotTrack;
    if (dnt === "1" || dnt === "yes") return false;
  }
  return true;
}

/** Detect the coarse device class from the UA (no fingerprinting). */
export function deviceClass(): DeviceClass {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

/** Record an event. Safe to call anywhere; never throws, never blocks. */
export function track(event: AnalyticsEvent): void {
  try {
    if (!collectionAllowed() || !sink) return;
    sink(event);
  } catch {
    /* analytics must never break a user flow */
  }
}
