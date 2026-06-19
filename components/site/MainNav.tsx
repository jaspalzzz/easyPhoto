"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight, Lock, Zap } from "lucide-react";
import {
  TOOLS_CATALOG,
  READY_TOOLS,
  getTool,
  toolColorCategory,
  type ToolColorCategory,
  type ToolEntry,
} from "@/lib/toolsCatalog";
import { ToolIconTile } from "@/components/site/ToolIcon";
import { cn } from "@/lib/utils";

// Three flagship tools anchoring the featured row — one per broad category.
const FEATURED_SLUGS = ["exam-package", "background-removal", "pdf-compress"] as const;

// Tools launched recently — shown with a "New" badge in the column list.
const NEW_SLUGS = new Set([
  "camera-capture",
  "straighten-photo",
  "red-eye-removal",
  "print-sheet",
  "photo-signature-merge",
  "dpi-converter",
  "photo-validator",
]);

// Colored left-border accent per category column.
const CAT_ACCENT: Record<string, string> = {
  photo: "bg-[hsl(174_78%_32%)]",
  pdf: "bg-[hsl(8_85%_50%)]",
  signature: "bg-[hsl(248_75%_58%)]",
};

// Tinted card background for each featured tool, keyed by ToolColorCategory.
const FEAT_TINT: Record<ToolColorCategory, string> = {
  photo:     "bg-[hsl(174_78%_32%/0.06)] border-[hsl(174_78%_32%/0.22)] hover:border-[hsl(174_78%_32%/0.45)]",
  pdf:       "bg-[hsl(8_85%_50%/0.06)]   border-[hsl(8_85%_50%/0.22)]   hover:border-[hsl(8_85%_50%/0.45)]",
  signature: "bg-[hsl(248_75%_58%/0.06)] border-[hsl(248_75%_58%/0.22)] hover:border-[hsl(248_75%_58%/0.45)]",
  privacy:   "bg-[hsl(150_70%_36%/0.06)] border-[hsl(150_70%_36%/0.22)] hover:border-[hsl(150_70%_36%/0.45)]",
  convert:   "bg-[hsl(212_88%_48%/0.06)] border-[hsl(212_88%_48%/0.22)] hover:border-[hsl(212_88%_48%/0.45)]",
  exam:      "bg-[hsl(33_92%_46%/0.06)]  border-[hsl(33_92%_46%/0.22)]  hover:border-[hsl(33_92%_46%/0.45)]",
};

/** Header nav with a premium Tools mega-menu. */
export function MainNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click or Escape.
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

  React.useEffect(
    () => () => { if (closeTimer.current) clearTimeout(closeTimer.current); },
    []
  );

  const openNow = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const closeSoon = () => { closeTimer.current = setTimeout(() => setOpen(false), 150); };

  const featured = FEATURED_SLUGS
    .map((slug) => getTool(slug))
    .filter((t): t is ToolEntry => t !== undefined);

  return (
    <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
      <Link
        href="/passport-photo/"
        aria-current={pathname === "/passport-photo/" ? "page" : undefined}
        className={cn(
          "rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground",
          pathname === "/passport-photo/" ? "text-foreground font-medium" : "text-muted-foreground"
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
            open ? "bg-accent text-foreground" : "text-muted-foreground"
          )}
        >
          Tools
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          />
        </button>

        {open && (
          <div
            id="tools-mega-menu"
            role="menu"
            className="ep-fade-in absolute right-0 z-50 mt-1.5 w-[min(94vw,1180px)] overflow-hidden rounded-2xl border border-hairline bg-surface shadow-pop"
          >
            {/* ── Featured picks ────────────────────────────────────────────── */}
            <div className="border-b border-hairline bg-accent/20 px-4 pb-4 pt-3">
              <p className="mb-2.5 select-none text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Most popular
              </p>
              <div className="grid grid-cols-3 gap-3">
                {featured.map((t) => {
                  const cat = toolColorCategory(t.slug);
                  return (
                    <Link
                      key={t.slug}
                      href={`/tools/${t.slug}/`}
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className={cn(
                        "group/feat flex items-start gap-3.5 rounded-xl border p-3.5 transition-all duration-150 hover:shadow-sm",
                        FEAT_TINT[cat]
                      )}
                    >
                      <ToolIconTile
                        name={t.icon}
                        category={cat}
                        size="md"
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold leading-tight text-foreground">
                          {t.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-muted-foreground">
                          {t.blurb}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Category columns ──────────────────────────────────────────── */}
            {/* 4 equal columns. Photo (18 tools) spans 2 of them with an internal
                2-col grid, so EVERY tool cell is the same width — fully symmetrical,
                names have room to breathe, and nothing scrolls. */}
            <div className="grid grid-cols-4 p-2">
              {TOOLS_CATALOG.map((group, gi) => {
                const tools = group.tools.filter((t) => t.ready);
                const accentCls = CAT_ACCENT[group.slug] ?? "bg-brand";
                const isPhoto = group.slug === "photo";

                return (
                  <div
                    key={group.group}
                    className={cn(
                      "px-2.5",
                      isPhoto ? "col-span-2" : "col-span-1",
                      gi > 0 && "border-l border-hairline"
                    )}
                  >
                    {/* Column header → category landing page */}
                    <Link
                      href={`/tools/${group.slug}/`}
                      onClick={() => setOpen(false)}
                      role="menuitem"
                      className="group/head mb-1.5 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
                    >
                      <span className={cn("h-3.5 w-[3px] shrink-0 rounded-full", accentCls)} />
                      <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-foreground">
                        {group.group}
                      </span>
                      <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
                        {tools.length}
                      </span>
                    </Link>

                    {/* Photo flows into 2 sub-columns; PDF + Signature are single lists.
                        Both use the same gap so every cell aligns to the same grid. */}
                    <div className={cn(isPhoto && "grid grid-cols-2 gap-x-1")}>
                      {tools.map((t) => {
                        const isNew = NEW_SLUGS.has(t.slug);
                        return (
                          <Link
                            key={t.slug}
                            href={`/tools/${t.slug}/`}
                            onClick={() => setOpen(false)}
                            role="menuitem"
                            className="group/item flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-accent/60"
                          >
                            <ToolIconTile
                              name={t.icon}
                              category={toolColorCategory(t.slug)}
                              size="sm"
                              className="!h-6 !w-6 !rounded-md shrink-0"
                            />
                            <span className="flex-1 truncate text-[12px] font-medium leading-tight text-foreground">
                              {t.title}
                            </span>
                            {isNew ? (
                              <span className="shrink-0 rounded-full bg-brand/10 px-1 py-[2px] text-[8px] font-bold uppercase tracking-wide text-brand">
                                New
                              </span>
                            ) : t.popular ? (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cta opacity-60" />
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-t border-hairline bg-accent/20 px-4 py-2.5">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" strokeWidth={2} />
                  100% private
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Zap className="h-3 w-3" strokeWidth={2} />
                  Browser-only · no upload
                </span>
              </div>
              <Link
                href="/tools/"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong bg-surface px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
              >
                All {READY_TOOLS.length} tools
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
