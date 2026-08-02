import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog";

/**
 * Latest written guides, surfaced on the homepage.
 *
 * The homepage previously linked to zero articles: a visitor (or a reviewer)
 * landing on it saw only tool directories and had no way to discover the
 * written guides, which are the site's original editorial work. This puts the
 * six most recent in front of them and gives the blog a route in from the
 * most-linked page on the site.
 *
 * Ordered by real publication date rather than array position so a newly
 * published guide surfaces without anyone having to reorder the registry.
 */
export function LatestGuides() {
  const posts = [...BLOG_POSTS]
    .sort((a, b) => (b.updatedISO ?? b.dateISO).localeCompare(a.updatedISO ?? a.dateISO))
    .slice(0, 6);

  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tightest text-ink sm:text-[1.75rem]">
              Guides to the rules
            </h2>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              What each authority actually publishes, traced to the notice it came
              from — and what it does not publish, said plainly.
            </p>
          </div>
          <Link
            href="/blog/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            All guides <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="ep-card group flex flex-col gap-2 p-5"
            >
              <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
                {post.date} · {post.readMins} min read
              </p>
              <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">
                {post.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
