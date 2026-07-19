import type { FaqItem } from "@/components/site/Faq";
import {
  PORTAL_PRESETS,
  type PortalSpec,
} from "@/lib/portalPresets";
import { photoDimsPx, sigDimsPx } from "@/lib/specRegistry";

export function kbBand(minKb: number | undefined, maxKb: number | undefined): string | null {
  if (!maxKb) return null;
  return minKb ? `${minKb}–${maxKb} KB` : `Under ${maxKb} KB`;
}

/**
 * Some compatibility presets retain a usable target while their cited public
 * notice explicitly says the signature numbers are not published. Those values
 * must not be presented as a portal requirement in editorial copy.
 */
export function hasPublishedSignatureTarget(spec: PortalSpec): boolean {
  return !/signature (?:bands?|limits?)[^.]{0,100}(?:remain )?unconfirmed/i.test(
    spec.description
  );
}

function signatureRangeFromDescription(spec: PortalSpec): string | null {
  const match = spec.description.match(
    /(?:three signatures|signatures arranged vertically)[^.]{0,100}?(\d+)\s*[–-]\s*(\d+)\s*pixels/i
  );
  return match ? `${match[1]}–${match[2]} px (three vertically)` : null;
}

function signatureDimensions(spec: PortalSpec): string {
  const fixed = sigDimsPx(spec, " px");
  if (fixed) return fixed;
  return signatureRangeFromDescription(spec) ?? "No fixed pixels published";
}

export interface ExamGuideRow {
  id: keyof typeof PORTAL_PRESETS;
  label: string;
  photo: string;
  photoDimensions: string;
  signature: string;
  signatureDimensions: string;
  format: string;
  photoLimitForChart: number;
  signatureLimitForChart: number;
}

export function examGuideRow(
  id: keyof typeof PORTAL_PRESETS,
  label: string
): ExamGuideRow {
  const spec = PORTAL_PRESETS[id];
  const publishedSignature = hasPublishedSignatureTarget(spec);
  const signature = publishedSignature
    ? kbBand(spec.sigMinKb, spec.sigLimitKb) ?? "Not published in cited source"
    : "Not published in cited source";
  const signatureDimension = publishedSignature
    ? signatureDimensions(spec)
    : "Not published in cited source";
  const signatureFormat = publishedSignature
    ? spec.sigFormat ?? "Not published"
    : "Not published";

  return {
    id,
    label,
    photo: spec.isLiveCapture
      ? "Live capture"
      : kbBand(spec.photoMinKb, spec.photoLimitKb) ?? "Not published",
    photoDimensions: spec.isLiveCapture
      ? "No prepared photo file"
      : photoDimsPx(spec, " px") ?? "No fixed pixels published",
    signature,
    signatureDimensions: signatureDimension,
    format: spec.isLiveCapture
      ? `Signature: ${signatureFormat}`
      : spec.photoFormat === signatureFormat
        ? spec.photoFormat ?? "Not published"
        : `Photo: ${spec.photoFormat ?? "not published"}; signature: ${signatureFormat}`,
    photoLimitForChart: spec.isLiveCapture ? 0 : spec.photoLimitKb,
    signatureLimitForChart: publishedSignature ? spec.sigLimitKb ?? 0 : 0,
  };
}

export const EXAM_GUIDE_ROWS: ExamGuideRow[] = [
  examGuideRow("ssc", "SSC CGL / CHSL / MTS"),
  examGuideRow("ibps", "IBPS PO / Clerk"),
  examGuideRow("sbi", "SBI PO / Clerk"),
  examGuideRow("upsc", "UPSC CSE / IAS"),
  examGuideRow("nda", "UPSC NDA / CDS"),
  examGuideRow("rrb", "RRB NTPC / ALP / Group D"),
  examGuideRow("nta", "NTA NEET / JEE"),
];

const ssc = PORTAL_PRESETS.ssc;
const ibps = PORTAL_PRESETS.ibps;
const sbi = PORTAL_PRESETS.sbi;
const upsc = PORTAL_PRESETS.upsc;
const rrb = PORTAL_PRESETS.rrb;
const nta = PORTAL_PRESETS.nta;

export const EXAM_SIZE_GUIDE_FAQ_ITEMS: FaqItem[] = [
  {
    q: "Can I use the same photo for SSC, IBPS and SBI in the same cycle?",
    a: `Current SSC applications capture the photograph live and publish no prepared-photo pixel size. IBPS and SBI use separate prepared uploads and list ${photoDimsPx(ibps, " px")} and ${photoDimsPx(sbi, " px")} as preferred dimensions. Follow each active form instead of reusing one export automatically.`,
  },
  {
    q: "Why do exam portals set a minimum file size as well as a maximum?",
    a: "Where a portal publishes a KB band, both ends are part of its file check. Excessive compression can make a photograph or signature difficult to review, so prepare the file within the band shown in the current notice rather than targeting the smallest possible output.",
  },
  {
    q: "My signature scan looks grey or cream — will it be rejected?",
    a: "A grey or cream background may not match a portal's listed paper or background instruction. Use the signature resizer to clean the paper tone, then export in the format and KB band named by the current notice.",
  },
  {
    q: "What are the current UPSC photo and signature sizes?",
    a: `The stored UPSC source lists a ${kbBand(upsc.photoMinKb, upsc.photoLimitKb)} ${upsc.photoFormat} photograph on a plain white background and no fixed photo pixel size. Its signature upload is ${kbBand(upsc.sigMinKb, upsc.sigLimitKb)} in ${upsc.sigFormat}, with three signatures arranged vertically in one image. Confirm the current instructions before applying.`,
  },
  {
    q: "What format should I use — JPG or PNG?",
    a: `Use the format named for the specific file: SSC lists ${ssc.sigFormat} for its separate signature, RRB lists ${rrb.sigFormat} for its separate signature, IBPS lists ${ibps.photoFormat}, SBI lists ${sbi.photoFormat}, UPSC lists ${upsc.photoFormat}, and the stored NTA source lists ${nta.photoFormat}. Convert HEIC or WebP only to a format named in the active instructions.`,
  },
  {
    q: "Do specifications change between exam cycles?",
    a: "Yes. File-size bands, formats, dimensions and capture workflows can change between notifications. This guide reads from the site's cited registry; always open the source linked for the exam and confirm the active cycle before submitting.",
  },
];

export const SIGNATURE_GUIDE_ROWS: ExamGuideRow[] = [
  examGuideRow("ssc", "SSC (CGL, CHSL, MTS)"),
  examGuideRow("upsc", "UPSC (CSE, NDA, CDS)"),
  examGuideRow("ibps", "IBPS (PO, Clerk, SO)"),
  examGuideRow("sbi", "SBI (PO, Clerk)"),
  examGuideRow("rrb", "RRB (NTPC, Group D)"),
  examGuideRow("army-agniveer", "Army Agniveer"),
];

export const SIGNATURE_GUIDE_FAQ_ITEMS: FaqItem[] = [
  {
    q: "Can I sign on lined or ruled paper?",
    a: "Use the paper and ink stated in the current notice. Where plain white paper is listed, ruled lines add an unwanted background and should be avoided.",
  },
  {
    q: "My signature is just initials or a short mark. Is that acceptable?",
    a: "Use your normal, repeatable signature and follow any style instruction in the current notice. The uploaded image must also stay within the listed file rules, but the site cannot decide whether an authority will accept a particular signature style.",
  },
  {
    q: "Can I use the same signature image for SSC and UPSC?",
    a: `Prepare them separately. SSC lists a ${kbBand(ssc.sigMinKb, ssc.sigLimitKb)} ${ssc.sigFormat} signature and publishes no fixed signature pixels. UPSC lists a ${kbBand(upsc.sigMinKb, upsc.sigLimitKb)} ${upsc.sigFormat} image containing three signatures arranged vertically.`,
  },
  {
    q: "What if the portal keeps saying my signature file is too large?",
    a: "Confirm the current KB band and encoded format first; renaming a PNG file to .jpg does not convert it. Re-export in the listed format and reduce quality gradually while checking that the result remains legible and does not fall below a published minimum.",
  },
];
