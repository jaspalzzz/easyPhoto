import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getCategory, TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolCard } from "@/components/site/ToolCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";

/** A category landing page (e.g. /tools/photo) listing that category's tools. */
export function CategoryPage({ slug }: { slug: string }) {
  const cat = getCategory(slug);
  if (!cat) notFound();
  const tools = cat.tools.filter((t) => t.ready);
  const others = TOOLS_CATALOG.filter((g) => g.slug !== slug);

  return (
    <div className="container max-w-5xl py-12">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
            { name: cat.group, path: `/tools/${cat.slug}/` },
          ]),
          collectionPageSchema({
            name: `Free ${cat.group}`,
            description: cat.tagline,
            url: `/tools/${cat.slug}/`,
          }),
        ]}
      />
      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All tools
      </Link>

      <header className="mt-4 max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Free {cat.group}
        </h1>
        <p className="text-muted-foreground">{cat.tagline}</p>
      </header>

      <div className="ep-card-grid mt-8 sm:!grid-cols-2 lg:!grid-cols-3">
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

      <section className="mt-12 border-t border-hairline pt-6">
        <h2 className="eyebrow mb-3">
          More tool categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {others.map((g) => (
            <Link
              key={g.slug}
              href={`/tools/${g.slug}/`}
              className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-ink/30 hover:bg-accent/40 hover:text-foreground"
            >
              {g.group}
            </Link>
          ))}
          <Link
            href="/tools/"
            className="rounded-md border border-hairline px-4 py-2 text-sm font-medium text-brand transition-colors hover:border-ink/30 hover:bg-accent/40"
          >
            All tools
          </Link>
        </div>
      </section>
    </div>
  );
}
