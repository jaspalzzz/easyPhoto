import { Cpu, CloudOff, UserX, ServerOff, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Item { Icon: LucideIcon; title: string; sub: string; }

const ITEMS: Item[] = [
  {
    Icon: Cpu,
    title: "Edited on your device",
    sub: "Cropping, background removal and compression run in your browser. Your photo is not sent to a server.",
  },
  {
    Icon: ServerOff,
    title: "Gone when you close the tab",
    sub: "Your photo is held only in the open tab. Closing or refreshing it clears the photo.",
  },
  {
    Icon: UserX,
    title: "No account",
    sub: "No sign-up, email or login. Open a tool and start.",
  },
  {
    Icon: CloudOff,
    title: "Counts, not content",
    sub: "We count page visits and tool use without cookies. The counts never include your photo or anything you type.",
  },
];

/* Deliberate dark band — privacy is the moat, so it gets the boldest section
   on the page. Navy + gold, matching the design language of the icon tiles. */
const NAVY = "hsl(222 60% 8%)";
const GOLD_TINT = { background: "hsl(45 88% 60% / 0.12)" } as const;
const BADGE = {
  background: "hsl(45 88% 60% / 0.10)",
  border: "1px solid hsl(45 88% 60% / 0.30)",
} as const;

export function DarkTrustStrip() {
  return (
    <section className="border-t border-hairline" style={{ background: NAVY }}>
      <div className="container reveal py-16 sm:py-20">

        {/* ── heading ── */}
        <div className="mb-10 max-w-2xl">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={BADGE}
          >
            <Lock className="h-3.5 w-3.5 text-cta" strokeWidth={2} />
            <span className="text-xs font-bold uppercase tracking-widest text-cta">
              Privacy is the product
            </span>
          </span>
          <h2 className="text-[30px] font-bold tracking-tight text-white sm:text-[36px]">
            Why your photos stay <span className="text-cta">private</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            A server-based editor sends documents away from your device. easyPhoto
            instead runs the editing steps inside your browser, so the selected
            photos and IDs are not uploaded to an easyPhoto server.
          </p>
        </div>

        {/* ── 4 privacy points ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={GOLD_TINT}
              >
                <Icon className="h-6 w-6 text-cta" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight text-white">{title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/55">{sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
