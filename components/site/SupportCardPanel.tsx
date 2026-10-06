"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  SUPPORT_AMOUNTS,
  buildUpiLink,
  markSupportTapped,
  type SupportAmount,
  type SupportConfig,
  type SupportVariant,
} from "@/lib/supportCard";

const QR_SIZE_PX = 128;

export interface SupportCardPanelProps {
  config: SupportConfig;
  variant: SupportVariant;
  tool?: string;
  className?: string;
  onDismiss: () => void;
}

/**
 * The visible "Support easyPhoto" card (owner-approved design B and copy,
 * 6 Oct 2026). Loaded on demand by SupportCard. A level-3 `.support` surface:
 * it recedes behind the tool. It does not take focus or announce itself — it
 * is an offer, not an alert.
 */
export function SupportCardPanel({ config, variant, tool, className, onDismiss }: SupportCardPanelProps) {
  const headingId = React.useId();

  const onAmount = (amount: SupportAmount) => {
    markSupportTapped();
    track({ name: "support_tap", tool, amount });
  };

  return (
    <div
      role="region"
      aria-labelledby={headingId}
      className={cn("ep-fade-in support rounded-xl border p-4", className)}
    >
      <h2 id={headingId} className="text-base font-semibold text-ink">
        Saved you a cyber-café trip?
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        easyPhoto is free, private and runs on your device. A small UPI tip keeps it that way.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {variant === "deeplink" ? (
          <ul className="flex flex-wrap gap-2.5">
            {SUPPORT_AMOUNTS.map((amount) => (
              <li key={amount}>
                <a
                  href={buildUpiLink(config, amount)}
                  onClick={() => onAmount(amount)}
                  aria-label={`Support easyPhoto with ₹${amount} via UPI`}
                  className={buttonVariants({ variant: "cta", className: "min-h-11 px-4 font-semibold" })}
                >
                  ₹{amount}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3">
            {/* A static same-origin file from public/; next/image adds nothing
                here (images are unoptimized in the static export). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.qrSrc ?? ""}
              alt="UPI QR code to support easyPhoto"
              width={QR_SIZE_PX}
              height={QR_SIZE_PX}
              className="h-32 w-32 shrink-0 rounded-md bg-white p-1.5"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              On a computer? Scan the QR with any UPI app.
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto min-h-11 rounded-md px-2 text-sm text-muted-foreground underline underline-offset-4 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
