import Link from "next/link";
import { ArrowDown, ExternalLink } from "lucide-react";
import type { FaqItem } from "@/components/site/Faq";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { SupportCard } from "@/components/site/SupportCard";
import { buttonVariants } from "@/components/ui/button";

/**
 * The SSC exam page body (owner-approved rewrite, 8 Oct 2026 — see
 * docs/exam-rewrite-ssc-2026-10.md). Every fact comes from SSC's 2026 notices,
 * read on ssc.gov.in on 8 Oct 2026, and appears once on the page. It replaces
 * the shared template's spec table, resizer frame, notes and checklist; the
 * page shell (breadcrumbs, H1, byline, source line, related exams) stays.
 */

const NOTICE_BASE = "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/";

/** SSC's 2026 notices, all identical on the photo and signature rules. */
const SSC_NOTICES: ReadonlyArray<{ exam: string; date: string; file: string }> = [
  { exam: "Combined Graduate Level (CGL)", date: "21 May 2026", file: "Notice_of_adv_cgl_2026.pdf" },
  { exam: "Combined Higher Secondary (CHSL)", date: "7 Sep 2026", file: "Notice_of_adv_chsl_2026.pdf" },
  { exam: "Sub-Inspector, Delhi Police and CAPF (CPO)", date: "10 Sep 2026", file: "Notice_of_adv_capf_2026.pdf" },
  { exam: "Constable (GD)", date: "1 Dec 2025", file: "Notice_of_CTGD_2026.pdf" },
  { exam: "Junior Engineer (JE)", date: "2 Sep 2026", file: "Notice_of_adv_je_2026.pdf" },
  { exam: "Stenographer Grade C and D", date: "24 Apr 2026", file: "Notice_of_adv_steno_2026.pdf" },
  { exam: "Selection Post Phase-XIV", date: "13 Apr 2026", file: "Notice_of_RHQ_2026_phase_xiv.pdf" },
  { exam: "Combined Hindi Translators", date: "23 Apr 2026", file: "Notice_of_adv_cht_2026.pdf" },
];

export const SSC_FAQ: FaqItem[] = [
  {
    q: "Do I need a passport-size photo for the SSC form?",
    a: "Not for the form. You do need two recent passport-size colour photos on exam day.",
  },
  {
    q: "Does my SSC photo need my name and date on it?",
    a: "No. No SSC 2026 notice asks for a name or date on the photo (that rule belongs to some other exams).",
  },
  {
    q: "What if my webcam won't take the photo?",
    a: "The CGL notice says to use the QR code on the form's Upload Documents page to get SSC's app and take it on your phone.",
  },
];

const h2 = "text-lg font-semibold";
const prose = "max-w-2xl text-sm leading-relaxed text-muted-foreground";

export function SscGuide() {
  return (
    <>
      <section
        aria-label="SSC photo and signature at a glance"
        className="space-y-3 rounded-lg border border-hairline bg-card p-5 sm:p-6"
      >
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">SSC signature:</strong> JPEG/JPG,{" "}
          <strong className="font-semibold">10–20 KB</strong>, about{" "}
          <strong className="font-semibold">6.0 cm wide × 2.0 cm high</strong>. SSC&apos;s portal adds
          &quot;at 300 DPI&quot;, which works out to about 709 × 236 pixels (our conversion; SSC gives
          no pixel size).
        </p>
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">SSC photo:</strong> you don&apos;t upload one. The form
          takes your photo live through your phone or computer camera.
        </p>
        <a href="#resizer" className={buttonVariants({ variant: "cta", className: "min-h-11 w-full sm:w-auto" })}>
          Make your SSC signature file <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <section id="resizer" className="space-y-4 rounded-lg border border-brand/25 bg-brand-soft/15 p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Make your SSC signature file</h2>
        <PortalResizer portalId="ssc" hideDescription compact />
        <p className="text-xs text-muted-foreground">
          Runs on your phone or computer; your signature is not uploaded.{" "}
          <Link href="/how-photo-checking-works/" className="font-medium text-brand hover:underline">
            How our checks work
          </Link>
          {" · "}
          <Link
            href="/blog/ssc-cgl-chsl-photo-signature-guide-2026/"
            className="font-medium text-brand hover:underline"
          >
            SSC CGL and CHSL guide
          </Link>
        </p>
      </section>

      {/* Appears only after a file from the resizer above is saved. */}
      <SupportCard tool="exam-ssc" />

      <section className="space-y-3 border-t border-hairline pt-8">
        <h2 className={h2}>Same rule for CGL, CHSL, CPO, GD and the rest?</h2>
        <p className={prose}>
          Yes. Every SSC notice for 2026 asks for the same signature and takes the photo live:
        </p>
        <ul className="max-w-2xl divide-y divide-hairline rounded-lg border border-hairline text-sm">
          {SSC_NOTICES.map((n) => (
            <li key={n.file} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
              <span className="text-ink">{n.exam}</span>
              <a
                href={`${NOTICE_BASE}${n.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                Notice, {n.date} <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>6.0 cm or 4.0 cm?</h2>
        <p className={prose}>
          Five SSC notices (CGL, CHSL, CPO, Selection Post and Hindi Translators) say 6.0 cm wide in
          the main instructions but 4.0 cm in an annexure. The main instructions, the GD notice and the
          form itself all say about 6.0 × 2.0 cm, so use that.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>A signature SSC won&apos;t reject</h2>
        <ul className={`${prose} list-disc space-y-1.5 pl-5`}>
          <li>
            Draw a box about 6 cm wide and 2 cm high on white paper and sign inside it, so your
            signature fills at least 80% of the box — SSC&apos;s own advice.
          </li>
          <li>Sign straight across, not on a slant; the form asks for a horizontal signature.</li>
          <li>Keep it sharp: blurred or tiny signatures are rejected.</li>
          <li>SSC doesn&apos;t specify an ink colour; dark ink on white paper scans clearest.</li>
          <li>
            Candidates with visual disability (PwD-VH) may use a thumb impression (CGL, Hindi
            Translators and Selection Post notices).
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>The live photo</h2>
        <p className={prose}>When the form asks, sit facing the camera:</p>
        <ul className={`${prose} list-disc space-y-1.5 pl-5`}>
          <li>good light and a plain background;</li>
          <li>camera at eye level, looking straight ahead;</li>
          <li>your face fully inside the outline on screen;</li>
          <li>no cap, mask, glasses or earphones.</li>
        </ul>
        <p className={prose}>
          <strong className="font-semibold text-ink">Never point the camera at a printed photo.</strong>{" "}
          SSC rejects applications where the photo is a picture of an existing photograph.
        </p>
        <p className={prose}>
          SSC&apos;s most common photo rejections: no plain background, wearing a cap, no shirt, not
          bright enough, blurred.
        </p>
        <p className={prose}>On exam day you should look like your photo.</p>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>Applying with Aadhaar authentication</h2>
        <p className={prose}>
          SSC says applications made with Aadhaar-based authentication are not rejected because of the
          photo or signature format. The Constable (GD) notice does not repeat this exception for the
          photo, so don&apos;t rely on it there.
        </p>
      </section>
    </>
  );
}
