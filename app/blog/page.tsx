import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { BLOG_POSTS, clusterOf } from "@/lib/blog";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { visaPath } from "@/lib/makerPages";

export const metadata = pageMetadata({
  title: "Blog — Passport, Visa & Photo Guides",
  description:
    "Practical guides on passport and visa photos, file-size limits, signatures " +
    "and image tools — how to get it right the first time.",
  path: "/blog/",
});

/* Sidebar "popular searches" — real internal links (discovery + link-equity). */
const POPULAR_SEARCHES = [
  { label: "Indian Passport Photo Size",   href: "/blog/indian-passport-photo-size-rules/" },
  { label: "US Visa Photo Requirements",   href: visaPath("us")                            },
  { label: "SSC Photo Size & Dimensions",  href: "/ssc-photo-resizer/"                     },
  { label: "Compress a Photo to 50 KB",    href: "/tools/resize-kb/"                       },
  { label: "Transparent Signature PNG",    href: "/tools/transparent-signature/"           },
  { label: "Passport Size by Country",     href: "/blog/passport-photo-size-by-country/"    },
];

export default function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;
  const posts = rest.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    dateISO: p.dateISO,
    readMins: p.readMins,
    category: clusterOf(p.slug) ?? null,
  }));

  /* Pass DATA (not pre-rendered elements) across the server→client boundary —
     BlogExplorer renders the hero, featured card and grid itself. */
  const featuredData = featured && {
    slug: featured.slug,
    title: featured.title,
    excerpt: featured.excerpt,
    date: featured.date,
    dateISO: featured.dateISO,
    readMins: featured.readMins,
  };

  return (
    <div className="container max-w-6xl py-10 sm:py-12">
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

      <BlogExplorer
        posts={posts}
        featured={featuredData}
        popularSearches={POPULAR_SEARCHES}
      />
    </div>
  );
}
