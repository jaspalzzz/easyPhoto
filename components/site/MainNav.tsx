"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import { TOOLS_CATALOG } from "@/lib/toolsCatalog";
import { ToolIcon } from "@/components/site/ToolIcon";
import { cn } from "@/lib/utils";

/** Header nav with a Tools mega-menu (every tool one click away, anywhere). */
export function MainNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
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
        aria-current={pathname === "/" ? "page" : undefined}
        className={cn(
          "rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
          pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        Passport
      </Link>

      <Link
        href="/tools/exam-package/"
        aria-current={pathname === "/tools/exam-package/" ? "page" : undefined}
        className={cn(
          "rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
          pathname === "/tools/exam-package/" ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        Exams
      </Link>

      <Link
        href="/blog/"
        aria-current={pathname === "/blog/" || pathname.startsWith("/blog/") ? "page" : undefined}
        className={cn(
          "rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
          pathname === "/blog/" || pathname.startsWith("/blog/") ? "text-foreground font-medium" : "text-muted-foreground"
        )}
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
          aria-haspopup="menu"
          aria-controls="tools-mega-menu"
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
          <div
            id="tools-mega-menu"
            role="menu"
            className="absolute right-0 z-50 mt-2 w-[min(95vw,760px)] overflow-hidden rounded-xl border border-hairline bg-paper shadow-pop"
          >
            {/* One column per category — every tool visible at a glance, no scroll */}
            <div className="grid grid-cols-3 divide-x divide-hairline">
              {TOOLS_CATALOG.map((group) => {
                const tools = group.tools.filter((t) => t.ready);
                return (
                  <div key={group.group} className="p-2.5">
                    {/* Category header — links to the category landing page */}
                    <Link
                      href={`/tools/${group.slug}/`}
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className="group/head mb-1.5 flex items-center justify-between gap-2 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand/5"
                    >
                      <span>{group.group}</span>
                      <span className="text-[10px] font-normal tabular-nums text-muted-foreground transition-colors group-hover/head:text-brand">
                        {tools.length}
                      </span>
                    </Link>

                    <ul className="space-y-0.5">
                      {tools.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/tools/${t.slug}/`}
                            onClick={() => setOpen(false)}
                            role="menuitem"
                            className="group/item flex items-start gap-2 rounded-md px-2 py-1.5 text-[13px] leading-snug text-foreground transition-colors hover:bg-accent/60"
                          >
                            <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-hairline bg-card text-ink-soft transition-colors group-hover/item:border-brand/40 group-hover/item:text-brand">
                              <ToolIcon name={t.icon} className="h-3 w-3" />
                            </span>
                            <span>{t.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-hairline bg-surface/40 px-4 py-2.5">
              <span className="text-[11px] text-muted-foreground">
                100% free · works in your browser · no upload
              </span>
              <Link
                href="/tools/"
                onClick={() => setOpen(false)}
                role="menuitem"
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
