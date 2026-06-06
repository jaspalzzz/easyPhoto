import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { relatedTools, getTool } from "@/lib/toolsCatalog";
import { Card, CardContent } from "@/components/ui/card";
import { ToolIcon } from "@/components/site/ToolIcon";

/** Shared chrome for a tool page: breadcrumb, heading, body, related links. */
export function ToolPage({
  title,
  blurb,
  slug,
  children,
  footnote,
}: {
  title: string;
  blurb: string;
  /** Catalog slug — enables related cross-links + structured data. */
  slug?: string;
  children: React.ReactNode;
  footnote?: string;
}) {
  const related = slug ? relatedTools(slug) : [];
  const entry = slug ? getTool(slug) : undefined;

  return (
    <div className="container max-w-3xl py-10">
      <Link
        href="/tools/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All tools
      </Link>
      <header className="mt-4 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground">{blurb}</p>
      </header>

      <div className="mt-6">{children}</div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
        {footnote ??
          "This tool runs entirely in your browser. Your file is never uploaded to a server."}
      </p>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold">Related tools</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} className="group">
                <Card className="card-hover h-full">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-muted text-brand">
                      <ToolIcon name={t.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium leading-tight">
                      {t.title}
                    </span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {entry && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: title,
              description: blurb,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any (web browser)",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </div>
  );
}
