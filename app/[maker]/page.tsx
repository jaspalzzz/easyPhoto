import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, X } from "lucide-react";
import {
  acceptsDigitalUpload,
  effectivePrintMm,
  formatFileSize,
  specForDocumentKind,
  type CountrySpec,
} from "@/lib/countrySpecs";
import {
  MAKER_PAGES,
  getMakerPage,
  makerSpec,
  labelWithDoc,
  type MakerKind,
} from "@/lib/makerPages";
import { getMakerContent } from "@/lib/makerContent";
import { HeadSizeGuide } from "@/components/site/HeadSizeGuide";
import { PhotoTool } from "@/components/tool/PhotoTool";
import { SupportCard } from "@/components/site/SupportCard";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
  type Crumb,
} from "@/lib/schema";
import { clampDescription, firstSentence, pageMetadata } from "@/lib/seo";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { Faq } from "@/components/site/Faq";
import { countryFaqItems } from "@/lib/faqs";
import { CountrySpecificationProvenance } from "@/components/site/SpecificationProvenance";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

// Static export: one page per maker slug (passport + visa).
export function generateStaticParams() {
  return MAKER_PAGES.map((m) => ({ maker: m.slug }));
}

export const dynamicParams = false;

const HUB = {
  passport: { name: "Passport Photo Maker", path: "/passport-photo/" },
  visa: { name: "Visa Photo Maker", path: "/visa-photo/" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ maker: string }>;
}): Promise<Metadata> {
  const { maker } = await params;
  const page = getMakerPage(maker);
  const spec = makerSpec(maker);
  if (!page || !spec) return {};
  const mm = effectivePrintMm(spec);
  const doc = page.kind === "visa" ? "visa" : "passport";
  // "Exact" is only honest when the figures came from the issuing authority.
  // 14 of the country records are sourced from aggregators rather than a
  // government page, and claiming exactness for those is the same overclaim the
  // exam presets had removed. Those pages describe what is recorded and tell
  // the reader to confirm it instead.
  const fromGovernment = spec.verified === "gov";
  // Only the first sentence of the background prose, with its full stop
  // removed: the registry field is written for the page body and runs to a
  // paragraph on some records, which pushed 13 of these descriptions past the
  // snippet limit and doubled the full stop before "Make one free".
  const background = firstSentence(spec.background.description);
  const description = clampDescription(
    fromGovernment
      ? `Exact ${labelWithDoc(spec.label, doc)} photo requirements: ${mm.width}×${mm.height}mm, ${background}. Free, nothing uploaded.`
      : `${labelWithDoc(spec.label, doc)} photo at ${mm.width}×${mm.height}mm, ${background}. Confirm current requirements. Free, nothing uploaded.`,
  );
  return pageMetadata({
    title: PAGE_TITLE[spec.id] ?? `${labelWithDoc(pageLabel(spec), doc, doc === "visa" ? "Visa" : "Passport")} Photo Size & Maker`,
    description,
    path: `/${maker}/`,
  });
}

/**
 * Page-only names, keyed by spec id, where searchers use a different name from
 * the shared label (which also appears on country cards across the site).
 * uae (owner, 15 Oct 2026): Indians search "dubai visa photo size" and "sharjah
 * visa photo size"; this page covers GDRFA Dubai's channel.
 */
const PAGE_LABEL: Record<string, string> = {
  uae: "UAE & Dubai",
};
const pageLabel = (spec: { id: string; label: string }) => PAGE_LABEL[spec.id] ?? spec.label;

/**
 * Whole-title and H1 overrides, keyed by spec id, where searchers' words don't
 * fit the "<Country> Passport Photo Size & Maker" pattern. No unverified size
 * goes in a title (CLAUDE.md §3).
 * nepal (owner, 15 Oct 2026): "mrp size photo" (263), "mrp photo size" (72) and
 * "mrp size" had 0 clicks at ~2–8 (GSC, 90 days); "MRP size" is Nepal's
 * everyday name for the standard form photo.
 */
const PAGE_TITLE: Record<string, string> = {
  nepal: "Nepal MRP Size Photo & Passport Photo Maker",
};
const PAGE_H1: Record<string, string> = {
  nepal: "Nepal MRP Size Photo Maker",
};

/**
 * User-facing "Good to know" copy, keyed by spec id. Kept here (not in the spec
 * DB) so the internal `spec.notes` developer documentation never reaches users.
 * A page without an entry shows no Good to know text: every point it used to
 * carry is now said once, in the intro, the notes or the page sections.
 */
const GOOD_TO_KNOW: Record<string, string> = {
  italy:
    "Italy's visa application centres are run by the Italy Visa Management Service, an outsourced operator rather than an Italian government office. It asks for a colour photo of 30×40 mm or 35×45 mm (this maker uses 35×45 mm), with your face filling 70–80% of the frame, on a white background with no border, taken in the last six months. Italy is a Schengen state, so the EU Visa Code is the rule that binds; check with the consulate handling your application before you submit.",
  oman:
    "Sources disagree on the size of an Oman visa photo. The Royal Oman Police eVisa is usually described as taking 35×45 mm, and that is the size this maker starts with, but widely shared guides also give 40×60 mm for applications made at a counter or consulate. We could not find a public ROP page that states a size, so take the figure from the application you are actually filling in before you print or upload.",
  france:
    "France-Visas follows the ICAO biometric standard: a 35×45 mm photo (France gives the width as 35–40 mm), with a 32–36 mm face, which is 70–80% of the height. It must be no older than six months, against a plain light-coloured background. France allows any width from 35 to 40 mm, so a standard 35×45 mm print fits. This maker picks light grey for the background; check the current France-Visas or consulate instructions before you submit.",
  germany:
    "Germany follows the ICAO biometric standard: a 35×45 mm photo with your face filling 70–80% of the height, about 32–36 mm from chin to crown. Its own background rule is about contrast: one plain, bright colour, ideally neutral grey, that stands out clearly from your face and hair. White is not ruled out. These points come from the sample-photo template the German missions publish with the Federal Foreign Office and the Bundesdruckerei.",
  netherlands:
    "The Dutch government portal asks for a 35×45 mm colour photo in which your face measures 26–30 mm from chin to crown (for anyone aged 11 or over) and 16–20 mm across, on a plain light grey, light blue or white background; the photo must be no more than six months old, and prints need at least 400 DPI. The Netherlands applies these national rules to Schengen visa applications made to it, and its visa checklist asks for a photo that meets them, so this maker sizes your head smaller than the German or French makers do. If you apply through an external service provider, they take a digital photo at your appointment.",
  china:
    "China uses an unusual size: 33×48 mm rather than the common 35×45, on a white background, with your head 28–33 mm from chin to crown. For a digital upload through COVA or a consulate, guides give a JPEG of 354×472 to 420×560 pixels and 40–120 KB. The Chinese Visa Application Service Centre's FAQ confirms the 48×33 mm print; the pixel and KB ranges are consistent across reputable guides but do not appear on that page, so confirm them on the consulate or COVA portal before you submit.",
  "new-zealand":
    "For a New Zealand visa or NZeTA, a print is 35×45 mm on a plain light or neutral background such as light grey, off-white or cream. An online photo must be a portrait JPEG in a 3:4 ratio, from 900×1200 up to 2250×3000 pixels, and between 512 KB and 3.14 MB: Immigration New Zealand rejects a file that is too small as well as one that is too large. Your face should cover 70–80% of the frame, the picture must be recent (from within six months), and photos altered with AI editing tools are not accepted.",
  malaysia:
    "Malaysia uses a distinctive 35×50 mm photo on a plain white background (light grey or cream is sometimes accepted), with your head 30–35 mm tall, which fills 60–70% of the frame. A dark-coloured shirt is recommended so you stand out from the background. Published guides agree that the eVisa upload must be a JPEG of roughly 10 to 120 KB, a tight band, but no Immigration Department page states it, so check the limit shown on the eVisa form before you submit.",
  "saudi-evisa":
    "The official visa.visitsaudi.com photo page sets the eVisa photo exactly: 200×200 pixels, 5–100 KB, on a white background with no pattern or shadows. Your face should fill 70–80% of the photo, with your head square to the camera so both ears and cheeks show, and the photo must not be older than six months. Head coverings are allowed for religious reasons only. A paper application at the consulate uses a 4×6 cm print instead; this maker prepares the eVisa upload.",
  nepal:
    "In Nepal, “MRP size photo” is the everyday name for the standard photo many forms ask for. Guides agree on 35×45 mm on plain white, though the Department of Passports does not publish it, and want a photo taken in the past six months. Several copies fit on one 4×6 inch print sheet; match the size against the form in front of you.",
  "india-evisa":
    "The Indian e-Visa photo is square, not the 35×45mm passport shape, on a plain white or light background with no border. Keep it between 350×350 and 1000×1000 px and under about 300 KB for the upload.",
};

/**
 * What each staying maker page's application actually involves, keyed by spec
 * id. The shared frame used to show every block on every page — a KB resize
 * strip on print-only routes, a "required band" placeholder where no head
 * percentage is published — and those empty blocks read as a template.
 *
 * - `noUpload`: the route takes prints or a live capture, so no file-size help.
 * - `kbUnpublished`: a file is uploaded but its KB figure is our own default.
 * - `uploadNote`: the page's own sentence about the upload limit.
 * - `printed: false`: nothing is printed, so print rows are hidden.
 * - `digitalSize` / `heroSize`: the published file size where the registry's
 *   fields would describe it less exactly (Pakistan states one exact size).
 * - `notesHeading`: the heading over this application's own notes.
 */
interface RouteFacts {
  noUpload?: boolean;
  kbUnpublished?: boolean;
  uploadNote?: string;
  printed?: boolean;
  digitalSize?: string;
  heroSize?: string;
  notesHeading?: string;
}

const ROUTE: Record<string, RouteFacts> = {
  us: { uploadNote: "Both sizes below fit online renewal and the DS-160 limit." },
  india: {
    kbUnpublished: true,
    uploadNote:
      "No file-size limit is published for this photo. If the screen you upload to states one, compress the finished photo to it.",
  },
  pakistan: {
    printed: false,
    digitalSize: "350 × 467 px",
    heroSize: "350 × 467 px",
    notesHeading: "Which Pakistani route this file is for",
  },
  uae: {
    uploadNote:
      "Typing centres, GDRFA and ICP each set their own file limit. Compress the finished photo to the one shown where you submit it.",
    notesHeading: "Which UAE applications this size is for",
  },
  nepal: { noUpload: true, notesHeading: "When you need to bring a photo" },
  ireland: { noUpload: true, notesHeading: "Two prints, with writing on the back" },
  australia: { noUpload: true },
  canada: { noUpload: true },
};

/** Passport pages where a baby's printed photo is a real case. */
const BABY_GUIDE = new Set(["india", "us", "uk", "australia", "nepal"]);

/** The background rule, without the trailing "no shadows" clause. */
function backgroundLabel(spec: CountrySpec): string {
  return spec.background.description
    .split(/\s\(|;/)[0]
    .replace(/,\s*(?:uniform|no\s).*$/i, "")
    .trim();
}

/** "a"/"an" for a country label in running prose. */
const article = (word: string) => (/^[AEIOU]/i.test(word) ? "an" : "a");

/** The published pixel figures, or null when only a print conversion exists. */
function digitalSize(spec: CountrySpec): string | null {
  const route = ROUTE[spec.id];
  if (route?.digitalSize) return route.digitalSize;
  const d = spec.digital;
  if (d.px) return `${d.px.width} × ${d.px.height} px`;
  if (d.pxMin && d.pxMax) {
    return `${d.pxMin.width} × ${d.pxMin.height} to ${d.pxMax.width} × ${d.pxMax.height} px`;
  }
  if (d.pxMin) return `at least ${d.pxMin.width} × ${d.pxMin.height} px`;
  return null;
}

function hasUpload(spec: CountrySpec): boolean {
  return !ROUTE[spec.id]?.noUpload && acceptsDigitalUpload(spec);
}

/** Up to three resize sizes that sit inside the published KB range. */
function kbChoices(spec: CountrySpec): number[] {
  const band = spec.digital.fileSizeKb;
  if (!band || ROUTE[spec.id]?.kbUnpublished) return [];
  const inside = KB_TARGETS.filter(
    (kb) => kb >= (band.min ?? 0) && kb <= band.max && (spec.id !== "us" || kb <= 240),
  );
  return inside.slice(-3);
}

/** The glasses line for the photo checklist, from the country's own rule. */
function glassesToAvoid(glasses: CountrySpec["glasses"]): string {
  if (glasses === true) return "Glare or tint on glasses";
  if (glasses === false) return "Glasses";
  if (/medical/i.test(glasses)) return "Glasses, unless you need them for a medical reason";
  if (/only if you have to/i.test(glasses)) return "Glasses you could take off, and any tint or glare";
  if (/^allowed/i.test(glasses)) return "Glare or tint on glasses";
  if (/discouraged|if possible|avoid/i.test(glasses)) return "Glasses, if you can take them off";
  return "Glasses";
}

function PhotoChecklist({ spec }: { spec: CountrySpec }) {
  const dos = [
    "A plain, evenly lit wall behind you",
    "Face the camera straight on, head level",
    "A neutral expression, mouth closed, eyes open",
    "A recent photo that shows how you look now",
  ];
  const avoid = [
    "Shadows on your face or the wall behind you",
    glassesToAvoid(spec.glasses),
    "Hair across the eyes, hats or caps",
    "Filters, beauty smoothing, or a crop from a group photo",
  ];
  return (
    <section className="rounded-xl border border-hairline bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight text-ink">Before you take the photo</h2>
      <div className="mt-2.5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Do</h3>
          <ul className="mt-1.5 space-y-1.5">
            {dos.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-ink-soft">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(142_55%_34%)]" strokeWidth={2.25} />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Avoid</h3>
          <ul className="mt-1.5 space-y-1.5">
            {avoid.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-ink-soft">
                <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(0_70%_50%)]" strokeWidth={2.25} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 text-sm last:border-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="text-right font-mono text-[14px] font-medium tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function SpecSheet({ spec }: { spec: CountrySpec }) {
  const route = ROUTE[spec.id];
  const printed = route?.printed !== false;
  const mm = effectivePrintMm(spec);
  const upload = hasUpload(spec);
  const px = upload ? digitalSize(spec) : null;
  const band = spec.digital.fileSizeKb;
  const kb = !upload
    ? null
    : band && !route?.kbUnpublished
      ? formatFileSize(band)
      : route?.kbUnpublished
        ? "none published"
        : "set by each portal";

  return (
    <dl>
      {printed && <SpecRow label="Print size" value={`${mm.width} × ${mm.height} mm`} />}
      <SpecRow
        label="Head height"
        value={`${spec.headHeightMm.min}–${spec.headHeightMm.max} mm (chin to crown)`}
      />
      <SpecRow
        label="Background"
        value={
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-3.5 w-3.5 shrink-0 rounded-[2px] border border-hairline-strong"
              style={{ backgroundColor: spec.background.hex }}
            />
            {backgroundLabel(spec)}
          </span>
        }
      />
      {px && <SpecRow label="Digital size" value={px} />}
      {kb && <SpecRow label="File size" value={kb} />}
      {printed && <SpecRow label="Print resolution" value={`at least ${spec.dpiMin} DPI`} />}
      <SpecRow
        label="Glasses"
        value={
          typeof spec.glasses === "boolean"
            ? spec.glasses
              ? "Allowed"
              : "Not allowed"
            : spec.glasses
        }
      />
      <SpecRow label="Expression" value={spec.smileAllowed} />
    </dl>
  );
}

export default async function MakerPage({
  params,
}: {
  params: Promise<{ maker: string }>;
}) {
  const { maker } = await params;
  const page = getMakerPage(maker);
  const spec = makerSpec(maker);
  if (!page || !spec) notFound();
  const kind: MakerKind = page.kind;
  const doc = kind === "visa" ? "visa" : "passport";
  const Doc = kind === "visa" ? "Visa" : "Passport";
  const hub = HUB[kind];
  const mm = effectivePrintMm(spec);
  const route = ROUTE[spec.id];
  const content = getMakerContent(maker);
  const goodToKnow = GOOD_TO_KNOW[spec.id];
  const upload = hasUpload(spec);
  const kbSizes = kbChoices(spec);
  const docLabel = labelWithDoc(spec.label, doc);
  // Page-specific FAQs, then any country caveat. No generic spec questions:
  // the spec card already answers them.
  const faqItems = [
    ...(content?.faqs ?? []),
    ...countryFaqItems(spec, kind),
  ];

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: hub.name, path: hub.path },
    { name: `${labelWithDoc(pageLabel(spec), doc)} photo`, path: `/${maker}/` },
  ];

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          softwareApplicationSchema({
            name: PAGE_H1[spec.id] ?? `${labelWithDoc(pageLabel(spec), doc, Doc)} Photo Maker`,
            description: `Prepare ${article(docLabel)} ${docLabel} photo in your browser, then confirm the current instructions for your application.`,
            url: `/${maker}/`,
          }),
          faqItems.length > 0 ? faqSchema(faqItems) : null,
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[36px]">
          {PAGE_H1[spec.id] ?? <>{labelWithDoc(pageLabel(spec), doc, Doc)} Photo Maker</>}
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {content?.intro ??
            `Prepare ${article(docLabel)} ${docLabel} photo at ${mm.width}×${mm.height}mm. Confirm the current instructions for your application before submitting.`}
        </p>
        <div className="spec flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
          <span>{route?.heroSize ?? `${mm.width}×${mm.height}mm`}</span>
          <span className="text-ink-faint">/</span>
          <span>{backgroundLabel(spec)}</span>
          {route?.printed !== false && (
            <>
              <span className="text-ink-faint">/</span>
              <span>{spec.dpiMin} dpi min</span>
            </>
          )}
        </div>
        <p className="text-xs text-ink-faint">
          {spec.verified === "gov" ? (
            <>Prepared for the published requirements of: {spec.documents.join(", ")}.</>
          ) : spec.verified === "conditional" ? (
            <>Covers: {spec.documents.join(", ")}.</>
          ) : (
            <>
              Covers: {spec.documents.join(", ")}. Not every figure here is stated on
              an official page, so confirm them on your application before you submit.
            </>
          )}
        </p>
      </header>

      {/* Advisory scoping lives in specForDocumentKind so it can be tested. */}
      <PhotoTool spec={specForDocumentKind(spec, kind)} />
      <SupportCard tool={maker} />

      {spec.applicationNotes && spec.applicationNotes.length > 0 && (
        <section className="mt-10 space-y-3 border-t border-hairline pt-8">
          <h2 className="text-lg font-semibold">
            {route?.notesHeading ?? `About the ${spec.label} application`}
          </h2>
          <ul className="max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground">
            {spec.applicationNotes.map((note) => (
              <li key={note.slice(0, 40)} className="flex gap-2.5">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PhotoChecklist spec={spec} />

      {/* The diagram states the head percentage, so it only appears where one
          is published (Canada publishes millimetres only). */}
      {spec.headPercentOfFrame && <HeadSizeGuide spec={spec} />}

      {BABY_GUIDE.has(spec.id) && (
        <p className="text-sm text-muted-foreground">
          Making a passport photo for a baby or infant?{" "}
          <Link href="/baby-passport-photo/" className="text-brand hover:underline">
            Use the baby &amp; infant guide
          </Link>{" "}
          — the lay-on-a-white-sheet method makes it easy.
        </p>
      )}

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="eyebrow">{docLabel} photo requirements</h2>
          <SpecSheet spec={spec} />
          <CountrySpecificationProvenance spec={spec} />
        </div>
        {goodToKnow && (
          <div className="space-y-3">
            <h2 className="eyebrow">Good to know</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{goodToKnow}</p>
          </div>
        )}
      </section>

      {/* Unique editorial content — country/kind-specific */}
      {content && content.sections.length > 0 && (
        <section className="space-y-6">
          {content.sections.map((s) => (
            <div key={s.h} className="space-y-2">
              <h2 className="text-lg font-semibold">{s.h}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.p}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* File-size help, only where a file is uploaded. Sizes offered sit
          inside the published range; with no range, only the custom tool. */}
      {upload && (
        <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
          <h2 className="text-base font-semibold tracking-tight">Fitting the upload limit</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {route?.uploadNote ??
              (spec.digital.fileSizeKb && kbSizes.length > 0
                ? "These sizes sit inside the published limit."
                : spec.digital.fileSizeKb
                  ? `The published limit is ${formatFileSize(spec.digital.fileSizeKb)}.`
                  : "Compress the finished photo to the limit shown where you upload it.")}{" "}
            Your image stays in your browser.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {kbSizes.map((kb) => (
              <Link
                key={kb}
                href={kbPath(kb)}
                className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[14px] font-medium text-foreground transition-colors hover:border-ink/30 hover:bg-accent/50"
              >
                Resize to {kb} KB
              </Link>
            ))}
            <Link
              href="/tools/resize-kb/"
              className="rounded-md border border-hairline-strong bg-card px-3 py-1.5 text-[14px] font-medium text-brand transition-colors hover:bg-brand-soft/50"
            >
              {kbSizes.length > 0 ? "Custom size" : "Compress to a KB size"}
            </Link>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section>
          <Faq items={faqItems} noSchema />
        </section>
      )}
    </div>
  );
}
