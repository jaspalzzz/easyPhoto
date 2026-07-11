"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown, ArrowRight, Lock, Zap, Globe, GraduationCap,
  PenLine, FileText, Search, Flame, ShieldCheck, BadgeCheck,
} from "lucide-react";
import { READY_TOOLS } from "@/lib/toolsCatalog";
import { MENU_COLUMNS } from "@/lib/toolMenu";
import { cn } from "@/lib/utils";

/* ── Category shortcut cards ─────────────────────────────────────────── */
const CATEGORY_CARDS = [
  {
    title: "Passport & Visa",
    desc: "Perfect photos for your passport & visa.",
    href: "/passport-photo/",
    Icon: Globe,
    badge: "Most Used",
    iconBg:   "bg-amber-100 dark:bg-amber-900/30",
    iconText: "text-amber-700 dark:text-amber-400",
  },
  {
    title: "Exam Applications",
    desc: "Photos for SSC, UPSC, Banking & more exams.",
    href: "/tools/exam-package/",
    Icon: GraduationCap,
    badge: null,
    iconBg:   "bg-blue-100 dark:bg-blue-900/30",
    iconText: "text-blue-700 dark:text-blue-400",
  },
  {
    title: "Signature Tools",
    desc: "Create, resize & prepare signatures for forms.",
    href: "/tools/signature/",
    Icon: PenLine,
    badge: null,
    iconBg:   "bg-emerald-100 dark:bg-emerald-900/30",
    iconText: "text-emerald-700 dark:text-emerald-400",
  },
  {
    title: "PDF Tools",
    desc: "Convert, compress & manage PDF files.",
    href: "/tools/pdf/",
    Icon: FileText,
    badge: null,
    iconBg:   "bg-violet-100 dark:bg-violet-900/30",
    iconText: "text-violet-700 dark:text-violet-400",
  },
] as const;

/* ── Trending strip ──────────────────────────────────────────────────── */
const TRENDING = [
  { title: "Passport Photo Maker", href: "/passport-photo/" },
  { title: "SSC Photo Tool",        href: "/tools/form-resizer/ssc/" },
  { title: "Compress PDF",          href: "/tools/pdf-compress/" },
  { title: "Background Remover",    href: "/tools/background-removal/" },
  { title: "Signature Resize",      href: "/tools/signature-resize/" },
];


/* ── Footer trust signals ─────────────────────────────────────────────── */
const FOOTER_SIGNALS = [
  { Icon: ShieldCheck, label: "100% Private",         sub: "Your files never leave your device", iconBg: "bg-amber-100 dark:bg-amber-900/30",   iconText: "text-amber-700 dark:text-amber-400"  },
  { Icon: Zap,         label: "Browser Processing",   sub: "No uploads, no waiting",             iconBg: "bg-blue-100 dark:bg-blue-900/30",     iconText: "text-blue-700 dark:text-blue-400"    },
  { Icon: Lock,        label: "No Data Stored",       sub: "We don't store your files",          iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconText: "text-emerald-700 dark:text-emerald-400"},
  { Icon: BadgeCheck,  label: "Spec-Checked",         sub: "Against published requirements",     iconBg: "bg-violet-100 dark:bg-violet-900/30", iconText: "text-violet-700 dark:text-violet-400" },
] as const;

/* ═══════════════════════════════════════════════════════════════════════
   MainNav
   ═══════════════════════════════════════════════════════════════════════ */
export function MainNav({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState("");
  const pathname = usePathname();
  const router = useRouter();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Close on outside click / Escape */
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

  /* Close + clear search whenever the page changes (client-side nav) */
  React.useEffect(() => {
    setOpen(false);
    setSearchVal("");
  }, [pathname]);

  /* ⌘K / Ctrl+K → open and focus search */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(
    () => () => { if (closeTimer.current) clearTimeout(closeTimer.current); },
    []
  );

  // Clamp the mega-menu so it never overflows the left viewport edge.
  // Problem: `absolute right-0` is relative to the small "Tools" button div,
  // not the viewport. On ~1366px laptops or at 125% Windows DPI scaling the
  // 1220px-wide panel can bleed off the left side. We measure after open and
  // nudge the right offset until the left edge has at least 8px clearance.
  React.useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (!open) { el.style.right = ""; return; }
    el.style.right = "";                              // reset any prior correction
    const overflow = 8 - el.getBoundingClientRect().left; // px short of safe zone
    if (overflow > 0) el.style.right = `${-overflow}px`;  // shift panel right
  }, [open]);

  const openNow = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true); };
  const closeSoon = () => { closeTimer.current = setTimeout(() => setOpen(false), 150); };
  const close = () => setOpen(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchVal.trim()) {
      router.push(`/tools/?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      close();
    }
  };

  const linkCls = (active: boolean) =>
    cn(
      "rounded-md px-3 py-2 transition-colors",
      onDark
        ? cn("hover:bg-white/10 hover:text-white", active ? "font-medium text-white" : "text-white/70")
        : cn("hover:bg-accent hover:text-foreground", active ? "font-medium text-foreground" : "text-muted-foreground")
    );

  return (
    <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
      <Link
        href="/passport-photo/"
        aria-current={pathname === "/passport-photo/" ? "page" : undefined}
        className={linkCls(pathname === "/passport-photo/")}
      >
        Passport
      </Link>

      <Link
        href="/tools/exam-package/"
        aria-current={pathname === "/tools/exam-package/" ? "page" : undefined}
        className={linkCls(pathname === "/tools/exam-package/")}
      >
        Exams
      </Link>

      <Link
        href="/blog/"
        aria-current={pathname === "/blog/" || pathname.startsWith("/blog/") ? "page" : undefined}
        className={linkCls(pathname === "/blog/" || pathname.startsWith("/blog/"))}
      >
        Blog
      </Link>

      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
      >
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls="tools-mega-menu"
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-3 py-2 transition-colors",
            onDark
              ? cn("hover:bg-white/10 hover:text-white", open ? "bg-white/10 text-white" : "text-white/70")
              : cn("hover:bg-accent hover:text-foreground", open ? "bg-accent text-foreground" : "text-muted-foreground")
          )}
        >
          Tools
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
        </button>

        {open && (
          <div
            ref={menuRef}
            id="tools-mega-menu"
            role="menu"
            className="ep-fade-in absolute right-0 z-50 mt-1.5 w-[min(96vw,1220px)] max-h-[calc(100vh-72px)] overflow-x-hidden overflow-y-auto rounded-2xl border border-hairline bg-surface shadow-[0_8px_48px_rgba(0,0,0,0.14)]"
          >

            {/* ── Search + Trending ─────────────────────────────────── */}
            <div className="flex items-center gap-4 border-b border-hairline bg-paper px-4 py-3">
              {/* Search */}
              <div className="flex min-w-[220px] max-w-[280px] items-center gap-2.5 rounded-lg border border-hairline bg-surface px-3 py-2 transition-all focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/20">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search any tool..."
                  className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
                />
                <span className="shrink-0 rounded border border-hairline bg-paper px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-muted-foreground">
                  ⌘K
                </span>
              </div>

              {/* Trending */}
              <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                  <Flame className="h-3.5 w-3.5 text-orange-500" strokeWidth={2} />
                  Trending this week
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {TRENDING.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={close}
                      role="menuitem"
                      className="shrink-0 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[11px] font-medium text-ink transition-colors hover:bg-accent"
                    >
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 4 Category shortcut cards ─────────────────────────── */}
            <div className="grid grid-cols-4 gap-2 bg-surface/60 px-4 py-2">
              {CATEGORY_CARDS.map(({ title, desc, href, Icon, badge, iconBg, iconText }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  role="menuitem"
                  className="group flex items-center gap-2.5 rounded-xl border border-hairline bg-surface p-2.5 shadow-sm transition-all hover:border-hairline-strong hover:shadow-md"
                >
                  {/* Compact icon circle */}
                  <span className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    iconBg, iconText
                  )}>
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-[12.5px] font-bold leading-tight text-ink">{title}</p>
                      {badge && (
                        <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* ── 5-column tool list ────────────────────────────────── */}
            <div className="grid grid-cols-5 divide-x divide-hairline bg-surface px-2 py-2">
              {MENU_COLUMNS.map((col) => (
                <div key={col.label} className="flex flex-col px-3 py-2">
                  {/* Column header with color accent bar */}
                  <Link
                    href={col.href}
                    onClick={close}
                    role="menuitem"
                    className="mb-2.5 flex items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-accent/50"
                  >
                    <span className={cn("h-4 w-[3px] shrink-0 rounded-full", col.barCls)} />
                    <col.Icon className={cn("h-3.5 w-3.5 shrink-0", col.tileText)} strokeWidth={1.75} />
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-ink">
                      {col.label}
                    </span>
                  </Link>

                  {/* Tool rows with colored icon tiles */}
                  <div className="flex flex-col gap-0.5">
                    {col.tools.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        onClick={close}
                        role="menuitem"
                        className="group/item flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors hover:bg-accent/60"
                      >
                        {/* Colored icon tile */}
                        <span className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          col.tileBg, col.tileText
                        )}>
                          <t.Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold leading-tight text-ink">
                            {t.title}
                          </p>
                          <p className="mt-0.5 text-[10.5px] leading-none text-muted-foreground">
                            {t.tag}
                          </p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>

                  {/* View all → */}
                  <Link
                    href={col.viewAllHref}
                    onClick={close}
                    role="menuitem"
                    className={cn("mt-3 flex items-center gap-1 text-[11px] font-bold hover:underline", col.tileText)}
                  >
                    {col.viewAllLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* ── Footer trust strip ────────────────────────────────── */}
            <div className="flex items-center justify-between border-t border-hairline bg-paper px-4 py-3">
              <div className="flex items-center gap-5">
                {FOOTER_SIGNALS.map(({ Icon, label, sub, iconBg, iconText }) => (
                  <span key={label} className="flex items-center gap-2">
                    <span className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      iconBg, iconText
                    )}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                    <span>
                      <p className="text-[11.5px] font-bold text-ink">{label}</p>
                      <p className="hidden text-[10px] leading-tight text-muted-foreground xl:block">{sub}</p>
                    </span>
                  </span>
                ))}
              </div>
              <Link
                href="/tools/"
                onClick={close}
                role="menuitem"
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong bg-surface px-3.5 py-2 text-[12px] font-bold text-ink shadow-sm transition-colors hover:bg-accent"
              >
                View all {READY_TOOLS.length} tools
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}
