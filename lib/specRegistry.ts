/**
 * Spec registry — the single source of truth for application document specs,
 * with provenance. Spec accuracy is the product: a wrong number means a rejected
 * application. This layer lets pages display a trust signal ("Verified · source")
 * and lets us track which specs need re-confirmation against their official source.
 *
 * It wraps the existing PORTAL_PRESETS (non-breaking) and adds:
 *   - specProvenance(): a UI-ready trust descriptor for a spec
 *   - specsNeedingReview(): specs that are unverified or stale (for a dev check)
 */

import {
  PORTAL_PRESETS,
  PORTAL_KEYS,
  type PortalSpec,
} from "./portalPresets";

export type { PortalSpec, SpecSource, VerificationStatus } from "./portalPresets";

/** Look up a spec by portal id. */
export function getPortalSpec(id: string): PortalSpec | undefined {
  return PORTAL_PRESETS[id];
}

/** All specs as an array. */
export function allPortalSpecs(): PortalSpec[] {
  return PORTAL_KEYS.map((k) => PORTAL_PRESETS[k]);
}

/** Topical grouping — drives "related exams" interlinking (cluster the matrix). */
export type PortalCategory =
  | "national"
  | "defence"
  | "banking"
  | "state-psc"
  | "police"
  | "central"
  | "visa";

export const PORTAL_CATEGORY_LABEL: Record<PortalCategory, string> = {
  national: "National entrance & eligibility exams",
  defence: "Defence recruitment",
  banking: "Banking & insurance",
  "state-psc": "State Public Service Commissions",
  police: "State police recruitment",
  central: "Central government recruitment",
  visa: "Visa & identity documents",
};

const CATEGORY_OF: Record<string, PortalCategory> = {
  // National entrance / eligibility
  gate: "national", "ugc-net": "national", "csir-net": "national", nta: "national",
  cat: "national", clat: "national", cuet: "national",
  // Defence — regular + agniveer
  nda: "defence", cds: "defence", afcat: "defence",
  "army-agniveer": "defence", "airforce-agniveer": "defence", "navy-agniveer": "defence",
  // State police recruitment
  "up-police": "police",
  // Banking & insurance
  ibps: "banking", sbi: "banking", rbi: "banking", nabard: "banking",
  lic: "banking", niacl: "banking", irdai: "banking",
  // State PSCs
  uppsc: "state-psc", bpsc: "state-psc", mpsc: "state-psc", rpsc: "state-psc",
  tnpsc: "state-psc", kpsc: "state-psc", appsc: "state-psc", tgpsc: "state-psc",
  wbpsc: "state-psc", gpsc: "state-psc", hpsc: "state-psc", "kerala-psc": "state-psc",
  // Central government recruitment
  ssc: "central", rrb: "central", ctet: "central", upsc: "central",
  dsssb: "central", upsssc: "central", "ccc-nielit": "central",
  epfo: "central", fci: "central",
  // CAPFs & paramilitary
  bsf: "defence", crpf: "defence", cisf: "defence", itbp: "defence",
  // Visa & identity
  ds160: "visa", "passport-seva": "visa", oci: "visa",
  pan: "visa", "driving-licence": "visa", "voter-id": "visa",
};

/** The topical category for a portal id (defaults to "central"). */
export function portalCategory(id: string): PortalCategory {
  return CATEGORY_OF[id] ?? "central";
}

/**
 * Related portals for cross-linking: same-category siblings first, then a few
 * from other categories to fill — so every exam page links to a topically
 * relevant cluster instead of the same fixed list.
 */
export function relatedPortals(id: string, limit = 6): PortalSpec[] {
  const cat = portalCategory(id);
  const all = allPortalSpecs().filter((s) => s.id !== id);
  const same = all.filter((s) => portalCategory(s.id) === cat);
  const rest = all.filter((s) => portalCategory(s.id) !== cat);
  return [...same, ...rest].slice(0, limit);
}

/**
 * The published pixel dimensions as "200×230px", or null when the authority
 * publishes none. Several portals (UPSC, SSC, RRB) publish a KB band and no
 * pixel requirement at all, so these fields are legitimately absent.
 *
 * Always build copy from these helpers. Interpolating spec.photoWidthPx and
 * friends directly renders "undefined×undefinedpx" the moment a spec turns out
 * to have no published dimensions — which happens every time we re-verify a
 * spec against its source. test/specCopy.test.ts enforces this.
 */
function formatDims(w?: number, h?: number, unit = "px"): string | null {
  return w && h ? `${w}×${h}${unit}` : null;
}

/** Published photo dimensions, e.g. "200×230px" — null when unpublished. */
export function photoDimsPx(spec: PortalSpec, unit = "px"): string | null {
  return formatDims(spec.photoWidthPx, spec.photoHeightPx, unit);
}

/** Published signature dimensions, e.g. "140×60px" — null when unpublished. */
export function sigDimsPx(spec: PortalSpec, unit = "px"): string | null {
  return formatDims(spec.sigWidthPx, spec.sigHeightPx, unit);
}

/** UI-ready trust descriptor for a spec's provenance. */
export interface SpecProvenance {
  /** True only when confirmed against the official source. */
  verified: boolean;
  /** e.g. "Verified 8 Jun 2026 · SSC official portal" or "Specs pending verification". */
  label: string;
  /** Official source URL, if known. */
  url?: string;
  /** Source label, if known. */
  sourceLabel?: string;
  /** ISO date last confirmed, if any. */
  verifiedOn?: string;
}

function formatIsoDate(iso: string): string {
  // Avoid locale/timezone surprises: format from the YYYY-MM-DD parts directly.
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (!y || !m || !d || m < 1 || m > 12) return iso;
  return `${d} ${months[m - 1]} ${y}`;
}

/** Build the provenance trust descriptor for a spec (safe to render on a page). */
export function specProvenance(spec: PortalSpec): SpecProvenance {
  const verified = spec.verification === "official" && !!spec.verifiedOn;
  if (verified && spec.verifiedOn) {
    const src = spec.source?.label ? ` · ${spec.source.label}` : "";
    return {
      verified: true,
      label: `Verified ${formatIsoDate(spec.verifiedOn)}${src}`,
      url: spec.source?.url,
      sourceLabel: spec.source?.label,
      verifiedOn: spec.verifiedOn,
    };
  }
  // Not yet confirmed: be honest, point users to the official source.
  return {
    verified: false,
    label: spec.source
      ? `Always confirm the current limit on the official source`
      : `Specs pending verification`,
    url: spec.source?.url,
    sourceLabel: spec.source?.label,
  };
}

/** Months between an ISO date and `today` (ISO). Negative if date is in future. */
function monthsSince(iso: string, todayIso: string): number {
  const [y1, m1, d1] = iso.split("-").map(Number);
  const [y2, m2, d2] = todayIso.split("-").map(Number);
  let months = (y2 - y1) * 12 + (m2 - m1);
  if (d2 < d1) months -= 1;
  return months;
}

/** Today as YYYY-MM-DD (callers may inject for deterministic tests). */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * A spec needs (re)verification if it isn't marked official, has no verifiedOn,
 * or was last verified more than `maxMonths` ago. Government specs drift between
 * notification cycles, so a periodic re-check is part of keeping the promise.
 */
export function isSpecStale(
  spec: PortalSpec,
  maxMonths = 6,
  today: string = todayIso()
): boolean {
  if (spec.verification !== "official" || !spec.verifiedOn) return true;
  return monthsSince(spec.verifiedOn, today) >= maxMonths;
}

/** All specs that are unverified or stale — drive a periodic review checklist. */
export function specsNeedingReview(
  maxMonths = 6,
  today: string = todayIso()
): PortalSpec[] {
  return allPortalSpecs().filter((s) => isSpecStale(s, maxMonths, today));
}
