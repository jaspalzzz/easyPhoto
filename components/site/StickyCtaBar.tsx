"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

/**
 * StickyCtaBar — fixed mobile-only CTA bar that slides up from the bottom
 * after a short delay. Gives users a persistent action path after they scroll
 * past the hero CTA. Hidden on md+ screens (desktop already has inline CTAs).
 *
 * Safe-area padding handles iPhone home indicator and Android navigation bar.
 */
export function StickyCtaBar({
  href,
  label = "Open free tool",
  sublabel = "100% on-device · never uploaded",
}: {
  href: string;
  label?: string;
  sublabel?: string;
}) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-label="Quick access"
      className={[
        "fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 md:hidden",
        "transition-transform duration-500 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        background: "linear-gradient(to top, hsl(222 47% 9%), hsl(222 47% 9% / 0.9) 80%, transparent)",
      }}
    >
      <Link
        href={href}
        className="flex items-center justify-between gap-3 rounded-2xl bg-cta px-4 py-3 shadow-lg"
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold leading-tight text-cta-foreground">
            {label}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-cta-foreground/70">
            <ShieldCheck className="h-3 w-3 shrink-0" />
            {sublabel}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-cta-foreground" />
      </Link>
    </div>
  );
}
