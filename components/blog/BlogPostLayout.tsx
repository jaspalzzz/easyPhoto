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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <header className="mt-4 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          <time dateTime={post.dateISO}>{post.date}</time> · {post.readMins} min
          read
        </p>
      </header>

      <article className="mt-6 space-y-4 text-[15px] leading-7 text-muted-foreground [&_a]:text-brand [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-1 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </article>

      <p className="mt-10 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        Ready to make yours?{" "}
        <Link href="/passport-photo/" className="font-medium text-brand hover:underline">
          Use the free passport photo maker
        </Link>{" "}
        — compliant size and background, checked before you download.
      </p>
    </div>
  );
}
