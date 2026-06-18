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
      ? `Exact size, dimensions and KB the ${e!.name} application form needs.`
      : "Resize your photo and signature to the exact size your exam form needs.",
  });
}
