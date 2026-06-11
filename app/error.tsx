"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCw, Home } from "lucide-react";

/**
 * Route-level error boundary. Anything a tool throws that we didn't catch
 * lands here instead of a white screen. Privacy note matters: the user's
 * photo was only in memory, so "try again" is always safe.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container max-w-xl py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
        Something went wrong
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        This tool hit an unexpected error
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Your photo was never uploaded — it only existed in this tab&apos;s
        memory. Trying again is safe. If it keeps happening, the file itself
        may be unusual; try re-exporting it as a plain JPG.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-[hsl(22_89%_46%)]"
        >
          <RotateCw className="h-4 w-4" strokeWidth={2} /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
        >
          <Home className="h-4 w-4 text-brand" strokeWidth={1.75} /> Home
        </Link>
      </div>
    </div>
  );
}
