import { describe, it, expect, beforeEach } from "vitest";
import {
  track,
  setAnalyticsSink,
  setAnalyticsOptOut,
  type AnalyticsEvent,
} from "@/lib/analytics";

describe("analytics — privacy-safe event layer", () => {
  beforeEach(() => {
    setAnalyticsSink(null);
    setAnalyticsOptOut(false);
  });

  it("sends nothing when no sink is configured (default = no network)", () => {
    // Should simply not throw and not call anything.
    expect(() => track({ name: "tool_view", tool: "passport-photo" })).not.toThrow();
  });

  it("forwards events to the configured sink", () => {
    const seen: AnalyticsEvent[] = [];
    setAnalyticsSink((e) => seen.push(e));
    track({ name: "tool_start", tool: "ssc", device: "android" });
    track({ name: "tool_success", tool: "ssc", engine: "wasm-q8", ms: 1200 });
    expect(seen).toHaveLength(2);
    expect(seen[1]).toMatchObject({ name: "tool_success", tool: "ssc", engine: "wasm-q8" });
  });

  it("respects opt-out", () => {
    const seen: AnalyticsEvent[] = [];
    setAnalyticsSink((e) => seen.push(e));
    setAnalyticsOptOut(true);
    track({ name: "tool_view", tool: "x" });
    expect(seen).toHaveLength(0);
  });

  it("never throws even if the sink throws", () => {
    setAnalyticsSink(() => {
      throw new Error("sink boom");
    });
    expect(() => track({ name: "download", tool: "pdf-merge", format: "pdf" })).not.toThrow();
  });
});
