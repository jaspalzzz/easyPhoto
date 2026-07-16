/**
 * Pre-submission checker for measurable exam-upload requirements.
 * ------------------------------------------------------------
 * Pure (no DOM, no model) so it is fully unit-testable. The UI decodes the file
 * (bytes, pixel size, format, an optional white-background heuristic) and passes
 * the facts here; this returns a per-criterion report checked against the
 * verified PortalSpec. Deterministic checks (size/dimensions/aspect/format) are
 * definitive; the background check is a heuristic and only ever warns.
 */
import type { PortalSpec } from "./portalPresets";

export type CheckStatus = "pass" | "fail" | "warn";
export type DocKind = "photo" | "signature";

export interface ComplianceCheck {
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface ComplianceReport {
  verdict: CheckStatus;
  checks: ComplianceCheck[];
}

export interface FileFacts {
  /** Raw file size in bytes (as it will be uploaded). */
  bytes: number;
  /** Natural pixel dimensions, or null if it couldn't be decoded. */
  width: number | null;
  height: number | null;
  /** MIME type or extension-derived hint, lowercased (e.g. "image/jpeg", "heic"). */
  type: string;
  /** Optional white-background heuristic (photo only). undefined = not checked. */
  backgroundLight?: boolean;
}

const round = (n: number) => Math.round(n);

/** Check a file's facts against an exam spec for one document kind. */
export function checkCompliance(
  f: FileFacts,
  spec: PortalSpec,
  kind: DocKind
): ComplianceReport {
  const checks: ComplianceCheck[] = [];
  const kb = f.bytes / 1024;

  // --- File size (definitive) ---
  const maxKb = kind === "photo" ? spec.photoLimitKb : spec.sigLimitKb;
  const minKb = kind === "photo" ? spec.photoMinKb : spec.sigMinKb;
  if (maxKb != null) {
    if (kb > maxKb) {
      checks.push({
        label: "File size",
        status: "fail",
        detail: `${round(kb)} KB — over the ${maxKb} KB limit. Compress it before uploading.`,
      });
    } else if (minKb != null && kb < minKb) {
      checks.push({
        label: "File size",
        status: "warn",
        detail: `${round(kb)} KB — below the ${minKb} KB minimum; some portals reject undersized files.`,
      });
    } else {
      checks.push({
        label: "File size",
        status: "pass",
        detail: `${round(kb)} KB — within ${minKb ? `${minKb}–` : "≤ "}${maxKb} KB.`,
      });
    }
  }

  // --- Pixel dimensions (definitive when decodable) ---
  const w = kind === "photo" ? spec.photoWidthPx : spec.sigWidthPx;
  const h = kind === "photo" ? spec.photoHeightPx : spec.sigHeightPx;
  if (w && h) {
    if (f.width == null || f.height == null) {
      checks.push({
        label: "Dimensions",
        status: "warn",
        detail: `Expected ~${w}×${h} px. Couldn't read this file's dimensions — convert it to JPG and check again.`,
      });
    } else {
      const tol = 0.06; // 6% tolerance
      const ok =
        Math.abs(f.width - w) / w <= tol && Math.abs(f.height - h) / h <= tol;
      checks.push({
        label: "Dimensions",
        status: ok ? "pass" : "warn",
        detail: ok
          ? `${f.width}×${f.height} px — matches ${w}×${h} px.`
          : `${f.width}×${f.height} px — expected ~${w}×${h} px. Resize to the exact dimensions.`,
      });
    }
  }

  // --- Aspect ratio (fallback only when exact pixel dims aren't specified;
  // otherwise the dimensions check above is authoritative and subsumes it) ---
  const ar = kind === "photo" ? spec.photoAspectRatio : spec.sigAspectRatio;
  if (ar && f.width && f.height && !(w && h)) {
    const actual = f.width / f.height;
    const ok = Math.abs(actual - ar) / ar <= 0.08;
    checks.push({
      label: "Aspect ratio",
      status: ok ? "pass" : "warn",
      detail: ok
        ? `Correct shape (${actual.toFixed(2)}).`
        : `${actual.toFixed(2)} — expected ${ar.toFixed(2)}. Crop to the right shape.`,
    });
  } else if (!(w && h) && !ar) {
    checks.push({
      label: "Dimensions",
      status: "warn",
      detail:
        "No pixel dimensions are published for this workflow, so dimensions were not checked. Confirm the current application instructions.",
    });
  }

  // --- Format ---
  const isJpg = /jpe?g/.test(f.type);
  checks.push({
    label: "Format",
    status: isJpg ? "pass" : "warn",
    detail: isJpg
      ? "JPG / JPEG."
      : `${f.type || "unknown"} — most portals require JPG/JPEG. Convert it first.`,
  });

  // --- Background (photo only, heuristic) ---
  if (kind === "photo" && f.backgroundLight !== undefined) {
    checks.push({
      label: "Background",
      status: f.backgroundLight ? "pass" : "warn",
      detail: f.backgroundLight
        ? "Looks like a plain light/white background."
        : "Background doesn't look plain white — most exam photos need a white background.",
    });
  }

  const hasFail = checks.some((c) => c.status === "fail");
  const hasWarn = checks.some((c) => c.status === "warn");
  return {
    verdict: hasFail ? "fail" : hasWarn ? "warn" : "pass",
    checks,
  };
}
