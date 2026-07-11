/**
 * ComparisonTable — "easyPhoto vs Photo Studio"
 * Two-card visual comparison with VS badge, per-row feature details,
 * and bottom trust bar with CTA.
 */

import Link from "next/link";
import {
  IndianRupee, Clock, Car, RotateCcw, ShieldCheck,
  Layers, Globe, Lock, Sparkles, Zap, ArrowRight,
  Building2, Scan, Gift,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── types ─────────────────────────────────────────────────────── */

type ValueKind = "bad" | "cross" | "good" | "check" | "gold";

interface RowSide {
  sub:       string;
  primary:   string;
  secondary?: string;
  kind:      ValueKind;
}

interface CompRow {
  Icon:   LucideIcon;
  label:  string;
  studio: RowSide;
  easy:   RowSide;
}

interface TrustPoint {
  Icon:  LucideIcon;
  label: string;
  desc:  string;
}

/* ── data ───────────────────────────────────────────────────────── */

const ROWS: CompRow[] = [
  {
    Icon: IndianRupee,
    label: "Cost",
    studio: { sub: "You pay for each visit",            primary: "₹200 – ₹500", secondary: "per visit",      kind: "bad"   },
    easy:   { sub: "100% free to use",                  primary: "FREE",         secondary: "Always",         kind: "good"  },
  },
  {
    Icon: Clock,
    label: "Turnaround Time",
    studio: { sub: "You wait in queue",                 primary: "30 – 60",      secondary: "minutes",        kind: "bad"   },
    easy:   { sub: "Instant results",                   primary: "30",           secondary: "seconds",        kind: "good"  },
  },
  {
    Icon: Car,
    label: "Travel Required",
    studio: { sub: "Need to visit the studio",          primary: "Yes",          secondary: "Travel needed",  kind: "bad"   },
    easy:   { sub: "Create from the comfort of home",   primary: "No",           secondary: "From home",      kind: "good"  },
  },
  {
    Icon: RotateCcw,
    label: "Re-take / Retry",
    studio: { sub: "Extra charge for mistakes",         primary: "Yes",          secondary: "Pay again",      kind: "bad"   },
    easy:   { sub: "Unlimited re-takes",                primary: "Unlimited",    secondary: "Always free",    kind: "good"  },
  },
  {
    Icon: ShieldCheck,
    label: "Compliance Check",
    studio: { sub: "No spec check before printing",     primary: "✗",            kind: "cross" },
    easy:   { sub: "Checks run before you download",    primary: "✓",            kind: "check" },
  },
  {
    Icon: Layers,
    label: "Background Removal",
    studio: { sub: "May not be available",              primary: "✗",            kind: "cross" },
    easy:   { sub: "AI removes background instantly",   primary: "✓",            kind: "check" },
  },
  {
    Icon: Globe,
    label: "Country / Exam Specs",
    studio: { sub: "Limited or unknown",                primary: "Few",          secondary: "Limited",        kind: "bad"   },
    easy:   { sub: "26+ countries & all major exams",   primary: "26+",          secondary: "Countries",      kind: "gold"  },
  },
  {
    Icon: Lock,
    label: "Photo Privacy",
    studio: { sub: "Stored by studio",                  primary: "At Risk",      secondary: "Stored offline", kind: "bad"   },
    easy:   { sub: "Never uploaded. 100% private",      primary: "✓",            kind: "check" },
  },
];

const TRUST_POINTS: TrustPoint[] = [
  { Icon: Sparkles,    label: "AI-Powered Corrections",      desc: "AI helps fix size, lighting and framing automatically."          },
  { Icon: ShieldCheck, label: "Checked Against Published Specs", desc: "Every country & exam spec cites its published source."       },
  { Icon: Lock,        label: "Your Privacy First",        desc: "We process everything in your browser. No uploads."              },
  { Icon: Zap,         label: "Instant & Free",            desc: "From upload to download in under 30 seconds."                   },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;

/* ── value badge renderers ──────────────────────────────────────── */

function StudioValue({ v }: { v: RowSide }) {
  if (v.kind === "cross") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-[14px] font-bold leading-none text-red-500 dark:text-red-400">
        ✕
      </span>
    );
  }
  return (
    <div className="text-right">
      <p className="text-[13px] font-bold leading-tight text-red-600 dark:text-red-400">{v.primary}</p>
      {v.secondary && (
        <p className="mt-0.5 text-[11px] leading-tight text-red-400 dark:text-red-300">{v.secondary}</p>
      )}
    </div>
  );
}

function EasyValue({ v }: { v: RowSide }) {
  if (v.kind === "check") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-sm">
        ✓
      </span>
    );
  }
  const cls =
    v.kind === "gold" ? "text-cta" :
    v.kind === "good" ? "text-emerald-600 dark:text-emerald-400" :
    "text-ink";
  return (
    <div className="text-right">
      <p className={`text-[13px] font-bold leading-tight ${cls}`}>{v.primary}</p>
      {v.secondary && (
        <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{v.secondary}</p>
      )}
    </div>
  );
}

/* ── component ──────────────────────────────────────────────────── */

export function ComparisonTable() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container reveal py-14 sm:py-16">

        {/* ── heading ── */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-cta">
            ✦ Comparison ✦
          </p>
          <h2 className="text-[2rem] font-bold tracking-tight text-ink sm:text-[2.6rem]">
            easyPhoto{" "}
            <span className="font-medium text-muted-foreground">vs</span>{" "}
            Photo Studio
          </h2>
          <p className="mt-3 text-[14.5px] text-muted-foreground">
            See how easyPhoto compares with a studio visit for creating
            spec-checked document photos — without leaving home.
          </p>
        </div>

        {/* ── two-card comparison ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-0">

          {/* LEFT — Photo Studio (red / traditional) */}
          <div className="flex-1 rounded-2xl border border-hairline bg-card p-5">
            {/* Card header */}
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-red-500">
                <Building2 className="h-6 w-6 text-white" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-[17px] font-bold text-ink">Photo Studio</h3>
                <span className="mt-0.5 inline-block rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                  Traditional Way
                </span>
              </div>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-hairline">
              {ROWS.map(({ Icon, label, studio }) => (
                <li key={label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20">
                    <Icon className="h-[17px] w-[17px] text-rose-400 dark:text-rose-300" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold leading-tight text-ink">{label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{studio.sub}</p>
                  </div>
                  <div className="shrink-0">
                    <StudioValue v={studio} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* VS divider — desktop only */}
          <div className="hidden shrink-0 sm:flex sm:w-16 sm:items-center sm:justify-center">
            <div className="relative flex items-center justify-center">
              {/* Dashed lines connecting to each card */}
              <div
                className="absolute top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-200 dark:border-slate-700"
                style={{ left: "-12px", right: "50%", minWidth: 12 }}
                aria-hidden="true"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-200 dark:border-slate-700"
                style={{ left: "50%", right: "-12px", minWidth: 12 }}
                aria-hidden="true"
              />
              {/* VS badge */}
              <div
                className="relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-full text-[14px] font-black text-white shadow-lg ring-4 ring-paper"
                style={NAVY}
                aria-label="versus"
              >
                VS
              </div>
            </div>
          </div>

          {/* VS divider — mobile only (horizontal between stacked cards) */}
          <div className="flex items-center gap-3 sm:hidden">
            <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700" aria-hidden="true" />
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white shadow-md"
              style={NAVY}
              aria-label="versus"
            >
              VS
            </div>
            <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700" aria-hidden="true" />
          </div>

          {/* RIGHT — easyPhoto (green / smarter) */}
          <div className="flex-1 rounded-2xl border border-hairline bg-card p-5">
            {/* Card header */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
                style={NAVY}
              >
                <Scan className="h-6 w-6 text-cta" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-[17px] font-bold text-ink">easyPhoto</h3>
                <span className="mt-0.5 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  Smarter Way
                </span>
              </div>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-hairline">
              {ROWS.map(({ Icon, label, easy }) => (
                <li key={label} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <Icon className="h-[17px] w-[17px] text-emerald-400 dark:text-emerald-300" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold leading-tight text-ink">{label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{easy.sub}</p>
                  </div>
                  <div className="shrink-0">
                    <EasyValue v={easy} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── bottom trust bar + CTA ── */}
        <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-hairline bg-card p-5 sm:flex-row sm:items-center sm:gap-6">

          {/* 4 trust points */}
          <div className="grid flex-1 grid-cols-2 gap-4">
            {TRUST_POINTS.map(({ Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                  <Icon className="h-[18px] w-[18px] text-amber-500 dark:text-amber-400" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-ink">{label}</p>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <Link
              href="/passport-photo/"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-cta px-5 py-3 text-[13.5px] font-bold text-cta transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <Gift className="h-4 w-4" />
              Try easyPhoto for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-[11px] text-muted-foreground">
              No signup.&nbsp; No payment.&nbsp; Just spec-checked photos.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
