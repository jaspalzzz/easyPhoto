import { getExamAffiliate } from "@/lib/affiliates";
import { PORTAL_PRESETS, type PORTAL_KEYS } from "@/lib/portalPresets";

type ExamId = (typeof PORTAL_KEYS)[number];

export function AffiliateCta({ examId }: { examId: ExamId }) {
  const affiliate = getExamAffiliate(examId);

  if (!affiliate) return null;

  const examName = PORTAL_PRESETS[examId].name.split(" (")[0];

  return (
    <aside className="space-y-3 rounded-lg border border-hairline bg-card p-4 sm:p-5">
      <p className="text-sm font-medium text-foreground">
        Preparing for {examName}? Explore test series on Testbook.
      </p>
      <a
        href={affiliate.url}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-hairline-strong px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {affiliate.label}
      </a>
      <p className="text-sm leading-relaxed text-foreground">
        Affiliate link — we may earn a commission at no extra cost to you.
      </p>
    </aside>
  );
}
