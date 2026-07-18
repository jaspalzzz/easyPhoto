import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortalSpec } from "@/lib/portalPresets";
import {
  allPortalSpecs,
  photoDimsPx,
  portalCategory,
  PORTAL_CATEGORY_LABEL,
  sigDimsPx,
  type PortalCategory,
} from "@/lib/specRegistry";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Faq, type FaqItem } from "@/components/site/Faq";

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Size 2026 — Full List for Indian Exams",
  titleAbsolute: true,
  description:
    "Compare recorded photo and signature requirements for 30+ Indian exam and recruitment forms — SSC, UPSC, IBPS, SBI, RRB, GATE, NDA, NTA, RBI, NABARD, LIC and State PSCs — with source and verification context.",
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
const CATEGORY_ORDER: PortalCategory[] = [
  "central",
  "banking",
  "state-psc",
  "police",
  "national",
  "defence",
  "visa",
];

const FAQS: FaqItem[] = [
  {
    q: "What is the standard photo size for Indian exam forms?",
    a: "Most Indian exam portals want the photo at 20–50 KB and the signature at 10–20 KB, usually around 3.5×4.5 cm. But it varies by exam — UPSC allows up to 200 KB, GATE up to 600 KB, and some State PSCs differ — so always match the exact exam, which is what this table is for.",
  },
  {
    q: "Why do the listed size requirements matter?",
    a: "A portal can flag an upload that exceeds its file-size cap or does not match published dimensions. Prepare the file to the listed requirements and confirm the current notification before submitting.",
  },
  {
    q: "How do I resize my photo to the listed requirements?",
    a: "Pick your exam below to open its page, then use the in-browser resizer for its stored KB target and published dimensions where available. Confirm the current notification. It runs entirely on your device — nothing is uploaded — and it is free with no watermark.",
  },
  {
    q: "How are these sizes sourced?",
    a: "Each exam page shows the named source where available and its verification status. Some presets are marked needs-review. Requirements can change between notification cycles, so confirm on the current portal before submitting.",
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
    <div className="container max-w-5xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Exam Requirements", path: "/exam-requirements/" },
            { name: "Photo & Signature Size List", path: "/exam-photo-size/" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <header className="space-y-3 border-b border-hairline pb-7">
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[2.25rem]">
          Exam Photo &amp; Signature Size — Full List
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Recorded photo and signature sizes for 30+ Indian exam and
          recruitment forms, in one place — file-size (KB) limits and pixel
          dimensions side by side. Find your exam, then resize free in your
          browser. Each exam links to its full preset, named source and
          verification status.
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
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{photoDimsPx(s, "") ?? "Not published"}</td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{sigKb(s)}</td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-ink-soft">{sigDimsPx(s, "") ?? "Not published"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Resize to the selected requirements — free</h2>
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
          <Link href="/tools/resize-kb/?target=50" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize photo to KB
          </Link>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Specs can change between notification cycles — each exam page links to its
        named source and shows its review status. Always verify on the current
        authority portal before submitting.
      </p>

      <section>
        <Faq items={FAQS} noSchema />
      </section>
    </div>
  );
}
