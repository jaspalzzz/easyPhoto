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
