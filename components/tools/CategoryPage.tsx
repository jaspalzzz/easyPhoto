import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getCategory, TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolIcon } from "@/components/site/ToolIcon";
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

      <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}/`}
            className="group flex items-start gap-4 bg-card p-5 transition-colors hover:bg-accent/40"
          >
            <ToolIcon name={tool.icon} className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div>
              <span className="flex items-center gap-1 font-medium">
                {tool.title}
                <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.75} />
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                {tool.blurb}
              </p>
            </div>
          </Link>
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
