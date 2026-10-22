import type { FaqItem } from "@/components/site/Faq";
import { SscGuide, SSC_FAQ } from "@/components/site/exam/SscGuide";
import { UpscGuide, UPSC_FAQ } from "@/components/site/exam/UpscGuide";
import { UpPoliceGuide, UP_POLICE_FAQ } from "@/components/site/exam/UpPoliceGuide";

/**
 * Exam pages rewritten to stand on their own (docs/NEXT-RELEASE.md item 9):
 * their own body and FAQ replace the shared template's spec table, resizer
 * frame, notes, checklist and template FAQ. Pages not listed here render the
 * template unchanged. Add one exam per reviewed rewrite, ≤ 3 per release.
 */
export const EXAM_GUIDES: Readonly<
  Record<
    string,
    {
      Body: () => React.JSX.Element;
      faq: FaqItem[];
      /** Only when the template's generated meta would be wrong for this page. */
      metaDescription?: string;
    }
  >
> = {
  ssc: {
    Body: SscGuide,
    faq: SSC_FAQ,
    // Names only exams whose 2026 notices the page cites (SSC_NOTICES); "ssc cpo
    // signature size" had 426 impressions at position 9.6 (GSC, 90 days to 13 Oct 2026).
    metaDescription:
      "SSC signature for CGL, CHSL, CPO, GD, JE and Steno 2026: JPEG/JPG, 10–20 KB, about 6.0 × 2.0 cm at 300 DPI. The photo is taken live in the form.",
  },
  // Owner, 15 Oct 2026 (replacing the 10 Oct "meta unchanged"): name the 75% face
  // rule, which searchers type ("upsc 75 face coverage photo") and the page checks.
  upsc: {
    Body: UpscGuide,
    faq: UPSC_FAQ,
    metaDescription:
      "UPSC photo: 20–200 KB JPG with your face covering at least 75%, checked here. Signature: 20–100 KB, signed three times, one below the other, on one image.",
  },
  "up-police": {
    Body: UpPoliceGuide,
    faq: UP_POLICE_FAQ,
    metaDescription:
      "UP Police signature: JPG/JPEG, 30–50 KB, 140 × 60 pixels, in running letters. Your photo is taken live while you apply, so the signature is the only image you prepare.",
  },
};
