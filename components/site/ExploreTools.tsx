import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { POPULAR_TOOLS } from "@/lib/toolsCatalog";
import { ToolCard } from "@/components/site/ToolCard";

/**
 * Cross-sell / exploration strip — the "you came for one thing, here's what
 * else people grab" placement. Dropped at the end of focused pages (about, 404,
 * tool pages) so a visitor's path never dead-ends: there's always an obvious,
 * tempting next tool. Surfaces the curated POPULAR_TOOLS set as premium cards.
 */
export function ExploreTools({
  heading = "Popular free tools",
  subtitle = "No sign-up, no watermark, nothing leaves your device.",
  limit = 6,
  className,
  excludeSlug,
}: {
  heading?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
  /** Current page's tool slug — drop it so a tool never cross-links to itself. */
  excludeSlug?: string;
}) {
  const tools = POPULAR_TOOLS.filter((t) => t.slug !== excludeSlug).slice(0, limit);
  return (
    <section className={className}>
      <div className="flex items-end justify-between gap-4 border-b border-hairline pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-ink">{heading}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Link
          href="/tools/"
          className="group hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
        >
          All tools
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </Link>
      </div>
      <div className="ep-card-grid mt-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            title={tool.title}
            blurb={tool.blurb}
            icon={tool.icon}
          />
        ))}
      </div>
    </section>
  );
}
