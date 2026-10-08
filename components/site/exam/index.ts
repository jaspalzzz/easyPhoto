import type { FaqItem } from "@/components/site/Faq";
import { SscGuide, SSC_FAQ } from "@/components/site/exam/SscGuide";

/**
 * Exam pages rewritten to stand on their own (docs/NEXT-RELEASE.md item 9):
 * their own body and FAQ replace the shared template's spec table, resizer
 * frame, notes, checklist and template FAQ. Pages not listed here render the
 * template unchanged. Add one exam per reviewed rewrite, ≤ 3 per release.
 */
export const EXAM_GUIDES: Readonly<
  Record<string, { Body: () => React.JSX.Element; faq: FaqItem[]; metaDescription: string }>
> = {
  ssc: {
    Body: SscGuide,
    faq: SSC_FAQ,
    metaDescription:
      "SSC signature: JPEG/JPG, 10–20 KB, about 6.0 × 2.0 cm at 300 DPI. The photo is captured live in the form, so there's no photo file to upload.",
  },
};
