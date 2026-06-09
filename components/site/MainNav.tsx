"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolIcon } from "@/components/site/ToolIcon";
import { cn } from "@/lib/utils";

/** Header nav with a Tools mega-menu (every tool one click away, anywhere). */
export function MainNav() {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Clear any pending close timer when the nav unmounts (avoid a setState
  // firing on an unmounted component during a route change).
  React.useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
      <Link
        href="/"
        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        Passport
      </Link>

      <Link
        href="/tools/exam-package/"
        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        Exams
      </Link>

      <Link
        href="/blog/"
        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        Blog
      </Link>

      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
            open ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Tools
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 flex w-[min(92vw,680px)] flex-col overflow-hidden rounded-lg border border-hairline bg-paper shadow-pop">
            {/* Scrollable content — never taller than the viewport */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: "min(calc(100vh - 5.5rem), 420px)" }}>
              <div className="space-y-4">
                {TOOLS_CATALOG.map((group) => (
                  <div key={group.group}>
                    {/* Group header — acts as a link to the category page */}
                    <Link
                      href={`/tools/${group.slug}/`}
                      onClick={() => setOpen(false)}
                      className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-brand"
                    >
                      {group.group}
                      <span className="flex-1 border-t border-hairline" />
                    </Link>

                    {/* Tools grid — flows across the full panel width */}
                    <ul className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
                      {group.tools
                        .filter((t) => t.ready)
                        .map((t) => (
                          <li key={t.slug}>
                            <Link
                              href={`/tools/${t.slug}/`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-foreground transition-colors hover:bg-accent/60"
                            >
                              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-hairline bg-card text-ink-soft">
                                <ToolIcon name={t.icon} className="h-3 w-3" />
                              </span>
                              <span className="truncate">{t.title}</span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer always visible — never scrolled away */}
            <div className="shrink-0 border-t border-hairline bg-paper px-4 py-2.5">
              <Link
                href="/tools/"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
              >
                View all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
