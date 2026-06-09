/**
 * Dedicated single-document resizer pages (canonical homes).
 * ----------------------------------------------------------
 * Some exams have their own keyword-exact root pages for a single document —
 * e.g. /ssc-photo-resizer/ and /ssc-signature-resizer/. These are the canonical
 * pages for the single-document query ("ssc photo resizer").
 *
 * The combined workspace at /tools/form-resizer/{portal}/ (photo + signature in
 * one tabbed tool) is a DIFFERENT intent. To avoid the two competing for the
 * same keyword, the combined page links out to these dedicated pages, signalling
 * which URL owns the single-document query and passing link equity to it.
 *
 * Slugs are explicit (not derived from the portal id) because the live URLs use
 * search-friendly names — e.g. rrb → "railway", sbi → "sbi-po" — and must not
 * change once indexed.
 */

export interface DedicatedResizers {
  /** Root slug of the photo-only resizer page, if one exists. */
  photo?: string;
  /** Root slug of the signature-only resizer page, if one exists. */
  signature?: string;
}

/** portalId → dedicated single-document page slugs that already exist. */
export const DEDICATED_RESIZERS: Record<string, DedicatedResizers> = {
  ssc: { photo: "ssc-photo-resizer", signature: "ssc-signature-resizer" },
  upsc: { photo: "upsc-photo-resizer", signature: "upsc-signature-resizer" },
  rrb: { photo: "railway-photo-resizer" },
  ibps: { photo: "ibps-photo-resizer" },
  sbi: { photo: "sbi-po-photo-resizer" },
};

export interface DedicatedLink {
  label: string;
  path: string;
  kind: "photo" | "signature";
}

/** UI-ready links to a portal's dedicated single-document pages (may be empty). */
export function dedicatedResizerLinks(portalId: string): DedicatedLink[] {
  const d = DEDICATED_RESIZERS[portalId];
  if (!d) return [];
  const links: DedicatedLink[] = [];
  if (d.photo) {
    links.push({ label: "Photo only", path: `/${d.photo}/`, kind: "photo" });
  }
  if (d.signature) {
    links.push({
      label: "Signature only",
      path: `/${d.signature}/`,
      kind: "signature",
    });
  }
  return links;
}
