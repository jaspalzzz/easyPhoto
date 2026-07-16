import { describe, it, expect } from "vitest";
import { checkCompliance, type FileFacts } from "@/lib/compliance";
import { getPortalSpec } from "@/lib/specRegistry";

const ibps = getPortalSpec("ibps")!;
const ssc = getPortalSpec("ssc")!;

const facts = (over: Partial<FileFacts>): FileFacts => ({
  bytes: 40 * 1024,
  width: 200,
  height: 230,
  type: "image/jpeg",
  ...over,
});

describe("checkCompliance — photo", () => {
  it("passes a compliant IBPS photo", () => {
    const r = checkCompliance(facts({}), ibps, "photo");
    expect(r.verdict).toBe("pass");
    expect(r.checks.find((c) => c.label === "File size")?.status).toBe("pass");
    expect(r.checks.find((c) => c.label === "Dimensions")?.status).toBe("pass");
  });

  it("fails when the file is over the KB limit", () => {
    const r = checkCompliance(facts({ bytes: 80 * 1024 }), ibps, "photo");
    expect(r.verdict).toBe("fail");
    expect(r.checks.find((c) => c.label === "File size")?.status).toBe("fail");
  });

  it("warns when the file is under the KB minimum", () => {
    const r = checkCompliance(facts({ bytes: 8 * 1024 }), ibps, "photo");
    expect(r.checks.find((c) => c.label === "File size")?.status).toBe("warn");
    expect(r.verdict).toBe("warn");
  });

  it("warns on wrong dimensions", () => {
    const r = checkCompliance(facts({ width: 600, height: 600 }), ibps, "photo");
    expect(r.checks.find((c) => c.label === "Dimensions")?.status).toBe("warn");
  });

  it("warns on non-JPG format", () => {
    const r = checkCompliance(facts({ type: "image/png" }), ibps, "photo");
    expect(r.checks.find((c) => c.label === "Format")?.status).toBe("warn");
  });

  it("warns when the background isn't light", () => {
    const r = checkCompliance(facts({ backgroundLight: false }), ibps, "photo");
    expect(r.checks.find((c) => c.label === "Background")?.status).toBe("warn");
  });

  it("omits an unavailable background check and flags unpublished pixel dimensions", () => {
    const r = checkCompliance(facts({}), ibps, "photo");
    expect(r.checks.find((c) => c.label === "Background")).toBeUndefined();

    const noPublishedPixels = checkCompliance(facts({}), ssc, "photo");
    const dimensionCheck = noPublishedPixels.checks.find(
      (c) => c.label === "Dimensions"
    );
    expect(dimensionCheck?.status).toBe("warn");
    expect(dimensionCheck?.detail).toContain("No pixel dimensions are published");
    expect(noPublishedPixels.verdict).toBe("warn");
  });

  it("warns (not fails) when dimensions can't be decoded", () => {
    const r = checkCompliance(facts({ width: null, height: null }), ibps, "photo");
    expect(r.checks.find((c) => c.label === "Dimensions")?.status).toBe("warn");
  });
});

describe("checkCompliance — signature", () => {
  it("passes a compliant IBPS signature", () => {
    const r = checkCompliance(
      facts({ bytes: 15 * 1024, width: 140, height: 60 }),
      ibps,
      "signature"
    );
    expect(r.verdict).toBe("pass");
  });

  it("fails an oversized signature", () => {
    const r = checkCompliance(
      facts({ bytes: 40 * 1024, width: 140, height: 60 }),
      ibps,
      "signature"
    );
    expect(r.verdict).toBe("fail");
  });
});
