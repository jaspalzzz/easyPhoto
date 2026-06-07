import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata = pageMetadata({
  title: "Blog — Passport, Visa & Photo Guides",
  description:
    "Practical guides on passport and visa photos, file-size limits, signatures " +
    "and image tools — how to get it right the first time.",
  path: "/blog/",
});

export default function BlogIndex() {
  return (
    <div className="container max-w-3xl py-12">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
        ])}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Home
      </Link>

      <header className="mt-5 space-y-2 border-b border-hairline pb-6">
        <span className="eyebrow">Blog</span>
        <h1 className="text-3xl font-semibold tracking-tight">Guides &amp; articles</h1>
        <p className="text-muted-foreground">
          How to get passport, visa and ID photos right — and the tools that make
          it quick.
        </p>
      </header>

      <div className="mt-8 overflow-hidden rounded-lg border border-hairline bg-hairline grid gap-px">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}/`}
            className="group block bg-card p-5 transition-colors hover:bg-accent/40"
          >
            <p className="spec normal-case tracking-[0.08em]">
              <time dateTime={post.dateISO}>{post.date}</time> ·{" "}
              {post.readMins} min read
            </p>
            <h2 className="mt-1.5 flex items-center gap-1 text-lg font-semibold tracking-tight">
              {post.title}
              <ArrowRight className="h-4 w-4 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.75} />
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
