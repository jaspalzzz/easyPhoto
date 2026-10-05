import { describe, expect, it } from "vitest";
import { signatureExportFormat } from "@/lib/signature";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

describe("signatureExportFormat", () => {
  it("follows the preset's published sigFormat even when the description never says JPG", () => {
    expect(signatureExportFormat({ sigFormat: "JPG", description: "Signature 256×64 px, 10-20 KB." })).toBe("jpeg");
    expect(signatureExportFormat({ sigFormat: "JPEG / JPG", description: "" })).toBe("jpeg");
    expect(signatureExportFormat({ sigFormat: "PNG", description: "Upload a JPG photo." })).toBe("png");
  });

  it("falls back to the description only when no format is published", () => {
    expect(signatureExportFormat({ description: "Signature in JPG format." })).toBe("jpeg");
    expect(signatureExportFormat({ description: "Transparent signature." })).toBe("png");
    expect(signatureExportFormat(undefined)).toBe("png");
  });

  it("exports JPG for every preset that publishes a JPG/JPEG signature format", () => {
    const jpgPresets = Object.values(PORTAL_PRESETS).filter((p) => p.sigFormat && /\b(?:JPG|JPEG)\b/i.test(p.sigFormat));
    expect(jpgPresets.length).toBeGreaterThan(0);
    for (const p of jpgPresets) expect(signatureExportFormat(p), p.id).toBe("jpeg");
  });
});
