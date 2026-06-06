"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/tool/Uploader";
import { Flag } from "@/components/site/Flag";
import { useToolStore } from "@/store/useToolStore";
import { COUNTRY_SPECS, LAUNCH_ORDER } from "@/lib/countrySpecs";
import {
  makerPagesByKind,
  makerSpec,
  primaryMakerPath,
} from "@/lib/makerPages";
import { cn } from "@/lib/utils";

interface Opt {
  flag: string;
  label: string;
  path: string;
}

/**
 * In-hero quick start: pick a country, drop a photo — we stash the file and
 * route to that maker page, which processes it immediately.
 *
 * `kind` selects which maker pages to offer:
 *  - "primary" (homepage): every launch country → its main page
 *  - "passport" / "visa" (hub pages): the maker pages of that kind
 */
export function HeroStarter({
  kind = "primary",
}: {
  kind?: "primary" | "passport" | "visa";
}) {
  const router = useRouter();
  const setPendingFile = useToolStore((s) => s.setPendingFile);

  const opts: Opt[] =
    kind === "primary"
      ? LAUNCH_ORDER.map((id) => ({
          flag: id,
          label: COUNTRY_SPECS[id].label,
          path: primaryMakerPath(id),
        }))
      : makerPagesByKind(kind).map((m) => ({
          flag: m.flag,
          label: makerSpec(m.slug)!.label,
          path: `/${m.slug}/`,
        }));

  const [sel, setSel] = React.useState(opts[0].path);

  const start = (file: File) => {
    setPendingFile(file);
    router.push(sel);
  };

  return (
    <div className="rounded-2xl border bg-card/95 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-8">
      <div className="mb-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Choose country
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {opts.map((o) => (
            <button
              key={o.path}
              type="button"
              onClick={() => setSel(o.path)}
              aria-pressed={sel === o.path}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                sel === o.path
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              <Flag country={o.flag} />
              {o.label}
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
