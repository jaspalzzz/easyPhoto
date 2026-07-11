/**
 * AiShowcase — "AI Perfects Every Detail"
 * 3-card comparison (selfie → AI engine → compliant) + 4-step flow bar
 * Adapted from design template; palette: site tokens + semantic red/amber/emerald
 */

import { Fragment } from "react";
import Image from "next/image";
import {
  User,
  Focus,
  Eye,
  Sun,
  Maximize2,
  Aperture,
  ShieldCheck,
  Lock,
  Zap,
  Tag,
  Download,
  Upload,
  Cpu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── data ─────────────────────────────────────────────────────────────── */

const BEFORE_ISSUES = [
  { n: 1, title: "Busy Background",    desc: "Background not plain"   },
  { n: 2, title: "Uneven Lighting",    desc: "Shadows on face"        },
  { n: 3, title: "Face Not Centered",  desc: "Not aligned properly"   },
  { n: 4, title: "Wrong Size & Ratio", desc: "Incorrect crop & ratio" },
];

/* HUD scan-line positions (%) for the selfie overlay */
const HUD_TOPS = [22, 40, 62, 80] as const;

interface AiCheck { label: string; tileBg: string; tileText: string; Icon: LucideIcon; }
const AI_CHECKS: AiCheck[] = [
  { label: "Head Size",     tileBg: "bg-blue-50 dark:bg-blue-900/30",     tileText: "text-blue-500 dark:text-blue-400",     Icon: User      },
  { label: "Background",    tileBg: "bg-purple-50 dark:bg-purple-900/30", tileText: "text-purple-500 dark:text-purple-400", Icon: Focus     },
  { label: "Face Centered", tileBg: "bg-sky-50 dark:bg-sky-900/30",       tileText: "text-sky-500 dark:text-sky-400",       Icon: Eye       },
  { label: "Eye Position",  tileBg: "bg-indigo-50 dark:bg-indigo-900/30", tileText: "text-indigo-500 dark:text-indigo-400", Icon: Eye       },
  { label: "Lighting",      tileBg: "bg-amber-50 dark:bg-amber-900/30",   tileText: "text-amber-600 dark:text-amber-400",   Icon: Sun       },
  { label: "Dimensions",    tileBg: "bg-orange-50 dark:bg-orange-900/30", tileText: "text-orange-500 dark:text-orange-400", Icon: Maximize2 },
  { label: "Image Quality", tileBg: "bg-pink-50 dark:bg-pink-900/30",     tileText: "text-pink-500 dark:text-pink-400",     Icon: Aperture  },
];

const MINI_STEPS = ["Scanning", "Analyzing", "Validating", "Optimizing"] as const;

interface FlowStep { n: number; title: string; desc: string; Icon: LucideIcon; }
const FLOW_STEPS: FlowStep[] = [
  { n: 1, title: "Upload",              desc: "Upload your selfie from any device",                    Icon: Upload     },
  { n: 2, title: "AI Analyzes",         desc: "Our AI measures your photo against the published spec",  Icon: Cpu        },
  { n: 3, title: "Checks Complete",     desc: "Helps identify common rejection risks before you submit", Icon: ShieldCheck },
  { n: 4, title: "Download",            desc: "Get your perfect photo in seconds",                     Icon: Download   },
];

const TRUST_PILLS = [
  { label: "Secure",  Icon: Lock,       cls: "text-blue-500"    },
  { label: "Private", Icon: ShieldCheck, cls: "text-emerald-500" },
  { label: "Instant", Icon: Zap,        cls: "text-amber-500"   },
  { label: "Free",    Icon: Tag,        cls: "text-pink-500"    },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;
const GOLD_BADGE = { background: "hsl(45 88% 60%)", color: "hsl(222 60% 8%)" } as const;

/* ── sub-components ──────────────────────────────────────────────────── */

/** Amber right-pointing arrow (selfie → AI) */
function AmberArrow() {
  return (
    <svg width="32" height="20" viewBox="0 0 40 20" fill="none" aria-hidden="true">
      <path d="M2 10H30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 5L36 10L24 15" stroke="#f59e0b" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Emerald right-pointing arrow (AI → compliant) */
function EmeraldArrow() {
  return (
    <svg width="32" height="20" viewBox="0 0 40 20" fill="none" aria-hidden="true">
      <path d="M2 10H30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 5L36 10L24 15" stroke="#10b981" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── main component ───────────────────────────────────────────────────── */

export function AiShowcase() {
  return (
    <section className="border-t border-hairline bg-card">
      <div className="container reveal py-14 sm:py-16">

        {/* ── heading ── */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            AI Photo Perfection
          </p>
          <h2 className="text-[2rem] font-bold tracking-tight text-ink sm:text-[2.6rem]">
            <span className="text-cta">AI</span> Perfects Every Detail
          </h2>
          <p className="mt-3 text-[14.5px] text-muted-foreground">
            From any selfie to a photo checked against published requirements — in seconds
          </p>
        </div>

        {/* ── 3-panel comparison ──────────────────────────────────────── */}
        {/* Mobile → flex-col; Desktop → flex-row with arrows */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">

          {/* ── LEFT — Your Selfie ── */}
          <div className="flex flex-1 flex-col rounded-2xl border-2 border-red-100 dark:border-red-800/30 bg-card p-5 shadow-[0_4px_28px_rgba(239,68,68,0.06)]">

            {/* card header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#ef4444" strokeWidth="3" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
                <h3 className="text-[15px] font-bold text-ink">Your Selfie</h3>
              </div>
              <span className="rounded-full bg-red-50 dark:bg-red-900/20 px-3 py-1 text-[10px] font-bold text-red-700 dark:text-red-300">
                Needs Improvement
              </span>
            </div>

            {/* Selfie with HUD scan-line overlay */}
            <div className="mb-5 flex items-center justify-center rounded-xl border border-hairline bg-paper py-5">
              <div className="relative h-[150px] w-[110px] sm:h-[190px] sm:w-[140px]">
                <Image
                  src="/images/sample2_before_1782052888740.webp"
                  alt="Example selfie before AI processing"
                  fill
                  sizes="140px"
                  className="rounded-xl object-cover object-top"
                />
                {/* Dotted red scan lines + numbered circles */}
                {HUD_TOPS.map((top, i) => (
                  <div
                    key={i}
                    className="pointer-events-none absolute left-0 w-full"
                    style={{ top: `${top}%` }}
                  >
                    <div className="w-full border-t border-dashed border-red-400 opacity-60" />
                    <span
                      className="absolute -right-5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues list — space-between rows */}
            <ul className="mt-auto flex flex-col gap-3">
              {BEFORE_ISSUES.map(({ n, title, desc }) => (
                <li key={n} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-[10px] font-bold text-red-500">
                      {n}
                    </span>
                    <span className="text-[12.5px] font-bold text-red-500">{title}</span>
                  </div>
                  <span className="text-[11.5px] text-muted-foreground">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── ARROW 1 — amber, desktop only ── */}
          <div className="hidden shrink-0 items-center justify-center lg:flex">
            <AmberArrow />
          </div>

          {/* ── MIDDLE — AI Compliance Engine ── */}
          <div className="flex flex-[1.2] flex-col rounded-2xl border-2 border-amber-100 dark:border-amber-800/30 bg-card p-5 shadow-[0_8px_36px_rgba(0,0,0,0.05)]">

            {/* card header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-black text-white">
                  AI
                </span>
                <h3 className="text-[15px] font-bold text-ink">AI Compliance Engine</h3>
              </div>
              <span className="rounded-full border border-amber-100 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                Analyzing…
              </span>
            </div>

            {/* Circular gauge + checks (side by side) */}
            <div className="mb-4 flex items-center gap-4">

              {/* Circular SVG gauge */}
              <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
                <svg width="128" height="128" viewBox="0 0 150 150" aria-hidden="true">
                  {/* Track */}
                  <circle cx="75" cy="75" r="62" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                  {/* Inner dashed ring */}
                  <circle cx="75" cy="75" r="54" fill="none" stroke="#e2e8f0"
                    strokeWidth="1" strokeDasharray="4,3" />
                  {/* Progress arc — amber, full ring: all 7 itemized checks pass */}
                  <circle cx="75" cy="75" r="62" fill="none"
                    stroke="#f59e0b" strokeWidth="6"
                    strokeDasharray="390" strokeDashoffset="0"
                    strokeLinecap="round" transform="rotate(-90 75 75)" />
                </svg>
                {/* Centered text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[1.5rem] font-black leading-none text-emerald-500">7/7</span>
                  <span className="mt-0.5 text-center text-[8px] font-semibold leading-tight text-muted-foreground">
                    Checks<br />Passed
                  </span>
                  <span className="mt-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                    All Pass
                  </span>
                </div>
              </div>

              {/* Checks table */}
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex justify-between border-b border-hairline pb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Check</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Status</span>
                </div>
                <ul className="flex flex-col gap-[5px]">
                  {AI_CHECKS.map(({ label, tileBg, tileText, Icon }) => (
                    <li key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${tileBg}`}>
                          <Icon className={`h-2.5 w-2.5 ${tileText}`} strokeWidth={2.5} />
                        </span>
                        <span className="text-[11px] font-semibold text-ink">{label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-emerald-500">Pass</span>
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[7px] font-bold text-white">
                          ✓
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Check-results banner */}
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-100 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20 px-3 py-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={2} />
              <div>
                <p className="text-[12px] font-bold text-ink">All Measurable Checks Pass</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  Measured against the published specs for passport, visa, ID &amp; more.
                </p>
              </div>
            </div>

            {/* Mini stepper: Scanning → Analyzing → Validating → Optimizing */}
            <div className="mt-auto hidden sm:flex items-start">
              {MINI_STEPS.map((label, i) => (
                <div key={label} className="relative flex flex-1 flex-col items-center">
                  {/* Connector — left half (not for first item) */}
                  {i > 0 && (
                    <div
                      className="absolute border-t-2 border-amber-400"
                      style={{ top: 10, left: 0, right: "50%" }}
                    />
                  )}
                  {/* Connector — right half (not for last item) */}
                  {i < MINI_STEPS.length - 1 && (
                    <div
                      className="absolute border-t-2 border-amber-400"
                      style={{ top: 10, left: "50%", right: 0 }}
                    />
                  )}
                  {/* Circle */}
                  <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white">
                    ✓
                  </div>
                  <span className="mt-1 whitespace-nowrap text-[9px] font-bold text-ink">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ARROW 2 — emerald, desktop only ── */}
          <div className="hidden shrink-0 items-center justify-center lg:flex">
            <EmeraldArrow />
          </div>

          {/* ── RIGHT — Compliant Photo ── */}
          <div className="flex flex-1 flex-col rounded-2xl border-2 border-emerald-100 dark:border-emerald-800/30 bg-card p-5 shadow-[0_4px_28px_rgba(16,185,129,0.06)]">

            {/* card header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#10b981" strokeWidth="3" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <h3 className="text-[15px] font-bold text-ink">Compliant Photo</h3>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                No Detectable Issues
              </span>
            </div>

            {/* Compliant photo with dimension indicators */}
            <div className="mb-4 flex items-center justify-center rounded-xl border border-hairline bg-paper py-6">
              {/*
                Outer wrapper provides space for the dimension indicators:
                  paddingRight  = space for the vertical "45 mm" ruler
                  paddingBottom = space for the horizontal "35 mm" ruler
              */}
              <div className="relative" style={{ paddingRight: 36, paddingBottom: 28 }}>

                {/* Photo frame with green dashed border overlay */}
                <div
                  className="relative overflow-hidden rounded-xl border border-hairline shadow-sm"
                  style={{ width: 128, height: 170 }}
                >
                  {/* Green dashed compliance border */}
                  <div className="absolute inset-0 z-10 rounded-xl border-2 border-dashed border-emerald-400 pointer-events-none" />
                  <Image
                    src="/images/sample2_after_1782052904856.webp"
                    alt="AI-corrected government-compliant passport photo"
                    fill
                    sizes="128px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Width indicator — 35 mm (below the photo) */}
                <div
                  className="absolute left-0 hidden sm:flex items-center gap-1"
                  style={{ bottom: 8, right: 36 }}
                >
                  <div className="flex-1 border-t-2 border-dashed border-emerald-400" />
                  <span className="shrink-0 text-[9px] font-bold text-emerald-600">35 mm</span>
                  <div className="flex-1 border-t-2 border-dashed border-emerald-400" />
                </div>

                {/* Height indicator — 45 mm (to the right of the photo) */}
                <div
                  className="absolute inset-y-0 hidden sm:flex flex-col items-center gap-1"
                  style={{ right: 4 }}
                >
                  <div className="flex-1 border-r-2 border-dashed border-emerald-400" />
                  <span
                    className="shrink-0 text-[9px] font-bold text-emerald-600"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    45 mm
                  </span>
                  <div className="flex-1 border-r-2 border-dashed border-emerald-400" />
                </div>

              </div>
            </div>

            {/* Compliance banner */}
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              <div>
                <p className="text-[12px] font-bold text-ink">Checked Against Published Requirements</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  Prepared for the published requirements of passport, visa, OCI and ID documents.
                </p>
              </div>
            </div>

            {/* Trust pills */}
            <div className="mt-auto grid grid-cols-4 gap-1.5">
              {TRUST_PILLS.map(({ label, Icon, cls }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-1 rounded-lg border border-hairline bg-paper py-2"
                >
                  <Icon className={`h-3.5 w-3.5 ${cls}`} strokeWidth={2} />
                  <span className="text-[10px] font-semibold text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── 4-step flow bar ─────────────────────────────────────────── */}
        <div className="mt-5 rounded-2xl border border-hairline bg-card px-6 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            {FLOW_STEPS.flatMap(({ n, title, desc, Icon }, i) => [

              /* Step item */
              <div key={title} className="flex items-start gap-3 lg:flex-1">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={NAVY}
                >
                  <Icon className="h-5 w-5 text-cta" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span
                      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={GOLD_BADGE}
                    >
                      {n}
                    </span>
                    <h4 className="text-[13px] font-bold text-ink">{title}</h4>
                  </div>
                  <p className="text-[11.5px] leading-snug text-muted-foreground">{desc}</p>
                </div>
              </div>,

              /* Connector (not after the last step) */
              i < FLOW_STEPS.length - 1 ? (
                <div key={`sep-${i}`} className="hidden shrink-0 items-center gap-1.5 lg:flex">
                  <div className="w-6 border-t border-dashed border-hairline-strong" />
                  <span className="text-[14px] font-bold text-muted-foreground">›</span>
                </div>
              ) : null,

            ])}
          </div>
        </div>

      </div>
    </section>
  );
}
