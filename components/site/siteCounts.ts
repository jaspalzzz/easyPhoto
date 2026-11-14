import { isDeindexed } from "@/lib/deindexed";
import { hubCountries } from "@/lib/makerPages";
import { PORTAL_PRESETS } from "@/lib/portalPresets";
import { LISTED_TOOLS } from "@/lib/toolsCatalog";

/**
 * The one place a visible site count comes from. Every page that prints how
 * many tools, exams or countries easyPhoto covers reads these numbers, so the
 * homepage, about page and exam kit can never disagree (the 1 Nov 2026
 * AdSense review found "44 free tools" on /about/ next to "18" on the
 * homepage, and "52+ … each with a published source" beside "39 verified").
 *
 * A count shown beside a link must match what that link opens. Until
 * 14 Nov 2026 the homepage and /about/ printed the size of the data registries
 * ("52 exams & forms", "26 countries") while the pages they led to listed 11
 * forms and 9 countries, because the rest had been retired or hidden as thin.
 * A visitor, or an AdSense reviewer, who followed the link saw a claim the
 * site did not back. So the counts are split by what they describe:
 *
 * - tools: tools a visitor can reach from the tools hub (LISTED_TOOLS).
 * - examPages: exam and ID forms that have their own requirements page, which
 *   is what /exam-requirements/ and /exam-photo-size/ list.
 * - examPagesWithOfficialDate: those pages whose figures were checked against
 *   an official source on a recorded date.
 * - countryPages: countries and regions a visitor can pick in the passport and
 *   visa makers (each has a page with its size and source).
 * - examKitForms: exam and form settings offered inside the Exam Application
 *   Kit and the checker. Only those two tools may print this number.
 * - examKitFormsWithOfficialDate: kit settings checked against an official
 *   source on a recorded date; the kit shows the rest as needing review.
 */
const PRESETS = Object.values(PORTAL_PRESETS);

const hasOfficialDate = (spec: (typeof PRESETS)[number]) =>
  spec.verification === "official" && Boolean(spec.verifiedOn);

// Same rule as listedPortalSpecs() in lib/specRegistry.ts, repeated here so
// the navigation bundle does not pull the whole registry module in;
// test/siteCounts.test.ts fails if the two ever differ.
const LISTED_FORMS = PRESETS.filter(
  (spec) => !isDeindexed(`/exam-requirements/${spec.id}/`),
);

const COUNTRY_PAGE_PATHS = new Set(
  [...hubCountries("passport"), ...hubCountries("visa")].map((c) => c.path),
);

export const SITE_COUNTS = {
  tools: LISTED_TOOLS.length,
  examPages: LISTED_FORMS.length,
  examPagesWithOfficialDate: LISTED_FORMS.filter(hasOfficialDate).length,
  countryPages: COUNTRY_PAGE_PATHS.size,
  examKitForms: PRESETS.length,
  examKitFormsWithOfficialDate: PRESETS.filter(hasOfficialDate).length,
} as const;
