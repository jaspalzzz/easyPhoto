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
import { COUNTRY_SPECS, type CountrySpec } from "./countrySpecs";

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
] as const;

/** Countries that get a visa-photo maker page (ordered by demand). */
export const VISA_COUNTRIES = ["us", "canada", "uk", "australia", "schengen"] as const;

export const passportSlug = (id: string) => `${id}-passport-photo-maker`;
export const visaSlug = (id: string) => `${id}-visa-photo-maker`;
export const passportPath = (id: string) => `/${passportSlug(id)}/`;
export const visaPath = (id: string) => `/${visaSlug(id)}/`;

export const makerPath = (kind: MakerKind, id: string) =>
  kind === "visa" ? visaPath(id) : passportPath(id);

/**
 * The single "primary" maker page for a country — used by the homepage grid,
 * where each country links to its most relevant page (passport if it has one,
 * otherwise visa, e.g. Schengen).
 */
export const primaryMakerPath = (id: string) =>
  (PASSPORT_COUNTRIES as readonly string[]).includes(id)
    ? passportPath(id)
    : visaPath(id);

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
