import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPost, relatedPosts } from "@/lib/blog";
import { AuthorAvatar } from "@/components/blog/AuthorAvatar";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";
import { AUTHOR } from "@/lib/author";

/** Shared chrome + Article schema for a blog post. */
export function BlogPostLayout({
  slug,
  children,
  ctaHref = "/passport-photo/",
  ctaLabel = "Open the photo maker",
}: {
  slug: string;
  children: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const post = getPost(slug);
  if (!post) notFound();
  const url = `/blog/${post.slug}/`;
  // Same-topic posts first (falls back to array order to fill the 2 slots).
  const more = relatedPosts(slug, 2);

  return (
    <>
      <ReadingProgress />
      <div className="container max-w-2xl py-12">
        <JsonLd
          schema={[
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog/" },
              { name: post.title, path: url },
            ]),
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              datePublished: post.dateISO,
              dateModified: post.updatedISO ?? post.dateISO,
              inLanguage: "en-IN",
              mainEntityOfPage: absoluteUrl(url),
              image: {
                "@type": "ImageObject",
                url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
                width: 1200,
                height: 630,
              },
              author: {
                "@type": "Person",
                name: AUTHOR.name,
                url: AUTHOR.url,
                sameAs: [AUTHOR.url],
                ...(AUTHOR.photo ? { image: absoluteUrl(AUTHOR.photo) } : {}),
                jobTitle: AUTHOR.title,
                knowsAbout: AUTHOR.knowsAbout,
                worksFor: { "@id": ORG_ID },
              },
              publisher: { "@id": ORG_ID },
            },
          ]}
        />

        <Link
          href="/blog/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All articles
        </Link>

        <header className="mt-6 space-y-5 border-b border-hairline pb-7">
          <p className="eyebrow text-brand">
            <time dateTime={post.dateISO}>{post.date}</time> · {post.readMins} min read
          </p>
          <h1 className="text-[2rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[2.4rem]">
            {post.title}
          </h1>
          {/* Byline — named author (E-E-A-T "Who"), links to their profile. */}
          <div className="flex items-center gap-3 pt-1">
            <AuthorAvatar src={AUTHOR.photo} name={AUTHOR.name} className="h-10 w-10" />
            <div className="text-sm leading-tight">
              <a
                href={AUTHOR.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink hover:text-brand hover:underline"
              >
                {AUTHOR.name}
              </a>
              <p className="text-xs text-muted-foreground">{AUTHOR.title}</p>
            </div>
          </div>
        </header>

        {/* Prose: 17px, generous line-height, high-contrast ink, a "lead" first
            paragraph — all tuned for readability and reading completion. */}
        <article
          className="mt-9 text-[17px] leading-[1.75] text-[hsl(30_10%_24%)]
            [&>p:first-of-type]:text-[19px] [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:text-[hsl(30_11%_20%)]
            [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-brand
            [&_h2]:mb-2 [&_h2]:mt-11 [&_h2]:text-[1.45rem] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink
            [&_li]:ml-1 [&_p]:mt-5 [&_strong]:font-semibold [&_strong]:text-ink
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
        >
          {children}
        </article>

        {/* About the author — named-person E-E-A-T card with profile link. */}
        <aside className="mt-12 flex items-start gap-4 rounded-xl border border-hairline bg-card p-5">
          <AuthorAvatar src={AUTHOR.photo} name={AUTHOR.name} className="h-12 w-12" />
          <div className="text-sm leading-relaxed">
            <p className="eyebrow mb-1 text-ink-soft">About the author</p>
            <a
              href={AUTHOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink hover:text-brand hover:underline"
            >
              {AUTHOR.name}
            </a>
            <span className="text-muted-foreground"> · {AUTHOR.title}</span>
            <p className="mt-1.5 text-ink-soft">{AUTHOR.bio}</p>
          </div>
        </aside>

        {/* Editorial standards — the "How / Why" E-E-A-T signal: real process,
            dated verification, on-device privacy, corrections invite. All
            truthful; no invented person or credentials. */}
        <aside className="mt-12 rounded-xl border border-hairline bg-accent/5 p-5 text-sm leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">How we keep this accurate</p>
          <p className="mt-2">
            Every photo and signature specification on easyPhoto is checked
            against the official government source — passport offices, exam boards
            and embassies — and dated, then re-verified when a portal changes its
            rules. Every tool runs entirely in your browser; your documents are
            never uploaded.
          </p>
          <p className="mt-2">
            Spotted something out of date?{" "}
            <Link href="/contact/" className="font-medium text-brand underline">
              Tell us
            </Link>{" "}
            and we&apos;ll correct it.
          </p>
        </aside>

        {/* Closing CTA */}
        <div className="mt-12 flex flex-col items-start gap-3 rounded-xl border border-brand/25 bg-brand-soft/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">
            <span className="font-semibold">Ready to make yours?</span>{" "}
            Compliant size &amp; background, checked before you download — free, in your browser.
          </p>
          <Link
            href={ctaHref}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Keep reading — reduce bounce */}
        {more.length > 0 && (
          <section className="mt-12 border-t border-hairline pt-8">
            <h2 className="eyebrow mb-4 text-ink-soft">Keep reading</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {more.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}/`}
                  className="ep-card group block p-5"
                >
                  <p className="spec normal-case tracking-[0.06em]">
                    {p.readMins} min read
                  </p>
                  <h3 className="mt-1.5 flex items-start gap-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
                    {p.title}
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
