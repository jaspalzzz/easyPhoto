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

  // The visa hub lists the visa maker pages; the homepage and the passport hub
  // both offer every launch country, each routed to its primary maker (a
  // dedicated passport page where one exists, otherwise the visa maker — the
  // photo spec is the same 35×45-style frame). This keeps "Passport" a true
  // all-country picker rather than only the handful with bespoke passport pages.
  const opts: Opt[] =
    kind === "visa"
      ? makerPagesByKind("visa").map((m) => ({
          flag: m.flag,
          label: makerSpec(m.slug)!.label,
          path: `/${m.slug}/`,
        }))
      : LAUNCH_ORDER.map((id) => ({
          flag: id,
          label: COUNTRY_SPECS[id].label,
          path: primaryMakerPath(id),
        }));

  const [sel, setSel] = React.useState(opts[0]?.path ?? "");

  // On the HOMEPAGE only, curate the full launch list (22+) to a tight set so
  // the starter card stays compact — the rest are one tap behind a quiet
  // "+N more". The dedicated Passport/Visa hubs are about choosing a country,
  // so they always show every option.
  const TOP = 8;
  const collapsible = kind === "primary";
  const [showAll, setShowAll] = React.useState(false);
  const visible = !collapsible || showAll ? opts : opts.slice(0, TOP);
  const hiddenCount = opts.length - TOP;

  const start = (file: File) => {
    setPendingFile(file);
    router.push(sel);
  };

  if (opts.length === 0) return null;

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-hairline px-5 py-4 sm:px-6">
        <span className="eyebrow flex items-center gap-2">
          <span className="text-ink-faint">01</span> Choose country
        </span>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visible.map((o) => (
            <button
              key={o.path}
              type="button"
              onClick={() => setSel(o.path)}
              aria-pressed={sel === o.path}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                sel === o.path
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-hairline-strong bg-paper text-foreground hover:border-brand/40 hover:bg-brand-soft/40"
              )}
            >
              <Flag country={o.flag} />
              {o.label}
            </button>
          ))}
          {collapsible && !showAll && hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1 rounded-md border border-dashed border-hairline-strong px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              +{hiddenCount} more
            </button>
          )}
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
