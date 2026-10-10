import Link from "next/link";
import { ArrowDown } from "lucide-react";
import type { FaqItem } from "@/components/site/Faq";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { SupportCard } from "@/components/site/SupportCard";
import { buttonVariants } from "@/components/ui/button";

/**
 * The UPSC exam page body (owner-approved rewrite, 10 Oct 2026 — see
 * docs/exam-rewrite-upsc-2026-10.md). Facts come from UPSC's portal PDF
 * "Instructions for Uploading Photo and Signature" (4 Feb 2026), the messages
 * the application form shows, and UPSC's 2026 notices, all read on 10 Oct
 * 2026; each appears once on the page. The page is the do-it-now companion to
 * the longer UPSC CSE blog guide, which it links instead of repeating.
 */

export const UPSC_FAQ: FaqItem[] = [
  {
    q: "Should I write my name and the date on my UPSC photo?",
    a: "No. UPSC's instructions say the photograph must not be signed, and none of its 2026 notices asks for any writing on it.",
  },
  {
    q: "What should my files be called?",
    a: 'Name the photo file "photo" and the signature file "signature" — the form asks for exactly these names. The Photo ID upload is named "id_card".',
  },
  {
    q: "How do I take the live photo if my computer has no webcam?",
    a: "Scan the QR code the form shows with your phone, and take the live photo on the phone.",
  },
];

const h2 = "text-lg font-semibold";
const prose = "max-w-2xl text-sm leading-relaxed text-muted-foreground";

export function UpscGuide() {
  return (
    <>
      <section
        aria-label="UPSC photo and signature at a glance"
        className="space-y-3 rounded-lg border border-hairline bg-card p-5 sm:p-6"
      >
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">UPSC photo:</strong> JPG,{" "}
          <strong className="font-semibold">20–200 KB</strong>, saved with the file name{" "}
          <strong className="font-semibold">photo</strong>. Plain white background, your face filling{" "}
          <strong className="font-semibold">75% or more</strong> of the photo, both ears visible.
        </p>
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">UPSC signature:</strong> sign{" "}
          <strong className="font-semibold">three times, one below the other</strong>, in black ink on
          plain white unlined paper, and scan all three as one JPG of{" "}
          <strong className="font-semibold">20–100 KB</strong>, each side 350–500 pixels (width and
          height).
        </p>
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">Plus a live photo:</strong> the form also takes your photo
          through the webcam or your phone (by scanning a QR code) and matches it to the photo you
          uploaded.
        </p>
        <a href="#resizer" className={buttonVariants({ variant: "cta", className: "min-h-11 w-full sm:w-auto" })}>
          Prepare your UPSC photo and signature <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <section id="resizer" className="space-y-4 rounded-lg border border-brand/25 bg-brand-soft/15 p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Prepare your UPSC photo and signature</h2>
        <PortalResizer portalId="upsc" hideDescription compact />
        <p className="text-xs text-muted-foreground">
          Both tools work inside this browser tab, so the photo and signature stay with you.{" "}
          <Link href="/how-photo-checking-works/" className="font-medium text-brand hover:underline">
            How our checks work
          </Link>
          {" · "}
          <Link
            href="/blog/upsc-cse-ias-photo-signature-guide-2026/"
            className="font-medium text-brand hover:underline"
          >
            Full UPSC CSE guide
          </Link>
        </p>
      </section>

      {/* Appears only after a file from the tools above is saved. */}
      <SupportCard tool="exam-upsc" />

      <section className="space-y-2 border-t border-hairline pt-8">
        <h2 className={h2}>What &quot;75% face coverage&quot; means</h2>
        <p className={prose}>
          UPSC wants your face to cover at least three-quarters of the photo&apos;s area. In practice, a
          normal passport photo with shoulders and lots of space above the head usually falls short.
          Crop in close around your head, keeping both ears in view, then check the file is still
          20–200 KB.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className={h2}>When the form refuses your photo</h2>
        <dl className="max-w-2xl space-y-3 text-sm leading-relaxed">
          <div>
            <dt className="font-semibold text-ink">
              &quot;The face is unclear or doesn&apos;t meet the required 3/4th or 75% face coverage&quot;
            </dt>
            <dd className="text-muted-foreground">
              Crop closer so the face fills the frame, and use a sharp, evenly lit photo.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">&quot;Unable to detect face in image&quot;</dt>
            <dd className="text-muted-foreground">
              The face is too small, turned, in shadow or hidden. Use a front-facing photo with both ears
              showing, no dark glasses.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">&quot;Live photo and uploaded photo do not match&quot;</dt>
            <dd className="text-muted-foreground">
              Your uploaded photo must look like you today. Use a recent photo, remove cap, mask and dark
              glasses for the live photo, and sit in good light facing the camera.
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>Three signatures on one sheet</h2>
        <ul className={`${prose} list-disc space-y-1.5 pl-5`}>
          <li>Sign three times, one below the other, with clear space between them.</li>
          <li>Black ink, plain white paper — no lines, no coloured paper.</li>
          <li>One image, upright and sharp, with exactly three signatures.</li>
        </ul>
        <p className={prose}>
          UPSC&apos;s sample sheet rejects signatures side by side, in blue ink, a single signature,
          cramped spacing, blurred or rotated scans, and ruled or coloured paper.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>On exam day</h2>
        <p className={prose}>
          Every 2026 UPSC notice says your face will be checked at the exam venue. Carry the Photo ID
          card whose details you entered in the form (for the Civil Services exam, also at the
          interview).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>NDA, CDS, CAPF, ESE — same rules?</h2>
        <p className={prose}>
          Yes. UPSC&apos;s application portal uses the same photo and signature rules for every exam.
          One difference to know: the ESE 2027 notice still prints an older upper limit of 300 KB.
          The portal limits at the top of this page are the ones the form checks.
        </p>
      </section>
    </>
  );
}
