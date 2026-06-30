import { Minimize2, PenLine, Hash } from "lucide-react";
import type { NextStepDef } from "./WorkflowNextSteps";

/**
 * Shared "Continue editing" suggestions for tools that PRODUCE a PDF. Each
 * destination is a PDF tool that auto-loads the handed-off file (no re-upload).
 * Keeping this in one place keeps the PDF workflow chain consistent across
 * jpg-to-pdf, split, reorder, watermark, page-numbers, sign, etc.
 */
const PDF_STEPS: NextStepDef[] = [
  {
    slug: "pdf-compress",
    label: "Compress PDF",
    hint: "Shrink to an upload limit",
    icon: <Minimize2 className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    slug: "sign-pdf",
    label: "Sign PDF",
    hint: "Add your signature",
    icon: <PenLine className="h-4 w-4" strokeWidth={1.75} />,
  },
  {
    slug: "pdf-page-numbers",
    label: "Add page numbers",
    hint: "Number every page",
    icon: <Hash className="h-4 w-4" strokeWidth={1.75} />,
  },
];

/** PDF next-step suggestions, omitting the current tool's own slug. */
export function pdfNextSteps(currentSlug: string): NextStepDef[] {
  return PDF_STEPS.filter((s) => s.slug !== currentSlug);
}
