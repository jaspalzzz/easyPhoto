import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { relatedTools, getTool, categoryOf, toolColorCategory } from "@/lib/toolsCatalog";
import { ToolIconTile } from "@/components/site/ToolIcon";
import { ExploreTools } from "@/components/site/ExploreTools";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { breadcrumbSchema, softwareApplicationSchema, type Crumb } from "@/lib/schema";

/** Shared chrome for a tool page: breadcrumb, heading, body, related links. */
export function ToolPage({
  title,
  blurb,
  slug,
  path,
  children,
  footnote,
  faqItems,
  breadcrumbs: breadcrumbsProp,
  wide = false,
  dateModified,
}: {
  title: string;
  blurb: string;
  /** Catalog slug — enables related cross-links + structured data. */
  slug?: string;
  /** Canonical route path, e.g. "/ssc-photo-resizer/". If provided, schemas are generated. */
  path?: string;
  children: React.ReactNode;
  footnote?: string;
  /** Optional on-page FAQ (also emits FAQPage JSON-LD). */
  faqItems?: FaqItem[];
  /** Explicit breadcrumb chain override. When provided, replaces the auto-built crumbs. */
  breadcrumbs?: Crumb[];
  /** Wider container for content-heavy tools (e.g. the exam picker grid). */
  wide?: boolean;
  /** ISO date the underlying spec was verified — emitted as schema dateModified. */
  dateModified?: string;
}) {
  const related = slug ? relatedTools(slug) : [];
  const entry = slug ? getTool(slug) : undefined;
  const category = slug ? categoryOf(slug) : undefined;

  const urlPath = path || (slug ? `/tools/${slug}/` : undefined);
  const autoCrumbs: Crumb[] = [{ name: "Home", path: "/" }];
  if (urlPath) {
    if (urlPath.startsWith("/tools/") && urlPath !== "/tools/") {
      autoCrumbs.push({ name: "Tools", path: "/tools/" });
      if (category) {
        autoCrumbs.push({ name: category.group, path: `/tools/${category.slug}/` });
      }
    }
    autoCrumbs.push({ name: title, path: urlPath });
  }
  const crumbs = breadcrumbsProp ?? autoCrumbs;

  return (
    <div className={`container py-10 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
      {urlPath && (
        <JsonLd
          schema={[
            breadcrumbSchema(crumbs),
            softwareApplicationSchema({
              name: title,
              description: blurb,
              url: urlPath,
              category: "MultimediaApplication",
              dateModified,
            }),
          ]}
        />
      )}
      <Breadcrumbs crumbs={crumbs} />
      <header className="mt-4 flex items-start gap-4">
        {entry && (
          <ToolIconTile
            name={entry.icon}
            category={slug ? toolColorCategory(slug) : "photo"}
            className="hidden shrink-0 sm:flex"
          />
        )}
        <div className="space-y-2">
          {category && (
            <span className="eyebrow block text-brand">{category.group}</span>
          )}
          <h1 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">{blurb}</p>
        </div>
      </header>

      <div className="mt-6">{children}</div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
        {footnote ??
          "This tool runs entirely in your browser. Your file is never uploaded to a server."}
      </p>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="eyebrow mb-4">Related tools</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}/`}
                className="ep-card group flex items-center gap-3 p-4"
              >
                <ToolIconTile name={t.icon} category={toolColorCategory(t.slug)} size="sm" />
                <span className="text-sm font-semibold leading-tight text-ink">
                  {t.title}
                </span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:text-brand group-hover:opacity-100" strokeWidth={1.75} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqItems && faqItems.length > 0 && (
        <section className="mt-12">
          <Faq items={faqItems} />
        </section>
      )}

      {/* Never a dead end: surface the wider toolkit after the page's own
          content (related = same category; this = breadth). */}
      <ExploreTools
        className="mt-12 border-t border-hairline pt-10"
        heading="More free tools"
        subtitle="All on-device — nothing you open here is uploaded."
      />
    </div>
  );
}
