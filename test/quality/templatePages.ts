/**
 * The two template families whose copy is generated from data — the indexed
 * /exam-requirements/<id>/ pages and the *-photo-maker/ pages — rebuilt from the
 * same functions their page components call, so the guideline guards can check
 * them without a build.
 *
 * The composition here mirrors app/exam-requirements/[exam]/page.tsx
 * (`portalFaqItems(spec)`) and app/[maker]/page.tsx (page-specific FAQs, then
 * `countryFaqItems(spec, kind)`). If either page changes how it builds its FAQ,
 * change it here too; scripts/quality-gate.mjs separately checks the rendered
 * JSON-LD against the visible page.
 */
import sitemap from "@/app/sitemap";
import type { FaqItem } from "@/components/site/Faq";
import type { CountrySpec } from "@/lib/countrySpecs";
import { countryFaqItems, portalFaqItems } from "@/lib/faqs";
import { getMakerContent } from "@/lib/makerContent";
import { getMakerPage, labelWithDoc, makerSpec, type MakerKind } from "@/lib/makerPages";
import { PORTAL_PRESETS, type PortalSpec } from "@/lib/portalPresets";
import { SITE_URL } from "@/lib/site";

export interface TemplatePage {
  route: string;
  /** Every way the page names its own subject, longest first. */
  names: string[];
  faqItems: FaqItem[];
}

export interface ExamTemplatePage extends TemplatePage {
  id: string;
  spec: PortalSpec;
}

export interface MakerTemplatePage extends TemplatePage {
  slug: string;
  spec: CountrySpec;
  kind: MakerKind;
}

export function indexedRoutes(): string[] {
  return sitemap().map((entry) => entry.url.replace(SITE_URL, ""));
}

const longestFirst = (names: string[]) =>
  [...new Set(names.map((name) => name.trim()).filter(Boolean))].sort((a, b) => b.length - a.length);

export function examTemplatePages(): ExamTemplatePage[] {
  return indexedRoutes().flatMap((route) => {
    const id = route.match(/^\/exam-requirements\/([^/]+)\/$/)?.[1];
    const spec = id ? PORTAL_PRESETS[id] : undefined;
    if (!id || !spec) return [];
    const shortName = spec.name.split(" (")[0];
    const expansion = spec.name.match(/\(([^)]+)\)/)?.[1] ?? "";
    return [{ route, id, spec, names: longestFirst([spec.name, shortName, expansion]), faqItems: portalFaqItems(spec) }];
  });
}

export function makerTemplatePages(): MakerTemplatePage[] {
  return indexedRoutes().flatMap((route) => {
    const slug = route.match(/^\/([^/]+-photo-maker)\/$/)?.[1];
    const page = slug ? getMakerPage(slug) : undefined;
    const spec = slug ? makerSpec(slug) : undefined;
    if (!slug || !page || !spec) return [];
    const doc = page.kind === "visa" ? "visa" : "passport";
    return [
      {
        route,
        slug,
        spec,
        kind: page.kind,
        names: longestFirst([labelWithDoc(spec.label, doc), spec.label]),
        faqItems: [...(getMakerContent(slug)?.faqs ?? []), ...countryFaqItems(spec, page.kind)],
      },
    ];
  });
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Masks what a template swaps between pages: the page's own subject name
 * becomes `{name}` and every number `#`. Two strings that normalise equal are
 * the same sentence with a different exam or country dropped in.
 */
export function normaliseTemplateText(text: string, names: string[]): string {
  let out = text;
  for (const name of names) {
    // Whole-name matches only, so "India" does not mask the start of "Indian".
    out = out.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(name)}(?![\\p{L}\\p{N}])`, "giu"), "{name}");
  }
  return out
    .replace(/\{name\}(?:\s*\{name\})+/g, "{name}")
    .replace(/\d+(?:[.,]\d+)*/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}
