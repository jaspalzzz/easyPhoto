import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  allPortalSpecs,
  portalCategory,
  PORTAL_CATEGORY_LABEL,
  type PortalCategory,
} from "@/lib/specRegistry";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Size Requirements (Official, India)",
  titleAbsolute: true,
  description:
    "Official photo and signature size, dimensions and file-size limits for 30+ Indian exam & recruitment forms — SSC, UPSC, IBPS, SBI, RRB, GATE, NDA, NTA (NEET/JEE), RBI, NABARD, LIC, and State PSCs (RPSC, TNPSC, KPSC, UPPSC, BPSC and more). Each with its official source. Resize free in your browser.",
  path: "/exam-requirements/",
});

const photoKb = (min: number | undefined, max: number) =>
  min ? `${min}–${max} KB` : `≤ ${max} KB`;

/** Display order of the topical categories on the directory. */
const CATEGORY_ORDER: PortalCategory[] = [
  "central",
  "banking",
  "state-psc",
  "national",
  "defence",
  "visa",
];

export default function Page() {
  const specs = allPortalSpecs();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: PORTAL_CATEGORY_LABEL[cat],
    items: specs.filter((s) => portalCategory(s.id) === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="container max-w-5xl space-y-8 py-10">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Exam Requirements", path: "/exam-requirements/" },
        ])}
      />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          Exam Photo &amp; Signature Size Requirements
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The exact photo and signature size, dimensions and format each Indian exam
          and recruitment portal requires — with a link to the official source on every
          page. Match these to avoid form rejection, then resize free in your browser.
        </p>
        <p className="text-sm">
          <Link href="/exam-photo-size/" className="font-medium text-brand hover:underline">
            See the full size comparison table →
          </Link>{" "}
          <span className="text-muted-foreground">— all exams&apos; KB &amp; pixel limits in one view.</span>
        </p>
      </header>

      {grouped.map((group) => (
        <section key={group.cat} className="space-y-3">
          <h2 className="eyebrow">{group.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((s) => (
              <Link
                key={s.id}
                href={`/exam-requirements/${s.id}/`}
                className="ep-card group flex items-start gap-3 p-4"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold leading-tight text-ink">
                    {s.name.split(" (")[0]}
                  </span>
                  <span className="spec mt-1 block normal-case tracking-[0.06em]">
                    Photo {photoKb(s.photoMinKb, s.photoLimitKb)}
                    {s.sigLimitKb
                      ? ` · Sign ${photoKb(s.sigMinKb, s.sigLimitKb)}`
                      : ""}
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Need to resize now?</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Pick your exam above for the exact spec, or jump straight to the tools.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link href="/tools/exam-package/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft/50">
            Exam Application Kit
          </Link>
          <Link href="/photo-resize-to-50kb/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize photo to KB
          </Link>
          <Link href="/signature-resize-to-20kb/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize signature
          </Link>
        </div>
      </section>
    </div>
  );
}
