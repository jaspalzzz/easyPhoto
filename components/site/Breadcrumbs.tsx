import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/schema";

/**
 * Visible breadcrumb trail. ALWAYS render this from the same Crumb[] passed to
 * breadcrumbSchema() — Google expects the on-page trail and the BreadcrumbList
 * JSON-LD to agree, and a visible trail also injects internal links up to the
 * parent categories (topical-authority signal + clearer crawl paths).
 */
export function Breadcrumbs({
  crumbs,
  className = "",
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  // A single crumb (just "Home") isn't a trail — nothing useful to show.
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-x-1.5">
              {i > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-ink-faint"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span className="font-medium text-ink" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-brand hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
