import { PORTAL_PRESETS, type PortalSpec } from "@/lib/portalPresets";
import { allPortalSpecs, formatIsoDate, photoDimsPx } from "@/lib/specRegistry";

/**
 * "Which exams need a photo with name and date?" on /tools/photo-with-name-date/.
 *
 * Searchers ask this per exam ("photo with name and date for ssc / upsc / neet
 * / tnpsc"). Every answer comes from an official source in lib/portalPresets.ts
 * and shows that source and the date we checked it (CLAUDE.md §3). The two
 * "needs it" groups are built from the registry flags, so they always match the
 * exams the tool offers; the "doesn't need it" group is the high-demand exams
 * whose current notices ask for no name or date.
 */
export interface NameDateExamRule {
  id: string;
  exam: string;
  rule: string;
  sourceUrl: string;
  sourceLabel: string;
  /** e.g. "17 Jul 2026". */
  checked: string;
}

/** Facts from the official notice that a searcher needs beyond the strip itself. */
const EXTRA_NOTES: Record<string, string> = {
  tnpsc: "The date must be on or after the date of the notification you apply under.",
};

/**
 * Exams whose current notices ask for no name or date on the photo, each in the
 * words of its source. NEET-UG: the 2026 bulletin asks for passport-size and
 * 4 × 6 inch postcard colour photos on white and says computer-generated photos
 * are not accepted (re-read 15 Oct 2026).
 */
const NOT_NEEDED: ReadonlyArray<{ id: string; exam: string; rule: string }> = [
  {
    id: "ssc",
    exam: "SSC",
    rule: "The form takes your photo live through your camera, so there is no photo file to add a strip to.",
  },
  {
    id: "upsc",
    exam: "UPSC",
    rule: "The instructions say the photo must not be signed and ask for no writing on it.",
  },
  {
    id: "ibps",
    exam: "IBPS",
    rule: "The current notice asks for no name or date on the photo.",
  },
  {
    id: "nta",
    exam: "NEET-UG 2026",
    rule:
      "No name or date. NTA asks for passport-size and 4 × 6 inch postcard colour photos on a white background " +
      "and does not accept computer-generated photos, so don't add a digital strip.",
  },
];

function sourced(spec: PortalSpec, exam: string, rule: string): NameDateExamRule {
  if (!spec.source?.url || !spec.verifiedOn) {
    throw new Error(`${spec.id}: a name/date answer needs an official source and a checked date`);
  }
  return {
    id: spec.id,
    exam,
    rule,
    sourceUrl: spec.source.url,
    sourceLabel: spec.source.label,
    checked: formatIsoDate(spec.verifiedOn),
  };
}

/** Exams that want the name and photo date printed on the photo (the tool's presets). */
export function stripExams(specs: PortalSpec[] = allPortalSpecs()): NameDateExamRule[] {
  return specs
    .filter((spec) => spec.requiresNameDate === true)
    .map((spec) => {
      const strip = spec.description.match(/lower\s+(\d+)\s*px/i)?.[1];
      const dims = photoDimsPx(spec, " px");
      const where =
        strip && dims ? `in the bottom ${strip} px of a ${dims} photo` : "at the bottom of the photo";
      const rule = [`Your name and the date the photo was taken, ${where}.`, EXTRA_NOTES[spec.id]]
        .filter(Boolean)
        .join(" ");
      return sourced(spec, spec.name, rule);
    })
    .sort((a, b) => a.exam.localeCompare(b.exam));
}

/** Exams that want a physical slate held in the photo instead. */
export function slateExams(specs: PortalSpec[] = allPortalSpecs()): NameDateExamRule[] {
  return specs
    .filter((spec) => spec.requiresSlateNameDate === true)
    .map((spec) =>
      sourced(
        spec,
        spec.name,
        "You hold a black slate with your name and the date written in white chalk while the photo is taken. This tool can't add a slate."
      )
    )
    .sort((a, b) => a.exam.localeCompare(b.exam));
}

/** High-demand exams whose current notices ask for no name or date. */
export function noStripExams(): NameDateExamRule[] {
  return NOT_NEEDED.map(({ id, exam, rule }) => {
    const spec = PORTAL_PRESETS[id];
    if (!spec) throw new Error(`${id}: not in lib/portalPresets.ts`);
    return sourced(spec, exam, rule);
  });
}
