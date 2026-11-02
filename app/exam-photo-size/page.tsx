import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortalSpec } from "@/lib/portalPresets";
import {
  listedPortalSpecs,
  photoSizeLabel,
  portalCategory,
  PORTAL_CATEGORY_LABEL,
  sigSizeLabel,
  specProvenance,
  type PortalCategory,
} from "@/lib/specRegistry";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, type Crumb } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Size 2026 — Full List for Indian Exams",
  titleAbsolute: true,
  description:
    "Compare photo and signature sizes for SSC, UPSC, RRB, IBPS, UP Police, CSIR-NET, PAN, OCI, voter ID and driving licence forms, with the official source for each.",
  path: "/exam-photo-size/",
});

// CLAUDE.md §3: a figure the source doesn't publish (an easyPhoto default) is
// never listed as the requirement.
const NO_LIMIT = "No published limit";
const photoKb = (s: PortalSpec) =>
  // SSC takes no photo file — the form captures it live.
  s.noPhotoUpload
    ? "Live capture"
    : !specProvenance(s).verified
      ? NO_LIMIT
      : s.photoMinKb
        ? `${s.photoMinKb}–${s.photoLimitKb} KB`
        : `≤ ${kbText(s.photoLimitKb)}`;
const sigKb = (s: PortalSpec) =>
  !s.sigLimitKb
    ? "No signature upload"
    : !specProvenance(s).verified
      ? NO_LIMIT
      : s.sigMinKb
        ? `${s.sigMinKb}–${s.sigLimitKb} KB`
        : `≤ ${s.sigLimitKb} KB`;
const shortName = (s: PortalSpec) => s.name.split(" (")[0];
/** 2000 KB reads as the portal's own "2 MB". */
const kbText = (kb: number) => (kb >= 1000 && kb % 1000 === 0 ? `${kb / 1000} MB` : `${kb} KB`);
const joinAnd = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
const CATEGORY_ORDER: PortalCategory[] = [
  "central",
  "banking",
  "state-psc",
  "police",
  "national",
  "defence",
  "visa",
];

/** "There is no standard size" — answered from the table's own rows. */
function standardSizeAnswer(specs: PortalSpec[]): string {
  const uploads = specs.filter((s) => !s.noPhotoUpload && specProvenance(s).verified);
  const live = specs.filter((s) => s.noPhotoUpload).map(shortName);
  if (uploads.length < 2) {
    return "There isn't one: each form sets its own limits, so open your form's page.";
  }
  const byCap = [...uploads].sort((a, b) => a.photoLimitKb - b.photoLimitKb);
  const smallest = byCap[0];
  const largest = byCap[byCap.length - 1];
  const liveText = live.length
    ? ` ${joinAnd(live)} take${live.length === 1 ? "s" : ""} no photo file at all: the form captures your photo live.`
    : "";
  return (
    `There isn't one. In this table the largest photo file allowed runs from ` +
    `${kbText(smallest.photoLimitKb)} (${shortName(smallest)}) to ${kbText(largest.photoLimitKb)} (${shortName(largest)}).` +
    liveText +
    " Match the limits of the exact form you are filling in."
  );
}

function faqs(specs: PortalSpec[]): FaqItem[] {
  return [
    { q: "Is there a standard photo size for Indian exam forms?", a: standardSizeAnswer(specs) },
    {
      q: "How do I resize my photo to these sizes?",
      a: "Open your form's page from the table and use its resizer, which is set to that form's KB band and, where the notice gives one, its pixel size. It runs on your device, so nothing is uploaded, and it's free with no watermark.",
    },
    {
      q: "Where do these sizes come from?",
      a: "Each form's page links to the official notice or portal the sizes come from, with the date we last checked it. A new notice can change them, so check the form you are filling in before you submit.",
    },
  ];
}

export default function Page() {
  const specs = listedPortalSpecs();
  const FAQS = faqs(specs);
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: PORTAL_CATEGORY_LABEL[cat],
    items: specs.filter((s) => portalCategory(s.id) === cat),
  })).filter((g) => g.items.length > 0);

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Exam Requirements", path: "/exam-requirements/" },
    { name: "Photo & Signature Size List", path: "/exam-photo-size/" },
  ];

  return (
    <div className="container max-w-5xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          faqSchema(FAQS),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[36px]">
          Exam Photo &amp; Signature Size — Full List
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The photo and signature limits for {specs.length} Indian exam,
          recruitment and ID forms in one table, so you can compare them without
          opening each page. Where a notice gives no pixel size, the table says
          so. Each row links to that form&apos;s page, with its source and a resizer.
        </p>
      </header>

      {grouped.map((group) => (
        <section key={group.cat} className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">{group.label}</h2>
          <div className="overflow-x-auto rounded-lg border border-hairline">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline bg-paper text-left">
                  <th className="px-3 py-2.5 font-semibold">Exam / form</th>
                  <th className="px-3 py-2.5 font-semibold">Photo file</th>
                  <th className="px-3 py-2.5 font-semibold">Photo size</th>
                  <th className="px-3 py-2.5 font-semibold">Signature file</th>
                  <th className="px-3 py-2.5 font-semibold">Signature size</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((s) => (
                  <tr key={s.id} className="border-b border-hairline last:border-0 hover:bg-accent/30">
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/exam-requirements/${s.id}/`}
                        className="font-medium text-foreground hover:text-brand hover:underline"
                      >
                        {shortName(s)}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[14px] text-ink-soft">{photoKb(s)}</td>
                    <td className="px-3 py-2.5 font-mono text-[14px] text-ink-soft">{s.noPhotoUpload ? "—" : (photoSizeLabel(s) ?? "Not published")}</td>
                    <td className="px-3 py-2.5 font-mono text-[14px] text-ink-soft">{sigKb(s)}</td>
                    <td className="px-3 py-2.5 font-mono text-[14px] text-ink-soft">{!s.sigLimitKb ? "—" : (sigSizeLabel(s) ?? "Not published")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Resize your photo and signature</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Open your exam&apos;s page for all its rules and its resizer, or go
          straight to a tool.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link href="/exam-requirements/" className="inline-flex items-center gap-1 rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft/50">
            All exam requirements <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/tools/exam-package/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Exam Application Kit
          </Link>
          <Link href="/tools/resize-kb/?target=50" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize photo to KB
          </Link>
        </div>
      </section>

      <section>
        <Faq items={FAQS} noSchema />
      </section>
    </div>
  );
}
