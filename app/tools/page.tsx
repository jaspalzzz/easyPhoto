import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS_CATALOG, POPULAR_TOOLS } from "@/lib/toolsCatalog";
import { KB_TARGETS, kbPath } from "@/lib/kbTargets";
import { Card, CardContent } from "@/components/ui/card";
import { ToolIcon } from "@/components/site/ToolIcon";
import { TrustPills } from "@/components/site/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Image, PDF & Signature Tools — Private, In Your Browser",
  description:
    "Free online tools that run entirely in your browser: background remover, " +
    "compress image to KB, resize images, JPG to PDF, PDF to JPG, and signature " +
    "tools. Nothing is uploaded — everything stays on your device.",
  path: "/tools/",
});

export default function ToolsHubPage() {
  return (
    <div className="container max-w-5xl py-12">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/" },
        ])}
      />
      <header className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Free, private tools
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Everyday image, PDF and signature utilities that run entirely in your
          browser. No sign-up, no watermark, and your files never leave your
          device.
        </p>
        <div className="pt-1">
          <TrustPills />
        </div>
      </header>

      {/* Most popular — highest-demand tools surfaced first */}
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Most popular
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}/`} className="group">
              <Card className="card-hover h-full">
                <CardContent className="flex h-full items-start gap-4 p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                    <ToolIcon name={tool.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="flex items-center gap-1 font-semibold">
                      {tool.title}
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tool.blurb}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Resize to an exact file size (high-intent landing pages) */}
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Resize to an exact file size
        </h2>
        <div className="flex flex-wrap gap-2">
          {KB_TARGETS.map((kb) => (
            <Link
              key={kb}
              href={kbPath(kb)}
              className="rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Resize to {kb} KB
            </Link>
          ))}
          <Link
            href="/tools/resize-kb/"
            className="rounded-full border px-4 py-2 text-sm font-medium text-brand hover:bg-accent"
          >
            Custom size
          </Link>
        </div>
      </section>

      {/* Full catalog by category */}
      {TOOLS_CATALOG.map((group) => (
        <section key={group.group} className="mt-12">
          <Link
            href={`/tools/${group.slug}/`}
            className="mb-4 inline-flex items-center gap-1 text-lg font-semibold hover:text-brand"
          >
            {group.group}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.tools.map((tool) =>
              tool.ready ? (
                <Link key={tool.slug} href={`/tools/${tool.slug}/`} className="group">
                  <Card className="card-hover h-full">
                    <CardContent className="flex items-start gap-4 p-5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                        <ToolIcon name={tool.icon} className="h-5 w-5" />
                      </span>
                      <div>
                        <span className="font-medium">{tool.title}</span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {tool.blurb}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card key={tool.slug} className="h-full opacity-60">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <ToolIcon name={tool.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tool.title}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Coming soon
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tool.blurb}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
