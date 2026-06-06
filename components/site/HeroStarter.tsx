"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/tool/Uploader";
import { useToolStore } from "@/store/useToolStore";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import { cn } from "@/lib/utils";

const FLAGS: Record<string, string> = {
  us: "🇺🇸",
  canada: "🇨🇦",
  schengen: "🇪🇺",
  uk: "🇬🇧",
  india: "🇮🇳",
};

/**
 * In-hero quick start: pick a country, drop a photo — we stash the file and
 * route to that country page, which processes it immediately. Zero detours.
 */
export function HeroStarter() {
  const router = useRouter();
  const setPendingFile = useToolStore((s) => s.setPendingFile);
  const [country, setCountry] = React.useState("us");

  const start = (file: File) => {
    setPendingFile(file);
    router.push(`/${country}/`);
  };

  return (
    <div className="rounded-2xl border bg-card/90 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur sm:p-6">
      <div className="mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Choose country
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {LAUNCH_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCountry(id)}
              aria-pressed={country === id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                country === id
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              <span aria-hidden>{FLAGS[id]}</span>
              {COUNTRY_SPECS[id].label}
            </button>
          ))}
        </div>
      </div>

      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        2. Add your photo
      </span>
      <div className="mt-2">
        <Uploader onFile={start} />
      </div>
    </div>
  );
}
