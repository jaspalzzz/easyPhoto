"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown, ArrowRight, Lock, Zap, Globe, GraduationCap,
  PenLine, FileText, Search, Flame, User, Aperture,
  ShieldCheck, BadgeCheck, CreditCard, UserCircle, Printer,
  ScanLine, Package, Award, Train, Landmark, Eraser, Maximize2,
  FileDown, Gauge, RefreshCw, Files, Scissors, FileImage, FilePlus,
  ImageOff, Maximize, Crop, Wand2,
} from "lucide-react";
import { READY_TOOLS } from "@/lib/toolsCatalog";
import { cn } from "@/lib/utils";

/* ── Tool entry with icon ────────────────────────────────────────────── */
interface ColTool {
  title: string;
  tag: string;
  href: string;
  Icon: LucideIcon;
}

/* ── Column definition ───────────────────────────────────────────────── */
interface MenuColumn {
  label: string;
  Icon: LucideIcon;
  href: string;
  viewAllLabel: string;
  viewAllHref: string;
  /* Tailwind classes for icon tile bg + text + bar accent */
  tileBg: string;    /* e.g. "bg-amber-100"   */
  tileText: string;  /* e.g. "text-amber-700" */
  barCls: string;    /* e.g. "bg-amber-500"   */
  tools: ColTool[];
}

/* ── Category shortcut cards ─────────────────────────────────────────── */
const CATEGORY_CARDS = [
  {
    title: "Passport & Visa",
    desc: "Perfect photos for your passport & visa.",
    href: "/passport-photo/",
    Icon: Globe,
    badge: "Most Used",
    iconBg:   "bg-amber-100",
    iconText: "text-amber-700",
  },
  {
    title: "Exam Applications",
    desc: "Photos for SSC, UPSC, Banking & more exams.",
    href: "/tools/exam-package/",
    Icon: GraduationCap,
    badge: null,
    iconBg:   "bg-blue-100",
    iconText: "text-blue-700",
  },
  {
    title: "Signature Tools",
    desc: "Create, resize & prepare signatures for forms.",
    href: "/tools/signature/",
    Icon: PenLine,
    badge: null,
    iconBg:   "bg-emerald-100",
    iconText: "text-emerald-700",
  },
  {
    title: "PDF Tools",
    desc: "Convert, compress & manage PDF files.",
    href: "/tools/pdf/",
    Icon: FileText,
    badge: null,
    iconBg:   "bg-violet-100",
    iconText: "text-violet-700",
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

/* ── 5 curated columns (icons + accent per column) ──────────────────── */
const MENU_COLUMNS: MenuColumn[] = [
  {
    label: "Document Photos",
    Icon: User,
    href: "/passport-photo/",
    viewAllLabel: "View all document tools",
    viewAllHref: "/passport-photo/",
    tileBg: "bg-amber-100", tileText: "text-amber-700", barCls: "bg-amber-400",
    tools: [
      { title: "Passport Photo Maker",  tag: "All countries",        href: "/passport-photo/",            Icon: CreditCard   },
      { title: "LinkedIn Photo Maker",  tag: "Professional photos",  href: "/tools/linkedin-photo/",      Icon: UserCircle   },
      { title: "Resume / CV Photo",     tag: "Job applications",     href: "/tools/resume-photo/",        Icon: FileText     },
      { title: "Photo Print Sheet",     tag: "4×6 inch, A4, more",  href: "/tools/print-sheet/",         Icon: Printer      },
      { title: "Photo Validator",       tag: "Check before submit",  href: "/tools/photo-validator/",     Icon: ScanLine     },
    ],
  },
  {
    label: "Exam Tools",
    Icon: GraduationCap,
    href: "/tools/exam-package/",
    viewAllLabel: "View all exam tools",
    viewAllHref: "/tools/exam-package/",
    tileBg: "bg-blue-100", tileText: "text-blue-700", barCls: "bg-blue-500",
    tools: [
      { title: "Exam Application Kit",  tag: "All exam presets",     href: "/tools/exam-package/",        Icon: Package      },
      { title: "SSC Photo Tool",        tag: "SSC MTS, CGL, CHSL",  href: "/tools/form-resizer/ssc/",    Icon: GraduationCap},
      { title: "UPSC Photo Tool",       tag: "Civil Services Exam",  href: "/tools/form-resizer/upsc/",   Icon: Award        },
      { title: "Railway Photo Tool",    tag: "RRB, NTPC, Group D",  href: "/tools/form-resizer/rrb/",    Icon: Train        },
      { title: "Banking Photo Tool",    tag: "IBPS, SBI, RBI, PO",  href: "/tools/form-resizer/ibps/",   Icon: Landmark     },
    ],
  },
  {
    label: "Image Tools",
    Icon: Aperture,
    href: "/tools/photo/",
    viewAllLabel: "View all image tools",
    viewAllHref: "/tools/photo/",
    tileBg: "bg-emerald-100", tileText: "text-emerald-700", barCls: "bg-emerald-500",
    tools: [
      { title: "Background Remover",    tag: "Remove background",   href: "/tools/background-removal/",  Icon: Eraser       },
      { title: "Resize Image",          tag: "By pixels or mm",     href: "/tools/resize-dimensions/",   Icon: Maximize2    },
      { title: "Compress Image to KB",  tag: "Reduce file size",    href: "/tools/resize-kb/",           Icon: FileDown     },
      { title: "Change Image DPI",      tag: "200, 300 or custom",  href: "/tools/dpi-converter/",       Icon: Gauge        },
      { title: "Image Format Converter",tag: "JPG, PNG, WEBP",      href: "/tools/format-converter/",    Icon: RefreshCw    },
    ],
  },
  {
    label: "PDF Tools",
    Icon: FileText,
    href: "/tools/pdf/",
    viewAllLabel: "View all PDF tools",
    viewAllHref: "/tools/pdf/",
    tileBg: "bg-violet-100", tileText: "text-violet-700", barCls: "bg-violet-500",
    tools: [
      { title: "Compress PDF",          tag: "Reduce PDF size",     href: "/tools/pdf-compress/",        Icon: FileDown     },
      { title: "Merge PDF",             tag: "Combine multiple",    href: "/tools/pdf-merge/",           Icon: Files        },
      { title: "Split PDF",             tag: "Extract pages",       href: "/tools/pdf-split/",           Icon: Scissors     },
      { title: "PDF to JPG",            tag: "Convert to images",   href: "/tools/pdf-to-jpg/",          Icon: FileImage    },
      { title: "JPG to PDF",            tag: "Images to PDF",       href: "/tools/jpg-to-pdf/",          Icon: FilePlus     },
    ],
  },
  {
    label: "Signature Tools",
    Icon: PenLine,
    href: "/tools/signature/",
    viewAllLabel: "View all signature tools",
    viewAllHref: "/tools/signature/",
    tileBg: "bg-orange-100", tileText: "text-orange-700", barCls: "bg-orange-500",
    tools: [
      { title: "Transparent Signature", tag: "PNG with no bg",      href: "/tools/transparent-signature/", Icon: ImageOff   },
      { title: "Signature Resize",      tag: "Resize to any size",  href: "/tools/signature-resize/",    Icon: Maximize     },
      { title: "Signature Crop",        tag: "Crop signature",      href: "/tools/signature-crop/",      Icon: Crop         },
      { title: "Signature Cleaner",     tag: "Remove background",   href: "/tools/signature-cleaner/",   Icon: Wand2        },
      { title: "Sign Image / Photo",    tag: "Add signature",       href: "/tools/sign-image/",          Icon: PenLine      },
    ],
  },
];

/* ── Footer trust signals ─────────────────────────────────────────────── */
const FOOTER_SIGNALS = [
  { Icon: ShieldCheck, label: "100% Private",         sub: "Your files never leave your device", iconBg: "bg-amber-100",   iconText: "text-amber-700"  },
  { Icon: Zap,         label: "Browser Processing",   sub: "No uploads, no waiting",             iconBg: "bg-blue-100",    iconText: "text-blue-700"   },
  { Icon: Lock,        label: "No Data Stored",       sub: "We don't store your files",          iconBg: "bg-emerald-100", iconText: "text-emerald-700"},
  { Icon: BadgeCheck,  label: "Government Compliant", sub: "Official guidelines followed",       iconBg: "bg-violet-100",  iconText: "text-violet-700" },
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
            id="tools-mega-menu"
            role="menu"
            className="ep-fade-in absolute right-0 z-50 mt-1.5 w-[min(96vw,1220px)] overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_8px_48px_rgba(0,0,0,0.14)]"
          >

            {/* ── Search + Trending ─────────────────────────────────── */}
            <div className="flex items-center gap-4 border-b border-hairline bg-paper px-4 py-3">
              {/* Search */}
              <div className="flex min-w-[220px] max-w-[280px] items-center gap-2.5 rounded-lg border border-hairline bg-white px-3 py-2 transition-all focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/20">
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
                      className="shrink-0 rounded-full border border-hairline bg-white px-2.5 py-1 text-[11px] font-medium text-ink transition-colors hover:bg-accent"
                    >
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 4 Category shortcut cards ─────────────────────────── */}
            <div className="grid grid-cols-4 gap-2 bg-white/60 px-4 py-2">
              {CATEGORY_CARDS.map(({ title, desc, href, Icon, badge, iconBg, iconText }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  role="menuitem"
                  className="group flex items-center gap-2.5 rounded-xl border border-hairline bg-white p-2.5 shadow-sm transition-all hover:border-hairline-strong hover:shadow-md"
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
                        <span className="rounded-full bg-amber-100 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide text-amber-700">
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
            <div className="grid grid-cols-5 divide-x divide-hairline bg-white px-2 py-2">
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
                        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
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
                    <ArrowRight className="h-3 w-3" />
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-hairline-strong bg-white px-3.5 py-2 text-[12px] font-bold text-ink shadow-sm transition-colors hover:bg-accent"
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
