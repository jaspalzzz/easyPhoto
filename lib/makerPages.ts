/**
 * Keyword-rich programmatic maker pages.
 * --------------------------------------
 * Each country gets long-tail landing URLs that match real search queries:
 *   /india-passport-photo-maker/   /us-visa-photo-maker/   …
 * This module is the single source of truth for those slugs/paths so every
 * link, the sitemap, OG cards and the dynamic route stay in sync.
 *
 * The underlying photo engine always crops to `effectivePrintMm(spec)`, so a
 * country's passport and visa pages share the same tool — they differ in copy,
 * metadata and search intent, which is what makes them distinct, indexable
 * pages rather than duplicates.
 */
import { COUNTRY_SPECS, LAUNCH_ORDER, type CountrySpec } from "./countrySpecs";

export type MakerKind = "passport" | "visa";

export interface MakerPage {
  /** URL slug, e.g. "india-passport-photo-maker". */
  slug: string;
  /** Spec id key into COUNTRY_SPECS, e.g. "india" (or "india-evisa"). */
  countryId: string;
  /** Flag code for the <Flag> component (usually the country, e.g. "india"). */
  flag: string;
  kind: MakerKind;
}

/** Countries that get a passport-photo maker page (ordered by demand). */
export const PASSPORT_COUNTRIES = [
  "india",
  "us",
  "canada",
  "uk",
  "australia",
  "pakistan",
  "nepal",
] as const;

/** Countries that get a visa-photo maker page (ordered by demand). */
export const VISA_COUNTRIES = [
  "us",
  "canada",
  "uk",
  "australia",
  "schengen",
  "uae",
  "bahrain",
  "kuwait",
  "qatar",
  "oman",
  "germany",
  "france",
  "italy",
  "spain",
  "portugal",
  "netherlands",
  "ireland",
  "china",
  "singapore",
  "new-zealand",
  "japan",
  "malaysia",
] as const;

export const passportSlug = (id: string) => `${id}-passport-photo-maker`;
export const visaSlug = (id: string) => `${id}-visa-photo-maker`;
export const passportPath = (id: string) => `/${passportSlug(id)}/`;
export const visaPath = (id: string) => `/${visaSlug(id)}/`;

export const makerPath = (kind: MakerKind, id: string) =>
  kind === "visa" ? visaPath(id) : passportPath(id);

/**
 * The single "primary" maker page for a country — used by the homepage grid,
 * hub pickers and footer (passport page if one exists, otherwise visa).
 *
 * Resolve via the REGISTERED maker pages, not by string-building the slug, so
 * manual / non-derivable slugs stay correct. e.g. saudi-evisa's page is
 * /saudi-visa-photo-maker/ — string-building would yield the never-generated
 * /saudi-evisa-visa-photo-maker/ (a 404).
 */
export const primaryMakerPath = (id: string): string => {
  const passport = MAKER_PAGES.find(
    (m) => m.countryId === id && m.kind === "passport"
  );
  if (passport) return `/${passport.slug}/`;
  const visa = MAKER_PAGES.find((m) => m.countryId === id && m.kind === "visa");
  if (visa) return `/${visa.slug}/`;
  return visaPath(id); // fallback: no registered page (not expected for launch countries)
};

export const MAKER_PAGES: MakerPage[] = [
  ...PASSPORT_COUNTRIES.map((id) => ({
    slug: passportSlug(id),
    countryId: id,
    flag: id,
    kind: "passport" as const,
  })),
  ...VISA_COUNTRIES.map((id) => ({
    slug: visaSlug(id),
    countryId: id,
    flag: id,
    kind: "visa" as const,
  })),
  // Manual: the Indian e-Visa is a distinct SQUARE spec ("india-evisa"), so its
  // slug can't be auto-generated from a country id without doubling "visa".
  {
    slug: "india-visa-photo-maker",
    countryId: "india-evisa",
    flag: "india",
    kind: "visa" as const,
  },
  // Manual: the Saudi eVisa is likewise a distinct SQUARE spec ("saudi-evisa").
  {
    slug: "saudi-visa-photo-maker",
    countryId: "saudi-evisa",
    flag: "saudi",
    kind: "visa" as const,
  },
];

export function getMakerPage(slug: string): MakerPage | undefined {
  return MAKER_PAGES.find((m) => m.slug === slug);
}

/** Maker pages of one kind (drives the hub grids + hero choosers). */
export function makerPagesByKind(kind: MakerKind): MakerPage[] {
  return MAKER_PAGES.filter((m) => m.kind === kind);
}

/** Resolve a maker slug to its country spec (or undefined). */
export function makerSpec(slug: string): CountrySpec | undefined {
  const m = getMakerPage(slug);
  return m ? COUNTRY_SPECS[m.countryId] : undefined;
}

/** One entry in a hub's country list (picker chips + size-by-country grid). */
export interface HubCountry {
  /** Stable React key. */
  key: string;
  /** Flag id for the <Flag> component. */
  flag: string;
  /** Display label, e.g. "India" / "Schengen Visa". */
  label: string;
  /** Destination maker page. */
  path: string;
  /** Country spec (for showing print size, etc.). */
  spec: CountrySpec;
}

/**
 * THE single source of truth for a hub's country list. Both the in-hero picker
 * (HeroStarter) and the "size by country" grid (DocPhotoLanding) — and the
 * homepage picker — read from this, so the two sections can never drift apart
 * again. The visa hub lists visa maker pages; the passport hub and homepage
 * list every launch country routed to its primary maker (a bespoke passport
 * page where one exists, otherwise the visa maker — same photo frame).
 */
export function hubCountries(kind: MakerKind): HubCountry[] {
  if (kind === "visa") {
    return makerPagesByKind("visa").map((m) => {
      const spec = COUNTRY_SPECS[m.countryId];
      return { key: m.slug, flag: m.flag, label: spec.label, path: `/${m.slug}/`, spec };
    });
  }
  return LAUNCH_ORDER.map((id) => ({
    key: id,
    flag: id,
    label: COUNTRY_SPECS[id].label,
    path: primaryMakerPath(id),
    spec: COUNTRY_SPECS[id],
  }));
}
