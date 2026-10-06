/**
 * A number we did not find in the official source is never "the size"
 * (CLAUDE.md §3).
 *
 * The 6 Oct 2026 guideline audit found the 8 indexed exam pages whose preset is
 * not `official` — ssc, rrb, army-agniveer, voter-id, clat, passport-seva,
 * tgpsc, up-police — still leading their meta description and FAQ with the
 * stored KB figure as if the authority had published it. Voter ID, the top
 * page, said "photo under 2048 KB" while our own preset records that ECI
 * publishes no digital file-size cap. Google's helpful-content questions ask
 * about "easily verified factual errors"; this is one.
 *
 * For every indexed exam page whose preset is unverified, or whose own record
 * says the authority publishes no KB cap or that the value is compatibility-only,
 * no sentence in the title, meta description, lead description or FAQ may state
 * a stored KB value unless the same sentence labels it ("easyPhoto default —
 * not an official limit"). Today's offending fields are recorded in
 * test/fixtures/quality/unpublished-claims-allowlist.json and may only be
 * removed. The rendered requirement card is checked by scripts/quality-gate.mjs.
 */
import { describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/exam-requirements/[exam]/page";
import type { PortalSpec } from "@/lib/portalPresets";
import { explain, ratchetSet, readFixture } from "@/scripts/quality/ratchet.mjs";
import { examTemplatePages, normaliseTemplateText, type ExamTemplatePage } from "./quality/templatePages";

const FIXTURE = "unpublished-claims-allowlist.json";

/** The record itself says the KB figure is not the authority's. */
const RECORD_DISCLAIMS_KB =
  /compatibility[- ]only|compatibility preset|(?:publish(?:es)?\s+no|does\s+not\s+publish|do\s+not\s+publish)\b[^.]{0,80}\b(?:KB|file[- ]size|upload cap|size cap)/i;

/**
 * Wording that presents a stored number as ours, not the authority's, or says
 * outright that the authority does not publish it.
 */
const LABELLED_AS_DEFAULT = new RegExp(
  [
    String.raw`easyPhoto default`,
    String.raw`not an? (?:official|published) (?:limit|requirement|figure)`,
    String.raw`not a current [^.]{0,40}requirement`,
    String.raw`\bunconfirmed\b`,
    String.raw`\b(?:does|do|did)\s+not\b[^.]{0,80}\bpublish`,
    String.raw`\bpublish(?:es|ed)?\s+no\b`,
  ].join("|"),
  "i"
);

export function hasUnpublishedKb(spec: PortalSpec): boolean {
  return spec.verification !== "official" || RECORD_DISCLAIMS_KB.test(spec.description);
}

/**
 * True when a sentence of `text` states the stored PHOTO band without labelling
 * it as ours.
 *
 * Only the photo band is policed. A preset carries one verification status for
 * the whole record, and some unverified records hold a signature band the
 * notice does publish (SSC's 10–20 KB signature), so a signature figure cannot
 * be judged from the data. The band is matched whole — "20–50 KB", "under 50
 * KB", "2 MB" — so a signature band that merely shares a number ("10–20 KB")
 * is not mistaken for it.
 */
export function claimsStoredKb(text: string, spec: PortalSpec): boolean {
  const { photoMinKb: min, photoLimitKb: max } = spec;
  const isPhotoBand = (low: number | undefined, high: number) =>
    min ? low === min && high === max : low === undefined && high === max;
  return text.split(/(?<=[.!?])\s+/).some((sentence) => {
    if (LABELLED_AS_DEFAULT.test(sentence)) return false;
    for (const match of sentence.matchAll(/(?:(\d+)\s*(?:–|-|to)\s*)?(\d+(?:\.\d+)?)\s*(KB|MB)\b/gi)) {
      const scale = match[3].toUpperCase() === "MB" ? 1024 : 1;
      const low = match[1] ? Number(match[1]) * scale : undefined;
      if (isPhotoBand(low, Number(match[2]) * scale)) return true;
    }
    return false;
  });
}

async function seoFields(page: ExamTemplatePage): Promise<Record<string, string>> {
  const meta = await generateMetadata({ params: Promise.resolve({ exam: page.id }) });
  const title = typeof meta.title === "string" ? meta.title : String((meta.title as { absolute?: string })?.absolute ?? "");
  const fields: Record<string, string> = {
    title,
    meta: String(meta.description ?? ""),
    lead: page.spec.description,
  };
  for (const { q, a } of page.faqItems) {
    const key = normaliseTemplateText(q, page.names);
    fields[`faq "${key}" question`] = q;
    fields[`faq "${key}" answer`] = a;
  }
  return fields;
}

export async function currentUnpublishedClaims(): Promise<string[]> {
  const offenders: string[] = [];
  for (const page of examTemplatePages()) {
    if (!hasUnpublishedKb(page.spec)) continue;
    for (const [field, text] of Object.entries(await seoFields(page))) {
      if (claimsStoredKb(text, page.spec)) offenders.push(`${page.id}: ${field}`);
    }
  }
  return offenders;
}

describe("unpublished numbers are never presented as the requirement", () => {
  const voterId = { photoLimitKb: 2048, verification: "needs-review", description: "" } as PortalSpec;

  it("flags a stored figure stated as the size", () => {
    expect(claimsStoredKb("Voter ID: photo under 2048 KB.", voterId)).toBe(true);
    expect(claimsStoredKb("Voter ID Photo Size 2048 KB 2026", voterId)).toBe(true);
    expect(claimsStoredKb("Keep the photo under 2 MB.", voterId)).toBe(true);
  });

  it("matches the photo band whole, not a signature band sharing a number", () => {
    const ssc = { photoMinKb: 20, photoLimitKb: 50, sigMinKb: 10, sigLimitKb: 20 } as PortalSpec;
    expect(claimsStoredKb("Photo 20–50 KB.", ssc)).toBe(true);
    expect(claimsStoredKb("The signature is 10–20 KB.", ssc)).toBe(false);
  });

  it("accepts the same figure when the sentence labels it as our default", () => {
    expect(claimsStoredKb("easyPhoto default 2048 KB — not an official limit.", voterId)).toBe(false);
    expect(claimsStoredKb("ECI publishes no upload cap. 4.5 × 3.5 cm print.", voterId)).toBe(false);
    expect(claimsStoredKb("The portal does not publish the stored 2048 KB limit.", voterId)).toBe(false);
  });

  it("treats a preset as unpublished when its own record disclaims the KB figure", () => {
    expect(hasUnpublishedKb({ ...voterId, verification: "official", description: "The notice publishes no KB limit." })).toBe(true);
    expect(hasUnpublishedKb({ ...voterId, verification: "official", description: "Photo 20–50 KB, JPG." })).toBe(false);
  });

  it("the guard is live: at least one indexed exam page is unverified", () => {
    expect(examTemplatePages().filter((page) => hasUnpublishedKb(page.spec)).length).toBeGreaterThan(0);
  });

  it("no new title, meta, lead or FAQ presents a stored KB value as published", async () => {
    const problems = ratchetSet({
      fixture: FIXTURE,
      section: "sourceFields",
      what: "stored KB value presented as the published requirement",
      current: await currentUnpublishedClaims(),
      allowed: readFixture(FIXTURE).sourceFields,
    });
    expect(problems, explain(problems)).toEqual([]);
  });
});
