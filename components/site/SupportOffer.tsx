"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  buildUpiLink,
  markSupportTapped,
  type SupportConfig,
  type SupportMethod,
  type SupportVariant,
} from "@/lib/supportCard";

const QR_SIZE_PX = 160;

export interface SupportOfferProps {
  config: SupportConfig;
  variant: SupportVariant;
  tool?: string;
  /** Called once a tap has been recorded, after the click has finished. */
  onTapped: () => void;
  /** "dialog" centres the QR under the text on desktop; "inline" keeps it beside. */
  layout: "dialog" | "inline";
}

/**
 * The tip ask itself — the owner-approved body copy (option 1, 7 Oct 2026),
 * one "Help keep it free" button (any amount) and the line saying what happens
 * next. Shared by the post-download pop-up (SupportCardPanel) and the card
 * that stays under the Download button (SupportInline), so the two never drift.
 */
export function SupportOffer({ config, variant, tool, onTapped, layout }: SupportOfferProps) {
  const onTip = (method: SupportMethod) => {
    markSupportTapped();
    track({ name: "support_tap", tool, method });
    // After the click has finished, so the link's own navigation (the UPI
    // app, or Razorpay in a new tab) is never cancelled by an unmount.
    window.setTimeout(onTapped, 0);
  };

  const tipClass = buttonVariants({
    variant: "cta",
    className: "min-h-12 w-full px-6 text-base font-semibold md:w-auto",
  });

  return (
    <>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
        easyPhoto is free for everyone, and your photos never leave your device. If it saved you
        a trip to the cyber café, a small tip helps keep it free for the next person filling a form.
      </p>

      <div className="mt-4">
        {variant === "deeplink" && config.upi ? (
          <>
            <a
              href={buildUpiLink(config.upi)}
              onClick={() => onTip("upi")}
              aria-label="Help keep it free: opens your UPI app, where you choose the amount"
              className={tipClass}
            >
              Help keep it free
            </a>
            <p className="mt-2 text-xs text-muted-foreground">Opens your UPI app. You choose the amount.</p>
          </>
        ) : variant === "link" && config.link ? (
          <>
            {/* The payment page opens in a new tab so the user's tool and
                file stay put; noopener keeps the two pages independent. */}
            <a
              href={config.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTip("link")}
              aria-label="Help keep it free: opens Razorpay in a new tab, where you choose the amount"
              className={tipClass}
            >
              Help keep it free
            </a>
            <p className="mt-2 text-xs text-muted-foreground">You choose the amount on the next screen.</p>
          </>
        ) : (
          <div className={cn("flex items-center gap-3", layout === "dialog" && "md:flex-col")}>
            {/* A static same-origin file from public/; next/image adds nothing
                here (images are unoptimized in the static export). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.qrSrc ?? ""}
              alt="UPI QR code to support easyPhoto"
              width={QR_SIZE_PX}
              height={QR_SIZE_PX}
              className="h-40 w-40 shrink-0 rounded-md bg-white p-1.5"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Scan with any UPI app on your phone. You choose the amount.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
