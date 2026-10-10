/**
 * Output audit — the rules a downloaded exam file must meet, derived from the
 * exam's PortalSpec, and a reader for the file's own header (format, pixels,
 * declared DPI). Pure: no DOM, so it's unit-tested in test/outputAudit.test.ts
 * and shared by the browser harness (audit/outputs.spec.ts).
 *
 * See docs/output-audit-plan-2026-10.md.
 */
import type { PortalSpec } from "../lib/portalPresets";

export type FileKind = "photo" | "signature";

export interface FileFacts {
  format: "jpeg" | "png" | "unknown";
  bytes: number;
  width: number;
  height: number;
  /** Declared DPI (JFIF density in dots per inch, or PNG pHYs), when present. */
  dpi?: number;
}

export interface CheckResult {
  check: string;
  pass: boolean;
  expected: string;
  actual: string;
}

/** Reads format, pixel size and declared DPI from a JPEG or PNG header. */
export function readFileFacts(bytes: Uint8Array): FileFacts {
  const facts: FileFacts = { format: "unknown", bytes: bytes.length, width: 0, height: 0 };
  const u16 = (i: number) => (bytes[i] << 8) | bytes[i + 1];
  const u32 = (i: number) => ((bytes[i] << 24) >>> 0) + (bytes[i + 1] << 16) + (bytes[i + 2] << 8) + bytes[i + 3];

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    facts.format = "jpeg";
    for (let i = 2; i + 9 < bytes.length; ) {
      if (bytes[i] !== 0xff) break;
      const marker = bytes[i + 1];
      const len = u16(i + 2);
      // APP0 "JFIF\0": units at +11 (1 = dots per inch, 2 = per cm), x density at +12.
      if (marker === 0xe0 && bytes[i + 4] === 0x4a && bytes[i + 5] === 0x46 && bytes[i + 6] === 0x49 && bytes[i + 7] === 0x46) {
        const units = bytes[i + 11];
        const x = u16(i + 12);
        if (units === 1) facts.dpi = x;
        else if (units === 2) facts.dpi = Math.round(x * 2.54);
      }
      // SOF0–SOF2 (baseline, extended, progressive).
      if (marker >= 0xc0 && marker <= 0xc2) {
        facts.height = u16(i + 5);
        facts.width = u16(i + 7);
        break;
      }
      i += 2 + len;
    }
    return facts;
  }

  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    facts.format = "png";
    facts.width = u32(16);
    facts.height = u32(20);
    // pHYs chunk: pixels per unit; unit 1 = metre.
    for (let i = 8; i + 12 <= bytes.length; ) {
      const len = u32(i);
      const type = String.fromCharCode(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);
      if (type === "pHYs" && bytes[i + 16] === 1) facts.dpi = Math.round(u32(i + 8) * 0.0254);
      if (type === "IDAT" || type === "IEND") break;
      i += 12 + len;
    }
  }
  return facts;
}

/** The published rules for one file kind, as plain numbers. */
export interface FileRules {
  minKb?: number;
  maxKb?: number;
  formats: Array<"jpeg" | "png">;
  /** True when the exam names no format: JPEG or PNG both pass, noted in the report. */
  formatUnspecified: boolean;
  exactPx?: { width: number; height: number };
  sidePx?: { min: number; max: number };
  ratio?: number;
  dpi?: number;
}

function formatsOf(text: string | undefined): { formats: Array<"jpeg" | "png">; unspecified: boolean } {
  if (!text) return { formats: ["jpeg", "png"], unspecified: true };
  const formats: Array<"jpeg" | "png"> = [];
  if (/jpe?g|jpe\b/i.test(text)) formats.push("jpeg");
  if (/png/i.test(text)) formats.push("png");
  return formats.length ? { formats, unspecified: false } : { formats: ["jpeg", "png"], unspecified: true };
}

export function rulesFor(spec: PortalSpec, kind: FileKind): FileRules | null {
  if (kind === "photo") {
    // `noPhotoUpload` (photo taken live in the form, no upload) arrives with the
    // SSC rewrite (#92); read it loosely until then.
    if ((spec as PortalSpec & { noPhotoUpload?: boolean }).noPhotoUpload) return null;
    const f = formatsOf(spec.photoFormat);
    return {
      minKb: spec.photoMinKb,
      maxKb: spec.photoLimitKb,
      formats: f.formats,
      formatUnspecified: f.unspecified,
      exactPx:
        spec.photoWidthPx && spec.photoHeightPx
          ? { width: spec.photoWidthPx, height: spec.photoHeightPx }
          : undefined,
      // OCI: 200–900 px on each side (hotfix #103).
      sidePx: spec.photoSidePx,
      ratio: spec.photoWidthPx && spec.photoHeightPx ? undefined : spec.photoAspectRatio,
      dpi: spec.dpi,
    };
  }
  if (spec.sigLimitKb === undefined) return null;
  const f = formatsOf(spec.sigFormat);
  return {
    minKb: spec.sigMinKb,
    maxKb: spec.sigLimitKb,
    formats: f.formats,
    formatUnspecified: f.unspecified,
    exactPx:
      spec.sigWidthPx && spec.sigHeightPx ? { width: spec.sigWidthPx, height: spec.sigHeightPx } : undefined,
    sidePx: spec.sigSidePx,
    ratio: spec.sigWidthPx && spec.sigHeightPx ? undefined : spec.sigAspectRatio,
    dpi: spec.dpi,
  };
}

/**
 * Every check the file must pass. Portals count 1 KB as 1,000 or 1,024 bytes,
 * so the cap must hold in the smaller unit and the floor in the larger one.
 */
export function checkFile(rules: FileRules, f: FileFacts): CheckResult[] {
  const out: CheckResult[] = [];
  const add = (check: string, pass: boolean, expected: string, actual: string) =>
    out.push({ check, pass, expected, actual });

  add("decodes", f.format !== "unknown" && f.width > 0 && f.height > 0, "a readable JPEG or PNG", `${f.format} ${f.width}×${f.height}`);
  add("format", rules.formats.includes(f.format as "jpeg" | "png"), rules.formats.join(" or "), f.format);
  if (rules.maxKb !== undefined) add("max size", f.bytes <= rules.maxKb * 1000, `≤ ${rules.maxKb * 1000} B`, `${f.bytes} B`);
  if (rules.minKb !== undefined) add("min size", f.bytes >= rules.minKb * 1024, `≥ ${rules.minKb * 1024} B`, `${f.bytes} B`);
  if (rules.exactPx) {
    add(
      "pixels",
      f.width === rules.exactPx.width && f.height === rules.exactPx.height,
      `${rules.exactPx.width}×${rules.exactPx.height}`,
      `${f.width}×${f.height}`
    );
  }
  if (rules.sidePx) {
    const ok = [f.width, f.height].every((s) => s >= rules.sidePx!.min && s <= rules.sidePx!.max);
    add("side range", ok, `each side ${rules.sidePx.min}–${rules.sidePx.max}`, `${f.width}×${f.height}`);
  }
  if (rules.ratio !== undefined && f.height > 0) {
    // One pixel of rounding is allowed on either side.
    const ok = Math.abs(f.width / f.height - rules.ratio) <= 1 / f.height + 1 / f.width;
    add("shape", ok, `width ÷ height ${rules.ratio.toFixed(3)}`, (f.width / f.height).toFixed(3));
  }
  if (rules.dpi !== undefined) add("dpi", f.dpi === rules.dpi, `${rules.dpi}`, f.dpi === undefined ? "none" : `${f.dpi}`);
  return out;
}
