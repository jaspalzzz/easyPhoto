import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  COUNTRY_SPECS,
  LAUNCH_ORDER,
  effectivePrintMm,
} from "@/lib/countrySpecs";
import { POPULAR_TOOLS } from "@/lib/toolsCatalog";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { TrustStrip, TrustPills } from "@/components/site/TrustStrip";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Faq } from "@/components/site/Faq";
import { ToolIcon } from "@/components/site/ToolIcon";

const FLAGS: Record<string, string> = {
  us: "🇺🇸",
  india: "🇮🇳",
  schengen: "🇪🇺",
  uk: "🇬🇧",
  canada: "🇨🇦",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-surface relative overflow-hidden border-b">
        <div className="surface-grid pointer-events-none absolute inset-0" />
        <div className="container relative py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            100% in-browser · your photo never leaves your device
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Compliant passport &amp; visa photos,{" "}
            <span className="text-brand">made in your browser</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            Upload a photo and we auto-crop it to your country&apos;s exact
            head-size and background rules, then check it for compliance. Free,
            no watermark, no upload.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#countries"
              className={buttonVariants({ size: "lg", variant: "cta" })}
            >
              Make my passport photo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tools/"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Browse all tools
            </Link>
          </div>
          <div className="mt-10">
            <TrustPills />
          </div>
        </div>
      </section>

      {/* Country picker */}
      <section id="countries" className="container scroll-mt-20 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Choose your country
          </h2>
          <p className="mt-1 text-muted-foreground">
            Each option uses that country&apos;s official photo specification.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LAUNCH_ORDER.map((id) => {
            const spec = COUNTRY_SPECS[id];
            const mm = effectivePrintMm(spec);
            return (
              <Link key={id} href={`/${id}/`} className="group">
                <Card className="card-hover h-full">
                  <CardContent className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden>
                        {FLAGS[id]}
                      </span>
                      <span className="font-semibold">{spec.label}</span>
                      <ArrowRight className="ml-auto h-4 w-4 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mm.width}×{mm.height}mm ·{" "}
                      {spec.background.description.split("(")[0].trim()}
                    </p>
                    <p className="mt-auto text-xs text-muted-foreground">
                      {spec.documents[0]}
                      {spec.documents.length > 1
                        ? ` +${spec.documents.length - 1} more`
                        : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y bg-muted/30">
        <div className="container py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Why people trust easyPhoto
            </h2>
            <p className="mx-auto mt-1 max-w-2xl text-muted-foreground">
              No accounts, no uploads, no guesswork — just the official rules,
              applied automatically.
            </p>
          </div>
          <TrustStrip />
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16">
        <HowItWorks />
      </section>

      {/* Popular tools */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Popular free tools
              </h2>
              <p className="mt-1 text-muted-foreground">
                Quick image &amp; PDF utilities — all private, all in your browser.
              </p>
            </div>
            <Link
              href="/tools/"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline sm:inline-flex"
            >
              All tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_TOOLS.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}/`} className="group">
                <Card className="card-hover h-full">
                  <CardContent className="flex h-full items-start gap-4 p-5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
                      <ToolIcon name={tool.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="font-semibold">{tool.title}</span>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tool.blurb}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <Faq />
      </section>
    </>
  );
}
