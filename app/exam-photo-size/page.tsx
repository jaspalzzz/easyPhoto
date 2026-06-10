import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortalSpec } from "@/lib/portalPresets";
import {
  allPortalSpecs,
  portalCategory,
  PORTAL_CATEGORY_LABEL,
  type PortalCategory,
} from "@/lib/specRegistry";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Size — Full List for Indian Exams (Official)",
  titleAbsolute: true,
  description:
    "The complete, official photo and signature size list for 30+ Indian exam and recruitment forms — SSC, UPSC, IBPS, SBI, RRB, GATE, NDA, NTA, RBI, NABARD, LIC and State PSCs. Compare KB limits and pixel dimensions in one table, each with its source.",
  path: "/exam-photo-size/",
});

const photoKb = (s: PortalSpec) =>
  s.photoMinKb ? `${s.photoMinKb}–${s.photoLimitKb} KB` : `≤ ${s.photoLimitKb} KB`;
const sigKb = (s: PortalSpec) =>
  s.sigLimitKb
    ? s.sigMinKb
      ? `${s.sigMinKb}–${s.sigLimitKb} KB`
      : `≤ ${s.sigLimitKb} KB`
    : "—";
const px = (w?: number, h?: number) => (w && h ? `${w}×${h}` : "cm-based");

const CATEGORY_ORDER: PortalCategory[] = [
  "central",
  "banking",
  "state-psc",
  "national",
  "defence",
  "visa",
];

const FAQS: FaqItem[] = [
  {
    q: "What is the standard photo size for Indian exam forms?",
    a: "Most Indian exam portals want the photo at 20–50 KB and the signature at 10–20 KB, usually around 3.5×4.5 cm (≈200×230 to 350×450 px). But it varies by exam — UPSC allows up to 300 KB, GATE up to 600 KB, and some State PSCs differ — so always match the exact exam, which is what this table is for.",
  },
  {
    q: "Why does the exact size matter so much?",
    a: "Online exam portals reject uploads that are over the file-size cap or the wrong dimensions, which can cost you the application window. Matching the exact KB and pixel spec for your exam avoids rejection.",
  },
  {
    q: "How do I resize my photo to the exact size?",
    a: "Pick your exam below to open its page, then use the in-browser resizer to hit the exact KB and dimensions. It runs entirely on your device — nothing is uploaded — and it's free with no watermark.",
  },
  {
    q: "Are these sizes official?",
    a: "Yes. Each exam's page links to the official government source the numbers were confirmed against, with the date. Specs can change between notification cycles, so confirm on the official portal before you submit.",
  },
];

export default function Page() {
  const specs = allPortalSpecs();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: PORTAL_CATEGORY_LABEL[cat],
    items: specs.filter((s) => portalCategory(s.id) === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="container max-w-4xl space-y-8 py-10">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Exam Requirements", path: "/exam-requirements/" },
          { name: "Photo & Signature Size List", path: "/exam-photo-size/" },
        ])}
      />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          Exam Photo &amp; Signature Size — Full List
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The official photo and signature size for 30+ Indian exam and
          recruitment forms, in one place — file-size (KB) limits and pixel
          dimensions side by side. Find your exam, then resize free in your
          browser. Each exam links to its full spec with the official source.
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
                  <th className="px-3 py-2.5 font-semibold">Photo</th>
                  <th className="px-3 py-2.5 font-semibold">Photo px</th>
                  <th className="px-3 py-2.5 font-semibold">Signature</th>
                  <th className="px-3 py-2.5 font-semibold">Sig px</th>
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
                        {s.name.split(" (")[0]}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{photoKb(s)}</td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{px(s.photoWidthPx, s.photoHeightPx)}</td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{sigKb(s)}</td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{px(s.sigWidthPx, s.sigHeightPx)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Resize to the exact size — free</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Found your exam? Open its page for the full spec and the in-browser
          resizer, or jump straight to a tool. Everything runs on your device —
          nothing is uploaded.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link href="/exam-requirements/" className="inline-flex items-center gap-1 rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft/50">
            All exam requirements <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/tools/exam-package/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Exam Application Kit
          </Link>
          <Link href="/photo-resize-to-50kb/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize photo to KB
          </Link>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Specs can change between notification cycles — each exam page links to its
        official source and the date it was confirmed. Always verify on the
        official portal before submitting.
      </p>

      <section>
        <Faq items={FAQS} />
      </section>
    </div>
  );
}
