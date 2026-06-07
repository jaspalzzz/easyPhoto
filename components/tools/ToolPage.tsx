import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { relatedTools, getTool, categoryOf } from "@/lib/toolsCatalog";
import { ToolIcon } from "@/components/site/ToolIcon";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { breadcrumbSchema, softwareApplicationSchema } from "@/lib/schema";

/** Shared chrome for a tool page: breadcrumb, heading, body, related links. */
export function ToolPage({
  title,
  blurb,
  slug,
  children,
  footnote,
  faqItems,
}: {
  title: string;
  blurb: string;
  /** Catalog slug — enables related cross-links + structured data. */
  slug?: string;
  children: React.ReactNode;
  footnote?: string;
  /** Optional on-page FAQ (also emits FAQPage JSON-LD). */
  faqItems?: FaqItem[];
}) {
  const related = slug ? relatedTools(slug) : [];
  const entry = slug ? getTool(slug) : undefined;
  const category = slug ? categoryOf(slug) : undefined;

  return (
    <div className="container max-w-3xl py-10">
      {entry && (
        <JsonLd
          schema={[
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools/" },
              ...(category
                ? [{ name: category.group, path: `/tools/${category.slug}/` }]
                : []),
              { name: title, path: `/tools/${slug}/` },
            ]),
            softwareApplicationSchema({
              name: title,
              description: blurb,
              url: `/tools/${slug}/`,
              category: "MultimediaApplication",
            }),
          ]}
        />
      )}
      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All tools
      </Link>
      <header className="mt-4 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground">{blurb}</p>
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
          <div className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}/`}
                className="group flex items-center gap-3 bg-card p-4 transition-colors hover:bg-accent/40"
              >
                <ToolIcon name={t.icon} className="h-4 w-4 shrink-0 text-brand" />
                <span className="text-sm font-medium leading-tight">
                  {t.title}
                </span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.75} />
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
    </div>
  );
}
