"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search, X, ArrowRight, LayoutGrid, Wrench,
  BookUser, GraduationCap, FileText, Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Client-side blog explorer. Owns the hero→grid layout so the hero search box
 * and the post grid can share filter state (search lives in the hero-left,
 * below the intro, per the design; the grid sits below the category tabs).
 *
 * `heading`, `featured` and `sidebar` are passed in as server-rendered nodes,
 * so the SEO-critical copy (H1, featured link, sidebar links) is authored on
 * the server. Every post link is rendered in the initial HTML (Client
 * Components are SSR'd by Next) — filtering only shows/hides cards, so Googlebot
 * still crawls every /blog/<slug>/ link and no URLs change.
 */
export interface ExplorerPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readMins: number;
  category: string | null;
}

interface CatMeta { label: string; Icon: LucideIcon; tile: string }

/* Cluster key → display label, icon, and category colour tile. */
const CATS: Record<string, CatMeta> = {
  passport:     { label: "Passport & Visa", Icon: BookUser,      tile: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"           },
  exam:         { label: "Exams",           Icon: GraduationCap, tile: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"   },
  pdf:          { label: "PDF & Docs",      Icon: FileText,      tile: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"           },
  professional: { label: "Professional",    Icon: Briefcase,     tile: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const TAB_ORDER = ["all", "passport", "exam", "pdf", "professional"] as const;
const POPULAR = ["Indian Passport", "Exam", "Signature", "Compress", "Schengen"];

/* Light gold panel + gold button, derived from the --cta token. */
const GOLD_PANEL = {
  background: "hsl(45 88% 60% / 0.10)",
  borderColor: "hsl(45 88% 60% / 0.32)",
} as const;
const GOLD_SOLID = {
  background: "hsl(var(--cta))",
  color: "hsl(var(--cta-foreground))",
} as const;

export interface PopularSearch { label: string; href: string }
export interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readMins: number;
}

export function BlogExplorer({
  posts,
  featured,
  popularSearches,
}: {
  posts: ExplorerPost[];
  featured: FeaturedPost | null;
  popularSearches: PopularSearch[];
}) {
  const [cat, setCat] = React.useState<string>("all");
  const [q, setQ] = React.useState("");
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    for (const p of posts) if (p.category) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [posts]);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const okQ = !needle || `${p.title} ${p.excerpt}`.toLowerCase().includes(needle);
      return okCat && okQ;
    });
  }, [posts, cat, q]);

  const scrollToResults = () =>
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      {/* ── Hero: intro + search (left) · featured guide (right) ───────── */}
      <section className="mt-5 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="flex flex-col">
          <span className="eyebrow text-brand">The easyPhoto blog</span>
          <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.08]">
            Get it right the <span className="mark-gold text-ink">first time</span>
          </h1>
          <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Clear, source-checked guides on passport &amp; visa photos, exam file-size
            limits, signatures and document prep — so your application isn&apos;t
            rejected over the photo.
          </p>

          {/* Search */}
          <div className="mt-6 flex max-w-md items-center overflow-hidden rounded-xl border border-hairline bg-card transition-colors focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/20">
            <Search className="ml-3.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scrollToResults()}
              placeholder="Search guides, topics or documents…"
              aria-label="Search guides"
              className="h-11 min-w-0 flex-1 bg-transparent px-2.5 text-[14px] text-ink outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="px-1 text-muted-foreground transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={scrollToResults}
              className="h-11 shrink-0 bg-brand px-5 text-[13px] font-bold text-white transition-colors hover:bg-[hsl(212_64%_20%)]"
            >
              Search
            </button>
          </div>

          {/* Popular chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Popular:</span>
            {POPULAR.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setQ(t); scrollToResults(); }}
                className="rounded-full border border-hairline bg-card px-2.5 py-1 text-[11.5px] font-medium text-ink transition-colors hover:bg-accent"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <Link
            href={`/blog/${featured.slug}/`}
            className="lift-card group relative flex flex-col justify-between overflow-hidden p-5 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full"
              style={{ background: "radial-gradient(closest-side, hsl(45 88% 60% / 0.18), transparent)" }}
            />
            <div className="relative">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[hsl(38_92%_38%)]"
                style={GOLD_PANEL}
              >
                ★ Featured guide
              </span>
              <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-ink sm:text-[1.4rem]">
                {featured.title}
              </h2>
              <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground line-clamp-3">
                {featured.excerpt}
              </p>
            </div>
            <div className="relative mt-4 flex items-center justify-between gap-3">
              <p className="text-[11.5px] font-medium text-muted-foreground">
                <time dateTime={featured.dateISO}>{featured.date}</time> · {featured.readMins} min read
              </p>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[12.5px] font-bold text-white">
                Read guide
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </span>
            </div>
          </Link>
        )}
      </section>

      {/* ── Category tabs (full width) ───────────────────────────────── */}
      <div className="mt-9 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TAB_ORDER.map((key) => {
          const meta = key === "all"
            ? { label: "All Guides", Icon: LayoutGrid }
            : CATS[key];
          const Icon = meta.Icon;
          const active = cat === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCat(key)}
              aria-pressed={active}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-hairline bg-card text-muted-foreground hover:bg-accent hover:text-ink"
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {meta.label}
              <span className={cn("text-xs", active ? "text-white/70" : "text-muted-foreground/70")}>
                {counts[key] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Grid (left) · sidebar (right) ────────────────────────────── */}
      <div ref={resultsRef} className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hairline-strong p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No guides match {q ? `“${q.trim()}”` : "that filter"}.
              </p>
              <button
                type="button"
                onClick={() => { setQ(""); setCat("all"); }}
                className="mt-3 text-[13px] font-semibold text-brand hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((p) => {
                const meta = p.category ? CATS[p.category] : null;
                const Icon = meta?.Icon ?? FileText;
                const tile = meta?.tile ?? "bg-brand-soft text-brand";
                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}/`}
                    className="lift-card group flex flex-col p-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tile)}>
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <p className="text-xs font-medium text-muted-foreground">
                        <time dateTime={p.dateISO}>{p.date}</time> · {p.readMins} min
                      </p>
                    </div>
                    <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand">
                      Read guide
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar — Tool CTA + Popular searches (rendered client-side from data) */}
        <aside className="flex flex-col gap-5">
          <div className="rounded-2xl border p-6" style={GOLD_PANEL}>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={GOLD_SOLID}>
              <Wrench className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="mt-3.5 text-[15px] font-bold leading-snug text-ink">
              Need to create your photo?
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Use our free tools to create, resize and compress photos &amp;
              signatures — 100% in your browser, nothing uploaded.
            </p>
            <Link
              href="/tools/"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-bold"
              style={GOLD_SOLID}
            >
              Explore tools
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Link>
          </div>

          <div className="rounded-2xl border border-hairline bg-card p-6">
            <h2 className="eyebrow text-ink">Popular searches</h2>
            <ul className="mt-3 divide-y divide-hairline">
              {popularSearches.map((s) => (
                <li key={s.href + s.label}>
                  <Link
                    href={s.href}
                    className="group flex items-center justify-between gap-2 py-2.5 text-[13px] font-medium text-ink transition-colors hover:text-brand"
                  >
                    {s.label}
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      strokeWidth={2}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
