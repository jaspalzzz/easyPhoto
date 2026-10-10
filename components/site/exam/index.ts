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
    metaDescription:
      "SSC signature: JPEG/JPG, 10–20 KB, about 6.0 × 2.0 cm at 300 DPI. The photo is captured live in the form, so there's no photo file to upload.",
  },
  // Meta unchanged (owner, 10 Oct): UPSC's spec is verified and its numbers are UPSC's own.
  upsc: { Body: UpscGuide, faq: UPSC_FAQ },
  "up-police": {
    Body: UpPoliceGuide,
    faq: UP_POLICE_FAQ,
    metaDescription:
      "UP Police signature: JPG/JPEG, 30–50 KB, 140 × 60 pixels, in running letters. Your photo is taken live while you apply, so the signature is the only image you prepare.",
  },
};
