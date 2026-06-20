import Link from "next/link";
import type { PortalSpec } from "@/lib/portalPresets";
import { RelatedPortals } from "@/components/site/RelatedPortals";

/**
 * Per-exam context block — surfaces the accurate, exam-specific `spec.context`
 * prose (conducting body, exams covered, where you apply, exam-specific rules)
 * as genuinely UNIQUE on-page content. This is what differentiates the otherwise
 * near-identical per-exam resizer pages (their templated blurb + spec table +
 * FAQ are ~75% shared). Renders nothing when `context` is absent, so it's safe
 * to drop on any resizer page. Facts only — never marketing fluff.
 */
export function ExamContext({
  spec,
  /** Link to a "name & date on photo" tool, when the exam requires it. */
  nameDateHref,
}: {
  spec: PortalSpec;
  nameDateHref?: string;
}) {
  const short = spec.name.split(" (")[0];
  const hasSig = spec.sigLimitKb !== undefined;
  return (
    <>
      {spec.context && (
        <section className="mt-10 max-w-xl">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            About the {short} photo {hasSig && <>&amp; signature </>}requirement
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{spec.context}</p>
          {nameDateHref && (
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Need your name and the date printed on the photo?{" "}
              <Link href={nameDateHref} className="font-medium text-brand underline">
                Use the Photo with Name &amp; Date tool
              </Link>
              .
            </p>
          )}
        </section>
      )}
      <RelatedPortals portalId={spec.id} />
    </>
  );
}
