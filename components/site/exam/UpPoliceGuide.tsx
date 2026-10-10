import Link from "next/link";
import { ArrowDown } from "lucide-react";
import type { FaqItem } from "@/components/site/Faq";
import { PortalResizer } from "@/components/tools/PortalResizer";
import { SupportCard } from "@/components/site/SupportCard";
import { buttonVariants } from "@/components/ui/button";

/**
 * The UP Police exam page body (owner-approved rewrite, 10 Oct 2026 — see
 * docs/exam-rewrite-up-police-2026-10.md). Facts come from UPPBPB's Constable
 * Direct Recruitment 2025 notice (31 Dec 2025, §1 and §5.5–5.8), read on
 * 10 Oct 2026; each appears once on the page.
 */

export const UP_POLICE_FAQ: FaqItem[] = [
  {
    q: "My signature file is only a few KB. Will the form refuse it?",
    a: "Yes. The notice sets a 30 KB minimum, and a 140 × 60 signature is naturally only a few KB. Our tool brings the file up to 30 KB without changing the picture.",
  },
  {
    q: "I'm a government employee. Do I upload anything else?",
    a: "Yes: a No Objection Certificate. The notice makes it mandatory for candidates already in government service.",
  },
  {
    q: "Can I apply without Aadhaar?",
    a: "Yes. You can log in with your account ID and password or DigiLocker. If you apply with another government ID instead of Aadhaar, the form asks you for a self-declaration.",
  },
];

const h2 = "text-lg font-semibold";
const prose = "max-w-2xl text-sm leading-relaxed text-muted-foreground";

export function UpPoliceGuide() {
  return (
    <>
      <section
        aria-label="UP Police photo and signature at a glance"
        className="space-y-3 rounded-lg border border-hairline bg-card p-5 sm:p-6"
      >
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">The UP Police signature file:</strong> a JPG or JPEG of{" "}
          <strong className="font-semibold">30–50 KB</strong>,{" "}
          <strong className="font-semibold">140 × 60 pixels</strong> (the notice also gives the size as
          50 × 20 mm).
        </p>
        <p className="text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">The photo:</strong> there&apos;s no photo file. The form
          takes your picture live, with a webcam or your phone camera, during the application.
        </p>
        <a href="#resizer" className={buttonVariants({ variant: "cta", className: "min-h-11 w-full sm:w-auto" })}>
          Prepare the signature for UP Police <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <section id="resizer" className="space-y-4 rounded-lg border border-brand/25 bg-brand-soft/15 p-5 sm:p-6">
        <h2 className="text-base font-semibold tracking-tight">Prepare the signature for UP Police</h2>
        <PortalResizer portalId="up-police" hideDescription compact />
        <p className="text-xs text-muted-foreground">
          Your signature is processed here in the browser and never sent to us.{" "}
          <Link href="/how-photo-checking-works/" className="font-medium text-brand hover:underline">
            How our checks work
          </Link>
        </p>
      </section>

      {/* Appears only after a file from the tool above is saved. */}
      <SupportCard tool="exam-up-police" />

      <section className="space-y-2 border-t border-hairline pt-8">
        <h2 className={h2}>Signing for the scan</h2>
        <ul className={`${prose} list-disc space-y-1.5 pl-5`}>
          <li>Draw a box 50 mm wide and 20 mm high on white paper.</li>
          <li>
            Sign inside it with a black pen, in your usual running hand, not in separate block or
            capital letters.
          </li>
          <li>Photograph or scan just the box; the tool removes the rest.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>Live-photo rules</h2>
        <ul className={`${prose} list-disc space-y-1.5 pl-5`}>
          <li>no cap and no uniform of any kind (a uniform gets the application refused);</li>
          <li>nothing over your face: no mask, hair, cloth, shadow or jewellery;</li>
          <li>if you wear spectacles, avoid glare so your eyes are clearly visible;</li>
          <li>keep it sharp and not over-bright.</li>
        </ul>
        <p className={prose}>
          If the live photo doesn&apos;t match your Aadhaar photo, the form asks you to fill a
          declaration.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>No uniform at any stage</h2>
        <p className={prose}>
          The notice warns against wearing any uniform at any stage of the recruitment, the written
          exam included. A candidate who does is left out of the selection.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className={h2}>Which recruitment these rules are from</h2>
        <p className={prose}>
          UPPBPB&apos;s notice of 31 December 2025 for Constable (Civil Police) and equivalent posts:
          PAC/Armed Police, Special Security Force, women&apos;s battalions, Mounted Police and Jail
          Warder. Sub-Inspector and other recruitments have their own notices, so check the one
          you&apos;re applying to.
        </p>
      </section>
    </>
  );
}
