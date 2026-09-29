/** `?target=` presets: the retired exact-KB URLs 301 here, so they must apply. */
import { describe, expect, it } from "vitest";
import { parseKbTarget } from "@/lib/kbTargets";

describe("parseKbTarget", () => {
  it("reads a whole number in range", () => {
    expect(parseKbTarget("?target=20", 5, 10_000)).toBe(20);
    expect(parseKbTarget("?foo=1&target=200", 5, 10_000)).toBe(200);
  });

  it.each(["", "?target=", "?target=abc", "?target=19.5", "?target=-5", "?target=1e3", "?target=4", "?target=10001"])(
    "rejects %j",
    (search) => {
      expect(parseKbTarget(search, 5, 10_000)).toBeNull();
    },
  );
});
