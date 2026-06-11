"use client";

import * as React from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { getRecentTools } from "@/lib/recentTools";
import { getTool } from "@/lib/toolsCatalog";
import { PORTAL_PRESETS } from "@/lib/portalPresets";

interface RecentEntry {
  href: string;
  label: string;
}

/** Resolve a recorded tool name to a link + label, or null if unknown. */
function resolve(name: string): RecentEntry | null {
  // Exam form-resizers record as "form-resizer-<portal>" — the highest-value
  // return destination (the user's OWN exam).
  if (name.startsWith("form-resizer-")) {
    const id = name.slice("form-resizer-".length);
    const spec = PORTAL_PRESETS[id];
    if (!spec) return null;
    return {
      href: `/tools/form-resizer/${id}/`,
      label: `${spec.name.split(" (")[0]} resizer`,
    };
  }
  const tool = getTool(name);
  if (!tool) return null;
  return { href: `/tools/${tool.slug}/`, label: tool.title };
}

/**
 * "Pick up where you left off" — device-local recents (no account, no server;
 * see lib/recentTools.ts). Renders nothing on a first visit, so the homepage
 * stays untouched for new users; returners get one-tap access to their exam.
 */
export function RecentTools() {
  const [entries, setEntries] = React.useState<RecentEntry[]>([]);

  React.useEffect(() => {
    const resolved = getRecentTools()
      .map(resolve)
      .filter((e): e is RecentEntry => e !== null)
      .slice(0, 3);
    setEntries(resolved);
  }, []);

  if (!entries.length) return null;

  return (
    <div className="ep-fade-in container pt-5">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-hairline bg-card px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">
          <History className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
          Pick up where you left off
        </span>
        {entries.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="group inline-flex min-h-9 items-center gap-1 rounded-lg border border-hairline bg-paper px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft/30"
          >
            {e.label}
            <ArrowRight className="h-3.5 w-3.5 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand" strokeWidth={1.75} />
          </Link>
        ))}
      </div>
    </div>
  );
}
