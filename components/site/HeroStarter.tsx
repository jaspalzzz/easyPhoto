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
    <div className="panel overflow-hidden">
      <div className="border-b border-hairline px-5 py-4 sm:px-6">
        <span className="eyebrow flex items-center gap-2">
          <span className="text-ink-faint">01</span> Choose country
        </span>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {opts.map((o) => (
            <button
              key={o.path}
              type="button"
              onClick={() => setSel(o.path)}
              aria-pressed={sel === o.path}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                sel === o.path
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline-strong bg-paper text-foreground hover:border-ink/30 hover:bg-accent/50"
              )}
            >
              <Flag country={o.flag} />
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <span className="eyebrow flex items-center gap-2">
          <span className="text-ink-faint">02</span> Add your photo
        </span>
        <div className="mt-3">
          <Uploader onFile={start} className="min-h-[230px] gap-4 py-12" />
        </div>
      </div>
    </div>
  );
}
