"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/tool/Uploader";
import { Flag } from "@/components/site/Flag";
import { useToolStore } from "@/store/useToolStore";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { cn } from "@/lib/utils";

/**
 * In-hero quick start: pick a country, drop a photo — we stash the file and
 * route to that country page, which processes it immediately. Zero detours.
 */
export function HeroStarter() {
  const router = useRouter();
  const setPendingFile = useToolStore((s) => s.setPendingFile);
  const [country, setCountry] = React.useState(LAUNCH_ORDER[0]);

  const start = (file: File) => {
    setPendingFile(file);
    router.push(`/${country}/`);
  };

  return (
    <div className="rounded-2xl border bg-card/95 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-8">
      <div className="mb-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Choose country
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {LAUNCH_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCountry(id)}
              aria-pressed={country === id}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                country === id
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              <Flag country={id} />
              {COUNTRY_SPECS[id].label}
            </button>
          ))}
        </div>
      </div>

      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        2. Add your photo
      </span>
      <div className="mt-3">
        <Uploader onFile={start} className="min-h-[240px] gap-4 py-14" />
      </div>
    </div>
  );
}
