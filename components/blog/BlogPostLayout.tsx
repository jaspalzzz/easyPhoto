import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, ORG_ID } from "@/lib/schema";
import { absoluteUrl } from "@/lib/seo";

/** Shared chrome + Article schema for a blog post. */
export function BlogPostLayout({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const post = getPost(slug);
  if (!post) notFound();
  const url = `/blog/${post.slug}/`;

  return (
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
            dateModified: post.dateISO,
            mainEntityOfPage: absoluteUrl(url),
            image: absoluteUrl("/og.png"),
            author: { "@id": ORG_ID },
            publisher: { "@id": ORG_ID },
          },
        ]}
      />

      <Link
        href="/blog/"
        className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All articles
      </Link>

      <header className="mt-5 space-y-3 border-b border-hairline pb-6">
        <p className="eyebrow">
          <time dateTime={post.dateISO}>{post.date}</time> · {post.readMins} min
          read
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      </header>

      <article className="mt-8 space-y-4 text-[15px] leading-7 text-muted-foreground [&_a]:text-brand [&_a]:hover:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_li]:ml-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </article>

      <p className="mt-10 rounded-lg border border-hairline bg-card p-4 text-sm text-muted-foreground">
        Ready to make yours?{" "}
        <Link href="/passport-photo/" className="font-medium text-brand hover:underline">
          Use the free passport photo maker
        </Link>. Compliant size and background, checked before you download.
      </p>
    </div>
  );
}
