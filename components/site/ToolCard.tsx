import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolIconTile } from "@/components/site/ToolIcon";
import { toolColorCategory } from "@/lib/toolsCatalog";

/**
 * Premium tool card — white surface, soft shadow, hover lift, vibrant colored
 * icon tile. The building block of every tool grid (replaces the flat hairline
 * register lists). Reads as a tappable, scannable product tile.
 */
export function ToolCard({
  slug,
  title,
  blurb,
  icon,
  href,
}: {
  slug: string;
  title: string;
  blurb: string;
  icon: string;
  /** Defaults to /tools/<slug>/. */
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/tools/${slug}/`}
      className="ep-card group flex h-full items-start gap-4 p-5"
    >
      <ToolIconTile name={icon} category={toolColorCategory(slug)} />
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-semibold text-ink">
          {title}
          <ArrowRight
            className="h-3.5 w-3.5 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100"
            strokeWidth={1.75}
          />
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {blurb}
        </span>
      </span>
    </Link>
  );
}
