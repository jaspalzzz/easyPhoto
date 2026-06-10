import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { LogoMark } from "@/components/site/LogoMark";
import { ExploreTools } from "@/components/site/ExploreTools";

/**
 * Custom 404 — a dead-end is a wasted visitor. Instead of a flat "not found",
 * we acknowledge it briefly, then funnel straight into the highest-intent paths
 * (passport maker, exam resizer, all tools) and the popular-tools strip, so the
 * page always offers an obvious, tempting next step.
 */
export default function NotFound() {
  return (
    <div className="container max-w-4xl py-16 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-card">
          <LogoMark className="h-8 w-8" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand">
          404 — page not found
        </p>
        <h1 className="mt-3 text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-ink sm:text-[2.5rem]">
          This page wandered off
        </h1>
        <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
          The link may be old or mistyped — but you&apos;re seconds away from the
          thing you came to do. Pick up where you meant to.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/passport-photo/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
          >
            Make a passport photo <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
          <Link
            href="/exam-requirements/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
          >
            <Search className="h-4 w-4 text-brand" strokeWidth={1.75} /> Find your exam size
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
          >
            <Home className="h-4 w-4 text-brand" strokeWidth={1.75} /> Home
          </Link>
        </div>
      </div>

      <ExploreTools
        className="mt-16"
        heading="Or grab a popular tool"
        subtitle="Free, private, and ready in seconds — nothing leaves your device."
      />
    </div>
  );
}
