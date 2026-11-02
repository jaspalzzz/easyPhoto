import { LAUNCH_ORDER } from "@/lib/countrySpecs";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { LISTED_TOOLS } from "@/lib/toolsCatalog";

/**
 * The one place a visible site count comes from. Every page that prints how
 * many tools, exams or countries easyPhoto covers reads these numbers, so the
 * homepage, about page and exam kit can never disagree (the 1 Nov 2026
 * AdSense review found "44 free tools" on /about/ next to "18" on the
 * homepage, and "52+ … each with a published source" beside "39 verified").
 *
 * - tools: tools a visitor can reach from the tools hub (LISTED_TOOLS).
 * - examForms: exam and form settings offered in the exam tools.
 * - examFormsWithOfficialDate: those checked against an official source on a
 *   recorded date; the rest are shown as needing review.
 * - countries: countries with passport or visa photo sizes.
 */
const PRESETS = Object.values(PORTAL_PRESETS);

export const SITE_COUNTS = {
  tools: LISTED_TOOLS.length,
  examForms: PRESETS.length,
  examFormsWithOfficialDate: PRESETS.filter(
    (spec) => spec.verification === "official" && Boolean(spec.verifiedOn),
  ).length,
  countries: LAUNCH_ORDER.length,
} as const;
