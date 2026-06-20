import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata = pageMetadata({
  title: "Blog — Passport, Visa & Photo Guides",
  description:
    "Practical guides on passport and visa photos, file-size limits, signatures " +
    "and image tools — how to get it right the first time.",
  path: "/blog/",
});

export default function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <div className="container max-w-4xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
          ]),
          collectionPageSchema({
            name: "Blog — Passport, Visa & Photo Guides",
            description:
              "Practical guides on passport and visa photos, file-size limits, signatures and image tools — how to get it right the first time.",
            url: "/blog/",
          }),
        ]}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <header className="mt-5 space-y-2.5 border-b border-hairline pb-7">
        <span className="eyebrow text-brand">The easyPhoto blog</span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Get it right the first time
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Clear, source-checked guides on passport &amp; visa photos, exam file-size
          limits, signatures and document prep — so your application isn&apos;t
          rejected over the photo.
        </p>
      </header>

      {/* Featured (latest) post */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}/`}
          className="ep-card group mt-8 block p-6 sm:p-7"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
            Featured
          </span>
          <h2 className="mt-3 flex items-start gap-1.5 text-xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.6rem]">
            {featured.title}
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {featured.excerpt}
          </p>
          <p className="spec mt-4 normal-case tracking-[0.06em]">
            <time dateTime={featured.dateISO}>{featured.date}</time> · {featured.readMins} min read
          </p>
        </Link>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}/`}
            className="ep-card group block p-5"
          >
            <p className="spec normal-case tracking-[0.08em]">
              <time dateTime={post.dateISO}>{post.date}</time> ·{" "}
              {post.readMins} min read
            </p>
            <h2 className="mt-1.5 flex items-start gap-1 text-lg font-semibold leading-snug tracking-tight text-ink">
              {post.title}
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
