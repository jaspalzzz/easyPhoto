import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  listedPortalSpecs,
  portalCategory,
  specProvenance,
  PORTAL_CATEGORY_LABEL,
  type PortalCategory,
} from "@/lib/specRegistry";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema, type Crumb } from "@/lib/schema";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = pageMetadata({
  title: "Exam Photo & Signature Size Requirements 2026 — India",
  titleAbsolute: true,
  description:
    "Photo and signature sizes for SSC, UPSC, RRB, IBPS, CSIR-NET, PAN, voter ID and other Indian forms, each with its official source and the date we checked it.",
  path: "/exam-requirements/",
});

// 2000 KB reads as the portal's own "2 MB".
const photoKb = (min: number | undefined, max: number) =>
  min ? `${min}–${max} KB` : max >= 1000 && max % 1000 === 0 ? `≤ ${max / 1000} MB` : `≤ ${max} KB`;

/** Display order of the topical categories on the directory. */
const CATEGORY_ORDER: PortalCategory[] = [
  "central",
  "banking",
  "state-psc",
  "police",
  "national",
  "defence",
  "visa",
];

export default function Page() {
  const specs = listedPortalSpecs();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: PORTAL_CATEGORY_LABEL[cat],
    items: specs.filter((s) => portalCategory(s.id) === cat),
  })).filter((g) => g.items.length > 0);

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Exam Requirements", path: "/exam-requirements/" },
  ];

  return (
    <div className="container max-w-5xl space-y-8 py-10">
      <JsonLd
        schema={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: "Exam Photo & Signature Size Requirements 2026",
            description:
              "Photo and signature sizes for Indian exam, recruitment and ID forms, each with its official source and the date it was checked.",
            url: "/exam-requirements/",
          }),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />

      <header className="space-y-3 border-b border-hairline pb-7">
        <span className="eyebrow block text-brand">Indian exams &amp; recruitment</span>
        <h1 className="text-3xl font-semibold tracking-tightest sm:text-[36px]">
          Exam Photo &amp; Signature Size Requirements
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Pick your exam to open its page. Each one gives the photo and signature
          sizes from the official notice, links to that notice with the date we
          checked it, and has a resizer already set to those sizes. Check the
          instructions on the form itself before you submit.
        </p>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          If you would rather see every exam&apos;s numbers side by side instead of
          opening them one at a time, the{" "}
          <Link href="/exam-photo-size/" className="font-medium text-brand hover:underline">
            full size comparison
          </Link>{" "}
          puts the KB limits and pixel dimensions in one table.
        </p>
      </header>

      <section className="rounded-lg border border-hairline bg-paper p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Before you use these pages
        </h2>
        <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Each page names the notice its sizes come from and the date we last
            checked it. Exam bodies issue a new notice for each recruitment and
            can change the upload rules between them, so if the form you are
            filling in shows different limits, follow the form.
          </p>
          <p>
            A file has to pass several separate checks: its size in KB, its width
            and height in pixels, and its file type. A photo can be small enough in
            KB and still be the wrong shape. Renaming a PNG to .jpg does not make it
            a JPG, so save it again as a JPG instead. Where a notice gives no pixel
            size, the page says so rather than borrowing one from another exam.
          </p>
          <p>
            The resizers work in your browser and only prepare the file. They
            can&apos;t take a live photo for you or tell you what the exam body will
            decide. Keep your original photo and signature, so you can make a new
            file if the form asks for something different.
          </p>
        </div>
      </section>

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
                    {/* CLAUDE.md §3: an easyPhoto default is never listed as the size. */}
                    {!specProvenance(s).verified ? (
                      "No published size limit"
                    ) : s.noPhotoUpload ? (
                      "Photo: live capture"
                    ) : (
                      <>Photo {photoKb(s.photoMinKb, s.photoLimitKb)}</>
                    )}
                    {s.sigLimitKb && specProvenance(s).verified
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
          Pick your exam above for its sizes, or go straight to a tool.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Link href="/tools/exam-package/" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft/50">
            Exam Application Kit
          </Link>
          <Link href="/tools/resize-kb/?target=50" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize photo to KB
          </Link>
          <Link href="/tools/signature-resize/?target=20" className="rounded-md border border-hairline-strong bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/50">
            Resize signature
          </Link>
        </div>
      </section>
    </div>
  );
}
