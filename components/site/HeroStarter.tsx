"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Uploader } from "@/components/tool/Uploader";
import { Button } from "@/components/ui/button";
import { Flag } from "@/components/site/Flag";
import { useToolStore } from "@/store/useToolStore";
import { hubCountries } from "@/lib/makerPages";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface Opt {
  key: string;
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
  // A photo handed over by another tool (e.g. camera-capture's "Make a
  // passport photo") arrives before the country is known. Keep it and let the
  // user pick the country, instead of showing an empty drop zone that loses it.
  // Only ever set after a client-side navigation, so SSR output is unaffected.
  const pendingFile = useToolStore((s) => s.pendingFile);

  // Single source of truth (lib/makerPages hubCountries) so this picker and the
  // "size by country" grid can never drift apart. "primary" (homepage) behaves
  // like the passport hub: every launch country.
  const opts: Opt[] = hubCountries(kind === "visa" ? "visa" : "passport").map(
    (c) => ({ key: c.key, flag: c.flag, label: c.label, path: c.path })
  );

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
              key={o.key}
              type="button"
              onClick={() => {
                setSel(o.path);
                track({ name: "country_select", country: o.key });
              }}
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
          {pendingFile ? (
            <div className="rounded-lg border border-brand/40 bg-brand-soft/20 p-4 text-sm">
              <p className="font-medium text-ink">Your photo is ready.</p>
              <p className="mt-1 text-muted-foreground">
                Choose your country above, then continue — no need to add it again.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" onClick={() => router.push(sel)}>
                  Continue with this photo
                </Button>
                <Button type="button" variant="outline" onClick={() => setPendingFile(null)}>
                  Use a different photo
                </Button>
              </div>
            </div>
          ) : (
            <Uploader onFile={start} allowCamera className="min-h-[230px] gap-4 py-12" />
          )}
        </div>
      </div>
    </div>
  );
}
