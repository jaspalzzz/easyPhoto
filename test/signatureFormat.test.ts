import { describe, expect, it } from "vitest";
import { signatureExportFormat } from "@/lib/signature";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

describe("signatureExportFormat", () => {
  it("follows the preset's published sigFormat", () => {
    expect(signatureExportFormat({ sigFormat: "JPG" })).toBe("jpeg");
    expect(signatureExportFormat({ sigFormat: "JPEG / JPG" })).toBe("jpeg");
    expect(signatureExportFormat({ sigFormat: "PNG" })).toBe("png");
  });

  it("exports a white JPG when the exam publishes no format, not a transparent PNG", () => {
    // Output audit, 10 Oct 2026: 13 exams with no recorded format got a
    // transparent PNG (UPPSC's 200 DPI signature among them).
    expect(signatureExportFormat({})).toBe("jpeg");
    for (const id of ["uppsc", "tgpsc", "clat", "army-agniveer", "passport-seva", "up-police"]) {
      expect(signatureExportFormat(PORTAL_PRESETS[id]), id).toBe("jpeg");
    }
  });

  it("keeps the transparent PNG when no exam is selected", () => {
    expect(signatureExportFormat(undefined)).toBe("png");
  });

  it("uses PNG only when the exam names PNG and not JPG", () => {
    expect(signatureExportFormat({ sigFormat: "PNG" })).toBe("png");
    expect(signatureExportFormat({ sigFormat: "JPG / JPEG / PNG" })).toBe("jpeg");
    expect(signatureExportFormat({ sigFormat: "PDF" })).toBe("jpeg");
  });

  it("exports JPG for every preset that publishes a JPG/JPEG signature format", () => {
    const jpgPresets = Object.values(PORTAL_PRESETS).filter((p) => p.sigFormat && /\b(?:JPG|JPEG)\b/i.test(p.sigFormat));
    expect(jpgPresets.length).toBeGreaterThan(0);
    for (const p of jpgPresets) expect(signatureExportFormat(p), p.id).toBe("jpeg");
  });
});
