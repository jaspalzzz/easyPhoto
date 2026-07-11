import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Lock, Zap, Users,
  AlertTriangle, User, ImageOff, Sun, Focus, Maximize2, EyeOff,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── data ─────────────────────────────────────────────────────────────── */

interface Reason { Icon: LucideIcon; label: string; detail: string; }
const REASONS: Reason[] = [
  { Icon: User,      label: "Wrong head size",      detail: "Head too small or too large for the required frame"  },
  { Icon: ImageOff,  label: "Incorrect background",  detail: "Non-white, patterned or busy background"             },
  { Icon: Sun,       label: "Poor lighting",          detail: "Shadows on face or uneven illumination"              },
  { Icon: Focus,     label: "Face not centered",      detail: "Face not properly aligned in the frame"             },
  { Icon: Maximize2, label: "Wrong dimensions",       detail: "Photo size or aspect ratio doesn't match"           },
  { Icon: EyeOff,    label: "Eyes not visible",       detail: "Eyes covered, closed or hair/glare blocking eyes"   },
];

const AI_CHECKS = [
  "Checking head size & framing",
  "Verifying background",
  "Analyzing lighting & clarity",
  "Validating dimensions",
  "Checking face position",
  "Ensuring eyes visibility",
];

const RESULTS = [
  { attr: "Head size",      val: "Correct"  },
  { attr: "Background",    val: "White"    },
  { attr: "Lighting",      val: "Good"     },
  { attr: "Dimensions",    val: "Valid"    },
  { attr: "Face position", val: "Centered" },
  { attr: "Eyes visible",  val: "Yes"      },
];

interface TrustItem { Icon: LucideIcon; title: string; sub: string; }
const TRUST_ITEMS: TrustItem[] = [
  { Icon: ShieldCheck, title: "Spec-Checked",      sub: "Passes all measurable checks"          },
  { Icon: Lock,        title: "100% Private",      sub: "Your photos never leave your device"   },
  { Icon: Zap,         title: "Instant Results",   sub: "Get compliant photos in seconds"       },
  { Icon: Users,       title: "No Account Needed", sub: "Free to use — no signup, no watermark" },
];

const NAVY = { background: "hsl(222 60% 8%)" } as const;
/* gold = hsl(45 88% 60%) ≈ rgb(243,198,63) */
const GOLD = "#F3C63F";

/* ── arrow SVGs ───────────────────────────────────────────────────────── */

function RedArrow() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <line x1="4" y1="22" x2="32" y2="22" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M29 17L40 22L29 27" stroke="#ef4444" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function GoldArrow() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <line x1="4" y1="22" x2="32" y2="22" stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M29 17L40 22L29 27" stroke={GOLD} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── component ────────────────────────────────────────────────────────── */

export function WhyRejected() {
  return (
    <section className="border-t border-hairline bg-paper">
      <div className="container reveal py-14 sm:py-16">

        {/* ── heading ── */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Common Mistakes
          </p>
          <h2 className="text-[2rem] font-bold tracking-tight text-ink sm:text-[2.6rem]">
            Why photos get{" "}
            <span className="text-cta">rejected</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
            Most applications get rejected due to these common mistakes.
            easyPhoto automatically fixes them for you.
          </p>
        </div>

        {/* ── 5-col layout: panel | arrow | panel | arrow | panel ── */}
        {/*
            On mobile  → grid-cols-1, arrows hidden → 3 panels stack.
            On desktop → 5 explicit columns; arrows occupy their own 44 px slot.
        */}
        <div className="grid gap-y-4 lg:grid-cols-[1fr_44px_1.3fr_44px_1fr]">

          {/* ── LEFT — rejection reasons ── */}
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-[15px] w-[15px] text-red-500" strokeWidth={2} />
              <h3 className="text-[13px] font-bold text-red-500">Common reasons for rejection</h3>
            </div>
            <div className="flex flex-1 flex-col divide-y divide-hairline">
              {REASONS.map(({ Icon, label, detail }) => (
                <div key={label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-100 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20">
                    <Icon className="h-[18px] w-[18px] text-red-500 dark:text-red-400" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{label}</p>
                    <p className="mt-0.5 hidden text-[11.5px] leading-snug text-muted-foreground sm:block">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ARROW 1: rejection → AI (red dashed) ── */}
          <div className="hidden items-center justify-center lg:flex">
            <RedArrow />
          </div>

          {/* ── MIDDLE — AI compliance analysis ── */}
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-[15px] w-[15px] text-cta" strokeWidth={2} />
              <h3 className="text-[13px] font-bold text-brand">AI Compliance Analysis</h3>
            </div>

            {/* AI chip — dark navy + gold, sized to fill the mid-section */}
            <div className="relative mx-auto flex h-[200px] w-[200px] flex-shrink-0 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border border-brand/10" />
              <div className="absolute h-[155px] w-[155px] rounded-full border border-brand/15" />
              <div className="absolute h-[115px] w-[115px] rounded-full border border-brand/20" />
              <div
                className="relative z-10 flex h-[90px] w-[90px] flex-col items-center justify-center gap-1.5 rounded-[20px] shadow-xl"
                style={NAVY}
              >
                <span className="text-[1.7rem] font-black leading-none tracking-tight text-cta">AI</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-white/30" />
                  ))}
                </div>
              </div>
            </div>

            {/* Check items — fill remaining height */}
            <div className="mt-4 flex flex-1 flex-col justify-between">
              {AI_CHECKS.map((check) => (
                <div key={check} className="flex items-center gap-2.5 py-1">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cta" strokeWidth={2} />
                  <span className="flex-1 text-[12.5px] text-ink">{check}</span>
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10.5px] font-bold text-brand">
                    Pass
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ARROW 2: AI → compliant (gold dashed) ── */}
          <div className="hidden items-center justify-center lg:flex">
            <GoldArrow />
          </div>

          {/* ── RIGHT — compliant photo + check results ── */}
          <div className="flex h-full flex-col gap-4">

            {/* Photo card */}
            <div className="rounded-2xl border border-hairline bg-card p-4">
              <div className="mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-[15px] w-[15px] text-cta" strokeWidth={2} />
                <h3 className="text-[13px] font-semibold text-brand">
                  Compliant photo
                  <span className="ml-1 font-medium text-muted-foreground">(No detectable issues)</span>
                </h3>
              </div>
              <div className="flex justify-center">
                <div className="w-[140px] overflow-hidden rounded-xl border border-hairline">
                  <Image
                    src="/images/sample6_after_1782053037309.webp"
                    alt="Sample AI-corrected passport photo that passes the listed checks"
                    width={140}
                    height={187}
                    className="h-[187px] w-[140px] object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Check-results card — grows to fill remaining height */}
            <div className="flex flex-1 flex-col rounded-2xl border border-hairline bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl"
                  style={NAVY}
                >
                  <ShieldCheck className="h-7 w-7 text-cta" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[2.2rem] font-black leading-none tracking-tight text-ink">6/6</p>
                  <p className="text-[12.5px] font-bold text-ink">Checks Passed</p>
                  <p className="text-[11px] text-muted-foreground">No detectable issues found</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {RESULTS.map(({ attr, val }) => (
                  <div key={attr} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-cta">✓</span>
                      <span className="text-[11.5px] text-muted-foreground">{attr}</span>
                    </div>
                    <span className="text-[11.5px] font-bold text-brand">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── trust strip + CTA ── */}
        <div className="mt-5 flex flex-col items-center gap-5 rounded-2xl border border-amber-100 dark:border-amber-800/30 bg-amber-50/40 dark:bg-amber-900/10 p-6 sm:flex-row sm:gap-8">
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST_ITEMS.map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-2.5">
                <Icon className="h-5 w-5 shrink-0 text-cta" strokeWidth={1.75} />
                <div>
                  <p className="text-[12.5px] font-bold text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <Link
              href="/passport-photo/"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[14.5px] font-bold transition-opacity hover:opacity-90"
              style={{ background: "hsl(var(--cta))", color: "hsl(222 60% 8%)" }}
            >
              Try it free <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-[11px] text-muted-foreground">
              No signup&nbsp;•&nbsp;No uploads&nbsp;•&nbsp;100% Free
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
