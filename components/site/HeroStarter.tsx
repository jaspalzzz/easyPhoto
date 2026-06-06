"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/tool/Uploader";
import { Flag } from "@/components/site/Flag";
import { useToolStore } from "@/store/useToolStore";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import {
  PASSPORT_COUNTRIES,
  VISA_COUNTRIES,
  passportPath,
  visaPath,
  primaryMakerPath,
} from "@/lib/makerPages";
import { cn } from "@/lib/utils";

/**
 * In-hero quick start: pick a country, drop a photo — we stash the file and
 * route to that country's maker page, which processes it immediately.
 *
 * `kind` selects which maker pages to route to:
 *  - "primary" (homepage): every launch country → its main page
 *  - "passport" / "visa" (hub pages): only countries with that page type
 */
export function HeroStarter({
  kind = "primary",
}: {
  kind?: "primary" | "passport" | "visa";
}) {
  const router = useRouter();
  const setPendingFile = useToolStore((s) => s.setPendingFile);

  const countries: readonly string[] =
    kind === "passport"
      ? PASSPORT_COUNTRIES
      : kind === "visa"
        ? VISA_COUNTRIES
        : LAUNCH_ORDER;

  const pathFor = (id: string) =>
    kind === "passport"
      ? passportPath(id)
      : kind === "visa"
        ? visaPath(id)
        : primaryMakerPath(id);

  const [country, setCountry] = React.useState(countries[0]);

  const start = (file: File) => {
    setPendingFile(file);
    router.push(pathFor(country));
  };

  return (
    <div className="rounded-2xl border bg-card/95 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-8">
      <div className="mb-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Choose country
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {countries.map((id) => (
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
