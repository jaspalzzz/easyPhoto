import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { SUB_EXAM_SLUGS, getSubExamResizer, RESIZER_YEAR } from "@/lib/subExamResizers";
import { getPortalSpec } from "@/lib/specRegistry";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Exam Photo & Signature Resizer — easyPhoto";

export function generateStaticParams() {
  return SUB_EXAM_SLUGS.map((exam) => ({ exam }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = await params;
  const e = getSubExamResizer(exam);
  const spec = e ? getPortalSpec(e.parentId) : undefined;
  return ogImage({
    title: e ? `${e.name} Photo & Signature Resizer ${RESIZER_YEAR}` : "Exam Photo & Signature Resizer",
    subtitle: spec
      ? `Apply the stored ${e!.name} size and KB targets; confirm the current form.`
      : "Prepare a photo and signature for an exam form; confirm its current instructions.",
  });
}
